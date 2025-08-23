import { EmailClient } from '@azure/communication-email';
import { env } from '@/env';

// Lazy-initialize email client only when needed and credentials exist
let emailClient: EmailClient | null = null;

function getEmailClient(): EmailClient | null {
  if (emailClient) {
    return emailClient;
  }

  if (!env.AZURE_COMMUNICATION_CONNECTION_STRING) {
    return null;
  }

  try {
    emailClient = new EmailClient(env.AZURE_COMMUNICATION_CONNECTION_STRING);
    return emailClient;
  } catch {
    return null;
  }
}

function logEmailToConsole(
  type: string,
  email: string,
  subject: string,
  content: string,
  from?: string
) {
  const border = '━'.repeat(40);
  // biome-ignore lint/suspicious/noConsole: Intentional console output for development email preview
  console.log(`\n🔔 [DEV EMAIL] ${type}`);
  // biome-ignore lint/suspicious/noConsole: Intentional console output for development email preview
  console.log(border);
  // biome-ignore lint/suspicious/noConsole: Intentional console output for development email preview
  console.log(`📧 To: ${email}`);
  if (from) {
    // biome-ignore lint/suspicious/noConsole: Intentional console output for development email preview
    console.log(`📤 From: ${from}`);
  }
  // biome-ignore lint/suspicious/noConsole: Intentional console output for development email preview
  console.log(`📋 Subject: ${subject}`);
  // biome-ignore lint/suspicious/noConsole: Intentional console output for development email preview
  console.log(border);
  // biome-ignore lint/suspicious/noConsole: Intentional console output for development email preview
  console.log(content);
  // biome-ignore lint/suspicious/noConsole: Intentional console output for development email preview
  console.log(border);
  // biome-ignore lint/suspicious/noConsole: Intentional console output for development email preview
  console.log(
    '✨ In production, this will be sent via Azure Communication Services\n'
  );
}

export const sendVerificationEmail = ({
  email,
  verificationUrl,
}: {
  email: string;
  verificationUrl: string;
}) => {
  const subject = 'Verify your email address';
  const content = `Thanks for joining ${env.NEXT_PUBLIC_PROJECT_NAME}!

To complete registration, please verify your email address:
${verificationUrl}`;

  // Development mode - log to console
  if (env.NODE_ENV === 'development') {
    logEmailToConsole(
      'Email Verification',
      email,
      subject,
      content,
      env.EMAIL_FROM
    );
    return;
  }

  // Production mode - send real email
  const client = getEmailClient();
  const senderAddress = env.EMAIL_FROM;

  if (!(client && senderAddress)) {
    // biome-ignore lint/suspicious/noConsole: Error logging is intentional
    console.error('Email configuration missing for production environment');
    return;
  }

  const emailMessage = {
    senderAddress,
    content: {
      subject,
      plainText: content,
    },
    recipients: {
      to: [
        {
          address: email,
        },
      ],
    },
  };

  // Fire and forget - don't wait for the email to complete
  client.beginSend(emailMessage).catch((_error) => {
    // Email sending failed - logged but not blocking
  });
};

export const sendResetPasswordEmail = ({
  email,
  verificationUrl,
}: {
  email: string;
  verificationUrl: string;
}): Promise<{ error?: string }> => {
  const subject = 'Reset your password';
  const content = `You requested a password reset for your ${env.NEXT_PUBLIC_PROJECT_NAME} account.

To reset your password, click the link below:
${verificationUrl}

If you didn't request this reset, you can safely ignore this email.`;

  // Development mode - log to console
  if (env.NODE_ENV === 'development') {
    logEmailToConsole(
      'Password Reset',
      email,
      subject,
      content,
      env.EMAIL_FROM
    );
    return Promise.resolve({});
  }

  // Production mode - send real email
  const client = getEmailClient();
  const senderAddress = env.EMAIL_FROM;

  if (!(client && senderAddress)) {
    return Promise.resolve({
      error: 'Email configuration missing for production environment',
    });
  }

  const emailMessage = {
    senderAddress,
    content: {
      subject,
      plainText: content,
    },
    recipients: {
      to: [
        {
          address: email,
        },
      ],
    },
  };

  // Fire and forget - don't wait for the email to complete
  client.beginSend(emailMessage).catch((_error) => {
    // Email sending failed - logged but not blocking
  });

  return Promise.resolve({}); // Return empty object on success
};
