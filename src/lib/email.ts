import nodemailer from 'nodemailer';
import { env, isEmailConfigured } from '@/lib/config';

// Create transporter lazily to avoid errors if email is not configured
function getTransporter() {
  if (!isEmailConfigured()) {
    throw new Error('Email is not configured. Please set EMAIL_HOST, EMAIL_USERNAME, and EMAIL_PASSWORD.');
  }

  return nodemailer.createTransport({
    host: env.EMAIL_HOST,
    port: env.EMAIL_PORT,
    secure: false,
    auth: {
      user: env.EMAIL_USERNAME,
      pass: env.EMAIL_PASSWORD,
    },
  });
}

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: SendEmailOptions): Promise<void> {
  const transporter = getTransporter();
  await transporter.sendMail({
    from: env.EMAIL_FROM || env.EMAIL_USERNAME,
    to,
    subject,
    html,
  });
}

export async function sendOtpEmail(email: string, otp: string): Promise<void> {
  await sendEmail({
    to: email,
    subject: 'Verify your email - Homez',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Email Verification</h2>
        <p>Your verification code is:</p>
        <h1 style="font-size: 32px; letter-spacing: 5px; color: #4F46E5;">${otp}</h1>
        <p>This code expires in 5 minutes.</p>
        <p>If you didn't request this code, please ignore this email.</p>
      </div>
    `,
  });
}

export async function sendPasswordResetEmail(email: string, otp: string): Promise<void> {
  await sendEmail({
    to: email,
    subject: 'Reset your password - Homez',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Password Reset</h2>
        <p>Your password reset code is:</p>
        <h1 style="font-size: 32px; letter-spacing: 5px; color: #4F46E5;">${otp}</h1>
        <p>This code expires in 5 minutes.</p>
        <p>If you didn't request this, please ignore this email.</p>
      </div>
    `,
  });
}

export function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}
