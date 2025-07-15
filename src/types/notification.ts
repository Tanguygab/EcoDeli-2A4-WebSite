export type Notification = {
    _id: number,
    date: Date,
    is_read: boolean,
    content: string,
    link?: string,
    user: number // ID de l'utilisateur à qui appartient la notification
}
