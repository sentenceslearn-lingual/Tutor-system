import { Controller, Post } from '@nestjs/common';
import { StudentsService } from './students.service';

@Controller('students')
export class StudentsController {

  constructor(
    private readonly studentsService: StudentsService,
  ) {}

  @Post('register')
  registerStudent() {

    const studentId =
      this.studentsService.generateStudentId();

    return {
      message: 'Registration successful',
      studentId,
    };
  }

}