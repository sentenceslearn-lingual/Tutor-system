import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class StudentsService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async registerStudent(data: any) {
    const year = new Date().getFullYear();

    const lastStudent = await this.prisma.student.findFirst({
      where: {
        studentId: {
          startsWith: `ST${year}`,
        },
      },
      orderBy: {
        studentId: 'desc',
      },
    });

    let runningNumber = 1;

    if (lastStudent) {
      const lastNumber = parseInt(lastStudent.studentId.slice(-3));
      runningNumber = lastNumber + 1;
    }

    const studentId =
      `ST${year}${String(runningNumber).padStart(3, '0')}`;

    const student =
      await this.prisma.student.create({
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

    return {
      message: 'Registration successful',
      studentId: student.studentId,
    };
  }

  async getStudents() {
    return await this.prisma.student.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async updateStudent(
    id: string,
    data: any,
  ) {
    const student =
      await this.prisma.student.update({
        where: {
          studentId: id,
        },
        data: {
          fullName: data.fullName,
          certificateName: data.certificateName,
          email: data.email,
          phone: data.phone,
          languages: data.languages,
          packageHours:
            data.packageHours !== undefined
              ? Number(data.packageHours)
              : undefined,
          packagePrice:
            data.packagePrice !== undefined
              ? Number(data.packagePrice)
              : undefined,
        },
      });

    return {
      message: 'Student updated successfully',
      student,
    };
  }


  async updatePaymentStatus(
    id: string,
    paymentStatus: string,
  ) {
    const student =
      await this.prisma.student.update({
        where: {
          studentId: id,
        },
        data: {
          paymentStatus,
        },
      });

    return {
      message: 'Payment status updated successfully',
      student,
    };
  }

  async deleteStudent(
    id: string,
  ) {
    const student =
      await this.prisma.student.delete({
        where: {
          studentId: id,
        },
      });

    return {
      message: 'Student deleted successfully',
      student,
    };
  }
}