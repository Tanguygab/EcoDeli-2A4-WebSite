import type { Role } from "./role"
import type { Subscription } from "./subscription"

export type User = {
    _id: number,
    firstname: string,
    name: string,
    image: string,
    email: string,
    birthday: Date | string,
    subscription: Subscription
    description: string,
    join_date: Date,
    tutorial: boolean,
    approved: boolean,
    role: Role
}
