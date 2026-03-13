import {
  fundamentalsExtra,
  networkingExtra,
  programmingExtra,
  webSecurityExtra,
  ethicalHackingExtra,
  advancedExtra,
} from './extraLessons';

export interface Lesson {
  id: string;
  title: string;
  description: string;
  duration: string;
  content: string;
  resources: { title: string; url: string; type: 'documentation' | 'github' | 'video' | 'article' }[];
  homeworkIds: string[];
}

export interface Stage {
  id: string;
  number: number;
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  color: string;
  topics: string[];
  lessons: Lesson[];
  sources: { name: string; url: string }[];
}

const _stages: Stage[] = [
  {
    id: 'fundamentals',
    number: 1,
    title: 'Computer & Security Fundamentals',
    subtitle: 'Build Your Foundation',
    description: 'Understand how computers work, learn about operating systems, basic networking, and core cybersecurity principles like the CIA triad.',
    icon: '🖥️',
    color: '#00ff88',
    topics: ['How Computers Work', 'Operating Systems', 'Basic Networking', 'Cybersecurity Basics', 'CIA Triad', 'Security Principles'],
    sources: [
      { name: 'OWASP Foundation', url: 'https://owasp.org' },
      { name: 'Cisco Networking Academy', url: 'https://www.netacad.com' },
      { name: 'Linux Foundation', url: 'https://www.linuxfoundation.org' },
    ],
    lessons: [
      {
        id: 'how-computers-work',
        title: 'How Computers Work',
        description: 'Learn the fundamentals of computer architecture, CPUs, memory, and storage.',
        duration: '45 min',
        content: `# How Computers Work

## Overview
A computer is an electronic device that processes data according to a set of instructions. Understanding computer architecture is the first step in your cybersecurity journey.

## Key Concepts

### CPU (Central Processing Unit)
The CPU is the brain of the computer. It executes instructions from programs by performing basic arithmetic, logic, control, and input/output operations.

- **Clock Speed**: Measured in GHz, determines how many operations per second
- **Cores**: Modern CPUs have multiple cores for parallel processing
- **Cache**: Small, fast memory close to the CPU for frequently accessed data

### Memory (RAM)
Random Access Memory stores data that's actively being used. It's volatile — data is lost when power is off.

- **DDR4/DDR5**: Current memory standards
- **Typical sizes**: 8GB - 64GB for modern systems
- **Speed**: Much faster than storage (SSD/HDD)

### Storage
Persistent data storage that retains data without power.

- **HDD**: Mechanical hard drives, slower but cheaper
- **SSD**: Solid-state drives, faster and more reliable
- **NVMe**: Even faster SSDs connected directly via PCIe

### The Boot Process
1. BIOS/UEFI initializes hardware
2. POST (Power-On Self-Test) checks components
3. Bootloader loads the operating system
4. OS kernel initializes and starts services

## Why It Matters for Security
Understanding hardware helps you understand attack vectors like cold boot attacks, firmware exploits, and physical security considerations.`,
        resources: [
          { title: 'Computer Architecture - Wikipedia', url: 'https://en.wikipedia.org/wiki/Computer_architecture', type: 'article' },
          { title: 'How Computers Work - Khan Academy', url: 'https://www.khanacademy.org/computing/computers-and-internet', type: 'video' },
          { title: 'Computer Science Crash Course', url: 'https://github.com/ossu/computer-science', type: 'github' },
        ],
        homeworkIds: ['hw-computers-1', 'hw-computers-2'],
      },
      {
        id: 'operating-systems',
        title: 'Operating Systems',
        description: 'Understand how operating systems manage hardware and software resources.',
        duration: '60 min',
        content: `# Operating Systems

## What is an Operating System?
An OS is system software that manages computer hardware, software resources, and provides common services for programs.

## Types of Operating Systems

### Windows
- Most popular desktop OS
- Target for majority of malware
- Active Directory for enterprise management

### Linux
- Open source and free
- Preferred OS for security professionals
- Runs most servers and security tools

### macOS
- Unix-based, Apple's desktop OS
- Growing target for attacks

## Key OS Concepts

### Processes
Programs in execution. Each process has its own memory space, CPU time, and system resources.

### File Systems
How data is organized on storage: NTFS (Windows), ext4 (Linux), APFS (macOS)

### Users & Permissions
Access control mechanisms that determine who can read, write, or execute files.

### Services & Daemons
Background processes that provide system functionality.

## Security Relevance
OS hardening, patch management, and access control are fundamental security practices.`,
        resources: [
          { title: 'Operating System Concepts', url: 'https://www.os-book.com/', type: 'documentation' },
          { title: 'Linux From Scratch', url: 'https://www.linuxfromscratch.org/', type: 'documentation' },
          { title: 'OWASP OS Security', url: 'https://owasp.org/www-community/', type: 'documentation' },
        ],
        homeworkIds: ['hw-os-1'],
      },
      {
        id: 'basic-networking',
        title: 'Basic Networking',
        description: 'Learn how computers communicate through networks.',
        duration: '50 min',
        content: `# Basic Networking

## The OSI Model
Seven layers of network communication:

1. **Physical** - Cables, signals, voltages
2. **Data Link** - MAC addresses, switches
3. **Network** - IP addresses, routers
4. **Transport** - TCP/UDP, ports
5. **Session** - Connection management
6. **Presentation** - Data formatting, encryption
7. **Application** - HTTP, FTP, DNS

## IP Addressing
- **IPv4**: 32-bit addresses (e.g., 192.168.1.1)
- **IPv6**: 128-bit addresses
- **Subnetting**: Dividing networks into smaller segments
- **Private vs Public IPs**

## Common Protocols
- **HTTP/HTTPS**: Web traffic (port 80/443)
- **DNS**: Domain name resolution (port 53)
- **FTP**: File transfer (port 21)
- **SSH**: Secure shell (port 22)
- **DHCP**: Dynamic IP assignment

## Network Devices
- **Router**: Connects different networks
- **Switch**: Connects devices in a network
- **Firewall**: Filters traffic based on rules

## Why Networking Matters for Security
Nearly all cyberattacks traverse a network. Understanding networking is essential for detecting and preventing attacks.`,
        resources: [
          { title: 'Cisco Networking Basics', url: 'https://www.netacad.com/courses/networking-basics', type: 'documentation' },
          { title: 'Computer Networking - Stanford', url: 'https://cs144.github.io/', type: 'article' },
        ],
        homeworkIds: ['hw-networking-1'],
      },
      {
        id: 'cia-triad',
        title: 'CIA Triad & Security Principles',
        description: 'Master the core principles of information security.',
        duration: '40 min',
        content: `# CIA Triad & Security Principles

## The CIA Triad

### Confidentiality
Ensuring information is accessible only to authorized parties.
- Encryption, access controls, authentication
- Example: Only HR can access employee salary data

### Integrity
Ensuring data has not been altered in an unauthorized manner.
- Checksums, digital signatures, version control
- Example: Detecting if a file was modified during transfer

### Availability
Ensuring systems and data are accessible when needed.
- Redundancy, backups, DDoS protection
- Example: A web server staying online during traffic spikes

## Additional Security Principles

### Defense in Depth
Multiple layers of security controls throughout a system.

### Least Privilege
Users get the minimum access required for their role.

### Zero Trust
Never trust, always verify — even inside the network.

### Security by Design
Building security into systems from the start, not bolting it on later.

## Common Threat Categories
- **Malware**: Viruses, worms, trojans, ransomware
- **Social Engineering**: Phishing, pretexting, baiting
- **Network Attacks**: Man-in-the-middle, DDoS, sniffing
- **Web Attacks**: SQL injection, XSS, CSRF`,
        resources: [
          { title: 'NIST Cybersecurity Framework', url: 'https://www.nist.gov/cyberframework', type: 'documentation' },
          { title: 'OWASP Security Principles', url: 'https://owasp.org/www-project-developer-guide/draft/foundations/security_principles/', type: 'documentation' },
        ],
        homeworkIds: ['hw-cia-1', 'hw-cia-2'],
      },
    ],
  },
  {
    id: 'networking-linux',
    number: 2,
    title: 'Networking & Linux',
    subtitle: 'Master the Command Line',
    description: 'Deep dive into TCP/IP, DNS, HTTP/HTTPS protocols, and become proficient with Linux commands, system processes, and file permissions.',
    icon: '🐧',
    color: '#00d4ff',
    topics: ['TCP/IP Deep Dive', 'DNS', 'HTTP/HTTPS', 'Linux Commands', 'System Processes', 'File Permissions'],
    sources: [
      { name: 'Linux Documentation Project', url: 'https://www.tldp.org' },
      { name: 'Wireshark Foundation', url: 'https://www.wireshark.org/docs/' },
    ],
    lessons: [
      {
        id: 'tcp-ip-deep-dive',
        title: 'TCP/IP Deep Dive',
        description: 'Understand the TCP/IP protocol suite that powers the internet.',
        duration: '55 min',
        content: `# TCP/IP Deep Dive

## TCP vs UDP

### TCP (Transmission Control Protocol)
- Connection-oriented (3-way handshake)
- Reliable delivery with acknowledgments
- Flow control and congestion control
- Used for: HTTP, FTP, SSH, Email

### The TCP 3-Way Handshake
\`\`\`
Client → SYN → Server
Client ← SYN-ACK ← Server
Client → ACK → Server
\`\`\`

### UDP (User Datagram Protocol)
- Connectionless
- No guaranteed delivery
- Faster, lower overhead
- Used for: DNS, streaming, gaming, VoIP

## IP Protocol
- Responsible for addressing and routing
- Each packet contains source and destination IP
- TTL (Time to Live) prevents infinite routing loops

## Common Ports
| Port | Protocol | Service |
|------|----------|---------|
| 21   | TCP      | FTP     |
| 22   | TCP      | SSH     |
| 53   | TCP/UDP  | DNS     |
| 80   | TCP      | HTTP    |
| 443  | TCP      | HTTPS   |
| 3389 | TCP      | RDP     |

## Security Implications
- Port scanning reveals open services
- TCP SYN floods are common DDoS attacks
- Packet sniffing can capture unencrypted traffic`,
        resources: [
          { title: 'TCP/IP Guide', url: 'http://www.tcpipguide.com/', type: 'documentation' },
          { title: 'Wireshark TCP Analysis', url: 'https://www.wireshark.org/docs/', type: 'documentation' },
        ],
        homeworkIds: ['hw-tcpip-1'],
      },
      {
        id: 'linux-commands',
        title: 'Essential Linux Commands',
        description: 'Master the Linux command line for cybersecurity operations.',
        duration: '60 min',
        content: `# Essential Linux Commands

## File Operations
\`\`\`bash
ls -la          # List all files with details
cd /path        # Change directory
cp src dest     # Copy files
mv src dest     # Move/rename files
rm file         # Remove files
mkdir dir       # Create directory
cat file        # Display file contents
head/tail file  # Show beginning/end of file
find / -name x  # Search for files
\`\`\`

## User & Permission Management
\`\`\`bash
whoami              # Current user
id                  # User ID and groups
sudo command        # Run as superuser
chmod 755 file      # Change file permissions
chown user:group f  # Change ownership
passwd              # Change password
useradd username    # Add a user
\`\`\`

## Networking Commands
\`\`\`bash
ifconfig / ip addr  # Network interface info
ping host           # Test connectivity
netstat -tulpn      # Active connections
ss -tulpn           # Socket statistics
nslookup domain     # DNS lookup
traceroute host     # Trace packet route
curl url            # Transfer data
wget url            # Download files
\`\`\`

## Process Management
\`\`\`bash
ps aux          # List all processes
top / htop      # Real-time process monitor
kill PID        # Terminate a process
kill -9 PID     # Force kill
bg / fg         # Background/foreground
systemctl       # Service management
\`\`\`

## File Permissions
\`\`\`
-rwxrwxrwx
 │││ │││ │││
 │││ │││ └── Other: read/write/execute
 │││ └───── Group: read/write/execute
 └──────── Owner: read/write/execute
\`\`\`

Numeric: r=4, w=2, x=1 → chmod 755 = rwxr-xr-x`,
        resources: [
          { title: 'Linux Command Line Basics', url: 'https://ubuntu.com/tutorials/command-line-for-beginners', type: 'documentation' },
          { title: 'The Linux Command Line Book', url: 'https://linuxcommand.org/tlcl.php', type: 'article' },
          { title: 'OverTheWire Bandit', url: 'https://overthewire.org/wargames/bandit/', type: 'article' },
        ],
        homeworkIds: ['hw-linux-1', 'hw-linux-2'],
      },
      {
        id: 'dns-http',
        title: 'DNS & HTTP/HTTPS',
        description: 'Understand domain resolution and web protocols.',
        duration: '45 min',
        content: `# DNS & HTTP/HTTPS

## DNS (Domain Name System)

### How DNS Works
1. User types "example.com" in browser
2. Browser checks local cache
3. Query goes to recursive DNS resolver
4. Resolver queries root nameservers → TLD servers → authoritative servers
5. IP address returned to browser

### DNS Record Types
- **A**: Maps domain to IPv4
- **AAAA**: Maps domain to IPv6
- **CNAME**: Alias to another domain
- **MX**: Mail server
- **TXT**: Text data (SPF, DKIM)
- **NS**: Nameserver

### DNS Security Issues
- DNS spoofing/poisoning
- DNS tunneling for data exfiltration
- DNSSEC for authentication

## HTTP/HTTPS

### HTTP Methods
- **GET**: Retrieve data
- **POST**: Submit data
- **PUT**: Update data
- **DELETE**: Remove data

### HTTP Status Codes
- **200**: OK
- **301**: Moved Permanently
- **403**: Forbidden
- **404**: Not Found
- **500**: Internal Server Error

### HTTPS & TLS
- TLS handshake establishes encrypted connection
- Certificates verify server identity
- Modern standard: TLS 1.3`,
        resources: [
          { title: 'How DNS Works', url: 'https://howdns.works/', type: 'article' },
          { title: 'MDN HTTP Guide', url: 'https://developer.mozilla.org/en-US/docs/Web/HTTP', type: 'documentation' },
        ],
        homeworkIds: ['hw-dns-1'],
      },
    ],
  },
  {
    id: 'programming',
    number: 3,
    title: 'Programming for Security',
    subtitle: 'Code Your Way In',
    description: 'Learn Python for automation, Bash scripting, basic JavaScript, APIs, and essential automation tools for security professionals.',
    icon: '💻',
    color: '#ff6b00',
    topics: ['Python for Automation', 'Bash Scripting', 'JavaScript Basics', 'APIs & REST', 'Automation Tools'],
    sources: [
      { name: 'Python Official Docs', url: 'https://docs.python.org' },
      { name: 'Git Documentation', url: 'https://git-scm.com/doc' },
      { name: 'GitHub', url: 'https://github.com' },
    ],
    lessons: [
      {
        id: 'python-security',
        title: 'Python for Security',
        description: 'Learn Python programming with a focus on security automation.',
        duration: '90 min',
        content: `# Python for Security

## Why Python for Security?
- Easy to learn and read
- Massive library ecosystem
- Used in most security tools
- Great for automation and scripting

## Essential Python for Security

### Socket Programming
\`\`\`python
import socket

def port_scanner(target, ports):
    for port in ports:
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        sock.settimeout(1)
        result = sock.connect_ex((target, port))
        if result == 0:
            print(f"Port {port}: OPEN")
        sock.close()

port_scanner("127.0.0.1", range(1, 1025))
\`\`\`

### Making HTTP Requests
\`\`\`python
import requests

response = requests.get("https://api.example.com/data")
print(response.status_code)
print(response.json())
\`\`\`

### File Operations
\`\`\`python
# Reading log files
with open("/var/log/auth.log", "r") as f:
    for line in f:
        if "Failed password" in line:
            print(line.strip())
\`\`\`

### Hashing
\`\`\`python
import hashlib

text = "password123"
md5_hash = hashlib.md5(text.encode()).hexdigest()
sha256_hash = hashlib.sha256(text.encode()).hexdigest()
print(f"MD5: {md5_hash}")
print(f"SHA256: {sha256_hash}")
\`\`\`

## Python Security Libraries
- **scapy**: Packet manipulation
- **requests**: HTTP library
- **paramiko**: SSH automation
- **pwntools**: CTF/exploitation
- **beautifulsoup4**: Web scraping`,
        resources: [
          { title: 'Python Official Tutorial', url: 'https://docs.python.org/3/tutorial/', type: 'documentation' },
          { title: 'Automate the Boring Stuff', url: 'https://automatetheboringstuff.com/', type: 'article' },
          { title: 'Python for Cybersecurity', url: 'https://github.com/topics/python-security', type: 'github' },
        ],
        homeworkIds: ['hw-python-1', 'hw-python-2'],
      },
      {
        id: 'bash-scripting',
        title: 'Bash Scripting',
        description: 'Write Bash scripts for system automation and security tasks.',
        duration: '60 min',
        content: `# Bash Scripting

## Basics
\`\`\`bash
#!/bin/bash

# Variables
NAME="OpenSecLearn"
echo "Welcome to $NAME"

# User input
read -p "Enter target IP: " TARGET
echo "Scanning $TARGET..."

# Conditionals
if [ -f "/etc/passwd" ]; then
    echo "File exists"
fi

# Loops
for port in 22 80 443 8080; do
    echo "Checking port $port..."
done
\`\`\`

## Security Scripts

### Simple Port Checker
\`\`\`bash
#!/bin/bash
TARGET=$1
for PORT in 21 22 80 443 3306 8080; do
    (echo >/dev/tcp/$TARGET/$PORT) 2>/dev/null && 
        echo "Port $PORT: OPEN" || 
        echo "Port $PORT: CLOSED"
done
\`\`\`

### Log Analyzer
\`\`\`bash
#!/bin/bash
echo "Failed SSH attempts:"
grep "Failed password" /var/log/auth.log | \\
    awk '{print $11}' | sort | uniq -c | sort -rn | head -10
\`\`\`

### File Integrity Checker
\`\`\`bash
#!/bin/bash
DIR="/etc"
find $DIR -type f -exec md5sum {} \\; > /tmp/baseline.txt
echo "Baseline created. Run again to compare."
\`\`\``,
        resources: [
          { title: 'Bash Guide', url: 'https://mywiki.wooledge.org/BashGuide', type: 'documentation' },
          { title: 'Shell Scripting Tutorial', url: 'https://www.shellscript.sh/', type: 'article' },
        ],
        homeworkIds: ['hw-bash-1'],
      },
    ],
  },
  {
    id: 'web-security',
    number: 4,
    title: 'Web Security',
    subtitle: 'Hack the Web',
    description: 'Master web application security including authentication, sessions, OWASP Top 10 vulnerabilities, XSS, SQL injection, and CSRF.',
    icon: '🌐',
    color: '#ff0055',
    topics: ['Authentication & Sessions', 'Cookies', 'OWASP Top 10', 'XSS', 'SQL Injection', 'CSRF'],
    sources: [
      { name: 'OWASP Top 10', url: 'https://owasp.org/www-project-top-ten/' },
      { name: 'PortSwigger Web Academy', url: 'https://portswigger.net/web-security' },
    ],
    lessons: [
      {
        id: 'owasp-top-10',
        title: 'OWASP Top 10',
        description: 'Learn the most critical web application security risks.',
        duration: '75 min',
        content: `# OWASP Top 10 (2021)

## A01: Broken Access Control
Users can act outside their intended permissions.
- IDOR (Insecure Direct Object References)
- Privilege escalation
- Missing function-level access control

## A02: Cryptographic Failures
Exposure of sensitive data due to weak or missing cryptography.
- Transmitting data in cleartext
- Using deprecated algorithms (MD5, SHA1)
- Weak key generation

## A03: Injection
Untrusted data sent to an interpreter as part of a command.
- SQL injection
- NoSQL injection
- OS command injection
- LDAP injection

## A04: Insecure Design
Missing or ineffective security controls by design.
- Lack of threat modeling
- Missing rate limiting
- Insufficient input validation

## A05: Security Misconfiguration
Insecure default configurations, open cloud storage, verbose errors.
- Default credentials
- Unnecessary features enabled
- Missing security headers

## A06: Vulnerable Components
Using components with known vulnerabilities.
- Outdated libraries and frameworks
- Unpatched systems

## A07: Authentication Failures
Broken authentication and session management.
- Credential stuffing
- Weak passwords
- Missing MFA

## A08: Software and Data Integrity Failures
Code and infrastructure that doesn't protect against integrity violations.
- Insecure CI/CD pipelines
- Auto-update without verification

## A09: Security Logging & Monitoring Failures
Insufficient logging, detection, and response.
- No audit logs
- No alerting

## A10: Server-Side Request Forgery (SSRF)
Web application fetches remote resources without validating user-supplied URLs.`,
        resources: [
          { title: 'OWASP Top 10 Official', url: 'https://owasp.org/www-project-top-ten/', type: 'documentation' },
          { title: 'PortSwigger All Labs', url: 'https://portswigger.net/web-security/all-labs', type: 'article' },
          { title: 'OWASP Testing Guide', url: 'https://owasp.org/www-project-web-security-testing-guide/', type: 'documentation' },
        ],
        homeworkIds: ['hw-owasp-1', 'hw-owasp-2'],
      },
      {
        id: 'xss-sqli',
        title: 'XSS & SQL Injection',
        description: 'Deep dive into the most common web vulnerabilities.',
        duration: '80 min',
        content: `# XSS & SQL Injection

## Cross-Site Scripting (XSS)

### Types
1. **Reflected XSS**: Payload in URL, reflected in response
2. **Stored XSS**: Payload saved in database, served to users
3. **DOM-based XSS**: Client-side manipulation

### Example
\`\`\`html
<!-- Vulnerable input -->
<input value="<script>alert('XSS')</script>">

<!-- Safe: HTML encoding -->
<input value="&lt;script&gt;alert(&#x27;XSS&#x27;)&lt;/script&gt;">
\`\`\`

### Prevention
- Output encoding/escaping
- Content Security Policy (CSP)
- Input validation
- HTTPOnly cookies

## SQL Injection

### Basic SQLi
\`\`\`sql
-- Normal query
SELECT * FROM users WHERE username = 'admin' AND password = 'pass123'

-- Injected query
SELECT * FROM users WHERE username = 'admin' OR 1=1 --' AND password = 'anything'
\`\`\`

### Types
1. **Classic/In-band**: Results visible in response
2. **Blind**: No visible output, infer from behavior
3. **Time-based**: Use SLEEP() to confirm injection

### Prevention
- Parameterized queries / prepared statements
- Input validation and sanitization
- ORMs (Object-Relational Mapping)
- Least privilege database accounts`,
        resources: [
          { title: 'PortSwigger XSS Labs', url: 'https://portswigger.net/web-security/cross-site-scripting', type: 'article' },
          { title: 'PortSwigger SQLi Labs', url: 'https://portswigger.net/web-security/sql-injection', type: 'article' },
          { title: 'OWASP Injection Prevention', url: 'https://cheatsheetseries.owasp.org/cheatsheets/Injection_Prevention_Cheat_Sheet.html', type: 'documentation' },
        ],
        homeworkIds: ['hw-xss-1', 'hw-sqli-1'],
      },
    ],
  },
  {
    id: 'ethical-hacking',
    number: 5,
    title: 'Ethical Hacking & VAPT',
    subtitle: 'Think Like a Hacker',
    description: 'Learn reconnaissance, scanning, enumeration, exploitation basics, and professional vulnerability reporting.',
    icon: '🔓',
    color: '#9d00ff',
    topics: ['Reconnaissance', 'Scanning', 'Enumeration', 'Exploitation Basics', 'Reporting Vulnerabilities'],
    sources: [
      { name: 'Nmap Documentation', url: 'https://nmap.org/docs.html' },
      { name: 'Metasploit Unleashed', url: 'https://www.offsec.com/metasploit-unleashed/' },
    ],
    lessons: [
      {
        id: 'recon-scanning',
        title: 'Reconnaissance & Scanning',
        description: 'Learn how to gather information and scan targets ethically.',
        duration: '70 min',
        content: `# Reconnaissance & Scanning

## Passive Reconnaissance
Gathering information without directly interacting with the target.

### OSINT Tools
- **Whois**: Domain registration info
- **Shodan**: Internet-connected device search
- **theHarvester**: Email & domain enumeration
- **Google Dorks**: Advanced search operators

### Google Dorking Examples
\`\`\`
site:target.com filetype:pdf
intitle:"index of" site:target.com
inurl:admin site:target.com
\`\`\`

## Active Scanning

### Nmap Scanning
\`\`\`bash
# Basic scan
nmap 192.168.1.1

# Service version detection
nmap -sV 192.168.1.1

# OS detection
nmap -O 192.168.1.1

# Aggressive scan
nmap -A 192.168.1.1

# Scan all ports
nmap -p- 192.168.1.1

# Stealth scan
nmap -sS 192.168.1.1

# UDP scan
nmap -sU 192.168.1.1

# Script scan
nmap --script=vuln 192.168.1.1
\`\`\`

## Enumeration
- SMB enumeration (enum4linux)
- SNMP enumeration
- DNS zone transfers
- Web directory brute forcing (dirb, gobuster)

## Legal and Ethical Considerations
- Always get written authorization
- Stay within scope
- Document everything
- Report findings responsibly`,
        resources: [
          { title: 'Nmap Reference Guide', url: 'https://nmap.org/book/man.html', type: 'documentation' },
          { title: 'OSINT Framework', url: 'https://osintframework.com/', type: 'article' },
          { title: 'Bug Bounty Methodology', url: 'https://github.com/KathanP19/HowToHunt', type: 'github' },
        ],
        homeworkIds: ['hw-recon-1', 'hw-nmap-1'],
      },
      {
        id: 'exploitation-reporting',
        title: 'Exploitation & Reporting',
        description: 'Learn basics of exploitation and professional vulnerability reporting.',
        duration: '60 min',
        content: `# Exploitation & Reporting

## Metasploit Framework
\`\`\`bash
# Start Metasploit
msfconsole

# Search for exploits
search type:exploit platform:windows smb

# Use an exploit
use exploit/windows/smb/ms17_010_eternalblue

# Set options
set RHOSTS 192.168.1.100
set LHOST 192.168.1.50

# Run
exploit
\`\`\`

## Vulnerability Assessment Process
1. **Scope Definition**: What to test and what not
2. **Information Gathering**: Passive & active recon
3. **Vulnerability Scanning**: Automated tools
4. **Manual Testing**: Verify and exploit
5. **Post-Exploitation**: Assess impact
6. **Reporting**: Document everything

## Writing a Vulnerability Report

### Report Structure
1. **Executive Summary**: High-level overview
2. **Scope**: Systems and methods tested
3. **Methodology**: Tools and techniques used
4. **Findings**: Each vulnerability with:
   - Title and severity (CVSS score)
   - Description
   - Proof of Concept
   - Impact
   - Remediation
5. **Conclusion**: Summary and next steps

### CVSS Scoring
- **Critical**: 9.0-10.0
- **High**: 7.0-8.9
- **Medium**: 4.0-6.9
- **Low**: 0.1-3.9
- **None**: 0.0`,
        resources: [
          { title: 'Metasploit Unleashed', url: 'https://www.offsec.com/metasploit-unleashed/', type: 'documentation' },
          { title: 'Pentest Report Templates', url: 'https://github.com/juliocesarfort/public-pentesting-reports', type: 'github' },
          { title: 'CVSS Calculator', url: 'https://www.first.org/cvss/calculator/3.1', type: 'article' },
        ],
        homeworkIds: ['hw-exploit-1', 'hw-report-1'],
      },
    ],
  },
  {
    id: 'advanced',
    number: 6,
    title: 'Advanced Security Topics',
    subtitle: 'Level Up',
    description: 'Explore cloud security, malware analysis basics, reverse engineering, SOC operations, and threat intelligence frameworks.',
    icon: '🛡️',
    color: '#ffcc00',
    topics: ['Cloud Security', 'Malware Basics', 'Reverse Engineering', 'SOC Analysis', 'Threat Intelligence'],
    sources: [
      { name: 'MITRE ATT&CK', url: 'https://attack.mitre.org' },
      { name: 'Cloud Security Alliance', url: 'https://cloudsecurityalliance.org' },
    ],
    lessons: [
      {
        id: 'cloud-security',
        title: 'Cloud Security',
        description: 'Understand security in cloud environments (AWS, Azure, GCP).',
        duration: '65 min',
        content: `# Cloud Security

## Cloud Service Models
- **IaaS**: Infrastructure as a Service (EC2, VMs)
- **PaaS**: Platform as a Service (Heroku, App Engine)
- **SaaS**: Software as a Service (Gmail, Slack)

## Shared Responsibility Model
- **Cloud Provider**: Physical security, infrastructure
- **Customer**: Data, access control, configuration

## Common Cloud Vulnerabilities
1. Misconfigured storage buckets (S3)
2. Overly permissive IAM policies
3. Exposed API keys and secrets
4. Insecure serverless functions
5. Lack of encryption

## Cloud Security Tools
- **AWS**: GuardDuty, Security Hub, IAM Access Analyzer
- **Azure**: Defender for Cloud, Sentinel
- **GCP**: Security Command Center

## Best Practices
- Enable MFA everywhere
- Use least privilege IAM policies
- Encrypt data at rest and in transit
- Enable logging and monitoring
- Regular access reviews
- Infrastructure as Code (IaC) scanning`,
        resources: [
          { title: 'Cloud Security Alliance Resources', url: 'https://cloudsecurityalliance.org/research/', type: 'documentation' },
          { title: 'AWS Security Best Practices', url: 'https://docs.aws.amazon.com/security/', type: 'documentation' },
          { title: 'MITRE ATT&CK Cloud', url: 'https://attack.mitre.org/matrices/enterprise/cloud/', type: 'documentation' },
        ],
        homeworkIds: ['hw-cloud-1'],
      },
      {
        id: 'threat-intelligence',
        title: 'SOC & Threat Intelligence',
        description: 'Learn SOC operations and threat intelligence frameworks.',
        duration: '70 min',
        content: `# SOC & Threat Intelligence

## Security Operations Center (SOC)

### SOC Roles
- **Tier 1**: Alert monitoring and triage
- **Tier 2**: Incident investigation
- **Tier 3**: Advanced threat hunting
- **SOC Manager**: Operations oversight

### SOC Tools
- **SIEM**: Splunk, ELK Stack, QRadar
- **EDR**: CrowdStrike, Carbon Black
- **SOAR**: Palo Alto XSOAR, Splunk SOAR
- **Ticketing**: Jira, ServiceNow

## MITRE ATT&CK Framework
A knowledge base of adversary tactics and techniques.

### Tactics (What attackers try to achieve)
1. Reconnaissance
2. Resource Development
3. Initial Access
4. Execution
5. Persistence
6. Privilege Escalation
7. Defense Evasion
8. Credential Access
9. Discovery
10. Lateral Movement
11. Collection
12. Command and Control
13. Exfiltration
14. Impact

## Threat Intelligence
### Types
- **Strategic**: High-level trends for executives
- **Tactical**: TTPs for security teams
- **Operational**: Specific attack details
- **Technical**: IOCs (IPs, hashes, domains)

### IOC (Indicators of Compromise)
- Malicious IP addresses
- File hashes (MD5, SHA256)
- Domain names
- Email addresses
- URL patterns`,
        resources: [
          { title: 'MITRE ATT&CK', url: 'https://attack.mitre.org/', type: 'documentation' },
          { title: 'Splunk Free Training', url: 'https://www.splunk.com/en_us/training/free-courses.html', type: 'article' },
          { title: 'SOC Analyst Guide', url: 'https://github.com/clong/DetectionLab', type: 'github' },
        ],
        homeworkIds: ['hw-soc-1', 'hw-threat-1'],
      },
    ],
  },
];

