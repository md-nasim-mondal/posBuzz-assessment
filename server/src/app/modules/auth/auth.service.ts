
import { Injectable, BadRequestException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Prisma } from '@prisma/client';
import { EmailService } from '../../shared/email/email.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private emailService: EmailService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(email);
    if (!user) return null;
    
    // Check verification if needed? User didn't ask to block login, but usually yes.
    // For now proceed as requested "registration process tao complete kore deo"
    if (user && (await bcrypt.compare(pass, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    if (!user.isVerified) {
       throw new UnauthorizedException('Email not verified. Please verify your email before logging in.');
    }

    const payload = { email: user.email, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        isVerified: user.isVerified
      },
    };
  }

  async register(data: Prisma.UserCreateInput) {
    const verificationToken = uuidv4();
    const user = await this.usersService.create({
      ...data,
      verificationToken,
      isVerified: false,
    });
    
    await this.emailService.sendVerificationEmail(user.email, verificationToken);
    
    return {
      message: 'Registration successful. Please check your email to verify your account.',
    };
  }

  async verifyEmail(token: string) {
    const user = await this.usersService.findByVerificationToken(token);
    if (!user) {
      throw new BadRequestException('Invalid verification token');
    }
    await this.usersService.verifyUser(user.id);
    return { message: 'Email verified successfully' };
  }

  async forgotPassword(email: string) {
    const user = await this.usersService.findOne(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    
    const token = uuidv4();
    const expires = new Date();
    expires.setHours(expires.getHours() + 1); // 1 hour expiry

    await this.usersService.setResetToken(email, token, expires);
    await this.emailService.sendPasswordResetEmail(email, token);

    return { message: 'Password reset email sent' };
  }

  async resetPassword(token: string, password: string) {
    const user = await this.usersService.findByResetToken(token);
    if (!user) {
      throw new BadRequestException('Invalid or expired reset token');
    }
    await this.usersService.updatePassword(user.id, password);
    return { message: 'Password reset successfully' };
  }
}
