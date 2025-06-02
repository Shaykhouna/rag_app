import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MessageSquare, Send, FileUp, Bot } from 'lucide-react';
import { runMemoryAgent, runAiSupportAgent } from '../agent/agents';
import Button from '../components/ui/Button';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
}

const LandingPage = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hi there! I'm AssistAI, your assistant. How can I help you today?",
      sender: 'bot'
    }
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: messages.length + 1,
      text: input,
      sender: 'user'
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');

    // Simulate bot response after a short delay
    setTimeout( async () => {
      const query = input;
      const chunks = await runMemoryAgent(query);
      const randomResponse = await runAiSupportAgent({
        chunks,
        query,
      });

      const botMessage: Message = {
        id: messages.length + 2,
        text: randomResponse,
        sender: 'bot'
      };

      setMessages(prev => [...prev, botMessage]);
    }, 1000);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <header className="py-4 px-6 backdrop-blur-sm bg-dark-900/70 border-b border-dark-800 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Bot className="text-primary-400 h-6 w-6" />
          <span className="font-semibold text-lg text-primary-100">AssistAI</span>
        </div>
        <Link to="/auth">
          <Button primary>Sign In</Button>
        </Link>
      </header>

      {/* Main content */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Chat section */}
        <div className="flex-1 flex flex-col h-full">
          {/* Messages area */}
          <motion.div
            className="flex-1 p-4 overflow-y-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            >
            <div className="max-w-3xl mx-auto space-y-4 pb-20">
              {messages.map((message) => (
                <motion.div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                >
                  <div
                    className={`max-w-[80%] md:max-w-[70%] rounded-2xl px-4 py-3 ${
                      message.sender === 'user'
                      ? 'bg-primary-600 text-white'
                      : 'bg-dark-800/80 backdrop-blur-sm border border-dark-700'
                      }`}
                      >
                    <p>{message.text}</p>
                  </div>
                </motion.div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </motion.div>

          {/* Input area */}
          <div className="p-4 border-t border-dark-800 bg-dark-900/80 backdrop-blur-sm">
            <div className="max-w-3xl mx-auto">
              <form onSubmit={handleSubmit} className="flex items-center gap-2">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type your message..."
                    className="w-full bg-dark-800 border border-dark-700 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-primary-500 text-dark-100"
                    />
                </div>
                <Button type="submit" icon={<Send size={18} />} />
              </form>
            </div>
          </div>
        </div>

        {/* Right sidebar - Feature highlight */}
        {/* <div className="hidden md:block md:w-80 lg:w-96 border-l border-dark-800 p-6 overflow-y-auto">
          <div className="space-y-6">
          <h2 className="text-xl font-semibold text-primary-100">Unlock Full Potential</h2>

          <div className="space-y-4">
          <motion.div
          className="bg-dark-800/70 backdrop-blur-sm border border-dark-700 rounded-xl p-4"
          whileHover={{ y: -5 }}
          transition={{ type: "spring", stiffness: 300 }}
          >
          <div className="flex items-start space-x-3">
          <div className="bg-primary-500/20 p-2 rounded-lg">
          <FileUp className="h-5 w-5 text-primary-400" />
          </div>
          <div>
          <h3 className="font-medium text-primary-200">Secure File Upload</h3>
          <p className="text-sm text-dark-300 mt-1">Upload and manage your files securely with end-to-end encryption</p>
          </div>
          </div>
          </motion.div>

          <motion.div
          className="bg-dark-800/70 backdrop-blur-sm border border-dark-700 rounded-xl p-4"
          whileHover={{ y: -5 }}
          transition={{ type: "spring", stiffness: 300 }}
          >
          <div className="flex items-start space-x-3">
          <div className="bg-secondary-500/20 p-2 rounded-lg">
          <MessageSquare className="h-5 w-5 text-secondary-400" />
          </div>
          <div>
          <h3 className="font-medium text-primary-200">Smart AI Assistance</h3>
          <p className="text-sm text-dark-300 mt-1">Get intelligent insights and assistance for all your files</p>
          </div>
          </div>
          </motion.div>
          </div>

          <Link to="/auth" className="block mt-6">
          <Button primary fullWidth>
          Get Started
          </Button>
          </Link>
          </div>
          </div> */}
      </div>
    </div>
  );
};

export default LandingPage;


      // const botResponses = [
      //   "That's interesting! To upload files securely, you'll need to sign in first.",
      //   "I understand. Would you like to try our secure file upload feature? You'll need to create an account.",
      //   "Great question! Our secure file management system requires authentication. Would you like to sign in?",
      //   "To access all features, including file uploads, please sign in to your account.",
      // ];

      // const randomResponse = botResponses[Math.floor(Math.random() * botResponses.length)];
