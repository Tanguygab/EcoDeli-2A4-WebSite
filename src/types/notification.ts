import type { User } from "./user"

export type Notification = {
    id: number,
    date: Date,
    is_read: boolean,
    user: User,
    content: string
    link?: string
}