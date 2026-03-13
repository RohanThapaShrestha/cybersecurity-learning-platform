import { Homework } from './homework';

export const extraHomework: Homework[] = [
  // Stage 1
  {
    id: 'hw-crypto-1',
    lessonId: 'cryptography-basics',
    stageId: 'fundamentals',
    title: 'Hash a Message',
    description: 'Explain the difference between hashing and encryption. Then, using a tool like CyberChef, generate the SHA-256 hash of the string "OpenSecLearn".',
    difficulty: 'beginner',
    hints: [
      'Encryption is a two-way function (reversible with a key).',
      'Hashing is a one-way function (cannot be reversed).',
      'Go to gchq.github.io/CyberChef, drop the SHA256 recipe, and input the string.'
    ],
    expectedOutput: 'An explanation of hashing vs encryption and the SHA-256 hash value.',
    solution: 'Encryption is a two-way process designed to hide data but allow it to be recovered with a key. Hashing is a one-way mathematical function that converts data into a fixed-length string, used to verify integrity. The SHA-256 hash of "OpenSecLearn" is: 6c5aba2c5f1c9c42c124fc8b965f3a0c5c7dc6ef7e6d0a7a40facad62c9c7205'
  },
  {
    id: 'hw-risk-1',
    lessonId: 'risk-management',
    stageId: 'fundamentals',
    title: 'Calculate Risk',
    description: 'Using the formula Risk = Threat x Vulnerability x Impact, assess the risk of a web server running an outdated version of Apache (Vulnerability) that is exposed to the internet (Threat). Assume the server hosts public marketing data (Impact). Rate each factor 1-10 and calculate.',
    difficulty: 'beginner',
    hints: [
      'Threat: Being exposed to the internet means anyone can attack it. High score.',
      'Vulnerability: Outdated software is a known weakness. High score.',
      'Impact: It only hosts public data, no PII or secrets. Low score.'
    ],
    expectedOutput: 'Scores for T, V, and I, along with the total risk score and your reasoning.',
    solution: 'Threat = 9 (Internet facing, constant scanning by bots)\nVulnerability = 8 (Known outdated software with public exploits)\nImpact = 2 (Public marketing data only; no sensitive data loss, but slight reputation damage if defaced)\nRisk = 9 x 8 x 2 = 144 (out of 1000). The risk is relatively low despite high threat and vulnerability because the impact of a breach is minimal.'
  },
  {
    id: 'hw-lab-1',
    lessonId: 'virtualization-lab',
    stageId: 'fundamentals',
    title: 'Design Your Lab',
    description: 'Write down a plan for your home cybersecurity lab. What hypervisor will you use? What VMs will you install for attacking, and what VMs will be your targets? How will you configure the networking?',
    difficulty: 'beginner',
    hints: [
      'Choose between VirtualBox or VMware.',
      'You need an attacker machine (Kali/Parrot) and at least one target (Metasploitable).',
      'Networking should be isolated or NAT to prevent exposing vulnerable VMs to your home network.'
    ],
    expectedOutput: 'A brief list of tools, VMs, and network configuration.',
    solution: 'My Lab Design:\n1. Hypervisor: VirtualBox\n2. Attacker VM: Kali Linux (2GB RAM, 2 CPU cores)\n3. Target VM: Metasploitable 2 (512MB RAM, 1 CPU core)\n4. Networking: Configured as a "Host-Only Adapter" or internal "NAT Network". This ensures the VMs can talk to each other and my host machine, but the vulnerable Metasploitable VM cannot be accessed from the internet or my local Wi-Fi.'
  },
  
  // Stage 2
  {
    id: 'hw-firewall-1',
    lessonId: 'firewalls-ids',
    stageId: 'networking-linux',
    title: 'Write Iptables Rules',
    description: 'Write three iptables commands: 1) Set default policy to DROP for INPUT, 2) Allow incoming SSH traffic (port 22), 3) Allow incoming HTTP traffic (port 80).',
    difficulty: 'intermediate',
    hints: [
      'Use -P to set policy on a chain.',
      'Use -A to append a rule.',
      'Use -p tcp and --dport to specify port protocols.'
    ],
    expectedOutput: 'Three valid iptables bash commands.',
    solution: '1. iptables -P INPUT DROP\n2. iptables -A INPUT -p tcp --dport 22 -j ACCEPT\n3. iptables -A INPUT -p tcp --dport 80 -j ACCEPT'
  },
  {
    id: 'hw-wireless-1',
    lessonId: 'wireless-security',
    stageId: 'networking-linux',
    title: 'Wireless Attack Flow',
    description: 'Describe the high-level steps an attacker would take to capture a WPA2 4-way handshake using the aircrack-ng suite.',
    difficulty: 'intermediate',
    hints: [
      'First, the attacker needs to see the traffic (monitor mode).',
      'Second, they need to capture packets to a file.',
      'Third, they need to force a client to disconnect so they reconnect and send the handshake.'
    ],
    expectedOutput: 'A list of 3-4 steps detailing the tools and process.',
    solution: '1. Put the wireless interface into monitor mode (airmon-ng start wlan0).\n2. Start capturing packets on the target AP\'s channel and write to a file (airodump-ng -c [ch] --bssid [mac] -w capture wlan0mon).\n3. Send deauthentication frames to a connected client to force them to disconnect and reconnect (aireplay-ng --deauth 10 -a [ap-mac] -c [client-mac] wlan0mon).\n4. Wait for the client to reconnect; airodump-ng will capture the 4-way handshake, which can then be cracked offline.'
  },
  {
    id: 'hw-hardening-1',
    lessonId: 'linux-admin-security',
    stageId: 'networking-linux',
    title: 'Secure SSH Config',
    description: 'List four configuration changes you would make to /etc/ssh/sshd_config to secure an internet-facing Linux server.',
    difficulty: 'intermediate',
    hints: [
      'Think about how you authenticate (passwords vs keys).',
      'Think about who can log in (root?).',
      'Think about the default port.'
    ],
    expectedOutput: 'Four configuration directives and a brief explanation for each.',
    solution: '1. PermitRootLogin no : Prevents attackers from directly brute-forcing the root account.\n2. PasswordAuthentication no : Disables password logins, requiring cryptographic SSH keys.\n3. Port 2222 : Changes the default port from 22 to reduce noise from automated mass scanners.\n4. AllowUsers admin_user : Strictly limits SSH access to only specified users rather than all system users.'
  },

  // Stage 3
  {
    id: 'hw-js-1',
    lessonId: 'javascript-security',
    stageId: 'programming',
    title: 'Spot the DOM XSS',
    description: 'Examine this JavaScript snippet: `let user = new URLSearchParams(window.location.search).get("name"); document.getElementById("greeting").innerHTML = "Hello " + user;`. Explain why this is vulnerable and show how to fix it.',
    difficulty: 'intermediate',
    hints: [
      'The code takes input from the URL and inserts it directly into the HTML.',
      'innerHTML processes HTML tags (like <script>).',
      'Look for an alternative to innerHTML that only sets raw text.'
    ],
    expectedOutput: 'Explanation of the vulnerability and the corrected JavaScript code.',
    solution: 'Vulnerability: The code extracts the "name" parameter directly from the URL and assigns it to innerHTML without sanitization. An attacker could craft a link like `?name=<script>alert("XSS")</script>` and send it to a victim, leading to DOM-based XSS.\n\nFix: Use textContent instead of innerHTML. textContent treats all input as raw text and will not execute HTML or JavaScript tags.\n\nFixed code: `let user = new URLSearchParams(window.location.search).get("name"); document.getElementById("greeting").textContent = "Hello " + user;`'
  },
  {
    id: 'hw-api-1',
    lessonId: 'apis-web-services',
    stageId: 'programming',
    title: 'BOLA Vulnerability',
    description: 'You are testing an API. When you GET `/api/profile/101`, you see your own data. You change the request to GET `/api/profile/102` and see another user\'s data. What is this vulnerability called, and how should developers fix it?',
    difficulty: 'intermediate',
    hints: [
      'BOLA stands for Broken Object Level Authorization (also known as IDOR).',
      'How does the server know who is making the request?'
    ],
    expectedOutput: 'Name of the vulnerability and a conceptual description of the fix.',
    solution: 'Vulnerability: BOLA (Broken Object Level Authorization), historically known as IDOR (Insecure Direct Object Reference).\n\nFix: The server must not solely rely on the ID provided in the URL to grant access. Upon receiving the request for profile 102, the server must extract the authenticated user\'s identity from their session token (e.g., JWT). It then needs to check in the database if the authenticated user is actually authorized to view object 102. If not, return a 403 Forbidden.'
  },
  {
    id: 'hw-git-1',
    lessonId: 'git-version-control',
    stageId: 'programming',
    title: 'Remove Secret from Git',
    description: 'You accidentally committed a file called "aws_keys.txt" containing live API keys and pushed it to GitHub. What steps must you immediately take to secure your infrastructure?',
    difficulty: 'advanced',
    hints: [
      'Deleting the file from the repo is not enough because it remains in the Git history.',
      'What happens to secrets once they are exposed on public GitHub?'
    ],
    expectedOutput: 'Immediate remediation steps and repository cleanup steps.',
    solution: '1. IMMEDIATE ACTION: Revoke/delete the compromised AWS keys immediately in the AWS console. Once a secret hits public GitHub, bots scrape it within seconds. Deleting the commit will not un-compromise the keys.\n2. Create new API keys.\n3. Remove the secret from Git history (using tools like BFG Repo-Cleaner or `git filter-branch`).\n4. Add the keys file to .gitignore so it isn\'t committed again.\n5. Force push the clean history to the remote repository.'
  },

  // Stage 4
  {
    id: 'hw-auth-1',
    lessonId: 'auth-sessions',
    stageId: 'web-security',
    title: 'Secure Cookie Flags',
    description: 'A developer creates a session cookie like this: `Set-Cookie: session=123ABCxyz;`. Explain what three security flags are missing and what attacks they mitigate.',
    difficulty: 'advanced',
    hints: [
      'How do you stop JavaScript from reading the cookie?',
      'How do you stop the cookie from being sent over unencrypted HTTP?',
      'How do you stop the cookie from being sent via third-party requests (CSRF)?'
    ],
    expectedOutput: 'Three cookie flags and their security benefits.',
    solution: '1. HttpOnly: Prevents client-side scripts (JavaScript) from accessing the cookie. This significantly mitigates the impact of XSS attacks, as attackers cannot steal the session token.\n2. Secure: Ensures the browser only transmits the cookie over encrypted HTTPS connections, preventing interception via packet sniffing or Man-in-the-Middle attacks.\n3. SameSite (Strict or Lax): Controls whether cookies are sent with cross-site requests, providing robust protection against Cross-Site Request Forgery (CSRF) attacks.'
  },
  {
    id: 'hw-csrf-1',
    lessonId: 'csrf-ssrf',
    stageId: 'web-security',
    title: 'Identify SSRF',
    description: 'An application has a feature that fetches profile images from a user-provided URL: `POST /download-avatar` with body `{"url": "http://example.com/image.png"}`. Explain how an attacker could exploit this to perform an SSRF attack against AWS cloud infrastructure.',
    difficulty: 'advanced',
    hints: [
      'What is the magic IP address used to query cloud instance metadata?',
      'What happens if the server fetches that IP instead of an image?'
    ],
    expectedOutput: 'An explanation of the attack payload and the resulting impact.',
    solution: 'Attack: The attacker modifies the payload to submit an internal URL instead of an image URL. For AWS, they would send: `{"url": "http://169.254.169.254/latest/meta-data/iam/security-credentials/"}`.\n\nImpact: Because the server processes the URL without validation, it fetches the AWS metadata endpoint from its own internal network perspective. The server will download the IAM temporary credentials attached to the EC2 instance and return them to the attacker in the response (or save them as the "avatar"). The attacker can then use these credentials to assume the AWS role and compromise the cloud environment.'
  },
  {
    id: 'hw-hardening-web-1',
    lessonId: 'web-app-hardening',
    stageId: 'web-security',
    title: 'Write a Basic CSP',
    description: 'Write a basic Content-Security-Policy header that only allows loading scripts, images, and styles from the application\'s own origin ("self"), and explicitly blocks everything else.',
    difficulty: 'advanced',
    hints: [
      'Start with default-src.',
      'Use the keyword \'self\' (must include quotes).'
    ],
    expectedOutput: 'A complete CSP header string.',
    solution: 'Content-Security-Policy: default-src \'none\'; script-src \'self\'; style-src \'self\'; img-src \'self\'; connect-src \'self\'; frame-ancestors \'none\';'
  },

  // Stage 5
  {
    id: 'hw-privesc-1',
    lessonId: 'privilege-escalation',
    stageId: 'ethical-hacking',
    title: 'Exploit SUID Binary',
    description: 'During a Linux pentest, you run `find / -perm -u=s -type f 2>/dev/null` and discover that `/usr/bin/find` has the SUID bit set. How can you use the `find` command to get a root shell?',
    difficulty: 'advanced',
    hints: [
      'The `find` command has an `-exec` argument that allows it to execute other commands on the files it finds.',
      'If `find` runs as root (SUID), any command executed via `-exec` also runs as root.'
    ],
    expectedOutput: 'The exact command to escalate privileges.',
    solution: 'Since `find` has the SUID bit set, it executes with the permissions of its owner (root). You can abuse the `-exec` flag to spawn a shell as root:\n\n`find . -exec /bin/sh -p \\; -quit`\n\nThe `-p` flag in sh preserves the privileged EUID.'
  },
  {
    id: 'hw-social-1',
    lessonId: 'social-engineering',
    stageId: 'ethical-hacking',
    title: 'Analyze a Phishing Email',
    description: 'You receive an email from "security@appie.com" (notice the \'i\') claiming your iCloud is locked and you must click a link within 24 hours. List three psychological triggers used in this attack.',
    difficulty: 'beginner',
    hints: [
      'Look at the spoofed domain.',
      'Look at the emotion they are trying to cause.',
      'Look at the time limit.'
    ],
    expectedOutput: 'Three psychological tactics used by social engineers.',
    solution: '1. Authority/Trust: Spoofing a known brand (Apple) with a deliberate typo (appie.com/homoglyph attack) to borrow authority.\n2. Fear/Consequence: Claiming the account is "locked" creates fear of losing access to personal data.\n3. Urgency: Imposing a "24-hour" deadline prevents the victim from thinking critically or verifying the claim before acting.'
  },
  {
    id: 'hw-webpentest-1',
    lessonId: 'web-app-pentest',
    stageId: 'ethical-hacking',
    title: 'Pentest Methodology',
    description: 'When starting a web application penetration test, why is directory brute-forcing (using tools like Gobuster or Feroxbuster) an important early step?',
    difficulty: 'intermediate',
    hints: [
      'What are developers trying to hide?',
      'Does the sitemap always list every page?'
    ],
    expectedOutput: 'Explanation of the value of directory enumeration.',
    solution: 'Directory brute-forcing allows a penetration tester to map out the application\'s hidden attack surface. Developers often leave behind unlinked pages, backup files (.bak, .old), old API endpoints (v1, v2), admin panels (/admin, /cp), or configuration files (.env, /.git). These hidden resources frequently contain vulnerabilities, bypass authentication, or leak sensitive information that significantly aids in exploiting the application.'
  },

  // Stage 6
  {
    id: 'hw-malware-1',
    lessonId: 'malware-analysis',
    stageId: 'advanced',
    title: 'Static Analysis First Steps',
    description: 'You are handed a suspicious file named "invoice.exe". List three completely safe static analysis techniques you can perform on this file without executing it.',
    difficulty: 'intermediate',
    hints: [
      'How do you uniquely identify the file?',
      'How do you read human-readable text hidden inside the binary?',
      'Where can you look up previous analyses online?'
    ],
    expectedOutput: 'Three static analysis commands or techniques.',
    solution: '1. Hash Calculation: Obtain the MD5/SHA256 hash using `sha256sum invoice.exe` to create a unique fingerprint.\n2. Threat Intelligence Lookup: Take the calculated hash and search for it on VirusTotal or Hybrid Analysis to see if AV engines have already flagged it.\n3. Strings Extraction: Run `strings invoice.exe` to extract readable ASCII/Unicode text. This can reveal URLs, IP addresses, API calls, or cryptocurrency wallets embedded in the code.'
  },
  {
    id: 'hw-ir-1',
    lessonId: 'incident-response',
    stageId: 'advanced',
    title: 'Incident Containment',
    description: 'Your SIEM alerts you that a ransomware binary just executed on an employee\'s laptop. What is the immediate correct containment action you should take, and what should you NOT do?',
    difficulty: 'advanced',
    hints: [
      'You need to stop it from spreading to the network.',
      'You want to preserve RAM evidence.'
    ],
    expectedOutput: 'The correct action, the incorrect action, and reasoning.',
    solution: 'Correct Action: Immediately disconnect the laptop from the network (physically unplug the ethernet cable and turn off Wi-Fi/isolate via EDR). This prevents the ransomware from spreading to network shares or communicating with C2 servers.\n\nIncorrect Action: DO NOT turn off or reboot the computer. Rebooting destroys valuable volatile evidence in RAM (like decryption keys or running malware processes), and many ransomware strains are programmed to encrypt files specifically during the shutdown/boot sequence.'
  },
  {
    id: 'hw-siem-1',
    lessonId: 'siem-log-analysis',
    stageId: 'advanced',
    title: 'Detect Lateral Movement',
    description: 'In Windows Event Logs, what does a sudden spike in Event ID 4624 (Type 3) authentications from a single workstation to multiple servers indicate?',
    difficulty: 'advanced',
    hints: [
      'Type 3 = Network Logon.',
      'Scanning many servers rapidly.'
    ],
    expectedOutput: 'The attack type and a brief explanation.',
    solution: 'It strongly indicates unauthorized Lateral Movement or network scanning. Event ID 4624 logs a successful logon, and Logon Type 3 indicates a network logon (e.g., accessing a network share or using PsExec/WMI over the network). A spike from one source connecting to many destinations rapidly suggests an attacker or malware is crawling the network using compromised credentials to map out accessible systems.'
  }
];
