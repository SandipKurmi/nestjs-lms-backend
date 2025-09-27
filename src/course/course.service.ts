import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Course, CourseDocument } from './schema/course.schema';
import { Model } from 'mongoose';

@Injectable()
export class CourseService {
  constructor(
    @InjectModel(Course.name) private courseModel: Model<CourseDocument>,
  ) {}

  create(createCourseDto: CreateCourseDto) {
    return this.courseModel.create(createCourseDto);
  }

  findAll() {
    return this.courseModel.find();
  }

  async findOne(id: string) {
    // check if the course is available
    const course = await this.courseModel.findById(id);
    if (!course) {
      throw new NotFoundException('Course not found');
    }

    return course;
  }

  update(id: string, updateCourseDto: UpdateCourseDto) {
    return this.courseModel.findByIdAndUpdate(id, updateCourseDto);
  }

  remove(id: string) {
    return this.courseModel.findByIdAndDelete(id);
  }
}
