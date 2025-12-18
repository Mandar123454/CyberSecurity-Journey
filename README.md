# 💀 CyberSecurity Journey — Evidence-Backed Security Portfolio

[![Stars](https://img.shields.io/github/stars/Mandar123454/CyberSecurity-Journey?style=for-the-badge)](https://github.com/Mandar123454/CyberSecurity-Journey/stargazers)
[![Forks](https://img.shields.io/github/forks/Mandar123454/CyberSecurity-Journey?style=for-the-badge)](https://github.com/Mandar123454/CyberSecurity-Journey/network/members)
[![Issues](https://img.shields.io/github/issues/Mandar123454/CyberSecurity-Journey?style=for-the-badge)](https://github.com/Mandar123454/CyberSecurity-Journey/issues)
[![Last Commit](https://img.shields.io/github/last-commit/Mandar123454/CyberSecurity-Journey?style=for-the-badge)](https://github.com/Mandar123454/CyberSecurity-Journey/commits)
[![License: MIT](https://img.shields.io/badge/License-MIT-success?style=for-the-badge)](LICENSE)

[![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white&style=for-the-badge)](#)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white&style=for-the-badge)](#)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=222&style=for-the-badge)](#)

A self-directed cybersecurity project documenting real offensive and defensive security work, executed independently using industry-standard tools and methodologies.

This repository demonstrates hands-on penetration testing, system hardening, failed and successful attack paths, and verifiable evidence — presented in a professional, performance-focused dashboard.

## 🧠 Project Overview

- Type: Independent / Self-Directed Practice  
- Duration: 02 July 2025 – 02 September 2025  
- Environment: Kali Linux & Windows 11  
- Focus Areas: Penetration Testing · Security Hardening · Compliance Auditing

## Tech
- HTML5, CSS3, Vanilla JavaScript (no frameworks, no backend)
- Optimized animations (keyframes, transitions, IntersectionObserver)
- Netlify-ready static site

## Structure
- index.html
- assets/css/style.css
- assets/js/app.js
- assets/data/tools.json
- Results Screenshots/ (filenames referenced in UI; not auto-loaded)

## ⚠️ Disclaimer (Responsible Use)
This project was conducted independently for educational and portfolio purposes only.

- All offensive security testing was performed exclusively in authorized lab environments (HackTheBox and local test systems).  
- Do not target real systems without explicit written permission.  
- All commands and screenshots are provided as evidence of lawful lab practice.  
- You are solely responsible for how you use this material.

## Open Practice & Proof
- Evidence is loaded on-demand via a modal to avoid auto-displaying sensitive artifacts.  
- Screenshots are grouped by phase (Enumeration, Nmap, Web, Exploitation/LFI, SMB, CIS‑CAT).  
- The Tools & Commands Matrix is searchable and filterable (success and failed attempts).

## Run Locally
Use any static server. Examples:

### VS Code Live Server (recommended)
- Install the Live Server extension
- Open index.html and click “Go Live”

### Node
```bash
npx serve .
```

### Python
```bash
# Python 3
python -m http.server 5500
# then open http://localhost:5500
```

Note: Loading JSON via the file:// protocol is blocked by browsers. A local server or Netlify is required for the Tools Matrix. The app includes a safe JS fallback dataset to preview without a server.

## Deploy (Netlify)
- Build command: (leave empty)  
- Publish directory: /
- Drag-and-drop the project folder into Netlify, or connect a Git repo.

## Screenshots (Filenames)
Place your real screenshots in Results Screenshots/ — the UI references filenames only and loads on demand:
- TombWatcher.png
- TombWatcher Pwned.png
- CIS CAT Success Report.png
- Screenshots with cmds/… (Enumeration/Nmap/Web/LFI/SMB/CIS‑CAT)

## License
This project is open source under the MIT License (see LICENSE). Free to practice and adapt responsibly. Misuse is your responsibility.

---

## 🔖 Suggested GitHub Description
Elite, frontend-only cybersecurity dashboard documenting a self-directed journey across offensive, defensive, and compliance domains — evidence-backed with on-demand screenshots and a searchable tools/commands matrix.

## 🏷️ Suggested Topics
- cybersecurity
- red-team
- blue-team
- penetration-testing
- hackthebox
- kali-linux
- windows-hardening
- compliance
- cis-benchmarks
- lfi
- web-enumeration
- nmap
- gobuster
- security-portfolio
- html
- css
- javascript

## (Optional) Set Topics via GitHub API
Replace `GITHUB_TOKEN` with a Personal Access Token that has `repo` scope.

```bash
curl -L -X PUT \
	-H "Accept: application/vnd.github+json" \
	-H "Authorization: Bearer GITHUB_TOKEN" \
	https://api.github.com/repos/Mandar123454/CyberSecurity-Journey/topics \
	-d '{
		"names": [
			"cybersecurity","red-team","blue-team","penetration-testing","hackthebox",
			"kali-linux","windows-hardening","compliance","cis-benchmarks","lfi",
			"web-enumeration","nmap","gobuster","security-portfolio","html","css","javascript"
		]
	}'
```