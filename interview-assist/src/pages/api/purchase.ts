import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import nodemailer from 'nodemailer';

// Extend the built-in session type
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    }
  }
}

// Mock database for storing user licenses
const userLicenses: { [key: string]: { type: string, remainingTime: number } } = {};

// Create a transporter for sending emails
const transporter = nodemailer.createTransport({
  // Use a testing service like Mailtrap for development
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT || '2525'),
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const session = await getSession({ req });
  if (!session || !session.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const { type } = req.body;
  const userId = session.user.id;

  if (type !== 'trial' && type !== 'onehour') {
    return res.status(400).json({ message: 'Invalid license type' });
  }

  let remainingTime = 0;
  if (type === 'trial') {
    remainingTime = 5 * 60; // 5 minutes in seconds
  } else if (type === 'onehour') {
    remainingTime = 60 * 60; // 1 hour in seconds
  }

  userLicenses[userId] = { type, remainingTime };

  // TODO: Implement actual payment processing for the one-hour package

  // Send license details via email
  if (session.user.email) {
    try {
      await transporter.sendMail({
        from: '"InterviewAssist" <noreply@interviewassist.com>',
        to: session.user.email,
        subject: "Your InterviewAssist License",
        text: `Thank you for purchasing InterviewAssist ${type} package. Your remaining time is ${remainingTime} seconds.`,
        html: `
          <h1>Thank you for purchasing InterviewAssist!</h1>
          <p>Package: ${type}</p>
          <p>Remaining time: ${remainingTime} seconds</p>
          <p>If you need any assistance, please don't hesitate to contact our support team.</p>
        `,
      });
      console.log('License email sent successfully');
    } catch (error) {
      console.error('Error sending email:', error);
      // Don't return here, as we still want to send the license info to the client
    }
  } else {
    console.warn('User email not available. License details not sent via email.');
  }

  res.status(200).json({ message: 'License purchased successfully', remainingTime });
}
