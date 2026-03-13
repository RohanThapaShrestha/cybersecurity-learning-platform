export interface Tool {
  id: string;
  name: string;
  category: string;
  description: string;
  icon: string;
  website: string;
  installation: { platform: string; command: string }[];
  commands: { command: string; description: string }[];
  useCases: string[];
}

export const tools: Tool[] = [
  {
    id: 'nmap',
    name: 'Nmap',
    category: 'Network Scanning',
    description: 'Network Mapper - the most popular network discovery and security auditing tool. Used for host discovery, port scanning, service/version detection, and OS detection.',
    icon: '🔍',
    website: 'https://nmap.org',
    installation: [
      { platform: 'Linux (Debian/Ubuntu)', command: 'sudo apt install nmap' },
      { platform: 'Linux (RHEL/CentOS)', command: 'sudo yum install nmap' },
      { platform: 'macOS', command: 'brew install nmap' },
      { platform: 'Windows', command: 'Download from https://nmap.org/download.html' },
    ],
    commands: [
      { command: 'nmap 192.168.1.1', description: 'Basic scan - scans top 1000 ports' },
      { command: 'nmap -sn 192.168.1.0/24', description: 'Ping sweep - discover live hosts' },
      { command: 'nmap -sV 192.168.1.1', description: 'Service version detection' },
      { command: 'nmap -O 192.168.1.1', description: 'OS detection' },
      { command: 'nmap -A 192.168.1.1', description: 'Aggressive scan (OS, version, script, traceroute)' },
      { command: 'nmap -p- 192.168.1.1', description: 'Scan all 65535 ports' },
      { command: 'nmap -sS 192.168.1.1', description: 'SYN stealth scan' },
      { command: 'nmap --script=vuln 192.168.1.1', description: 'Vulnerability scanning scripts' },
      { command: 'nmap -oN output.txt 192.168.1.1', description: 'Save output to file' },
      { command: 'nmap -sU 192.168.1.1', description: 'UDP port scan' },
    ],
    useCases: [
      'Network inventory and asset discovery',
      'Identifying open ports and running services',
      'Detecting unauthorized services on the network',
      'Vulnerability assessment and compliance auditing',
      'Security auditing before penetration testing',
    ],
  },
  {
    id: 'wireshark',
    name: 'Wireshark',
    category: 'Traffic Analysis',
    description: 'The world\'s most popular network protocol analyzer. Captures and interactively browses network traffic, used for troubleshooting, analysis, and protocol development.',
    icon: '🦈',
    website: 'https://www.wireshark.org',
    installation: [
      { platform: 'Linux (Debian/Ubuntu)', command: 'sudo apt install wireshark' },
      { platform: 'macOS', command: 'brew install --cask wireshark' },
      { platform: 'Windows', command: 'Download from https://www.wireshark.org/download.html' },
    ],
    commands: [
      { command: 'http', description: 'Filter: Show only HTTP traffic' },
      { command: 'tcp.port == 443', description: 'Filter: Show HTTPS traffic' },
      { command: 'dns', description: 'Filter: Show DNS queries and responses' },
      { command: 'ip.addr == 192.168.1.1', description: 'Filter: Traffic to/from specific IP' },
      { command: 'tcp.flags.syn == 1', description: 'Filter: Show TCP SYN packets' },
      { command: 'http.request.method == "POST"', description: 'Filter: HTTP POST requests only' },
      { command: 'frame.len > 1000', description: 'Filter: Large packets' },
      { command: 'tshark -i eth0 -w capture.pcap', description: 'CLI: Capture traffic to file' },
    ],
    useCases: [
      'Analyzing suspicious network traffic',
      'Debugging network connectivity issues',
      'Detecting data exfiltration attempts',
      'Examining malware communication patterns',
      'Learning network protocols hands-on',
    ],
  },
  {
    id: 'burp-suite',
    name: 'Burp Suite',
    category: 'Web Security Testing',
    description: 'An integrated platform for web application security testing. Includes proxy, scanner, intruder, repeater, and more. Community edition is free.',
    icon: '🔥',
    website: 'https://portswigger.net/burp',
    installation: [
      { platform: 'All Platforms', command: 'Download from https://portswigger.net/burp/communitydownload' },
      { platform: 'Linux', command: 'chmod +x burpsuite_community.sh && ./burpsuite_community.sh' },
      { platform: 'Kali Linux', command: 'Pre-installed in Kali Linux' },
    ],
    commands: [
      { command: 'Proxy → Intercept', description: 'Intercept and modify HTTP requests' },
      { command: 'Proxy → HTTP History', description: 'View all proxied requests' },
      { command: 'Repeater', description: 'Manually modify and resend requests' },
      { command: 'Intruder', description: 'Automated customized attacks (fuzzing)' },
      { command: 'Decoder', description: 'Encode/decode data (Base64, URL, etc.)' },
      { command: 'Comparer', description: 'Compare two pieces of data' },
      { command: 'Sequencer', description: 'Analyze session token randomness' },
    ],
    useCases: [
      'Intercepting and modifying web requests',
      'Testing for SQL injection and XSS',
      'Analyzing session management',
      'Fuzzing parameters for vulnerabilities',
      'Web application penetration testing',
    ],
  },
  {
    id: 'metasploit',
    name: 'Metasploit Framework',
    category: 'Exploitation',
    description: 'The world\'s most used penetration testing framework. Provides exploit development, payload generation, and post-exploitation capabilities.',
    icon: '💀',
    website: 'https://www.metasploit.com',
    installation: [
      { platform: 'Kali Linux', command: 'Pre-installed in Kali Linux' },
      { platform: 'Linux', command: 'curl https://raw.githubusercontent.com/rapid7/metasploit-omnibus/master/config/templates/metasploit-framework-wrappers/msfupdate.erb > msfinstall && chmod 755 msfinstall && ./msfinstall' },
      { platform: 'macOS', command: 'brew install metasploit' },
    ],
    commands: [
      { command: 'msfconsole', description: 'Start Metasploit console' },
      { command: 'search type:exploit smb', description: 'Search for SMB exploits' },
      { command: 'use exploit/path', description: 'Select an exploit module' },
      { command: 'show options', description: 'View required options' },
      { command: 'set RHOSTS target_ip', description: 'Set target host' },
      { command: 'set LHOST local_ip', description: 'Set listener IP' },
      { command: 'exploit / run', description: 'Execute the exploit' },
      { command: 'msfvenom -p payload -f format', description: 'Generate payloads' },
    ],
    useCases: [
      'Authorized penetration testing',
      'Validating vulnerability scanner results',
      'Developing and testing exploits in a lab',
      'Post-exploitation and pivoting',
      'Security research and education',
    ],
  },
  {
    id: 'john',
    name: 'John the Ripper',
    category: 'Password Cracking',
    description: 'A fast password cracker, currently available for many flavors of Unix, macOS, Windows, and other platforms. Supports hundreds of hash types.',
    icon: '🔑',
    website: 'https://www.openwall.com/john/',
    installation: [
      { platform: 'Linux (Debian/Ubuntu)', command: 'sudo apt install john' },
      { platform: 'macOS', command: 'brew install john' },
      { platform: 'From source', command: 'git clone https://github.com/openwall/john && cd john/src && ./configure && make' },
    ],
    commands: [
      { command: 'john hashfile', description: 'Crack hashes using default settings' },
      { command: 'john --wordlist=rockyou.txt hashfile', description: 'Dictionary attack' },
      { command: 'john --show hashfile', description: 'Show cracked passwords' },
      { command: 'john --format=raw-md5 hashfile', description: 'Specify hash format' },
      { command: 'unshadow /etc/passwd /etc/shadow > combined', description: 'Prepare Linux password hashes' },
    ],
    useCases: [
      'Auditing password strength in organizations',
      'Recovering forgotten passwords',
      'Testing password policies',
      'CTF competitions',
      'Security research',
    ],
  },
  {
    id: 'gobuster',
    name: 'Gobuster',
    category: 'Directory Brute Forcing',
    description: 'A tool used to brute-force URIs including directories and files, DNS subdomains, and virtual host names.',
    icon: '📁',
    website: 'https://github.com/OJ/gobuster',
    installation: [
      { platform: 'Linux (Go required)', command: 'go install github.com/OJ/gobuster/v3@latest' },
      { platform: 'Kali Linux', command: 'sudo apt install gobuster' },
    ],
    commands: [
      { command: 'gobuster dir -u http://target -w wordlist.txt', description: 'Directory brute forcing' },
      { command: 'gobuster dns -d target.com -w subdomains.txt', description: 'DNS subdomain enumeration' },
      { command: 'gobuster vhost -u http://target -w wordlist.txt', description: 'Virtual host discovery' },
      { command: 'gobuster dir -u http://target -w wordlist.txt -x php,html', description: 'Search for specific extensions' },
    ],
    useCases: [
      'Discovering hidden directories and files',
      'Finding admin panels and backup files',
      'Subdomain enumeration',
      'Web application reconnaissance',
    ],
  },
];
