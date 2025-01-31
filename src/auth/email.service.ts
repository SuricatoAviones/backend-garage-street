import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail', // Puedes cambiar esto por otro servicio de correo
      auth: {
        user: process.env.EMAIL_USER, // Configura estas variables en tu .env
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  async sendPasswordResetEmail(email: string, token: string): Promise<void> {
    const resetUrl = `http://yourapp.com/reset-password?token=${token}`;

    await this.transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Password Reset',
      text: `To reset your password, click on the following link: ${resetUrl}`,
      html: `<p>To reset your password, click on the following link: <a href="${resetUrl}">${resetUrl}</a></p>`,
    });
  }
}