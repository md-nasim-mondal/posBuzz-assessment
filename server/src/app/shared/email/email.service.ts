
import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailService {
  private transporter;
  private frontendUrl: string;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: this.configService.get<string>('EMAIL_USER'),
        pass: this.configService.get<string>('EMAIL_PASS'),
      },
    });
    this.frontendUrl = this.configService.get<string>('FRONTEND_URL') || 'http://localhost:5173';
  }

  async sendVerificationEmail(email: string, token: string) {
    const url = `${this.frontendUrl}/verify-email?token=${token}`;
    await this.transporter.sendMail({
      from: '"POSBuzz" <no-reply@posbuzz.com>',
      to: email,
      subject: 'Verify your Email',
      html: `<p>Click <a href="${url}">here</a> to verify your email.</p>`,
    });
  }

  async sendPasswordResetEmail(email: string, token: string) {
    const url = `${this.frontendUrl}/reset-password?token=${token}`;
    await this.transporter.sendMail({
      from: '"POSBuzz" <no-reply@posbuzz.com>',
      to: email,
      subject: 'Reset your Password',
      html: `<p>Click <a href="${url}">here</a> to reset your password.</p>`,
    });
  }
}
