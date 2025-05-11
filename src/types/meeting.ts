import type { User } from "./user"

export type Meeting = {
    _id: number,
    date: Date,
    client: User,
    service_provider: User,
    accepted: boolean
}
