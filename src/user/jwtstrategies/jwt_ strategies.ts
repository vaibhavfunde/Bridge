import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt"; // ✅ ADD THIS

import { UserService } from "../user.service";


// fetch(url ,{
//     headers:{
//         token:`Bearer ${token}` // 🔒 Use Bearer token for JWT
//     }
// })

@Injectable()
export class JWTStrategy extends PassportStrategy(Strategy) {
  constructor(private UserService :UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // extract token from header
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'secret123', // 🔒 Replace with your secret or use config
    });
  }

  async validate(payload: any) {
    // payload is the decoded JWT content
   
    try {
         const user = this.UserService.getUserById(payload.id);
         return (
            ...user,
            roles: payload.roles, // Include roles if needed
         )
        

    } catch (error) {
        throw new UnauthorizedException('Invalid token');
    }
  }


}
