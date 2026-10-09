/**
 * HELIOS — Friendly Global UI Controller
 * Approachable, simple, Notion/Stripe-inspired navigation shell,
 * 8-item simplified sidebar, theme switcher (Light by default / Dark),
 * mobile navigation, and friendly non-jargon modals.
 */

const HeliosUI = (function() {
  let activeWorkspace = null;
  let activeRole = localStorage.getItem('helios_active_role') || 'Founder';
  let activeTheme = localStorage.getItem('helios_theme') || 'light';

  // Apply saved theme immediately
  document.documentElement.setAttribute('data-theme', activeTheme);

  const ROLES = [
    { id: 'Founder', name: 'Founder / CEO', desc: 'Full company governance' },
    { id: 'Admin', name: 'Company Admin', desc: 'Manage team and documents' },
    { id: 'Finance', name: 'Finance / Accounting', desc: 'Tax, GST & filings' },
    { id: 'HR', name: 'People / HR', desc: 'Team policies & handbooks' },
    { id: 'Legal', name: 'Legal Counsel', desc: 'Contracts & regulations' },
    { id: 'Compliance', name: 'Compliance Officer', desc: 'Tasks & licenses' },
    { id: 'Viewer', name: 'Read-Only Member', desc: 'View-only access' }
  ];

  /**
   * Fetch active workspace profile
   */
  async function loadActiveWorkspace() {
    try {
      if (window.HeliosAPI && typeof window.HeliosAPI.getWorkspace === 'function') {
        const data = await window.HeliosAPI.getWorkspace();
        if (data && data.success) {
          activeWorkspace = data.workspace;
        }
      } else {
        const res = await fetch('/api/workspace');
        const data = await res.json();
        if (data && data.success) {
          activeWorkspace = data.workspace;
        }
      }
    } catch (e) {
      console.warn("Could not fetch workspace from API; using cached session:", e);
    }

    if (!activeWorkspace) {
      activeWorkspace = {
        id: "org_default",
        isDemo: true,
        name: "Zephyr Technologies",
        legalEntityType: "Private Limited Company",
        cin: "U72900KA2022PTC158941",
        pan: "AABCZ9821K",
        gstin: "29AABCZ9821K1ZX",
        registeredState: "Karnataka"
      };
    }
    return activeWorkspace;
  }

  /**
   * Detect current page from URL pathname
   */
  function getCurrentPageName() {
    const pathname = window.location.pathname.toLowerCase();
    if (pathname.includes('dashboard')) return 'dashboard';
    if (pathname.includes('risk')) return 'risk';
    if (pathname.includes('calendar')) return 'calendar';
    if (pathname.includes('document')) return 'documents';
    if (pathname.includes('compare')) return 'compare';
    if (pathname.includes('policy-analyzer')) return 'policy-analyzer';
    if (pathname.includes('regulations')) return 'regulations';
    if (pathname.includes('impact')) return 'impact';
    if (pathname.includes('policy-watch')) return 'policy-watch';
    if (pathname.includes('tax')) return 'tax-center';
    if (pathname.includes('approval')) return 'approvals';
    if (pathname.includes('chat') || pathname.includes('policy-chat')) return 'policy-chat';
    if (pathname.includes('audit')) return 'audit-logs';
    if (pathname.includes('onboarding')) return 'onboarding';
    return document.body.getAttribute('data-page') || '';
  }

  /**
   * Render Simplified 8-Item Friendly Sidebar
   */
  function renderSidebar(activePage) {
    const sidebarEl = document.getElementById('app-sidebar');
    if (!sidebarEl) return;

    const page = activePage || getCurrentPageName();
    const ws = activeWorkspace || { name: "Zephyr Technologies", isDemo: true };

    sidebarEl.innerHTML = `
      <div class="sidebar-header">
        <a href="../index.html" class="brand-logo" title="HELIOS — Compliance Intelligence">
          <div class="brand-mark">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FFF" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="5"></circle>
              <line x1="12" y1="1" x2="12" y2="3"></line>
              <line x1="12" y1="21" x2="12" y2="23"></line>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
              <line x1="1" y1="12" x2="3" y2="12"></line>
              <line x1="21" y1="12" x2="23" y2="12"></line>
            </svg>
          </div>
          <div class="brand-text">
            <span class="brand-title">HELIOS</span>
            <span class="brand-subtitle">Compliance Assistant</span>
          </div>
        </a>
      </div>

      <nav class="sidebar-nav" aria-label="Main Navigation">
        <!-- 1. Home -->
        <a href="dashboard.html" class="nav-link ${page === 'dashboard' ? 'active' : ''}" title="Home Overview">
          <span class="nav-icon">🏠</span>
          <span>Home</span>
        </a>

        <!-- 2. Tasks -->
        <a href="approvals.html" class="nav-link ${page === 'approvals' ? 'active' : ''}" title="Your next steps">
          <span class="nav-icon">✓</span>
          <span>Tasks</span>
          <span class="nav-badge">2 due</span>
        </a>

        <!-- 3. Documents -->
        <a href="documents.html" class="nav-link ${page === 'documents' ? 'active' : ''}" title="Company documents">
          <span class="nav-icon">📄</span>
          <span>Documents</span>
        </a>

        <!-- 4. Calendar -->
        <a href="calendar.html" class="nav-link ${page === 'calendar' ? 'active' : ''}" title="Important dates & deadlines">
          <span class="nav-icon">📅</span>
          <span>Calendar</span>
        </a>

        <!-- 5. What's New -->
        <a href="regulations.html" class="nav-link ${page === 'regulations' ? 'active' : ''}" title="What's changed in the rules">
          <span class="nav-icon">🔎</span>
          <span>What's New</span>
          <span class="nav-badge" style="background: var(--color-brand-subtle); color: var(--color-brand);">New</span>
        </a>

        <!-- 6. Company Health -->
        <a href="risk.html" class="nav-link ${page === 'risk' ? 'active' : ''}" title="Company Health & Checks">
          <span class="nav-icon">🛡</span>
          <span>Company Health</span>
          <span class="nav-badge" style="background: var(--color-success-subtle); color: var(--color-success-text);">82%</span>
        </a>

        <!-- 7. Ask HELIOS -->
        <a href="policy-chat.html" class="nav-link ${page === 'policy-chat' ? 'active' : ''}" title="Ask your AI assistant">
          <span class="nav-icon">🤖</span>
          <span>Ask HELIOS</span>
        </a>

        <!-- 8. Settings -->
        <a href="onboarding.html" class="nav-link ${page === 'onboarding' ? 'active' : ''}" title="Company workspace settings">
          <span class="nav-icon">⚙</span>
          <span>Settings</span>
        </a>
      </nav>

      <div class="sidebar-footer">
        <a href="onboarding.html" class="workspace-chip" title="Manage Company Profile">
          <div>
            <div class="ws-name">${ws.name}</div>
            <div class="ws-type">${ws.isDemo ? 'Demo Workspace' : 'Your Company'} · ${ws.registeredState || 'Karnataka'}</div>
          </div>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
        </a>
      </div>
    `;
  }

  /**
   * Render Clean Friendly Header Topbar
   */
  function renderHeader(breadcrumbText) {
    const headerEl = document.getElementById('app-header');
    if (!headerEl) return;

    const ws = activeWorkspace || { name: "Zephyr Technologies", isDemo: true };

    headerEl.innerHTML = `
      <div class="header-left">
        <button class="btn btn-ghost btn-sm mobile-menu-btn" style="display: none;" onclick="HeliosUI.toggleSidebar()">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
        </button>

        <div style="display: flex; align-items: center; gap: var(--space-2);">
          <span style="font-size: var(--font-size-xs); font-weight: 700; color: var(--text-primary);">${breadcrumbText || 'Dashboard'}</span>
          <span style="font-size: var(--font-size-2xs); color: var(--text-muted);">· ${ws.name}</span>
        </div>
      </div>

      <div class="header-right">
        <!-- Command Search Trigger -->
        <button class="cmd-trigger-btn" onclick="HeliosUI.openCommandPalette()" title="Search documents, questions, rules (Ctrl+K)">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          <span>Search anything...</span>
          <kbd class="cmd-shortcut">⌘K</kbd>
        </button>

        <!-- Theme Switcher (Light / Dark) -->
        <button class="btn btn-secondary btn-sm" onclick="HeliosUI.toggleTheme()" title="Switch Light / Dark Theme" style="padding: 0.35rem 0.55rem; font-size: 0.8rem;">
          ${activeTheme === 'dark' ? '☀️' : '🌙'}
        </button>

        <!-- Demo Mode Indicator / Toggle -->
        <button class="btn btn-sm ${ws.isDemo ? 'btn-secondary' : 'btn-primary'}" onclick="HeliosUI.toggleDemoMode()" title="Toggle Demo Workspace">
          <span style="width: 6px; height: 6px; border-radius: 50%; background-color: ${ws.isDemo ? '#F59E0B' : '#10B981'}; display: inline-block;"></span>
          ${ws.isDemo ? 'Demo Mode' : 'Live Space'}
        </button>

        <!-- Role Badge & Switcher -->
        <div style="position: relative;">
          <button class="badge badge-brand" id="user-role-badge" onclick="HeliosUI.toggleRoleMenu()" title="Switch Team Role" style="cursor: pointer; padding: 0.25rem 0.65rem;">
            Role: <strong>${activeRole}</strong> ▾
          </button>
          <div id="role-dropdown-menu" style="display: none; position: absolute; right: 0; top: 120%; background: var(--bg-surface); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); box-shadow: var(--shadow-lg); width: 240px; z-index: 1000; padding: var(--space-2);">
            <div style="font-size: 0.65rem; color: var(--text-muted); font-weight: 700; text-transform: uppercase; padding: var(--space-2);">SWITCH ROLE</div>
            ${ROLES.map(r => `
              <div onclick="HeliosUI.switchRole('${r.id}')" style="padding: var(--space-2); border-radius: var(--radius-xs); cursor: pointer; display: flex; flex-direction: column; background: ${activeRole === r.id ? 'var(--bg-surface-secondary)' : 'transparent'};">
                <span style="font-size: 0.75rem; font-weight: ${activeRole === r.id ? '700' : '500'}; color: ${activeRole === r.id ? 'var(--color-brand)' : 'var(--text-primary)'};">${r.name}</span>
                <span style="font-size: 0.65rem; color: var(--text-muted);">${r.desc}</span>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Trust & Information Button -->
        <button class="btn btn-ghost btn-sm" onclick="HeliosUI.showLegalNotice()" title="About HELIOS Compliance Intelligence">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
        </button>
      </div>
    `;

    document.addEventListener('click', (e) => {
      const menu = document.getElementById('role-dropdown-menu');
      const badge = document.getElementById('user-role-badge');
      if (menu && badge && !badge.contains(e.target) && !menu.contains(e.target)) {
        menu.style.display = 'none';
      }
    });
  }

  /**
   * Render Mobile Navigation Bar (Home, Tasks, Documents, Ask HELIOS, More)
   */
  function renderMobileNav(activePage) {
    let mobileBar = document.getElementById('mobile-nav-bar');
    if (!mobileBar) {
      mobileBar = document.createElement('div');
      mobileBar.id = 'mobile-nav-bar';
      mobileBar.className = 'mobile-nav-bar';
      document.body.appendChild(mobileBar);
    }

    const page = activePage || getCurrentPageName();

    mobileBar.innerHTML = `
      <a href="dashboard.html" class="mobile-nav-item ${page === 'dashboard' ? 'active' : ''}">
        <span style="font-size: 1.1rem;">🏠</span>
        <span>Home</span>
      </a>
      <a href="approvals.html" class="mobile-nav-item ${page === 'approvals' ? 'active' : ''}">
        <span style="font-size: 1.1rem;">✓</span>
        <span>Tasks</span>
      </a>
      <a href="documents.html" class="mobile-nav-item ${page === 'documents' ? 'active' : ''}">
        <span style="font-size: 1.1rem;">📄</span>
        <span>Documents</span>
      </a>
      <a href="policy-chat.html" class="mobile-nav-item ${page === 'policy-chat' ? 'active' : ''}">
        <span style="font-size: 1.1rem;">🤖</span>
        <span>Ask HELIOS</span>
      </a>
      <a href="risk.html" class="mobile-nav-item ${page === 'risk' || page === 'calendar' || page === 'regulations' ? 'active' : ''}">
        <span style="font-size: 1.1rem;">🛡</span>
        <span>Health</span>
      </a>
    `;
  }

  /**
   * Command Palette Modal (Ctrl + K)
   */
  function initCommandPalette() {
    let paletteEl = document.getElementById('cmd-palette-backdrop');
    if (!paletteEl) {
      paletteEl = document.createElement('div');
      paletteEl.id = 'cmd-palette-backdrop';
      paletteEl.className = 'cmd-palette-backdrop';
      paletteEl.innerHTML = `
        <div class="cmd-palette-modal">
          <div class="cmd-input-wrapper">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color: var(--text-muted);"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            <input type="text" id="cmd-search-input" class="cmd-input" placeholder="Search documents, questions, rules, deadlines..." autocomplete="off" />
            <kbd class="cmd-shortcut">ESC</kbd>
          </div>
          <div id="cmd-results-container" class="cmd-results">
            <div style="padding: var(--space-4); text-align: center; color: var(--text-muted); font-size: var(--font-size-xs);">
              Type to search documents, tasks, and what's changed...
            </div>
          </div>
        </div>
      `;
      document.body.appendChild(paletteEl);

      paletteEl.addEventListener('click', (e) => {
        if (e.target === paletteEl) HeliosUI.closeCommandPalette();
      });

      const input = document.getElementById('cmd-search-input');
      let debounceTimer = null;
      input.addEventListener('input', () => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => HeliosUI.searchCommandPalette(input.value), 150);
      });
    }

    window.addEventListener('keydown', (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        HeliosUI.openCommandPalette();
      } else if (e.key === 'Escape') {
        HeliosUI.closeCommandPalette();
      }
    });
  }

  /**
   * Toast notification helper
   */
  function showToast(message, type = 'info') {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
      <span style="color: ${type === 'danger' ? '#EF4444' : type === 'success' ? '#10B981' : '#F59E0B'}; font-size: 1rem;">
        ${type === 'success' ? '✓' : type === 'danger' ? '⚠' : 'ℹ'}
      </span>
      <span style="flex: 1; font-size: var(--font-size-xs); color: var(--text-primary);">${message}</span>
    `;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transition = 'opacity 200ms ease';
      setTimeout(() => toast.remove(), 250);
    }, 3200);
  }

  /**
   * Friendly, Non-Jargon Stepped Document Processing Modal
   */
  function showProcessingModal(title, onStepCallback) {
    const steps = [
      "Uploading your document...",
      "Reading and scanning contents...",
      "Finding important details...",
      "Checking requirements against current rules...",
      "Finishing up..."
    ];

    const modal = document.createElement('div');
    modal.className = 'cmd-palette-backdrop';
    modal.style.display = 'flex';
    modal.id = 'helios-processing-modal';
    modal.innerHTML = `
      <div class="cmd-palette-modal" style="max-width: 440px; padding: var(--space-6); text-align: center;">
        <div style="font-size: 2.25rem; margin-bottom: var(--space-3);">📄</div>
        <h3 style="font-size: var(--font-size-sm); color: var(--text-primary); margin-bottom: var(--space-1);">${title || "Checking your document"}</h3>
        <p style="font-size: var(--font-size-2xs); color: var(--text-secondary); margin-bottom: var(--space-4);">We'll organize everything and let you know what matters.</p>
        
        <div style="background: var(--bg-surface-secondary); border-radius: var(--radius-md); padding: var(--space-4); text-align: left; margin-bottom: var(--space-4); border: 1px solid var(--border-subtle);">
          <div id="processing-step-label" style="font-size: var(--font-size-xs); font-weight: 600; color: var(--color-brand); margin-bottom: var(--space-2);">
            ${steps[0]}
          </div>
          <div style="height: 6px; background: var(--bg-surface-tertiary); border-radius: var(--radius-full); overflow: hidden;">
            <div id="processing-step-bar" style="height: 100%; width: 20%; background: var(--color-brand); transition: width 400ms ease;"></div>
          </div>
        </div>

        <div style="font-size: 0.7rem; color: var(--text-muted);">
          Grounded with verified official government information.
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep++;
      if (currentStep < steps.length) {
        const label = document.getElementById('processing-step-label');
        const bar = document.getElementById('processing-step-bar');
        if (label) label.textContent = steps[currentStep];
        if (bar) bar.style.width = `${((currentStep + 1) / steps.length) * 100}%`;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          modal.remove();
          if (typeof onStepCallback === 'function') onStepCallback();
        }, 300);
      }
    }, 400);
  }

  return {
    async init() {
      await loadActiveWorkspace();
      const activePage = getCurrentPageName();
      const breadcrumb = document.body.getAttribute('data-breadcrumb') || '';

      renderSidebar(activePage);
      renderHeader(breadcrumb);
      renderMobileNav(activePage);
      initCommandPalette();
    },

    toggleTheme() {
      activeTheme = activeTheme === 'dark' ? 'light' : 'dark';
      localStorage.setItem('helios_theme', activeTheme);
      document.documentElement.setAttribute('data-theme', activeTheme);
      this.init();
      showToast(`Switched to ${activeTheme === 'dark' ? 'Dark' : 'Light'} Mode`, 'info');
    },

    toggleSidebar() {
      const sidebar = document.getElementById('app-sidebar');
      if (sidebar) sidebar.classList.toggle('open');
    },

    toggleRoleMenu() {
      const menu = document.getElementById('role-dropdown-menu');
      if (menu) {
        menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
      }
    },

    switchRole(roleId) {
      activeRole = roleId;
      localStorage.setItem('helios_active_role', roleId);
      const badge = document.getElementById('user-role-badge');
      if (badge) badge.innerHTML = `Role: <strong>${roleId}</strong> ▾`;
      const menu = document.getElementById('role-dropdown-menu');
      if (menu) menu.style.display = 'none';
      showToast(`Role updated to ${roleId}`, 'success');
      window.dispatchEvent(new CustomEvent('helios:role-changed', { detail: { role: roleId } }));
      if (typeof window.updateUploadPermissions === 'function') {
        try { window.updateUploadPermissions(); } catch (e) {}
      }
    },

    getActiveRole() {
      return activeRole;
    },

    canUpload(role = null) {
      const currentRole = role || activeRole || localStorage.getItem('helios_active_role') || 'Founder';
      const r = currentRole.toString().toLowerCase().trim();
      const readOnly = ['viewer', 'employee', 'visitor', 'guest', 'read-only', 'read_only'];
      return !readOnly.includes(r);
    },

    openCommandPalette() {
      const p = document.getElementById('cmd-palette-backdrop');
      if (p) {
        p.style.display = 'flex';
        const input = document.getElementById('cmd-search-input');
        if (input) {
          input.value = '';
          input.focus();
          this.searchCommandPalette('');
        }
      }
    },

    closeCommandPalette() {
      const p = document.getElementById('cmd-palette-backdrop');
      if (p) p.style.display = 'none';
    },

    async searchCommandPalette(query) {
      const container = document.getElementById('cmd-results-container');
      if (!container) return;

      if (!query || query.trim().length === 0) {
        container.innerHTML = `
          <div style="padding: var(--space-2) var(--space-3); font-size: 0.7rem; color: var(--text-muted); font-weight: 700; text-transform: uppercase;">Quick Actions</div>
          <a href="dashboard.html" class="cmd-item"><span>🏠 Home Overview</span><span class="badge badge-brand">Home</span></a>
          <a href="approvals.html" class="cmd-item"><span>✓ Check Next Tasks</span><span class="badge badge-warning">Tasks</span></a>
          <a href="documents.html" class="cmd-item"><span>📄 Add Company Document</span><span class="badge badge-info">Vault</span></a>
          <a href="policy-chat.html" class="cmd-item"><span>🤖 Ask HELIOS Assistant</span><span class="badge badge-success">AI</span></a>
          <a href="regulations.html" class="cmd-item"><span>🔎 See What's New</span><span class="badge badge-brand">Rules</span></a>
          <a href="risk.html" class="cmd-item"><span>🛡 View Company Health</span><span class="badge badge-success">Health</span></a>
        `;
        return;
      }

      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        if (data.results && data.results.length > 0) {
          container.innerHTML = data.results.map(r => `
            <a href="${r.url}" class="cmd-item">
              <div>
                <div style="font-weight: 600; color: var(--text-primary);">${r.title}</div>
                <div style="font-size: 0.7rem; color: var(--text-secondary);">${r.subtitle}</div>
              </div>
              <span class="badge badge-info">${r.badge}</span>
            </a>
          `).join('');
        } else {
          container.innerHTML = `<div style="padding: var(--space-4); text-align: center; color: var(--text-muted); font-size: var(--font-size-xs);">No matching items found for "${query}".</div>`;
        }
      } catch (e) {
        container.innerHTML = `<div style="padding: var(--space-4); text-align: center; color: var(--color-danger); font-size: var(--font-size-xs);">Error searching.</div>`;
      }
    },

    async toggleDemoMode() {
      const nextState = !activeWorkspace.isDemo;
      try {
        const res = await fetch('/api/workspace/demo-toggle', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ enableDemo: nextState })
        });
        const data = await res.json();
        if (data.success) {
          activeWorkspace = data.workspace;
          showToast(nextState ? 'Switched to Demo Workspace' : 'Switched to Live Workspace', 'success');
          setTimeout(() => window.location.reload(), 400);
        }
      } catch (e) {
        showToast('Failed to switch workspace mode.', 'danger');
      }
    },

    showLegalNotice() {
      alert("HELIOS — Trust & Responsible Intelligence Notice\n\n1. HELIOS helps you understand company compliance, organize documents, and track deadlines.\n2. HELIOS IS NOT A LAWYER AND DOES NOT PROVIDE FORMAL LEGAL ADVICE.\n3. For critical legal filings, tax disputes, or corporate contracts, verify details with a qualified legal or tax professional.");
    },

    showToast,
    showProcessingModal,
    renderSidebar,
    renderHeader
  };
})();

document.addEventListener('DOMContentLoaded', () => {
  HeliosUI.init();
});
