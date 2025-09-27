import {
  Body,
  Controller,
  HttpStatus,
  HttpException,
  Post,
  Get,
  UseGuards,
  Req,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { RegisterUserDto } from './auth-dto/registerUser.dto';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';
import { LoginUserDto } from './auth-dto/loginUser.dto';
import { AuthGuard } from './auth.guard';

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

  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto) {
    const user = await this.usersService.findByEmail(loginUserDto.email);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
    }

    const isPasswordValid = await bcrypt.compare(
      loginUserDto.password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new HttpException('Invalid password', HttpStatus.BAD_REQUEST);
    }

    const token = await this.authService.generateToken(user);

    return {
      user,
      token,
    };
  }

  // profile
  @Get('profile')
  @UseGuards(AuthGuard)
  async profile(@Req() req: { user: { id: string } }) {
    const user = await this.usersService.findById(req.user.id);
    return user;
  }
}
