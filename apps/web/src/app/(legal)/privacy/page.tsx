import { env } from '@/env';

export default function Privacy() {
  return (
    <div className="prose dark:prose-invert container mx-auto max-w-3xl px-4 py-12">
      <h1>{env.NEXT_PUBLIC_PROJECT_NAME} Privacy Policy</h1>
      <p>
        <strong>Effective Date: August 25, 2025</strong>
      </p>

      <p>
        At {env.NEXT_PUBLIC_PROJECT_NAME}, we take your privacy seriously. This policy outlines how we collect, use, and protect your data when you use our weather dashboard service.
      </p>

      <h2>1. Information We Collect</h2>
      <p>We collect the following information to provide our weather service:</p>
      <ul>
        <li><strong>Account Information:</strong> Email address and password (encrypted) for user authentication</li>
        <li><strong>Favorite Cities:</strong> Cities you save to your favorites list, including city names and coordinates</li>
        <li><strong>Usage Data:</strong> Weather search queries and API usage patterns to improve service performance</li>
        <li><strong>Technical Data:</strong> IP address, browser type, and device information for security and analytics</li>
      </ul>

      <h2>2. How We Use Your Information</h2>
      <p>We use your data solely to:</p>
      <ul>
        <li>Provide weather information for your requested locations</li>
        <li>Save and manage your favorite cities</li>
        <li>Authenticate your account and ensure service security</li>
        <li>Improve our weather service performance and user experience</li>
        <li>Send important service updates or security notifications</li>
      </ul>

      <h2>3. Data Sharing and Third Parties</h2>
      <p>
        We do not sell, rent, or trade your personal information. We use the following third-party services:
      </p>
      <ul>
        <li><strong>OpenWeatherMap API:</strong> To retrieve weather data (only coordinates are shared, not personal information)</li>
        <li><strong>Database and hosting providers:</strong> To securely store your account and preferences</li>
      </ul>

      <h2>4. Data Security and Storage</h2>
      <p>
        We implement industry-standard security measures to protect your data:
      </p>
      <ul>
        <li>Passwords are encrypted using secure hashing algorithms</li>
        <li>Data transmission is protected with HTTPS encryption</li>
        <li>Access to user data is restricted to authorized personnel only</li>
        <li>Regular security audits and updates are performed</li>
      </ul>

      <h2>5. Your Rights and Choices</h2>
      <p>You have the right to:</p>
      <ul>
        <li>Access and review your personal information</li>
        <li>Update or correct your account details</li>
        <li>Delete your account and all associated data</li>
        <li>Export your favorite cities data</li>
      </ul>

      <h2>6. Data Retention</h2>
      <p>
        We retain your account information as long as your account is active. If you delete your account, all personal data will be permanently removed within 30 days.
      </p>

      <h2>7. Changes to This Policy</h2>
      <p>
        We may update this privacy policy to reflect changes in our practices or legal requirements. We will notify users of significant changes via email or service announcement.
      </p>

      <h2>8. Contact Us</h2>
      <p>
        If you have questions about this privacy policy or how we handle your data, please contact us through the support channels provided in the application.
      </p>
    </div>
  );
}
