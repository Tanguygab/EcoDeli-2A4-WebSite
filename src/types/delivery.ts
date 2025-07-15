import type { User } from "./user"
import type { ProductRequest } from '@/types/product_request.ts'

export type Delivery = {
    _id: number,
    deliveryman: User,
    latitude: number,
    longitude: number,
    products: number | ProductRequest[]
    first_product_date: string,
    last_product_date: string,
}
