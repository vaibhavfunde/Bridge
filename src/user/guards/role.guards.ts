// import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
// import { Reflector } from "@nestjs/core";
// import { UserDocument } from "../schema/user.schema";


// Injectable()
// exports class RoleGuard implements CanActivate{
//     constructor(private reflector :Reflector){}

//     canActivate(context: ExecutionContext): boolean {
//         const roles = this.reflector.getAllAndOverride<UserDocument[]>('roles', context.getHandler());
//         if (!roles) {
//             return true;
//         }
//         const request = context.switchToHttp().getRequest();
//         const user = request.user;
//         if (!user || !user.roles) {
//             throw new ForbiddenException('Access denied. User does not have roles defined.');
//         }
//         return user && user.roles && user.roles.some(role => roles.includes(role));
//     }

// }