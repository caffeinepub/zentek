# Specification

## Summary
**Goal:** Build ZENTEK, an AJIO-style Indian e-commerce website selling 5 tech products, with a full shopping experience including product listing, cart, wishlist, checkout, auth, and order history — powered by a Motoko backend actor.

**Planned changes:**

### Theme & Layout
- AJIO-inspired UI: white background, bold dark typography, red (#E63946) accent for CTAs and badges
- Top offer strip: "Free Delivery above ₹999 | COD Available"
- Consistent header: ZENTEK logo (left), centered search bar (UI-only), Wishlist ❤️ / Cart 🛒 / Login icons (right)

### Homepage
- Hero banner carousel with 3 slides: "ZENTEK MEGA SALE – Up to 60% Off", "Tech Essentials for Students", "Bank Offer – 10% Instant Discount on HDFC Cards"
- Bank offer strip below carousel
- Product grid displaying all 5 products
- Footer with Customer Care, Returns, Privacy Policy, and Contact sections
- No Men/Women category navigation

### Product Data (hardcoded frontend + seeded backend)
- 5 products: AuraBuds Pro, NightDock, SnapGrip, HyperKey, LumiCam
- Each with: name, image URL (provided links), price, MRP, description, key features, COD flag

### Product Card
- Image, name, price (₹), strikethrough MRP, calculated % discount, "Free Delivery" text, "COD Available" badge, togglable wishlist heart, "Add to Cart" button

### Product Details Page
- Large image, name, price + MRP + discount %, COD availability, full description, key features list
- "Add to Cart" and "Buy Now" (goes directly to checkout) buttons

### Cart Page
- List of cart items with images, names, quantity increment/decrement, remove
- Price summary: subtotal, savings, delivery (free above ₹999, else ₹99)
- COD toggle option
- "Proceed to Pay" button triggering mock Razorpay payment flow

### Checkout Flow (multi-step)
- Step 1: Address form (Name, Phone, Address Line 1, Address Line 2, City, State, Pincode)
- Step 2: Payment selection — mock Razorpay UPI or Cash on Delivery
- Step 3: Order Success page with order confirmation, unique order ID, "Continue Shopping" button

### Wishlist Page
- Lists all wishlisted products with image, name, price
- "Add to Cart" and "Remove from Wishlist" buttons per item

### Auth (Login / Signup)
- Signup: name, email, password; Login: email, password
- Session stored in localStorage (mock auth, no real JWT security)
- Header shows user name after login; logout clears session

### Order History Page
- Accessible after login; lists session orders with order ID, date, items, total, payment method

### State Management
- React Context for cart and wishlist
- Cart and wishlist persisted to localStorage

### Backend (Motoko Actor)
- Stores: 5 seeded products, user accounts, orders
- Query functions: `getProducts()`, `getProduct(id)`
- Update functions: `createUser()`, `loginUser()`, `createOrder()`, `getMyOrders(userId)`

**User-visible outcome:** Users can browse 5 ZENTEK tech products, add them to cart or wishlist, go through a multi-step checkout with mock payment, view order history after logging in, and enjoy a consistent AJIO-inspired Indian e-commerce UI throughout.
