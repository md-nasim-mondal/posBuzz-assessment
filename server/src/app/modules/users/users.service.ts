
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { Prisma, User } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.UserCreateInput): Promise<User> {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(data.password, salt);
    return this.prisma.user.create({
      data: {
        ...data,
        password: hashedPassword,
      },
    });
  }

  async findOne(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async findByVerificationToken(token: string): Promise<User | null> {
    return this.prisma.user.findFirst({
      where: { verificationToken: token },
    });
  }

  async verifyUser(id: string): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data: { isVerified: true, verificationToken: null },
    });
  }

  async setResetToken(email: string, token: string, expires: Date): Promise<User> {
    return this.prisma.user.update({
      where: { email },
      data: { resetPasswordToken: token, resetPasswordExpires: expires },
    });
  }

  async findByResetToken(token: string): Promise<User | null> {
    return this.prisma.user.findFirst({
      where: {
        resetPasswordToken: token,
        resetPasswordExpires: { gt: new Date() },
      },
    });
  }

  async updatePassword(id: string, password: string): Promise<User> {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    return this.prisma.user.update({
      where: { id },
      data: { password: hashedPassword, resetPasswordToken: null, resetPasswordExpires: null },
    });
  }

  async seedAdmin() {
    const adminEmail = 'admin@posbuzz.com';
    const existingAdmin = await this.prisma.user.findUnique({
      where: { email: adminEmail },
    });

    if (!existingAdmin) {
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash('123456', salt);
      await this.prisma.user.create({
        data: {
          email: adminEmail,
          password: hashedPassword,
          name: 'Super Admin',
          role: 'ADMIN',
          isVerified: true,
        },
      });
      console.log('Admin user seeded: admin@posbuzz.com / 123456');
    }
  }
}
