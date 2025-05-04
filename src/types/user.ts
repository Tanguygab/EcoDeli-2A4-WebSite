import type { Role } from "./role"
import type { Subscription } from "./subscription"

export type User = {
    id: number,
    firstname: string,
    name: string,
    email: string,
    birthday: Date,
    subscription: Subscription
    description: string,
    join_date: Date,
    tutorial: boolean,
    approved: boolean
    role: Role,
}