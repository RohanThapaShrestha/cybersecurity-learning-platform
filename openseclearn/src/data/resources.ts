export interface Resource {
  id: string;
  title: string;
  url: string;
  category: string;
  type: 'documentation' | 'github' | 'video' | 'platform' | 'blog' | 'tool';
  description: string;
  tags: string[];
}

export const resources: Resource[] = [
  // Documentation
  { id: 'r1', title: 'OWASP Foundation', url: 'https://owasp.org', category: 'Documentation', type: 'documentation', description: 'The Open Web Application Security Project - free security documentation, tools, and community resources.', tags: ['web security', 'standards', 'best practices'] },
  { id: 'r2', title: 'MITRE ATT&CK', url: 'https://attack.mitre.org', category: 'Documentation', type: 'documentation', description: 'A globally-accessible knowledge base of adversary tactics and techniques based on real-world observations.', tags: ['threat intelligence', 'tactics', 'techniques'] },
  { id: 'r3', title: 'NIST Cybersecurity Framework', url: 'https://www.nist.gov/cyberframework', category: 'Documentation', type: 'documentation', description: 'Framework for improving critical infrastructure cybersecurity.', tags: ['framework', 'standards', 'compliance'] },
  { id: 'r4', title: 'Cloud Security Alliance', url: 'https://cloudsecurityalliance.org', category: 'Documentation', type: 'documentation', description: 'Leading organization dedicated to defining standards for cloud security.', tags: ['cloud', 'standards', 'best practices'] },
  { id: 'r5', title: 'CIS Benchmarks', url: 'https://www.cisecurity.org/cis-benchmarks', category: 'Documentation', type: 'documentation', description: 'Globally recognized best practices for securing IT systems and data.', tags: ['hardening', 'benchmarks', 'compliance'] },

  // GitHub Repositories
  { id: 'r6', title: 'Awesome Hacking', url: 'https://github.com/Hack-with-Github/Awesome-Hacking', category: 'GitHub', type: 'github', description: 'A curated list of awesome hacking resources — tools, cheat sheets, and tutorials.', tags: ['hacking', 'tools', 'collection'] },
  { id: 'r7', title: 'PayloadsAllTheThings', url: 'https://github.com/swisskyrepo/PayloadsAllTheThings', category: 'GitHub', type: 'github', description: 'A list of useful payloads and bypasses for Web Application Security and Pentest/CTF.', tags: ['payloads', 'web security', 'pentest'] },
  { id: 'r8', title: 'OSCP Preparation', url: 'https://github.com/0xsyr0/OSCP', category: 'GitHub', type: 'github', description: 'OSCP Cheat Sheet and command reference for offensive security certification.', tags: ['oscp', 'certification', 'pentest'] },
  { id: 'r9', title: 'SecLists', url: 'https://github.com/danielmiessler/SecLists', category: 'GitHub', type: 'github', description: 'Collection of multiple types of lists used during security assessments — usernames, passwords, URLs, fuzzing payloads.', tags: ['wordlists', 'fuzzing', 'security testing'] },
  { id: 'r10', title: 'HowToHunt', url: 'https://github.com/KathanP19/HowToHunt', category: 'GitHub', type: 'github', description: 'Tutorials and methodologies for bug bounty hunting and vulnerability research.', tags: ['bug bounty', 'methodology', 'hunting'] },

  // Learning Platforms
  { id: 'r11', title: 'OverTheWire Wargames', url: 'https://overthewire.org/wargames/', category: 'Platforms', type: 'platform', description: 'Free wargames that teach security concepts through hands-on challenges.', tags: ['wargames', 'challenges', 'linux'] },
  { id: 'r12', title: 'PortSwigger Web Security Academy', url: 'https://portswigger.net/web-security', category: 'Platforms', type: 'platform', description: 'Free, online web security training from the creators of Burp Suite.', tags: ['web security', 'labs', 'training'] },
  { id: 'r13', title: 'PicoCTF', url: 'https://picoctf.org', category: 'Platforms', type: 'platform', description: 'Free computer security education program with CTF-style challenges for beginners.', tags: ['ctf', 'beginner', 'challenges'] },
  { id: 'r14', title: 'CyberDefenders', url: 'https://cyberdefenders.org', category: 'Platforms', type: 'platform', description: 'Free blue team training platform with real-world DFIR challenges.', tags: ['blue team', 'dfir', 'challenges'] },
  { id: 'r15', title: 'DVWA', url: 'https://github.com/digininja/DVWA', category: 'Platforms', type: 'platform', description: 'Damn Vulnerable Web Application - a PHP/MySQL web app for practicing web security.', tags: ['vulnerable app', 'practice', 'web security'] },

  // YouTube & Videos
  { id: 'r16', title: 'NetworkChuck', url: 'https://www.youtube.com/c/NetworkChuck', category: 'Videos', type: 'video', description: 'Engaging cybersecurity, networking, and IT tutorials for beginners and enthusiasts.', tags: ['tutorials', 'networking', 'beginner'] },
  { id: 'r17', title: 'John Hammond', url: 'https://www.youtube.com/c/JohnHammond010', category: 'Videos', type: 'video', description: 'CTF walkthroughs, malware analysis, and cybersecurity education content.', tags: ['ctf', 'malware', 'tutorials'] },
  { id: 'r18', title: 'LiveOverflow', url: 'https://www.youtube.com/c/LiveOverflow', category: 'Videos', type: 'video', description: 'Deep dives into hacking, CTF challenges, and security research.', tags: ['hacking', 'research', 'advanced'] },
  { id: 'r19', title: 'IppSec', url: 'https://www.youtube.com/channel/UCa6eh7gCkpPo5XXUDfygQQA', category: 'Videos', type: 'video', description: 'HackTheBox machine walkthroughs and penetration testing tutorials.', tags: ['htb', 'pentest', 'walkthroughs'] },

  // Blogs & Articles
  { id: 'r20', title: 'Krebs on Security', url: 'https://krebsonsecurity.com', category: 'Blogs', type: 'blog', description: 'In-depth security news and investigation by journalist Brian Krebs.', tags: ['news', 'investigation', 'analysis'] },
  { id: 'r21', title: 'The Hacker News', url: 'https://thehackernews.com', category: 'Blogs', type: 'blog', description: 'Trusted cybersecurity news platform covering latest breaches, vulnerabilities, and security updates.', tags: ['news', 'vulnerabilities', 'updates'] },
  { id: 'r22', title: 'Darknet Diaries Podcast', url: 'https://darknetdiaries.com', category: 'Blogs', type: 'blog', description: 'True stories from the dark side of the internet — hacking, cybercrime, and security.', tags: ['podcast', 'stories', 'cybercrime'] },

  // Tools
  { id: 'r23', title: 'Kali Linux', url: 'https://www.kali.org', category: 'Tools', type: 'tool', description: 'The most popular penetration testing distribution, pre-loaded with security tools.', tags: ['linux', 'pentest', 'tools'] },
  { id: 'r24', title: 'CyberChef', url: 'https://gchq.github.io/CyberChef/', category: 'Tools', type: 'tool', description: 'A web app for encryption, encoding, compression and data analysis — the "Cyber Swiss Army Knife."', tags: ['encoding', 'analysis', 'web tool'] },
  { id: 'r25', title: 'VirusTotal', url: 'https://www.virustotal.com', category: 'Tools', type: 'tool', description: 'Free online service for analyzing suspicious files and URLs for malware.', tags: ['malware', 'analysis', 'scanning'] },
];
