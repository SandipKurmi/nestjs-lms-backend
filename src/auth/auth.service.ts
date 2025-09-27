import { Injectable } from '@nestjs/common';
import { UserDocument } from 'src/users/schemas/user.schema';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}
  generateToken(user: UserDocument): Promise<string> {
    console.log(process.env.JWT_SECRET);
    return this.jwtService.signAsync(
      { id: user._id.toString(), role: user.role },
      { secret: process.env.JWT_SECRET },
    );
  }
}
