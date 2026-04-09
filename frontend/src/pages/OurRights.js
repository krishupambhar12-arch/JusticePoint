import React from "react";
import Header from "../components/header";
import Footer from "../components/footer";
import "../styles/legalPages.css";

const OurRights = () => {
  return (
    <>
      <Header />
      <div className="legal-page">
        <div className="legal-container">
          <h1>Our Legal Rights</h1>
          <div className="legal-content">
            <p><strong>Last Updated:</strong> {new Date().toLocaleDateString()}</p>
            
            <h2>Understanding Your Legal Rights</h2>
            <p>
              Legal rights are fundamental protections granted to individuals by law. Understanding these rights 
              is essential for ensuring justice, equality, and protection in various aspects of life. This guide 
              provides comprehensive information about different types of laws and how they work to protect citizens.
            </p>

            <h2>Types of Laws and Their Functions</h2>

            <h3>1. Constitutional Law</h3>
            <p><strong>What it is:</strong> The supreme law of the land that establishes the framework of government and fundamental rights.</p>
            <p><strong>How it works:</strong> Constitutional law defines the structure of government, divides power between different branches, and guarantees fundamental rights to citizens.</p>
            <p><strong>Key protections:</strong></p>
            <ul>
              <li>Freedom of speech and expression</li>
              <li>Right to equality and non-discrimination</li>
              <li>Right to life and personal liberty</li>
              <li>Freedom of religion</li>
              <li>Right to constitutional remedies</li>
            </ul>

            <h3>2. Criminal Law</h3>
            <p><strong>What it is:</strong> Law that deals with crimes and their punishments.</p>
            <p><strong>How it works:</strong> Criminal law defines offenses, establishes procedures for investigation and prosecution, and sets penalties for violations.</p>
            <p><strong>Key protections:</strong></p>
            <ul>
              <li>Right to fair trial</li>
              <li>Protection against unlawful arrest</li>
              <li>Right to bail</li>
              <li>Protection against double jeopardy</li>
              <li>Right to legal representation</li>
            </ul>

            <h3>3. Civil Law</h3>
            <p><strong>What it is:</strong> Law that deals with disputes between individuals or organizations.</p>
            <p><strong>How it works:</strong> Civil law provides mechanisms for resolving conflicts through compensation, injunctions, or specific performance.</p>
            <p><strong>Key protections:</strong></p>
            <ul>
              <li>Property rights protection</li>
              <li>Contract enforcement</li>
              <li>Tort claims for damages</li>
              <li>Family law protections</li>
              <li>Consumer rights</li>
            </ul>

            <h3>4. Family Law</h3>
            <p><strong>What it is:</strong> Law governing family relationships and domestic matters.</p>
            <p><strong>How it works:</strong> Family law addresses marriage, divorce, child custody, adoption, and other family-related legal issues.</p>
            <p><strong>Key protections:</strong></p>
            <ul>
              <li>Right to marriage and divorce</li>
              <li>Child custody and support rights</li>
              <li>Protection against domestic violence</li>
              <li>Inheritance rights</li>
              <li>Adoption regulations</li>
            </ul>

            <h3>5. Labor and Employment Law</h3>
            <p><strong>What it is:</strong> Law governing the relationship between employers and employees.</p>
            <p><strong>How it works:</strong> Labor law ensures fair working conditions, protects workers' rights, and regulates employment practices.</p>
            <p><strong>Key protections:</strong></p>
            <ul>
              <li>Minimum wage guarantees</li>
              <li>Working hour limitations</li>
              <li>Workplace safety standards</li>
              <li>Protection against discrimination</li>
              <li>Right to collective bargaining</li>
            </ul>

            <h3>6. Property Law</h3>
            <p><strong>What it is:</strong> Law governing ownership, use, and transfer of property.</p>
            <p><strong>How it works:</strong> Property law defines rights to real and personal property, regulates transfers, and resolves disputes.</p>
            <p><strong>Key protections:</strong></p>
            <ul>
              <li>Ownership rights</li>
              <li>Property transfer regulations</li>
              <li>Land use and zoning laws</li>
              <li>Rental and lease protections</li>
              <li>Eminent domain limitations</li>
            </ul>

            <h3>7. Consumer Protection Law</h3>
            <p><strong>What it is:</strong> Law protecting consumers from unfair business practices.</p>
            <p><strong>How it works:</strong> Consumer law ensures fair trade, product safety, and protects against fraud and deceptive practices.</p>
            <p><strong>Key protections:</strong></p>
            <ul>
              <li>Product safety standards</li>
              <li>False advertising protection</li>
              <li>Right to refunds and returns</li>
              <li>Protection against predatory lending</li>
              <li>Consumer complaint mechanisms</li>
            </ul>

            <h3>8. Environmental Law</h3>
            <p><strong>What it is:</strong> Law protecting the environment and natural resources.</p>
            <p><strong>How it works:</strong> Environmental law regulates pollution, conserves resources, and promotes sustainable practices.</p>
            <p><strong>Key protections:</strong></p>
            <ul>
              <li>Clean air and water standards</li>
              <li>Waste management regulations</li>
              <li>Wildlife protection</li>
              <li>Climate change mitigation</li>
              <li>Environmental impact assessments</li>
            </ul>

            <h3>9. Intellectual Property Law</h3>
            <p><strong>What it is:</strong> Law protecting creations of the mind.</p>
            <p><strong>How it works:</strong> IP law grants exclusive rights to creators for their inventions, artistic works, and innovations.</p>
            <p><strong>Key protections:</strong></p>
            <ul>
              <li>Patent rights for inventions</li>
              <li>Copyright for creative works</li>
              <li>Trademark protection</li>
              <li>Trade secret protection</li>
              <li>Right to fair use</li>
            </ul>

            <h3>10. Immigration Law</h3>
            <p><strong>What it is:</strong> Law governing entry, stay, and departure of foreign nationals.</p>
            <p><strong>How it works:</strong> Immigration law regulates visas, citizenship, asylum, and deportation procedures.</p>
            <p><strong>Key protections:</strong></p>
            <ul>
              <li>Right to due process in immigration</li>
              <li>Asylum and refugee protections</li>
              <li>Family reunification rights</li>
              <li>Work authorization protections</li>
              <li>Citizenship application rights</li>
            </ul>

            <h2>How Laws Protect Your Rights</h2>

            <h3>Legal Enforcement Mechanisms</h3>
            <p>Laws protect rights through various enforcement mechanisms:</p>
            <ul>
              <li><strong>Police and Law Enforcement:</strong> Investigate crimes and maintain order</li>
              <li><strong>Courts and Judiciary:</strong> Interpret laws and administer justice</li>
              <li><strong>Regulatory Agencies:</strong> Enforce specific laws and regulations</li>
              <li><strong>Legal Professionals:</strong> Provide representation and advice</li>
              <li><strong>Civil Society Organizations:</strong> Monitor and advocate for rights</li>
            </ul>

            <h3>Legal Remedies</h3>
            <p>When rights are violated, legal remedies include:</p>
            <ul>
              <li><strong>Compensation:</strong> Monetary damages for losses</li>
              <li><strong>Injunctions:</strong> Court orders to stop or require actions</li>
              <li><strong>Declaratory Relief:</strong> Court declarations of rights</li>
              <li><strong>Specific Performance:</strong> Court-ordered fulfillment of obligations</li>
              <li><strong>Punitive Damages:</strong> Additional damages to punish wrongdoing</li>
            </ul>

            <h2>Exercising Your Legal Rights</h2>

            <h3>Steps to Protect Your Rights</h3>
            <ol>
              <li><strong>Know Your Rights:</strong> Educate yourself about relevant laws</li>
              <li><strong>Document Everything:</strong> Keep records of violations</li>
              <li><strong>Seek Legal Advice:</strong> Consult with qualified attorneys</li>
              <li><strong>File Complaints:</strong> Report violations to appropriate authorities</li>
              <li><strong>Pursue Legal Action:</strong> Use courts and legal processes</li>
            </ol>

            <h3>Legal Resources</h3>
            <p>Available resources for legal assistance:</p>
            <ul>
              <li>Legal aid organizations for low-income individuals</li>
              <li>Bar association referral services</li>
              <li>Government legal assistance programs</li>
              <li>Online legal information portals</li>
              <li>Community legal clinics</li>
            </ul>

            <h2>Special Protections</h2>

            <h3>Vulnerable Groups</h3>
            <p>Special legal protections exist for:</p>
            <ul>
              <li><strong>Children:</strong> Juvenile justice, child protection laws</li>
              <li><strong>Elderly:</strong> Elder abuse protection, social security</li>
              <li><strong>Disabled:</strong> Accessibility rights, discrimination protection</li>
              <li><strong>Minorities:</strong> Anti-discrimination laws, equal opportunity</li>
              <li><strong>Women:</strong> Gender equality, protection against violence</li>
            </ul>

            <h3>Emergency Situations</h3>
            <p>Special rights during emergencies include:</p>
            <ul>
              <li>Right to emergency medical care</li>
              <li>Protection against unlawful detention</li>
              <li>Right to communicate with legal counsel</li>
              <li>Protection of property during disasters</li>
              <li>Right to humanitarian assistance</li>
            </ul>

            <h2>International Law</h2>
            <p>International law provides additional protections through:</p>
            <ul>
              <li><strong>Human Rights Treaties:</strong> Universal Declaration of Human Rights</li>
              <li><strong>International Courts:</strong> International Court of Justice, ICC</li>
              <li><strong>Regional Organizations:</strong> UN, EU, African Union</li>
              <li><strong>Trade Agreements:</strong> WTO and bilateral treaties</li>
              <li><strong>Environmental Accords:</strong> Paris Agreement, Kyoto Protocol</li>
            </ul>

            <h2>Conclusion</h2>
            <p>
              Understanding your legal rights is the first step toward protecting them. Laws are designed to ensure 
              justice, equality, and order in society. When you know your rights and how laws work, you can better 
              navigate legal challenges and seek appropriate remedies when your rights are violated.
            </p>
            <p>
              Remember that legal rights come with responsibilities. Respecting others' rights while exercising 
              your own creates a balanced and just society for everyone.
            </p>

            <h2>Need Legal Help?</h2>
            <p>
              If you believe your legal rights have been violated or need legal assistance, our team of experienced 
              attorneys is here to help. Contact Justice Point for:
            </p>
            <ul>
              <li>Legal consultation and advice</li>
              <li>Representation in court proceedings</li>
              <li>Document preparation and review</li>
              <li>Negotiation and mediation services</li>
              <li>Legal education and awareness programs</li>
            </ul>

            <h2>Contact Information</h2>
            <p>
              For legal assistance or to learn more about your rights, contact us:
            </p>
            <ul>
              <li>Email: justicepoint@gmail.com</li>
              <li>Phone: +86 21 2412 6000</li>
              <li>Address: 17th Floor, One ICC, Shanghai ICC, 999 Middle Huai Hai Road, Xuhui District, Shanghai, 200031</li>
            </ul>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default OurRights;
