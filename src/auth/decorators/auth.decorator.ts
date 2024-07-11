import { Role_User } from "@prisma/client";
import { Roles } from "./role.decorator";
import { applyDecorators, UseGuards } from "@nestjs/common";
import { AuthGuard } from "../guard/auth.guard";
import { RolesGuard } from "../guard/roles.guard";

export function Auth(role: Role_User) {
    return applyDecorators(
        Roles(role),
        UseGuards(AuthGuard, RolesGuard)
    )
}