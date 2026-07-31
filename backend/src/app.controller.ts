import { Body, Controller, Get, Post } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getHello() {
    return { message: 'Sentences Backend API is running' };
  }

  @Post('students/register')
  registerStudent(@Body() body: any) {
    const studentId = 'ST2026001';

    return {
      success: true,
      studentId,
      status: 'PENDING_PAYMENT',
      receivedData: body,
    };
  }
}