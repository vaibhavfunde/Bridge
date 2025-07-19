import { SetMetadata } from "@nestjs/common";
import { UserDocument } from "../schema/user.schema";



export const Roles = (...roles: UserDocument[]) => SetMetadata('roles', roles);