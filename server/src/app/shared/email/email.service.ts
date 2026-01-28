
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private frontendUrl: string;
  private apiKey: string;
  private fromEmail: string;

  constructor(private configService: ConfigService) {
    this.frontendUrl = this.configService.get<string>('FRONTEND_URL') || 'http://localhost:5173';
    this.apiKey = this.configService.get<string>('BREVO_API_KEY') || '';
    this.fromEmail = this.configService.get<string>('BREVO_FROM_EMAIL') || '';
  }

  private async sendEmail(to: string, subject: string, htmlContent: string): Promise<boolean> {
    try {
      if (!this.apiKey || !this.fromEmail) {
         this.logger.error('Brevo API Key or From Email is missing configuration');
         // Fallback or throw? User asked to "update kore create kore deo" so assuming they will provide keys.
      }

      const response = await axios.post(
        'https://api.brevo.com/v3/smtp/email',
        {
          sender: {
            name: 'POSBuzz Support',
            email: this.fromEmail,
          },
          to: [{ email: to }],
          subject: subject,
          htmlContent: htmlContent,
        },
        {
          headers: {
            'api-key': this.apiKey,
            'content-type': 'application/json',
            accept: 'application/json',
          },
        },
      );
      this.logger.log(`Email sent successfully via Brevo. Message ID: ${response.data.messageId}`);
      return true;
    } catch (error: any) {
      this.logger.error(`Brevo API Error: ${JSON.stringify(error.response?.data || error.message)}`);
      // We might not want to throw and crash the request, but logging is essential.
      return false;
    }
  }

  async sendVerificationEmail(email: string, token: string) {
    const url = `${this.frontendUrl}/verify-email?token=${token}`;
    const html = `<p>Welcome to POSBuzz! Click <a href="${url}">here</a> to verify your email.</p>`;
    await this.sendEmail(email, 'Verify your Email - POSBuzz', html);
  }

  async sendPasswordResetEmail(email: string, token: string) {
    const url = `${this.frontendUrl}/reset-password?token=${token}`;
    const html = `<p>Click <a href="${url}">here</a> to reset your password.</p>`;
    await this.sendEmail(email, 'Reset your Password - POSBuzz', html);
  }
}
