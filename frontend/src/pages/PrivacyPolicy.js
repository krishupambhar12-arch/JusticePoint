import React from "react";
import Header from "../components/header";
import Footer from "../components/footer";
import "../styles/legalPages.css";

const PrivacyPolicy = () => {
  return (
    <>
      <Header />
      <div className="legal-page">
        <div className="legal-container">
          <h1>Privacy Policy</h1>
          <div className="legal-content">
            <p><strong>Last Updated:</strong> {new Date().toLocaleDateString()}</p>
            
            <h2>1. Introduction</h2>
            <p>
              Welcome to Justice Point. We respect your privacy and are committed to protecting your personal data. 
              This privacy policy explains how we collect, use, and protect your information when you use our 
              legal consultation platform.
            </p>

            <h2>2. Information We Collect</h2>
            <h3>Personal Information:</h3>
            <ul>
              <li>Name and contact details (email, phone number)</li>
              <li>Professional information (for attorneys)</li>
              <li>Case-related information and documents</li>
              <li>Payment and billing information</li>
              <li>Login credentials and authentication data</li>
            </ul>

            <h3>Technical Information:</h3>
            <ul>
              <li>IP address and device information</li>
              <li>Browser type and version</li>
              <li>Pages visited and time spent on our platform</li>
              <li>Cookies and similar tracking technologies</li>
            </ul>

            <h2>3. How We Use Your Information</h2>
            <p>We use your information to:</p>
            <ul>
              <li>Provide legal consultation services</li>
              <li>Connect clients with qualified attorneys</li>
              <li>Process payments and manage subscriptions</li>
              <li>Send important notifications and updates</li>
              <li>Improve our services and user experience</li>
              <li>Ensure platform security and prevent fraud</li>
              <li>Comply with legal obligations</li>
            </ul>

            <h2>4. Data Sharing and Disclosure</h2>
            <p>We may share your information with:</p>
            <ul>
              <li>Attorneys you choose to consult with</li>
              <li>Payment processors for transaction processing</li>
              <li>Legal authorities when required by law</li>
              <li>Service providers who assist in platform operations</li>
            </ul>
            <p>We never sell your personal information to third parties for marketing purposes.</p>

            <h2>5. Data Security</h2>
            <p>
              We implement appropriate technical and organizational measures to protect your data, including:
            </p>
            <ul>
              <li>SSL encryption for data transmission</li>
              <li>Secure servers with limited access</li>
              <li>Regular security audits and updates</li>
              <li>Employee training on data protection</li>
            </ul>

            <h2>6. Your Rights</h2>
            <p>You have the right to:</p>
            <ul>
              <li>Access your personal information</li>
              <li>Correct inaccurate information</li>
              <li>Delete your account and data</li>
              <li>Restrict processing of your data</li>
              <li>Data portability</li>
              <li>Withdraw consent where applicable</li>
            </ul>

            <h2>7. Cookies</h2>
            <p>
              We use cookies to enhance your experience, analyze site traffic, and personalize content. 
              You can control cookie settings through your browser preferences.
            </p>

            <h2>8. Children's Privacy</h2>
            <p>
              Our services are not intended for individuals under 18 years of age. We do not knowingly 
              collect information from children under 18.
            </p>

            <h2>9. International Data Transfers</h2>
            <p>
              Your information may be transferred to and processed in countries other than your own. 
              We ensure appropriate safeguards are in place for such transfers.
            </p>

            <h2>10. Changes to This Policy</h2>
            <p>
              We may update this privacy policy from time to time. We will notify you of any significant 
              changes by posting the new policy on our platform and updating the "Last Updated" date.
            </p>

            <h2>11. Contact Us</h2>
            <p>
              If you have questions about this privacy policy or our data practices, please contact us at:
            </p>
            <ul>
              <li>Email: justicepoint@gmail.com</li>
              <li>Phone: +86 21 2412 6000</li>
              <li>Address: 17th Floor, One ICC, Shanghai ICC, 999 Middle Huai Hai Road, Xuhui District, Shanghai, 200031</li>
            </ul>

            <h2>12. Governing Law</h2>
            <p>
              This privacy policy is governed by the laws of the jurisdiction in which Justice Point operates, 
              without regard to conflict of law principles.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default PrivacyPolicy;
