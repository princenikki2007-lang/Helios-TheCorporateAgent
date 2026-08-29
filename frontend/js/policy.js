/**
 * HELIOS — Policy Assistant Engine
 * Manages policy chat conversations, mock RAG responses, citations, and source previews
 */

const HeliosPolicy = (function() {
  const STORAGE_KEY = 'helios_conversations_data';

  // Seed / Knowledge Base for AI Responses with Citations
  const POLICY_KNOWLEDGE_BASE = [
    {
      keywords: ['leave', 'leaves', 'carry', 'carry forward', 'annual leave', 'earned leave', 'vacation', 'pto', 'holiday'],
      title: "Earned leave carry forward & annual leave rules",
      answer: "According to the company's <strong>Employee Leave Policy</strong>, full-time employees are entitled to carry forward a maximum of <strong>10 earned leaves (EL)</strong> into the subsequent calendar year.<br><br>Key policy rules:<br>• Any accrued leave exceeding the 10-day carry-forward threshold will automatically lapse on December 31st.<br>• Employees with surplus leave may submit an encashment request during the annual payroll reconciliation cycle with manager sign-off.<br>• Sick leaves and casual leaves expire annually and cannot be rolled over or encashed.",
      sources: [
        {
          document_id: "doc_001",
          document_name: "Employee_Leave_Policy_2026.pdf",
          section: "Section 4.2 — Annual Carry-Forward & Rollover Limits",
          page_number: 7,
          excerpt: "Employees in continuous active service may roll over up to ten (10) accrued Earned Leaves into the next calendar year. Accumulated balances beyond ten days shall expire on December 31st unless prior encashment authorization is granted by People Operations."
        }
      ]
    },
    {
      keywords: ['wfh', 'work from home', 'remote', 'hybrid', 'office', 'flexible', 'equipment', 'allowance', 'stipend'],
      title: "Work-from-home guidelines & remote stipend",
      answer: "Under the <strong>Hybrid Work & Remote Office Guidelines</strong>, the company supports a flexible work model:<br><br>• <strong>Hybrid Schedule:</strong> Eligible team members may work remotely up to <strong>3 days per week</strong> with a minimum of 2 days on-site in their designated hub office.<br>• <strong>Equipment Allowance:</strong> A one-time setup reimbursement of up to <strong>$500</strong> is provided for home ergonomic furniture and secondary display monitors.<br>• <strong>Internet Reimbursement:</strong> A monthly recurring stipend of <strong>$50</strong> is credited on your monthly payroll to cover broadband costs.",
      sources: [
        {
          document_id: "doc_002",
          document_name: "Hybrid_Work_Guidelines_v3.pdf",
          section: "Section 3.1 — Remote Workspace & Connectivity Allowance",
          page_number: 4,
          excerpt: "The organization provides a one-time ergonomic setup reimbursement capped at $500 for eligible hybrid and remote personnel, alongside a recurring $50 monthly connectivity allowance. Hardware requisitions must be processed through the internal IT Service Desk."
        }
      ]
    },
    {
      keywords: ['benefit', 'benefits', 'insurance', 'health', 'medical', 'dental', 'vision', 'wellness', 'gym', 'coverage'],
      title: "Health insurance and employee benefits",
      answer: "Full-time employees are eligible for the company's <strong>Comprehensive Health & Wellness Package</strong> starting on their first day of active employment:<br><br>• <strong>Medical, Dental & Vision:</strong> 100% employer-sponsored premium for employees, with 80% coverage for registered dependents.<br>• <strong>Health Savings Account (HSA):</strong> Employer contribution of $1,000 annually for individual coverage, or $2,000 for family plans.<br>• <strong>Annual Wellness Reimbursement:</strong> Up to $600 per year for gym memberships, fitness equipment, or mental wellness apps.<br>• <strong>Life & Disability:</strong> Group life insurance provided at 2x annual base salary.",
      sources: [
        {
          document_id: "doc_005",
          document_name: "Health_Benefits_Summary_2026.pdf",
          section: "Section 1.3 — Healthcare & Wellness Inclusions",
          page_number: 2,
          excerpt: "Comprehensive medical, dental, and optical insurance begins effective Day 1 of active employment. Full-time team members are provided 100% employer-funded individual premiums, with supplemental wellness reimbursements available via the benefits portal."
        }
      ]
    },
    {
      keywords: ['probation', 'probationary', 'confirmation', 'new joiner', 'trial', 'evaluation', 'kpi'],
      title: "Probation period & performance review criteria",
      answer: "The company's <strong>Employee Handbook</strong> outlines the standard probationary framework:<br><br>• <strong>Duration:</strong> The standard probation period is <strong>90 days</strong> from the official joining date.<br>• <strong>30-Day Alignment:</strong> Initial 1-on-1 check-in to confirm training milestones and deliverables.<br>• <strong>60-Day Midpoint Review:</strong> Structured review session with your reporting manager evaluating early performance against goals.<br>• <strong>90-Day Confirmation:</strong> People Operations issues a formal letter confirming regular employment status upon satisfactory review.",
      sources: [
        {
          document_id: "doc_003",
          document_name: "Global_Employee_Handbook_2026.pdf",
          section: "Section 2.4 — Probationary Period & Confirmation",
          page_number: 12,
          excerpt: "All newly appointed personnel undergo a ninety (90) day probationary period. Formal written confirmation of regular employment status is issued upon successful review by the department lead and People Operations."
        }
      ]
    },
    {
      keywords: ['travel', 'reimbursement', 'per-diem', 'expense', 'hotel', 'flight', 'meal', 'cab', 'taxi', 'mileage'],
      title: "Business travel expense & meal per-diem policy",
      answer: "According to the <strong>Corporate Travel & Expense Policy</strong>, business travel expenditures are governed by the following criteria:<br><br>• <strong>Daily Meal Per-Diem:</strong> Up to <strong>$85/day</strong> for domestic business travel ($20 Breakfast, $25 Lunch, $40 Dinner).<br>• <strong>Lodging:</strong> Standard business hotel tier booked through the corporate travel concierge (up to $220/night in tier-1 metro areas).<br>• <strong>Receipt Requirement:</strong> Itemized receipts are mandatory for any individual expense exceeding $25.<br>• <strong>Submission Window:</strong> Expense reports must be submitted within 15 business days following trip completion.",
      sources: [
        {
          document_id: "doc_004",
          document_name: "Travel_Expense_Policy_2026.docx",
          section: "Section 5.3 — Sustenance & Incidentals Schedule",
          page_number: 9,
          excerpt: "Domestic business travel permits a maximum daily per-diem of $85 for sustenance. Claims must be submitted via the expense portal with corresponding itemized receipts attached."
        }
      ]
    },
    {
      keywords: ['parental', 'maternity', 'paternity', 'child', 'adoption', 'birth'],
      title: "Parental leave & family support guidelines",
      answer: "The company provides comprehensive <strong>Parental Support Leave</strong> to support growing families:<br><br>• <strong>Primary Caregiver Leave:</strong> Up to <strong>16 weeks of 100% paid leave</strong> following the birth or adoption of a child.<br>• <strong>Secondary Caregiver Leave:</strong> Up to <strong>6 weeks of 100% paid leave</strong> to be utilized within 12 months.<br>• <strong>Phased Return-to-Work:</strong> Option to work 80% hours at full pay during the first 4 weeks upon returning.",
      sources: [
        {
          document_id: "doc_006",
          document_name: "Parental_Care_Policy_2026.pdf",
          section: "Section 2.1 — Paid Parental Leave Allowances",
          page_number: 5,
          excerpt: "Primary caregivers are entitled to sixteen (16) weeks of continuous paid leave at full base salary. Applications should be submitted to People Operations at least thirty (30) days prior to the intended start date."
        }
      ]
    }
  ];

  /**
   * Initialize and get all conversations from localStorage (seeded with mock if none)
   */
  function getAllConversations() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn("Error reading conversations from storage:", e);
    }

    const seed = window.HELIOS_MOCK_CONVERSATIONS || [];
    saveAllConversations(seed);
    return seed;
  }

  /**
   * Save array of conversations to localStorage
   */
  function saveAllConversations(list) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    } catch (e) {
      console.error("Error saving conversations:", e);
    }
  }

  /**
   * Get conversations with optional text search filter
   */
  function getConversations(query = '') {
    const list = getAllConversations();
    if (!query || !query.trim()) return list;

    const q = query.trim().toLowerCase();
    return list.filter(c => 
      c.title.toLowerCase().includes(q) || 
      (c.last_message && c.last_message.toLowerCase().includes(q))
    );
  }

  /**
   * Get a single conversation by ID
   */
  function getConversation(id) {
    const list = getAllConversations();
    return list.find(c => c.id === id) || null;
  }

  /**
   * Create a new conversation and prepend to list
   */
  function createConversation(initialQuestion = '') {
    const title = initialQuestion 
      ? (initialQuestion.length > 45 ? initialQuestion.substring(0, 45) + '...' : initialQuestion)
      : 'New Policy Inquiry';

    const newConv = {
      id: 'conv_' + Date.now(),
      title: title,
      last_message: initialQuestion || 'Conversation started',
      timestamp: 'Just now',
      group: 'Today',
      messages: []
    };

    const list = getAllConversations();
    list.unshift(newConv);
    saveAllConversations(list);
    return newConv;
  }

  /**
   * Update or add a message to a conversation
   */
  function addMessage(conversationId, messageObj) {
    const list = getAllConversations();
    let conv = list.find(c => c.id === conversationId);

    if (!conv) {
      conv = {
        id: conversationId,
        title: messageObj.text ? (messageObj.text.substring(0, 45) + '...') : 'Policy Discussion',
        last_message: messageObj.text,
        timestamp: 'Just now',
        group: 'Today',
        messages: []
      };
      list.unshift(conv);
    }

    if (!conv.messages) conv.messages = [];
    conv.messages.push(messageObj);
    conv.last_message = messageObj.text.replace(/<[^>]*>?/gm, '').substring(0, 120);
    conv.timestamp = 'Just now';
    conv.group = 'Today';

    saveAllConversations(list);
    return conv;
  }

  /**
   * Delete conversation by ID
   */
  function deleteConversation(id) {
    let list = getAllConversations();
    list = list.filter(c => c.id !== id);
    saveAllConversations(list);
    return list;
  }

  /**
   * Ask Helios policy question (generates realistic mock response & citation)
   */
  async function askQuestion(questionText) {
    // Realistic simulation delay
    await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 450));

    const q = questionText.toLowerCase();
    
    // Find matching topic in knowledge base
    const match = POLICY_KNOWLEDGE_BASE.find(item => 
      item.keywords.some(k => q.includes(k))
    );

    if (match) {
      return {
        answer: match.answer,
        sources: match.sources
      };
    }

    // Comprehensive corporate fallback response
    return {
      answer: `Based on your organization's approved policy repository, I've analyzed your question regarding <em>"${escapeHtml(questionText)}"</em>.<br><br>While this specific query is addressed across multiple procedural guidelines, the foundational standard indicates that standard compliance, supervisor sign-off, and People Operations approval apply.<br><br>For complex edge cases or special exemptions, please consult with your dedicated HR Business Partner.`,
      sources: [
        {
          document_id: "doc_003",
          document_name: "Global_Employee_Handbook_2026.pdf",
          section: "Section 1.2 — General Enterprise Policies & Conduct",
          page_number: 5,
          excerpt: "Corporate policies are uniformly applicable to all personnel. Where exceptional circumstances arise, written approval from the designated department supervisor and People Operations is required."
        }
      ]
    };
  }

  /**
   * Helper: Escape HTML to prevent XSS
   */
  function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  /**
   * Open Source Citation Document Preview Modal
   */
  function openSourceModal(source) {
    let modalOverlay = document.getElementById('source-preview-modal');
    if (!modalOverlay) {
      modalOverlay = document.createElement('div');
      modalOverlay.id = 'source-preview-modal';
      modalOverlay.className = 'modal-backdrop';
      document.body.appendChild(modalOverlay);
    }

    modalOverlay.innerHTML = `
      <div class="modal" style="max-width: 620px; width: 90%; animation: modalPop 200ms ease-out;" role="dialog" aria-modal="true">
        <div class="modal-header">
          <div style="display: flex; align-items: center; gap: var(--space-3);">
            <div style="width: 36px; height: 36px; border-radius: var(--radius-sm); background: var(--color-brand-subtle); color: var(--color-brand); display: flex; align-items: center; justify-content: center;">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
            </div>
            <div>
              <div class="modal-title">${source.document_name}</div>
              <div style="font-size: var(--font-size-xs); color: var(--text-muted);">${source.section || 'General Section'} &middot; Page ${source.page_number || '1'}</div>
            </div>
          </div>
          <button type="button" class="btn btn-ghost btn-sm" onclick="HeliosPolicy.closeSourceModal()" aria-label="Close modal">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>
        <div class="modal-body" style="padding: var(--space-6);">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: var(--space-4);">
            <span class="badge badge-success" style="font-size: 0.7rem;">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
              Approved Corporate Document
            </span>
            <span style="font-size: 0.7rem; color: var(--text-muted);">Verified Source Citation</span>
          </div>

          <div style="background: var(--bg-surface-secondary); border-left: 3px solid var(--color-brand); padding: var(--space-4) var(--space-5); border-radius: 0 var(--radius-md) var(--radius-md) 0; font-size: var(--font-size-sm); line-height: var(--line-height-relaxed); color: var(--text-primary); font-style: italic;">
            "${source.excerpt || 'Refer to the corporate document repository for the complete text of this policy clause.'}"
          </div>

          <div style="margin-top: var(--space-5); padding-top: var(--space-4); border-top: 1px solid var(--border-subtle); display: flex; align-items: center; justify-content: space-between; font-size: 0.75rem; color: var(--text-secondary);">
            <span>Document ID: <code style="font-family: var(--font-family-mono); color: var(--text-primary);">${source.document_id || 'DOC-REF-01'}</code></span>
            <span>Last reviewed by HR Compliance</span>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" onclick="HeliosPolicy.closeSourceModal()">Close</button>
        </div>
      </div>
    `;

    modalOverlay.classList.add('active');

    // Close on backdrop click
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) closeSourceModal();
    });
  }

  function closeSourceModal() {
    const modal = document.getElementById('source-preview-modal');
    if (modal) modal.classList.remove('active');
  }

  return {
    getConversations,
    getConversation,
    createConversation,
    addMessage,
    deleteConversation,
    askQuestion,
    openSourceModal,
    closeSourceModal,
    escapeHtml
  };
})();

window.HeliosPolicy = HeliosPolicy;
