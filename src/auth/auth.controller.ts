import {
  Body,
  Controller,
  HttpStatus,
  HttpException,
  Post,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { RegisterUserDto } from './auth-dto/registerUser.dto';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  // logic for register
  // 1. Check if user already exists
  // 2. hash password
  // 3. store user in db
  // 4. generate jwt token
  // 5. send token in response

  @Post('register')
  async register(@Body() registerUserDto: RegisterUserDto) {
    // 1. Check if user already exists
    const user = await this.usersService.findByEmail(registerUserDto.email);
    if (user) {
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    }

    // 1. hash password
    const hashedPassword = await bcrypt.hash(registerUserDto.password, 10);
    registerUserDto.password = hashedPassword;

    // 2. store user in db
    const newUser = await this.usersService.create(registerUserDto);

    // 3. generate jwt token
    const token = await this.authService.generateToken(newUser);

    return {
      user: newUser,
      token,
    };
  }
}
