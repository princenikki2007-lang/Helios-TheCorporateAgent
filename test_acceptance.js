/**
 * HELIOS — Comprehensive End-to-End Acceptance Test Suite
 * Validates all 21 core SaaS API modules and acceptance criteria.
 */

const http = require('http');

function request(method, path, body = null, isMultipart = false) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: path,
      method: method,
      headers: {
        'Accept': 'application/json'
      }
    };

    let postData = null;
    if (body) {
      if (typeof body === 'object') {
        postData = JSON.stringify(body);
        options.headers['Content-Type'] = 'application/json';
        options.headers['Content-Length'] = Buffer.byteLength(postData);
      } else {
        postData = body;
      }
    }

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve({ status: res.statusCode, data: json });
        } catch (e) {
          resolve({ status: res.statusCode, raw: data });
        }
      });
    });

    req.on('error', (e) => reject(e));
    if (postData) req.write(postData);
    req.end();
  });
}

async function runTests() {
  console.log('================================================================');
  console.log('☀️ RUNNING HELIOS ACCEPTANCE TEST SUITE (21 CHECKS)');
  console.log('================================================================');

  let passed = 0;
  let failed = 0;

  async function check(name, fn) {
    try {
      await fn();
      console.log(`  [PASS] ${name}`);
      passed++;
    } catch (e) {
      console.error(`  [FAIL] ${name}: ${e.message}`);
      failed++;
    }
  }

  // 1. Health check
  await check('Health Endpoint /api/health', async () => {
    const res = await request('GET', '/api/health');
    if (res.status !== 200 || res.data.status !== 'healthy') throw new Error(`Status ${res.status}`);
  });

  // 2. Default Workspace
  await check('Default Workspace /api/workspace', async () => {
    const res = await request('GET', '/api/workspace');
    if (res.status !== 200 || !res.data.workspace.cin) throw new Error('Missing workspace CIN');
  });

  // 3. Create New Company Workspace
  let newWsId = null;
  await check('Create Company Workspace (Onboarding)', async () => {
    const res = await request('POST', '/api/workspace', {
      name: "Starlight Cybernetic Solutions Pvt Ltd",
      legalEntityType: "Private Limited Company",
      cin: "U72900MH2023PTC192841",
      pan: "AABCS1298L",
      gstin: "27AABCS1298L1ZZ",
      registeredState: "Maharashtra",
      industry: "Cybersecurity & SaaS",
      numberOfEmployees: 32,
      annualTurnoverRange: "₹5 Cr - ₹25 Cr",
      isDemo: false
    });
    if (res.status !== 200 || !res.data.success) throw new Error('Workspace creation failed');
    newWsId = res.data.workspace.id;
  });

  // 4. Ingest & Analyze GST Document
  let gstDocId = null;
  await check('Document Upload & OCR Extraction (GST Certificate)', async () => {
    const res = await request('POST', '/api/documents/upload', {
      workspaceId: newWsId,
      filename: "GST_REG06_Certificate.pdf",
      title: "GST Registration Certificate REG-06",
      category: "Tax",
      textSnippet: "Government of India. Form GST REG-06. Registration Certificate issued under Section 25 of CGST Act 2017. Registration Number: 27AABCS1298L1ZZ. Legal Name: Starlight Cybernetic Solutions Pvt Ltd. Date of liability: 15/06/2023."
    });
    if (res.status !== 200 || !res.data.success) throw new Error('Upload failed');
    if (res.data.document.entities.gstin !== '27AABCS1298L1ZZ') throw new Error('GSTIN extraction mismatch');
    gstDocId = res.data.document.id;
  });

  // 5. Ingest & Analyze Certificate of Incorporation
  let coiDocId = null;
  await check('Document Upload & OCR Extraction (Incorporation Certificate)', async () => {
    const res = await request('POST', '/api/documents/upload', {
      workspaceId: newWsId,
      filename: "Certificate_of_Incorporation_MCA.pdf",
      title: "Certificate of Incorporation",
      category: "Corporate",
      textSnippet: "Ministry of Corporate Affairs. Corporate Identification Number: U72900MH2023PTC192841. Starlight Cybernetic Solutions Private Limited is incorporated under the Companies Act 2013 on 15/06/2023."
    });
    if (res.status !== 200 || !res.data.success) throw new Error('COI Upload failed');
    if (res.data.document.entities.cin !== 'U72900MH2023PTC192841') throw new Error('CIN extraction mismatch');
    coiDocId = res.data.document.id;
  });

  // 6. Ingest & Analyze HR Policy
  let hrDocId = null;
  await check('Document Upload & Heuristics (HR Policy & POSH)', async () => {
    const res = await request('POST', '/api/documents/upload', {
      workspaceId: newWsId,
      filename: "Starlight_Employee_Handbook_2026.docx",
      title: "Starlight Employee Handbook & Code of Conduct",
      category: "HR",
      textSnippet: "Chapter 4: Prevention of Sexual Harassment (POSH). The company establishes an Internal Complaints Committee. Chapter 5: Hours of Work. Standard 9 to 6 hours."
    });
    if (res.status !== 200 || !res.data.success) throw new Error('HR Upload failed');
    hrDocId = res.data.document.id;
  });

  // 7. Document Vault listing
  await check('Document Vault Listing /api/documents', async () => {
    const res = await request('GET', `/api/documents?workspaceId=${newWsId}`);
    if (res.status !== 200 || res.data.documents.length < 3) throw new Error('Failed to retrieve uploaded documents');
  });

  // 8. In-Document AI Chat
  await check('In-Document AI Chat /api/documents/:id/chat', async () => {
    const res = await request('POST', `/api/documents/${gstDocId}/chat`, {
      question: "What is the GSTIN in this document?"
    });
    if (res.status !== 200 || !res.data.answer.includes('27AABCS1298L1ZZ')) throw new Error('In-doc chat failed to cite GSTIN');
  });

  // 9. Document vs Statutory Rules Comparison
  await check('Document Comparison Engine /api/documents/:id/compare', async () => {
    const res = await request('POST', `/api/documents/${gstDocId}/compare`, {});
    if (res.status !== 200 || !res.data.comparison.items.length) throw new Error('Comparison engine returned empty');
  });

  // 10. Statutory Regulations Directory
  await check('Regulatory Intelligence /api/regulations', async () => {
    const res = await request('GET', '/api/regulations');
    if (res.status !== 200 || !res.data.regulations.length) throw new Error('No regulations found');
    if (!res.data.regulations[0].sourceTrustLevel) throw new Error('Missing sourceTrustLevel on regulation');
  });

  // 11. "What's Changed?" Regulation Diff
  await check('Rule Change Detection /api/regulations/diff', async () => {
    const res = await request('GET', '/api/regulations/diff');
    if (res.status !== 200 || !res.data.diffs.length) throw new Error('No rule diffs found');
  });

  // 12. Company Impact Engine
  await check('Company Impact Engine /api/impact', async () => {
    const res = await request('GET', `/api/impact?workspaceId=${newWsId}`);
    if (res.status !== 200 || !res.data.impacts.length) throw new Error('No impacts calculated');
    if (!res.data.impacts[0].impactLevel) throw new Error('Missing impactLevel');
  });

  // 13. Parliament & Policy Watch
  await check('Parliament & Policy Watch /api/policy-watch', async () => {
    const res = await request('GET', '/api/policy-watch');
    if (res.status !== 200 || !res.data.policyItems.length) throw new Error('No policy items');
    // Ensure legal status is clearly classified
    const hasStatus = res.data.policyItems.every(p => p.legalStatusTag && typeof p.isEnforceable === 'boolean');
    if (!hasStatus) throw new Error('Policy watch lacks strict statutory status tags');
  });

  // 14. Policy Impact Analyzer
  await check('Policy Health Analyzer /api/policies/analyze', async () => {
    const res = await request('POST', '/api/policies/analyze', {
      title: "Draft Workplace Policy",
      policyText: "Chapter 1: Standard working hours are 9 AM to 6 PM. Chapter 2: POSH Committee with external NGO nominated in 2023. Chapter 3: Employee personal data stored on servers."
    });
    if (res.status !== 200 || !res.data.analysis.healthScore) throw new Error('Missing policy health score');
  });

  // 15. Tax & GST Center
  await check('Tax & GST Center /api/tax', async () => {
    const res = await request('GET', `/api/tax?workspaceId=${newWsId}`);
    if (res.status !== 200 || !res.data.taxData.gstin) throw new Error('Missing GST tax data');
    if (!res.data.taxData.integrationStatus) throw new Error('Missing transparent integration status');
  });

  // 16. Approvals & Permits Center
  await check('Approval Center /api/approvals', async () => {
    const createRes = await request('POST', '/api/approvals', {
      workspaceId: newWsId,
      title: "Maharashtra Shops & Commercial Establishment Renewal",
      authority: "Labour Department, Government of Maharashtra",
      registrationNumber: "MH-MUM-2026-8812",
      category: "State Labour Compliance",
      validity: "2026-12-31",
      status: "Submitted",
      nextAction: "Track online application reference"
    });
    if (createRes.status !== 200) throw new Error('Failed to create approval');

    const getRes = await request('GET', `/api/approvals?workspaceId=${newWsId}`);
    if (getRes.status !== 200 || !getRes.data.approvals.length) throw new Error('Failed to list approvals');
  });

  // 17. Unified Compliance Calendar
  await check('Compliance Calendar /api/calendar', async () => {
    const res = await request('GET', `/api/calendar?workspaceId=${newWsId}`);
    if (res.status !== 200 || !res.data.events.length) throw new Error('Missing calendar events');
  });

  // 18. Explainable Company Risk Engine
  await check('Company Risk Engine /api/risk', async () => {
    const res = await request('GET', `/api/risk?workspaceId=${newWsId}`);
    if (res.status !== 200 || typeof res.data.risk.overallScore !== 'number') throw new Error('Missing risk overallScore');
    if (!res.data.risk.drivers.length) throw new Error('Risk score must have explainable drivers');
  });

  // 19. Ask HELIOS AI Legal Assistant (Grounded Q&A)
  await check('Ask HELIOS AI Assistant /api/ai/chat (Grounded with Citations)', async () => {
    const res = await request('POST', '/api/ai/chat', {
      workspaceId: newWsId,
      query: "What compliance tasks are due this month?"
    });
    if (res.status !== 200 || !res.data.answer) throw new Error('AI chat failed');
    if (!res.data.disclaimer) throw new Error('AI response missing statutory legal disclaimer');
    if (!res.data.citations || !res.data.citations.length) throw new Error('AI response missing citations');
  });

  // 20. Enterprise Audit Logs & Governance
  await check('Enterprise Audit Logs /api/audit-logs', async () => {
    const res = await request('GET', `/api/audit-logs?workspaceId=${newWsId}`);
    if (res.status !== 200 || !res.data.logs.length) throw new Error('Missing audit log entries');
  });

  // 21. Global Search / Command Palette
  await check('Global Search Index /api/search', async () => {
    const res = await request('GET', '/api/search?q=GST');
    if (res.status !== 200 || !res.data.results.length) throw new Error('Search failed for GST');
  });

  console.log('================================================================');
  console.log(`RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log('================================================================');

  if (failed > 0) process.exit(1);
}

runTests();
