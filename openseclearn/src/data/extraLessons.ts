import { Lesson } from './stages';

// Additional lessons for Stage 1 - Fundamentals
export const fundamentalsExtra: Lesson[] = [
  {
    id: 'cryptography-basics',
    title: 'Cryptography Basics',
    description: 'Understand encryption, hashing, digital signatures, and PKI fundamentals.',
    duration: '65 min',
    content: `# Cryptography Basics

## What is Cryptography?
The practice of securing communication and data through mathematical algorithms. It ensures confidentiality, integrity, authentication, and non-repudiation.

## Symmetric Encryption
Same key for encryption and decryption.

- **AES (Advanced Encryption Standard)**: The gold standard, 128/192/256-bit keys
- **DES/3DES**: Legacy algorithms, considered insecure
- **ChaCha20**: Fast stream cipher, used in TLS

### How It Works
\`\`\`
Plaintext + Key → Ciphertext
Ciphertext + Key → Plaintext
\`\`\`

## Asymmetric Encryption
Two keys: public key (encrypt) and private key (decrypt).

- **RSA**: Most widely used, 2048+ bit keys
- **ECC (Elliptic Curve)**: Shorter keys, same security
- **Diffie-Hellman**: Key exchange protocol

### Use Cases
- HTTPS/TLS connections
- Email encryption (PGP/GPG)
- Digital signatures
- SSH key authentication

## Hashing
One-way function that converts data to a fixed-length hash.

- **MD5**: 128-bit, broken — never use for security
- **SHA-1**: 160-bit, deprecated
- **SHA-256/SHA-3**: Current standards
- **bcrypt/argon2**: Password hashing (includes salt)

### Properties
- Deterministic: same input always gives same output
- Avalanche effect: small change in input → completely different hash
- Pre-image resistance: cannot reverse a hash to get the original data

## Digital Signatures
Combines hashing + asymmetric encryption to verify authenticity.

1. Sender hashes the message
2. Sender encrypts hash with private key (signature)
3. Receiver decrypts signature with sender's public key
4. Receiver hashes message and compares

## PKI (Public Key Infrastructure)
System for managing digital certificates and public keys.

- **Certificate Authority (CA)**: Issues and verifies certificates
- **X.509 Certificates**: Standard format for public key certificates
- **Certificate Chain**: Root CA → Intermediate CA → End-entity certificate

## Security Relevance
- TLS/HTTPS protects web traffic
- Password hashing protects stored credentials
- Code signing ensures software integrity`,
    resources: [
      { title: 'Crypto 101', url: 'https://www.crypto101.io/', type: 'documentation' },
      { title: 'Khan Academy Cryptography', url: 'https://www.khanacademy.org/computing/computer-science/cryptography', type: 'video' },
      { title: 'Practical Cryptography', url: 'https://cryptopals.com/', type: 'article' },
    ],
    homeworkIds: ['hw-crypto-1'],
  },
  {
    id: 'risk-management',
    title: 'Risk Management & Frameworks',
    description: 'Learn security risk assessment, governance, and compliance frameworks.',
    duration: '50 min',
    content: `# Risk Management & Frameworks

## What is Risk?
Risk = Threat × Vulnerability × Impact

- **Threat**: A potential cause of an unwanted incident
- **Vulnerability**: A weakness that can be exploited
- **Impact**: The damage caused if the risk materializes

## Risk Assessment Process
1. **Identify Assets**: What needs protection?
2. **Identify Threats**: What could go wrong?
3. **Identify Vulnerabilities**: What weaknesses exist?
4. **Assess Likelihood**: How probable is the event?
5. **Assess Impact**: What is the damage if it occurs?
6. **Calculate Risk**: Prioritize based on score
7. **Select Controls**: Choose mitigation strategies

## Risk Treatment Options
- **Avoid**: Eliminate the activity causing risk
- **Mitigate**: Implement controls to reduce risk
- **Transfer**: Shift risk to third party (insurance)
- **Accept**: Acknowledge and monitor the risk

## Security Frameworks

### NIST Cybersecurity Framework (CSF)
Five core functions:
1. **Identify**: Asset management, risk assessment
2. **Protect**: Access control, training, data security
3. **Detect**: Monitoring, anomaly detection
4. **Respond**: Incident response, communications
5. **Recover**: Recovery planning, improvements

### ISO 27001
International standard for information security management systems (ISMS). Requires:
- Security policy, risk assessment, statement of applicability
- Regular audits and continuous improvement

### CIS Controls
Prioritized set of actions to protect systems:
- 18 security controls organized by implementation group
- Practical, actionable guidance

### SOC 2
Service Organization Control — audit framework for service providers.
- Trust Services Criteria: Security, Availability, Processing Integrity, Confidentiality, Privacy

## Compliance Requirements
- **GDPR**: EU data protection regulation
- **HIPAA**: US healthcare data protection
- **PCI DSS**: Payment card industry standard
- **SOX**: US financial reporting requirements`,
    resources: [
      { title: 'NIST CSF', url: 'https://www.nist.gov/cyberframework', type: 'documentation' },
      { title: 'ISO 27001 Overview', url: 'https://www.iso.org/isoiec-27001-information-security.html', type: 'documentation' },
      { title: 'CIS Controls', url: 'https://www.cisecurity.org/controls', type: 'documentation' },
    ],
    homeworkIds: ['hw-risk-1'],
  },
  {
    id: 'virtualization-lab',
    title: 'Virtualization & Lab Setup',
    description: 'Set up your own cybersecurity lab using VMs and containers.',
    duration: '55 min',
    content: `# Virtualization & Lab Setup

## Why Build a Lab?
A personal lab lets you practice safely without risking real systems. Essential for hands-on cybersecurity learning.

## Hypervisors

### Type 1 (Bare Metal)
Runs directly on hardware: VMware ESXi, Microsoft Hyper-V, Proxmox

### Type 2 (Hosted)
Runs on top of an OS:
- **VirtualBox**: Free, open-source, cross-platform
- **VMware Workstation**: Commercial, feature-rich
- **UTM**: For macOS/Apple Silicon

## Setting Up VirtualBox
\`\`\`bash
# Download from virtualbox.org
# Create a new VM:
# 1. Name: Kali-Lab
# 2. Type: Linux, Version: Debian (64-bit)
# 3. RAM: 4096 MB (minimum 2048)
# 4. Disk: 40 GB dynamically allocated
# 5. Network: NAT or Host-only
\`\`\`

## Essential Lab VMs

### Kali Linux
- Pre-loaded with 600+ security tools
- Download: kali.org/get-kali/

### Metasploitable 2
- Intentionally vulnerable Linux VM
- Perfect for practicing exploitation

### DVWA (Docker)
\`\`\`bash
docker run -d -p 80:80 vulnerables/web-dvwa
\`\`\`

### Windows 10/11 Evaluation
- Free 90-day evaluation from Microsoft
- Practice Windows security and Active Directory

## Docker for Security
\`\`\`bash
# Install Docker
curl -fsSL https://get.docker.com | sh

# Run vulnerable apps
docker run -p 3000:3000 bkimminich/juice-shop
docker run -p 8080:80 webgoat/webgoat

# Run security tools
docker run -it remnux/remnux-distro bash
\`\`\`

## Network Lab Topologies
- **Isolated Network**: VMs talk only to each other
- **NAT Network**: VMs share host internet through NAT
- **Bridged**: VMs appear as separate devices on your network

## Best Practices
- Keep lab isolated from production networks
- Take VM snapshots before testing
- Document everything you do
- Regularly update and patch lab systems`,
    resources: [
      { title: 'VirtualBox Manual', url: 'https://www.virtualbox.org/manual/', type: 'documentation' },
      { title: 'Kali Linux Downloads', url: 'https://www.kali.org/get-kali/', type: 'documentation' },
      { title: 'Docker Security Tools', url: 'https://github.com/carpedm20/awesome-hacking#docker', type: 'github' },
    ],
    homeworkIds: ['hw-lab-1'],
  },
];

