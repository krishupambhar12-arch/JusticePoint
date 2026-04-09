// 

const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

// Simple AI Advisor - Basic legal advice based on keywords
// Made optional auth so anyone can use it
router.post("/advice", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ message: "Message is required" });
    }

    const userMessage = message.toLowerCase().trim();
    let advice = "";

    // Simple keyword-based legal advice system
    if (userMessage.includes("divorce") || userMessage.includes("marriage") || userMessage.includes("talaq") || userMessage.includes("wedding") || userMessage.includes("family")) {
      advice = "For family/matrimonial matters:\n• Consult a family lawyer for personalized advice\n• Keep marriage certificate, ID proofs, and related documents ready\n• Understand your grounds for divorce under applicable law\n• Child custody and alimony can be negotiated or decided by court\n• Mediation is often recommended before litigation";
    } else if (userMessage.includes("property") || userMessage.includes("land") || userMessage.includes("flat") || userMessage.includes("house") || userMessage.includes("real estate")) {
      advice = "For property/real estate matters:\n• Verify title deeds and land records before any transaction\n• Ensure all documents are properly registered and stamped\n• Check for any existing loans, mortgages, or disputes on the property\n• Always have a written agreement for sale/purchase/rent\n• Consult a property lawyer before signing any documents";
    } else if (userMessage.includes("police") || userMessage.includes("arrest") || userMessage.includes("jail") || userMessage.includes("fir") || userMessage.includes("criminal")) {
      advice = "For criminal law matters:\n• You have the right to remain silent (Article 20(3) of Constitution)\n• You have the right to consult a lawyer (Section 41D, CrPC)\n• Do not sign any documents without your lawyer present\n• If arrested, inform your family immediately\n• Seek bail through a criminal lawyer as soon as possible";
    } else if (userMessage.includes("consumer") || userMessage.includes("product") || userMessage.includes("refund") || userMessage.includes("defective") || userMessage.includes("return")) {
      advice = "For consumer rights issues:\n• You have the right to return defective products within 30 days\n• Keep original bills, warranties, and payment proofs\n• File complaint on National Consumer Helpline (1915) or in consumer court\n• For online purchases, check return/replacement policy\n• Service providers must deliver as promised – you can claim compensation for deficiency";
    } else if (userMessage.includes("accident") || userMessage.includes("injury") || userMessage.includes("insurance") || userMessage.includes("claim") || userMessage.includes("compensation")) {
      advice = "For accident/injury/insurance claims:\n• Document the scene with photos and videos\n• Obtain medical reports and police panchnama/FIR copy\n• File your claim within the limitation period (usually 3 months to 3 years)\n• Do not accept low settlements without legal advice\n• Consult a claims lawyer if your claim is delayed or rejected";
    } else if (userMessage.includes("cyber") || userMessage.includes("online") || userMessage.includes("scam") || userMessage.includes("fraud") || userMessage.includes("hack") || userMessage.includes("phishing")) {
      advice = "For cyber crime/online fraud:\n• Report immediately on cybercrime.gov.in or call 1930\n• Take screenshots of all communications and transactions\n• Never share OTP, passwords, or banking details with anyone\n• If money is deducted, immediately block your card/account\n• File a complaint at your local cyber cell for serious frauds";
    } else if (userMessage.includes("job") || userMessage.includes("employment") || userMessage.includes("salary") || userMessage.includes("termination") || userMessage.includes("work")) {
      advice = "For employment/labour law issues:\n• Review your appointment letter and company policies\n• You cannot be terminated without notice or valid reason\n• PF, ESI, gratuity, and bonus are your statutory rights\n• If salary is delayed, send a formal legal notice to HR/employer\n• For workplace harassment, file complaint with Internal Complaints Committee (ICC)";
    } else if (userMessage.includes("cheque") || userMessage.includes("bounce") || userMessage.includes("payment") || userMessage.includes("loan") || userMessage.includes("money")) {
      advice = "For cheque bounce/financial disputes:\n• Cheque bounce is a criminal offense under Section 138 of NI Act\n• Send a legal notice within 30 days of cheque bounce\n• File complaint in court within 30 days of notice period ending\n• Keep the cheque, bank memo, and your bank statement as evidence\n• Consult a lawyer for recovery or defense proceedings";
    } else if (userMessage.includes("rent") || userMessage.includes("tenant") || userMessage.includes("landlord") || userMessage.includes("eviction") || userMessage.includes("lease")) {
      advice = "For rent/tenant/landlord issues:\n• Always have a written rent/lease agreement (11 months is common)\n• Landlord cannot evict you without notice or court order\n• You can deduct rent for major repairs if landlord fails to act\n• Security deposit must be returned within agreed timeframe\n• Check local rent control laws as they vary by city/state";
    } else if (userMessage.includes("will") || userMessage.includes("inheritance") || userMessage.includes("succession") || userMessage.includes("property dispute")) {
      advice = "For will/inheritance/succession matters:\n• A registered will is stronger but unregistered will is also valid\n• Will must be signed by you and two witnesses\n• You can challenge a will if made under coercion, fraud, or undue influence\n• Succession laws vary by religion (Hindu, Muslim, Christian, etc.)\n• Consider a family settlement deed to avoid prolonged disputes";
    } else if (userMessage.includes("court") || userMessage.includes("case") || userMessage.includes("lawsuit") || userMessage.includes("litigation") || userMessage.includes("sue")) {
      advice = "For court cases/litigation:\n• Always carry case papers, court notices, and ID proof\n• Check next hearing dates on court websites or e-courts portal\n• You can appear through a lawyer – personal presence not always mandatory\n• File your written statement/defense within the time limit (usually 30-90 days)\n• Consider mediation or settlement for faster resolution";
    } else if (userMessage.includes("rights") || userMessage.includes("constitution") || userMessage.includes("fundamental") || userMessage.includes("human rights")) {
      advice = "For fundamental/constitutional rights:\n• Right to Equality (Article 14)\n• Right to Freedom of Speech (Article 19)\n• Right to Life and Personal Liberty (Article 21)\n• Right to Education (Article 21A)\n• You can file a writ petition in High Court or Supreme Court if your rights are violated";
    } else if (userMessage.includes("complaint") || userMessage.includes("file") || userMessage.includes("register case")) {
      advice = "For filing complaints:\n• Visit nearest police station with written complaint\n• If police refuse to register, send complaint by post to SP/Commissioner\n• Many states offer e-FIR facility for certain offenses\n• Keep a copy of your complaint with date and acknowledgment\n• Women can file complaints at Mahila Police Station or NCW portal";
    } else if (userMessage.includes("lawyer") || userMessage.includes("advocate") || userMessage.includes("attorney") || userMessage.includes("legal")) {
      advice = "For hiring a lawyer:\n• Verify their Bar Council enrollment (valid license)\n• Discuss fees upfront – consultation may be free or paid\n• Share all documents truthfully with your lawyer\n• You have the right to change your lawyer if not satisfied\n• Free legal aid is available for eligible persons through NALSA/State Legal Services Authority";
    } else if (userMessage.includes("bail") || userMessage.includes("release") || userMessage.includes("anticipatory")) {
      advice = "For bail matters:\n• Regular bail: After arrest in non-bailable offenses\n• Anticipatory bail: If you fear arrest (Section 438 CrPC)\n• Interim bail: Temporary release for medical/family reasons\n• Bail is a right, not a favor, but depends on case gravity\n• Hire a criminal lawyer immediately for bail applications";
    } else if (userMessage.includes("notice") || userMessage.includes("legal notice")) {
      advice = "For legal notices:\n• Send notice via registered post or courier with acknowledgment due\n• Keep proof of delivery (receipt, tracking details)\n• Clearly mention your name, address, and specific demands\n• Give reasonable time for reply (usually 15-60 days as per law)\n• If you receive a notice, reply within the given time – never ignore it";
    } else {
      // General advice for unrecognized legal queries
      advice = "Thank you for your question. For personalized legal advice, we recommend:\n\n" +
               "• Consult a qualified advocate through Justice Point\n" +
               "• Keep these documents ready: ID proof, contracts, notices, police complaint copy, property papers\n" +
               "• Clearly mention your specific legal issue (e.g., family dispute, property matter, cyber crime, criminal case)\n" +
               "• For emergencies: If arrested or facing police harassment, seek legal aid immediately\n\n" +
               "• For general legal awareness:\n" +
               "• Know your fundamental rights under the Constitution\n" +
               "• Always have written agreements for financial transactions\n" +
               "• Register important documents (property deeds, marriage, wills)\n" +
               "• Be aware of consumer rights when buying goods or services\n" +
               "• In criminal cases, you have the right to remain silent and consult a lawyer\n\n" +
               "📌 *This is general information, not legal advice. Please consult a qualified lawyer for your specific case.";
    }

    res.json({
      advice: advice,
      message: "AI advice generated successfully"
    });
  } catch (error) {
    console.error("AI advisor error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;