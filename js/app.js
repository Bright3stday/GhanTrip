// AusExplorer Main Application Controller
let activeTab = 'itinerary';
let activeDayIndex = 0;
let deferredInstallPrompt = null;
let currentTheme = localStorage.getItem('aus_theme') || 'dark';

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initServiceWorker();
  initNavigation();
  initHeaderActions();
  renderCurrentView();
  initLiveClocks();
});

// Theme Management
function initTheme() {
  document.documentElement.setAttribute('data-theme', currentTheme);
  updateThemeIcon();
}

function toggleTheme() {
  if (currentTheme === 'dark') currentTheme = 'light';
  else if (currentTheme === 'light') currentTheme = 'sunlight';
  else currentTheme = 'dark';
  
  localStorage.setItem('aus_theme', currentTheme);
  document.documentElement.setAttribute('data-theme', currentTheme);
  updateThemeIcon();
}

function updateThemeIcon() {
  const btn = document.getElementById('themeToggleBtn');
  if (!btn) return;
  if (currentTheme === 'dark') btn.innerHTML = getIcon('sun');
  else if (currentTheme === 'light') btn.innerHTML = getIcon('moon');
  else btn.innerHTML = getIcon('zap');
}

// Service Worker & Offline PWA Installation
function initServiceWorker() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js')
      .then(reg => console.log('[App] SW registered:', reg.scope))
      .catch(err => console.log('[App] SW registration note:', err));
  }

  // Network Status Monitor
  window.addEventListener('online', updateOnlineStatus);
  window.addEventListener('offline', updateOnlineStatus);
  updateOnlineStatus();

  // PWA Install Prompt Capture
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredInstallPrompt = e;
    const installBtn = document.getElementById('installHeaderBtn');
    if (installBtn) installBtn.classList.remove('hidden');
  });
}

function updateOnlineStatus() {
  const badge = document.getElementById('offlineStatusBadge');
  if (!badge) return;
  if (navigator.onLine) {
    badge.innerHTML = `${getIcon('check', 'inline-icon')} Offline Ready`;
    badge.className = 'status-badge offline-mode';
  } else {
    badge.innerHTML = `${getIcon('wifiOff', 'inline-icon')} 100% Offline`;
    badge.className = 'status-badge offline-mode';
  }
}

function triggerInstallApp() {
  if (deferredInstallPrompt) {
    deferredInstallPrompt.prompt();
    deferredInstallPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('User installed the PWA');
      }
      deferredInstallPrompt = null;
    });
  } else {
    showInstallModal();
  }
}

// Navigation & Tab Switching
function initNavigation() {
  const navButtons = document.querySelectorAll('.nav-item');
  navButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTab = btn.getAttribute('data-tab');
      switchTab(targetTab);
    });
  });
}

function switchTab(tabId) {
  activeTab = tabId;
  document.querySelectorAll('.nav-item').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-tab') === tabId);
  });
  renderCurrentView();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Header Actions
function initHeaderActions() {
  const themeBtn = document.getElementById('themeToggleBtn');
  if (themeBtn) themeBtn.addEventListener('click', toggleTheme);

  const installBtn = document.getElementById('installHeaderBtn');
  if (installBtn) installBtn.addEventListener('click', triggerInstallApp);

  const infoBtn = document.getElementById('infoModalBtn');
  if (infoBtn) infoBtn.addEventListener('click', showInfoModal);
}

// Render Controller
function renderCurrentView() {
  const container = document.getElementById('viewContainer');
  if (!container) return;

  switch (activeTab) {
    case 'itinerary':
      renderItineraryView(container);
      break;
    case 'tracker':
      renderTrackerView(container);
      break;
    case 'survival':
      renderSurvivalView(container);
      break;
    case 'transit':
      renderTransitView(container);
      break;
    case 'tools':
      renderToolsView(container);
      break;
  }
}

