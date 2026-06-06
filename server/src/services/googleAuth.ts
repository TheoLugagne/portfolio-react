import { OAuth2Client } from 'google-auth-library';
import { env } from '../config/env';
import { forbidden } from '../utils/errors';

const client = new OAuth2Client(env.googleClientId);

export interface GoogleUser {
  googleId: string;
  email: string;
  name: string;
  avatarUrl: string | null;
}

export async function verifyGoogleCredential(
  credential: string
): Promise<GoogleUser> {
  const ticket = await client.verifyIdToken({
    idToken: credential,
    audience: env.googleClientId,
  });

  const payload = ticket.getPayload();
  if (!payload) {
    throw forbidden('Invalid Google token payload');
  }

  const email = payload.email?.toLowerCase();
  if (!email || !env.adminEmails.includes(email)) {
    throw forbidden('Email is not authorized for admin access');
  }

  return {
    googleId: payload.sub,
    email,
    name: payload.name || email,
    avatarUrl: payload.picture || null,
  };
}
