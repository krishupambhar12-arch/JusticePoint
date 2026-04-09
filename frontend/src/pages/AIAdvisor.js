import React, { useState, useRef, useEffect } from "react";
import Header from "../components/header";
import Footer from "../components/footer";
import { API } from "../config/api";
import "../styles/aiAdvisor.css";

const AIAdvisor = () => {
  const [question, setQuestion] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [gettingAdvice, setGettingAdvice] = useState(false);
  const messagesEndRef = useRef(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Fixed answers for specific questions (ONLY these 5)
  const getFixedAnswer = (question) => {
    const lowerQuestion = question.toLowerCase();
    
    // 1. Divorce/Family Lawyer advice
    if (lowerQuestion.includes("divorce") || lowerQuestion.includes("family law") || 
        lowerQuestion.includes("best lawyer for divorce")) {
      return `**Finding the Best Lawyer for Divorce/Family Law:**

 ☞ Where to find good lawyers:
  • District Bar Association: Get referrals for experienced family lawyers
  • High Court websites: Check advocate directories
  • Online platforms: Sulekha, LawRato, Vakilsearch
  • Personal referrals: Ask friends/family who had good experiences

 ☞ What to look for:
  • Experience in family court (minimum 5-10 years recommended)
  • Specialization in matrimonial law (Hindu Marriage Act, Special Marriage Act)
  • Success rate in similar cases (divorce, custody, alimony)
  • Fee structure (consultation fee ₹500-2000, case fee varies)

 ☞ Questions to ask before hiring:
  • "How many divorce cases have you handled?"
  • "What is your approach to custody battles?"
  • "Do you prefer litigation or mediation?"
  • "What are your fees and payment terms?"

 ☞ Free Legal Aid:
  • State Legal Services Authority (SALSA) - Free lawyers for eligible persons
  • Family court legal aid cells

📌 *Always verify the lawyer's Bar Council enrollment before hiring.*`;
    }
    
    // 2. Child Custody rules
    else if (lowerQuestion.includes("child custody") || 
             (lowerQuestion.includes("custody") && lowerQuestion.includes("child"))) {
      return `**Child Custody Rules in India:**

 ☞ Types of Custody:
  • Physical Custody: Child lives with one parent
  • Joint Custody: Both parents share responsibility (increasingly common)
  • Visitation Rights: Non-custodial parent gets scheduled time
  • Interim Custody: Temporary arrangement during proceedings

 ☞ Legal Framework:
  • Hindu Minority and Guardianship Act, 1956 (for Hindus)
  • Guardians and Wards Act, 1890 (for all religions)
  • Special Marriage Act, 1954 (for inter-faith marriages)

 ☞ Key Factors Courts Consider:
  • Child's welfare is PARAMOUNT (supreme)
  • Child's age, health, and emotional needs
  • Child's preference (if mature enough - usually 9+ years)
  • Parent's financial stability and moral character
  • Existing relationship with child
  • Who is the primary caregiver

 ☞ General Guidelines:
  • Below 5 years: Usually with mother (unless unfit)
  • 5-9 years: Based on who can provide better environment
  • Above 9 years: Child's preference considered
  • Sons above 5 years can be with father if beneficial

 ☞ Recent Developments:
  • Courts now favor joint custody/co-parenting
  • Visitation rights are almost always granted
  • Denying visitation can lead to contempt of court

⚠️ *Note: Custody laws apply to legitimate children. For illegitimate children, mother is natural guardian.*`;
    }
    
    // 3. Consumer Complaint
    else if (lowerQuestion.includes("consumer complaint") || 
             (lowerQuestion.includes("file") && lowerQuestion.includes("complaint"))) {
      return `**How to File a Consumer Complaint in India:**

 ☞ Step 1: Gather Documents
  • Original bill/invoice/receipt
  • Warranty/guarantee card (if applicable)
  • Proof of payment (bank statement, UPI screenshot)
  • Correspondence with seller (emails, messages)
  • Photos/videos of defective product

  • **Step 2: Send Legal Notice**
  • Send notice to seller/manufacturer via registered post
  • Give 15-30 days for response
  • Keep proof of delivery

 ☞ Step 3: Choose Right Forum (Based on Claim Amount)
  • District Consumer Forum: Up to ₹1 crore
  • State Consumer Commission: ₹1 crore to ₹10 crore
  • National Consumer Commission: Above ₹10 crore

 ☞ Step 4: File Complaint
  • **Online:** consumerhelpline.gov.in or edaakhil.nic.in
  • **Offline:** Visit nearest consumer court/forum
  • Pay nominal court fees (based on claim amount)
  • Submit 3-4 copies of complaint with documents

 ☞ Step 5: Follow Up
  • Get acknowledgment/registration number
  • Note next hearing date
  • Attend hearings or send representative

 ☞ Alternative: Consumer Helpline
  • Call **1915** (National Consumer Helpline)
  • Register complaint online at **consumerhelpline.gov.in**
  • They mediate between you and company

📌 *Time limit: File within 2 years of defect/purchase.*`;
    }
    
    // 4. Police Arrest
    else if (lowerQuestion.includes("police arrest") || 
             lowerQuestion.includes("arrested") || 
             (lowerQuestion.includes("police") && lowerQuestion.includes("arrest"))) {
      return `**What to Do If Police Arrest Someone:**

 ☞ Rights of Arrested Person:
  • Right to know grounds of arrest** (Article 22, CrPC Section 50)
  • **Right to remain silent** (not required to confess)
  • **Right to consult lawyer** (Section 41D, CrPC)
  • **Right to inform family/friend** (Section 50A, CrPC)
  • **Right to medical examination** (Section 54, CrPC)
  • **Right to be produced before magistrate within 24 hours** (Article 22, Section 57 CrPC)

 ☞ Immediate Steps:
  1. Ask for arrest memo/warrant - read carefully
  2. Note police station name, officer name, badge number
  3. Ask to make a phone call - inform family immediately
  4. Don't sign anything without lawyer
  5. Don't resist arrest - but remember your rights
  6. Note down everything that happens

 ☞ For Family Members:
  1. Get details: Which police station? What section/crime?
  2. Contact a criminal lawyer immediately
  3. Visit police station with lawyer
  4. Get copy of FIR (free of cost)
  5. Apply for bail (regular or anticipatory)
  6. Note production before magistrate date

 ☞ Bail Options:
  • Regular Bail: After arrest, apply in court
  • Anticipatory Bail: Apply BEFORE arrest if you fear arrest
  • Interim Bail: Temporary release for medical/family reasons

 ☞ Important Contacts:
  • Police Control Room: 100
  • Women Helpline: 1091
  • Legal Aid: 1516 (or visit DLSA office)
  • Human Rights Commission: 011-23385368

⚠️ *NEVER: Pay bribe, sign blank papers, confess under pressure, or agree to anything without lawyer.*`;
    }
    
    // 5. Property Registration
    else if (lowerQuestion.includes("register property") || 
             lowerQuestion.includes("property registration") ||
             lowerQuestion.includes("how to register land")) {
      return `**How to Register a Property in India:**

 ☞ Step 1: Verify Documents Before Registration
  • Title Deed: Check ownership chain (last 30 years recommended)
  • Encumbrance Certificate: No loans/disputes on property
  • Tax Receipts: Property tax paid up to date
  • Sale Agreement: If any, signed by both parties
  • NOC: From society/builder/bank (if applicable)

 ☞ Step 2: Required Documents**
  • For Seller: Title deed, ID proof, PAN card, photos
  • For Buyer: ID proof (Aadhar/PAN), passport photos, stamp paper
  • Property Documents: Original deed, mutation records, 7/12 extract (for land)
  • Witnesses: 2 witnesses with ID proof

 ☞ Step 3: Pay Stamp Duty & Registration Fee
  • Stamp Duty: 4-8% of property value (varies by state)
  • Registration Fee: 1-2% of property value
  • Pay online: Through state treasury/GRAS portal
  • Or offline: At designated banks/sub-registrar office

 ☞ Step 4: Visit Sub-Registrar Office
  • Book appointment online (many states now offer)
  • Both buyer and seller must be present
  • Two witnesses must be present with ID
  • Document is read out and signed by all parties
  • Photos and thumb impressions taken

 ☞ Step 5: After Registration
  • Get registered deed (usually takes 3-7 days)
  • Apply for mutation (name change in municipal records)
  • Update property tax records
  • Keep registered deed in safe custody (digital copy recommended)

 ☞ Online Registration (in many states):
  • Maharashtra: IGRS Maharashtra
  • Gujarat: AnyRoR, GRAS
  • Karnataka: Kaveri online
  • Delhi: DORIS

📌 *Important: Registration is mandatory under Registration Act, 1908. Unregistered sale deed has limited legal value.*`;
    }
    
    // Return null if no fixed answer matches (will go to backend)
    return null;
  };

  const getAIAdvice = async (e) => {
    e.preventDefault();
    if (!question.trim()) {
      alert("Please enter your legal question");
      return;
    }

    const userQuestion = question.trim();
    setQuestion("");
    
    // Add user message to chat
    const userMessage = {
      id: Date.now(),
      type: "user",
      message: userQuestion,
      timestamp: new Date()
    };
    setChatHistory(prev => [...prev, userMessage]);

    // Check for fixed answer first
    const fixedAnswer = getFixedAnswer(userQuestion);
    
    if (fixedAnswer) {
      // Use fixed answer (no API call)
      setTimeout(() => {
        const aiMessage = {
          id: Date.now() + 1,
          type: "ai",
          message: fixedAnswer,
          timestamp: new Date()
        };
        setChatHistory(prev => [...prev, aiMessage]);
        setGettingAdvice(false);
      }, 1000); // Small delay for better UX
      setGettingAdvice(true);
    } else {
      // Call backend API for all other questions
      setGettingAdvice(true);
      try {
        const res = await fetch(API.AI_ADVICE, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
          body: JSON.stringify({ message: userQuestion }),
        });
        const data = await res.json();
        if (res.ok) {
          // Add AI response to chat
          const aiMessage = {
            id: Date.now() + 1,
            type: "ai",
            message: data.advice || "No legal advice available",
            timestamp: new Date()
          };
          setChatHistory(prev => [...prev, aiMessage]);
        } else {
          const errorMessage = {
            id: Date.now() + 1,
            type: "ai",
            message: data.message || "Failed to get legal advice. Please try again.",
            timestamp: new Date()
          };
          setChatHistory(prev => [...prev, errorMessage]);
        }
      } catch (error) {
        console.error("Error getting legal advice:", error);
        const errorMessage = {
          id: Date.now() + 1,
          type: "ai",
          message: "Failed to get legal advice. Please try again.",
          timestamp: new Date()
        };
        setChatHistory(prev => [...prev, errorMessage]);
      } finally {
        setGettingAdvice(false);
      }
    }
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const clearChat = () => {
    if (window.confirm("Are you sure you want to clear the chat history?")) {
      setChatHistory([]);
    }
  };

  return (
    <>
      <Header />
      <div className="ai-advisor-page">
        <div className="ai-advisor-container">
          <div className="ai-header">
            <div className="ai-title">
              <span className="ai-icon-large">⚖️</span>
              <h1>Justice Point - Legal Advisor</h1>
            </div>
            <p className="ai-subtitle">Ask me about your legal concerns for quick advice</p>
            {chatHistory.length > 0 && (
              <button className="clear-chat-btn" onClick={clearChat}>
                Clear Chat
              </button>
            )}
          </div>

          <div className="chat-messages-area">
            {chatHistory.length === 0 ? (
              <div className="welcome-message">
                <div className="welcome-icon">⚖️</div>
                <h2>Welcome to Justice Point</h2>
                <p>I can help you with:</p>
                <ul>
                  <li>Divorce and family law matters</li>
                  <li>Child custody and alimony guidance</li>
                  <li>Property and real estate disputes</li>
                  <li>Criminal law and police cases</li>
                  <li>Consumer rights and complaints</li>
                  <li>Cyber crime and online fraud</li>
                  <li>Employment and labour law issues</li>
                  <li>Rent and tenant disputes</li>
                  <li>Will, inheritance, and succession</li>
                  <li>Legal notice and court cases</li>
                </ul>
                <p className="example-questions">
                  <strong>Try asking:</strong>
                </p>
                <ul className="example-list">
                  <li>"Give me advice for best lawyer in divorce or family law"</li>
                  <li>"What are the rules for child custody in India?"</li>
                  <li>"How to file a consumer complaint?"</li>
                  <li>"What to do if police arrest someone?"</li>
                  <li>"How to register a property?"</li>
                </ul>
                <p className="disclaimer">
                  <strong>⚠️ Important:</strong> This is general legal information only. For specific legal advice, please consult a qualified advocate. In case of emergency, contact legal aid immediately.
                </p>
              </div>
            ) : (
              chatHistory.map((msg) => (
                <div
                  key={msg.id}
                  className={`chat-message ${msg.type === "user" ? "user-message" : "ai-message"}`}
                >
                  <div className="message-bubble">
                    {msg.type === "ai" && <span className="ai-badge">Legal AI</span>}
                    <p style={{ whiteSpace: 'pre-line' }}>{msg.message}</p>
                    <span className="message-timestamp">{formatTime(msg.timestamp)}</span>
                  </div>
                </div>
              ))
            )}
            {gettingAdvice && (
              <div className="chat-message ai-message">
                <div className="message-bubble">
                  <span className="ai-badge">Legal AI</span>
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form className="ai-input-form" onSubmit={getAIAdvice}>
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask me anything about your legal issues... (e.g., I need help with divorce and child custody)"
              disabled={gettingAdvice}
            />
            <button type="submit" disabled={gettingAdvice || !question.trim()}>
              {gettingAdvice ? "Getting Advice..." : "Send"}
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AIAdvisor;