// 1. ITINERARY VIEW
function renderItineraryView(container) {
  const days = ItineraryData.days;
  const currentDay = days[activeDayIndex] || days[0];

  let html = `
    <div class="section-header">
      <h1 class="section-title">${getIcon('calendar')} Trip Itinerary</h1>
      <p class="section-desc">5 Days: Adelaide (1D), The Ghan Expedition (3D2N), Darwin (1D)</p>
    </div>

    <!-- Day Filter Chips -->
    <div class="day-selector-scroll">
      ${days.map((d, index) => `
        <button class="day-chip ${index === activeDayIndex ? 'active' : ''}" onclick="selectDayIndex(${index})">
          <span>Day ${d.dayNumber}</span>
          <small>(${d.state})</small>
        </button>
      `).join('')}
    </div>

    <!-- Day Overview Hero Card -->
    <div class="card card-hero">
      <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 8px;">
        <div>
          <span class="status-badge" style="background: var(--ochre-primary); color: #FFF; margin-bottom: 6px;">${currentDay.badge}</span>
          <h2 style="font-size: 1.15rem; font-weight: 800; color: var(--text-main); margin-top: 4px;">${currentDay.title}</h2>
          <div style="display: flex; align-items: center; gap: 4px; font-size: 0.78rem; color: var(--ocean-blue); margin-top: 4px; font-weight: 600;">
            ${getIcon('mapPin')} ${currentDay.location}
          </div>
        </div>
      </div>
      
      <p style="font-size: 0.84rem; color: var(--text-main); margin-top: 10px; line-height: 1.45;">${currentDay.summary}</p>

      <div class="hero-stats">
        ${Object.entries(currentDay.quickStats).map(([k, v]) => `
          <div class="stat-box">
            <div class="stat-label">${k}</div>
            <div class="stat-val">${v}</div>
          </div>
        `).join('')}
      </div>
    </div>

    <!-- Day Highlights -->
    <div class="card" style="padding: 12px 16px;">
      <div style="font-size: 0.75rem; font-weight: 800; text-transform: uppercase; color: var(--text-muted); margin-bottom: 6px;">
        Key Highlights
      </div>
      <div style="display: flex; flex-wrap: wrap; gap: 6px;">
        ${currentDay.highlights.map(h => `
          <span style="background: var(--card-bg-elevated); border: 1px solid var(--border-subtle); font-size: 0.76rem; font-weight: 600; padding: 4px 10px; border-radius: var(--radius-full); color: var(--text-main);">
            ✨ ${h}
          </span>
        `).join('')}
      </div>
    </div>

    <!-- Timeline Events -->
    <div style="margin-top: 20px;">
      <h3 style="font-size: 1rem; font-weight: 800; margin-bottom: 14px; display: flex; align-items: center; gap: 6px;">
        ${getIcon('clock')} Timed Schedule & Guide
      </h3>
      <div class="timeline">
        ${currentDay.timeline.map(item => `
          <div class="timeline-item">
            <div class="timeline-marker"></div>
            <div class="timeline-content">
              <div class="timeline-header">
                <span class="timeline-time">${getIcon('clock')} ${item.time}</span>
                <span class="timeline-cat">${item.category}</span>
              </div>
              <div class="timeline-title">${item.title}</div>
              <div class="timeline-location">${getIcon('mapPin')} ${item.location}</div>
              <div class="timeline-desc">${item.description}</div>
              ${item.tips ? `
                <div class="timeline-tips">
                  <strong>Travel Tip:</strong> ${item.tips}
                </div>
              ` : ''}
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;

  container.innerHTML = html;
}

function selectDayIndex(index) {
  activeDayIndex = index;
  renderCurrentView();
  window.scrollTo({ top: 120, behavior: 'smooth' });
}

// 2. THE GHAN COMPANION & TRACKER VIEW
function renderTrackerView(container) {
  const overview = TrackerData.overview;
  const mileposts = TrackerData.mileposts;
  const life = TrackerData.trainLife;

  let html = `
    <div class="section-header">
      <h1 class="section-title">${getIcon('train')} The Ghan Expedition Companion</h1>
      <p class="section-desc">2,979 km Transcontinental Rail Guide & Live Milepost Tracker</p>
    </div>

    <!-- Ghan Quick Facts -->
    <div class="card card-hero">
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <span class="status-badge" style="background: var(--ochre-primary); color: #FFF;">Transcontinental Iconic Rail</span>
        <span style="font-size: 0.75rem; font-weight: 700; color: var(--sun-gold);">54 Hours Total</span>
      </div>
      <h2 style="font-size: 1.15rem; font-weight: 800; margin-top: 6px;">${overview.trainName}</h2>
      <p style="font-size: 0.82rem; color: var(--text-muted); margin-top: 4px;">${overview.history}</p>
      
      <div class="hero-stats" style="grid-template-columns: repeat(2, 1fr); margin-top: 12px;">
        <div class="stat-box">
          <div class="stat-label">Total Distance</div>
          <div class="stat-val">2,979 km (Adelaide to Darwin)</div>
        </div>
        <div class="stat-box">
          <div class="stat-label">Locomotives & Length</div>
          <div class="stat-val">~800m (30-36 Carriages)</div>
        </div>
      </div>
    </div>

    <!-- Interactive Visual Route Map -->
    <div class="card map-card-container">
      <div style="padding: 12px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-subtle);">
        <span style="font-size: 0.82rem; font-weight: 800; color: var(--text-main); display: flex; align-items: center; gap: 6px;">
          ${getIcon('compass')} Transcontinental Route Schematic
        </span>
        <span style="font-size: 0.72rem; color: var(--text-muted);">Adelaide ➔ Darwin</span>
      </div>
      <div style="padding: 10px 0;">
        <img src="./assets/maps/ghan-route.svg" alt="The Ghan Route Map" class="vector-map" style="max-height: 420px; object-fit: contain; margin: 0 auto;"/>
      </div>
    </div>

    <!-- Essential Train Life Guide -->
    <div class="card" style="margin-bottom: 20px;">
      <h3 style="font-size: 0.95rem; font-weight: 800; margin-bottom: 12px; display: flex; align-items: center; gap: 6px;">
        ${getIcon('info')} Life Onboard: Power, Dining & Luggage
      </h3>

      <div style="display: flex; flex-direction: column; gap: 10px;">
        <div style="background: var(--card-bg-elevated); padding: 10px 12px; border-radius: var(--radius-sm); border-left: 3px solid var(--ocean-blue);">
          <div style="font-size: 0.78rem; font-weight: 800; color: var(--ocean-blue); text-transform: uppercase;">🔌 Power Sockets (240V AU Type I)</div>
          <div style="font-size: 0.8rem; color: var(--text-main); margin-top: 3px;">${life.power}</div>
        </div>

        <div style="background: var(--card-bg-elevated); padding: 10px 12px; border-radius: var(--radius-sm); border-left: 3px solid var(--desert-red);">
          <div style="font-size: 0.78rem; font-weight: 800; color: var(--desert-red); text-transform: uppercase;">📵 Connectivity Warning (No On-Train Wi-Fi)</div>
          <div style="font-size: 0.8rem; color: var(--text-main); margin-top: 3px;">${life.connectivity}</div>
        </div>

        <div style="background: var(--card-bg-elevated); padding: 10px 12px; border-radius: var(--radius-sm); border-left: 3px solid var(--sun-gold);">
          <div style="font-size: 0.78rem; font-weight: 800; color: var(--sun-gold); text-transform: uppercase;">🍷 Dining & Drinks Etiquette</div>
          <div style="font-size: 0.8rem; color: var(--text-main); margin-top: 3px;">${life.dining}</div>
        </div>

        <div style="background: var(--card-bg-elevated); padding: 10px 12px; border-radius: var(--radius-sm); border-left: 3px solid var(--eucalyptus-green);">
          <div style="font-size: 0.78rem; font-weight: 800; color: var(--eucalyptus-green); text-transform: uppercase;">🧳 Cabin Daypack vs Checked Hold Luggage</div>
          <div style="font-size: 0.8rem; color: var(--text-main); margin-top: 3px;">${life.luggage}</div>
        </div>
      </div>
    </div>

    <!-- Mileposts List -->
    <div style="margin-top: 10px;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
        <h3 style="font-size: 1rem; font-weight: 800; display: flex; align-items: center; gap: 6px;">
          ${getIcon('mapPin')} Route Mileposts (${mileposts.length} Key Points)
        </h3>
      </div>

      <div class="milepost-list">
        ${mileposts.map(m => `
          <div class="milepost-card">
            <div class="milepost-top">
              <span class="milepost-km-badge">KM ${m.km}</span>
              <span class="signal-tag ${m.signalClass}">${getIcon('phone')} ${m.cellSignal}</span>
            </div>
            <div>
              <div class="milepost-name">${m.name} <small style="font-size: 0.75rem; color: var(--text-muted);">(${m.state})</small></div>
              <div style="font-size: 0.75rem; color: var(--ochre-light); font-weight: 600; margin-top: 2px;">
                ${m.day} • ${m.time} • Elev: ${m.elevation}
              </div>
            </div>
            <div class="milepost-notes">${m.notes}</div>
            <div class="milepost-sight">
              <strong>Window View:</strong> ${m.windowSight}
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;

  container.innerHTML = html;
}

