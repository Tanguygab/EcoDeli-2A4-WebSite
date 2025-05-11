import type { User } from "./user"

export type Availability = {
    _id: number,
    user: User,
    from_time: Date,
    to_time: Date
}
