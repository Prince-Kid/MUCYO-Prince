import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Terminal, 
  Github, 
  Mail, 
  ExternalLink, 
  Linkedin, 
  MapPin, 
  Calendar, 
  Clock, 
  Cpu, 
  Battery,
  Award,
  GraduationCap,
  Briefcase,
  Code,
  Globe
} from 'lucide-react';

interface CommandHistory {
  id: number;
  command: string;
  output: React.ReactNode;
  timestamp: Date;
  isTyping?: boolean;
}

interface Command {
  name: string;
  description: string;
  execute: () => React.ReactNode;
}

interface SystemStatus {
  cpuUsage: number;
  batteryLevel: number;
  currentTime: Date;
}

const App: React.FC = () => {
  const [history, setHistory] = useState<CommandHistory[]>([]);
  const [currentInput, setCurrentInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [commandIndex, setCommandIndex] = useState(-1);
  const [systemStatus, setSystemStatus] = useState<SystemStatus>({
    cpuUsage: 0,
    batteryLevel: 85,
    currentTime: new Date()
  });
  const [cursorVisible, setCursorVisible] = useState(true);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Utility function for date formatting
  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    };
    return date.toLocaleDateString('en-US', options);
  };

  const formatTime = (date: Date) => {
    return date.toTimeString().slice(0, 8);
  };

  const formatShortDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'short', day: '2-digit' });
  };

  const formatTimestamp = (date: Date) => {
    return date.toTimeString().slice(0, 8);
  };

  // Daily inspirational quotes
  const dailyQuotes = [
    "The only way to do great work is to love what you do. - Steve Jobs",
    "Innovation distinguishes between a leader and a follower. - Steve Jobs",
    "Code is like humor. When you have to explain it, it's bad. - Cory House",
    "First, solve the problem. Then, write the code. - John Johnson",
    "Experience is the name everyone gives to their mistakes. - Oscar Wilde",
    "In order to be irreplaceable, one must always be different. - Coco Chanel",
    "The best time to plant a tree was 20 years ago. The second best time is now. - Chinese Proverb"
  ];

  // Daily Bible verses
  const bibleVerses = [
    "I can do all things through Christ who strengthens me. - Philippians 4:13",
    "For I know the plans I have for you, declares the Lord, plans to prosper you and not to harm you. - Jeremiah 29:11",
    "Trust in the Lord with all your heart and lean not on your own understanding. - Proverbs 3:5",
    "Be strong and courageous. Do not be afraid; do not be discouraged. - Joshua 1:9",
    "Commit to the Lord whatever you do, and he will establish your plans. - Proverbs 16:3",
    "In all your ways submit to him, and he will make your paths straight. - Proverbs 3:6",
    "The Lord your God is with you, the Mighty Warrior who saves. - Zephaniah 3:17"
  ];

  // Get daily content based on day of year
  const getDailyContent = () => {
    const dayOfYear = Math.floor((new Date().getTime() - new Date(new Date().getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
    return {
      quote: dailyQuotes[dayOfYear % dailyQuotes.length],
      verse: bibleVerses[dayOfYear % bibleVerses.length]
    };
  };

  const commands: Record<string, Command> = {
    help: {
      name: 'help',
      description: 'Show available commands',
      execute: () => (
        <div className="space-y-3 animate-fade-in">
          <div className="text-green-400 font-bold text-lg flex items-center gap-2">
            <Terminal className="w-5 h-5" />
            Available Commands
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            {Object.entries(commands).map(([key, cmd]) => (
              <div key={key} className="flex hover:bg-gray-800 p-2 rounded transition-colors">
                <span className="text-cyan-400 min-w-[120px] font-mono">{cmd.name}</span>
                <span className="text-gray-300">{cmd.description}</span>
              </div>
            ))}
          </div>
          <div className="text-gray-400 text-sm mt-4 border-t border-gray-700 pt-3">
            💡 <strong>Pro Tips:</strong> Use arrow keys for command history • Tab for autocompletion • Type 'easter' for a surprise!
          </div>
        </div>
      )
    },
    about: {
      name: 'about',
      description: 'Learn about MUCYO Prince',
      execute: () => (
        <div className="space-y-4 animate-fade-in">
          <div className="text-green-400 font-bold text-xl flex items-center gap-2">
            <Code className="w-6 h-6" />
            About MUCYO Prince
          </div>
          <div className="bg-gray-800 rounded-lg p-4 border-l-4 border-cyan-400">
            <div className="text-gray-300 leading-relaxed space-y-3">
              <p className="text-lg font-semibold text-cyan-400">
                👨‍💻 Passionate Software Developer
              </p>
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="w-4 h-4 text-red-400" />
                <span>Based in Kigali, Rwanda</span>
              </div>
              <p className="mb-3">
                🎓 <strong>Minister of ICT</strong> at Kigali Independent University Gisenyi Campus
              </p>
              <p className="mb-3">
                Specialized in <span className="text-cyan-400 font-mono">PERN & MERN</span> stacks with a strong foundation 
                in full-stack development. I'm passionate about solving real-world problems with innovative tech solutions.
              </p>
              <p className="mb-3">
                When I'm not coding, you'll find me leading ICT initiatives at university, 
                contributing to open-source projects, or exploring the latest web technologies.
              </p>
              <p className="text-green-400">
                🚀 Always ready to tackle challenging projects and create meaningful digital experiences!
              </p>
            </div>
          </div>
        </div>
      )
    },
    education: {
      name: 'education',
      description: 'View educational background',
      execute: () => (
        <div className="space-y-4 animate-fade-in">
          <div className="text-green-400 font-bold text-lg flex items-center gap-2">
            <GraduationCap className="w-5 h-5" />
            Educational Background
          </div>
          <div className="space-y-4">
            <div className="border-l-4 border-blue-400 pl-4 bg-gray-800 p-4 rounded-r-lg">
              <div className="text-blue-400 font-semibold">🧑‍🎓 Bachelor of Computer Science</div>
              <div className="text-gray-400 text-sm">Kigali Independent University – Gisenyi Campus</div>
              <div className="text-cyan-400 text-sm">2022 – 2024</div>
              <div className="text-gray-300 text-sm mt-2">
                • Specialized in Software Engineering and System Development
                <br />
                • Leadership role as Minister of ICT
                <br />
                • Focus on practical problem-solving with technology
              </div>
            </div>
            <div className="border-l-4 border-green-400 pl-4 bg-gray-800 p-4 rounded-r-lg">
              <div className="text-green-400 font-semibold">🎓 A2 in MPG</div>
              <div className="text-gray-400 text-sm">Mathematics, Physics, Geography</div>
              <div className="text-cyan-400 text-sm">Collège De La Paix • 2018 – 2021</div>
              <div className="text-gray-300 text-sm mt-2">
                • Strong foundation in analytical and problem-solving skills
                <br />
                • Mathematical and logical thinking development
              </div>
            </div>
          </div>
        </div>
      )
    },
    experience: {
      name: 'experience',
      description: 'View work experience',
      execute: () => (
        <div className="space-y-4 animate-fade-in">
          <div className="text-green-400 font-bold text-lg flex items-center gap-2">
            <Briefcase className="w-5 h-5" />
            Professional Experience
          </div>
          <div className="space-y-4">
            <div className="border-l-4 border-cyan-400 pl-4 bg-gray-800 p-4 rounded-r-lg">
              <div className="text-cyan-400 font-semibold">Software Developer</div>
              <div className="text-gray-400 text-sm">GOPE Ltd • Dec 2024 - Present</div>
              <div className="text-gray-300 text-sm mt-2">
                • Developing enterprise-level software solutions
                <br />
                • Working with modern tech stacks and agile methodologies
                <br />
                • Contributing to system architecture and design decisions
              </div>
            </div>
            <div className="border-l-4 border-purple-400 pl-4 bg-gray-800 p-4 rounded-r-lg">
              <div className="text-purple-400 font-semibold">Trainee Full Stack Developer</div>
              <div className="text-gray-400 text-sm">Andela • Feb 2024 - Dec 2024</div>
              <div className="text-gray-300 text-sm mt-2">
                • Intensive training in full-stack development
                <br />
                • Built scalable web applications using PERN/MERN stacks
                <br />
                • Collaborative development and code review practices
              </div>
            </div>
            <div className="border-l-4 border-green-400 pl-4 bg-gray-800 p-4 rounded-r-lg">
              <div className="text-green-400 font-semibold">Software Development Trainee</div>
              <div className="text-gray-400 text-sm">Hanga Hub, Rubavu • Jul 2024 - Dec 2024</div>
              <div className="text-gray-300 text-sm mt-2">
                • Hands-on experience with real-world projects
                <br />
                • Mentorship in software development best practices
                <br />
                • Community-driven tech innovation initiatives
              </div>
            </div>
          </div>
        </div>
      )
    },
    leadership: {
      name: 'leadership',
      description: 'View leadership roles',
      execute: () => (
        <div className="space-y-4 animate-fade-in">
          <div className="text-green-400 font-bold text-lg flex items-center gap-2">
            <Award className="w-5 h-5" />
            Leadership & Recognition
          </div>
          <div className="space-y-4">
            <div className="border-l-4 border-yellow-400 pl-4 bg-gray-800 p-4 rounded-r-lg">
              <div className="text-yellow-400 font-semibold">👨‍💼 Minister of ICT</div>
              <div className="text-gray-400 text-sm">Kigali Independent University • Aug 2023 - Aug 2024</div>
              <div className="text-gray-300 text-sm mt-2">
                • Led ICT initiatives and digital transformation projects
                <br />
                • Organized tech workshops and coding bootcamps
                <br />
                • Bridged the gap between students and technology industry
                <br />
                • Mentored fellow students in programming and tech careers
              </div>
            </div>
            <div className="border-l-4 border-gold-400 pl-4 bg-gray-800 p-4 rounded-r-lg">
              <div className="text-yellow-400 font-semibold">🏆 Excellence in ICT Leadership</div>
              <div className="text-gray-400 text-sm">Kigali Independent University</div>
              <div className="text-gray-300 text-sm mt-2">
                • Recognized for outstanding contribution to ICT development
                <br />
                • Leadership in student technology initiatives
              </div>
            </div>
          </div>
        </div>
      )
    },
    skills: {
      name: 'skills',
      description: 'View technical skills',
      execute: () => (
        <div className="space-y-4 animate-fade-in">
          <div className="text-green-400 font-bold text-lg flex items-center gap-2">
            <Code className="w-5 h-5" />
            Technical Skills
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-800 p-4 rounded-lg">
              <div className="text-cyan-400 font-semibold mb-3 flex items-center gap-2">
                🎨 Frontend Development
              </div>
              <div className="text-gray-300 text-sm space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <span>React.js / Next.js</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                  <span>JavaScript / TypeScript</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-pink-400 rounded-full"></div>
                  <span>HTML5 / CSS3</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                  <span>Redux / Context API</span>
                </div>
              </div>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg">
              <div className="text-cyan-400 font-semibold mb-3 flex items-center gap-2">
                ⚙️ Backend Development
              </div>
              <div className="text-gray-300 text-sm space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span>Node.js / Express.js</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-indigo-400 rounded-full"></div>
                  <span>PHP</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                  <span>Socket.io / Pusher</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                  <span>JWT Authentication</span>
                </div>
              </div>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg">
              <div className="text-cyan-400 font-semibold mb-3 flex items-center gap-2">
                🗄️ Database & Storage
              </div>
              <div className="text-gray-300 text-sm space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <span>PostgreSQL</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                  <span>MySQL</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span>MongoDB</span>
                </div>
              </div>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg">
              <div className="text-cyan-400 font-semibold mb-3 flex items-center gap-2">
                🛠️ Tools & Technologies
              </div>
              <div className="text-gray-300 text-sm space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                  <span>Git / GitHub</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <span>Webpack / Vite</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span>Stripe Payment Integration</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                  <span>AnyDesk / TeamViewer</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    projects: {
      name: 'projects',
      description: 'View featured projects',
      execute: () => (
        <div className="space-y-4 animate-fade-in">
          <div className="text-green-400 font-bold text-lg flex items-center gap-2">
            <Globe className="w-5 h-5" />
            Featured Projects
          </div>
          <div className="space-y-4">
            <div className="border border-gray-700 rounded-lg p-4 bg-gray-800 hover:bg-gray-750 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <div className="text-cyan-400 font-semibold">🛒 Multi-vendor E-commerce Platform</div>
                <ExternalLink className="w-4 h-4 text-gray-400 hover:text-cyan-400 transition-colors" />
              </div>
              <div className="text-gray-300 text-sm mb-3">
                Full-featured e-commerce platform with integrated chatbot, payment processing, and vendor management
              </div>
              <div className="flex flex-wrap gap-2 mb-2">
                <span className="bg-blue-900 text-blue-300 px-2 py-1 rounded text-xs">React</span>
                <span className="bg-green-900 text-green-300 px-2 py-1 rounded text-xs">Node.js</span>
                <span className="bg-purple-900 text-purple-300 px-2 py-1 rounded text-xs">PostgreSQL</span>
                <span className="bg-orange-900 text-orange-300 px-2 py-1 rounded text-xs">Stripe</span>
              </div>
              <div className="text-gray-400 text-xs">🤖 Features AI-powered chatbot for customer support</div>
            </div>
            <div className="border border-gray-700 rounded-lg p-4 bg-gray-800 hover:bg-gray-750 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <div className="text-cyan-400 font-semibold">🌾 Agro Processing Management System</div>
                <ExternalLink className="w-4 h-4 text-gray-400 hover:text-cyan-400 transition-colors" />
              </div>
              <div className="text-gray-300 text-sm mb-3">
                Comprehensive system for managing agricultural processing operations and supply chain
              </div>
              <div className="flex flex-wrap gap-2 mb-2">
                <span className="bg-indigo-900 text-indigo-300 px-2 py-1 rounded text-xs">PHP</span>
                <span className="bg-orange-900 text-orange-300 px-2 py-1 rounded text-xs">MySQL</span>
                <span className="bg-blue-900 text-blue-300 px-2 py-1 rounded text-xs">Bootstrap</span>
              </div>
              <div className="text-gray-400 text-xs">📊 Inventory tracking and production analytics</div>
            </div>
            <div className="border border-gray-700 rounded-lg p-4 bg-gray-800 hover:bg-gray-750 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <div className="text-cyan-400 font-semibold">🥩 Rugali Meat Processing System</div>
                <ExternalLink className="w-4 h-4 text-gray-400 hover:text-cyan-400 transition-colors" />
              </div>
              <div className="text-gray-300 text-sm mb-3">
                Specialized meat processing facility management with quality control and traceability
              </div>
              <div className="flex flex-wrap gap-2 mb-2">
                <span className="bg-red-900 text-red-300 px-2 py-1 rounded text-xs">React</span>
                <span className="bg-green-900 text-green-300 px-2 py-1 rounded text-xs">Express</span>
                <span className="bg-blue-900 text-blue-300 px-2 py-1 rounded text-xs">PostgreSQL</span>
              </div>
              <div className="text-gray-400 text-xs">🔍 Quality assurance and batch tracking</div>
            </div>
            <div className="border border-gray-700 rounded-lg p-4 bg-gray-800 hover:bg-gray-750 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <div className="text-cyan-400 font-semibold">🥛 NYANZA Milk Industry Management</div>
                <ExternalLink className="w-4 h-4 text-gray-400 hover:text-cyan-400 transition-colors" />
              </div>
              <div className="text-gray-300 text-sm mb-3">
                Complete dairy industry management solution with production tracking and distribution
              </div>
              <div className="flex flex-wrap gap-2 mb-2">
                <span className="bg-yellow-900 text-yellow-300 px-2 py-1 rounded text-xs">PHP</span>
                <span className="bg-orange-900 text-orange-300 px-2 py-1 rounded text-xs">MySQL</span>
                <span className="bg-purple-900 text-purple-300 px-2 py-1 rounded text-xs">Chart.js</span>
              </div>
              <div className="text-gray-400 text-xs">📈 Production analytics and sales reporting</div>
            </div>
          </div>
        </div>
      )
    },
    contact: {
      name: 'contact',
      description: 'Get in touch with MUCYO',
      execute: () => (
        <div className="space-y-4 animate-fade-in">
          <div className="text-green-400 font-bold text-lg flex items-center gap-2">
            <Mail className="w-5 h-5" />
            Contact Information
          </div>
          <div className="bg-gray-800 rounded-lg p-4 space-y-4">
            <div className="flex items-center space-x-3 hover:bg-gray-700 p-2 rounded transition-colors">
              <Mail className="w-5 h-5 text-cyan-400" />
              <span className="text-gray-300">mucyoprinc12@gmail.com</span>
              <button className="text-cyan-400 text-xs hover:text-cyan-300">Copy</button>
            </div>
            <div className="flex items-center space-x-3 hover:bg-gray-700 p-2 rounded transition-colors">
              <Linkedin className="w-5 h-5 text-blue-400" />
              <span className="text-gray-300">LinkedIn Profile</span>
              <ExternalLink className="w-4 h-4 text-gray-400" />
            </div>
            <div className="flex items-center space-x-3 hover:bg-gray-700 p-2 rounded transition-colors">
              <Github className="w-5 h-5 text-gray-400" />
              <span className="text-gray-300">GitHub Profile</span>
              <ExternalLink className="w-4 h-4 text-gray-400" />
            </div>
            <div className="flex items-center space-x-3 hover:bg-gray-700 p-2 rounded transition-colors">
              <MapPin className="w-5 h-5 text-red-400" />
              <span className="text-gray-300">Kigali, Rwanda</span>
            </div>
          </div>
          <div className="text-gray-400 text-sm border-t border-gray-700 pt-3">
            🚀 <strong>Ready for new opportunities!</strong> Feel free to reach out for collaboration, 
            project discussions, or just to connect!
          </div>
          <div className="text-cyan-400 text-sm">
            💬 <strong>Languages:</strong> English, Kinyarwanda
          </div>
        </div>
      )
    },
    easter: {
      name: 'easter',
      description: 'Hidden surprise command',
      execute: () => (
        <div className="space-y-4 animate-bounce">
          <div className="text-center">
            <div className="text-4xl mb-4">🎉</div>
            <div className="text-green-400 font-bold text-lg">Easter Egg Found!</div>
            <div className="text-cyan-400 mt-2">
              "Code is poetry written in logic" - MUCYO Prince
            </div>
            <div className="text-gray-300 text-sm mt-4">
              🎮 You found the secret command! Here's a fun fact: This terminal was built with ❤️ 
              using React, TypeScript, and lots of coffee ☕
            </div>
            <div className="text-yellow-400 text-sm mt-2">
              ⭐ Keep exploring and never stop coding!
            </div>
          </div>
        </div>
      )
    },
    clear: {
      name: 'clear',
      description: 'Clear the terminal',
      execute: () => null
    },
    date: {
      name: 'date',
      description: 'Show current date and time',
      execute: () => (
        <div className="text-cyan-400 font-mono">
          {formatDate(new Date())}
        </div>
      )
    },
    whoami: {
      name: 'whoami',
      description: 'Display current user info',
      execute: () => (
        <div className="text-green-400 font-mono">
          mucyo@portfolio-terminal:~$ MUCYO Prince - Software Developer
        </div>
      )
    },
    quote: {
      name: 'quote',
      description: 'Get daily inspirational quote',
      execute: () => {
        const dailyContent = getDailyContent();
        return (
          <div className="space-y-3 animate-fade-in">
            <div className="text-yellow-400 font-bold text-lg flex items-center gap-2">
              ✨ Daily Inspiration
            </div>
            <div className="bg-gray-800 rounded-lg p-4 border-l-4 border-yellow-400">
              <div className="text-gray-300 italic text-lg leading-relaxed">
                "{dailyContent.quote}"
              </div>
            </div>
            <div className="text-gray-400 text-sm">
              💡 A fresh quote every day to fuel your coding journey!
            </div>
          </div>
        );
      }
    },
    verse: {
      name: 'verse',
      description: 'Get daily Bible verse',
      execute: () => {
        const dailyContent = getDailyContent();
        return (
          <div className="space-y-3 animate-fade-in">
            <div className="text-purple-400 font-bold text-lg flex items-center gap-2">
              📖 Daily Bible Verse
            </div>
            <div className="bg-gray-800 rounded-lg p-4 border-l-4 border-purple-400">
              <div className="text-gray-300 italic text-lg leading-relaxed">
                "{dailyContent.verse}"
              </div>
            </div>
            <div className="text-gray-400 text-sm">
              🙏 Daily spiritual encouragement for the journey ahead.
            </div>
          </div>
        );
      }
    },
    achievements: {
      name: 'achievements',
      description: 'View accomplishments and metrics',
      execute: () => (
        <div className="space-y-4 animate-fade-in">
          <div className="text-green-400 font-bold text-lg flex items-center gap-2">
            🏆 Key Achievements & Metrics
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-800 rounded-lg p-4 border border-green-500">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400">15+</div>
                <div className="text-gray-300 text-sm">Projects Completed</div>
              </div>
            </div>
            <div className="bg-gray-800 rounded-lg p-4 border border-blue-500">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400">2+</div>
                <div className="text-gray-300 text-sm">Years Experience</div>
              </div>
            </div>
            <div className="bg-gray-800 rounded-lg p-4 border border-purple-500">
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-400">100%</div>
                <div className="text-gray-300 text-sm">Client Satisfaction</div>
              </div>
            </div>
            <div className="bg-gray-800 rounded-lg p-4 border border-yellow-500">
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-400">50K+</div>
                <div className="text-gray-300 text-sm">Lines of Code</div>
              </div>
            </div>
          </div>
          <div className="space-y-3 mt-6">
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="text-cyan-400 font-semibold mb-2">🎯 Notable Achievements</div>
              <div className="text-gray-300 text-sm space-y-2">
                <div>• 🏆 Excellence in ICT Leadership Award - KIU University</div>
                <div>• 👨‍💼 Elected Minister of ICT - Student Government</div>
                <div>• 🚀 Successfully deployed 4 major production applications</div>
                <div>• 👥 Mentored 10+ junior developers in coding bootcamps</div>
                <div>• 📈 Improved system performance by 40% in previous role</div>
                <div>• 🌟 Maintained 99.9% uptime for critical applications</div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    testimonials: {
      name: 'testimonials',
      description: 'Read client testimonials',
      execute: () => (
        <div className="space-y-4 animate-fade-in">
          <div className="text-green-400 font-bold text-lg flex items-center gap-2">
            💬 Client Testimonials
          </div>
          <div className="space-y-4">
            <div className="bg-gray-800 rounded-lg p-4 border-l-4 border-blue-400">
              <div className="text-gray-300 italic mb-3">
                "MUCYO's technical expertise and leadership skills are exceptional. He delivered our e-commerce platform ahead of schedule with outstanding quality."
              </div>
              <div className="text-blue-400 text-sm font-semibold">
                - Sarah Johnson, CEO at TechStart Rwanda
              </div>
            </div>
            <div className="bg-gray-800 rounded-lg p-4 border-l-4 border-green-400">
              <div className="text-gray-300 italic mb-3">
                "Working with MUCYO was a game-changer for our agricultural management system. His attention to detail and problem-solving abilities are remarkable."
              </div>
              <div className="text-green-400 text-sm font-semibold">
                - David Mukamana, Operations Manager at Agro Solutions
              </div>
            </div>
            <div className="bg-gray-800 rounded-lg p-4 border-l-4 border-purple-400">
              <div className="text-gray-300 italic mb-3">
                "MUCYO's leadership as Minister of ICT transformed our university's tech landscape. He's a natural leader and brilliant developer."
              </div>
              <div className="text-purple-400 text-sm font-semibold">
                - Prof. Emmanuel Uwimana, KIU University
              </div>
            </div>
          </div>
          <div className="text-gray-400 text-sm border-t border-gray-700 pt-3">
            💼 Want to add your testimonial? Let's work together!
          </div>
        </div>
      )
    },
    availability: {
      name: 'availability',
      description: 'Check current availability status',
      execute: () => (
        <div className="space-y-4 animate-fade-in">
          <div className="text-green-400 font-bold text-lg flex items-center gap-2">
            📅 Availability Status
          </div>
          <div className="bg-gray-800 rounded-lg p-4">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-green-400 font-semibold">AVAILABLE FOR NEW OPPORTUNITIES</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <div className="text-cyan-400 font-semibold">📋 Current Status:</div>
                <div className="text-gray-300">• Open to full-time positions</div>
                <div className="text-gray-300">• Available for freelance projects</div>
                <div className="text-gray-300">• Interested in remote work</div>
                <div className="text-gray-300">• Open to relocation opportunities</div>
              </div>
              <div className="space-y-2">
                <div className="text-cyan-400 font-semibold">⏰ Response Time:</div>
                <div className="text-gray-300">• Email: Within 4 hours</div>
                <div className="text-gray-300">• LinkedIn: Within 2 hours</div>
                <div className="text-gray-300">• Phone: Same day</div>
                <div className="text-gray-300">• Video calls: Next business day</div>
              </div>
            </div>
            <div className="mt-4 p-3 bg-gray-700 rounded">
              <div className="text-yellow-400 font-semibold text-sm">💡 Ideal Opportunities:</div>
              <div className="text-gray-300 text-sm mt-1">
                Full-stack developer roles, Tech lead positions, Startup environments, 
                International companies with remote work culture
              </div>
            </div>
          </div>
        </div>
      )
    },
    productivity: {
      name: 'productivity',
      description: 'View daily productivity stats',
      execute: () => {
        const today = new Date();
        const currentHour = today.getHours();
        const isWorkingHour = currentHour >= 8 && currentHour <= 18;
        
        return (
          <div className="space-y-4 animate-fade-in">
            <div className="text-green-400 font-bold text-lg flex items-center gap-2">
              📊 Today's Productivity Dashboard
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="bg-gray-800 rounded-lg p-3 text-center border border-blue-500">
                <div className="text-blue-400 text-xl font-bold">8.5h</div>
                <div className="text-gray-300 text-xs">Coding Time</div>
              </div>
              <div className="bg-gray-800 rounded-lg p-3 text-center border border-green-500">
                <div className="text-green-400 text-xl font-bold">15</div>
                <div className="text-gray-300 text-xs">Commits Today</div>
              </div>
              <div className="bg-gray-800 rounded-lg p-3 text-center border border-purple-500">
                <div className="text-purple-400 text-xl font-bold">3</div>
                <div className="text-gray-300 text-xs">Features Built</div>
              </div>
              <div className="bg-gray-800 rounded-lg p-3 text-center border border-yellow-500">
                <div className="text-yellow-400 text-xl font-bold">95%</div>
                <div className="text-gray-300 text-xs">Focus Score</div>
              </div>
            </div>
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="text-cyan-400 font-semibold">⚡ Current Status</div>
                <div className={`px-2 py-1 rounded text-xs ${isWorkingHour ? 'bg-green-900 text-green-300' : 'bg-gray-700 text-gray-300'}`}>
                  {isWorkingHour ? '🟢 Active' : '🔴 Offline'}
                </div>
              </div>
              <div className="text-gray-300 text-sm">
                {isWorkingHour 
                  ? "Currently in peak productivity hours. Ready to tackle complex challenges!"
                  : "Outside working hours. Will respond to messages first thing tomorrow morning."
                }
              </div>
            </div>
            <div className="text-gray-400 text-sm">
              📈 Productivity tracking helps optimize performance and maintain work-life balance.
            </div>
          </div>
        );
      }
    },
    certifications: {
      name: 'certifications',
      description: 'View professional certifications',
      execute: () => (
        <div className="space-y-4 animate-fade-in">
          <div className="text-green-400 font-bold text-lg flex items-center gap-2">
            🎓 Professional Certifications & Learning
          </div>
          <div className="space-y-4">
            <div className="bg-gray-800 rounded-lg p-4 border-l-4 border-blue-400">
              <div className="text-blue-400 font-semibold">📜 Completed Certifications</div>
              <div className="text-gray-300 text-sm mt-2 space-y-1">
                <div>• Full Stack Web Development - Andela (2024)</div>
                <div>• JavaScript Algorithms & Data Structures - freeCodeCamp</div>
                <div>• Responsive Web Design - freeCodeCamp</div>
                <div>• Git & GitHub Mastery - Practical Training</div>
              </div>
            </div>
            <div className="bg-gray-800 rounded-lg p-4 border-l-4 border-yellow-400">
              <div className="text-yellow-400 font-semibold">📚 Currently Pursuing</div>
              <div className="text-gray-300 text-sm mt-2 space-y-1">
                <div>• AWS Cloud Practitioner Certification</div>
                <div>• Advanced React Patterns & Performance</div>
                <div>• System Design for Scalable Applications</div>
                <div>• DevOps Fundamentals with Docker & K8s</div>
              </div>
            </div>
            <div className="bg-gray-800 rounded-lg p-4 border-l-4 border-green-400">
              <div className="text-green-400 font-semibold">🎯 Learning Goals 2025</div>
              <div className="text-gray-300 text-sm mt-2 space-y-1">
                <div>• Master Cloud Architecture (AWS/Azure)</div>
                <div>• Advanced TypeScript & Design Patterns</div>
                <div>• Mobile Development with React Native</div>
                <div>• AI/ML Integration in Web Applications</div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    tools: {
      name: 'tools',
      description: 'Development tools and setup',
      execute: () => (
        <div className="space-y-4 animate-fade-in">
          <div className="text-green-400 font-bold text-lg flex items-center gap-2">
            🛠️ Development Environment & Tools
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="text-cyan-400 font-semibold mb-3">💻 Primary Setup</div>
              <div className="text-gray-300 text-sm space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <span>VS Code with custom extensions</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span>Windows 11 Development Machine</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                  <span>Git Bash + PowerShell</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                  <span>Dual Monitor Setup</span>
                </div>
              </div>
            </div>
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="text-cyan-400 font-semibold mb-3">⚡ Productivity Tools</div>
              <div className="text-gray-300 text-sm space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                  <span>Notion for project management</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                  <span>Figma for UI/UX design</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-indigo-400 rounded-full"></div>
                  <span>Postman for API testing</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-pink-400 rounded-full"></div>
                  <span>Chrome DevTools expert</span>
                </div>
              </div>
            </div>
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="text-cyan-400 font-semibold mb-3">☁️ Cloud & DevOps</div>
              <div className="text-gray-300 text-sm space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <span>Vercel for frontend deployment</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span>Heroku for backend hosting</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                  <span>GitHub Actions for CI/CD</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                  <span>Docker for containerization</span>
                </div>
              </div>
            </div>
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="text-cyan-400 font-semibold mb-3">🔒 Security & Quality</div>
              <div className="text-gray-300 text-sm space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                  <span>ESLint + Prettier for code quality</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                  <span>Jest for unit testing</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span>Security best practices</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <span>Code review processes</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    resume: {
      name: 'resume',
      description: 'Download/view resume',
      execute: () => (
        <div className="space-y-4 animate-fade-in">
          <div className="text-green-400 font-bold text-lg flex items-center gap-2">
            📄 Resume & Portfolio Downloads
          </div>
          <div className="bg-gray-800 rounded-lg p-4 space-y-4">
            <div className="text-cyan-400 font-semibold">📋 Available Formats:</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="bg-gray-700 rounded-lg p-3 hover:bg-gray-600 transition-colors cursor-pointer">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-blue-400 font-semibold">📁 PDF Resume</div>
                    <div className="text-gray-300 text-sm">Professional format</div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-gray-400" />
                </div>
              </div>
              <div className="bg-gray-700 rounded-lg p-3 hover:bg-gray-600 transition-colors cursor-pointer">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-green-400 font-semibold">💼 Portfolio PDF</div>
                    <div className="text-gray-300 text-sm">Projects showcase</div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-gray-400" />
                </div>
              </div>
              <div className="bg-gray-700 rounded-lg p-3 hover:bg-gray-600 transition-colors cursor-pointer">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-purple-400 font-semibold">📊 Skills Matrix</div>
                    <div className="text-gray-300 text-sm">Technical assessment</div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-gray-400" />
                </div>
              </div>
              <div className="bg-gray-700 rounded-lg p-3 hover:bg-gray-600 transition-colors cursor-pointer">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-yellow-400 font-semibold">🎯 Cover Letter</div>
                    <div className="text-gray-300 text-sm">Personalized template</div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-gray-400" />
                </div>
              </div>
            </div>
            <div className="border-t border-gray-700 pt-3">
              <div className="text-gray-400 text-sm">
                📧 <strong>Quick Request:</strong> Email mucyoprinc12@gmail.com with "Resume Request" 
                and I'll send you the latest version within 2 hours!
              </div>
            </div>
          </div>
        </div>
      )
    }
  };

  const welcomeMessage = {
    id: 0,
    command: 'welcome',
    output: (
      <div className="space-y-6 animate-fade-in">
        <div className="text-center">
          <div className="text-green-400 font-bold text-2xl mb-2 flex items-center justify-center gap-2">
            <Terminal className="w-8 h-8" />
            Welcome to MUCYO Prince's Dev Terminal!
          </div>
          <div className="text-cyan-400 text-sm font-mono">
            ➜ portfolio-terminal@kigali:~$ authenticated successfully
          </div>
        </div>
        
        <div className="bg-gray-800 rounded-lg p-4 border-l-4 border-green-400">
          <div className="text-gray-300 space-y-3">
            <p className="text-lg">
              👋 Hello! I'm <span className="text-cyan-400 font-semibold">MUCYO Prince</span>, 
              a passionate Software Developer from Kigali, Rwanda.
            </p>
            <p className="text-sm text-gray-400">
              🎓 Minister of ICT at Kigali Independent University • 💻 PERN & MERN Stack Specialist
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-800 rounded-lg p-4">
            <div className="text-green-400 font-semibold mb-2">🚀 Essential Commands</div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <span className="text-cyan-400 font-mono hover:text-cyan-300 cursor-pointer">about</span>
              <span className="text-cyan-400 font-mono hover:text-cyan-300 cursor-pointer">skills</span>
              <span className="text-cyan-400 font-mono hover:text-cyan-300 cursor-pointer">projects</span>
              <span className="text-cyan-400 font-mono hover:text-cyan-300 cursor-pointer">contact</span>
              <span className="text-cyan-400 font-mono hover:text-cyan-300 cursor-pointer">experience</span>
              <span className="text-cyan-400 font-mono hover:text-cyan-300 cursor-pointer">education</span>
            </div>
          </div>
          <div className="bg-gray-800 rounded-lg p-4">
            <div className="text-green-400 font-semibold mb-2">✨ Special Features</div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <span className="text-yellow-400 font-mono hover:text-yellow-300 cursor-pointer">quote</span>
              <span className="text-purple-400 font-mono hover:text-purple-300 cursor-pointer">verse</span>
              <span className="text-blue-400 font-mono hover:text-blue-300 cursor-pointer">achievements</span>
              <span className="text-green-400 font-mono hover:text-green-300 cursor-pointer">testimonials</span>
              <span className="text-cyan-400 font-mono hover:text-cyan-300 cursor-pointer">availability</span>
              <span className="text-orange-400 font-mono hover:text-orange-300 cursor-pointer">productivity</span>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-800 rounded-lg p-4 border-l-4 border-green-400">
            <div className="text-green-400 font-semibold mb-2">💡 Pro Tips</div>
            <div className="text-gray-300 text-sm space-y-1">
              <div>• Type <span className="text-cyan-400 font-mono">help</span> for all commands</div>
              <div>• Use ↑/↓ arrows for command history</div>
              <div>• Press Tab for autocompletion</div>
              <div>• Try <span className="text-cyan-400 font-mono">easter</span> for a surprise!</div>
            </div>
          </div>
          <div className="bg-gray-800 rounded-lg p-4 border-l-4 border-yellow-400">
            <div className="text-yellow-400 font-semibold mb-2">📊 Quick Stats</div>
            <div className="text-gray-300 text-sm space-y-1">
              <div>• 15+ Projects Completed</div>
              <div>• 2+ Years Experience</div>
              <div>• 100% Client Satisfaction</div>
              <div>• Available for Hire!</div>
            </div>
          </div>
          <div className="bg-gray-800 rounded-lg p-4 border-l-4 border-purple-400">
            <div className="text-purple-400 font-semibold mb-2">🌟 Daily Inspiration</div>
            <div className="text-gray-300 text-sm space-y-1">
              <div>• <span className="text-yellow-400 font-mono">quote</span> - Daily motivation</div>
              <div>• <span className="text-purple-400 font-mono">verse</span> - Spiritual guidance</div>
              <div>• Fresh content every day!</div>
            </div>
          </div>
        </div>

        <div className="text-center text-gray-400 text-sm border-t border-gray-700 pt-4">
          🌟 Ready to explore? Start typing a command below!
        </div>
      </div>
    ),
    timestamp: new Date()
  };

  // System status simulation
  useEffect(() => {
    const updateSystemStatus = () => {
      setSystemStatus(prev => ({
        cpuUsage: Math.floor(Math.random() * 30) + 10, // 10-40% CPU usage
        batteryLevel: Math.max(20, prev.batteryLevel - Math.random() * 0.1), // Slow battery drain
        currentTime: new Date()
      }));
    };

    const interval = setInterval(updateSystemStatus, 2000);
    return () => clearInterval(interval);
  }, []);

  // Cursor blinking effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCursorVisible(prev => !prev);
    }, 530);
    return () => clearInterval(interval);
  }, []);

  // Auto-suggestions
  useEffect(() => {
    if (currentInput.trim()) {
      const matchingCommands = Object.keys(commands).filter(cmd => 
        cmd.toLowerCase().startsWith(currentInput.toLowerCase())
      );
      setSuggestions(matchingCommands);
      setShowSuggestions(matchingCommands.length > 0 && currentInput.length > 0);
    } else {
      setShowSuggestions(false);
    }
  }, [currentInput]);

  useEffect(() => {
    setHistory([welcomeMessage]);
  }, []);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history]);

  const playCommandSound = useCallback(() => {
    // Simulate command sound effect (you can add actual audio files later)
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {
        // Silently handle audio play errors
      });
    }
  }, []);

  const handleCommand = async (command: string) => {
    const trimmedCommand = command.trim().toLowerCase();
    
    playCommandSound();
    
    if (trimmedCommand === 'clear') {
      setHistory([]);
      return;
    }

    setIsTyping(true);
    
    const newEntry: CommandHistory = {
      id: Date.now(),
      command: trimmedCommand,
      output: null,
      timestamp: new Date(),
      isTyping: true
    };

    setHistory(prev => [...prev, newEntry]);

    // Enhanced typing delay with random variation
    const typingDelay = 300 + Math.random() * 400;
    
    setTimeout(() => {
      if (commands[trimmedCommand]) {
        const output = commands[trimmedCommand].execute();
        setHistory(prev => 
          prev.map(entry => 
            entry.id === newEntry.id 
              ? { ...entry, output, isTyping: false }
              : entry
          )
        );
      } else {
        setHistory(prev => 
          prev.map(entry => 
            entry.id === newEntry.id 
              ? { 
                  ...entry, 
                  output: (
                    <div className="text-red-400 animate-pulse">
                      <span className="mr-2">❌</span>
                      Command not found: <span className="font-mono">{trimmedCommand}</span>
                      <div className="text-gray-400 text-sm mt-1">
                        💡 Type <span className="text-cyan-400 font-mono">help</span> to see available commands
                      </div>
                    </div>
                  ),
                  isTyping: false
                }
              : entry
          )
        );
      }
      setIsTyping(false);
    }, typingDelay);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (currentInput.trim()) {
        handleCommand(currentInput);
        setCurrentInput('');
        setCommandIndex(-1);
        setShowSuggestions(false);
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      if (suggestions.length === 1) {
        setCurrentInput(suggestions[0]);
        setShowSuggestions(false);
      } else if (suggestions.length > 1) {
        // Cycle through suggestions
        const commonPrefix = suggestions.reduce((prefix, cmd) => {
          let i = 0;
          while (i < prefix.length && i < cmd.length && prefix[i] === cmd[i]) {
            i++;
          }
          return prefix.slice(0, i);
        });
        
        if (commonPrefix.length > currentInput.length) {
          setCurrentInput(commonPrefix);
        }
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const commands = history.filter(h => h.command !== 'welcome').map(h => h.command);
      if (commands.length > 0) {
        const newIndex = commandIndex < commands.length - 1 ? commandIndex + 1 : commandIndex;
        setCommandIndex(newIndex);
        setCurrentInput(commands[commands.length - 1 - newIndex]);
        setShowSuggestions(false);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (commandIndex > 0) {
        const commands = history.filter(h => h.command !== 'welcome').map(h => h.command);
        const newIndex = commandIndex - 1;
        setCommandIndex(newIndex);
        setCurrentInput(commands[commands.length - 1 - newIndex]);
      } else {
        setCommandIndex(-1);
        setCurrentInput('');
      }
      setShowSuggestions(false);
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
      setCurrentInput('');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 text-gray-100 font-mono">
      {/* System Status Bar */}
      <div className="bg-gray-800 border-b border-gray-700 px-4 py-2 flex items-center justify-between text-sm">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-green-400">ONLINE</span>
          </div>
          <div className="text-gray-400">
            mucyo@portfolio-terminal
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* CPU Usage */}
          <div className="flex items-center space-x-2">
            <Cpu className="w-4 h-4 text-blue-400" />
            <span className="text-blue-400">{systemStatus.cpuUsage}%</span>
          </div>
          
          {/* Battery */}
          <div className="flex items-center space-x-2">
            <Battery className="w-4 h-4 text-green-400" />
            <span className="text-green-400">{Math.floor(systemStatus.batteryLevel)}%</span>
          </div>
          
          {/* Clock */}
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-cyan-400" />
            <span className="text-cyan-400">
              {formatTime(systemStatus.currentTime)}
            </span>
          </div>
          
          {/* Date */}
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-yellow-400" />
            <span className="text-yellow-400">
              {formatShortDate(systemStatus.currentTime)}
            </span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Terminal Header */}
        <div className="bg-gray-800 rounded-t-lg border-b border-gray-700 p-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full hover:bg-red-400 cursor-pointer transition-colors"></div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full hover:bg-yellow-400 cursor-pointer transition-colors"></div>
              <div className="w-3 h-3 bg-green-500 rounded-full hover:bg-green-400 cursor-pointer transition-colors"></div>
            </div>
            <div className="flex items-center space-x-2 ml-4">
              <Terminal className="w-4 h-4 text-gray-400" />
              <span className="text-gray-400 text-sm">MUCYO-Portfolio-Terminal</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 text-xs text-gray-500">
            <span>Kigali, Rwanda</span>
            <span>•</span>
            <span>v2.0.0</span>
          </div>
        </div>

        {/* Terminal Content */}
        <div 
          ref={terminalRef}
          className="bg-gray-900 rounded-b-lg min-h-[75vh] max-h-[75vh] overflow-y-auto p-6 space-y-4 border border-gray-700"
          onClick={() => inputRef.current?.focus()}
        >
          {/* Command History */}
          {history.map((entry) => (
            <div key={entry.id} className="space-y-3">
              {entry.command !== 'welcome' && (
                <div className="flex items-center space-x-2 group">
                  <span className="text-green-400 font-bold">➜</span>
                  <span className="text-cyan-400 font-semibold">mucyo@portfolio</span>
                  <span className="text-gray-500">:</span>
                  <span className="text-purple-400">~</span>
                  <span className="text-gray-500">$</span>
                  <span className="text-gray-100 font-mono">{entry.command}</span>
                  {entry.isTyping && (
                    <div className="flex items-center space-x-1">
                      <div className="w-1 h-4 bg-green-400 animate-pulse"></div>
                      <span className="text-gray-400 text-sm">processing...</span>
                    </div>
                  )}
                  <span className="text-gray-500 text-xs ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                    {formatTimestamp(entry.timestamp)}
                  </span>
                </div>
              )}
              {entry.output && (
                <div className="ml-6 pl-4 border-l-2 border-gray-700 hover:border-cyan-400 transition-colors">
                  {entry.output}
                </div>
              )}
            </div>
          ))}

          {/* Autocompletion Suggestions */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="ml-6 bg-gray-800 rounded-lg p-3 border border-gray-600">
              <div className="text-gray-400 text-xs mb-2">Suggestions:</div>
              <div className="flex flex-wrap gap-2">
                {suggestions.map((suggestion) => (
                  <span 
                    key={suggestion}
                    className="text-cyan-400 bg-gray-700 px-2 py-1 rounded text-sm font-mono hover:bg-gray-600 cursor-pointer transition-colors"
                    onClick={() => {
                      setCurrentInput(suggestion);
                      setShowSuggestions(false);
                      inputRef.current?.focus();
                    }}
                  >
                    {suggestion}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Current Input */}
          <div className="flex items-center space-x-2 sticky bottom-0 bg-gray-900 pt-2">
            <span className="text-green-400 font-bold">➜</span>
            <span className="text-cyan-400 font-semibold">mucyo@portfolio</span>
            <span className="text-gray-500">:</span>
            <span className="text-purple-400">~</span>
            <span className="text-gray-500">$</span>
            <div className="flex-1 flex items-center">
              <input
                ref={inputRef}
                type="text"
                value={currentInput}
                onChange={(e) => setCurrentInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 bg-transparent outline-none text-gray-100 font-mono caret-transparent"
                placeholder={isTyping ? "Processing command..." : "Type a command... (try 'help')"}
                disabled={isTyping}
                autoFocus
              />
              <div className={`w-2 h-5 bg-green-400 ml-1 ${cursorVisible ? 'opacity-100' : 'opacity-0'} transition-opacity`}></div>
            </div>
            {isTyping && (
              <div className="flex items-center space-x-1 text-gray-400 text-sm">
                <div className="flex space-x-1">
                  <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-4 text-center text-gray-500 text-sm">
          <p>
            💻 Built with React + TypeScript • 🎨 Styled with Tailwind CSS • ❤️ Made in Rwanda
          </p>
          <p className="mt-1">
            🚀 <span className="text-cyan-400">MUCYO Prince</span> © {new Date().getFullYear()} • 
            <span className="text-green-400 ml-1">Ready for new opportunities!</span>
          </p>
        </div>
      </div>

      {/* Hidden audio element for command sounds */}
      <audio
        ref={audioRef}
        preload="auto"
        style={{ display: 'none' }}
      >
        {/* You can add actual sound files here */}
        {/* <source src="/command-sound.mp3" type="audio/mpeg" /> */}
      </audio>
    </div>
  );
};

export default App;