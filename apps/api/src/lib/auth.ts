import { betterAuth } from 'better-auth';
import { mongodbAdapter } from 'better-auth/adapters/mongodb';
import { env } from '@/env';
import { database } from '@/shared/database';

const db = database.getClient().db();

export const auth = betterAuth({
  database: mongodbAdapter(db),

  emailAndPassword: {
    enabled: true,
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
