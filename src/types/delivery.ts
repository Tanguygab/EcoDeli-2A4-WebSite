import type { User } from "./user"

export type Delivery = {
    _id: number,
    deliveryman: User,
    latitude: number,
    longitude: number,
    products: number
    first_product_date: string,
    last_product_date: string,
}