// Additional lessons for Stage 2 - Networking & Linux
export const networkingExtra: Lesson[] = [
  {
    id: 'firewalls-ids',
    title: 'Firewalls, IDS & IPS',
    description: 'Learn about network security devices that protect against unauthorized access.',
    duration: '55 min',
    content: `# Firewalls, IDS & IPS

## Firewalls
A network security device that monitors and controls incoming/outgoing traffic based on rules.

### Types
- **Packet Filtering**: Inspects headers (src/dst IP, port, protocol)
- **Stateful Inspection**: Tracks connection state
- **Application Layer (WAF)**: Inspects application-layer data
- **Next-Gen (NGFW)**: Deep packet inspection + threat intelligence

### iptables (Linux Firewall)
\`\`\`bash
# View current rules
iptables -L -n -v

# Block an IP
iptables -A INPUT -s 192.168.1.100 -j DROP

# Allow SSH
iptables -A INPUT -p tcp --dport 22 -j ACCEPT

# Allow established connections
iptables -A INPUT -m state --state ESTABLISHED,RELATED -j ACCEPT

# Default deny
iptables -P INPUT DROP
\`\`\`

### UFW (Uncomplicated Firewall)
\`\`\`bash
ufw enable
ufw allow 22/tcp
ufw allow 80/tcp
ufw deny from 10.0.0.0/8
ufw status verbose
\`\`\`

## IDS (Intrusion Detection System)
Monitors network traffic for suspicious activity and alerts.

### Types
- **Network IDS (NIDS)**: Monitors network traffic — Snort, Suricata
- **Host IDS (HIDS)**: Monitors host activity — OSSEC, Wazuh

### Snort Rule Example
\`\`\`
alert tcp any any -> $HOME_NET 80 (msg:"SQL Injection Attempt"; content:"UNION SELECT"; nocase; sid:1000001;)
\`\`\`

## IPS (Intrusion Prevention System)
Like IDS but actively blocks malicious traffic. Sits inline on the network.

### Detection Methods
- **Signature-based**: Matches known attack patterns
- **Anomaly-based**: Detects deviations from baseline behavior
- **Heuristic-based**: Uses rules and algorithms to identify threats

## Security Zones
- **DMZ**: Demilitarized zone for public-facing servers
- **Internal**: Trusted internal network
- **External**: Untrusted internet
- **Management**: Restricted admin access zone`,
    resources: [
      { title: 'Snort Documentation', url: 'https://www.snort.org/documents', type: 'documentation' },
      { title: 'UFW Guide', url: 'https://help.ubuntu.com/community/UFW', type: 'documentation' },
      { title: 'Suricata', url: 'https://suricata.io/documentation/', type: 'documentation' },
    ],
    homeworkIds: ['hw-firewall-1'],
  },
  {
    id: 'wireless-security',
    title: 'Wireless Network Security',
    description: 'Understand Wi-Fi security protocols, vulnerabilities, and attacks.',
    duration: '50 min',
    content: `# Wireless Network Security

## Wi-Fi Security Protocols

### WEP (Wired Equivalent Privacy)
- **Status**: Completely broken — never use
- Uses RC4 cipher with short IVs
- Can be cracked in minutes

### WPA (Wi-Fi Protected Access)
- Replaced WEP, uses TKIP
- **Status**: Deprecated, vulnerable to KRACK

### WPA2
- Uses AES-CCMP encryption
- **Status**: Current standard, but vulnerable to KRACK and PMKID attacks
- Modes: Personal (PSK) and Enterprise (802.1X/RADIUS)

### WPA3
- **Status**: Latest standard
- SAE (Simultaneous Authentication of Equals) replaces PSK
- Forward secrecy, protection against offline dictionary attacks
- 192-bit security mode for enterprise

## Common Wireless Attacks

### Evil Twin
Create a rogue access point mimicking a legitimate one to capture credentials.

### Deauthentication Attack
\`\`\`bash
# Using aireplay-ng to deauth clients
aireplay-ng --deauth 10 -a [AP_BSSID] -c [CLIENT_MAC] wlan0mon
\`\`\`

### WPA2 Handshake Capture
\`\`\`bash
# Put card in monitor mode
airmon-ng start wlan0

# Capture handshake
airodump-ng -c [channel] --bssid [AP_MAC] -w capture wlan0mon

# Crack with wordlist
aircrack-ng -w rockyou.txt capture-01.cap
\`\`\`

### PMKID Attack
Captures PMKID from AP without needing a client handshake.

## Wireless Security Best Practices
- Use WPA3 or WPA2 with strong passwords (20+ chars)
- Disable WPS (Wi-Fi Protected Setup)
- Use 802.1X with RADIUS for enterprise
- Enable MAC filtering as additional layer
- Regularly audit wireless networks
- Use VPN on public Wi-Fi`,
    resources: [
      { title: 'Aircrack-ng Documentation', url: 'https://www.aircrack-ng.org/documentation.html', type: 'documentation' },
      { title: 'Wi-Fi Alliance WPA3', url: 'https://www.wi-fi.org/discover-wi-fi/security', type: 'documentation' },
    ],
    homeworkIds: ['hw-wireless-1'],
  },
  {
    id: 'linux-admin-security',
    title: 'Linux System Administration & Hardening',
    description: 'Learn to administer and harden Linux systems for security.',
    duration: '70 min',
    content: `# Linux System Administration & Hardening

## System Administration Essentials

### Package Management
\`\`\`bash
# Debian/Ubuntu
apt update && apt upgrade -y
apt install package-name
apt remove package-name
dpkg -l  # List installed packages

# RHEL/CentOS
yum update / dnf upgrade
yum install package-name
rpm -qa  # List installed packages
\`\`\`

### Service Management (systemd)
\`\`\`bash
systemctl start service
systemctl stop service
systemctl enable service    # Auto-start on boot
systemctl disable service
systemctl status service
journalctl -u service       # View service logs
\`\`\`

### Cron Jobs (Scheduled Tasks)
\`\`\`bash
crontab -e  # Edit user crontab
crontab -l  # List scheduled jobs

# Format: minute hour day month weekday command
0 2 * * * /backup/script.sh    # Daily at 2AM
*/5 * * * * /check/health.sh   # Every 5 minutes
\`\`\`

### Log Management
\`\`\`bash
# Key log files
/var/log/syslog        # General system logs
/var/log/auth.log      # Authentication logs
/var/log/kern.log      # Kernel messages
/var/log/apache2/      # Web server logs
\`\`\`

## Linux Hardening Checklist

### User Security
- Disable root SSH login: \`PermitRootLogin no\`
- Use SSH key-based authentication
- Set password policies: minimum length, complexity, expiry
- Remove unnecessary user accounts
- Use sudo instead of root

### Network Hardening
- Configure firewall (iptables/ufw)
- Disable unused services and ports
- Enable TCP wrappers (/etc/hosts.allow, /etc/hosts.deny)
- Implement fail2ban for brute force protection

### File System Security
- Set proper file permissions (principle of least privilege)
- Use LUKS for disk encryption
- Mount /tmp with noexec,nosuid
- Enable file integrity monitoring (AIDE/Tripwire)

### SSH Hardening
\`\`\`bash
# /etc/ssh/sshd_config
Port 2222                    # Change default port
PermitRootLogin no
PasswordAuthentication no    # Key-only
MaxAuthTries 3
AllowUsers admin secops
Protocol 2
\`\`\`

### Kernel Hardening (sysctl)
\`\`\`bash
# /etc/sysctl.conf
net.ipv4.ip_forward = 0
net.ipv4.conf.all.accept_redirects = 0
net.ipv4.conf.all.send_redirects = 0
kernel.randomize_va_space = 2  # ASLR
\`\`\`

### Security Auditing
\`\`\`bash
# Lynis - security auditing tool
lynis audit system
# CIS-CAT - CIS benchmark scanner
\`\`\``,
    resources: [
      { title: 'CIS Ubuntu Benchmark', url: 'https://www.cisecurity.org/benchmark/ubuntu_linux', type: 'documentation' },
      { title: 'Linux Hardening Guide', url: 'https://github.com/trimstray/the-practical-linux-hardening-guide', type: 'github' },
      { title: 'Fail2ban Documentation', url: 'https://www.fail2ban.org/', type: 'documentation' },
    ],
    homeworkIds: ['hw-hardening-1'],
  },
];

