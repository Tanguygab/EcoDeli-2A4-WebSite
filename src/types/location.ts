import type { User } from "./user"

export type Location = {
    id: number,
    user?: User,
    city: string,
    zipcode: string,
    address: string
}