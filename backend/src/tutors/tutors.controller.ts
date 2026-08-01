import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';

import { TutorsService } from './tutors.service';

@Controller('tutors')
export class TutorsController {
  constructor(
    private readonly tutorsService: TutorsService,
  ) {}

  @Get()
  async getTutors() {
    return await this.tutorsService.getTutors();
  }

  @Post()
  async createTutor(@Body() data: any) {
    return await this.tutorsService.createTutor(data);
  }

  @Put(':id')
  async updateTutor(
    @Param('id') id: string,
    @Body() data: any,
  ) {
    return await this.tutorsService.updateTutor(id, data);
  }

  @Delete(':id')
  async deleteTutor(@Param('id') id: string) {
    return await this.tutorsService.deleteTutor(id);
  }
}
