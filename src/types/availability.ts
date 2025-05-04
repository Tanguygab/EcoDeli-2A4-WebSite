import type { User } from "./user"

export type Availability = {
    id: number,
    user: User,
    from_time: Date,
    to_time: Date
}