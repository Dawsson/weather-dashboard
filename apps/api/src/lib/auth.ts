import { betterAuth } from 'better-auth';
import { mongodbAdapter } from 'better-auth/adapters/mongodb';
import { env } from '@/env';
import { database } from '@/shared/database';
import { sendResetPasswordEmail, sendVerificationEmail } from './email';

const db = database.getClient().db();

export const auth = betterAuth({
  database: mongodbAdapter(db),

  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    sendResetPassword: async ({ user, token }) => {
      const resetUrl = `${env.NEXT_PUBLIC_WEBSITE_URL}/auth/reset-password?token=${token}`;
      const result = await sendResetPasswordEmail({
        email: user.email,
        verificationUrl: resetUrl,
      });

      if (result.error) {
        // Log error but don't throw - email sending is not critical
      }
    },
  },

  emailVerification: {
    sendOnSignUp: true,
    expiresIn: 60 * 60 * 1, // 1 HOUR
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, token }) => {
      const verificationUrl = `${env.NEXT_PUBLIC_WEBSITE_URL}/?email=${token}`;
      try {
        await sendVerificationEmail({
          email: user.email,
          verificationUrl,
        });
      } catch (_error) {
        // Log error but don't throw - email sending is not critical
      }
    },
  },

  trustedOrigins: [env.NEXT_PUBLIC_WEBSITE_URL],

  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day (every 1 day the session expiration is updated)
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // Cache duration in seconds
    },
  },

  advanced: {
    crossSubDomainCookies: {
      enabled: true,
      domain:
        env.NEXT_PUBLIC_NODE_ENV === 'development'
          ? 'localhost'
          : `.${env.NEXT_PUBLIC_HOSTNAME}`,
    },
    defaultCookieAttributes: {
      secure: true,
      httpOnly: true,
      sameSite: 'none', // Allows CORS-based cookie sharing across subdomains
      partitioned: true, // New browser standards will mandate this for foreign cookies
    },

    cookiePrefix: env.NEXT_PUBLIC_PROJECT_NAME,
  },

  // Preconfigured social providers, remove if not needed
  socialProviders: {
    // discord: {
    //   clientId: env.DISCORD_CLIENT_ID,
    //   clientSecret: env.DISCORD_CLIENT_SECRET,
    //   mapProfileToUser: async (profile) => {
    //     const sanitizedUsername = sanitizeUsername(profile.username);
    //     const uniqueUsername = await getNextBestUsername(sanitizedUsername);
    //     return {
    //       username: uniqueUsername.toLowerCase(),
    //       displayUsername: uniqueUsername,
    //     };
    //   },
    // },
    // github: {
    //   clientId: env.GITHUB_CLIENT_ID,
    //   clientSecret: env.GITHUB_CLIENT_SECRET,
    //   mapProfileToUser: async (profile) => {
    //     const sanitizedUsername = sanitizeUsername(profile.name);
    //     const uniqueUsername = await getNextBestUsername(sanitizedUsername);
    //     return {
    //       username: uniqueUsername.toLowerCase(),
    //       displayUsername: uniqueUsername,
    //     };
    //   },
    // },
    // google: {
    //   clientId: env.GOOGLE_CLIENT_ID,
    //   clientSecret: env.GOOGLE_CLIENT_SECRET,
    //   mapProfileToUser: async (profile) => {
    //     const sanitizedUsername = sanitizeUsername(
    //       profile.email.split("@")[0] ?? "",
    //     );
    //     const uniqueUsername = await getNextBestUsername(sanitizedUsername);
    //     return {
    //       username: uniqueUsername.toLowerCase(),
    //       displayUsername: uniqueUsername,
    //     };
    //   },
    // },
  },

  user: {
    additionalFields: {},
  },

  rateLimit: {
    window: 30, // time window in seconds
    max: 100, // max requests in the window
  },
});

export function sanitizeUsername(username: string) {
  return username.replace(/[^a-zA-Z0-9_.]/g, '').substring(0, 20);
}

async function _getNextBestUsername(username: string) {
  // Check if username exists
  const exists = await db
    .collection('user')
    .findOne({ username: username.toLowerCase() });

  if (!exists) {
    return username;
  }

  // Try adding numbers - check all at once for better performance
  const suggestions = Array.from(
    { length: 99 },
    (_, i) => `${username}${i + 1}`
  );

  const takenUsernames = await db
    .collection('user')
    .find({ username: { $in: suggestions.map((s) => s.toLowerCase()) } })
    .toArray();

  const takenSet = new Set(takenUsernames.map((u) => u.username));

  for (const suggestion of suggestions) {
    if (!takenSet.has(suggestion.toLowerCase())) {
      return suggestion;
    }
  }

  // If still not available, add random suffix
  const final = `${username}_${Math.random().toString(36).substring(2, 5)}`;

  return final;
}
