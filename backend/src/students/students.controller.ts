import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Patch,
} from '@nestjs/common';

import { StudentsService } from './students.service';



@Controller('students')
export class StudentsController {


  constructor(
    private readonly studentsService: StudentsService,
  ) {}





  @Post('register')
  async registerStudent(
    @Body() data:any,
  ) {

    return await this.studentsService.registerStudent(data);

  }







  @Get()
  async getStudents(){

    return await this.studentsService.getStudents();

  }







  @Put(':id')
  async updateStudent(

    @Param('id') id:string,

    @Body() data:any,

  ){

    return await this.studentsService.updateStudent(
      id,
      data,
    );

  }





  @Patch(':id/payment')
  async updatePaymentStatus(
    @Param('id') id: string,
    @Body() data: { paymentStatus: string },
  ) {
    return await this.studentsService.updatePaymentStatus(
      id,
      data.paymentStatus,
    );
  }




  @Delete(':id')
  async deleteStudent(

    @Param('id') id:string,

  ){

    return await this.studentsService.deleteStudent(
      id,
    );

  }



}