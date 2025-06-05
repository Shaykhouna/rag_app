import { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Mail, Bot, ArrowLeft } from 'lucide-react';
import { AuthContext, useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';


const AuthPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  // const auth = useContext(AuthContext);

  // useEffect(() => {
  //   if (!auth?.user) {
  //     navigate('/auth');
  //   }
  // }, [auth, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const success = await login(email, password);
      if (success) {
        navigate('/dashboard');
      } else {
        setError('Invalid credentials. Please check your email and password.');
      }
    } catch (err) {
      setError('An error occurred during authentication.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="p-4">
        <Link to="/" className="inline-flex items-center text-primary-400 hover:text-primary-300">
          <ArrowLeft size={16} className="mr-1" />
          <span>Back to Home</span>
        </Link>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <motion.div
          className="w-full max-w-md bg-dark-800/40 backdrop-blur-md border border-dark-700 rounded-2xl overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="p-8">
            <div className="flex justify-center mb-6">
              <div className="bg-primary-500/10 p-3 rounded-full">
                <Bot className="h-8 w-8 text-primary-400" />
              </div>
            </div>

            <h2 className="text-2xl font-semibold text-center text-primary-100 mb-2">Welcome to AssistAI</h2>
            <p className="text-center text-dark-400 mb-8">Sign in to access secure file uploads</p>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg mb-6">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-dark-300 mb-1">
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-dark-500" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="block w-full pl-10 pr-3 py-3 bg-dark-900 border border-dark-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-dark-100"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-dark-300 mb-1">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-dark-500" />
                  </div>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="block w-full pl-10 pr-3 py-3 bg-dark-900 border border-dark-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-dark-100"
                    placeholder="Min 6 characters"
                    minLength={6}
                  />
                </div>
              </div>

              <div>
                <Button
                  type="submit"
                  primary
                  fullWidth
                  disabled={isLoading}
                >
                  {isLoading ? 'Signing in...' : 'Sign In'}
                </Button>
              </div>
            </form>

            <div className="mt-6 text-center text-sm text-dark-400">
              <p>For demo purposes, any email and password (min 6 chars) will work</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AuthPage;
