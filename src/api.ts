import axios from "axios";
import router from "./router";
import { DummyUser, type User } from "./types/user";
import type { Product } from "./types/product";
import type { Subscription } from "./types/subscription";
import { paginate, type Pagination } from "./types/pagination";
import type { ProductRequest } from "./types/product_request";
import type { Service } from "./types/service";
import type { Bill } from "./types/bill";
import type { UserProof } from "./types/user_proof";
import type { Contract } from "./types/contract";
import type { Warehouse } from "./types/warehouse";
import type { Delivery } from "./types/delivery";
import type { Notification } from "./types/notification";
import type { Session } from "./stores/session";


let session: Session

function api(newSession: Session) {
    session = newSession
}

async function request<type>(method: string, url: string, body?: object) {
    return (await axios.request<type>({
        method: method,
        baseURL: "http://localhost:3000/api/",
        url: url,
        data: body,
        headers: session.getHeader
    })).data
}

async function post<type>(endpoint: string, body?: object) {
    return request<type>("POST", endpoint, body)
}

async function get<type>(endpoint: string) {
    return request<type>("GET", endpoint)
}

async function del<type>(endpoint: string) {
    return request<type>("DELETE", endpoint)
}


// Auth

async function login(email: string, password: string) {
    const res = await post<any>("auth/login", { email: email, password: password })
    session.saveToken(res.token, res.user)
    router.push("/")
            
}

async function register(firstname: string, name:  string, email: string, password: string, birthday: string) {
    await post("auth/register", { firstname: firstname, name: name, email: email, password: password, birthday: birthday })
    router.push("/login")
}

function logout() {
    post("auth/logout")
    session.saveToken("")
    router.push("/")
}

async function isSessionValid() {
    if (!session.user) return false
    try {
        await post("auth/valid")
        return true
    } catch (e) {
        session.saveToken("")
        return false
    }
}


// General

async function getSubscriptions() {
    return await get<Subscription[]>("subscriptions")
}

async function getProducts(pagination: Pagination) {
    return await get<Product[]>(paginate("products", pagination))
}

async function getServices(pagination: Pagination) {
    return await get<Service[]>(paginate("products", pagination))
}

async function getRequests(pagination: Pagination) {
    return await get<ProductRequest[]>(paginate("products", pagination))
}

async function getProduct(id: number) {
    return await get<Product>("products/" + id)
}

async function searchProducts(pagination: Pagination) {
    return await get<Product[]>(paginate("products", pagination))
}


// Users

async function getUser(id: number) {
    return await get<User>("users/" + id)
}

async function searchUsers(pagination: Pagination) {
    return await get<User[]>(paginate("users", pagination))
}

async function getNotifications() {
    return await get<Notification[]>("notifications")
}

async function readNotification(notification?: Notification) {
    return await post<Notification[] | void>("notifications/read/" + (notification ? notification.id : ""))
}


async function getBills(pagination: Pagination) {
    return await get<Bill[]>(paginate("bills", pagination))
}

async function getContracts(pagination: Pagination) {
    return await get<Contract[]>(paginate("contracts", pagination))
}

async function getDeliveries(pagination: Pagination) {
    return await get<Delivery[]>(paginate("deliveries", pagination))
}

async function getPayments(pagination: Pagination) {
    return await get<Bill[]>(paginate("payments", pagination))
}


async function getProofs(pagination: Pagination) {
    return await get<UserProof[]>(paginate("proofs", pagination))
}

// Admin

async function deleteBill(bill: Bill) {
    return await del("bills/" + bill.id)
}

async function deleteContract(contract: Contract) {
    return await del("contracts/" + contract.id)
}

async function deleteDelivery(delivery: Delivery) {
    return await del("deliveries/" + delivery.id)
}

async function deletePayment(payment: Bill) {
    return await del("payments/" + payment.id)
}



// Other

async function getWarehouses() {
    return await get<Warehouse>("warehouses")
}


export {
    api,
    // Auth
    login, register, logout, isSessionValid,

    // General
    getSubscriptions, getProducts, getServices, getRequests, getProduct, searchProducts,

    // User
    getUser, searchUsers, getNotifications, readNotification,
    getBills, getContracts, getDeliveries, getPayments, getProofs,

    // Admin
    deleteBill, deleteContract, deleteDelivery, deletePayment,

    // Other
    getWarehouses
 }