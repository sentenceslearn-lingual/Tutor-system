import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';


@Injectable()
export class LessonsService {


  constructor(
    private readonly prisma: PrismaService,
  ) {}





  async createLesson(data: any) {


    const student = await this.prisma.student.findUnique({

      where: {

        studentId: data.studentId,

      },

    });



    if (!student) {

      throw new Error('Student not found');

    }



    return this.prisma.lesson.create({

      data: {

        title: data.title,

        hours: Number(data.hours),

        teacher: data.teacher,

        studentId: student.id,

      },

    });


  }







  async getStudentLessons(studentCode: string) {


    const student = await this.prisma.student.findUnique({

      where: {

        studentId: studentCode,

      },

    });



    if (!student) {

      return [];

    }





    return this.prisma.lesson.findMany({

      where: {

        studentId: student.id,

      },


      orderBy: {

  id: 'desc',

},


    });


  }







  async updateLesson(
    id: number,
    data: any,
  ) {


    return this.prisma.lesson.update({

      where: {

        id,

      },


      data: {

        title: data.title,

        hours: Number(data.hours),

        teacher: data.teacher,

      },

    });


  }







  async deleteLesson(
    id: number,
  ) {


    return this.prisma.lesson.delete({

      where: {

        id,

      },

    });


  }


}