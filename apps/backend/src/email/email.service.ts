import { Inject, Injectable } from '@nestjs/common';
import { Resend } from 'resend';
import { ConfigService } from '@nestjs/config';
import { RESEND_CLIENT } from '../providers/resend';
import { VERIFICATION_CODE_TEMPLATE } from './templates/verification-code';
import { PASSWORD_RESET_TEMPLATE } from './templates/password-reset';

@Injectable()
export class EmailService {
  constructor(
    @Inject(RESEND_CLIENT)
    private readonly resend: Resend,
    private readonly configService: ConfigService,
  ) {}

  async sendVerificationEmail(to: string, verificationCode: string) {
    const { error } = await this.resend.emails.send({
      from: this.configService.getOrThrow<string>('EMAIL_FROM'),
      to,
      subject: 'Verify your email address',
      html: VERIFICATION_CODE_TEMPLATE.replace(
        '{{ verificationCode }}',
        verificationCode,
      ),
    });

    if (error) {
      throw new Error(`Failed to send verification email: ${error.message}`);
    }
  }

  async sendPasswordResetEmail(
    to: string,
    resetUrl: string,
    expirationMinutes: number,
  ) {
    const { error } = await this.resend.emails.send({
      from: this.configService.getOrThrow<string>('EMAIL_FROM'),
      to,
      subject: 'Reset your password',
      html: PASSWORD_RESET_TEMPLATE.replace('{{ resetUrl }}', resetUrl).replace(
        '{{ expirationMinutes }}',
        expirationMinutes.toString(),
      ),
    });

    if (error) {
      throw new Error(`Failed to send password reset email: ${error.message}`);
    }
  }
}
