import type { User } from "./user"

export type Contract = {
    _id: number,
    user: User,
    start_date: Date,
    end_date: Date,
    filepath: string
}