// 3. SURVIVAL & EMERGENCY VIEW
function renderSurvivalView(container) {
  const contacts = SurvivalData.emergencyContacts;
  const hospitals = SurvivalData.hospitals;
  const rules = SurvivalData.safetyRules;

  let html = `
    <div class="section-header">
      <h1 class="section-title">${getIcon('shield')} Outback & Top End Survival</h1>
      <p class="section-desc">Emergency Directory, Hospital Locator & Critical Wildlife Protocols</p>
    </div>

    <!-- Quick Emergency Dial Grid -->
    <h3 style="font-size: 0.95rem; font-weight: 800; margin-bottom: 8px; display: flex; align-items: center; gap: 6px;">
      ${getIcon('phone')} One-Tap Emergency Numbers
    </h3>
    <div class="emergency-grid">
      ${contacts.map(c => `
        <a href="tel:${c.number}" class="emergency-btn">
          <span style="font-size: 0.68rem; font-weight: 800; color: var(--text-muted); text-transform: uppercase;">${c.badge}</span>
          <span class="emergency-number">${c.number}</span>
          <span class="emergency-label">${c.name}</span>
          <span class="emergency-desc">${c.description}</span>
        </a>
      `).join('')}
    </div>

    <!-- Critical Safety Directives (Crocs, Stingers, Heat, Snakebite) -->
    <h3 style="font-size: 0.95rem; font-weight: 800; margin: 20px 0 10px 0; display: flex; align-items: center; gap: 6px;">
      ${getIcon('alertTriangle')} Critical Safety & First Aid Directives
    </h3>
    <div>
      ${rules.map(r => `
        <div class="safety-box ${r.severity.includes('CRITICAL') ? 'critical' : ''}">
          <div class="safety-header">
            <span class="safety-severity">${r.severity}</span>
            <span style="font-size: 0.72rem; font-weight: 700; color: var(--text-muted);">${r.badge}</span>
          </div>
          <h4 style="font-size: 1rem; font-weight: 800; color: var(--text-main); margin-bottom: 6px;">${r.title}</h4>
          <p style="font-size: 0.82rem; color: var(--text-main); line-height: 1.4;">${r.summary}</p>
          
          <ul class="safety-list">
            ${r.dos.map(d => `<li class="do">${d}</li>`).join('')}
            ${r.donts ? r.donts.map(dn => `<li class="dont">${dn}</li>`).join('') : ''}
          </ul>
        </div>
      `).join('')}
    </div>

    <!-- Hospital & 24h Medical Centre Directory -->
    <h3 style="font-size: 0.95rem; font-weight: 800; margin: 24px 0 10px 0; display: flex; align-items: center; gap: 6px;">
      ${getIcon('hospital')} 24/7 Hospital & Medical Directory
    </h3>
    <div style="display: flex; flex-direction: column; gap: 12px;">
      ${hospitals.map(h => `
        <div class="card">
          <div style="display: flex; justify-content: space-between; align-items: flex-start;">
            <div>
              <span class="status-badge" style="background: var(--card-bg-elevated); border: 1px solid var(--border-subtle); color: var(--ocean-blue); margin-bottom: 4px;">${h.city} (${h.state})</span>
              <h4 style="font-size: 1rem; font-weight: 800; color: var(--text-main);">${h.name}</h4>
              <div style="font-size: 0.78rem; color: var(--text-muted);">${h.type}</div>
            </div>
            <a href="tel:${h.phone.replace(/\s+/g, '')}" class="btn btn-primary" style="padding: 6px 10px; font-size: 0.75rem;">
              ${getIcon('phone')} Call
            </a>
          </div>
          
          <div style="margin-top: 10px; font-size: 0.8rem; color: var(--text-main); line-height: 1.4;">
            <div><strong>📍 Address:</strong> ${h.address}</div>
            <div><strong>⏰ Emergency Dept:</strong> <span style="color: #10B981; font-weight: 700;">${h.openHours}</span></div>
            <div style="margin-top: 4px; color: var(--text-muted);"><strong>Transit Directions:</strong> ${h.directions}</div>
          </div>
        </div>
      `).join('')}
    </div>
  `;

  container.innerHTML = html;
}

