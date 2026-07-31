import { Body, Controller, Post } from '@nestjs/common';
import { StudentsService } from './students.service';

@Controller('students')
export class StudentsController {

  constructor(
    private readonly studentsService: StudentsService,
  ) {}

  @Post('register')
  async registerStudent(
    @Body() data: any,
  ) {

    console.log('========== REQUEST RECEIVED ==========');
    console.log(data);

    const result =
      await this.studentsService.registerStudent(data);

    console.log('========== DATABASE RESULT ==========');
    console.log(result);

    return result;
  }

}