// Additional lessons for Stage 3 - Programming
export const programmingExtra: Lesson[] = [
  {
    id: 'javascript-security',
    title: 'JavaScript for Security',
    description: 'Learn JavaScript fundamentals with a security focus — DOM manipulation, web APIs, and common vulnerabilities.',
    duration: '70 min',
    content: `# JavaScript for Security

## Why JavaScript for Security?
- Runs in every web browser — the primary attack surface
- Understanding JS is essential for web app security testing
- Server-side Node.js is used in many modern applications

## DOM Manipulation
\`\`\`javascript
// Accessing elements
document.getElementById('target');
document.querySelector('.class-name');
document.querySelectorAll('input[type="password"]');

// Modifying content
element.innerHTML = 'New content';  // DANGEROUS - XSS risk
element.textContent = 'Safe content';  // Safe alternative

// Creating elements
const div = document.createElement('div');
div.textContent = 'Hello';
document.body.appendChild(div);
\`\`\`

## Common JS Vulnerabilities

### Prototype Pollution
\`\`\`javascript
// Vulnerable merge function
function merge(target, source) {
  for (let key in source) {
    target[key] = source[key];
  }
}
// Attack: source = {"__proto__": {"admin": true}}
\`\`\`

### Insecure eval()
\`\`\`javascript
// NEVER DO THIS
eval(userInput);  // Remote Code Execution!

// Also dangerous:
new Function(userInput)();
setTimeout(userInput, 0);
\`\`\`

### Insecure postMessage
\`\`\`javascript
// Vulnerable - no origin check
window.addEventListener('message', (e) => {
  document.innerHTML = e.data;
});

// Safe - verify origin
window.addEventListener('message', (e) => {
  if (e.origin !== 'https://trusted-site.com') return;
  element.textContent = e.data;
});
\`\`\`

## Web Storage Security
\`\`\`javascript
// localStorage is accessible to any script on the domain
localStorage.setItem('token', 'secret');  // XSS can steal this!

// NEVER store sensitive data in localStorage
// Use httpOnly cookies for session tokens
\`\`\`

## Fetch API for Security Testing
\`\`\`javascript
// Making requests
const response = await fetch('https://api.example.com/data', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ username: 'test' }),
  credentials: 'include'
});
const data = await response.json();
\`\`\`

## Browser DevTools for Security
- **Console**: Execute JS, test payloads
- **Network**: Inspect requests, cookies, headers
- **Application**: View storage, cookies, service workers
- **Elements**: Inspect/modify DOM
- **Sources**: Debug JS, set breakpoints`,
    resources: [
      { title: 'MDN JavaScript Guide', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide', type: 'documentation' },
      { title: 'OWASP DOM-based XSS Prevention', url: 'https://cheatsheetseries.owasp.org/cheatsheets/DOM_based_XSS_Prevention_Cheat_Sheet.html', type: 'documentation' },
    ],
    homeworkIds: ['hw-js-1'],
  },
  {
    id: 'apis-web-services',
    title: 'APIs & Web Services Security',
    description: 'Understand REST APIs, authentication mechanisms, and API security testing.',
    duration: '60 min',
    content: `# APIs & Web Services Security

## REST API Basics
APIs follow the REST (Representational State Transfer) architectural style.

### HTTP Methods
- **GET** /api/users — List users
- **POST** /api/users — Create user
- **GET** /api/users/1 — Get user by ID
- **PUT** /api/users/1 — Update user
- **DELETE** /api/users/1 — Delete user

### Response Codes
- 200 OK, 201 Created, 204 No Content
- 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found
- 500 Internal Server Error

## API Authentication

### API Keys
- Simple token in header or query parameter
- Easy to implement but easy to leak

### JWT (JSON Web Tokens)
\`\`\`
Header.Payload.Signature

Header: {"alg": "HS256", "typ": "JWT"}
Payload: {"sub": "user123", "role": "admin", "exp": 1234567890}
Signature: HMACSHA256(base64(header) + "." + base64(payload), secret)
\`\`\`

### OAuth 2.0
Authorization framework for third-party access:
- Authorization Code flow (most secure)
- Client Credentials flow (server-to-server)
- NEVER use Implicit flow (deprecated)

## Common API Vulnerabilities

### BOLA (Broken Object Level Authorization)
\`\`\`
GET /api/users/123/orders  → Your orders
GET /api/users/456/orders  → Someone else's orders (if no authz check!)
\`\`\`

### Mass Assignment
\`\`\`json
POST /api/users
{"name": "John", "role": "admin"}  // If server accepts 'role' field
\`\`\`

### Rate Limiting Bypass
- Missing rate limits enable brute force
- Rotate headers, IPs, or parameters to bypass

### Information Exposure
- Verbose error messages reveal stack traces
- API documentation exposed publicly
- Debug endpoints left in production

## API Security Testing with curl
\`\`\`bash
# GET request with auth
curl -H "Authorization: Bearer TOKEN" https://api.example.com/users

# POST with JSON body
curl -X POST -H "Content-Type: application/json" -d '{"name":"test"}' https://api.example.com/users

# Test IDOR
curl https://api.example.com/users/1/data
curl https://api.example.com/users/2/data

# Check headers
curl -v https://api.example.com/health
\`\`\``,
    resources: [
      { title: 'OWASP API Security Top 10', url: 'https://owasp.org/API-Security/', type: 'documentation' },
      { title: 'JWT.io Debugger', url: 'https://jwt.io/', type: 'article' },
      { title: 'Postman Learning Center', url: 'https://learning.postman.com/', type: 'documentation' },
    ],
    homeworkIds: ['hw-api-1'],
  },
  {
    id: 'git-version-control',
    title: 'Git & Version Control Security',
    description: 'Learn Git for collaboration and discover security risks in version control systems.',
    duration: '45 min',
    content: `# Git & Version Control Security

## Git Essentials
\`\`\`bash
git init                    # Initialize repository
git clone url               # Clone remote repo
git add .                   # Stage changes
git commit -m "message"     # Commit changes
git push origin main        # Push to remote
git pull                    # Pull latest changes
git branch feature-name     # Create branch
git checkout branch-name    # Switch branch
git merge branch-name       # Merge branch
git log --oneline -10       # View recent commits
\`\`\`

## Security Risks in Git

### Exposed Secrets
Accidentally committed credentials, API keys, private keys:
\`\`\`bash
# Common mistakes
git add .env                 # Contains API keys
git add config/database.yml  # Contains DB passwords
git add id_rsa               # Private SSH key
\`\`\`

### .gitignore Best Practices
\`\`\`
# Always ignore
.env
*.pem
*.key
config/secrets.yml
node_modules/
\`\`\`

### Secret Scanning Tools
\`\`\`bash
# TruffleHog - searches git history for secrets
trufflehog git https://github.com/target/repo

# GitLeaks - detects hardcoded secrets
gitleaks detect --source .

# git-secrets - prevents committing secrets
git secrets --install
git secrets --register-aws
\`\`\`

## Git History Forensics
\`\`\`bash
# Search git history for sensitive data
git log --all --full-history -- "*.env"
git log -p --all -S "password"
git log -p --all -S "api_key"

# View deleted files
git log --diff-filter=D --summary

# Show file at specific commit
git show commit_hash:path/to/file
\`\`\`

## GitHub Security Features
- **Dependabot**: Automated dependency updates
- **Secret Scanning**: Detects committed secrets
- **Code Scanning**: CodeQL static analysis
- **Branch Protection**: Require reviews, status checks

## For Bug Bounty Hunters
- Check exposed .git directories: /.git/config
- Use GitTools to dump exposed repos
- Search GitHub for leaked credentials from target`,
    resources: [
      { title: 'Git Documentation', url: 'https://git-scm.com/doc', type: 'documentation' },
      { title: 'GitLeaks', url: 'https://github.com/gitleaks/gitleaks', type: 'github' },
      { title: 'TruffleHog', url: 'https://github.com/trufflesecurity/trufflehog', type: 'github' },
    ],
    homeworkIds: ['hw-git-1'],
  },
];

// Additional lessons for Stage 4 - Web Security
export const webSecurityExtra: Lesson[] = [
  {
    id: 'auth-sessions',
    title: 'Authentication & Session Management',
    description: 'Deep dive into authentication mechanisms, sessions, cookies, and token-based auth.',
    duration: '70 min',
    content: `# Authentication & Session Management

## Authentication Methods

### Password-Based
- Most common, most attacked
- Vulnerabilities: brute force, credential stuffing, phishing
- Countermeasures: MFA, rate limiting, account lockout

### Multi-Factor Authentication (MFA)
Something you know + something you have + something you are:
- **TOTP**: Time-based one-time password (Google Authenticator, Authy)
- **SMS**: Less secure due to SIM swapping
- **Hardware Keys**: FIDO2/WebAuthn (YubiKey)
- **Biometrics**: Fingerprint, face recognition

### Single Sign-On (SSO)
One login for multiple services:
- **SAML**: XML-based, enterprise standard
- **OAuth 2.0 + OIDC**: Modern web/mobile standard
- **Kerberos**: Active Directory environments

## Session Management

### Cookie-Based Sessions
\`\`\`
Set-Cookie: session_id=abc123; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=3600
\`\`\`

### Cookie Security Flags
- **HttpOnly**: Prevents JavaScript access (mitigates XSS theft)
- **Secure**: Only sent over HTTPS
- **SameSite**: Controls cross-site request behavior (Strict/Lax/None)
- **Path**: Limits cookie scope
- **Domain**: Controls which domains receive the cookie

### Token-Based Authentication (JWT)
- Stateless — no server-side session storage
- Self-contained — carries user info and permissions
- Risks: token theft, algorithm confusion, no revocation

## Common Authentication Attacks

### Brute Force
Systematically trying all possible passwords.
\`\`\`bash
# Using hydra
hydra -l admin -P wordlist.txt target http-post-form "/login:user=^USER^&pass=^PASS^:Invalid"
\`\`\`

### Credential Stuffing
Using leaked username/password combos from data breaches.

### Session Fixation
Attacker sets a known session ID before victim authenticates.

### Session Hijacking
Stealing active session tokens via XSS, network sniffing, or malware.

## Best Practices
- Enforce strong password policies
- Implement MFA on all accounts
- Use bcrypt/argon2 for password hashing
- Rotate session tokens after login
- Set appropriate cookie flags
- Implement account lockout with exponential backoff`,
    resources: [
      { title: 'OWASP Authentication Cheat Sheet', url: 'https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html', type: 'documentation' },
      { title: 'OWASP Session Management', url: 'https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html', type: 'documentation' },
    ],
    homeworkIds: ['hw-auth-1'],
  },
  {
    id: 'csrf-ssrf',
    title: 'CSRF & SSRF Attacks',
    description: 'Learn about Cross-Site Request Forgery and Server-Side Request Forgery attacks.',
    duration: '55 min',
    content: `# CSRF & SSRF Attacks

## CSRF (Cross-Site Request Forgery)

### How It Works
Tricks an authenticated user's browser into making unintended requests.

1. Victim is logged into bank.com
2. Victim visits attacker's page
3. Attacker's page submits hidden form to bank.com
4. Browser automatically includes session cookie
5. Bank processes unauthorized transfer

### Example Attack
\`\`\`html
<!-- Attacker's page -->
<form action="https://bank.com/transfer" method="POST" id="f">
  <input type="hidden" name="to" value="attacker">
  <input type="hidden" name="amount" value="10000">
</form>
<script>document.getElementById('f').submit();</script>
\`\`\`

### Prevention
- **CSRF Tokens**: Unique, unpredictable token per session/request
- **SameSite Cookies**: Strict or Lax prevents cross-origin cookie sending
- **Origin/Referer Header Check**: Verify request origin
- **Custom Headers**: AJAX requests with custom headers can't be forged via forms

## SSRF (Server-Side Request Forgery)

### How It Works
Tricks the server into making requests to unintended locations.

### Common Targets
- Internal services (localhost, 127.0.0.1)
- Cloud metadata: \`http://169.254.169.254/latest/meta-data/\`
- Internal APIs not exposed to internet
- Other services on the internal network

### Attack Examples
\`\`\`
# Fetch internal service
GET /fetch?url=http://localhost:8080/admin

# AWS metadata (credential theft)
GET /fetch?url=http://169.254.169.254/latest/meta-data/iam/security-credentials/

# Port scanning internal network
GET /fetch?url=http://192.168.1.1:22
\`\`\`

### Real-World Impact: Capital One (2019)
SSRF exploited to access AWS metadata endpoint, stealing credentials that accessed S3 buckets with 100M+ customer records.

### Prevention
- Allowlist of permitted URLs/domains
- Block requests to internal/private IPs
- Block cloud metadata endpoints
- Use network-level restrictions
- Don't pass raw URLs from user input to server requests`,
    resources: [
      { title: 'OWASP CSRF Prevention', url: 'https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html', type: 'documentation' },
      { title: 'PortSwigger SSRF', url: 'https://portswigger.net/web-security/ssrf', type: 'article' },
    ],
    homeworkIds: ['hw-csrf-1'],
  },
  {
    id: 'web-app-hardening',
    title: 'Web Application Hardening',
    description: 'Learn security headers, CSP, CORS, and best practices for securing web applications.',
    duration: '55 min',
    content: `# Web Application Hardening

## Security Headers

### Content-Security-Policy (CSP)
Controls which resources the browser can load.
\`\`\`
Content-Security-Policy: default-src 'self'; script-src 'self' https://cdn.trusted.com; style-src 'self' 'unsafe-inline'; img-src *; connect-src 'self' https://api.example.com
\`\`\`

### Other Essential Headers
\`\`\`
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
X-XSS-Protection: 0  (deprecated, rely on CSP instead)
\`\`\`

## CORS (Cross-Origin Resource Sharing)
Controls which origins can access your API.

### Secure Configuration
\`\`\`
Access-Control-Allow-Origin: https://trusted-app.com
Access-Control-Allow-Methods: GET, POST
Access-Control-Allow-Headers: Content-Type, Authorization
Access-Control-Allow-Credentials: true
\`\`\`

### Insecure Configurations (Avoid!)
\`\`\`
Access-Control-Allow-Origin: *                    # Too permissive
Access-Control-Allow-Origin: [reflected origin]    # Origin reflection is dangerous with credentials
\`\`\`

## Input Validation & Output Encoding

### Server-Side Validation
- Validate type, length, format, and range
- Use allowlists over denylists
- Validate on the server, never trust client-side only

### Output Encoding
- HTML context: encode < > & " '
- JavaScript context: Unicode escape
- URL context: percent-encode
- CSS context: CSS escape

## Dependency Security
\`\`\`bash
# Check for vulnerable npm packages
npm audit
npm audit fix

# Python
pip-audit
safety check

# Snyk (multi-language)
snyk test
\`\`\`

## Secure Development Practices
- Use parameterized queries for all database operations
- Implement proper error handling (don't expose stack traces)
- Use security linters (ESLint security plugin, Bandit for Python)
- Keep dependencies updated
- Implement rate limiting
- Use HTTPS everywhere
- Log security events`,
    resources: [
      { title: 'OWASP Secure Coding Practices', url: 'https://owasp.org/www-project-secure-coding-practices-quick-reference-guide/', type: 'documentation' },
      { title: 'Security Headers Scanner', url: 'https://securityheaders.com/', type: 'article' },
      { title: 'MDN CORS Guide', url: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS', type: 'documentation' },
    ],
    homeworkIds: ['hw-hardening-web-1'],
  },
];

// Additional lessons for Stage 5 - Ethical Hacking
export const ethicalHackingExtra: Lesson[] = [
  {
    id: 'privilege-escalation',
    title: 'Privilege Escalation',
    description: 'Learn Linux and Windows privilege escalation techniques used in penetration testing.',
    duration: '75 min',
    content: `# Privilege Escalation

## Linux Privilege Escalation

### Enumeration
\`\`\`bash
# System info
uname -a
cat /etc/os-release
id
whoami

# SUID binaries
find / -perm -u=s -type f 2>/dev/null

# World-writable files
find / -writable -type f 2>/dev/null

# Cron jobs
cat /etc/crontab
ls -la /etc/cron.*

# Running processes
ps aux | grep root

# Kernel version (for kernel exploits)
uname -r

# Capabilities
getcap -r / 2>/dev/null
\`\`\`

### Common Techniques
1. **SUID Exploitation**: Binaries running as root
   \`\`\`bash
   # If python has SUID
   python -c 'import os; os.setuid(0); os.system("/bin/bash")'
   \`\`\`

2. **Sudo Misconfiguration**
   \`\`\`bash
   sudo -l  # List sudo permissions
   # If sudo vim is allowed:
   sudo vim -c '!bash'
   \`\`\`

3. **Cron Job Exploitation**: Writable scripts run by root
4. **Kernel Exploits**: DirtyCow, DirtyPipe
5. **PATH Hijacking**: Inject malicious binary in PATH

### Automated Tools
- **LinPEAS**: linpeas.sh — comprehensive Linux enumeration
- **LinEnum**: Automated privilege escalation checks

## Windows Privilege Escalation

### Enumeration
\`\`\`powershell
# System info
systeminfo
whoami /priv
whoami /groups
net users
net localgroup administrators

# Unquoted service paths
wmic service get name,pathname,startmode | findstr /i "auto" | findstr /i /v "C:\\Windows"

# Scheduled tasks
schtasks /query /fo LIST /v
\`\`\`

### Common Techniques
1. **Unquoted Service Paths**: Place malicious exe in path gap
2. **Weak Service Permissions**: Modify service binary path
3. **AlwaysInstallElevated**: Install MSI as SYSTEM
4. **Token Impersonation**: SeImpersonatePrivilege (Potato attacks)
5. **DLL Hijacking**: Missing DLLs loaded from writable locations

### Automated Tools
- **WinPEAS**: Windows privilege escalation helper
- **PowerUp**: PowerShell privilege escalation checks`,
    resources: [
      { title: 'GTFOBins', url: 'https://gtfobins.github.io/', type: 'documentation' },
      { title: 'LOLBAS', url: 'https://lolbas-project.github.io/', type: 'documentation' },
      { title: 'LinPEAS', url: 'https://github.com/carlospolop/PEASS-ng', type: 'github' },
    ],
    homeworkIds: ['hw-privesc-1'],
  },
  {
    id: 'social-engineering',
    title: 'Social Engineering & Phishing',
    description: 'Understand social engineering tactics, phishing campaigns, and human-layer security.',
    duration: '55 min',
    content: `# Social Engineering & Phishing

## What is Social Engineering?
Manipulating people into divulging information or performing actions that compromise security. The human element is often the weakest link.

## Social Engineering Techniques

### Phishing
Fraudulent communications designed to trick recipients.
- **Email Phishing**: Mass emails mimicking legitimate sources
- **Spear Phishing**: Targeted at specific individuals
- **Whaling**: Targeting high-level executives
- **Vishing**: Voice phishing via phone calls
- **Smishing**: SMS-based phishing

### Pretexting
Creating a fabricated scenario to gain trust.
- Impersonating IT support, delivery person, auditor
- Building a believable backstory

### Baiting
Offering something enticing (infected USB drives, free downloads).

### Tailgating/Piggybacking
Following authorized personnel through secure doors.

### Quid Pro Quo
Offering a service in exchange for information (fake helpdesk).

## Anatomy of a Phishing Email
\`\`\`
From: security@bankofamerica.com.evil.com  ← Spoofed/lookalike
Subject: URGENT: Your account has been compromised

Dear Customer,
We detected suspicious activity on your account.
Click here to verify: https://bank0famerica.evil.com/login

[Sense of urgency, fear, authority]
\`\`\`

### Red Flags
- Urgency or threats
- Generic greetings ("Dear Customer")
- Mismatched URLs (hover to check)
- Spelling/grammar errors
- Unusual sender address
- Unexpected attachments

## Email Security Mechanisms
- **SPF**: Specifies authorized mail servers
- **DKIM**: Digital signature on emails
- **DMARC**: Policy for handling failed SPF/DKIM
- **Email Gateway Filtering**: Spam/phishing detection

## Security Awareness Training
- Regular phishing simulations
- Security awareness programs
- Incident reporting procedures
- Clear policies for handling suspicious communications

## For Penetration Testers
- Always get explicit scope approval for SE testing
- Use frameworks like GoPhish for campaigns
- Document everything for the report
- Focus on improving defenses, not embarrassing users`,
    resources: [
      { title: 'SANS Social Engineering Resources', url: 'https://www.sans.org/security-awareness-training/resources', type: 'documentation' },
      { title: 'GoPhish', url: 'https://github.com/gophish/gophish', type: 'github' },
      { title: 'Phishing Awareness', url: 'https://www.phishing.org/', type: 'article' },
    ],
    homeworkIds: ['hw-social-1'],
  },
  {
    id: 'web-app-pentest',
    title: 'Web Application Penetration Testing',
    description: 'A structured methodology for testing web application security end-to-end.',
    duration: '80 min',
    content: `# Web Application Penetration Testing

## Methodology (OWASP Testing Guide)

### 1. Information Gathering
\`\`\`bash
# Technology fingerprinting
whatweb https://target.com
wappalyzer (browser extension)

# Directory enumeration
gobuster dir -u https://target.com -w /usr/share/wordlists/dirb/common.txt

# Subdomain enumeration
subfinder -d target.com
amass enum -d target.com

# Check robots.txt, sitemap.xml
curl https://target.com/robots.txt
curl https://target.com/sitemap.xml

# JavaScript file analysis
# Look for API endpoints, secrets, hardcoded credentials
\`\`\`

### 2. Authentication Testing
- Default credentials
- Username enumeration (different error messages)
- Password policy enforcement
- Account lockout mechanisms
- Password reset flow vulnerabilities
- MFA bypass techniques

### 3. Authorization Testing
- IDOR (changing IDs in URLs/requests)
- Horizontal privilege escalation (user A → user B)
- Vertical privilege escalation (user → admin)
- Missing function-level access control

### 4. Input Validation Testing
\`\`\`
# XSS payloads
<script>alert(1)</script>
"><img src=x onerror=alert(1)>
javascript:alert(1)

# SQL injection
' OR 1=1--
' UNION SELECT NULL,NULL--
' AND SLEEP(5)--

# Command injection
; ls -la
| cat /etc/passwd
\`\`\`

### 5. Session Management Testing
- Session token randomness (Burp Sequencer)
- Session fixation
- Session timeout
- Cookie security flags

### 6. Business Logic Testing
- Price manipulation
- Quantity manipulation
- Coupon/discount abuse
- Race conditions
- Workflow bypass

### 7. File Upload Testing
- Bypass extension filters (.php → .pHp, .php5, .phtml)
- MIME type manipulation
- Double extensions (file.php.jpg)
- Null byte injection (file.php%00.jpg)

## Reporting
Create professional reports with:
- Executive summary
- Technical findings with CVSS scores
- Step-by-step proof of concepts
- Remediation recommendations
- Risk prioritization matrix`,
    resources: [
      { title: 'OWASP Web Testing Guide', url: 'https://owasp.org/www-project-web-security-testing-guide/', type: 'documentation' },
      { title: 'HackTricks', url: 'https://book.hacktricks.xyz/', type: 'article' },
      { title: 'Web Pentesting Checklist', url: 'https://github.com/harshinsecurity/web-pentesting-checklist', type: 'github' },
    ],
    homeworkIds: ['hw-webpentest-1'],
  },
];

// Additional lessons for Stage 6 - Advanced
export const advancedExtra: Lesson[] = [
  {
    id: 'malware-analysis',
    title: 'Malware Analysis Fundamentals',
    description: 'Learn static and dynamic malware analysis techniques.',
    duration: '75 min',
    content: `# Malware Analysis Fundamentals

## Types of Malware
- **Virus**: Self-replicating, attaches to host files
- **Worm**: Self-replicating, spreads independently
- **Trojan**: Disguised as legitimate software
- **Ransomware**: Encrypts files, demands payment
- **Spyware**: Secretly monitors activity
- **Rootkit**: Hides presence from OS
- **RAT**: Remote Access Trojan — persistent backdoor
- **Cryptominer**: Uses victim's resources to mine cryptocurrency

## Analysis Types

### Static Analysis
Examining malware without executing it.
\`\`\`bash
# File identification
file suspicious.exe
exiftool suspicious.exe

# String extraction
strings suspicious.exe | grep -i "http"
strings suspicious.exe | grep -i "password"

# Hash calculation
md5sum suspicious.exe
sha256sum suspicious.exe

# Check hash on VirusTotal
# https://www.virustotal.com

# PE file analysis (Windows executables)
pefile, PE-bear, PEiD
# Check imports, exports, sections, packing
\`\`\`

### Dynamic Analysis
Running malware in a controlled sandbox environment.
\`\`\`bash
# Set up isolated analysis VM
# Use snapshots for easy recovery

# Network monitoring
tcpdump -i eth0 -w malware_traffic.pcap
# Watch for C2 connections, DNS queries, downloads

# Process monitoring
procmon (Windows)
strace / ltrace (Linux)

# File system monitoring
# Check for created/modified/deleted files

# Registry monitoring (Windows)
# Check for persistence mechanisms
\`\`\`

### Online Sandboxes
- **Any.Run**: Interactive online sandbox
- **Hybrid Analysis**: Free malware analysis
- **Joe Sandbox**: Automated analysis
- **VirusTotal**: Multi-engine scanning

## Common Malware Behaviors
- Establishing persistence (registry, scheduled tasks, services)
- C2 communication (HTTP beacons, DNS tunneling)
- Anti-analysis (VM detection, debugger detection, sleep timers)
- Lateral movement (credential theft, network scanning)
- Data exfiltration (encrypted channels, DNS, steganography)

## YARA Rules
Pattern matching for malware identification.
\`\`\`
rule detect_suspicious_strings {
    meta:
        description = "Detects potential malware strings"
    strings:
        $s1 = "cmd.exe" nocase
        $s2 = "powershell" nocase
        $s3 = "WScript.Shell"
    condition:
        2 of them
}
\`\`\``,
    resources: [
      { title: 'Malware Traffic Analysis', url: 'https://www.malware-traffic-analysis.net/', type: 'article' },
      { title: 'REMnux Distribution', url: 'https://remnux.org/', type: 'documentation' },
      { title: 'YARA Documentation', url: 'https://virustotal.github.io/yara/', type: 'documentation' },
    ],
    homeworkIds: ['hw-malware-1'],
  },
  {
    id: 'incident-response',
    title: 'Incident Response & Digital Forensics',
    description: 'Learn the incident response lifecycle and basic digital forensics techniques.',
    duration: '70 min',
    content: `# Incident Response & Digital Forensics

## Incident Response Lifecycle (NIST SP 800-61)

### 1. Preparation
- Incident response plan documented
- IR team identified and trained
- Tools and playbooks ready
- Communication channels established
- Legal and compliance contacts identified

### 2. Detection & Analysis
- Monitor SIEM alerts
- Analyze indicators of compromise (IOCs)
- Determine scope and severity
- Classify incident type

### Severity Levels
| Level | Description | Example |
|-------|-------------|---------|
| P1 Critical | Business-threatening | Ransomware, data breach |
| P2 High | Significant impact | Compromised server |
| P3 Medium | Limited impact | Phishing success |
| P4 Low | Minimal impact | Policy violation |

### 3. Containment
- **Short-term**: Isolate affected systems, block IPs
- **Long-term**: Apply patches, change credentials, harden systems
- Preserve evidence before containment actions

### 4. Eradication
- Remove malware, backdoors, persistence mechanisms
- Patch vulnerabilities that were exploited
- Reset compromised credentials

### 5. Recovery
- Restore systems from clean backups
- Verify systems are clean before reconnecting
- Monitor closely for signs of re-infection

### 6. Post-Incident Activity
- Write incident report (timeline, actions, lessons)
- Conduct lessons-learned review
- Update IR plan, playbooks, and detections
- Share IOCs with community (if appropriate)

## Digital Forensics Basics

### Evidence Collection
- Follow chain of custody procedures
- Create forensic images (bit-for-bit copies)
- Hash original and copy to verify integrity
- Document everything

### Forensic Tools
\`\`\`bash
# Create forensic disk image
dd if=/dev/sda of=image.dd bs=4096 conv=noerror,sync
sha256sum /dev/sda > original_hash.txt
sha256sum image.dd > image_hash.txt

# Autopsy - open-source forensic tool
# Volatility - memory forensics
volatility -f memory.dump imageinfo
volatility -f memory.dump --profile=Win10 pslist
volatility -f memory.dump --profile=Win10 netscan
\`\`\`

### Key Evidence Sources
- **Disk**: Files, deleted files, file system timestamps, slack space
- **Memory**: Running processes, network connections, encryption keys
- **Logs**: System, application, security, and network logs
- **Network**: Packet captures, flow data, DNS logs

## Chain of Custody
Document who handled evidence, when, where, and what actions were taken. Essential for legal proceedings.`,
    resources: [
      { title: 'NIST SP 800-61', url: 'https://csrc.nist.gov/publications/detail/sp/800-61/rev-2/final', type: 'documentation' },
      { title: 'Autopsy Forensic Tool', url: 'https://www.autopsy.com/', type: 'documentation' },
      { title: 'Volatility Framework', url: 'https://github.com/volatilityfoundation/volatility3', type: 'github' },
    ],
    homeworkIds: ['hw-ir-1'],
  },
  {
    id: 'siem-log-analysis',
    title: 'SIEM & Log Analysis',
    description: 'Master security event monitoring with SIEM platforms and log analysis techniques.',
    duration: '65 min',
    content: `# SIEM & Log Analysis

## What is a SIEM?
Security Information and Event Management — centralizes log collection, correlation, alerting, and analysis.

## Popular SIEM Platforms
- **Splunk**: Industry leader, powerful SPL query language
- **Elastic SIEM (ELK)**: Open-source, Elasticsearch + Kibana
- **Microsoft Sentinel**: Cloud-native, Azure integration
- **IBM QRadar**: Enterprise-grade, strong correlation
- **Wazuh**: Open-source, host-based detection + SIEM

## Log Sources

### System Logs
- Windows Event Logs (Security, System, Application)
- Linux syslog, auth.log, kern.log
- macOS unified logging

### Network Logs
- Firewall logs, IDS/IPS alerts
- DNS query logs
- Proxy logs, VPN logs
- NetFlow/sFlow data

### Application Logs
- Web server access/error logs
- Database audit logs
- Email gateway logs
- Cloud service logs (CloudTrail, Azure Activity)

## Splunk SPL Basics
\`\`\`
# Search for failed logins
index=windows EventCode=4625
| stats count by Account_Name, Source_Network_Address
| sort - count

# Detect brute force
index=windows EventCode=4625
| stats count by Account_Name
| where count > 10

# Track process creation
index=windows EventCode=4688
| table _time, Account_Name, New_Process_Name, Process_Command_Line

# Network anomalies
index=firewall action=blocked
| stats count by src_ip
| sort - count | head 20
\`\`\`

## Windows Event IDs
| Event ID | Description |
|----------|-------------|
| 4624 | Successful logon |
| 4625 | Failed logon |
| 4648 | Logon with explicit credentials |
| 4672 | Special privileges assigned |
| 4688 | New process created |
| 4720 | User account created |
| 4732 | Member added to security group |
| 1102 | Audit log cleared |

## Detection Engineering
Creating rules to detect threats:
\`\`\`yaml
# Sigma rule format (vendor-agnostic)
title: Multiple Failed Logins
status: stable
logsource:
    product: windows
    service: security
detection:
    selection:
        EventID: 4625
    condition: selection | count() by TargetUserName > 10
level: medium
\`\`\`

## Key Detection Use Cases
- Brute force attacks (high failed login rate)
- Privilege escalation (unusual admin actions)
- Lateral movement (RDP to multiple hosts)
- Data exfiltration (large outbound transfers)
- Persistence (new scheduled tasks, services)
- Log tampering (event log clearing)`,
    resources: [
      { title: 'Splunk Free Training', url: 'https://www.splunk.com/en_us/training/free-courses.html', type: 'article' },
      { title: 'Sigma Rules', url: 'https://github.com/SigmaHQ/sigma', type: 'github' },
      { title: 'Wazuh Documentation', url: 'https://documentation.wazuh.com/', type: 'documentation' },
      { title: 'ELK Stack Guide', url: 'https://www.elastic.co/guide/index.html', type: 'documentation' },
    ],
    homeworkIds: ['hw-siem-1'],
  },
];
