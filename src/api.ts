import axios from "axios";
import router from "./router";
import { type User } from "./types/user";
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
import type { Location } from './types/location.ts'
import type { Session } from "./stores/session";
import { type Ref, watch } from 'vue'

// const API_URL = import.meta.env.PROD || import.meta.env.VITE_PROD ? "88.172.140.59:52000" : "localhost:3000"
const API_URL = "88.172.140.59:52000"
let session: Session

export function api(newSession: Session) {
    session = newSession
}

async function request<type>(method: string, url: string, body?: object) {
    return (await axios.request<type>({
        method: method,
        baseURL: "http://" + API_URL + "/api",
        url: url,
        data: body,
        headers: session.getHeader
    })).data
}

async function post<type>(endpoint: string, body?: object) {
    return request<type>("POST", endpoint, body)
}

async function put<type>(endpoint: string, body?: object) {
    return request<type>("PUT", endpoint, body)
}

async function get<type>(endpoint: string) {
    return request<type>("GET", endpoint)
}

async function del<type>(endpoint: string) {
    return request<type>("DELETE", endpoint)
}

export async function loadPage<type>(ref: Ref<type>, fun: Function) {
    const callFun = async () => {
        const id = router.currentRoute.value.params.id as string
        if (id) fun(parseInt(id))
            .then((value: type) => ref.value = value)
            .catch(() => router.push("/"))
        else router.push("/")
    }

    watch(() => router.currentRoute.value.params, callFun)
    callFun()
}


// Auth

export async function login(email: string, password: string) {
    const res = await post<{token: string, user: User}>("auth/login", { email: email, password: password })
    session.saveToken(res.token, res.user)
    router.push("/")
}

export async function register(firstname: string, name:  string, email: string, password: string, birthday: string) {
    await post("auth/register", { firstname: firstname, name: name, email: email, password: password, birthday: birthday })
    router.push("/login")
}

export function logout() {
    post("auth/logout")
    session.saveToken("")
    router.push("/")
}

export async function isSessionValid(home?: boolean) {
    if (!session.user) {
        if (home) router.push("/")
        return false
    }
    try {
        session.user = (await post<{user: User}>("auth/valid")).user
        return true
    } catch (e) {
        session.saveToken("")
        if (home) router.push("/")
        return false
    }
}


// General

export async function getSubscriptions() {
    return await get<Subscription[]>("subscriptions")
}

export async function getProducts(pagination: Pagination) {
    return await get<Product[]>(paginate("products", pagination))
}

export async function getServices(pagination: Pagination) {
    return await get<Service[]>(paginate("services", pagination))
}

export async function getProduct(id: number) {
    return await get<Product>("products/" + id)
}

export async function getService(id: number) {
    return await get<Service>("services/" + id)
}

export async function getSellers(input: string) {
    return await get<User[]>("products/sellers?input=" + input)
}


// Users

export async function getUser(id: number) {
    return await get<User>("users/" + id)
}

export async function searchUsers(pagination: Pagination) {
    return await get<User[]>(paginate("users", pagination))
}

export async function getNotifications() {
    return await get<Notification[]>("notifications")
}

export async function readNotification(notification?: Notification) {
    return await post<Notification[] | void>("notifications/read/" + (notification ? notification._id : ""))
}

export async function buyProduct(product: Product, amount: number, location: Location) {
    return await post<Product>("products/" + product._id + "/buy", {
        amount: amount,
        location: location
    })
}

export async function createService(name: string, description: string, price: number, location: Location, date: string) {
    return await post<Service>("services", {
        name: name,
        description: description,
        price: price,
        location: location,
        date: date
    })
}

// Récupérer les produits d'un vendeur
export async function getUserProducts(userId: number) {
  return await get<Product[]>(`products?seller=${userId}`)
}

// Créer un produit avec upload
export async function createProduct(body: FormData) {
  return await post<Product>('products', body)
}

export async function getRequests(pagination: Pagination) {
    return await get<ProductRequest[]>(paginate("products/requests", pagination))
}

export async function getRequest(id: number) {
    return await get<ProductRequest>("products/requests/" + id)
}

export async function getLocations() {
    return await get<Location[]>("locations")
}

export async function saveLocation(location: Location) {
    return await post<Location>('locations/', { location: location })
}


export async function getBills(pagination: Pagination) {
    return await get<Bill[]>(paginate("bills", pagination))
}

export async function getContracts(pagination: Pagination) {
    return await get<Contract[]>(paginate("contracts", pagination))
}

export async function getDeliveries(pagination: Pagination) {
    return await get<Delivery[]>(paginate("deliveries", pagination))
}

export async function getPayments(pagination: Pagination) {
    return await get<Bill[]>(paginate("payments", pagination))
}


export async function getProofs(pagination: Pagination) {
    return await get<UserProof[]>(paginate("proofs", pagination))
}

// DeliveryMen
export async function acceptProductRequest(request: ProductRequest, delivery: Delivery) {
    return await post<void>("products/requests/" + request._id + "/accept", {
        delivery: delivery._id,
    })
}

// User Settings
export async function updateSettings(name: string, email: string, notifications: boolean) {
    return await put<User>("users/" + session.user?._id, {
        name: name,
        email: email,
        notifications: notifications,
    })
}

export async function updatePassword(password: string) {
    return await put<string>("users/" + session.user?._id + "/password", {
        password: password
    })
}

export async function deleteAccount() {
    return await del("users/" + session.user?._id)
}

// Admin

export async function deleteBill(bill: Bill) {
    return await del("bills/" + bill._id)
}

export async function deleteContract(contract: Contract) {
    return await del("contracts/" + contract._id)
}

export async function deleteDelivery(delivery: Delivery) {
    return await del("deliveries/" + delivery._id)
}

export async function deletePayment(payment: Bill) {
    return await del("payments/" + payment._id)
}



// Other

export async function getWarehouses() {
    return await get<Warehouse>("warehouses")
}
