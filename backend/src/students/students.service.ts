import { Injectable } from '@nestjs/common';

@Injectable()
export class StudentsService {

  private studentCounter = 1;

  generateStudentId() {
    const year = new Date().getFullYear();

    const number = this.studentCounter
      .toString()
      .padStart(3, '0');

    const studentId = `ST${year}${number}`;

    this.studentCounter++;

    return studentId;
  }

}