import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { resend } from '@/lib/resend';
import { z } from 'zod';
import fs from 'fs/promises';
import path from 'path';

const UserSchema = z.object({
  email: z.string().email().max(50),
  message: z.string(),
});

const getDate = () => {
  const date = new Date().toDateString();
  const arr = date.split(' ');
  arr[0] = arr[0] + ',';
  return arr.join(' ');
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const InputValidation = UserSchema.safeParse(body);

    if (!InputValidation.success) {
      return NextResponse.json(
        {
          message: 'Zod validation failed',
          error: InputValidation.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { email, message } = InputValidation.data;

    // Save to database
    await prisma.users.create({
      data: { email: email, message: message },
    });

    // Read and prepare email template
    const templatePath = path.join(process.cwd(), 'lib', 'email-template.html');
    let htmlTemplate = await fs.readFile(templatePath, 'utf-8');

    htmlTemplate = htmlTemplate
      .replaceAll('{{email}}', email)
      .replace('{{message}}', message)
      .replace('{{date}}', getDate());

    // Send email
    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: 'thesatishydv@gmail.com',
      subject: `Hey Satish you got a message from ${email}`,
      html: htmlTemplate,
    });

    return NextResponse.json({
      success: true,
      message: 'Data added to the DB',
    });
  } catch (error) {
    console.error('Error occurred while adding data to DB: ', error);

    return NextResponse.json(
      {
        success: false,
        message: 'An error occurred while processing your request',
      },
      { status: 500 }
    );
  }
}
