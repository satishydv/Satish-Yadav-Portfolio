'use server';

import { createHash, timingSafeEqual } from 'crypto';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const COOKIE_NAME = 'portfolio-admin-session';
const FALLBACK_ADMIN_PASSWORD = 'Apple@12345';

export type LoginState = {
  error: string;
};

function getAdminPassword() {
  return process.env.ADMIN_PASSWORD || FALLBACK_ADMIN_PASSWORD;
}

function getSessionToken() {
  return createHash('sha256').update(`satish-portfolio-admin:${getAdminPassword()}`).digest('hex');
}

export async function isAdminAuthenticated() {
  const cookieStore = await cookies();
  const session = cookieStore.get(COOKIE_NAME)?.value;
  if (!session) return false;

  const expected = getSessionToken();
  const actualBuffer = Buffer.from(session);
  const expectedBuffer = Buffer.from(expected);

  return (
    actualBuffer.length === expectedBuffer.length && timingSafeEqual(actualBuffer, expectedBuffer)
  );
}

export async function loginAdmin(
  _previousState: LoginState,
  formData: FormData
): Promise<LoginState> {
  const submittedPassword = String(formData.get('password') ?? '');
  const supplied = Buffer.from(submittedPassword);
  const expected = Buffer.from(getAdminPassword());
  const matches = supplied.length === expected.length && timingSafeEqual(supplied, expected);

  if (!matches) {
    return { error: 'That password is not correct. Please try again.' };
  }

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, getSessionToken(), {
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
    path: '/admin',
    maxAge: 60 * 60 * 12,
  });

  redirect('/admin');
}

export async function logoutAdmin() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
  redirect('/admin');
}
