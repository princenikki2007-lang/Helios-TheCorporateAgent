# ☀️ HELIOS — The Ultimate Corporate Agent

> **AI-Powered Corporate Intelligence, Internal Policy Assistant & Enterprise Governance Portal**

[![Stack](https://img.shields.io/badge/Frontend-Vanilla_HTML5_%2F_CSS3_%2F_ES6+-f7df1e?logo=javascript&logoColor=black)](#-tech-stack)
[![AI Providers](https://img.shields.io/badge/AI_Engine-Gemini_%7C_OpenAI_%7C_Groq-4285F4?logo=google-gemini&logoColor=white)](#-ai-engine--llm-integration)
[![Security](https://img.shields.io/badge/Security-SOC2_Audited_%7C_RBAC-2ea44f?logo=shield&logoColor=white)](#-enterprise-governance--security)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

---

## 📖 Table of Contents
1. [About the Project](#-about-the-project)
2. [Key Features](#-key-features)
3. [Tech Stack](#-tech-stack)
4. [Project Directory Structure](#-project-directory-structure)
5. [How to Run Locally](#-how-to-run-locally)
6. [Demo User Credentials & RBAC](#-demo-user-credentials--rbac)
7. [AI Engine & Live LLM Setup](#-ai-engine--live-llm-setup)
8. [Conflict-Free Contribution Workflow (No Merge Conflicts)](#-conflict-free-contribution-workflow-no-merge-conflicts)
9. [Coding Standards](#-coding-standards)

---

## 🌟 About the Project

**HELIOS** is an intelligent corporate policy and compliance intelligence platform designed to eliminate workplace ambiguity. It enables employees and enterprise administrators to securely interact with corporate handbooks, HR policies, benefits guidelines, and legal compliance documentation through grounded, citation-backed AI conversations.

### Why HELIOS?
- **Zero Hallucination Grounding:** Every answer references exact policy titles, sections, and page numbers.
- **Multi-Engine Flexibility:** Out-of-the-box support for Google Gemini 1.5 Flash, OpenAI GPT-4o-mini, Groq Llama 3.1, or an embedded offline neural policy engine.
- **Enterprise Governance:** Real-time SOC-2 access logs, AI query traceability, policy drift detection, and exportable compliance reports.
- **Framework-Free & High Performance:** Built on ultra-fast, zero-dependency Vanilla Web technologies (HTML5, modern CSS3 design systems, and modular ES6+ JavaScript).

---

## 🚀 Key Features

* **💬 Ask Helios Policy Chat:** Interactive chat interface with real-time response generation, conversation history grouping (Today, Previous 7 Days), and contextual prompt chips.
* **🏷️ Clickable Source Pill Citations:** Interactive metadata pills (`[Handbook · Section 4.2 ↗]`) that trigger detailed excerpt inspection modals and jump directly to relevant documents.
* **🛡️ Role-Based Access Control (RBAC):** Multi-tier authorization distinguishing **Employee**, **HR Manager**, and **Company Admin** roles across all routes.
* **📂 Document Knowledge Repository:** Document catalog with category filtering (HR Policies, Financial, Code of Conduct, IT Security), version badges, and preview drawers.
* **📊 Enterprise Governance & Audit Trail:** Dedicated portal for compliance officers and HR managers to review immutable query logs, detect outdated policy references, and export CSV audit reports.
* **⚙️ Client-Side AI Engine Settings:** Intuitive modal allowing users to enter custom API keys stored securely in browser session storage with instant fail-safe fallback.

---

## 💻 Tech Stack

| Layer | Technologies / Specifications |
| :--- | :--- |
| **Markup & Structure** | Semantic HTML5, WAI-ARIA accessible components |
| **Styling & Design System** | Vanilla CSS3, CSS Custom Properties (Tokens), Glassmorphism, Responsive Grid/Flexbox |
| **Logic & State** | Modular ES6+ JavaScript (Revealing Module Pattern / IIFE), LocalStorage sync |
| **AI Integration** | REST-based multi-provider connectors (`fetch` to Gemini API, OpenAI API, Groq API) |
| **Zero Dependencies** | No npm build step, No bundlers required, 100% native browser support |

---

## 📁 Project Directory Structure

```text
Helios/
├── PROJECT_SPEC.md              # Complete architecture & design specifications
├── README.md                    # Project documentation & contribution guidelines
└── frontend/                    # Web Application root
    ├── index.html               # Public landing page with live interactive demo
    ├── css/
    │   ├── global.css           # Design tokens, CSS variables, typography, reset
    │   ├── layout.css           # App sidebar, topbar, navigation shell, responsive layout
    │   ├── components.css       # Buttons, cards, badges, pills, modals, form inputs, toasts
    │   └── pages.css            # Page-specific views (Chat stream, Docs grid, Audit table)
    ├── js/
    │   ├── app.js               # Global application bootstrapper & session controller
    │   ├── auth.js              # Authentication state, role checking, session management
    │   ├── api.js               # Mock backend API layer & HTTP abstractions
    │   ├── ui.js                # Shell rendering (Sidebar, Topbar, Breadcrumbs, Toasts)
    │   ├── policy.js            # AI reasoning engine, multi-LLM dispatcher, citation parser
    │   └── documents.js         # Document management and filtering helpers
    ├── mock/
    │   ├── users.js             # Mock user accounts with distinct roles and departments
    │   ├── documents.js         # Mock corporate policy documents with full text excerpts
    │   └── conversations.js     # Seed conversations and policy query scenarios
    └── pages/
        ├── login.html           # Authentication portal with one-click quick switchers
        ├── dashboard.html       # Primary corporate overview & recent policy updates
        ├── policy-chat.html     # Real-time policy question interface & AI configuration
        ├── conversations.html   # Historical conversations & thread manager
        ├── documents.html       # Central policy repository & document browser
        ├── upload-document.html # HR document intake & metadata tagging interface
        ├── audit-logs.html      # Enterprise Governance, SOC-2 logs & policy drift monitor
        └── profile.html         # User profile, role verification & session settings
```

---

## ⚡ How to Run Locally

Because HELIOS is built purely on native web standards, **no `npm install` or compilation step is needed**. You can run it instantly using any static file server:

### Option 1: VS Code Live Server (Recommended)
1. Install the **Live Server** extension in Visual Studio Code.
2. Right-click [`frontend/index.html`](frontend/index.html) (or any file in `frontend/`) and select **"Open with Live Server"**.
3. Your browser will automatically open `http://127.0.0.1:5500/frontend/index.html`.

### Option 2: Node `npx serve`
```bash
# Run directly from the project root
npx serve frontend -p 3000
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Option 3: Python 3 Built-in Server
```bash
# Navigate to the frontend folder
cd frontend
python -m http.server 8000
```
Open [http://localhost:8000](http://localhost:8000) in your browser.

---

## 👥 Demo User Credentials & RBAC

You can test different role permissions using the pre-configured accounts (use any password or click the quick-login chips on the login page):

| Role | Email | Permissions / View Access |
| :--- | :--- | :--- |
| **Employee** | `alex.chen@acme.corp` | Ask Policy Chat, View Approved Documents, View Own Conversations |
| **HR Manager** | `sarah.jenkins@acme.corp` | Everything in Employee + Upload/Manage Policies, Access Governance & Audit Logs |
| **Company Admin** | `marcus.vance@acme.corp` | Full System Access (All Policies, All User Queries, SOC-2 Reports, Admin Controls) |

---

## 🤖 AI Engine & Live LLM Setup

HELIOS works seamlessly **out of the box** using its built-in corporate intelligence engine with zero configuration.

To connect live generative models:
1. Navigate to **Ask Helios** (`policy-chat.html`).
2. Click the **AI Engine** badge at the top right (e.g. `● Helios Neural AI`).
3. Select your provider (**Google Gemini**, **OpenAI**, or **Groq**) and paste your API key.
4. Click **Save & Connect**.
5. *Note:* Keys are stored purely in your local browser storage and never sent to third-party tracking servers. If an API call fails or key quota is exceeded, HELIOS automatically falls back to the embedded neural engine.

---

## 🔄 Conflict-Free Contribution Workflow (No Merge Conflicts)

To maintain a clean git history and prevent merge conflicts when collaborating across teams, follow this standardized branching and integration workflow:

### 1. Always Start with an Up-to-Date `main` Branch
Before starting work on any feature or bug fix:
```bash
git checkout main
git pull origin main
```

### 2. Create an Isolated Feature Branch
Use semantic branch naming conventions:
* `feat/<feature-name>` for new capabilities (e.g., `feat/analytics-chart`)
* `fix/<bug-name>` for bug fixes (e.g., `fix/citation-modal-overflow`)
* `docs/<topic>` for documentation changes (e.g., `docs/api-specs`)

```bash
git checkout -b feat/add-export-pdf
```

### 3. Modular File Architecture Rules
To avoid colliding on the same files:
* **Don't cram all logic into existing JS files.** Create dedicated modules in `frontend/js/` (e.g., `js/analytics.js`, `js/export.js`) and expose them on the `window.Helios*` namespace.
* **Keep Mock Datasets Pure:** Avoid mutating the default array structures in `frontend/mock/*.js`. If adding mock items, append unique IDs (e.g., `doc_099`, `conv_099`).
* **Use Component Styles:** Put page-specific CSS into `pages.css` or scoped sections rather than overwriting global base tokens in `global.css`.

### 4. Sync Regularly via Rebase (Prevent Conflict Commits)
Before committing or creating a Pull Request, rebase your changes on top of the latest `main`:
```bash
# Fetch latest updates from remote
git fetch origin

# Rebase your local branch onto the latest main
git rebase origin/main
```
> 💡 *Why Rebase?* Rebasing replays your commits cleanly on top of `main`, producing a linear, conflict-free commit history without unnecessary "Merge branch 'main'" clutter.

### 5. Follow Semantic Conventional Commits
Write atomic, structured commit messages:
```bash
git add frontend/js/export.js frontend/pages/documents.html
git commit -m "feat(documents): add PDF export capability to document drawer" -m "- Created exportToPdf helper in export.js`n- Added export action button to document preview drawer"
```

Common prefixes:
- `feat:` A new user-facing feature
- `fix:` A bug fix
- `refactor:` Code change that neither fixes a bug nor adds a feature
- `style:` Formatting, whitespace, or CSS styling tweaks
- `docs:` Documentation additions or modifications
- `chore:` Maintenance tasks, git configuration, assets update

### 6. Push and Open a Pull Request
```bash
git push -u origin feat/add-export-pdf
```
On GitHub, open a Pull Request targeting `main`. Ensure fast-forward or squash merging for clean history.

---

## 📐 Coding Standards

- **Formatting:** 2 spaces indentation, UTF-8 encoding, LF or CRLF standard line endings.
- **Module Pattern:** Encapsulate JavaScript modules using IIFEs (Immediately Invoked Function Expressions) or ES modules to avoid global variable contamination:
  ```javascript
  const HeliosFeature = (function() {
    'use strict';
    // private methods
    function init() { ... }

    // public API
    return { init };
  })();
  window.HeliosFeature = HeliosFeature;
  ```
- **XSS Prevention:** Always sanitize dynamic text before injecting into `innerHTML` using `HeliosPolicy.escapeHtml()` or native `textContent`.
- **Zero Secrets Policy:** Never commit plain API keys or tokens into repository files.

---

## 📄 License
This project is open-source under the [MIT License](LICENSE).
