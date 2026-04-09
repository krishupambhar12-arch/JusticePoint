import React from "react";
import Header from "../components/header";
import Footer from "../components/footer";
import "../styles/legalPages.css";

const TermsAndConditions = () => {
  return (
    <>
      <Header />
      <div className="legal-page">
        <div className="legal-container">
          <h1>Terms and Conditions</h1>
          <div className="legal-content">
            <p><strong>Last Updated:</strong> {new Date().toLocaleDateString()}</p>
            
            <h2>1. Acceptance of Terms</h2>
            <p>
              By accessing and using Justice Point ("the Platform"), you accept and agree to be bound by these 
              Terms and Conditions ("Terms"). If you do not agree to these Terms, please do not use our services.
            </p>

            <h2>2. About Justice Point</h2>
            <p>
              Justice Point is an online legal consultation platform that connects clients with qualified attorneys 
              for legal advice, consultation, and representation. We facilitate communication between clients and 
              legal professionals while maintaining confidentiality and professional standards.
            </p>

            <h2>3. User Accounts</h2>
            <h3>Registration:</h3>
            <ul>
              <li>You must provide accurate and complete information during registration</li>
              <li>You must be at least 18 years old to create an account</li>
              <li>You are responsible for maintaining the security of your account credentials</li>
              <li>You must notify us immediately of any unauthorized use of your account</li>
            </ul>

            <h3>Account Responsibilities:</h3>
            <ul>
              <li>Provide truthful information in your profile</li>
              <li>Maintain professional conduct when using the platform</li>
              <li>Not share login credentials with others</li>
              <li>Update your information when it changes</li>
            </ul>

            <h2>4. Services Provided</h2>
            <h3>For Clients:</h3>
            <ul>
              <li>Access to qualified attorneys for legal consultation</li>
              <li>Scheduling and managing appointments</li>
              <li>Secure communication with attorneys</li>
              <li>Document sharing and case management</li>
              <li>Payment processing for legal services</li>
            </ul>

            <h3>For Attorneys:</h3>
            <ul>
              <li>Platform to offer legal services to clients</li>
              <li>Client management and scheduling tools</li>
              <li>Secure communication channels</li>
              <li>Professional profile and reputation management</li>
              <li>Payment processing and financial management</li>
            </ul>

            <h2>5. Fees and Payments</h2>
            <h3>Service Fees:</h3>
            <ul>
              <li>Consultation fees vary by attorney and service type</li>
              <li>Platform fees may apply for certain services</li>
              <li>All fees are clearly displayed before booking</li>
              <li>Payment must be made in advance for scheduled consultations</li>
            </ul>

            <h3>Refund Policy:</h3>
            <ul>
              <li>Refunds are available for cancellations made 24 hours before appointment</li>
              <li>No refunds for no-shows or same-day cancellations</li>
              <li>Refund requests are reviewed on a case-by-case basis</li>
              <li>Platform fees are non-refundable unless service is unavailable</li>
            </ul>

            <h2>6. Attorney-Client Relationship</h2>
            <h3>Professional Standards:</h3>
            <ul>
              <li>Attorneys must maintain professional ethics and confidentiality</li>
              <li>All communications are protected by attorney-client privilege</li>
              <li>Attorneys must provide competent and diligent representation</li>
              <li>Conflicts of interest must be disclosed immediately</li>
            </ul>

            <h3>Scope of Services:</h3>
            <ul>
              <li>Services are limited to the agreed-upon scope of work</li>
              <li>Additional services require separate agreements</li>
              <li>Attorneys may decline cases outside their expertise</li>
              <li>Emergency legal services may have special terms</li>
            </ul>

            <h2>7. Confidentiality and Data Protection</h2>
            <p>
              All client information is treated as confidential and protected by attorney-client privilege. 
              We implement industry-standard security measures to protect your data. Please refer to our 
              Privacy Policy for detailed information about data handling.
            </p>

            <h2>8. Prohibited Activities</h2>
            <p>Users are strictly prohibited from:</p>
            <ul>
              <li>Providing false or misleading information</li>
              <li>Using the platform for illegal activities</li>
              <li>Harassing, threatening, or abusing other users</li>
              <li>Attempting to hack or disrupt platform operations</li>
              <li>Violating attorney-client privilege</li>
              <li>Engaging in unauthorized practice of law</li>
              <li>Sharing confidential information with third parties</li>
            </ul>

            <h2>9. Intellectual Property</h2>
            <p>
              All content on Justice Point, including text, graphics, logos, and software, is owned by 
              Justice Point or its licensors and is protected by copyright, trademark, and other intellectual 
              property laws. Users may not use our content without prior written permission.
            </p>

            <h2>10. Dispute Resolution</h2>
            <h3>Internal Resolution:</h3>
            <ul>
              <li>We encourage users to resolve disputes through direct communication</li>
              <li>Our support team is available to mediate conflicts</li>
              <li>Formal complaints must be submitted in writing</li>
              <li>We will investigate all complaints promptly and fairly</li>
            </ul>

            <h3>Legal Disputes:</h3>
            <ul>
              <li>Legal disputes are governed by the laws of our jurisdiction</li>
              <li>Users agree to submit to exclusive jurisdiction of our courts</li>
              <li>Attorney-client disputes may be subject to bar association rules</li>
              <li>Class action lawsuits are prohibited</li>
            </ul>

            <h2>11. Limitation of Liability</h2>
            <p>
              Justice Point is not liable for:
            </p>
            <ul>
              <li>Legal advice provided by attorneys on the platform</li>
              <li>Outcomes of legal cases or proceedings</li>
              <li>Technical issues or service interruptions</li>
              <li>Unauthorized access to user accounts</li>
              <li>Third-party content or services</li>
            </ul>
            <p>
              Our total liability shall not exceed the amount paid by the user in the preceding 12 months.
            </p>

            <h2>12. Termination</h2>
            <h3>User Termination:</h3>
            <ul>
              <li>Users may terminate their account at any time</li>
              <li>Outstanding fees must be paid before termination</li>
              <li>Client data will be deleted upon request</li>
              <li>Attorney profiles may be archived for record-keeping</li>
            </ul>

            <h3>Platform Termination:</h3>
            <ul>
              <li>We may terminate accounts for violations of these Terms</li>
              <li>We may suspend access during investigations</li>
              <li>We reserve the right to discontinue the platform</li>
              <li>Notice will be provided when possible</li>
            </ul>

            <h2>13. Service Availability</h2>
            <p>
              We strive to maintain 99% uptime but cannot guarantee uninterrupted service. 
              The platform may be temporarily unavailable for maintenance, updates, or technical issues.
            </p>

            <h2>14. Modifications to Terms</h2>
            <p>
              We reserve the right to modify these Terms at any time. Users will be notified of 
              significant changes via email or platform notifications. Continued use of the service 
              constitutes acceptance of modified Terms.
            </p>

            <h2>15. Contact Information</h2>
            <p>
              For questions about these Terms and Conditions, please contact us:
            </p>
            <ul>
              <li>Email: justicepoint@gmail.com</li>
              <li>Phone: +86 21 2412 6000</li>
              <li>Address: 17th Floor, One ICC, Shanghai ICC, 999 Middle Huai Hai Road, Xuhui District, Shanghai, 200031</li>
            </ul>

            <h2>16. Severability</h2>
            <p>
              If any provision of these Terms is found to be unenforceable, the remaining provisions 
              shall remain in full force and effect.
            </p>

            <h2>17. Entire Agreement</h2>
            <p>
              These Terms and Conditions, together with our Privacy Policy, constitute the entire 
              agreement between you and Justice Point regarding the use of our platform.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default TermsAndConditions;
