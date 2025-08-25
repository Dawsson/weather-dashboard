import { env } from '@/env';

export default function Terms() {
  return (
    <div className="prose dark:prose-invert container mx-auto max-w-3xl px-4 py-12">
      <h1>{env.NEXT_PUBLIC_PROJECT_NAME} Terms of Service</h1>
      <p>
        <strong>Effective Date: August 25, 2025</strong>
      </p>

      <p>
        Welcome to <strong>{env.NEXT_PUBLIC_PROJECT_NAME}</strong>, a weather dashboard service. By accessing or using our service, you agree to be bound by these Terms of Service and our Privacy Policy.
      </p>

      <h2>1. Service Description</h2>
      <p>
        {env.NEXT_PUBLIC_PROJECT_NAME} provides real-time weather information, city search functionality, and the ability to save favorite locations. Our service integrates with third-party weather data providers to deliver accurate weather conditions.
      </p>

      <h2>2. User Accounts</h2>
      <p>
        To access certain features, you may need to create an account. You are responsible for:
      </p>
      <ul>
        <li>Maintaining the confidentiality of your account credentials</li>
        <li>All activities that occur under your account</li>
        <li>Providing accurate and up-to-date information</li>
        <li>Notifying us of any unauthorized use of your account</li>
      </ul>

      <h2>3. Acceptable Use</h2>
      <p>
        You agree to use {env.NEXT_PUBLIC_PROJECT_NAME} only for lawful purposes. You may not:
      </p>
      <ul>
        <li>Attempt to gain unauthorized access to our systems or other users' accounts</li>
        <li>Use automated systems to make excessive requests to our service</li>
        <li>Interfere with or disrupt the service or servers</li>
        <li>Use the service for any commercial purposes without permission</li>
        <li>Violate any applicable local, state, or international laws</li>
      </ul>

      <h2>4. Service Availability</h2>
      <p>
        While we strive to maintain high availability, {env.NEXT_PUBLIC_PROJECT_NAME} is provided on an "as is" basis. We do not guarantee:
      </p>
      <ul>
        <li>Continuous, uninterrupted, or error-free operation</li>
        <li>Accuracy of weather data (which depends on third-party providers)</li>
        <li>Availability during maintenance, updates, or technical issues</li>
      </ul>

      <h2>5. Weather Data Disclaimer</h2>
      <p>
        Weather information is provided by third-party services and is for informational purposes only. You should not rely solely on this information for critical decisions. We are not responsible for any damages resulting from inaccurate or delayed weather data.
      </p>

      <h2>6. Intellectual Property</h2>
      <p>
        The {env.NEXT_PUBLIC_PROJECT_NAME} service, including its design, code, and original content, is owned by us and protected by intellectual property laws. Your favorite cities and preferences remain your data, but you grant us permission to store and process this information to provide our service.
      </p>

      <h2>7. Limitation of Liability</h2>
      <p>
        To the fullest extent permitted by law, we shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of profits, data, or other intangible losses resulting from your use of {env.NEXT_PUBLIC_PROJECT_NAME}.
      </p>

      <h2>8. Account Termination</h2>
      <p>
        We reserve the right to suspend or terminate accounts that violate these terms. You may delete your account at any time through the service settings.
      </p>

      <h2>9. Changes to Terms</h2>
      <p>
        We may modify these terms at any time. Significant changes will be communicated via email or service notification. Continued use of the service after changes constitutes acceptance of the new terms.
      </p>

      <h2>10. Contact Information</h2>
      <p>
        If you have questions about these Terms of Service, please contact us through the support channels provided in the application.
      </p>
    </div>
  );
}
