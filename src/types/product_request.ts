import type { Delivery } from "./delivery";
import type { DeliveryStatus } from "./delivery_status";
import type { Location } from "./location";
import type { Product } from "./product";
import type { User } from "./user";
import type { Warehouse } from "./warehouse";

export type ProductRequest = {
    _id: number,
    creation_date: Date,
    date?: Date,
    accepted_date?: Date,
    validation_code?: string,
    delivery_location: Location,
    receiver: User,
    product: Product,
    amount: number,
    delivery?: Delivery,
    delivery_status?: DeliveryStatus,
    back_to_ware_house?: Warehouse
}
