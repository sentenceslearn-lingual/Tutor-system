import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class StudentsService {

  constructor(
    private readonly prisma: PrismaService,
  ) {}


  async registerStudent(data: any) {

    console.log('DATA FROM FRONTEND:', data);


    const studentId = `ST${new Date().getFullYear()}001`;


    const student = await this.prisma.student.create({

      data: {

        studentId,

        fullName: data.fullName,

        certificateName: data.certificateName,

        email: data.email,

        phone: data.phone,

        languages: data.languages,

        packageHours: Number(data.packageHours),

        packagePrice: Number(data.packagePrice),

      },

    });


    console.log('DATABASE SAVED:', student);


    return {

      message: 'Registration successful',

      studentId: student.studentId,

    };

  }

}