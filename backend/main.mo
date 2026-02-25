import List "mo:core/List";
import Map "mo:core/Map";
import Text "mo:core/Text";
import Iter "mo:core/Iter";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";
import Order "mo:core/Order";
import Nat "mo:core/Nat";
import Principal "mo:core/Principal";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";
import MixinStorage "blob-storage/Mixin";

actor {
  // Include storage component for general uploads
  include MixinStorage();

  // Access control state
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // User Profile
  public type UserProfile = {
    name : Text;
    email : Text;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can get their profile");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Product Data
  public type Product = {
    id : Text;
    name : Text;
    imageUrl : Text;
    price : Nat;
    mrp : Nat;
    description : Text;
    keyFeatures : [Text];
    codAvailable : Bool;
  };

  module Product {
    public type SortField = {
      #priceAscending;
      #priceDescending;
    };

    // Default comparison (also works for sorting by id)
    public func compare(product1 : Product, product2 : Product) : Order.Order {
      Text.compare(product1.id, product2.id);
    };

    public func compareByPriceAscending(product1 : Product, product2 : Product) : Order.Order {
      switch (Nat.compare(product1.price, product2.price)) {
        case (#equal) { compare(product1, product2) };
        case (order) { order };
      };
    };

    public func compareByPriceDescending(product1 : Product, product2 : Product) : Order.Order {
      switch (Nat.compare(product2.price, product1.price)) {
        case (#equal) { compare(product1, product2) };
        case (order) { order };
      };
    };
  };

  // Order Data
  public type AppOrder = {
    id : Text;
    userId : Principal;
    items : [OrderItem];
    totalAmount : Nat;
    paymentMethod : Text;
    address : Text;
    timestamp : Time.Time;
  };

  public type OrderItem = {
    productId : Text;
    quantity : Nat;
  };

  // Seeded ZENTEK Products
  let productList = List.empty<Product>();
  let productMap = Map.empty<Text, Product>();

  func addProduct(product : Product) {
    productList.add(product);
    productMap.add(product.id, product);
  };

  addProduct({
    id = "1";
    name = "ZENTEK Solar Power Bank";
    imageUrl = "/images/solar_power_bank.jpg";
    price = 2999;
    mrp = 3999;
    description = "Portable solar power bank for charging devices";
    keyFeatures = ["Solar charging", "Dual USB ports", "LED flashlight"];
    codAvailable = true;
  });

  addProduct({
    id = "2";
    name = "ZENTEK UV Water Purifier";
    imageUrl = "/images/uv_water_purifier.jpg";
    price = 4999;
    mrp = 5999;
    description = "UV water purifier with advanced filtration";
    keyFeatures = ["UV purification", "Multiple filter stages", "Easy installation"];
    codAvailable = true;
  });

  addProduct({
    id = "3";
    name = "ZENTEK Eco-Friendly LED Bulbs";
    imageUrl = "/images/led_bulbs.jpg";
    price = 799;
    mrp = 999;
    description = "Set of 4 eco-friendly LED bulbs";
    keyFeatures = [
      "Low energy consumption",
      "Long lifespan",
      "Warm/cool light options",
    ];
    codAvailable = true;
  });

  addProduct({
    id = "4";
    name = "ZENTEK Smart Thermostat";
    imageUrl = "/images/smart_thermostat.jpg";
    price = 7999;
    mrp = 8999;
    description = "Wi-Fi enabled smart thermostat";
    keyFeatures = ["Remote control", "Energy saving", "Easy installation"];
    codAvailable = false;
  });

  addProduct({
    id = "5";
    name = "ZENTEK Reusable Water Bottles";
    imageUrl = "/images/water_bottles.jpg";
    price = 499;
    mrp = 599;
    description = "Set of 2 reusable water bottles";
    keyFeatures = ["BPA-free", "Leak-proof", "Dishwasher safe"];
    codAvailable = true;
  });

  // getProducts is public - guests can browse the catalog
  public query ({ caller }) func getProducts(
    search : ?Text,
    limit : ?Nat,
    offset : ?Nat,
    sort : ?Product.SortField,
  ) : async [Product] {
    var products : Iter.Iter<Product> = productList.values();

    // Search filter
    switch (search) {
      case (?searchText) {
        let lowerSearch = searchText.toLower();
        products := products.filter(
          func(product) {
            product.name.toLower().contains(#text lowerSearch) or product.description.toLower().contains(#text lowerSearch);
          }
        );
      };
      case (null) {};
    };

    // Sorting
    switch (sort) {
      case (?sortField) {
        let sortedArray = products.toArray();
        products := switch (sortField) {
          case (#priceAscending) {
            sortedArray.sort(Product.compareByPriceAscending).values();
          };
          case (#priceDescending) {
            sortedArray.sort(Product.compareByPriceDescending).values();
          };
        };
      };
      case (null) {};
    };

    // Pagination
    let skip = switch (offset) { case (?o) { o }; case (null) { 0 } };
    let take = switch (limit) { case (?l) { l }; case (null) { 20 } };

    products.drop(skip).take(take).toArray();
  };

  // getProduct is public - guests can view product details
  public query ({ caller }) func getProduct(id : Text) : async Product {
    switch (productMap.get(id)) {
      case (null) { Runtime.trap("Product not found") };
      case (?product) { product };
    };
  };

  // Orders Storage
  let orderMap = Map.empty<Text, AppOrder>();
  let userOrdersMap = Map.empty<Principal, List.List<Text>>();

  // createOrder requires authenticated user role
  public shared ({ caller }) func createOrder(
    items : [OrderItem],
    paymentMethod : Text,
    address : Text,
  ) : async AppOrder {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can create orders");
    };

    let totalAmount = items.foldLeft(
      0,
      func(acc, item) {
        switch (productMap.get(item.productId)) {
          case (null) { acc };
          case (?product) { acc + (product.price * item.quantity) };
        };
      },
    );

    let orderId = (orderMap.size() + 1).toText();
    let newOrder : AppOrder = {
      id = orderId;
      userId = caller;
      items;
      totalAmount;
      paymentMethod;
      address;
      timestamp = Time.now();
    };

    orderMap.add(orderId, newOrder);

    let existingOrders = switch (userOrdersMap.get(caller)) {
      case (?orders) { orders };
      case (null) { List.empty<Text>() };
    };
    existingOrders.add(orderId);
    userOrdersMap.add(caller, existingOrders);

    newOrder;
  };

  // getMyOrders requires authenticated user role
  public query ({ caller }) func getMyOrders() : async [AppOrder] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view their orders");
    };

    let orderIds = switch (userOrdersMap.get(caller)) {
      case (?orders) { orders };
      case (null) { List.empty<Text>() };
    };

    let orders = List.empty<AppOrder>();
    for (id in orderIds.values()) {
      switch (orderMap.get(id)) {
        case (?order) { orders.add(order) };
        case (null) {};
      };
    };

    orders.toArray();
  };
};
