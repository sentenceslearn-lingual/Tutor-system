import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TutorsService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async getTutors() {
    return await this.prisma.tutor.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async createTutor(data: any) {
    return await this.prisma.tutor.create({
      data: {
        name: data.name,
        languages: data.languages,
        expertise: data.expertise,
        bio: data.bio,
      },
    });
  }

  async updateTutor(id: string, data: any) {
    return await this.prisma.tutor.update({
      where: {
        id: Number(id),
      },
      data: {
        name: data.name,
        languages: data.languages,
        expertise: data.expertise,
        bio: data.bio,
      },
    });
  }

  async deleteTutor(id: string) {
    return await this.prisma.tutor.delete({
      where: {
        id: Number(id),
      },
    });
  }
}
