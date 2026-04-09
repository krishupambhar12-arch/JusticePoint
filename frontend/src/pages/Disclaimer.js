import React from "react";
import Header from "../components/header";
import Footer from "../components/footer";
import "../styles/legalPages.css";

const Disclaimer = () => {
  return (
    <>
      <Header />
      <div className="legal-page">
        <div className="legal-container">
          <h1>Disclaimer</h1>
          <div className="legal-content">
            <p><strong>Last Updated:</strong> {new Date().toLocaleDateString()}</p>
            
            <h2>1. General Disclaimer</h2>
            <p>
              The information provided on Justice Point ("the Platform") is for general informational 
              purposes only. While we strive to provide accurate and up-to-date information, we make 
              no warranties or representations of any kind, express or implied, about the completeness, 
              accuracy, reliability, or availability of the information.
            </p>

            <h2>2. Legal Advice Disclaimer</h2>
            <p>
              <strong>IMPORTANT:</strong> Justice Point is not a law firm and does not provide legal advice. 
              The platform serves as a connection service between clients and qualified attorneys.
            </p>
            
            <h3>What We Do:</h3>
            <ul>
              <li>Connect clients with licensed attorneys</li>
              <li>Facilitate communication between parties</li>
              <li>Provide scheduling and management tools</li>
              <li>Offer educational legal information</li>
            </ul>

            <h3>What We Don't Do:</h3>
            <ul>
              <li>Provide legal advice or counsel</li>
              <li>Represent clients in legal matters</li>
              <li>Guarantee legal outcomes</li>
              <li>Establish attorney-client relationships directly</li>
            </ul>

            <h2>3. Attorney Services Disclaimer</h2>
            <p>
              Attorneys on the Justice Point platform are independent professionals. Justice Point 
              does not endorse, guarantee, or make any representations about the quality of legal 
              services provided by any attorney.
            </p>

            <h3>Attorney Qualifications:</h3>
            <ul>
              <li>We verify attorney licenses and credentials</li>
              <li>We cannot guarantee specific expertise in all areas</li>
              <li>Attorney profiles are self-reported</li>
              <li>Users should conduct their own due diligence</li>
            </ul>

            <h3>Service Quality:</h3>
            <ul>
              <li>Legal outcomes depend on many factors</li>
              <li>No attorney can guarantee specific results</li>
              <li>Service quality varies by attorney</li>
              <li>User experiences may differ</li>
            </ul>

            <h2>4. Financial and Investment Disclaimer</h2>
            <p>
              Any financial information, investment advice, or business recommendations provided 
              through the platform are for educational purposes only. Users should consult with 
              qualified financial advisors before making any financial decisions.
            </p>

            <h2>5. Medical and Healthcare Disclaimer</h2>
            <p>
              The platform may contain information related to medical law, healthcare regulations, 
              or similar topics. This information is not medical advice. Users should consult with 
              qualified healthcare professionals for medical concerns.
            </p>

            <h2>6. Third-Party Content Disclaimer</h2>
            <p>
              Justice Point may contain links to third-party websites, resources, or services. 
              We are not responsible for the content, accuracy, or availability of external sites.
            </p>

            <h3>External Links:</h3>
            <ul>
              <li>We do not endorse third-party websites</li>
              <li>External sites have their own terms and privacy policies</li>
              <li>We are not liable for external content</li>
              <li>Users access third-party sites at their own risk</li>
            </ul>

            <h2>7. Platform Availability Disclaimer</h2>
            <p>
              While we strive to maintain 99% uptime, we cannot guarantee uninterrupted service. 
              The platform may be temporarily unavailable due to:
            </p>
            <ul>
              <li>Scheduled maintenance</li>
              <li>Technical issues or outages</li>
              <li>Force majeure events</li>
              <li>System upgrades or updates</li>
            </ul>

            <h2>8. Security Disclaimer</h2>
            <p>
              We implement industry-standard security measures, but no system is completely secure. 
              Users should:
            </p>
            <ul>
              <li>Protect their login credentials</li>
              <li>Use strong, unique passwords</li>
              <li>Enable two-factor authentication when available</li>
              <li>Report suspicious activity immediately</li>
            </ul>

            <h2>9. Confidentiality Limitations</h2>
            <p>
              While we strive to maintain confidentiality, users should be aware that:
            </p>
            <ul>
              <li>Digital communications have inherent risks</li>
              <li>Attorney-client privilege applies only after formal engagement</li>
              <li>Platform communications may be subject to legal requests</li>
              <li>Users should avoid sharing highly sensitive information initially</li>
            </ul>

            <h2>10. Geographic Limitations</h2>
            <p>
              Legal services are jurisdiction-specific. Attorneys on the platform are licensed 
              in specific jurisdictions and may only provide services in those areas. Users should:
            </p>
            <ul>
              <li>Verify attorney licensing in their jurisdiction</li>
              <li>Understand local legal requirements</li>
              <li>Consider location-based limitations</li>
              <li>Consult local attorneys when necessary</li>
            </ul>

            <h2>11. No Warranty Disclaimer</h2>
            <p>
              Justice Point provides the platform "as is" without any warranties, express or implied, 
              including but not limited to:
            </p>
            <ul>
              <li>Merchantability</li>
              <li>Fitness for a particular purpose</li>
              <li>Non-infringement</li>
              <li>Title or quiet enjoyment</li>
            </ul>

            <h2>12. Limitation of Liability</h2>
            <p>
              To the fullest extent permitted by law, Justice Point shall not be liable for:
            </p>
            <ul>
              <li>Direct, indirect, or consequential damages</li>
              <li>Lost profits or opportunities</li>
              <li>Legal advice provided by attorneys</li>
              <li>Outcomes of legal proceedings</li>
              <li>Data loss or corruption</li>
              <li>Service interruptions or delays</li>
            </ul>

            <h2>13. Indemnification</h2>
            <p>
              Users agree to indemnify and hold Justice Point harmless from:
            </p>
            <ul>
              <li>Claims arising from user conduct</li>
              <li>Violations of these terms</li>
              <li>Infringement of third-party rights</li>
              <li>Unauthorized use of the platform</li>
            </ul>

            <h2>14. User Responsibility</h2>
            <p>
              Users are responsible for:
            </p>
            <ul>
              <li>Verifying information independently</li>
              <li>Making informed decisions</li>
              <li>Seeking appropriate professional advice</li>
              <li>Understanding legal implications</li>
              <li>Protecting their own interests</li>
            </ul>

            <h2>15. Emergency Situations</h2>
            <p>
              Justice Point is not appropriate for emergency legal situations. For emergencies, 
              users should:
            </p>
            <ul>
              <li>Contact local emergency services</li>
              <li>Seek immediate legal counsel</li>
              <li>Visit appropriate government agencies</li>
              <li>Contact local bar associations</li>
            </ul>

            <h2>16. Professional Relationships</h2>
            <p>
              Formal attorney-client relationships are established directly between clients and 
              attorneys, not through Justice Point. The platform merely facilitates connections.
            </p>

            <h2>17. Changes to Services</h2>
            <p>
              We reserve the right to modify, suspend, or discontinue any aspect of the platform 
              without notice. We are not liable for changes to services or features.
            </p>

            <h2>18. Governing Law</h2>
            <p>
              This disclaimer is governed by the laws of the jurisdiction in which Justice Point 
              operates, without regard to conflict of law principles.
            </p>

            <h2>19. Severability</h2>
            <p>
              If any provision of this disclaimer is found to be unenforceable, the remaining 
              provisions shall remain in full force and effect.
            </p>

            <h2>20. Contact Information</h2>
            <p>
              For questions about this disclaimer or our services, please contact us:
            </p>
            <ul>
              <li>Email: justicepoint@gmail.com</li>
              <li>Phone: +86 21 2412 6000</li>
              <li>Address: 17th Floor, One ICC, Shanghai ICC, 999 Middle Huai Hai Road, Xuhui District, Shanghai, 200031</li>
            </ul>

            <h2>21. Acknowledgment</h2>
            <p>
              By using Justice Point, you acknowledge that you have read, understood, and agree 
              to this disclaimer. You understand that we are not providing legal advice and that 
              you should consult with qualified legal professionals for your specific needs.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Disclaimer;
