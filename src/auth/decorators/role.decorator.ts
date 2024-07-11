import { SetMetadata } from "@nestjs/common"
import { Role_User } from "@prisma/client"

export const ROLES_KEY = 'roles'
export const Roles = (role: Role_User) => SetMetadata(ROLES_KEY, role)