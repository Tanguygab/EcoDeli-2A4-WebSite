import type { Location } from "./location"
import type { PackageSize } from "./package_size"
import type { User } from "./user"

export type Product = {
    _id: number,
    name: string,
    price: number,
    size: PackageSize,
    seller: User,
    location: Location
}
