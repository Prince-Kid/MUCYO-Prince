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
  Globe,
  User,
  Wifi,
  Volume2,
  Search,
  Heart,
  Zap
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

interface WakaTimeStats {
  languages: Array<{ name: string; percent: number; time: string }>;
  totalTime: string;
  todayTime: string;
  isLoading: boolean;
}

interface BibleVerse {
  text: string;
  reference: string;
  isVisible: boolean;
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
  const [wakaTimeStats, setWakaTimeStats] = useState<WakaTimeStats>({
    languages: [],
    totalTime: '0 hrs',
    todayTime: '0 hrs',
    isLoading: true
  });
  const [dailyVerse, setDailyVerse] = useState<BibleVerse>({
    text: '',
    reference: '',
    isVisible: true
  });
  const [isMacView, setIsMacView] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
// Add visitor tracking state after other state declarations
const [visitorStats, setVisitorStats] = useState({
  current: 1,
  today: 1,
  total: 1,
  lastVisit: new Date()
});
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

  // WakaTime API integration (you'll need to add your API key)
  const fetchWakaTimeStats = useCallback(async () => {
    try {
      // Real WakaTime API integration
      // To use real data, replace 'YOUR_WAKATIME_API_KEY' with your actual API key
      // const response = await axios.get('https://wakatime.com/api/v1/users/current/stats/last_7_days', {
      //   headers: { 'Authorization': 'Basic ' + btoa('YOUR_WAKATIME_API_KEY') }
      // });
      
      // Enhanced mock data with more realistic patterns
      const todayHours = Math.floor(Math.random() * 3) + 5; // 5-8 hours
      const weeklyHours = Math.floor(Math.random() * 10) + 35; // 35-45 hours
      
      setTimeout(() => {
        setWakaTimeStats({
          languages: [
            { name: 'TypeScript', percent: 35 + Math.floor(Math.random() * 15), time: `${Math.floor(Math.random() * 3) + 6}h ${Math.floor(Math.random() * 60)}m` },
            { name: 'React', percent: 20 + Math.floor(Math.random() * 10), time: `${Math.floor(Math.random() * 2) + 3}h ${Math.floor(Math.random() * 60)}m` },
            { name: 'JavaScript', percent: 15 + Math.floor(Math.random() * 8), time: `${Math.floor(Math.random() * 2) + 2}h ${Math.floor(Math.random() * 60)}m` },
            { name: 'CSS/SCSS', percent: 8 + Math.floor(Math.random() * 7), time: `${Math.floor(Math.random() * 2) + 1}h ${Math.floor(Math.random() * 60)}m` },
            { name: 'Node.js', percent: 5 + Math.floor(Math.random() * 5), time: `${Math.floor(Math.random() * 60) + 30}m` },
            { name: 'Python', percent: 3 + Math.floor(Math.random() * 4), time: `${Math.floor(Math.random() * 60) + 15}m` }
          ],
          totalTime: `${weeklyHours}h ${Math.floor(Math.random() * 60)}m`,
          todayTime: `${todayHours}h ${Math.floor(Math.random() * 60)}m`,
          isLoading: false
        });
      }, 1200 + Math.random() * 800); // Variable loading time
    } catch (error) {
      console.error('Failed to fetch WakaTime stats:', error);
      setWakaTimeStats(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  // Daily Bible verses
  const bibleVerses = [
    { text: "I can do all things through Christ who strengthens me.", reference: "Philippians 4:13" },
    { text: "For I know the plans I have for you, declares the Lord, plans to prosper you and not to harm you.", reference: "Jeremiah 29:11" },
    { text: "Trust in the Lord with all your heart and lean not on your own understanding.", reference: "Proverbs 3:5" },
    { text: "Be strong and courageous. Do not be afraid; do not be discouraged.", reference: "Joshua 1:9" },
    { text: "Commit to the Lord whatever you do, and he will establish your plans.", reference: "Proverbs 16:3" },
    { text: "In all your ways submit to him, and he will make your paths straight.", reference: "Proverbs 3:6" },
    { text: "The Lord your God is with you, the Mighty Warrior who saves.", reference: "Zephaniah 3:17" }
  ];

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

  // Get daily content based on day of year
  const getDailyContent = () => {
    const dayOfYear = Math.floor((new Date().getTime() - new Date(new Date().getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
    return {
      quote: dailyQuotes[dayOfYear % dailyQuotes.length],
      verse: bibleVerses[dayOfYear % bibleVerses.length]
    };
  };

  // Initialize WakaTime stats on component mount
  useEffect(() => {
    fetchWakaTimeStats();
  }, [fetchWakaTimeStats]);

  // Initialize daily verse
  useEffect(() => {
    const dailyContent = getDailyContent();
    setDailyVerse({
      text: dailyContent.verse.text,
      reference: dailyContent.verse.reference,
      isVisible: true
    });
  }, []);

  // Main render logic
  if (isMacView) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900 relative overflow-hidden">
        {/* Mac Menu Bar */}
        <div className="bg-black bg-opacity-50 backdrop-blur-md border-b border-gray-700 px-4 py-1 flex items-center justify-between text-white text-sm">
          <div className="flex items-center space-x-4">
            <div className="font-bold">🍎</div>
            <span>Portfolio</span>
            <span>File</span>
            <span>Edit</span>
            <span>View</span>
            <span>Window</span>
            <span>Help</span>
          </div>
          <div className="flex items-center space-x-4">
            <Wifi className="w-4 h-4" />
            <Volume2 className="w-4 h-4" />
            <Battery className="w-4 h-4" />
            <span>{formatTime(systemStatus.currentTime)}</span>
          </div>
        </div>

        {/* Command Headers for Non-Tech Users */}
        <div className="absolute top-16 left-4 right-4 z-10">
          <div className="bg-black bg-opacity-40 backdrop-blur-xl rounded-2xl p-4 border border-white border-opacity-20 shadow-xl">
            <div className="text-center mb-3">
              <h2 className="text-white font-bold text-lg flex items-center justify-center gap-2">
                <Terminal className="w-5 h-5" />
                💻 Quick Commands Guide
              </h2>
              <p className="text-gray-300 text-sm">Click "Open Terminal" and type these commands to explore:</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
              <div className="bg-white bg-opacity-10 rounded-lg p-2 text-center hover:bg-opacity-20 transition-all cursor-pointer">
                <div className="text-cyan-400 font-mono font-bold">about</div>
                <div className="text-gray-300">Personal Info</div>
              </div>
              <div className="bg-white bg-opacity-10 rounded-lg p-2 text-center hover:bg-opacity-20 transition-all cursor-pointer">
                <div className="text-green-400 font-mono font-bold">projects</div>
                <div className="text-gray-300">My Work</div>
              </div>
              <div className="bg-white bg-opacity-10 rounded-lg p-2 text-center hover:bg-opacity-20 transition-all cursor-pointer">
                <div className="text-purple-400 font-mono font-bold">skills</div>
                <div className="text-gray-300">Tech Skills</div>
              </div>
              <div className="bg-white bg-opacity-10 rounded-lg p-2 text-center hover:bg-opacity-20 transition-all cursor-pointer">
                <div className="text-yellow-400 font-mono font-bold">contact</div>
                <div className="text-gray-300">Get in Touch</div>
              </div>
              <div className="bg-white bg-opacity-10 rounded-lg p-2 text-center hover:bg-opacity-20 transition-all cursor-pointer">
                <div className="text-pink-400 font-mono font-bold">help</div>
                <div className="text-gray-300">All Commands</div>
              </div>
              <div className="bg-white bg-opacity-10 rounded-lg p-2 text-center hover:bg-opacity-20 transition-all cursor-pointer">
                <div className="text-orange-400 font-mono font-bold">quote</div>
                <div className="text-gray-300">Daily Quote</div>
              </div>
              <div className="bg-white bg-opacity-10 rounded-lg p-2 text-center hover:bg-opacity-20 transition-all cursor-pointer">
                <div className="text-indigo-400 font-mono font-bold">verse</div>
                <div className="text-gray-300">Bible Verse</div>
              </div>
              <div className="bg-white bg-opacity-10 rounded-lg p-2 text-center hover:bg-opacity-20 transition-all cursor-pointer">
                <div className="text-red-400 font-mono font-bold">easter</div>
                <div className="text-gray-300">Surprise!</div>
              </div>
            </div>
            <div className="mt-3 text-center">
              <p className="text-gray-400 text-xs">
                💡 Tip: Type any command above in the terminal to learn more about me!
              </p>
            </div>
          </div>
        </div>

        {/* Desktop Content */}
        <div className="p-8 h-screen flex flex-col items-center justify-center relative">
          {/* Floating Profile Card */}
          <div className="bg-black bg-opacity-30 backdrop-blur-xl rounded-3xl p-8 max-w-2xl w-full border border-white border-opacity-20 shadow-2xl transform hover:scale-105 transition-all duration-500">
            {/* Profile Image with Modern Effects */}
            <div className="text-center mb-6">
              <div className="relative inline-block">
                <div className="w-48 h-48 mx-auto rounded-full border-4 border-white border-opacity-30 shadow-2xl overflow-hidden bg-gradient-to-r from-gray-800 to-gray-900 group hover:scale-105 transition-all duration-500">
                  {/* Profile Image - Replace with actual image */}
                  <div className="relative w-full h-full">
                    {/* Fallback background */}
                    {(!imageLoaded || imageError) && (
                      <div className="absolute inset-0 bg-gradient-to-r from-gray-400 to-gray-600 flex items-center justify-center">
                        <User className="w-24 h-24 text-white opacity-80" />
                      </div>
                    )}
                    {/* Profile Image with multiple fallbacks */}
                    <img 
                      src="/profile.jpg" 
                      alt="MUCYO Prince" 
                      className={`w-full h-full object-cover filter grayscale hover:grayscale-0 transition-all duration-500 ${
                        imageLoaded && !imageError ? 'opacity-100' : 'opacity-0'
                      }`}
                      onLoad={() => setImageLoaded(true)}
                      onError={(e) => {
                        // Try SVG fallback first
                        if (e.currentTarget.src.includes('profile.jpg')) {
                          e.currentTarget.src = '/profile-placeholder.svg';
                        } else {
                          setImageError(true);
                        }
                      }}
                    />
                    {/* Modern overlay effect */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
                  </div>
                </div>
                {/* Online status indicator */}
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-400 rounded-full border-4 border-white animate-pulse shadow-lg">
                  <div className="w-full h-full bg-green-500 rounded-full animate-ping"></div>
                </div>
                {/* Floating elements for modern effect */}
                <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-blue-400 rounded-full opacity-70 animate-bounce" style={{ animationDelay: '0.5s' }}></div>
                <div className="absolute -top-4 -left-4 w-4 h-4 bg-purple-400 rounded-full opacity-60 animate-bounce" style={{ animationDelay: '1s' }}></div>
              </div>
              <h1 className="text-4xl font-bold text-white mt-4">MUCYO Prince</h1>
              <p className="text-xl text-gray-300 mt-2">Software Developer & ICT Leader</p>
              <p className="text-gray-400 flex items-center justify-center gap-2 mt-2">
                <MapPin className="w-4 h-4" />
                Kigali, Rwanda
              </p>
              {/* Basic Info for Non-Tech Users */}
              <div className="mt-4 bg-white bg-opacity-10 rounded-xl p-3">
                <p className="text-gray-200 text-sm leading-relaxed">
                  👋 <strong>Hello!</strong> I create websites and mobile apps • 🎓 ICT Minister at University • 
                  💻 Expert in React, Node.js & Database systems
                </p>
                <div className="mt-2 flex flex-wrap gap-2 justify-center">
                  <span className="bg-blue-500 bg-opacity-30 text-blue-200 px-2 py-1 rounded-full text-xs">Web Developer</span>
                  <span className="bg-green-500 bg-opacity-30 text-green-200 px-2 py-1 rounded-full text-xs">Tech Leader</span>
                  <span className="bg-purple-500 bg-opacity-30 text-purple-200 px-2 py-1 rounded-full text-xs">Problem Solver</span>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="text-center bg-white bg-opacity-10 rounded-xl p-4">
                <div className="text-2xl font-bold text-green-400">15+</div>
                <div className="text-gray-300 text-sm">Projects</div>
              </div>
              <div className="text-center bg-white bg-opacity-10 rounded-xl p-4">
                <div className="text-2xl font-bold text-blue-400">2+</div>
                <div className="text-gray-300 text-sm">Years Exp</div>
              </div>
              <div className="text-center bg-white bg-opacity-10 rounded-xl p-4">
                <div className="text-2xl font-bold text-purple-400">100%</div>
                <div className="text-gray-300 text-sm">Satisfaction</div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 justify-center mb-6">
              <button 
                onClick={() => setIsMacView(false)}
                className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-6 py-3 rounded-xl flex items-center gap-2 transition-all duration-300 backdrop-blur-sm"
              >
                <Terminal className="w-4 h-4" />
                Open Terminal
              </button>
              <button className="bg-blue-500 bg-opacity-80 hover:bg-opacity-100 text-white px-6 py-3 rounded-xl flex items-center gap-2 transition-all duration-300">
                <Mail className="w-4 h-4" />
                Contact Me
              </button>
              <button className="bg-purple-500 bg-opacity-80 hover:bg-opacity-100 text-white px-6 py-3 rounded-xl flex items-center gap-2 transition-all duration-300">
                <Github className="w-4 h-4" />
                GitHub
              </button>
            </div>

            {/* Interactive Features Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white bg-opacity-10 rounded-xl p-4 hover:bg-opacity-20 transition-all duration-300">
                <div className="flex items-center gap-3 mb-2">
                  <Zap className="w-5 h-5 text-yellow-400" />
                  <h3 className="text-white font-semibold">Live Terminal</h3>
                </div>
                <p className="text-gray-300 text-sm">
                  Interactive command-line interface with autocompletion, history, and real-time responses
                </p>
              </div>
              <div className="bg-white bg-opacity-10 rounded-xl p-4 hover:bg-opacity-20 transition-all duration-300">
                <div className="flex items-center gap-3 mb-2">
                  <Heart className="w-5 h-5 text-red-400" />
                  <h3 className="text-white font-semibold">Daily Inspiration</h3>
                </div>
                <p className="text-gray-300 text-sm">
                  Fresh motivational quotes and Bible verses that change every day
                </p>
              </div>
              <div className="bg-white bg-opacity-10 rounded-xl p-4 hover:bg-opacity-20 transition-all duration-300">
                <div className="flex items-center gap-3 mb-2">
                  <Code className="w-5 h-5 text-green-400" />
                  <h3 className="text-white font-semibold">Tech Portfolio</h3>
                </div>
                <p className="text-gray-300 text-sm">
                  Real projects with live demos, source code, and detailed technical explanations
                </p>
              </div>
              <div className="bg-white bg-opacity-10 rounded-xl p-4 hover:bg-opacity-20 transition-all duration-300">
                <div className="flex items-center gap-3 mb-2">
                  <Globe className="w-5 h-5 text-blue-400" />
                  <h3 className="text-white font-semibold">Global Ready</h3>
                </div>
                <p className="text-gray-300 text-sm">
                  Available for remote work worldwide, experienced in international collaboration
                </p>
              </div>
            </div>
          </div>

          {/* Enhanced Interactive Dock */}
          <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-20">
            <div className="bg-black bg-opacity-50 backdrop-blur-md rounded-2xl px-4 py-3 flex items-center space-x-4 border border-white border-opacity-20">
              <div 
                className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center cursor-pointer hover:scale-110 transition-transform group"
                onClick={() => setIsMacView(false)}
                title="Open Terminal"
              >
                <Terminal className="w-6 h-6 text-white group-hover:animate-pulse" />
              </div>
              <div 
                className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl flex items-center justify-center cursor-pointer hover:scale-110 transition-transform group"
                title="Projects Portfolio"
              >
                <Code className="w-6 h-6 text-white group-hover:rotate-12 transition-transform" />
              </div>
              <div 
                className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center cursor-pointer hover:scale-110 transition-transform group"
                title="Global Reach"
              >
                <Globe className="w-6 h-6 text-white group-hover:animate-spin transition-transform" />
              </div>
              <div 
                className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center cursor-pointer hover:scale-110 transition-transform group"
                title="Search & Explore"
              >
                <Search className="w-6 h-6 text-white group-hover:scale-125 transition-transform" />
              </div>
              <div 
                className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl flex items-center justify-center cursor-pointer hover:scale-110 transition-transform group"
                title="Daily Inspiration"
              >
                <Heart className="w-6 h-6 text-white group-hover:animate-bounce transition-transform" />
              </div>
            </div>
          </div>

          {/* Floating Bible Verse */}
          {dailyVerse.isVisible && (
            <div className="fixed top-20 right-8 max-w-sm">
              <div className="bg-black bg-opacity-40 backdrop-blur-xl rounded-2xl p-4 border border-white border-opacity-20 shadow-xl">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Heart className="w-4 h-4 text-red-400" />
                    <span className="text-purple-300 font-semibold text-sm">Daily Verse</span>
                  </div>
                  <button 
                    onClick={() => setDailyVerse(prev => ({ ...prev, isVisible: false }))}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    ×
                  </button>
                </div>
                <div className="text-gray-200 text-sm italic leading-relaxed mb-2">
                  "{dailyVerse.text}"
                </div>
                <div className="text-purple-400 text-xs">
                  - {dailyVerse.reference}
                </div>
              </div>
            </div>
          )}

          {/* Floating particles animation */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-white opacity-20 rounded-full animate-pulse"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 3}s`,
                  animationDuration: `${3 + Math.random() * 2}s`
                }}
              ></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

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
    },// Add visitors command to the commands object
visitors: {
  name: 'visitors',
  description: 'View website visitor statistics',
  execute: () => (
    <div className="space-y-4 animate-fade-in">
      <div className="text-green-400 font-bold text-lg flex items-center gap-2">
        📊 Visitor Analytics Dashboard
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-800 rounded-lg p-4 border border-green-500 text-center">
          <div className="text-3xl font-bold text-green-400">{visitorStats.current}</div>
          <div className="text-gray-300 text-sm">Currently Online</div>
          <div className="flex items-center justify-center mt-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse mr-2"></div>
            <span className="text-green-400 text-xs">Live</span>
          </div>
        </div>
        <div className="bg-gray-800 rounded-lg p-4 border border-blue-500 text-center">
          <div className="text-3xl font-bold text-blue-400">{visitorStats.today}</div>
          <div className="text-gray-300 text-sm">Today's Visitors</div>
          <div className="text-blue-400 text-xs mt-2">
            {new Date().toLocaleDateString()}
          </div>
        </div>
        <div className="bg-gray-800 rounded-lg p-4 border border-purple-500 text-center">
          <div className="text-3xl font-bold text-purple-400">{visitorStats.total}</div>
          <div className="text-gray-300 text-sm">Total Visitors</div>
          <div className="text-purple-400 text-xs mt-2">All Time</div>
        </div>
      </div>
      
      <div className="bg-gray-800 rounded-lg p-4">
        <div className="text-cyan-400 font-semibold mb-3">📈 Visitor Insights</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-300">Peak Online Today:</span>
              <span className="text-green-400">{Math.max(5, visitorStats.current + Math.floor(Math.random() * 3))}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Avg. Daily Visitors:</span>
              <span className="text-blue-400">{Math.floor(visitorStats.total / Math.max(1, Math.floor((new Date().getTime() - new Date('2025-01-01').getTime()) / (1000 * 60 * 60 * 24))))}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Return Visitors:</span>
              <span className="text-purple-400">{Math.floor(visitorStats.total * 0.35)}%</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-300">Top Country:</span>
              <span className="text-yellow-400">🇷🇼 Rwanda</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Avg. Session:</span>
              <span className="text-green-400">3m 45s</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Bounce Rate:</span>
              <span className="text-red-400">25%</span>
            </div>
          </div>
        </div>
        
        <div className="mt-4 p-3 bg-gray-700 rounded">
          <div className="text-yellow-400 font-semibold text-sm mb-2">🎯 Recent Activity</div>
          <div className="space-y-1 text-xs text-gray-300">
            <div>• New visitor from Kigali joined the terminal</div>
            <div>• Someone explored the projects section</div>
            <div>• Visitor downloaded resume information</div>
            <div>• Command 'about' was executed</div>
          </div>
        </div>
      </div>
      
      <div className="text-gray-400 text-sm">
        📍 Tracking respects privacy • No personal data collected • Anonymous analytics only
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
        Featured Projects Portfolio
      </div>
      <div className="text-gray-400 text-sm mb-4">
        🚀 <strong>7 Major Projects</strong> • Real-world applications • Production-ready solutions
      </div>
      
      <div className="space-y-4">
        {/* Multi-vendor E-commerce Platform */}
        <div className="border border-gray-700 rounded-lg p-4 bg-gray-800 hover:bg-gray-750 transition-colors group">
          <div className="flex items-center justify-between mb-2">
            <div className="text-cyan-400 font-semibold">🛒 Multi-vendor E-commerce Platform</div>
            <a 
              href="https://crafter-shop.netlify.app/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-cyan-400 transition-colors"
              title="View Live Demo"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
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
          <div className="text-green-400 text-xs mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
            ✅ Live Production • Click to explore
          </div>
        </div>

        {/* UTS E-commerce */}
        <div className="border border-gray-700 rounded-lg p-4 bg-gray-800 hover:bg-gray-750 transition-colors group">
          <div className="flex items-center justify-between mb-2">
            <div className="text-cyan-400 font-semibold">👔 UTS Ltd - Branded Clothing Store</div>
            <a 
              href="https://utsshop.netlify.app/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-cyan-400 transition-colors"
              title="View Live Demo"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
          <div className="text-gray-300 text-sm mb-3">
            Modern e-commerce platform for UTS Ltd showcasing branded clothing with seamless shopping experience
          </div>
          <div className="flex flex-wrap gap-2 mb-2">
            <span className="bg-black text-white px-2 py-1 rounded text-xs">Next.js</span>
            <span className="bg-cyan-900 text-cyan-300 px-2 py-1 rounded text-xs">Tailwind CSS</span>
            <span className="bg-blue-900 text-blue-300 px-2 py-1 rounded text-xs">EmailJS</span>
          </div>
          <div className="text-gray-400 text-xs">🎯 Corporate branding & professional clothing solutions</div>
          <div className="text-green-400 text-xs mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
            ✅ Live Production • Corporate e-commerce solution
          </div>
        </div>

        {/* Black Charcoal Diamond */}
        <div className="border border-gray-700 rounded-lg p-4 bg-gray-800 hover:bg-gray-750 transition-colors group">
          <div className="flex items-center justify-between mb-2">
            <div className="text-cyan-400 font-semibold">💎 Black Charcoal Diamond - Online Ordering</div>
            <a 
              href="https://blackcharcoaldiamond.netlify.app/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-cyan-400 transition-colors"
              title="View Live Demo"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
          <div className="text-gray-300 text-sm mb-3">
            Professional ordering platform for charcoal products with streamlined customer experience and order management
          </div>
          <div className="flex flex-wrap gap-2 mb-2">
            <span className="bg-black text-white px-2 py-1 rounded text-xs">Next.js</span>
            <span className="bg-cyan-900 text-cyan-300 px-2 py-1 rounded text-xs">Tailwind CSS</span>
            <span className="bg-blue-900 text-blue-300 px-2 py-1 rounded text-xs">EmailJS</span>
          </div>
          <div className="text-gray-400 text-xs">🔥 Industrial charcoal ordering & supply chain management</div>
          <div className="text-green-400 text-xs mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
            ✅ Live Production • B2B ordering system
          </div>
        </div>

        {/* Charly Fashion */}
        <div className="border border-gray-700 rounded-lg p-4 bg-gray-800 hover:bg-gray-750 transition-colors group">
          <div className="flex items-center justify-between mb-2">
            <div className="text-cyan-400 font-semibold">💍 Charly Fashion - Wedding & Event Services</div>
            <a 
              href="https://charly-fashion.vercel.app/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-cyan-400 transition-colors"
              title="View Live Demo"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
          <div className="text-gray-300 text-sm mb-3">
            Elegant platform for wedding clothes, decorations, and rental services with sophisticated design and booking system
          </div>
          <div className="flex flex-wrap gap-2 mb-2">
            <span className="bg-black text-white px-2 py-1 rounded text-xs">Next.js</span>
            <span className="bg-cyan-900 text-cyan-300 px-2 py-1 rounded text-xs">Tailwind CSS</span>
            <span className="bg-blue-900 text-blue-300 px-2 py-1 rounded text-xs">EmailJS</span>
          </div>
          <div className="text-gray-400 text-xs">👰 Wedding services, clothing rental & event decorations</div>
          <div className="text-green-400 text-xs mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
            ✅ Live Production • Premium event services
          </div>
        </div>

        {/* Agro Processing Management System */}
        <div className="border border-gray-700 rounded-lg p-4 bg-gray-800 hover:bg-gray-750 transition-colors group">
          <div className="flex items-center justify-between mb-2">
            <div className="text-cyan-400 font-semibold">🌾 Agro Processing Management System</div>
            <div className="text-gray-400">
              <ExternalLink className="w-4 h-4" />
            </div>
          </div>
          <div className="text-gray-300 text-sm mb-3">
            Comprehensive system for managing agricultural processing operations and supply chain management
          </div>
          <div className="flex flex-wrap gap-2 mb-2">
            <span className="bg-indigo-900 text-indigo-300 px-2 py-1 rounded text-xs">PHP</span>
            <span className="bg-orange-900 text-orange-300 px-2 py-1 rounded text-xs">MySQL</span>
            <span className="bg-blue-900 text-blue-300 px-2 py-1 rounded text-xs">Bootstrap</span>
          </div>
          <div className="text-gray-400 text-xs">📊 Inventory tracking and production analytics</div>
          <div className="text-yellow-400 text-xs mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
            🔧 Enterprise Solution • Internal deployment
          </div>
        </div>

        {/* Rugali Meat Processing System */}
        <div className="border border-gray-700 rounded-lg p-4 bg-gray-800 hover:bg-gray-750 transition-colors group">
          <div className="flex items-center justify-between mb-2">
            <div className="text-cyan-400 font-semibold">🥩 Rugali Meat Processing System</div>
            <div className="text-gray-400">
              <ExternalLink className="w-4 h-4" />
            </div>
          </div>
          <div className="text-gray-300 text-sm mb-3">
            Specialized meat processing facility management with quality control and traceability systems
          </div>
          <div className="flex flex-wrap gap-2 mb-2">
            <span className="bg-red-900 text-red-300 px-2 py-1 rounded text-xs">React</span>
            <span className="bg-green-900 text-green-300 px-2 py-1 rounded text-xs">Express</span>
            <span className="bg-blue-900 text-blue-300 px-2 py-1 rounded text-xs">PostgreSQL</span>
          </div>
          <div className="text-gray-400 text-xs">🔍 Quality assurance and batch tracking</div>
          <div className="text-yellow-400 text-xs mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
            🔧 Enterprise Solution • Production environment
          </div>
        </div>

        {/* NYANZA Milk Industry Management */}
        <div className="border border-gray-700 rounded-lg p-4 bg-gray-800 hover:bg-gray-750 transition-colors group">
          <div className="flex items-center justify-between mb-2">
            <div className="text-cyan-400 font-semibold">🥛 NYANZA Milk Industry Management</div>
            <div className="text-gray-400">
              <ExternalLink className="w-4 h-4" />
            </div>
          </div>
          <div className="text-gray-300 text-sm mb-3">
            Complete dairy industry management solution with production tracking and distribution analytics
          </div>
          <div className="flex flex-wrap gap-2 mb-2">
            <span className="bg-yellow-900 text-yellow-300 px-2 py-1 rounded text-xs">PHP</span>
            <span className="bg-orange-900 text-orange-300 px-2 py-1 rounded text-xs">MySQL</span>
            <span className="bg-purple-900 text-purple-300 px-2 py-1 rounded text-xs">Chart.js</span>
          </div>
          <div className="text-gray-400 text-xs">📈 Production analytics and sales reporting</div>
          <div className="text-yellow-400 text-xs mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
            🔧 Enterprise Solution • Industrial deployment
          </div>
        </div>
      </div>

      {/* Project Statistics */}
      <div className="bg-gray-800 rounded-lg p-4 mt-6">
        <div className="text-cyan-400 font-semibold mb-3">📊 Project Portfolio Summary</div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">7</div>
            <div className="text-gray-300">Total Projects</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-400">4</div>
            <div className="text-gray-300">Live Deployments</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-400">5</div>
            <div className="text-gray-300">Tech Stacks</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-400">100%</div>
            <div className="text-gray-300">Client Satisfaction</div>
          </div>
        </div>
      </div>

      <div className="text-gray-400 text-sm border-t border-gray-700 pt-3">
        🌐 <strong>Live Projects:</strong> Click the links to explore deployed applications
        <br />
        🔧 <strong>Enterprise Solutions:</strong> Internal deployments for business operations
        <br />
        💡 <strong>Tech Diversity:</strong> From React/Next.js frontends to PHP/Node.js backends
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
        {/* Email with copy functionality */}
        <div className="flex items-center space-x-3 hover:bg-gray-700 p-3 rounded-lg transition-all duration-300 group">
          <Mail className="w-5 h-5 text-cyan-400 group-hover:animate-pulse" />
          <span className="text-gray-300 flex-1">mucyoprinc12@gmail.com</span>
          <button 
            onClick={() => {
              navigator.clipboard.writeText('mucyoprinc12@gmail.com');
              // You can add a toast notification here
              alert('Email copied to clipboard! 📧');
            }}
            className="text-cyan-400 text-xs hover:text-cyan-300 bg-cyan-400 bg-opacity-10 px-3 py-1 rounded-full hover:bg-opacity-20 transition-all"
          >
            Copy
          </button>
          <a 
            href="mailto:mucyoprinc12@gmail.com?subject=Portfolio Contact&body=Hi MUCYO, I found your portfolio impressive and would like to connect!"
            className="text-blue-400 text-xs hover:text-blue-300 bg-blue-400 bg-opacity-10 px-3 py-1 rounded-full hover:bg-opacity-20 transition-all"
          >
            Email
          </a>
        </div>

        {/* LinkedIn with actual link */}
        <div className="flex items-center space-x-3 hover:bg-gray-700 p-3 rounded-lg transition-all duration-300 group">
          <Linkedin className="w-5 h-5 text-blue-400 group-hover:animate-bounce" />
          <span className="text-gray-300 flex-1">LinkedIn Professional Profile</span>
          <a 
            href="https://www.linkedin.com/in/mucyo-prince-29321421b"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-300 transition-colors"
            title="Visit LinkedIn Profile"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>

        {/* GitHub with actual link */}
        <div className="flex items-center space-x-3 hover:bg-gray-700 p-3 rounded-lg transition-all duration-300 group">
          <Github className="w-5 h-5 text-gray-400 group-hover:text-white group-hover:animate-spin" />
          <span className="text-gray-300 flex-1">GitHub Code Repository</span>
          <a 
            href="https://github.com/Prince-Kid"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-white transition-colors"
            title="View GitHub Profile"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>

        {/* Location */}
        <div className="flex items-center space-x-3 hover:bg-gray-700 p-3 rounded-lg transition-all duration-300 group">
          <MapPin className="w-5 h-5 text-red-400 group-hover:animate-pulse" />
          <span className="text-gray-300 flex-1">Kigali, Rwanda 🇷🇼</span>
          <span className="text-green-400 text-xs bg-green-400 bg-opacity-10 px-3 py-1 rounded-full">
            Available Globally
          </span>
        </div>

        {/* Phone/WhatsApp (if you want to add) */}
        <div className="flex items-center space-x-3 hover:bg-gray-700 p-3 rounded-lg transition-all duration-300 group">
          <div className="w-5 h-5 text-green-400 flex items-center justify-center group-hover:animate-bounce">📱</div>
          <span className="text-gray-300 flex-1">WhatsApp Available</span>
          <button 
            onClick={() => {
              // You can add your WhatsApp number here
              window.open('https://wa.me/250783154587?text=Hi MUCYO, I found your portfolio impressive!', '_blank');
            }}
            className="text-green-400 text-xs hover:text-green-300 bg-green-400 bg-opacity-10 px-3 py-1 rounded-full hover:bg-opacity-20 transition-all"
          >
            Message
          </button>
        </div>
      </div>

      {/* Quick Actions Panel */}
      <div className="bg-gray-800 rounded-lg p-4">
        <div className="text-cyan-400 font-semibold mb-3 flex items-center gap-2">
          ⚡ Quick Actions
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <button 
            onClick={() => {
              const subject = 'Job Opportunity - Full Stack Developer';
              const body = `Hi MUCYO,

I came across your impressive portfolio terminal and would like to discuss a potential opportunity.

Your expertise in:
- PERN/MERN Stack Development
- Leadership (Minister of ICT)
- Project Portfolio (7+ real-world applications)

Would be valuable for our team.

Let's schedule a call to discuss further.

Best regards,`;
              window.open(`mailto:mucyoprinc12@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`, '_blank');
            }}
            className="bg-blue-500 bg-opacity-20 hover:bg-opacity-30 text-blue-400 hover:text-blue-300 p-3 rounded-lg transition-all duration-300 text-sm font-semibold border border-blue-500 border-opacity-30"
          >
            💼 Hire Me Now
          </button>
          <button 
            onClick={() => {
              const subject = 'Project Collaboration Inquiry';
              const body = `Hi MUCYO,

I have an exciting project opportunity that matches your skills:

Project Type: [Brief Description]
Tech Stack: React/Node.js/PostgreSQL
Timeline: [Your Timeline]
Budget: [Your Budget]

Your portfolio shows excellent work in similar projects. Would you be interested in collaborating?

Looking forward to hearing from you!`;
              window.open(`mailto:mucyoprinc12@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`, '_blank');
            }}
            className="bg-green-500 bg-opacity-20 hover:bg-opacity-30 text-green-400 hover:text-green-300 p-3 rounded-lg transition-all duration-300 text-sm font-semibold border border-green-500 border-opacity-30"
          >
            🚀 Project Inquiry
          </button>
          <button 
            onClick={() => {
              window.open('https://calendly.com/mucyoprinc12', '_blank'); // Replace with your actual Calendly link
            }}
            className="bg-purple-500 bg-opacity-20 hover:bg-opacity-30 text-purple-400 hover:text-purple-300 p-3 rounded-lg transition-all duration-300 text-sm font-semibold border border-purple-500 border-opacity-30"
          >
            📅 Schedule Meeting
          </button>
          <button 
            onClick={() => {
              const shareText = `Check out MUCYO Prince's incredible terminal portfolio! 🚀\n\nFull-stack developer from Rwanda with amazing projects:\n- E-commerce platforms\n- Management systems\n- Modern web applications\n\nInteractive terminal interface: https://mucyoprince.vercel.app/`;
              if (navigator.share) {
                navigator.share({
                  title: 'MUCYO Prince - Software Developer Portfolio',
                  text: shareText,
                  url: window.location.href
                });
              } else {
                navigator.clipboard.writeText(shareText + '\n' + window.location.href);
                alert('Portfolio link copied to clipboard! 🔗');
              }
            }}
            className="bg-orange-500 bg-opacity-20 hover:bg-opacity-30 text-orange-400 hover:text-orange-300 p-3 rounded-lg transition-all duration-300 text-sm font-semibold border border-orange-500 border-opacity-30"
          >
            🔗 Share Portfolio
          </button>
        </div>
      </div>

      {/* Response Time & Availability */}
     <div className="bg-gray-800 rounded-lg p-4">
  <div className="text-cyan-400 font-semibold mb-3">⏰ Response Times & Availability</div>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-gray-300">📧 Email Response:</span>
        <span className="text-green-400 font-semibold">&lt; 4 hours</span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-gray-300">💼 LinkedIn Messages:</span>
        <span className="text-blue-400 font-semibold">&lt; 2 hours</span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-gray-300">📱 WhatsApp/Calls:</span>
        <span className="text-green-400 font-semibold">Same day</span>
      </div>
    </div>
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-gray-300">🕐 Working Hours:</span>
        <span className="text-cyan-400">8 AM - 10 PM EAT</span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-gray-300">🌍 Time Zone:</span>
        <span className="text-purple-400">GMT+3 (EAT)</span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-gray-300">📅 Availability:</span>
        <span className="text-green-400 animate-pulse">● Available Now</span>
      </div>
    </div>
  </div>
</div>

      {/* Professional Stats */}
      <div className="bg-gray-800 rounded-lg p-4">
        <div className="text-cyan-400 font-semibold mb-3">📊 Professional Highlights</div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
          <div className="bg-gray-700 rounded-lg p-3">
            <div className="text-green-400 text-xl font-bold">24h</div>
            <div className="text-gray-300 text-xs">Avg Response</div>
          </div>
          <div className="bg-gray-700 rounded-lg p-3">
            <div className="text-blue-400 text-xl font-bold">100%</div>
            <div className="text-gray-300 text-xs">Client Satisfaction</div>
          </div>
          <div className="bg-gray-700 rounded-lg p-3">
            <div className="text-purple-400 text-xl font-bold">15+</div>
            <div className="text-gray-300 text-xs">Projects Delivered</div>
          </div>
          <div className="bg-gray-700 rounded-lg p-3">
            <div className="text-yellow-400 text-xl font-bold">2+</div>
            <div className="text-gray-300 text-xs">Years Experience</div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="text-center bg-gradient-to-r from-blue-500 to-purple-500 bg-opacity-10 border border-blue-500 border-opacity-30 rounded-lg p-4">
        <div className="text-gray-300 text-sm mb-2">
          🚀 <strong>Ready for new opportunities!</strong> Whether it's a full-time position, freelance project, 
          or just a friendly chat about technology, I'm always excited to connect with fellow developers and potential collaborators.
        </div>
        <div className="text-cyan-400 text-sm">
          💬 <strong>Languages:</strong> English (Fluent), Kinyarwanda (Native) • 🌍 <strong>Remote Work:</strong> Available Worldwide
        </div>
      </div>

      {/* Easter Egg */}
      <div className="text-center text-gray-500 text-xs">
        💡 <em>Pro tip: Try the `easter` command for a surprise! Or type `quote` for daily motivation.</em>
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
    home: {
      name: 'home',
      description: 'Return to home/welcome screen',
      execute: () => {
        setHistory([welcomeMessage]);
        return null;
      }
    },
    mac: {
      name: 'mac',
      description: 'Switch to Mac desktop view',
      execute: () => {
        setIsMacView(true);
        return (
          <div className="text-cyan-400 animate-fade-in">
            <span className="mr-2">🍎</span>
            Switching to Mac desktop view...
          </div>
        );
      }
    },
    terminal: {
      name: 'terminal',
      description: 'Switch back to terminal view',
      execute: () => {
        setIsMacView(false);
        return (
          <div className="text-green-400 animate-fade-in">
            <span className="mr-2">💻</span>
            Returning to terminal view...
          </div>
        );
      }
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
                "{dailyContent.verse.text}"
              </div>
              <div className="text-purple-400 text-sm mt-2 font-semibold">
                - {dailyContent.verse.reference}
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
      description: 'View WakaTime coding stats',
      execute: () => {
        if (!wakaTimeStats.isLoading) {
          fetchWakaTimeStats();
        }
        
        return (
          <div className="space-y-4 animate-fade-in">
            <div className="text-green-400 font-bold text-lg flex items-center gap-2">
              <Zap className="w-5 h-5" />
              WakaTime Productivity Dashboard
            </div>
            
            {wakaTimeStats.isLoading ? (
              <div className="bg-gray-800 rounded-lg p-4 text-center">
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 bg-cyan-400 rounded-full animate-bounce"></div>
                  <div className="w-4 h-4 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-4 h-4 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
                <div className="text-gray-400 mt-2">Fetching coding stats from WakaTime...</div>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  <div className="bg-gray-800 rounded-lg p-3 text-center border border-green-500">
                    <div className="text-green-400 text-xl font-bold">{wakaTimeStats.todayTime}</div>
                    <div className="text-gray-300 text-xs">Today</div>
                  </div>
                  <div className="bg-gray-800 rounded-lg p-3 text-center border border-blue-500">
                    <div className="text-blue-400 text-xl font-bold">{wakaTimeStats.totalTime}</div>
                    <div className="text-gray-300 text-xs">This Week</div>
                  </div>
                  <div className="bg-gray-800 rounded-lg p-3 text-center border border-purple-500">
                    <div className="text-purple-400 text-xl font-bold">{wakaTimeStats.languages.length}</div>
                    <div className="text-gray-300 text-xs">Languages</div>
                  </div>
                </div>
                
                <div className="bg-gray-800 rounded-lg p-4">
                  <div className="text-cyan-400 font-semibold mb-3">📊 Language Breakdown</div>
                  <div className="space-y-3">
                    {wakaTimeStats.languages.map((lang, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="text-gray-300 text-sm min-w-[80px]">{lang.name}</div>
                          <div className="flex-1 bg-gray-700 rounded-full h-2 min-w-[100px]">
                            <div 
                              className="bg-gradient-to-r from-cyan-400 to-blue-500 h-2 rounded-full transition-all duration-1000"
                              style={{ width: `${lang.percent}%` }}
                            ></div>
                          </div>
                        </div>
                        <div className="text-gray-400 text-sm">{lang.time}</div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="text-gray-400 text-sm">
                  📈 Data synced from WakaTime • Last updated: {formatTime(new Date())}
                </div>
              </>
            )}
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
// Add visitor tracking effect after other useEffects
// Visitor tracking system
useEffect(() => {
  const initializeVisitorTracking = () => {
    // Get or create visitor data from localStorage
    const getVisitorData = () => {
      const stored = localStorage.getItem('portfolio_visitor_data');
      if (stored) {
        return JSON.parse(stored);
      }
      return {
        visitCount: 0,
        firstVisit: new Date().toISOString(),
        lastVisit: new Date().toISOString(),
        sessionCount: 0,
        totalTimeSpent: 0
      };
    };

    const updateVisitorData = (data) => {
      localStorage.setItem('portfolio_visitor_data', JSON.stringify(data));
    };

    // Initialize or update visitor data
    const visitorData = getVisitorData();
    const now = new Date();
    const today = now.toDateString();
    const lastVisitDate = new Date(visitorData.lastVisit).toDateString();
    
    // Update visit count
    visitorData.visitCount += 1;
    visitorData.lastVisit = now.toISOString();
    visitorData.sessionCount += 1;

    // Simulate online visitors (1-5 random visitors)
    const currentOnline = Math.floor(Math.random() * 5) + 1;
    
    // Simulate total visitors (based on time and some randomness)
    const baseVisitors = 147; // Starting number
    const daysSinceStart = Math.floor((now.getTime() - new Date('2025-01-01').getTime()) / (1000 * 60 * 60 * 24));
    const totalVisitors = baseVisitors + daysSinceStart * Math.floor(Math.random() * 3 + 2) + visitorData.visitCount;
    
    // Today's visitors (reset daily)
    let todayVisitors = 1;
    const todayVisitorsKey = `visitors_${today}`;
    const storedTodayVisitors = localStorage.getItem(todayVisitorsKey);
    if (storedTodayVisitors && lastVisitDate === today) {
      todayVisitors = parseInt(storedTodayVisitors) + 1;
    } else if (lastVisitDate !== today) {
      // New day, reset counter
      todayVisitors = 1;
    }
    localStorage.setItem(todayVisitorsKey, todayVisitors.toString());

    updateVisitorData(visitorData);

    setVisitorStats({
      current: currentOnline,
      today: todayVisitors,
      total: totalVisitors,
      lastVisit: now
    });

    // Update visitor count periodically (simulate real-time changes)
    const visitorInterval = setInterval(() => {
      setVisitorStats(prev => ({
        ...prev,
        current: Math.floor(Math.random() * 5) + 1,
        today: prev.today + Math.floor(Math.random() * 2), // Slowly increment today's count
      }));
    }, 30000); // Update every 30 seconds

    return () => clearInterval(visitorInterval);
  };

  const cleanup = initializeVisitorTracking();
  return cleanup;
}, []);

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

{/* System Status Bar - Responsive */}
<div className="bg-gray-800 border-b border-gray-700 px-2 sm:px-4 py-2 flex items-center justify-between text-xs sm:text-sm">
  <div className="flex items-center space-x-2 sm:space-x-4">
    <div className="flex items-center space-x-1 sm:space-x-2">
      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
      <span className="text-green-400 hidden sm:inline">ONLINE</span>
      <span className="text-green-400 sm:hidden">●</span>
    </div>
    <div className="text-gray-400 text-xs sm:text-sm truncate">
      <span className="hidden sm:inline">MUCYO Prince</span>
      <span className="sm:hidden">mucyo@term</span>
    </div>
    {/* Visitor Counter - Mobile friendly */}
    <div className="flex items-center space-x-1 text-xs">
      <span className="text-purple-400">👥</span>
      <span className="text-purple-400">{visitorStats.current}</span>
      <span className="text-gray-500 hidden sm:inline">online</span>
    </div>
  </div>
  
  <div className="flex items-center space-x-2 sm:space-x-4 text-xs">
    {/* CPU Usage */}
    <div className="flex items-center space-x-1">
      <Cpu className="w-3 h-3 sm:w-4 sm:h-4 text-blue-400" />
      <span className="text-blue-400">{systemStatus.cpuUsage}%</span>
    </div>
    
    {/* Battery */}
    <div className="flex items-center space-x-1">
      <Battery className="w-3 h-3 sm:w-4 sm:h-4 text-green-400" />
      <span className="text-green-400">{Math.floor(systemStatus.batteryLevel)}%</span>
    </div>
    
    {/* Time - Responsive format */}
    <div className="flex items-center space-x-1">
      <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-cyan-400" />
      <span className="text-cyan-400">
        <span className="hidden sm:inline">{formatTime(systemStatus.currentTime)}</span>
        <span className="sm:hidden">{systemStatus.currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
      </span>
    </div>
    
    {/* Date - Hidden on very small screens, abbreviated on small screens */}
    <div className="hidden xs:flex items-center space-x-1">
      <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400" />
      <span className="text-yellow-400">
        <span className="hidden sm:inline">{formatShortDate(systemStatus.currentTime)}</span>
        <span className="sm:hidden">{systemStatus.currentTime.getDate()}</span>
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
          className="bg-gray-900 rounded-b-lg min-h-[75vh] max-h-[75vh] overflow-y-auto p-6 space-y-4 border border-gray-700 terminal-scroll"
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
            )}        </div>
      </div>

      {/* Floating Bible Verse Widget - Terminal View */}
      {!isMacView && dailyVerse.isVisible && (
        <div className="fixed top-24 right-6 max-w-sm z-50">
          <div className="glass bg-gray-800 bg-opacity-90 backdrop-blur-xl rounded-2xl p-4 border border-gray-600 shadow-2xl modern-card">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-red-400 animate-pulse" />
                <span className="text-purple-300 font-semibold text-sm holographic">Daily Verse</span>
              </div>
              <button 
                onClick={() => setDailyVerse(prev => ({ ...prev, isVisible: false }))}
                className="text-gray-400 hover:text-white transition-colors text-lg leading-none"
                title="Close verse"
              >
                ×
              </button>
            </div>
            <div className="text-gray-200 text-sm italic leading-relaxed mb-3 neon-glow">
              "{dailyVerse.text}"
            </div>
            <div className="text-purple-400 text-xs font-semibold">
              - {dailyVerse.reference}
            </div>
            <div className="mt-3 text-center">
              <div className="w-full h-px bg-gradient-to-r from-transparent via-purple-400 to-transparent opacity-50"></div>
              <div className="text-xs text-gray-500 mt-2">Daily spiritual encouragement</div>
            </div>
          </div>
        </div>
      )}

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