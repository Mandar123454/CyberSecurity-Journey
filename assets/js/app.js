(() => {
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  // Scroll reveal using IntersectionObserver
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (e.isIntersecting) {
        e.target.classList.add('in-view');
        io.unobserve(e.target);
      }
    }
  }, { threshold: 0.12 });
  $$('.reveal').forEach(el => io.observe(el));

  // Particles — minimal, fast
  const canvas = $('#particles');
  const ctx = canvas.getContext('2d');
  let W, H, particles;
  const DPR = Math.min(2, window.devicePixelRatio || 1);
  function resize() {
    W = canvas.width = Math.floor(window.innerWidth * DPR);
    H = canvas.height = Math.floor(window.innerHeight * DPR);
  }
  function initParticles() {
    const count = Math.round(Math.min(120, Math.max(60, W * H / (1100 * 1100)) * 90));
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.15 * DPR,
      vy: (Math.random() - 0.5) * 0.15 * DPR,
      r: Math.random() * 1.6 + 0.6,
      a: Math.random() * 0.5 + 0.2
    }));
  }
  function tick() {
    ctx.clearRect(0, 0, W, H);
    ctx.globalCompositeOperation = 'lighter';
    for (const p of particles) {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;
      ctx.beginPath();
      const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 6);
      g.addColorStop(0, `rgba(0,230,168,${p.a})`);
      g.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = g;
      ctx.arc(p.x, p.y, p.r * 6, 0, Math.PI * 2);
      ctx.fill();
    }
    requestAnimationFrame(tick);
  }
  function startParticles() { resize(); initParticles(); tick(); }
  window.addEventListener('resize', () => { resize(); initParticles(); });
  startParticles();

  // Tools & Commands Matrix
  const toolsBody = $('#toolsBody');
  const search = $('#search');
  const statusFilter = $('#statusFilter');

  const fallbackData = [
    { tool: 'OpenVPN', command: 'openvpn --config htb.ovpn', purpose: 'Connect to HTB network', status: 'success' },
    { tool: 'Ping', command: 'ping -c 4 10.10.11.123', purpose: 'ICMP reachability', status: 'success' },
    { tool: 'Nmap', command: 'nmap -sC -sV -oN scans/initial 10.10.11.123', purpose: 'Service discovery', status: 'success' },
    { tool: 'WhatWeb', command: 'whatweb http://10.10.11.123', purpose: 'Web fingerprinting', status: 'success' },
    { tool: 'Gobuster', command: 'gobuster dir -u http://10.10.11.123 -w /usr/share/wordlists/dirb/common.txt', purpose: 'Directory brute-force', status: 'success' },
    { tool: 'Curl', command: 'curl -i http://10.10.11.123/login.aspx', purpose: 'Endpoint probing', status: 'success' },
    { tool: 'Burp Suite', command: 'Intercept + Repeater', purpose: 'Request tampering & fuzzing', status: 'success' },
    { tool: 'Enum4Linux', command: 'enum4linux -a 10.10.11.123', purpose: 'SMB enumeration', status: 'success' },
    { tool: 'smbclient', command: 'smbclient -N -L \\	arget\\', purpose: 'Anonymous SMB listing', status: 'failed' },
    { tool: 'FTP', command: 'ftp 10.10.11.123 (anonymous)', purpose: 'Anonymous FTP', status: 'failed' },
    { tool: 'SSH', command: 'ssh user@10.10.11.123', purpose: 'Shell access', status: 'failed' },
    { tool: 'Custom Python LFI script', command: 'python3 lfi.py "../../web.config"', purpose: 'Local File Inclusion exploitation', status: 'success' },
    { tool: 'icacls', command: 'icacls C:\\path\\file', purpose: 'Check file permissions (Windows)', status: 'success' },
    { tool: 'accesschk.exe', command: 'accesschk.exe -uwcqv "Users" *', purpose: 'Privilege audit (Windows)', status: 'success' },
    { tool: 'SQL Injection Attempts', command: "' OR 1=1 --  in login field", purpose: 'SQLi probe', status: 'failed' }
  ];

  let rows = [];
  function normStatus(s) {
    const v = String(s || '').toLowerCase();
    if (v.includes('✅') || v.includes('success') || v.includes('ok') || v.includes('passed')) return 'success';
    if (v.includes('❌') || v.includes('fail') || v.includes('error') || v.includes('denied')) return 'failed';
    return v.trim();
  }
  function render() {
    const q = (search.value || '').toLowerCase();
    const f = statusFilter.value;
    const filtered = rows.filter(r => {
      const hit = `${r.tool} ${r.command} ${r.purpose}`.toLowerCase().includes(q);
      const statusOk = (f === 'all') || (normStatus(r.status) === f);
      return hit && statusOk;
    });
    toolsBody.innerHTML = filtered.map(r => `
      <tr>
        <td>${escapeHtml(r.tool)}</td>
        <td><code>${escapeHtml(r.command)}</code></td>
        <td>${escapeHtml(r.purpose)}</td>
        <td><span class="status">${normStatus(r.status) === 'success' ? '<span class="dot ok"></span> ✅ Success' : '<span class="dot bad"></span> ❌ Failed'}</span></td>
      </tr>
    `).join('');
  }

  function escapeHtml(s) {
    return String(s)
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#039;');
  }

  async function loadTools() {
    try {
      const res = await fetch('assets/data/tools.json', { cache: 'no-store' });
      if (!res.ok) throw new Error('Bad status');
      rows = await res.json();
    } catch (err) {
      rows = fallbackData;
    }
    render();
  }
  search.addEventListener('input', render);
  statusFilter.addEventListener('change', render);
  loadTools();

  // Progress bar animation
  function animateProgress() {
    const pb = $('.progressbar');
    if (!pb) return;
    const start = parseFloat(pb.dataset.start || '0');
    const end = parseFloat(pb.dataset.end || '70');
    const fill = $('.bar-fill', pb);
    const label = $('.progress-value', pb);
    let t0;
    function step(t) {
      if (!t0) t0 = t;
      const d = Math.min(1, (t - t0) / 1500);
      const val = start + (end - start) * d;
      fill.style.width = `${val}%`;
      label.textContent = `${val.toFixed(2)}%`;
      if (d < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  // Trigger when in view
  const pbEl = $('.progressbar');
  if (pbEl) {
    const pio = new IntersectionObserver((es) => {
      if (es[0].isIntersecting) { animateProgress(); pio.disconnect(); }
    }, { threshold: 0.3 });
    pio.observe(pbEl);
  }

  // Evidence modal + lazy loading
  const modal = $('#evidenceModal');
  const modalGrid = $('#evidenceGrid');
  const modalTitle = $('.modal-title', modal);
  const evidenceMap = {
    success: [
      { p: 'Results Screenshots/TombWatcher.png', alt: 'TombWatcher Machine' },
      { p: 'Results Screenshots/TombWatcher Pwned.png', alt: 'TombWatcher Pwned' },
      { p: 'Results Screenshots/CIS CAT Success Report.png', alt: 'CIS CAT Success Report' },
    ],
    enumeration: [
      { p: 'Results Screenshots/Screenshots with cmds/VPN Connection (1).png' },
      { p: 'Results Screenshots/Screenshots with cmds/Ping (1).png' },
    ],
    nmap: [
      { p: 'Results Screenshots/Screenshots with cmds/Nmap Full Scan 1 (1).png' },
      { p: 'Results Screenshots/Screenshots with cmds/Nmap Full Scan 2 (1).png' },
      { p: 'Results Screenshots/Screenshots with cmds/Nmap Full Port Scan (1).png' },
      { p: 'Results Screenshots/Screenshots with cmds/Nmap Aggressive Scan 1 (1).png' },
      { p: 'Results Screenshots/Screenshots with cmds/Nmap Aggressive Scan 2 (1).png' },
    ],
    web: [
      { p: 'Results Screenshots/Screenshots with cmds/Enumeration (Web) (1).png' },
      { p: 'Results Screenshots/Screenshots with cmds/Gobuster Brute Force (1).png' },
      { p: 'Results Screenshots/Screenshots with cmds/Gobuster HTTP Header Inspection (1).png' },
      { p: 'Results Screenshots/Screenshots with cmds/Gobuster Page Content Inspection (1).png' },
    ],
    lfi: [
      { p: 'Results Screenshots/Screenshots with cmds/Gobuster LFI Exploit Script(Python) (1).png' },
      { p: 'Results Screenshots/Screenshots with cmds/LFI Exploit Script(Python) Output (1).png' },
    ],
    smb: [
      { p: 'Results Screenshots/Screenshots with cmds/SMB Enumeration (1).png' },
      { p: 'Results Screenshots/Screenshots with cmds/SMB Enumeration SID (1).png' },
    ],
    ciscat: [
      { p: 'Results Screenshots/Screenshots with cmds/Intro Ciscat.png' },
      { p: 'Results Screenshots/Screenshots with cmds/CIS-CAT 1 (1).png' },
      { p: 'Results Screenshots/Screenshots with cmds/CIS-CAT 2 (1).png' },
      { p: 'Results Screenshots/Screenshots with cmds/ciscat.png' },
      { p: 'Results Screenshots/Screenshots with cmds/Assessment Report 2 (1).png' },
    ],
  };

  const groupLabel = {
    success: 'Success Proof',
    enumeration: 'Enumeration',
    nmap: 'Nmap',
    web: 'Web Enumeration / Gobuster',
    lfi: 'Exploitation — LFI',
    smb: 'SMB Enumeration',
    ciscat: 'CIS-CAT',
  };

  function encodePath(path) { return encodeURI(path).replace(/#/g, '%23'); }

  function buildShots(items) {
    modalGrid.innerHTML = '';
    for (const it of items) {
      const path = encodePath(it.p);
      const name = it.alt || it.p.split('/').pop();
      const card = document.createElement('div');
      card.className = 'shot';
      const link = document.createElement('a');
      link.href = path; link.target = '_blank'; link.rel = 'noopener';
      const img = document.createElement('img');
      img.loading = 'lazy';
      img.alt = name;
      img.dataset.src = path; // lazy set via IO
      const cap = document.createElement('div');
      cap.className = 'cap';
      cap.textContent = name;
      link.appendChild(img);
      card.appendChild(link);
      card.appendChild(cap);
      modalGrid.appendChild(card);
    }

    const imgs = $$('img[data-src]', modalGrid);
    const mio = new IntersectionObserver((es, obs) => {
      for (const e of es) {
        if (e.isIntersecting) {
          const im = e.target; im.src = im.dataset.src; im.removeAttribute('data-src');
          obs.unobserve(im);
        }
      }
    }, { root: modalGrid, threshold: 0.1 });
    imgs.forEach(im => mio.observe(im));
  }

  function openEvidence(key) {
    const items = evidenceMap[key] || [];
    modalTitle.textContent = groupLabel[key] || 'Evidence';
    buildShots(items);
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    modalGrid.focus();
  }

  function closeEvidence() {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  modal.addEventListener('click', (e) => {
    if (e.target.matches('[data-close]')) closeEvidence();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) closeEvidence();
  });

  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.evidence-btn');
    if (btn) {
      const group = btn.getAttribute('data-group');
      openEvidence(group);
    }
  });

  // Expose for inline handlers if needed
  window.openEvidence = openEvidence;
})();
