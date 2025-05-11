import type { User } from "./user"

export type UserProof = {
    _id: number,
    user: User,
    date: Date,
    name: string,
    filepath: string
}
