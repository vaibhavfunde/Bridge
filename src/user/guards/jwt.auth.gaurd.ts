import { Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";


//protect routes with JWT authentication
// This guard will use the JWT strategy defined in jwt.strategies.ts

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}