/**
 * HELIOS — Shared UI Engine
 * Renders consistent Sidebar, Header, Breadcrumbs, Navigation, and Toasts
 */

const HeliosUI = (function() {
  // Navigation definitions
  const NAV_ITEMS = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>`,
      href: 'dashboard.html',
      roles: ['employee', 'hr_manager', 'company_admin']
    },
    {
      id: 'policy-chat',
      label: 'Ask Helios',
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path><path d="M9 10h.01"></path><path d="M15 10h.01"></path><path d="M12 10h.01"></path></svg>`,
      href: 'policy-chat.html',
      roles: ['employee', 'hr_manager', 'company_admin'],
      badge: 'AI'
    },
    {
      id: 'conversations',
      label: 'My Conversations',
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>`,
      href: 'conversations.html',
      roles: ['employee', 'hr_manager', 'company_admin']
    },
    {
      id: 'documents',
      label: 'Documents',
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>`,
      href: 'documents.html',
      roles: ['hr_manager', 'company_admin'], // Restricted from employee
      section: 'Administration'
    },
    {
      id: 'audit-logs',
      label: 'Audit & Governance',
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><path d="M9 12l2 2 4-4"></path></svg>`,
      href: 'audit-logs.html',
      roles: ['hr_manager', 'company_admin'], // Visible to both HR Manager & Company Admin
      section: 'Administration',
      badge: 'Admin'
    },
    {
      id: 'profile',
      label: 'Profile & Settings',
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>`,
      href: 'profile.html',
      roles: ['employee', 'hr_manager', 'company_admin']
    }
  ];

  /**
   * Render the Helios Brand Mark SVG
   */
  function getBrandLogoSvg() {
    return `
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="4.5" fill="currentColor" fill-opacity="0.95"/>
        <path d="M12 2V5M12 19V22M2 12H5M19 12H22M4.93 4.93L7.05 7.05M16.95 16.95L19.07 19.07M4.93 19.07L7.05 16.95M16.95 7.05L19.07 4.93" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      </svg>
    `;
  }

  /**
   * Determine current active page
   */
  function getCurrentPageId() {
    const path = window.location.pathname;
    const filename = path.split('/').pop() || 'dashboard.html';
    
    if (filename.includes('policy-chat')) return 'policy-chat';
    if (filename.includes('conversations')) return 'conversations';
    if (filename.includes('upload-document') || filename.includes('documents')) return 'documents';
    if (filename.includes('audit-logs')) return 'audit-logs';
    if (filename.includes('profile')) return 'profile';
    return 'dashboard';
  }

  /**
   * Render Shared Sidebar into container
   */
  function renderSidebar(containerId = 'app-sidebar') {
    const container = document.getElementById(containerId);
    if (!container) return;

    const user = window.HeliosAuth ? window.HeliosAuth.getCurrentUser() : null;
    const userRole = user ? user.role : 'employee';
    const activePage = getCurrentPageId();

    // Group nav items by section
    const generalItems = NAV_ITEMS.filter(item => !item.section && item.roles.includes(userRole));
    const adminItems = NAV_ITEMS.filter(item => item.section === 'Administration' && item.roles.includes(userRole));

    const renderNavList = (items) => items.map(item => `
      <a href="${item.href}" class="nav-item ${activePage === item.id ? 'active' : ''}" id="nav-item-${item.id}" title="${item.label}">
        <span class="nav-icon">${item.icon}</span>
        <span class="nav-label">${item.label}</span>
        ${item.badge ? `<span class="nav-badge">${item.badge}</span>` : ''}
      </a>
    `).join('');

    const sidebarHTML = `
      <div class="sidebar-brand">
        <a href="dashboard.html" class="sidebar-brand-link">
          <div class="brand-icon-wrapper" aria-label="HELIOS Logo">
            ${getBrandLogoSvg()}
          </div>
          <div class="brand-text-block">
            <span class="brand-title">HELIOS</span>
            <span class="brand-tagline">The Ultimate Corporate Agent</span>
          </div>
        </a>
      </div>

      <nav class="sidebar-nav-container" aria-label="Main Navigation">
        <div class="nav-section">
          <div class="nav-section-label">General</div>
          ${renderNavList(generalItems)}
        </div>

        ${adminItems.length > 0 ? `
          <div class="nav-section" id="sidebar-admin-section">
            <div class="nav-section-label">Administration</div>
            ${renderNavList(adminItems)}
          </div>
        ` : ''}
      </nav>

      <div class="sidebar-footer">
        <a href="profile.html" class="sidebar-user-pill" title="View Profile">
          <div class="user-avatar-sm">${user ? user.avatar : 'U'}</div>
          <div class="sidebar-user-details">
            <span class="sidebar-user-name">${user ? user.name : 'Corporate User'}</span>
            <span class="sidebar-user-role">${user ? user.role.replace('_', ' ') : 'Employee'}</span>
          </div>
        </a>
        <button type="button" class="sidebar-collapse-btn" id="sidebar-collapse-toggle" title="Toggle Sidebar Width">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
    `;

    container.innerHTML = sidebarHTML;
    bindSidebarEvents(container);
  }

  /**
   * Bind events for Sidebar
   */
  function bindSidebarEvents(sidebar) {
    const toggleBtn = document.getElementById('sidebar-collapse-toggle');
    if (toggleBtn) {
      // Restore collapsed preference
      const isCollapsed = localStorage.getItem('helios_sidebar_collapsed') === 'true';
      if (isCollapsed) sidebar.classList.add('collapsed');

      toggleBtn.addEventListener('click', () => {
        sidebar.classList.toggle('collapsed');
        localStorage.setItem('helios_sidebar_collapsed', sidebar.classList.contains('collapsed'));
      });
    }
  }

  /**
   * Render Shared Header
   */
  function renderHeader(containerId = 'app-header', pageTitle = '', breadcrumb = 'Portal') {
    const container = document.getElementById(containerId);
    if (!container) return;

    const user = window.HeliosAuth ? window.HeliosAuth.getCurrentUser() : null;
    const activePage = getCurrentPageId();

    const titleMap = {
      'dashboard': 'Executive Dashboard',
      'policy-chat': 'Ask Helios',
      'conversations': 'My Conversations',
      'documents': 'Document Repository',
      'audit-logs': 'Enterprise Governance & Audit Logs',
      'profile': 'Profile & Account Settings'
    };

    const displayTitle = pageTitle || titleMap[activePage] || 'Corporate Portal';

    const headerHTML = `
      <div class="header-left">
        <button type="button" class="mobile-menu-toggle" id="mobile-menu-btn" aria-label="Open Navigation">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>
        <div class="header-page-title-group">
          <div class="header-breadcrumbs">
            <span>Helios</span>
            <span>/</span>
            <span>${breadcrumb}</span>
          </div>
          <h1 class="header-page-title">${displayTitle}</h1>
        </div>
      </div>

      <div class="header-right">
        <div class="header-search-bar">
          <span class="header-search-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </span>
          <input type="text" class="header-search-input" id="global-search-input" placeholder="Search policies or topics..." />
        </div>

        <a href="policy-chat.html" class="btn btn-primary btn-sm" id="header-ask-helios-btn">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
          Ask Helios
        </a>

        <!-- User Dropdown -->
        <div class="user-dropdown">
          <button type="button" class="user-menu-trigger" id="user-menu-toggle" aria-expanded="false" aria-haspopup="true">
            <div class="user-avatar-sm">${user ? user.avatar : 'U'}</div>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </button>

          <div class="user-menu-dropdown" id="user-menu-dropdown">
            <div class="dropdown-header">
              <div class="dropdown-user-name">${user ? user.name : 'User'}</div>
              <div class="dropdown-user-role">${user ? user.role.replace('_', ' ') : 'Employee'} · ${user ? user.organization_name : 'Enterprise'}</div>
            </div>

            <!-- Role Switcher for easy demoing -->
            <div style="padding: 4px 10px; font-size: 10px; font-weight: 700; color: #94A3B8; text-transform: uppercase;">Switch Role (Demo)</div>
            <a href="javascript:void(0)" class="dropdown-item" onclick="HeliosAuth.switchRole('employee')">
              <span class="status-dot" style="color: ${user && user.role === 'employee' ? '#D97706' : '#94A3B8'}"></span>
              Employee
            </a>
            <a href="javascript:void(0)" class="dropdown-item" onclick="HeliosAuth.switchRole('hr_manager')">
              <span class="status-dot" style="color: ${user && user.role === 'hr_manager' ? '#D97706' : '#94A3B8'}"></span>
              HR Manager
            </a>
            <a href="javascript:void(0)" class="dropdown-item" onclick="HeliosAuth.switchRole('company_admin')">
              <span class="status-dot" style="color: ${user && user.role === 'company_admin' ? '#D97706' : '#94A3B8'}"></span>
              Company Admin
            </a>

            <div style="border-top: 1px solid var(--border-subtle); margin: 6px 0;"></div>

            <a href="profile.html" class="dropdown-item">Profile & Settings</a>
            <a href="javascript:void(0)" class="dropdown-item text-danger" onclick="HeliosAuth.logout()">Sign Out</a>
          </div>
        </div>
      </div>
    `;

    container.innerHTML = headerHTML;
    bindHeaderEvents();
  }

  /**
   * Bind Header events
   */
  function bindHeaderEvents() {
    const userToggle = document.getElementById('user-menu-toggle');
    const dropdown = document.getElementById('user-menu-dropdown');
    const mobileToggle = document.getElementById('mobile-menu-btn');
    const sidebar = document.getElementById('app-sidebar');

    if (userToggle && dropdown) {
      userToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        dropdown.classList.toggle('active');
      });

      document.addEventListener('click', () => {
        dropdown.classList.remove('active');
      });
    }

    if (mobileToggle && sidebar) {
      let overlay = document.querySelector('.sidebar-overlay');
      if (!overlay) {
        overlay = document.createElement('div');
        overlay.className = 'sidebar-overlay';
        document.body.appendChild(overlay);
      }

      mobileToggle.addEventListener('click', () => {
        sidebar.classList.toggle('mobile-open');
        overlay.classList.toggle('active');
      });

      overlay.addEventListener('click', () => {
        sidebar.classList.remove('mobile-open');
        overlay.classList.remove('active');
      });
    }
  }

  /**
   * Toast notification helper
   */
  function showToast(message, type = 'info', duration = 3500) {
    let container = document.querySelector('.toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
      <span>${message}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transition = 'opacity 300ms ease';
      setTimeout(() => toast.remove(), 300);
    }, duration);
  }

  return {
    renderSidebar,
    renderHeader,
    showToast,
    getBrandLogoSvg
  };
})();

window.HeliosUI = HeliosUI;
