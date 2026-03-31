import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { Resend } from 'resend'

@Injectable()
export class MailService {
  private readonly resend: Resend
  private readonly from = process.env.MAIL_FROM ?? 'noreply@yourdomain.com'

  constructor() {
    this.resend = new Resend(process.env.RESEND_API_KEY)
  }

  async sendVerificationCode(email: string, code: string): Promise<void> {
    const { error } = await this.resend.emails.send({
      from: this.from,
      to: email,
      subject: 'Подтверждение регистрации — Cinema KRSK',
      html: `
        <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
          <h2>Добро пожаловать в Cinema KRSK!</h2>
          <p>Ваш код подтверждения:</p>
          <div style="font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #e50914; margin: 24px 0;">
            ${code}
          </div>
          <p style="color: #666;">Код действителен 15 минут.</p>
          <p style="color: #666;">Если вы не регистрировались — просто проигнорируйте это письмо.</p>
        </div>
      `,
    })

    if (error) {
      console.log('Ошибка отправки письма:', error)
      throw new InternalServerErrorException('Ошибка отправки письма')
    }
  }
}
