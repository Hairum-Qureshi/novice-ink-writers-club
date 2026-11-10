import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { EmailController } from './email.controller';
import { ResendProvider } from '../providers/resend';

@Module({
  providers: [EmailService, ResendProvider],
  controllers: [EmailController],
  exports: [EmailService],
})
export class EmailModule {}
