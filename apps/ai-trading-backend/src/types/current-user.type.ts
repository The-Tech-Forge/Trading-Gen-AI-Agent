import { UserType } from "../users/entities/user.entity.js"

export class ReqUser {
    user_id: string
    email: string
    user_type: UserType
}