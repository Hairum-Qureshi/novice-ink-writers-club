import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { ResendProvider } from '../providers/resend';

@Module({
  providers: [EmailService, ResendProvider],
  exports: [EmailService],
})
export class EmailModule {}