export const stages: Stage[] = _stages.map(stage => {
  if (stage.id === 'fundamentals') {
    return {
      ...stage,
      topics: [...stage.topics, 'Cryptography Basics', 'Risk Management & Frameworks', 'Virtualization & Lab Setup'],
      lessons: [...stage.lessons, ...fundamentalsExtra]
    };
  }
  if (stage.id === 'networking-linux') {
    return {
      ...stage,
      topics: [...stage.topics, 'Firewalls, IDS & IPS', 'Wireless Network Security', 'Linux System Administration & Hardening'],
      lessons: [...stage.lessons, ...networkingExtra]
    };
  }
  if (stage.id === 'programming') {
    return {
      ...stage,
      topics: [...stage.topics, 'JavaScript for Security', 'APIs & Web Services Security', 'Git & Version Control Security'],
      lessons: [...stage.lessons, ...programmingExtra]
    };
  }
  if (stage.id === 'web-security') {
    return {
      ...stage,
      topics: [...stage.topics, 'Authentication & Session Management', 'CSRF & SSRF Attacks', 'Web Application Hardening'],
      lessons: [...stage.lessons, ...webSecurityExtra]
    };
  }
  if (stage.id === 'ethical-hacking') {
    return {
      ...stage,
      topics: [...stage.topics, 'Privilege Escalation', 'Social Engineering & Phishing', 'Web Application Penetration Testing'],
      lessons: [...stage.lessons, ...ethicalHackingExtra]
    };
  }
  if (stage.id === 'advanced') {
    return {
      ...stage,
      topics: [...stage.topics, 'Malware Analysis Fundamentals', 'Incident Response & Digital Forensics', 'SIEM & Log Analysis'],
      lessons: [...stage.lessons, ...advancedExtra]
    };
  }
  return stage;
});
