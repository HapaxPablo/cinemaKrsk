import { Injectable, InternalServerErrorException } from '@nestjs/common'
import * as nodemailer from 'nodemailer'

@Injectable()
export class MailService {
  private readonly transporter = nodemailer.createTransport({
    host: 'smtp.yandex.ru',
    port: 465,
    secure: true,
    auth: {
      user: process.env.MAIL_FROM,
      pass: process.env.YANDEX_APP_PASSWORD,
    },
  })

  async sendVerificationCode(email: string, code: string): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: `"CinemaKRSK" <${process.env.MAIL_FROM}>`,
        to: email,
        subject: 'Подтверждение регистрации — CinemaKRSK',
        html: `
          <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
            <h2>Добро пожаловать в CinemaKRSK!</h2>
            <p>Ваш код подтверждения:</p>
            <div style="font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #e50914; margin: 24px 0;">
              ${code}
            </div>
            <p style="color: #666;">Код действителен 15 минут.</p>
            <p style="color: #666;">Если вы не регистрировались — просто проигнорируйте это письмо.</p>
          </div>
        `,
      })
    } catch (error) {
      console.error('Ошибка отправки письма на', email, error)
      throw new InternalServerErrorException('Ошибка отправки письма')
    }
  }
}
