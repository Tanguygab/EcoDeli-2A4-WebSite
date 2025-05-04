import type { User } from "./user"

export type Delivery = {
    id: number,
    deliveryman: User,
    latitude: number,
    longitude: number,
    products: number
}