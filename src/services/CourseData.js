const INITIAL_COURSES = [
  {
    id: 1,
    title: 'Introduction to Cyber Security',
    description: 'Learn the fundamental concepts of cyber security, threat landscapes, and defensive strategies.',
    thumbnail: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1000&auto=format&fit=crop', // Hacker terminal
    dangerImage: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1000&auto=format&fit=crop', // Matrix code
    detailedExplanation: 'This module covers the core principles of Confidentiality, Integrity, and Availability (CIA triad). You will analyze real-world breaches and understand basic risk management.',
    lessons: [
      { id: 101, title: 'What is Cyber Security?', videoUrl: '' },
      { id: 102, title: 'The CIA Triad', videoUrl: '' }
    ]
  },
  {
    id: 2,
    title: 'Ethical Hacking Basics',
    description: 'Understand the mindset of an attacker to better defend your systems. Kali Linux introduction.',
    thumbnail: 'https://images.unsplash.com/photo-1510511459019-5efa32040011?q=80&w=1000&auto=format&fit=crop', // Anonymous/Hacker
    dangerImage: 'https://images.unsplash.com/photo-1618044733300-9472054094ee?q=80&w=1000&auto=format&fit=crop', // Red server
    detailedExplanation: 'Dive into the 5 phases of ethical hacking: Reconnaissance, Scanning, Gaining Access, Maintaining Access, and Clearing Tracks.',
    lessons: [
      { id: 201, title: 'Hacking Methodology', videoUrl: '' },
      { id: 202, title: 'Kali Linux Setup', videoUrl: '' }
    ]
  },
  {
    id: 3,
    title: 'Networking Fundamentals',
    description: 'Deep dive into TCP/IP, OSI model, subnetting, and network protocols used by hackers.',
    thumbnail: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?q=80&w=1000&auto=format&fit=crop', // Network cables/routers
    dangerImage: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=1000&auto=format&fit=crop', // Data breach/servers
    detailedExplanation: 'Master Wireshark, understand packet crafting, and map network topologies to identify vulnerabilities.',
    lessons: [
      { id: 301, title: 'OSI Model Deep Dive', videoUrl: '' },
      { id: 302, title: 'Wireshark Basics', videoUrl: '' }
    ]
  },
  {
    id: 4,
    title: 'Web Application Security',
    description: 'Exploit and defend against common web vulnerabilities like SQLi, XSS, and CSRF.',
    thumbnail: 'https://images.unsplash.com/photo-1562813733-b31f71025d54?q=80&w=1000&auto=format&fit=crop', // Coding/Web
    dangerImage: 'https://images.unsplash.com/photo-1563206767-5b18f218e8de?q=80&w=1000&auto=format&fit=crop', // Code exploit
    detailedExplanation: 'Focus on the OWASP Top 10. Learn to manually inject SQL commands and create payload scripts for cross-site scripting.',
    lessons: [
      { id: 401, title: 'SQL Injection', videoUrl: '' },
      { id: 402, title: 'XSS (Cross-Site Scripting)', videoUrl: '' },
      { id: 403, title: 'CSRF (Cross-Site Request Forgery)', videoUrl: '' }
    ]
  },
  {
    id: 5,
    title: 'Penetration Testing',
    description: 'Learn professional penetration testing methodologies and reporting.',
    thumbnail: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?q=80&w=1000&auto=format&fit=crop', // Security shield/software
    dangerImage: 'https://images.unsplash.com/photo-1614064641913-6b74bb9f39d2?q=80&w=1000&auto=format&fit=crop', // Red danger
    detailedExplanation: 'From vulnerability scanning to exploitation frameworks like Metasploit. End-to-end simulated attacks.',
    lessons: [
      { id: 501, title: 'Using Metasploit', videoUrl: '' },
      { id: 502, title: 'Writing the Pen-test Report', videoUrl: '' }
    ]
  }
];

export const courseService = {
  getCourses: () => {
    const rawData = localStorage.getItem('cyber_courses');
    if (!rawData) {
      localStorage.setItem('cyber_courses', JSON.stringify(INITIAL_COURSES));
      return INITIAL_COURSES;
    }
    return JSON.parse(rawData);
  },

  saveCourses: (courses) => {
    localStorage.setItem('cyber_courses', JSON.stringify(courses));
  },

  addCourse: (course) => {
    const courses = courseService.getCourses();
    const newCourse = { ...course, id: Date.now(), lessons: course.lessons || [] };
    courses.push(newCourse);
    courseService.saveCourses(courses);
    return newCourse;
  },

  updateCourse: (updatedCourse) => {
    let courses = courseService.getCourses();
    courses = courses.map(c => c.id === updatedCourse.id ? updatedCourse : c);
    courseService.saveCourses(courses);
  },

  deleteCourse: (courseId) => {
    let courses = courseService.getCourses();
    courses = courses.filter(c => c.id !== courseId);
    courseService.saveCourses(courses);
  }
};
