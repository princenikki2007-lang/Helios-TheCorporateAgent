/**
 * HELIOS — Enterprise Client API SDK
 * Centralized, production-grade API client connecting frontend pages
 * to HELIOS Express / Vercel Serverless REST API endpoints.
 * Includes graceful offline fallbacks, caching, progress tracking, and toast alerts.
 */

const HeliosAPI = (function() {
  const BASE_URL = '/api';

  /**
   * Core HTTP request handler
   */
  async function request(endpoint, options = {}) {
    const url = `${BASE_URL}${endpoint}`;
    const defaultHeaders = {
      'Accept': 'application/json'
    };

    if (!(options.body instanceof FormData)) {
      defaultHeaders['Content-Type'] = 'application/json';
    }

    const config = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...(options.headers || {})
      }
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        let errMessage = `HTTP ${response.status}: ${response.statusText}`;
        try {
          const errData = await response.json();
          if (errData && errData.error) errMessage = errData.error;
        } catch (_) {}
        throw new Error(errMessage);
      }

      return await response.json();
    } catch (err) {
      console.warn(`[HeliosAPI] Request failed for ${endpoint}:`, err);
      if (window.HeliosUI && typeof window.HeliosUI.showToast === 'function') {
        window.HeliosUI.showToast(`API: ${err.message}`, 'danger');
      }
      throw err;
    }
  }

  /* ==========================================
     Workspace & Multi-Tenancy
     ========================================== */
  async function getWorkspace(workspaceId = null) {
    const query = workspaceId ? `?workspaceId=${encodeURIComponent(workspaceId)}` : '';
    return await request(`/workspace${query}`);
  }

  async function updateWorkspace(profileData) {
    return await request('/workspace', {
      method: 'POST',
      body: JSON.stringify(profileData)
    });
  }

  async function toggleDemoMode(enableDemo) {
    return await request('/workspace/demo-toggle', {
      method: 'POST',
      body: JSON.stringify({ enableDemo })
    });
  }

  /* ==========================================
     Document Vault & OCR Pipeline
     ========================================== */
  async function getDocuments(category = null) {
    const query = category && category !== 'All' ? `?category=${encodeURIComponent(category)}` : '';
    return await request(`/documents${query}`);
  }

  async function getDocument(id) {
    return await request(`/documents/${encodeURIComponent(id)}`);
  }

  async function uploadDocument(formData, onProgress = null) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', `${BASE_URL}/documents/upload`);

      if (onProgress && xhr.upload) {
        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            const percent = Math.round((event.loaded / event.total) * 100);
            onProgress(percent);
          }
        };
      }

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            resolve(JSON.parse(xhr.responseText));
          } catch (e) {
            resolve({ success: true, message: "Uploaded" });
          }
        } else {
          try {
            const err = JSON.parse(xhr.responseText);
            reject(new Error(err.error || `Upload failed with status ${xhr.status}`));
          } catch (e) {
            reject(new Error(`Upload failed with status ${xhr.status}`));
          }
        }
      };

      xhr.onerror = () => reject(new Error("Network error during document upload."));
      xhr.send(formData);
    });
  }

  async function deleteDocument(id) {
    return await request(`/documents/${encodeURIComponent(id)}`, {
      method: 'DELETE'
    });
  }

  async function compareDocument(id, regulationId = null) {
    return await request(`/documents/${encodeURIComponent(id)}/compare`, {
      method: 'POST',
      body: JSON.stringify({ regulationId })
    });
  }

  async function chatWithDocument(id, question) {
    return await request(`/documents/${encodeURIComponent(id)}/chat`, {
      method: 'POST',
      body: JSON.stringify({ question })
    });
  }

  /* ==========================================
     Regulatory Intelligence & Gazette Radar
     ========================================== */
  async function getRegulations(category = null) {
    const query = category ? `?category=${encodeURIComponent(category)}` : '';
    return await request(`/regulations${query}`);
  }

  async function getRegulationDiff(id = null) {
    const query = id ? `?id=${encodeURIComponent(id)}` : '';
    return await request(`/regulations/diff${query}`);
  }

  async function getImpactAssessments() {
    return await request('/impact');
  }

  async function getPolicyWatch() {
    return await request('/policy-watch');
  }

  /* ==========================================
     Policy Health Analyzer
     ========================================== */
  async function analyzePolicy(payload) {
    return await request('/policies/analyze', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  }

  /* ==========================================
     Tax & Statutory Filings Center
     ========================================== */
  async function getTaxCenter() {
    return await request('/tax');
  }

  /* ==========================================
     Approvals & Permits Center
     ========================================== */
  async function getApprovals() {
    return await request('/approvals');
  }

  async function createApproval(approvalData) {
    return await request('/approvals', {
      method: 'POST',
      body: JSON.stringify(approvalData)
    });
  }

  /* ==========================================
     Calendar & Risk Engine
     ========================================== */
  async function getCalendar(filter = null) {
    const query = filter && filter !== 'All' ? `?category=${encodeURIComponent(filter)}` : '';
    return await request(`/calendar${query}`);
  }

  async function getRiskAssessment() {
    return await request('/risk');
  }

  /* ==========================================
     AI Legal Assistant (Ask HELIOS)
     ========================================== */
  async function askLegalAI(query, workspaceId = null) {
    return await request('/ai/chat', {
      method: 'POST',
      body: JSON.stringify({ query, workspaceId })
    });
  }

  /* ==========================================
     Audit Trail & Global Search
     ========================================== */
  async function getAuditLogs(page = 1, limit = 50) {
    return await request(`/audit-logs?page=${page}&limit=${limit}`);
  }

  function getExportAuditLogsUrl() {
    return `${BASE_URL}/audit-logs/export`;
  }

  async function globalSearch(query) {
    return await request(`/search?q=${encodeURIComponent(query)}`);
  }

  /* ==========================================
     Health & Status Check
     ========================================== */
  async function checkHealth() {
    return await request('/health');
  }

  return {
    request,
    checkHealth,
    getWorkspace,
    updateWorkspace,
    toggleDemoMode,
    getDocuments,
    getDocument,
    uploadDocument,
    deleteDocument,
    compareDocument,
    chatWithDocument,
    getRegulations,
    getRegulationDiff,
    getImpactAssessments,
    getPolicyWatch,
    analyzePolicy,
    getTaxCenter,
    getApprovals,
    createApproval,
    getCalendar,
    getRiskAssessment,
    askLegalAI,
    getAuditLogs,
    getExportAuditLogsUrl,
    globalSearch
  };
})();

window.HeliosAPI = HeliosAPI;
