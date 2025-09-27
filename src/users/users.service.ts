import { Injectable } from '@nestjs/common';
import { RegisterUserDto } from 'src/auth/auth-dto/registerUser.dto';
import { User, UserDocument } from './schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  findByEmail(email: string) {
    return this.userModel.findOne({ email });
  }

  async create(registerUserDto: RegisterUserDto) {
    return await this.userModel.create(registerUserDto);
  }
}
