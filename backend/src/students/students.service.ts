import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class StudentsService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async registerStudent(data: any) {
    // ตรวจข้อมูลที่จำเป็น
    if (
      !data.fullName?.trim() ||
      !data.email?.trim() ||
      !data.phone?.trim() ||
      !data.languages?.trim() ||
      data.packageHours === undefined ||
      data.packagePrice === undefined
    ) {
      throw new Error(
        'Please fill in all required information',
      );
    }

    // ตรวจว่าเบอร์โทรซ้ำหรือไม่
    const existingStudent =
      await this.prisma.student.findFirst({
        where: {
          phone: data.phone.trim(),
        },
      });

    if (existingStudent) {
      throw new Error(
        'This phone number is already registered',
      );
    }

    // สร้าง Student ID
    const year = new Date().getFullYear();

    const lastStudent =
      await this.prisma.student.findFirst({
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
      const lastNumber = parseInt(
        lastStudent.studentId.slice(-3),
      );

      runningNumber = lastNumber + 1;
    }

    const studentId =
      `ST${year}${String(runningNumber).padStart(3, '0')}`;

    // สร้างนักเรียน
    const student =
      await this.prisma.student.create({
        data: {
          studentId,
          fullName: data.fullName.trim(),
          certificateName:
            data.certificateName?.trim() || null,
          email: data.email.trim(),
          phone: data.phone.trim(),
          languages: data.languages.trim(),
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