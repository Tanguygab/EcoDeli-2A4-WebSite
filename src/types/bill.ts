import type { User } from "./user"

export type Bill = {
    _id: number,
    buyer: User,
    receiver: User,
    date: Date,
    price: number,
    filepath: string
}
