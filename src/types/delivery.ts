import type { User } from "./user"

export type Delivery = {
    _id: number,
    deliveryman: User,
    latitude: number,
    longitude: number,
    products: number
}
