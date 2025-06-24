// backend/src/utils/email.service.js

import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

// .env faylini o'qish uchun
dotenv.config();

class EmailService {
    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            secure: false,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });
    }

    /**
     * Berilgan manzilga xabar yuboradi.
     * @param {string} to - Qabul qiluvchining email manzili.
     * @param {string} subject - Xabar mavzusi.
     * @param {string} html - HTML formatidagi xabar tanasi.
     */
    async send(to, subject, html) {
        try {
            await this.transporter.sendMail({
                from: `"Trello App" <${process.env.SENDER_EMAIL}>`,
                to: to,
                subject: subject,
                html: html,
            });
            console.log(`Email sent successfully to ${to}`);
        } catch (error) {
            console.error(`Error sending email to ${to}:`, error);
            throw new Error('Failed to send email.');
        }
    }
}

// Biz EmailService'ning bitta nusxasini (instance) yaratib, eksport qilamiz.
// Bu butun ilova bo'ylab bitta servisdan foydalanishni ta'minlaydi (Singleton pattern).
export default new EmailService();