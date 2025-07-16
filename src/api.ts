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
import type { DeliveryStatus } from '@/types/delivery_status.ts'

const API_URL = import.meta.env.PROD || import.meta.env.VITE_PROD ? "88.172.140.59:52000" : "localhost:3000"
//const API_URL = "88.172.140.59:52000"
let session: Session

export function api(newSession: Session) {
    session = newSession
}

export function getImageURL(name: string) {
    return "http://" + API_URL + "/data/images/" + name
}

async function request<type>(method: string, url: string, body?: object | FormData) {
    const headers = { ...session.getHeader }

    console.log(`[API] ${method} ${url}`, { body, headers })

    // Pour FormData, ne pas définir Content-Type (le navigateur le fait automatiquement)
    if (body instanceof FormData) {
        console.log('[API] FormData detected, entries:', [...body.entries()])
    }

    try {
        const response = await axios.request<type>({
            method: method,
            baseURL: "http://" + API_URL + "/api",
            url: url,
            data: body,
            headers: headers
        })

        console.log(`[API] ${method} ${url} - Success:`, response.data)
        return response.data
    } catch (error: any) {
        console.error(`[API] ${method} ${url} - Error:`, error.response?.data || error.message)
        throw error
    }
}

async function post<type>(endpoint: string, body?: object | FormData) {
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

// Ajouter des fonctions pour la gestion des utilisateurs
export async function updateUser(id: number, userData: Partial<User>) {
    return await put<User>(`users/${id}`, userData)
}

export async function deleteUser(id: number) {
    return await del(`users/${id}`)
}

export async function banUser(id: number) {
    return await put(`users/${id}/ban`)
}

export async function unbanUser(id: number) {
    return await put(`users/${id}/unban`)
}

export async function approveUser(id: number) {
    return await put(`users/${id}/approve`)
}

export async function unapproveUser(id: number) {
    return await put(`users/${id}/unapprove`)
}

export async function getNotifications() {
    return await get<Notification[]>("notifications")
}

export async function readNotification(notification?: Notification) {
    return await post<Notification[] | void>("notifications/read/" + (notification ? notification._id : ""))
}

// Créer une nouvelle notification
export async function createNotification(userId: number, content: string, link?: string) {
    return await post<Notification>("notifications", {
        user: userId,
        content: content,
        link: link,
        date: new Date().toISOString()
    })
}

export async function buyProduct(product: Product, amount: number, location: Location) {
    return await post<Product>("products/" + product._id + "/buy", {
        amount: amount,
        location: location
    })
}

export async function createService(serviceData: any) {
    // Transformer les données pour correspondre exactement à l'API
    const apiData = {
        name: serviceData.name,
        description: serviceData.description,
        price: parseFloat(serviceData.price) || 0.0,
        date: serviceData.date || new Date().toISOString(),
    };

    return await post<Service>("services", apiData);
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

export async function getPayments(pagination: Pagination) {
    return await get<Bill[]>(paginate("payments", pagination))
}


export async function getProofs(pagination: Pagination) {
    return await get<UserProof[]>(paginate("proofs", pagination))
}

// DeliveryMen
export async function joinDeliveries(formData: FormData) {
    return await post<void>("deliveries/join", formData)
}

export async function getDeliveries(pagination: Pagination) {
    return await get<Delivery[]>(paginate("deliveries", pagination))
}

export async function createDelivery() {
    return await post<Delivery>("deliveries")
}

export async function getDeliveryStatuses() {
    return await get<DeliveryStatus[]>("deliveries/statuses")
}

export async function getDelivery(id: number) {
    return await get<Delivery>("deliveries/" + id)
}

export async function startDelivery(id: number) {
    return await post<Delivery>("deliveries/" + id + "/start")
}

export async function setRequestStatus(request: ProductRequest, status: DeliveryStatus) {
    return await put<Delivery>("products/requests/" + request._id + "/status", { status: status._id })
}

export async function endDelivery(id: number) {
    return await post<Delivery>("deliveries/" + id + "/end")
}

export async function getUnassignedRequests(pagination: Pagination) {
    return await get<ProductRequest[]>(paginate("products/requests/unassigned", pagination))
}

export async function acceptProductRequest(request: ProductRequest, delivery: Delivery) {
    return await post<void>("products/requests/" + request._id + "/accept", {
        delivery: delivery._id,
    })
}

// User Settings
export async function updateSettings(
    firstname: string, name: string, email: string,
    description: string, birthday: string
) {
    return await put<User>("users/" + session.user?._id, {
        firstname: firstname,
        name: name,
        email: email,
        description: description,
        birthday: birthday,
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

export async function getFinances(pagination: Pagination) {
    return await get<any[]>(paginate("finances", pagination))
}

export async function deleteFinance(finance: any) {
    return await del("finances/" + finance._id)
}



// Other

export async function getWarehouses() {
    return await get<Warehouse>("warehouses")
}

export async function updateProfile(formData: FormData) {
    return (await axios.put(
        "http://" + API_URL + "/api/users/" + session.user?._id,
        formData,
        {
            headers: {
                ...session.getHeader,
                'Content-Type': 'multipart/form-data'
            }
        }
    )).data
}

export async function getDeliveryApplications(pagination: Pagination) {
    return await get<UserProof[]>(paginate("proofs", pagination))
}

export async function updateDeliveryApplicationStatus(id: string, status: string) {
    return await put("postannouncements/" + id, { status })
}

export async function getPrestataires(pagination: Pagination) {
    return await get<any[]>(paginate("prestataires", pagination));
}

export async function deletePrestataire(prestataire: any) {
    return await del("prestataires/" + prestataire._id);
}

export async function getPrestations(pagination: Pagination) {
    return await get<any[]>(paginate("prestations", pagination));
}

export async function deletePrestation(prestation: any) {
    return await del("prestations/" + prestation._id);
}

export async function getTraders(pagination: Pagination) {
    return await get<any[]>(paginate("traders", pagination));
}

export async function deleteTrader(trader: any) {
    return await del("traders/" + trader._id);
}

export async function getClientAnnonces(pagination: Pagination) {
    try {
        // Utiliser l'endpoint correct : clientannonces au lieu de annonces
        return await get<any[]>(paginate("clientannonces", pagination))
    } catch (error: any) {
        console.error('Erreur lors de la récupération des annonces:', error)
        // Retourner un tableau vide en cas d'erreur
        return []
    }
}

export async function createClientAnnonce(body: object) {
    try {
        return await post<any>("clientannonces", body)
    } catch (error: any) {
        console.error('Erreur lors de la création de l\'annonce:', error)
        throw error
    }
}

export async function deleteClientAnnonce(id: string) {
    try {
        return await del(`clientannonces/${id}`)
    } catch (error: any) {
        console.error('Erreur lors de la suppression de l\'annonce:', error)
        throw error
    }
}

// Supprimer une candidature (proof)
export async function deleteProof(proofId: number | string) {
    return await del(`proofs/${proofId}`)
}

// Mettre à jour le rôle d'un utilisateur
export async function updateUserRole(userId: number | string, role: number) {
    return await put(`users/${userId}`, { role })
}

// Supprimer une notification
export async function deleteNotification(id: number | string) {
    return await del(`notifications/${id}`)
}

// Fonction pour diagnostiquer les endpoints disponibles (version simplifiée)
export async function checkAvailableEndpoints() {
    const endpoints = [
        "clientannonces",
        "users",
        "products",
        "deliveries"
    ]

    const available = []
    const unavailable = []

    for (const endpoint of endpoints) {
        try {
            await get<any[]>(endpoint)
            available.push(endpoint)
        } catch (error: any) {
            unavailable.push({
                endpoint,
                status: error.response?.status,
                message: error.response?.statusText
            })
        }
    }

    console.log('🔍 Endpoints disponibles:', available)
    console.log('❌ Endpoints indisponibles:', unavailable)

    return { available, unavailable }
}