// 4. TRANSIT & CITY GUIDES VIEW
function renderTransitView(container) {
  const t = SurvivalData.transitInfo;
  const slang = SurvivalData.slangAndEtiquette;
  const etiquette = SurvivalData.culturalTips;

  let html = `
    <div class="section-header">
      <h1 class="section-title">${getIcon('bus')} City Transit & Local Etiquette</h1>
      <p class="section-desc">Adelaide Metro, Darwinbus, Tipping Norms & Aussie Slang</p>
    </div>

    <!-- Adelaide Transit Card -->
    <div class="card">
      <span class="status-badge" style="background: rgba(139, 92, 246, 0.15); color: #A78BFA; border: 1px solid rgba(139, 92, 246, 0.3);">Adelaide, SA</span>
      <h3 style="font-size: 1.1rem; font-weight: 800; margin: 6px 0 4px 0;">${t.adelaide.metroTitle}</h3>
      <p style="font-size: 0.82rem; color: var(--text-main);">${t.adelaide.details}</p>
      
      <div style="margin-top: 10px; font-size: 0.8rem; line-height: 1.45; display: flex; flex-direction: column; gap: 8px;">
        <div style="background: var(--card-bg-elevated); padding: 8px 10px; border-radius: var(--radius-sm);">
          <strong>💳 Fares & Ticketing:</strong> ${t.adelaide.fares}
        </div>
        <div style="background: var(--card-bg-elevated); padding: 8px 10px; border-radius: var(--radius-sm);">
          <strong>🆓 Free Zones:</strong>
          <ul style="padding-left: 18px; margin-top: 4px;">
            ${t.adelaide.freeZones.map(fz => `<li>${fz}</li>`).join('')}
          </ul>
        </div>
        <div style="background: var(--card-bg-elevated); padding: 8px 10px; border-radius: var(--radius-sm);">
          <strong>🏖️ Glenelg Beach Tram:</strong> ${t.adelaide.glenelgTram}
        </div>
        <div style="background: var(--card-bg-elevated); padding: 8px 10px; border-radius: var(--radius-sm);">
          <strong>🚉 Getting to The Ghan Terminal:</strong> ${t.adelaide.parklandsTerminal}
        </div>
      </div>
    </div>

    <!-- Darwin Transit Card -->
    <div class="card">
      <span class="status-badge" style="background: rgba(56, 189, 248, 0.15); color: #38BDF8; border: 1px solid rgba(56, 189, 248, 0.3);">Darwin, NT</span>
      <h3 style="font-size: 1.1rem; font-weight: 800; margin: 6px 0 4px 0;">${t.darwin.metroTitle}</h3>
      <p style="font-size: 0.82rem; color: var(--text-main);">${t.darwin.details}</p>
      
      <div style="margin-top: 10px; font-size: 0.8rem; line-height: 1.45; display: flex; flex-direction: column; gap: 8px;">
        <div style="background: var(--card-bg-elevated); padding: 8px 10px; border-radius: var(--radius-sm);">
          <strong>💳 Fares:</strong> ${t.darwin.fares}
        </div>
        <div style="background: var(--card-bg-elevated); padding: 8px 10px; border-radius: var(--radius-sm);">
          <strong>🚌 Key Routes:</strong>
          <ul style="padding-left: 18px; margin-top: 4px;">
            ${t.darwin.keyRoutes.map(kr => `<li>${kr}</li>`).join('')}
          </ul>
        </div>
        <div style="background: var(--card-bg-elevated); padding: 8px 10px; border-radius: var(--radius-sm);">
          <strong>🚉 The Ghan Berrimah Terminal Transfer:</strong> ${t.darwin.berrimahTerminal}
        </div>
      </div>
    </div>

    <!-- Tipping, Payments & Culture -->
    <div class="card">
      <h3 style="font-size: 1rem; font-weight: 800; margin-bottom: 10px; display: flex; align-items: center; gap: 6px;">
        ${getIcon('dollar')} Aussie Customs & Financial Etiquette
      </h3>
      <div style="display: flex; flex-direction: column; gap: 8px; font-size: 0.8rem;">
        <div><strong>💰 Tipping Norms:</strong> ${etiquette.tipping}</div>
        <div><strong>💳 Cashless Society:</strong> ${etiquette.payments}</div>
        <div><strong>⏰ Time Zones:</strong> ${etiquette.timeZones}</div>
        <div><strong>🔌 Power Plugs:</strong> ${etiquette.power}</div>
      </div>
    </div>

    <!-- Aussie Slang Glossary -->
    <div class="card">
      <h3 style="font-size: 1rem; font-weight: 800; margin-bottom: 10px; display: flex; align-items: center; gap: 6px;">
        ${getIcon('info')} Aussie Slang & Terminology Decoder
      </h3>
      <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px;">
        ${slang.map(s => `
          <div style="background: var(--card-bg-elevated); padding: 8px 10px; border-radius: var(--radius-sm); border: 1px solid var(--border-subtle);">
            <div style="font-weight: 800; color: var(--ochre-light); font-size: 0.85rem;">"${s.term}"</div>
            <div style="font-size: 0.72rem; color: var(--text-muted);">${s.meaning}</div>
          </div>
        `).join('')}
      </div>
    </div>
  `;

  container.innerHTML = html;
}

