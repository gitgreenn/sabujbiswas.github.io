/**
 * SABUJ // CYBERSPACE - Central Configuration File
 * Author: Sabuj Biswas
 * All portfolio information, projects, links, and lab data are managed here.
 */

const CONFIG = {
  profile: {
    name: "Sabuj Biswas",
    callsign: "SABUJ.SYS",
    role: "Cybersecurity Enthusiast",
    tagline: "Network Security // Ethical Hacking // Linux Systems",
    location: "Kolkata, India",
    status: "SYS_ONLINE // ENCRYPTED: AES-256",
    clearance: "LEVEL-3 CYBER-RESEARCHER",
    education: {
      degree: "B.Tech in Computer Science and Engineering",
      specialization: "Cyber Security",
      institution: "The Neotia University",
      graduation: "2026",
      cgpa: "7.9"
    },
    bio: "Passionate Computer Science and Engineering student specializing in Cyber Security at The Neotia University (Class of 2026). Dedicated to understanding the deep mechanisms of network architectures, Linux kernel security, protocol analysis, and ethical hacking. Constantly researching network resilience and developing security-focused automation tools.",
    interests: [
      "Network Security",
      "Ethical Hacking",
      "Linux Administration",
      "Python Security Automation",
      "Computer Networking",
      "Web Security Fundamentals",
      "Cybersecurity Research"
    ],
    social: {
      github: "https://github.com/gitcolon-Sabuj",
      linkedin: "https://linkedin.com/in/sabujbiswas-link/",
      email: "sabujbiswas.contact@gmail.com",
      resume: "resume/resume.pdf"
    }
  },

  skills: {
    programming: [
      { name: "Python", level: "Core Scripting & Automation", icon: "fa-brands fa-python" },
      { name: "C", level: "Systems & Memory Basics", icon: "fa-solid fa-code" },
      { name: "HTML5", level: "Semantic Web Structure", icon: "fa-brands fa-html5" },
      { name: "CSS3", level: "Modern Responsive Layouts", icon: "fa-brands fa-css3-alt" },
      { name: "JavaScript", level: "ES6+ DOM & Async Operations", icon: "fa-brands fa-js" }
    ],
    networking: [
      { name: "TCP/IP Protocol Suite", desc: "Layered architecture, packet inspection, 3-way handshake" },
      { name: "LAN & Switching", desc: "Switch architecture, MAC tables, broadcast domains, STP" },
      { name: "VLAN Segmentation", desc: "802.1Q encapsulation, access/trunk ports, isolated domains" },
      { name: "Routing & Subnetting", desc: "IPv4/IPv6 CIDR, static routing, default gateway setup" },
      { name: "Inter-VLAN Routing", desc: "Router-on-a-Stick (ROAS) and Layer 3 switch SVI routing" },
      { name: "Firewall Configuration", desc: "Stateful inspection concepts, perimeter defense setup" },
      { name: "Access Control Lists (ACL)", desc: "Standard and extended ACLs, inbound/outbound packet filters" },
      { name: "NAT & PAT", desc: "Network Address Translation, IP conservation, port forwarding" }
    ],
    cybersecurity: [
      { name: "Network Security", desc: "Traffic analysis, packet sniffing, unauthorized access defense" },
      { name: "Linux Security", desc: "Permissions, sudo privilege segregation, iptables, SSH hardening" },
      { name: "Ethical Hacking Fundamentals", desc: "Reconnaissance, port mapping, vulnerability identification" },
      { name: "Web Security Fundamentals", desc: "OWASP Top 10 awareness: SQLi, XSS, CSRF, input sanitization" }
    ],
    tools: [
      { name: "Cisco Packet Tracer", category: "Network Simulation", icon: "fa-solid fa-network-wired" },
      { name: "Linux (Debian / Kali / Ubuntu)", category: "OS Environment", icon: "fa-brands fa-linux" },
      { name: "Git & GitHub", category: "Version Control", icon: "fa-brands fa-github" },
      { name: "VS Code", category: "Development IDE", icon: "fa-solid fa-terminal" },
      { name: "Windows", category: "OS Environment", icon: "fa-brands fa-windows" },
      { name: "MySQL", category: "Relational Database", icon: "fa-solid fa-database" }
    ]
  },

  projects: [
    {
      id: "vlan-network-design",
      title: "Enterprise Inter-VLAN Network Design",
      badge: "Network Architecture",
      featured: true,
      technologies: ["Cisco Packet Tracer", "VLAN 802.1Q", "Router-on-a-Stick", "Standard & Extended ACL", "DHCP Snooping"],
      summary: "Designed and implemented an enterprise network architecture with multiple departmental VLANs, inter-VLAN routing, and traffic segregation.",
      description: "A comprehensive enterprise network simulation featuring segregated virtual LANs for HR, Engineering, Management, and Guest networks. Implemented Router-on-a-Stick (ROAS) using sub-interfaces with IEEE 802.1Q trunking, dedicated DHCP pools per VLAN, and strict Extended Access Control Lists (ACLs) to prevent lateral unauthorized movement across sensitive corporate departments.",
      features: [
        "Network segmentation across 4 departmental VLANs",
        "Sub-interface routing via IEEE 802.1Q encapsulation",
        "Traffic isolation with Extended Access Control Lists (ACLs)",
        "Automated IPv4 addressing via dedicated router DHCP pools",
        "Verified packet propagation and ping boundary tests"
      ],
      github: "https://github.com/gitcolon-Sabuj",
      demo: "#",
      schematic: "assets/images/vlan-topology.svg"
    },
    {
      id: "face-recognition-attendance",
      title: "Face Recognition Attendance System",
      badge: "Computer Vision & Python",
      featured: true,
      technologies: ["Python", "OpenCV", "Tkinter", "SQLite3", "Haar Cascade / Face Recog"],
      summary: "Developed a biometric attendance management system leveraging real-time computer vision, webcam feed capture, and database logging.",
      description: "An automated desktop attendance management application built with Python. Utilizes computer vision algorithms to capture, encode, and detect authorized faces from live webcam streams. Detected identities are matched against an encrypted local SQLite database, auto-logging attendance timestamps and exporting CSV attendance reports.",
      features: [
        "Real-time webcam video stream processing via OpenCV",
        "Student registration module with multi-angle photo enrollment",
        "Automated date & timestamp logging in SQLite database",
        "Interactive desktop UI engineered with Python Tkinter",
        "Daily attendance export to standard CSV spreadsheets"
      ],
      github: "https://github.com/gitcolon-Sabuj",
      demo: "#",
      schematic: "assets/images/face-pipeline.svg"
    },
    {
      id: "my-llm",
      title: "MyLLM — Personal Language Model",
      badge: "AI & Machine Learning Research",
      featured: true,
      technologies: ["Python", "PyTorch / NumPy", "Tokenization", "Transformer Architecture", "Loss Optimization"],
      summary: "An intensive learning project focused on building an autoregressive mini language model from scratch to understand foundational ML mathematics.",
      description: "A deep dive into natural language processing and deep learning fundamentals. Implemented character-level and subword tokenization, positional embeddings, multi-head self-attention mechanisms, and residual connections. Trained the model on custom text corpora to observe loss curve dynamics and generate coherent sequential output.",
      features: [
        "Custom tokenizer implementation and vocabulary encoder/decoder",
        "Self-attention mechanism and causal masking matrix",
        "Cross-entropy loss calculation and backpropagation loop",
        "Configurable temperature and top-k sampling for inference",
        "Zero third-party black-box NLP frameworks used"
      ],
      github: "https://github.com/gitcolon-Sabuj",
      demo: "#",
      schematic: "assets/images/myllm-transformer.svg"
    }
  ],

  securityLabs: [
    {
      id: "lab-vlan-segmentation",
      title: "Inter-VLAN Routing & Subnet Hardening",
      category: "Network Security",
      status: "COMPLETED",
      environment: "Cisco Packet Tracer / GNS3",
      objective: "Isolate broadcast domains, configure 802.1Q trunking, and restrict unauthorized inter-subnet traversal with ACL rulesets.",
      keyLearnings: "Subnetting calculations, router sub-interfaces, encapsulation dot1q, packet filtering policies."
    },
    {
      id: "lab-firewall-acl",
      title: "Firewall Configuration & Perimeter Filtering",
      category: "Firewall Defense",
      status: "COMPLETED",
      environment: "Cisco IOS / Linux iptables",
      objective: "Establish ingress/egress filtering rules to drop spoofed IP ranges, mitigate ICMP flood vectors, and control port access.",
      keyLearnings: "Stateful inspection concepts, directionality of ACL application (in vs out), standard vs extended syntax."
    },
    {
      id: "lab-linux-hardening",
      title: "Linux Server Hardening & User Privilege Auditing",
      category: "Linux Administration",
      status: "COMPLETED",
      environment: "Ubuntu / Debian LTS / Kali Linux",
      objective: "Harden a fresh Linux server: SSH key-only authentication, fail2ban setup, disabling root login, and strict file permissions.",
      keyLearnings: "chmod/chown octal permissions, sudoers configuration, auditd, systemd service management."
    },
    {
      id: "lab-python-scanner",
      title: "Python Port Scanner & Socket Reconnaissance",
      category: "Security Automation",
      status: "COMPLETED",
      environment: "Python 3 / Raw Sockets / Scapy",
      objective: "Write a multi-threaded socket script to identify open ports, banner grab active services, and measure latency across target IPs.",
      keyLearnings: "Socket programming, TCP SYN/ACK handshake dynamics, thread synchronization, error handling."
    },
    {
      id: "lab-owasp-testing",
      title: "Web Security: OWASP Top 10 Hands-on Testing",
      category: "Web Security",
      status: "IN_PROGRESS",
      environment: "OWASP Juice Shop / DVWA",
      objective: "Analyze common application-layer security vulnerabilities including SQL Injection, Cross-Site Scripting (XSS), and insecure direct object references.",
      keyLearnings: "HTTP request tampering, input sanitization defense, CSRF token validation, parameterized SQL queries."
    },
    {
      id: "lab-wireless-defense",
      title: "Network Packet Analysis & Protocol Inspection",
      category: "Traffic Analysis",
      status: "IN_PROGRESS",
      environment: "Wireshark / tcpdump",
      objective: "Capture live promiscuous network traffic to examine ARP requests, DNS queries, and cleartext transmission risks.",
      keyLearnings: "Pcap parsing, packet payload inspection, analyzing SSL/TLS handshakes."
    }
  ],

  certifications: [
    {
      id: "cisco-netacad",
      title: "Networking Academy Curriculum",
      issuer: "Cisco Networking Academy",
      category: "Computer Networking",
      status: "Verified Coursework",
      credentialUrl: "https://www.netacad.com/",
      description: "Hands-on mastery of IP routing, switching protocols, subnetting, network troubleshooting, and enterprise network design via Cisco Packet Tracer."
    },
    {
      id: "nptel-networking",
      title: "Computer Networks & Cyber Security",
      issuer: "NPTEL / IIT Ministry of Education",
      category: "Academic Certification",
      status: "Academic Credential",
      credentialUrl: "https://nptel.ac.in/",
      description: "Rigorous collegiate curriculum covering cryptographic primitives, network protocols, OSI model security, and data communication algorithms."
    },
    {
      id: "coursera-cybersecurity",
      title: "Cybersecurity & Linux Systems Specialization",
      issuer: "Coursera Partner Consortium",
      category: "Information Security",
      status: "Active Study / Verification",
      credentialUrl: "https://www.coursera.org/",
      description: "Comprehensive coursework exploring system defense fundamentals, Unix command line mastery, defensive architecture, and threat landscape modeling."
    }
  ],

  writeups: [
    {
      id: "writeup-vlan-routing",
      title: "Demystifying Enterprise Inter-VLAN Routing & 802.1Q Trunking",
      category: "Network Engineering",
      date: "Nov 2026",
      readTime: "6 min read",
      excerpt: "A deep dive into why single broadcast domains fail in enterprise environments, how VLAN tagging works at Layer 2, and setting up Router-on-a-Stick with Access Control Lists.",
      content: `
### Overview
In standard flat network topologies, all connected host machines occupy a single broadcast domain. A broadcast packet sent by any single host is processed by every other device on the segment. In enterprise environments, this causes network congestion, security vulnerabilities, and zero isolation between critical departments.

### The Role of 802.1Q Encapsulation
Virtual Local Area Networks (VLANs) split physical switch hardware into logical broadcast domains. When packets cross a trunk link between switches and routers, an additional 4-byte header is inserted by IEEE 802.1Q:
- **TPID (Tag Protocol Identifier):** 0x8100 indicating 802.1Q tagging.
- **TCI (Tag Control Information):** Contains Priority Code Point (PCP), Drop Eligible Indicator (DEI), and the 12-bit VLAN Identifier (VID, supporting up to 4,094 VLANs).

### Router-on-a-Stick Configuration Strategy
Instead of requiring a dedicated physical router interface for every VLAN, Router-on-a-Stick (ROAS) utilizes virtual sub-interfaces on a single physical link:
\`\`\`text
Router(config)# interface GigabitEthernet0/0.10
Router(config-subif)# encapsulation dot1Q 10
Router(config-subif)# ip address 192.168.10.1 255.255.255.0
Router(config-subif)# exit
\`\`\`

### Enforcing Security via Extended ACLs
To prevent unauthorized users from jumping between subnets, extended access control lists are configured at the routing boundary:
\`\`\`text
access-list 101 permit tcp 192.168.10.0 0.0.0.255 host 192.168.30.50 eq 443
access-list 101 deny ip 192.168.10.0 0.0.0.255 192.168.30.0 0.0.0.255
access-list 101 permit ip any any
\`\`\`
      `
    },
    {
      id: "writeup-linux-hardening",
      title: "Linux Server Hardening: Essential Defense Checklist",
      category: "Linux Administration",
      date: "Oct 2026",
      readTime: "5 min read",
      excerpt: "Step-by-step security practices for newly provisioned Linux servers: SSH key configuration, non-root user isolation, UFW firewall rules, and automated audit trails.",
      content: `
### Introduction
A default Linux installation leaves multiple vectors vulnerable to automated botnets and credential stuffing. Establishing a zero-trust baseline immediately upon provisioning is mandatory.

### 1. SSH Hardening (\`/etc/ssh/sshd_config\`)
- Disable direct root login: \`PermitRootLogin no\`
- Disable password-based authentication: \`PasswordAuthentication no\`
- Enforce public key cryptography: \`PubkeyAuthentication yes\`
- Limit authentication attempts: \`MaxAuthTries 3\`

### 2. Uncomplicated Firewall (UFW) Configuration
Default deny all ingress traffic, permit only designated ports:
\`\`\`bash
ufw default deny incoming
ufw default allow outgoing
ufw allow 22/tcp
ufw enable
\`\`\`

### 3. Automated Brute-Force Mitigation
Install and configure \`fail2ban\` to monitor authentication log files (\`/var/log/auth.log\`) and dynamically apply iptables drop rules for repeated failed authentication attempts.
      `
    },
    {
      id: "writeup-myllm-mechanics",
      title: "Building MyLLM: Inside Tokenization, Embeddings & Attention",
      category: "AI & Security Research",
      date: "Sep 2026",
      readTime: "8 min read",
      excerpt: "What happens under the hood when constructing an autoregressive transformer model from scratch? Deconstructing matrix dimensions, causal masking, and loss calculation.",
      content: `
### Why Build from Scratch?
Modern frameworks often obscure how neural networks process textual tokens. Building a minimal transformer from first principles illuminates how mathematical representations emerge from discrete text.

### The Self-Attention Matrix
The core of modern LLMs is the Scaled Dot-Product Attention:
\`\`\`text
Attention(Q, K, V) = softmax( (Q * K^T) / sqrt(d_k) ) * V
\`\`\`
In autoregressive generation, we must enforce causality by masking upper-triangular future tokens with negative infinity prior to softmax, ensuring the model never cheats by seeing tokens ahead of the current timestep.
      `
    }
  ],

  terminal: {
    hostname: "cyberspace",
    user: "sabuj",
    motd: [
      "============================================================",
      " SABUJ // CYBERSPACE OS v3.8.2 (x86_64-cyberspace-gnu)",
      " System Status: [SYS_ONLINE] | Encryption: [AES-256-GCM]",
      " Type 'help' to inspect available system commands.",
      "============================================================"
    ],
    neofetch: {
      os: "CyberSpace GNU/Linux 6.1.0-hardened",
      host: "Sabuj-Workstation (The Neotia Univ)",
      kernel: "Linux 6.1-cyberspace-arm64",
      uptime: "Continuous",
      shell: "bash 5.2.15 (interactive-portfolio)",
      terminal: "CyberTerm-v2.4",
      cpu: "Secured Neural Architecture",
      memory: "2048MiB / 8192MiB (Allocated)",
      specialization: "Cyber Security & Network Defense",
      degree: "B.Tech CSE (Cyber Security) - 2026",
      cgpa: "7.9 / 10.0"
    }
  }
};

// Freeze configuration to prevent accidental runtime tampering
Object.freeze(CONFIG);
