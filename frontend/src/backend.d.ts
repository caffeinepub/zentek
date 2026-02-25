import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Product {
    id: string;
    mrp: bigint;
    name: string;
    keyFeatures: Array<string>;
    description: string;
    codAvailable: boolean;
    imageUrl: string;
    price: bigint;
}
export interface AppOrder {
    id: string;
    paymentMethod: string;
    userId: Principal;
    totalAmount: bigint;
    address: string;
    timestamp: Time;
    items: Array<OrderItem>;
}
export type Time = bigint;
export interface OrderItem {
    productId: string;
    quantity: bigint;
}
export interface UserProfile {
    name: string;
    email: string;
}
export enum SortField {
    priceAscending = "priceAscending",
    priceDescending = "priceDescending"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createOrder(items: Array<OrderItem>, paymentMethod: string, address: string): Promise<AppOrder>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getMyOrders(): Promise<Array<AppOrder>>;
    getProduct(id: string): Promise<Product>;
    getProducts(search: string | null, limit: bigint | null, offset: bigint | null, sort: SortField | null): Promise<Array<Product>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
}