// 5. TRAVEL TOOLBOX VIEW (Checklists, Vault, Journal, Expenses)
function renderToolsView(container) {
  const checklist = ToolsManager.getChecklist();
  const vault = ToolsManager.getVault();
  const journal = ToolsManager.getJournal();
  const expenses = ToolsManager.getExpenses();
  const totalSpend = expenses.reduce((sum, e) => sum + (parseFloat(e.amount) || 0), 0);

  let html = `
    <div class="section-header">
      <h1 class="section-title">${getIcon('toolbox')} Offline Travel Toolbox</h1>
      <p class="section-desc">Interactive Packing Lists, Document Vault, Journal & AUD Expenses</p>
    </div>

    <!-- Tool Subtabs -->
    <div class="day-selector-scroll" id="toolSubtabs">
      <button class="day-chip active" onclick="showToolSection('checklistSection')">🧳 Packing Checklist</button>
      <button class="day-chip" onclick="showToolSection('vaultSection')">🔒 Booking Vault</button>
      <button class="day-chip" onclick="showToolSection('journalSection')">📖 Trip Journal</button>
      <button class="day-chip" onclick="showToolSection('expenseSection')">💵 Expense Tracker</button>
      <button class="day-chip" onclick="showToolSection('backupSection')">💾 Backup & Share</button>
    </div>

    <!-- Section 1: Checklist -->
    <div id="checklistSection" class="tool-subview">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
        <h3 style="font-size: 1rem; font-weight: 800;">Interactive Luggage & Packing Checklist</h3>
        <button class="btn btn-secondary" style="padding: 4px 8px; font-size: 0.72rem;" onclick="resetChecklistData()">Reset Default</button>
      </div>

      ${checklist.map((cat, catIdx) => {
        const checkedCount = cat.items.filter(i => i.checked).length;
        const totalCount = cat.items.length;
        const pct = totalCount > 0 ? Math.round((checkedCount / totalCount) * 100) : 0;
        return `
          <div class="checklist-category">
            <div class="checklist-cat-header">
              <div>
                <div class="checklist-cat-title">${cat.category}</div>
                <div style="font-size: 0.72rem; color: var(--text-muted);">${cat.description}</div>
              </div>
              <span class="checklist-cat-count">${checkedCount}/${totalCount} (${pct}%)</span>
            </div>
            
            <div class="checklist-items">
              ${cat.items.map(item => `
                <div class="check-row ${item.checked ? 'checked' : ''}" onclick="toggleCheck(${catIdx}, '${item.id}')">
                  <div class="checkbox-custom">${item.checked ? getIcon('check') : ''}</div>
                  <div class="check-text">${item.text}</div>
                </div>
              `).join('')}
            </div>

            <div style="display: flex; gap: 6px; margin-top: 6px;">
              <input type="text" id="addCheck_${catIdx}" placeholder="Add custom item to this bag..." class="form-input" style="padding: 6px 10px; font-size: 0.8rem;" />
              <button class="btn btn-primary" style="padding: 6px 12px; font-size: 0.8rem;" onclick="addCustomCheckItem(${catIdx})">Add</button>
            </div>
          </div>
        `;
      }).join('')}
    </div>

    <!-- Section 2: Travel Vault -->
    <div id="vaultSection" class="tool-subview hidden">
      <div class="card card-hero">
        <h3 style="font-size: 1rem; font-weight: 800; display: flex; align-items: center; gap: 6px;">
          ${getIcon('shield')} Secure Offline Booking Vault
        </h3>
        <p style="font-size: 0.78rem; color: var(--text-muted); margin-top: 2px;">
          Saved securely in your device browser storage. Keep key reference numbers handy offline.
        </p>

        <form id="vaultForm" onsubmit="saveVaultData(event)" style="margin-top: 14px;">
          <div class="form-group">
            <label class="form-label">The Ghan Booking Ref / PNR</label>
            <input type="text" id="vGhanRef" class="form-input" value="${vault.ghanBookingRef || ''}" placeholder="e.g. GHAN-948271" />
          </div>
          <div class="form-group">
            <label class="form-label">The Ghan Cabin Number</label>
            <input type="text" id="vGhanCabin" class="form-input" value="${vault.ghanCabinNo || ''}" placeholder="e.g. Carriage K, Cabin 04" />
          </div>
          <div class="form-group">
            <label class="form-label">Adelaide Hotel Details</label>
            <input type="text" id="vAdlHotel" class="form-input" value="${vault.adelaideHotel || ''}" placeholder="Hotel name & address" />
          </div>
          <div class="form-group">
            <label class="form-label">Darwin Hotel Details</label>
            <input type="text" id="vDrwHotel" class="form-input" value="${vault.darwinHotel || ''}" placeholder="Hotel name & address" />
          </div>
          <div class="form-group">
            <label class="form-label">Travel Insurance Policy & 24h Hotline</label>
            <input type="text" id="vInsurance" class="form-input" value="${vault.insurancePolicy || ''}" placeholder="Provider & Policy No." />
          </div>
          <div class="form-group">
            <label class="form-label">Personal Emergency Contact & Phone</label>
            <input type="text" id="vEmerg" class="form-input" value="${vault.emergencyContactPhone || ''}" placeholder="Name & Mobile Number" />
          </div>
          <button type="submit" class="btn btn-primary btn-block">Save to Local Vault</button>
        </form>
      </div>
    </div>

    <!-- Section 3: Trip Journal -->
    <div id="journalSection" class="tool-subview hidden">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px;">
        <h3 style="font-size: 1rem; font-weight: 800;">Offline Travel Journal (${journal.length} Entries)</h3>
        <button class="btn btn-primary" style="padding: 6px 12px; font-size: 0.8rem;" onclick="showAddJournalModal()">+ New Note</button>
      </div>

      <div style="display: flex; flex-direction: column; gap: 12px;">
        ${journal.map(j => `
          <div class="card">
            <div style="display: flex; justify-content: space-between; align-items: flex-start;">
              <div>
                <span class="status-badge" style="background: rgba(200, 90, 50, 0.15); color: var(--ochre-light); margin-bottom: 4px;">${j.day}</span>
                <h4 style="font-size: 1rem; font-weight: 800; color: var(--text-main); margin-top: 2px;">${j.title}</h4>
                <div style="font-size: 0.72rem; color: var(--text-muted);">${j.date}</div>
              </div>
              <button class="icon-btn" style="width: 28px; height: 28px;" onclick="deleteJournalItem('${j.id}')">
                ${getIcon('trash')}
              </button>
            </div>
            <p style="font-size: 0.83rem; color: var(--text-main); line-height: 1.45; margin-top: 8px; white-space: pre-line;">${j.content}</p>
          </div>
        `).join('')}
      </div>
    </div>

    <!-- Section 4: Expense Tracker -->
    <div id="expenseSection" class="tool-subview hidden">
      <div class="card card-hero" style="display: flex; justify-content: space-between; align-items: center;">
        <div>
          <div style="font-size: 0.75rem; color: var(--text-muted); font-weight: 700; text-transform: uppercase;">Total Trip Spend</div>
          <div style="font-size: 1.6rem; font-weight: 900; color: var(--sun-gold);">$${totalSpend.toFixed(2)} AUD</div>
        </div>
        <button class="btn btn-primary" style="padding: 8px 14px;" onclick="showAddExpenseModal()">+ Add Expense</button>
      </div>

      <div style="margin-top: 14px;">
        <h4 style="font-size: 0.9rem; font-weight: 800; margin-bottom: 8px;">Logged Expenses (${expenses.length})</h4>
        <div style="display: flex; flex-direction: column; gap: 8px;">
          ${expenses.length === 0 ? `
            <div class="card text-center" style="color: var(--text-muted); font-size: 0.85rem; padding: 20px;">
              No expenses recorded yet. Tap '+ Add Expense' to log your purchases.
            </div>
          ` : expenses.map(e => `
            <div class="card" style="padding: 10px 14px; display: flex; justify-content: space-between; align-items: center; margin-bottom: 0;">
              <div>
                <div style="font-weight: 800; font-size: 0.9rem; color: var(--text-main);">${e.description}</div>
                <div style="font-size: 0.72rem; color: var(--text-muted);">${e.day} • ${e.category}</div>
              </div>
              <div style="display: flex; align-items: center; gap: 10px;">
                <span style="font-family: var(--font-mono); font-weight: 800; font-size: 0.95rem; color: var(--ochre-light);">$${e.amount.toFixed(2)}</span>
                <button class="icon-btn" style="width: 26px; height: 26px;" onclick="deleteExpenseItem('${e.id}')">${getIcon('trash')}</button>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>

    <!-- Section 5: Backup & Export -->
    <div id="backupSection" class="tool-subview hidden">
      <div class="card">
        <h3 style="font-size: 1rem; font-weight: 800; margin-bottom: 6px; display: flex; align-items: center; gap: 6px;">
          ${getIcon('download')} Data Backup & Multi-Device Sync
        </h3>
        <p style="font-size: 0.82rem; color: var(--text-muted); line-height: 1.4;">
          Export all your offline trip data (checklists, booking vault, journal notes, and logged expenses) to a single JSON backup file, or restore from a previous export.
        </p>

        <div style="display: flex; flex-direction: column; gap: 10px; margin-top: 16px;">
          <button class="btn btn-primary" onclick="ToolsManager.exportBackup()">
            ${getIcon('download')} Export Trip Data (JSON)
          </button>
          
          <label class="btn btn-secondary" style="cursor: pointer;">
            ${getIcon('plus')} Import Backup JSON
            <input type="file" accept=".json" style="display: none;" onchange="handleImportFile(event)" />
          </label>
        </div>
      </div>
    </div>
  `;

  container.innerHTML = html;
}

// Toolbox Helper Functions
function showToolSection(sectionId) {
  document.querySelectorAll('.tool-subview').forEach(el => el.classList.add('hidden'));
  const target = document.getElementById(sectionId);
  if (target) target.classList.remove('hidden');

  const chips = document.querySelectorAll('#toolSubtabs .day-chip');
  chips.forEach(c => c.classList.remove('active'));
  event.target.classList.add('active');
}

function toggleCheck(catIdx, itemId) {
  ToolsManager.toggleCheckItem(catIdx, itemId);
  renderCurrentView();
}

function addCustomCheckItem(catIdx) {
  const input = document.getElementById(`addCheck_${catIdx}`);
  if (input && input.value.trim()) {
    ToolsManager.addCheckItem(catIdx, input.value.trim());
    renderCurrentView();
  }
}

function resetChecklistData() {
  if (confirm('Reset checklist back to default recommendations?')) {
    ToolsManager.resetChecklist();
    renderCurrentView();
  }
}

function saveVaultData(e) {
  e.preventDefault();
  const data = {
    ghanBookingRef: document.getElementById('vGhanRef').value.trim(),
    ghanCabinNo: document.getElementById('vGhanCabin').value.trim(),
    adelaideHotel: document.getElementById('vAdlHotel').value.trim(),
    darwinHotel: document.getElementById('vDrwHotel').value.trim(),
    insurancePolicy: document.getElementById('vInsurance').value.trim(),
    emergencyContactPhone: document.getElementById('vEmerg').value.trim()
  };
  ToolsManager.saveVault(data);
  alert('Booking Vault saved offline successfully!');
}

function deleteJournalItem(id) {
  if (confirm('Delete this journal entry?')) {
    ToolsManager.deleteJournalEntry(id);
    renderCurrentView();
  }
}

function deleteExpenseItem(id) {
  ToolsManager.deleteExpense(id);
  renderCurrentView();
}

function handleImportFile(e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (evt) => {
    const ok = ToolsManager.importBackup(evt.target.result);
    if (ok) {
      alert('Data imported successfully!');
      renderCurrentView();
    } else {
      alert('Invalid backup file.');
    }
  };
  reader.readAsText(file);
}

// Modal Handlers
function showAddJournalModal() {
  const modal = document.createElement('div');
  modal.className = 'modal-backdrop';
  modal.id = 'activeModal';
  modal.innerHTML = `
    <div class="modal-sheet">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
        <h3 style="font-size: 1.1rem; font-weight: 800;">New Trip Journal Entry</h3>
        <button class="icon-btn" onclick="closeActiveModal()">✕</button>
      </div>
      <form onsubmit="handleJournalSubmit(event)">
        <div class="form-group">
          <label class="form-label">Trip Day</label>
          <select id="jDaySelect" class="form-select">
            <option value="Day 1 (Adelaide)">Day 1: Adelaide</option>
            <option value="Day 2 (The Ghan SA)">Day 2: The Ghan (SA Outback)</option>
            <option value="Day 3 (Alice Springs)">Day 3: Alice Springs & Red Centre</option>
            <option value="Day 4 (Katherine & Darwin)">Day 4: Katherine Gorge & Darwin Arrival</option>
            <option value="Day 5 (Darwin Top End)">Day 5: Darwin Top End</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Title / Landmark</label>
          <input type="text" id="jTitleInput" class="form-input" placeholder="e.g. Simpsons Gap Wallabies" required />
        </div>
        <div class="form-group">
          <label class="form-label">Notes & Memories</label>
          <textarea id="jContentInput" class="form-textarea" rows="5" placeholder="Write your thoughts, sights, meals, and memories..." required></textarea>
        </div>
        <button type="submit" class="btn btn-primary btn-block">Save Note to Offline Journal</button>
      </form>
    </div>
  `;
  document.body.appendChild(modal);
}

function handleJournalSubmit(e) {
  e.preventDefault();
  const day = document.getElementById('jDaySelect').value;
  const title = document.getElementById('jTitleInput').value.trim();
  const content = document.getElementById('jContentInput').value.trim();
  ToolsManager.addJournalEntry(day, title, content);
  closeActiveModal();
  renderCurrentView();
}

function showAddExpenseModal() {
  const modal = document.createElement('div');
  modal.className = 'modal-backdrop';
  modal.id = 'activeModal';
  modal.innerHTML = `
    <div class="modal-sheet">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
        <h3 style="font-size: 1.1rem; font-weight: 800;">Log AUD Expense</h3>
        <button class="icon-btn" onclick="closeActiveModal()">✕</button>
      </div>
      <form onsubmit="handleExpenseSubmit(event)">
        <div class="form-group">
          <label class="form-label">Amount ($ AUD)</label>
          <input type="number" step="0.01" id="expAmount" class="form-input" placeholder="0.00" required />
        </div>
        <div class="form-group">
          <label class="form-label">Category</label>
          <select id="expCategory" class="form-select">
            <option value="Dining & Food">Dining & Food</option>
            <option value="Transport & Taxis">Transport & Taxis</option>
            <option value="Excursions & Entry">Excursions & Entry</option>
            <option value="Souvenirs & Gifts">Souvenirs & Gifts</option>
            <option value="Emergency & Meds">Emergency & Meds</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Description</label>
          <input type="text" id="expDesc" class="form-input" placeholder="e.g. Central Market Coffee, Fly Net" required />
        </div>
        <div class="form-group">
          <label class="form-label">Trip Day</label>
          <select id="expDay" class="form-select">
            <option value="Day 1">Day 1: Adelaide</option>
            <option value="Day 2">Day 2: The Ghan Day 1</option>
            <option value="Day 3">Day 3: Alice Springs</option>
            <option value="Day 4">Day 4: Katherine & Darwin</option>
            <option value="Day 5">Day 5: Darwin</option>
          </select>
        </div>
        <button type="submit" class="btn btn-primary btn-block">Log Expense</button>
      </form>
    </div>
  `;
  document.body.appendChild(modal);
}

function handleExpenseSubmit(e) {
  e.preventDefault();
  const amt = document.getElementById('expAmount').value;
  const cat = document.getElementById('expCategory').value;
  const desc = document.getElementById('expDesc').value.trim();
  const day = document.getElementById('expDay').value;
  ToolsManager.addExpense(amt, cat, desc, day);
  closeActiveModal();
  renderCurrentView();
}

function showInstallModal() {
  const modal = document.createElement('div');
  modal.className = 'modal-backdrop';
  modal.id = 'activeModal';
  modal.innerHTML = `
    <div class="modal-sheet">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
        <h3 style="font-size: 1.1rem; font-weight: 800;">Install Offline App on Phone</h3>
        <button class="icon-btn" onclick="closeActiveModal()">✕</button>
      </div>
      
      <div style="font-size: 0.84rem; line-height: 1.45; color: var(--text-main); display: flex; flex-direction: column; gap: 14px;">
        <p>This web application is 100% offline-ready. Once installed, it works completely without internet access or cellular data across The Ghan desert blackspots.</p>
        
        <div style="background: var(--card-bg-elevated); padding: 12px; border-radius: var(--radius-md); border: 1px solid var(--border-subtle);">
          <div style="font-weight: 800; color: var(--ocean-blue); margin-bottom: 4px;">📱 For iPhone / iPad (Safari):</div>
          <ol style="padding-left: 20px; font-size: 0.8rem; display: flex; flex-direction: column; gap: 4px;">
            <li>Tap the <strong>Share</strong> button (square with up arrow at bottom of screen).</li>
            <li>Scroll down and tap <strong>'Add to Home Screen'</strong>.</li>
            <li>Tap <strong>'Add'</strong> in the top-right corner.</li>
          </ol>
        </div>

        <div style="background: var(--card-bg-elevated); padding: 12px; border-radius: var(--radius-md); border: 1px solid var(--border-subtle);">
          <div style="font-weight: 800; color: var(--eucalyptus-green); margin-bottom: 4px;">🤖 For Android (Chrome):</div>
          <ol style="padding-left: 20px; font-size: 0.8rem; display: flex; flex-direction: column; gap: 4px;">
            <li>Tap the <strong>three dots menu (⋮)</strong> in the top right.</li>
            <li>Select <strong>'Install app'</strong> or <strong>'Add to Home screen'</strong>.</li>
            <li>Confirm installation to your device app drawer.</li>
          </ol>
        </div>
      </div>

      <button class="btn btn-primary btn-block" style="margin-top: 18px;" onclick="closeActiveModal()">Got It!</button>
    </div>
  `;
  document.body.appendChild(modal);
}

function showInfoModal() {
  const modal = document.createElement('div');
  modal.className = 'modal-backdrop';
  modal.id = 'activeModal';
  modal.innerHTML = `
    <div class="modal-sheet">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
        <h3 style="font-size: 1.1rem; font-weight: 800;">About AusExplorer</h3>
        <button class="icon-btn" onclick="closeActiveModal()">✕</button>
      </div>
      
      <div style="font-size: 0.84rem; line-height: 1.45; color: var(--text-main); display: flex; flex-direction: column; gap: 12px;">
        <p><strong>AusExplorer</strong> is an all-in-one, standalone travel companion crafted for exploring Australia's heartland: Adelaide (Day 1), The Ghan Expedition (3D2N across 2,979 km), and Darwin (Day 5).</p>
        
        <div style="background: var(--card-bg-elevated); padding: 10px; border-radius: var(--radius-sm);">
          <strong>⚡ Offline Guarantee:</strong> All maps, timetables, milepost databases, and safety directives are cached locally in your device. No mobile data or roaming required.
        </div>

        <div style="font-size: 0.78rem; color: var(--text-muted);">
          Version: 1.0.0 (Production Release)<br/>
          Designed for high legibility under intense Australian sunlight.
        </div>
      </div>

      <button class="btn btn-primary btn-block" style="margin-top: 16px;" onclick="closeActiveModal()">Close</button>
    </div>
  `;
  document.body.appendChild(modal);
}

function closeActiveModal() {
  const modal = document.getElementById('activeModal');
  if (modal) modal.remove();
}

// Live Timezone Comparison Clocks (Adelaide ACST/ACDT vs NT ACST)
function initLiveClocks() {
  // Can be extended with local time difference displays
}
