import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Param,
} from '@nestjs/common';

import { LessonsService } from './lessons.service';


@Controller('lessons')
export class LessonsController {


  constructor(
    private readonly lessonsService: LessonsService,
  ) {}





  @Post()
  createLesson(
    @Body() data: any,
  ) {

    return this.lessonsService.createLesson(data);

  }







  @Get('/student/:id')
  getStudentLessons(
    @Param('id') id: string,
  ) {

    return this.lessonsService.getStudentLessons(
      id,
    );

  }







  @Put('/:id')
  updateLesson(
    @Param('id') id: string,
    @Body() data: any,
  ) {

    return this.lessonsService.updateLesson(
      Number(id),
      data,
    );

  }







  @Delete('/:id')
  deleteLesson(
    @Param('id') id: string,
  ) {

    return this.lessonsService.deleteLesson(
      Number(id),
    );

  }


}