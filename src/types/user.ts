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

const DummyUser: User = {
    id: 0, firstname: "Pedro", name: "Raccoon", email: "pedro@raccoon.com",
    birthday: new Date(), subscription: undefined, join_date: new Date(),
    tutorial: true, approved: true, role: {id: 0, name: "Admin", access_level: 100}
}
export { DummyUser }