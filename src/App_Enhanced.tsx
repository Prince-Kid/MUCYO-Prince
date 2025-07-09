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
  Home,
  User,
  Monitor,
  Wifi,
  Volume2,
  Search,
  Heart,
  Star,
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
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Utility functions for date formatting
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

  // WakaTime API integration (mock implementation)
  const fetchWakaTimeStats = useCallback(async () => {
    try {
      // Mock data for demonstration - replace with your actual WakaTime API
      setTimeout(() => {
        setWakaTimeStats({
          languages: [
            { name: 'TypeScript', percent: 45, time: '8h 32m' },
            { name: 'React', percent: 25, time: '4h 45m' },
            { name: 'JavaScript', percent: 15, time: '2h 51m' },
            { name: 'CSS', percent: 10, time: '1h 54m' },
            { name: 'Other', percent: 5, time: '58m' }
          ],
          totalTime: '18h 20m',
          todayTime: '6h 15m',
          isLoading: false
        });
      }, 1500);
    } catch (error) {
      console.error('Failed to fetch WakaTime stats:', error);
      setWakaTimeStats(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  // Daily Bible verses and quotes
  const bibleVerses = [
    { text: "I can do all things through Christ who strengthens me.", reference: "Philippians 4:13" },
    { text: "For I know the plans I have for you, declares the Lord, plans to prosper you and not to harm you.", reference: "Jeremiah 29:11" },
    { text: "Trust in the Lord with all your heart and lean not on your own understanding.", reference: "Proverbs 3:5" },
    { text: "Be strong and courageous. Do not be afraid; do not be discouraged.", reference: "Joshua 1:9" },
    { text: "Commit to the Lord whatever you do, and he will establish your plans.", reference: "Proverbs 16:3" },
    { text: "In all your ways submit to him, and he will make your paths straight.", reference: "Proverbs 3:6" },
    { text: "The Lord your God is with you, the Mighty Warrior who saves.", reference: "Zephaniah 3:17" }
  ];

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

  // Commands definition
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
              <p className="text-green-400">
                🚀 Always ready to tackle challenging projects and create meaningful digital experiences!
              </p>
            </div>
          </div>
        </div>
      )
    },
    home: {
      name: 'home',
      description: 'Return to home/welcome screen',
      execute: () => {
        setTimeout(() => {
          setHistory([welcomeMessage]);
        }, 100);
        return (
          <div className="text-cyan-400 animate-fade-in">
            <span className="mr-2">🏠</span>
            Returning to home screen...
          </div>
        );
      }
    },
    mac: {
      name: 'mac',
      description: 'Switch to Mac desktop view',
      execute: () => {
        setTimeout(() => setIsMacView(true), 500);
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
    productivity: {
      name: 'productivity',
      description: 'View WakaTime coding stats',
      execute: () => {
        if (wakaTimeStats.isLoading) {
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
    // Add other commands here (about, skills, projects, etc.)
    clear: {
      name: 'clear',
      description: 'Clear the terminal',
      execute: () => null
    }
  };

  // Welcome message
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

        {/* Floating Bible Verse Widget */}
        {dailyVerse.isVisible && (
          <div className="bg-gray-800 rounded-lg p-4 border-l-4 border-purple-400">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-red-400" />
                <span className="text-purple-300 font-semibold text-sm">Daily Bible Verse</span>
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
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-800 rounded-lg p-4">
            <div className="text-green-400 font-semibold mb-2">🚀 Essential Commands</div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <span className="text-cyan-400 font-mono hover:text-cyan-300 cursor-pointer">about</span>
              <span className="text-cyan-400 font-mono hover:text-cyan-300 cursor-pointer">skills</span>
              <span className="text-cyan-400 font-mono hover:text-cyan-300 cursor-pointer">projects</span>
              <span className="text-cyan-400 font-mono hover:text-cyan-300 cursor-pointer">contact</span>
            </div>
          </div>
          <div className="bg-gray-800 rounded-lg p-4">
            <div className="text-green-400 font-semibold mb-2">✨ Special Features</div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <span className="text-purple-400 font-mono hover:text-purple-300 cursor-pointer">mac</span>
              <span className="text-blue-400 font-mono hover:text-blue-300 cursor-pointer">productivity</span>
              <span className="text-cyan-400 font-mono hover:text-cyan-300 cursor-pointer">home</span>
              <span className="text-green-400 font-mono hover:text-green-300 cursor-pointer">help</span>
            </div>
          </div>
        </div>

        <div className="text-center text-gray-400 text-sm border-t border-gray-700 pt-4">
          🌟 Ready to explore? Try typing <span className="text-cyan-400 font-mono">mac</span> for a modern desktop experience!
        </div>
      </div>
    ),
    timestamp: new Date()
  };

  // Initialize states
  useEffect(() => {
    setHistory([welcomeMessage]);
    fetchWakaTimeStats();
    
    const dailyContent = getDailyContent();
    setDailyVerse({
      text: dailyContent.verse.text,
      reference: dailyContent.verse.reference,
      isVisible: true
    });
  }, [fetchWakaTimeStats]);

  // System status updates
  useEffect(() => {
    const updateSystemStatus = () => {
      setSystemStatus(prev => ({
        cpuUsage: Math.floor(Math.random() * 30) + 10,
        batteryLevel: Math.max(20, prev.batteryLevel - Math.random() * 0.1),
        currentTime: new Date()
      }));
    };

    const interval = setInterval(updateSystemStatus, 2000);
    return () => clearInterval(interval);
  }, []);

  // Other effects for cursor, suggestions, etc.
  useEffect(() => {
    const interval = setInterval(() => {
      setCursorVisible(prev => !prev);
    }, 530);
    return () => clearInterval(interval);
  }, []);

  // Mac Desktop View
  if (isMacView) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900 relative overflow-hidden">
        {/* Mac Menu Bar */}
        <div className="bg-black bg-opacity-50 backdrop-blur-md border-b border-gray-700 px-4 py-1 flex items-center justify-between text-white text-sm">
          <div className="flex items-center space-x-4">
            <div className="font-bold">🍎</div>
            <span>Portfolio</span>
          </div>
          <div className="flex items-center space-x-4">
            <Wifi className="w-4 h-4" />
            <Volume2 className="w-4 h-4" />
            <Battery className="w-4 h-4" />
            <span>{formatTime(systemStatus.currentTime)}</span>
          </div>
        </div>

        {/* Desktop Content */}
        <div className="p-8 h-screen flex flex-col items-center justify-center relative">
          <div className="bg-black bg-opacity-30 backdrop-blur-xl rounded-3xl p-8 max-w-2xl w-full border border-white border-opacity-20 shadow-2xl">
            <div className="text-center mb-6">
              <div className="relative inline-block">
                <div className="w-48 h-48 mx-auto rounded-full bg-gradient-to-r from-gray-400 to-gray-600 flex items-center justify-center border-4 border-white border-opacity-30 shadow-2xl">
                  <User className="w-24 h-24 text-white opacity-80" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-400 rounded-full border-4 border-white animate-pulse"></div>
              </div>
              <h1 className="text-4xl font-bold text-white mt-4">MUCYO Prince</h1>
              <p className="text-xl text-gray-300 mt-2">Software Developer & ICT Leader</p>
            </div>
            
            <div className="flex flex-wrap gap-3 justify-center">
              <button 
                onClick={() => setIsMacView(false)}
                className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-6 py-3 rounded-xl flex items-center gap-2 transition-all duration-300"
              >
                <Terminal className="w-4 h-4" />
                Open Terminal
              </button>
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
        </div>
      </div>
    );
  }

  // Terminal View (simplified for now)
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 text-gray-100 font-mono">
      {/* System Status Bar */}
      <div className="bg-gray-800 border-b border-gray-700 px-4 py-2 flex items-center justify-between text-sm">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-green-400">ONLINE</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Cpu className="w-4 h-4 text-blue-400" />
            <span className="text-blue-400">{systemStatus.cpuUsage}%</span>
          </div>
          <div className="flex items-center space-x-2">
            <Battery className="w-4 h-4 text-green-400" />
            <span className="text-green-400">{Math.floor(systemStatus.batteryLevel)}%</span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-cyan-400" />
            <span className="text-cyan-400">{formatTime(systemStatus.currentTime)}</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="bg-gray-800 rounded-t-lg border-b border-gray-700 p-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <Terminal className="w-4 h-4 text-gray-400 ml-4" />
            <span className="text-gray-400 text-sm">MUCYO-Portfolio-Terminal</span>
          </div>
        </div>

        <div 
          ref={terminalRef}
          className="bg-gray-900 rounded-b-lg min-h-[75vh] max-h-[75vh] overflow-y-auto p-6 space-y-4 border border-gray-700"
        >
          {history.map((entry) => (
            <div key={entry.id} className="space-y-3">
              {entry.command !== 'welcome' && (
                <div className="flex items-center space-x-2">
                  <span className="text-green-400 font-bold">➜</span>
                  <span className="text-cyan-400">mucyo@portfolio</span>
                  <span className="text-gray-500">~</span>
                  <span className="text-gray-100">{entry.command}</span>
                </div>
              )}
              {entry.output && (
                <div className="ml-6 pl-4 border-l-2 border-gray-700">
                  {entry.output}
                </div>
              )}
            </div>
          ))}

          <div className="flex items-center space-x-2">
            <span className="text-green-400 font-bold">➜</span>
            <span className="text-cyan-400">mucyo@portfolio</span>
            <span className="text-gray-500">~</span>
            <input
              ref={inputRef}
              type="text"
              value={currentInput}
              onChange={(e) => setCurrentInput(e.target.value)}
              className="flex-1 bg-transparent outline-none text-gray-100 font-mono"
              placeholder="Type a command... (try 'help' or 'mac')"
              autoFocus
            />
            <div className={`w-2 h-5 bg-green-400 ${cursorVisible ? 'opacity-100' : 'opacity-0'} transition-opacity`}></div>
          </div>
        </div>

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
    </div>
  );
};

export default App;
