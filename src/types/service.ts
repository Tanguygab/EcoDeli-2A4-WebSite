import type { User } from "./user"

export type Service = {
    _id: number,
    creation_date: Date,
    date: Date,
    name: string,
    description: string,
    price: number,
    user: User,
    actor?: User
}
