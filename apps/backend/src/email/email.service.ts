import { Inject, Injectable } from '@nestjs/common';
import { Resend } from 'resend';
import { ConfigService } from '@nestjs/config';
import { RESEND_CLIENT } from '../providers/resend';
import { VERIFICATION_CODE_TEMPLATE } from './templates/verification-code';

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
}
