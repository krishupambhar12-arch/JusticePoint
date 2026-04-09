import React from "react";
import Header from "../components/header";
import Footer from "../components/footer";
import "../styles/legalPages.css";

const CookiePolicy = () => {
  return (
    <>
      <Header />
      <div className="legal-page">
        <div className="legal-container">
          <h1>Cookie Policy</h1>
          <div className="legal-content">
            <p><strong>Last Updated:</strong> {new Date().toLocaleDateString()}</p>
            
            <h2>1. What Are Cookies</h2>
            <p>
              Cookies are small text files that are stored on your device (computer, tablet, or mobile) 
              when you visit a website. They help the website remember information about your visit and 
              improve your experience on future visits.
            </p>

            <h2>2. How We Use Cookies</h2>
            <p>Justice Point uses cookies for the following purposes:</p>
            
            <h3>Essential Cookies:</h3>
            <ul>
              <li>Maintain user session and login state</li>
              <li>Remember your preferences and settings</li>
              <li>Enable secure communication between you and attorneys</li>
              <li>Process payments and transactions securely</li>
            </ul>

            <h3>Performance Cookies:</h3>
            <ul>
              <li>Analyze website traffic and usage patterns</li>
              <li>Identify popular pages and features</li>
              <li>Monitor website performance and stability</li>
              <li>Detect and fix technical issues</li>
            </ul>

            <h3>Functional Cookies:</h3>
            <ul>
              <li>Remember your language and region preferences</li>
              <li>Save your search criteria and filters</li>
              <li>Enable personalized content recommendations</li>
              <li>Support chat and communication features</li>
            </ul>

            <h3>Marketing Cookies:</h3>
            <ul>
              <li>Deliver relevant advertisements</li>
              <li>Track marketing campaign effectiveness</li>
              <li>Personalize content based on your interests</li>
              <li>Measure conversion rates and user engagement</li>
            </ul>

            <h2>3. Types of Cookies We Use</h2>
            
            <h3>Session Cookies:</h3>
            <p>
              These cookies are temporary and are deleted when you close your browser. They help us 
              track your movement through the website during a single session.
            </p>

            <h3>Persistent Cookies:</h3>
            <p>
              These cookies remain on your device for a specified period or until you delete them. 
              They help us recognize you when you return to our website.
            </p>

            <h3>First-Party Cookies:</h3>
            <p>
              These are set by Justice Point and are used to remember your preferences and improve 
              your experience on our platform.
            </p>

            <h3>Third-Party Cookies:</h3>
            <p>
              These are set by external services we use, such as analytics providers, payment processors, 
              and social media platforms.
            </p>

            <h2>4. Managing Your Cookie Preferences</h2>
            
            <h3>Browser Settings:</h3>
            <p>You can control cookies through your browser settings:</p>
            <ul>
              <li>Accept all cookies</li>
              <li>Reject all cookies</li>
              <li>Delete existing cookies</li>
              <li>Set notifications when cookies are sent</li>
            </ul>

            <h3>Cookie Consent Banner:</h3>
            <p>
              When you first visit Justice Point, you'll see a cookie consent banner where you can:
            </p>
            <ul>
              <li>Accept all cookies for the best experience</li>
              <li>Customize your cookie preferences</li>
              <li>Reject non-essential cookies</li>
              <li>Change your preferences at any time</li>
            </ul>

            <h2>5. Third-Party Services</h2>
            <p>We use the following third-party services that may set cookies:</p>
            
            <h3>Analytics Services:</h3>
            <ul>
              <li>Google Analytics - for website traffic analysis</li>
              <li>Hotjar - for user behavior analysis</li>
              <li>Mixpanel - for product analytics</li>
            </ul>

            <h3>Payment Processors:</h3>
            <ul>
              <li>Stripe - for secure payment processing</li>
              <li>PayPal - for alternative payment options</li>
              <li>Razorpay - for regional payment processing</li>
            </ul>

            <h3>Communication Services:</h3>
            <ul>
              <li>Twilio - for SMS notifications</li>
              <li>SendGrid - for email communications</li>
              <li>Intercom - for customer support chat</li>
            </ul>

            <h2>6. Cookie Duration</h2>
            <p>Different cookies have different lifespans:</p>
            <ul>
              <li>Session cookies: Deleted when browser is closed</li>
              <li>Persistent cookies: 30 days to 2 years</li>
              <li>Authentication cookies: 24 hours to 30 days</li>
              <li>Analytics cookies: 2 years</li>
              <li>Marketing cookies: 90 days to 1 year</li>
            </ul>

            <h2>7. Your Rights Regarding Cookies</h2>
            <p>You have the right to:</p>
            <ul>
              <li>Know what cookies are being used</li>
              <li>Accept or reject cookies</li>
              <li>Withdraw consent at any time</li>
              <li>Delete cookies from your device</li>
              <li>Access information about cookie usage</li>
            </ul>

            <h2>8. Impact of Disabling Cookies</h2>
            <p>If you disable cookies:</p>
            <ul>
              <li>Some features may not work properly</li>
              <li>You may need to log in more frequently</li>
              <li>Personalized content may be limited</li>
              <li>Website performance may be affected</li>
              <li>Some third-party integrations may not function</li>
            </ul>

            <h2>9. Children and Cookies</h2>
            <p>
              Our services are not intended for children under 18. We do not knowingly collect 
              information from children, including through cookies. Parents should monitor their 
              children's internet usage and cookie settings.
            </p>

            <h2>10. International Data Transfers</h2>
            <p>
              Some cookies may transfer data to servers in other countries. We ensure that 
              appropriate safeguards are in place for international data transfers in accordance 
              with applicable data protection laws.
            </p>

            <h2>11. Changes to This Cookie Policy</h2>
            <p>
              We may update this cookie policy from time to time to reflect changes in our 
              cookie practices or legal requirements. We will notify you of any significant changes 
              by posting the updated policy on our website.
            </p>

            <h2>12. Contact Us</h2>
            <p>
              If you have questions about our cookie policy or need help managing your cookie 
              preferences, please contact us:
            </p>
            <ul>
              <li>Email: justicepoint@gmail.com</li>
              <li>Phone: +86 21 2412 6000</li>
              <li>Address: 17th Floor, One ICC, Shanghai ICC, 999 Middle Huai Hai Road, Xuhui District, Shanghai, 200031</li>
            </ul>

            <h2>13. Legal Framework</h2>
            <p>
              This cookie policy complies with:
            </p>
            <ul>
              <li>General Data Protection Regulation (GDPR)</li>
              <li>California Consumer Privacy Act (CCPA)</li>
              <li>ePrivacy Directive</li>
              <li>Local data protection laws</li>
            </ul>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default CookiePolicy;
