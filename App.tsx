import React, { useState, useRef, useEffect } from 'react';
import { HashRouter, Routes, Route, Link, useNavigate, useParams, useLocation } from 'react-router-dom';
import { 
  ShoppingBag, Search, Menu, X, Camera, Sparkles, ArrowRight, Heart, Share2, 
  User, Home, Play, ChevronLeft, Volume2, VolumeX, ArrowUpRight,
  PlusCircle, Upload, Smartphone, Wallet, CreditCard, Truck, CheckCircle, LogOut,
  Sun, Moon, Trash2, Minus, Plus, Ruler, Eye, Clock, Bot, MessageSquare, Send, Lock, ChevronRight,
  Star, Zap, Check, ShieldCheck, Package, RefreshCw, Tag
} from 'lucide-react';
import { MOCK_PRODUCTS, OFFERS, BRANDS_LIST, REELS_DATA, ALL_BRANDS_DATA, STORIES_DATA, OCCASIONS } from './constants';
import { Product, CartItem, Reel, GalleryImage, PaymentMethod, Brand, Story, UserProfile, Review } from './types';
import { generateVirtualTryOn, generateVeoVideo, getAiStylingAdvice } from './services/geminiService';

// --- THEME CONTEXT ---
interface ThemeProps {
  theme: 'dark' | 'light';
  toggleTheme: () => void;
}

interface ProfileProps extends ThemeProps {
  user: UserProfile | null;
  logout: () => void;
}

// --- UI PRIMITIVES (Theme Aware) ---

const Button: React.FC<{
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  variant?: 'primary' | 'secondary' | 'acid' | 'glass' | 'danger' | 'outline';
  className?: string;
  disabled?: boolean;
  fullWidth?: boolean;
  size?: 'sm' | 'md' | 'lg';
}> = ({ children, onClick, variant = 'primary', className = '', disabled = false, fullWidth = false, size = 'md' }) => {
  // Sleek sizing
  const sizeClasses = {
    sm: 'px-4 py-2 text-xs',
    md: 'px-6 py-3 text-sm', 
    lg: 'px-8 py-4 text-base'
  };
  
  const base = "font-sans font-bold tracking-wide transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 active:scale-[0.98]";
  const variants = {
    primary: "bg-white text-black dark:bg-white dark:text-black bg-black text-white hover:opacity-90 rounded-xl shadow-lg",
    secondary: "bg-gray-100 text-black dark:bg-white/10 dark:text-white hover:bg-gray-200 dark:hover:bg-white/20 backdrop-blur-md border border-black/5 dark:border-white/10 rounded-xl",
    acid: "bg-stash-acid text-black hover:bg-[#b8e600] shadow-[0_0_20px_rgba(212,255,0,0.3)] rounded-xl",
    glass: "glass-panel text-black dark:text-white hover:bg-black/5 dark:hover:bg-white/10 rounded-full",
    danger: "bg-red-500 text-white hover:bg-red-600 rounded-xl",
    outline: "bg-transparent border border-black/20 dark:border-white/20 text-black dark:text-white hover:bg-black/5 dark:hover:bg-white/5 rounded-xl"
  };
  
  return (
    <button disabled={disabled} onClick={onClick} className={`${base} ${sizeClasses[size]} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}>
      {children}
    </button>
  );
};

// --- BRANDING ASSETS ---

// NEW VECTOR TECH LOGO
const StashLogo: React.FC<{ className?: string }> = ({ className = "w-10 h-10" }) => (
  <svg viewBox="0 0 512 512" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="512" height="512" rx="120" fill="currentColor" className="text-stash-acid" />
    <path d="M340 140H172C154.3 140 140 154.3 140 172V204C140 221.7 154.3 236 172 236H308C325.7 236 340 250.3 340 268V340C340 357.7 325.7 372 308 372H140V412H308C347.8 412 380 379.8 380 340V268C380 228.2 347.8 196 308 196H172C154.3 196 140 181.7 140 164V132C140 114.3 154.3 100 172 100H340V140Z" fill="#000000" />
  </svg>
);

// --- ANIMATIONS ---
const TrippyTransition: React.FC<{ onFinish: () => void }> = ({ onFinish }) => {
  useEffect(() => {
    const timer = setTimeout(onFinish, 3500);
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className="fixed inset-0 z-[10000] bg-black flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://media.giphy.com/media/3o7aCVqXn0idW/giphy.gif')] opacity-20 bg-cover mix-blend-screen scale-[2] animate-pulse"></div>
      <div className="relative z-10 text-center">
        <h1 className="text-[120px] font-black text-stash-acid tracking-tighter animate-[ping_1s_cubic-bezier(0,0,0.2,1)_infinite]">WOW</h1>
        <p className="text-white text-2xl font-serif italic mt-4 animate-bounce">Entering the Stash...</p>
      </div>
      <div className="absolute inset-0 w-full h-full animate-[spin_4s_linear_infinite] opacity-50">
         <div className="absolute top-1/2 left-1/2 w-[200vw] h-[2px] bg-white -translate-x-1/2"></div>
         <div className="absolute top-1/2 left-1/2 h-[200vh] w-[2px] bg-white -translate-y-1/2"></div>
      </div>
    </div>
  );
};

const PageLoader: React.FC = () => (
    <div className="fixed inset-0 z-[5000] bg-stash-offwhite dark:bg-stash-black flex items-center justify-center">
        <div className="relative">
            <StashLogo className="w-16 h-16 animate-pulse" />
            <div className="absolute -inset-4 border-2 border-stash-acid rounded-full animate-spin border-t-transparent"></div>
        </div>
    </div>
);

// --- CUTE WAIT OVERLAY ---
const CuteWaitOverlay: React.FC = () => {
    const [msgIndex, setMsgIndex] = useState(0);
    const messages = [
        "Weaving some magic... ✨",
        "Asking the fashion gods... 💅",
        "Making sure the fit is perfect... 👗",
        "Almost ready to slay... 🔥",
        "Just a sec, adding extra drip... 💧",
        "You're gonna love this... ❤️",
        "Checking vibes... ✅"
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setMsgIndex(prev => (prev + 1) % messages.length);
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="absolute inset-0 bg-black/80 backdrop-blur-md flex flex-col items-center justify-center z-30 p-6 text-center rounded-2xl">
             <div className="relative w-20 h-20 mb-6">
                 <div className="absolute inset-0 border-4 border-white/20 rounded-full"></div>
                 <div className="absolute inset-0 border-4 border-stash-acid rounded-full border-t-transparent animate-spin"></div>
                 <Sparkles className="absolute inset-0 m-auto text-stash-acid animate-pulse" />
             </div>
             <h3 className="text-xl font-serif text-white mb-2 animate-enter min-h-[3rem]" key={msgIndex}>
                 {messages[msgIndex]}
             </h3>
             <p className="text-white/50 text-xs mt-4">Creating high-res fit (might take ~5-10s)</p>
        </div>
    );
};

// --- PAYMENT SELECTOR ---
const PaymentSelector: React.FC<{ selected: string, onSelect: (id: string) => void }> = ({ selected, onSelect }) => {
  const methods: PaymentMethod[] = [
    { id: 'upi', name: 'UPI (GPay/PhonePe)', icon: Zap },
    { id: 'card', name: 'Credit/Debit Card', icon: CreditCard },
    { id: 'cod', name: 'Cash on Delivery', icon: Truck },
  ];

  return (
    <div className="space-y-2 mb-6">
      <h3 className="font-bold text-sm opacity-60 uppercase tracking-wider mb-3">Payment Method</h3>
      {methods.map(m => (
        <div 
          key={m.id}
          onClick={() => onSelect(m.id)}
          className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all ${
            selected === m.id 
              ? 'bg-stash-acid/10 border-stash-acid text-black dark:text-white' 
              : 'bg-white dark:bg-white/5 border-black/5 dark:border-white/5'
          }`}
        >
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${selected === m.id ? 'bg-stash-acid text-black' : 'bg-black/5 dark:bg-white/10'}`}>
            <m.icon size={20} />
          </div>
          <span className="font-bold flex-1">{m.name}</span>
          {selected === m.id && <CheckCircle className="text-stash-acid" size={20} fill="black" />}
        </div>
      ))}
    </div>
  );
};

// --- ONBOARDING (REVAMPED) ---

const Onboarding: React.FC<{ onComplete: (name: string, phone: string) => void }> = ({ onComplete }) => {
  const [step, setStep] = useState<'landing' | 'phone' | 'otp' | 'name'>('landing');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '']);
  const [name, setName] = useState('');
  const [showTrippy, setShowTrippy] = useState(false);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Focus management
  useEffect(() => {
    if (step === 'otp') {
        setTimeout(() => otpRefs.current[0]?.focus(), 100);
    }
  }, [step]);

  const handleOtpChange = (index: number, value: string) => {
    if (isNaN(Number(value))) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 3) otpRefs.current[index + 1]?.focus();
    
    // Auto submit if filled
    if (index === 3 && value && newOtp.join('').length === 4) {
        if (newOtp.join('') === '1234') {
            setTimeout(() => setStep('name'), 300);
        }
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };
  
  const verifyOtp = () => {
      if (otp.join('') === '1234') {
          setStep('name');
      } else {
          alert('Invalid code. Try 1234');
      }
  };

  if (showTrippy) {
      return <TrippyTransition onFinish={() => onComplete(name, phone)} />;
  }

  // Updated Background Image to a high-quality surreal clouds aesthetic
  const bgImage = "https://images.unsplash.com/photo-1502136969935-8d8eef54d77b?q=80&w=2800";

  return (
    <div className="fixed inset-0 z-[9999] bg-black text-white font-sans overflow-hidden flex flex-col justify-end">
        {/* Background Layer */}
        <div className="absolute inset-0 z-0">
             <img 
               src={bgImage} 
               className="w-full h-full object-cover opacity-80 transition-transform duration-[30s] ease-linear scale-110 animate-[float_20s_ease-in-out_infinite_alternate]" 
               alt="Background"
               onError={(e) => { e.currentTarget.style.display = 'none'; }}
             />
             <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
             {/* Grain */}
             <div className="absolute inset-0 bg-noise opacity-30 mix-blend-overlay"></div>
        </div>

        {/* Brand Header */}
        <div className="absolute top-0 left-0 w-full p-6 pt-safe z-20 flex justify-between items-center">
            <div className="flex items-center gap-2">
                <StashLogo className="w-8 h-8 text-white" />
                <span className="font-serif text-xl tracking-tight">Stash</span>
            </div>
             <div className="text-[10px] font-mono tracking-widest text-white/40 border border-white/10 px-2 py-1 rounded-full backdrop-blur-md">
                EARLY ACCESS
            </div>
        </div>

        {/* Content Container */}
        <div className="relative z-10 w-full max-w-md mx-auto p-8 pb-12 flex flex-col min-h-[50vh] justify-end">
            
            {step === 'landing' && (
                <div className="space-y-6 animate-enter">
                    <h1 className="text-6xl font-serif leading-[0.9] tracking-tight">
                        Find your<br/>
                        <span className="text-stash-acid italic">alter ego.</span>
                    </h1>
                    <p className="text-lg text-white/70 font-light leading-relaxed max-w-xs">
                        The underground marketplace for rising brands and digital fashion.
                    </p>
                    <div className="pt-4">
                        <Button variant="primary" size="lg" fullWidth onClick={() => setStep('phone')} className="rounded-full bg-white text-black hover:scale-105 transition-transform">
                            Enter Stash <ArrowRight size={18} className="ml-1"/>
                        </Button>
                        <p className="text-center text-xs text-white/30 mt-4 font-mono">INVITE ONLY • V3.0</p>
                    </div>
                </div>
            )}

            {step === 'phone' && (
                <div className="space-y-8 animate-enter">
                    <button onClick={() => setStep('landing')} className="text-white/50 hover:text-white flex items-center gap-2 text-xs uppercase tracking-widest font-bold mb-4">
                        <ChevronLeft size={14} /> Back
                    </button>
                    <div>
                        <h2 className="text-4xl font-serif">Your Digits</h2>
                        <p className="text-white/50 text-sm mt-2">We'll text you a secret code.</p>
                    </div>
                    
                    <div className="space-y-4">
                        <div className="relative flex items-center border-b-2 border-white/20 focus-within:border-stash-acid transition-colors py-2">
                            <span className="text-xl font-mono text-white/40 mr-4">+91</span>
                            <input 
                                autoFocus
                                type="tel" 
                                value={phone}
                                onChange={e => setPhone(e.target.value.replace(/\D/g,'').slice(0,10))}
                                className="w-full bg-transparent text-3xl font-mono outline-none placeholder:text-white/10"
                                placeholder="98765..."
                            />
                        </div>
                    </div>

                    <Button 
                        variant="acid" 
                        size="lg" 
                        fullWidth 
                        disabled={phone.length < 10} 
                        onClick={() => setStep('otp')}
                        className="rounded-full mt-4"
                    >
                        Send Code
                    </Button>
                </div>
            )}

            {step === 'otp' && (
                <div className="space-y-8 animate-enter">
                    <button onClick={() => setStep('phone')} className="text-white/50 hover:text-white flex items-center gap-2 text-xs uppercase tracking-widest font-bold mb-4">
                        <ChevronLeft size={14} /> Wrong Number?
                    </button>
                    <div>
                        <h2 className="text-4xl font-serif">Verify</h2>
                        <p className="text-white/50 text-sm mt-2">Enter the code sent to {phone}</p>
                    </div>

                    <div className="flex gap-4">
                        {otp.map((digit, i) => (
                            <div key={i} className="flex-1 aspect-[3/4]">
                                <input
                                    ref={(el) => { if(el) otpRefs.current[i] = el; }}
                                    type="tel"
                                    maxLength={1}
                                    value={digit}
                                    onChange={e => handleOtpChange(i, e.target.value)}
                                    onKeyDown={e => handleOtpKeyDown(i, e)}
                                    className={`w-full h-full bg-white/5 border-b-2 rounded-t-lg text-center text-4xl font-mono outline-none transition-all focus:bg-white/10
                                        ${digit ? 'border-stash-acid text-stash-acid' : 'border-white/20 text-white'}
                                    `}
                                />
                            </div>
                        ))}
                    </div>
                    
                    <div className="flex justify-between items-center">
                         <span className="text-[10px] text-white/30 uppercase tracking-widest font-mono bg-white/5 px-2 py-1 rounded">Dev Code: 1234</span>
                    </div>

                    <Button 
                        variant="primary" 
                        size="lg" 
                        fullWidth 
                        disabled={otp.join('').length < 4}
                        onClick={verifyOtp}
                        className="rounded-full bg-white text-black"
                    >
                        Verify
                    </Button>
                </div>
            )}

            {step === 'name' && (
                <div className="space-y-8 animate-enter">
                    <div>
                        <h2 className="text-4xl font-serif">Identify</h2>
                        <p className="text-white/50 text-sm mt-2">What should we call you?</p>
                    </div>
                    
                    <div className="space-y-4">
                        <input 
                            autoFocus
                            type="text" 
                            value={name}
                            onChange={e => setName(e.target.value)}
                            className="w-full bg-transparent border-b-2 border-white/20 py-4 text-4xl font-serif outline-none focus:border-stash-acid transition-colors placeholder:text-white/10"
                            placeholder="Name..."
                        />
                    </div>

                    <Button 
                        variant="acid" 
                        size="lg" 
                        fullWidth 
                        disabled={name.length < 2}
                        onClick={() => setShowTrippy(true)}
                        className="rounded-full shadow-[0_0_30px_rgba(212,255,0,0.4)]"
                    >
                        Start Exploring
                    </Button>
                </div>
            )}
        </div>
    </div>
  );
};

// --- PAGE: PRODUCT (Premium Vertically Scrolling Layout) ---
const ProductPage: React.FC<{ addToCart: (p: Product, size?: string) => void }> = ({ addToCart }) => {
  const { id } = useParams();
  const product = MOCK_PRODUCTS.find(p => p.id === id) || MOCK_PRODUCTS[0];
  const navigate = useNavigate();

  // States
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [wishlisted, setWishlisted] = useState(false);
  const [pincode, setPincode] = useState('');
  const [deliveryStatus, setDeliveryStatus] = useState<'idle' | 'checking' | 'valid' | 'invalid'>('idle');
  const [deliveryDate, setDeliveryDate] = useState<string>('');
  
  // Try On State
  const [showTryOn, setShowTryOn] = useState(false);
  const [tryOnImg, setTryOnImg] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [compliment, setCompliment] = useState<string>('');

  // AI Stylist State
  const [showStyling, setShowStyling] = useState(false);
  const [stylingQuery, setStylingQuery] = useState('');
  const [stylingAdvice, setStylingAdvice] = useState<string | null>(null);
  const [isStyling, setIsStyling] = useState(false);

  // Mock Data for Sizes
  const sizes = [
      { label: 'S', stock: 'in' },
      { label: 'M', stock: 'in' },
      { label: 'L', stock: 'low' },
      { label: 'XL', stock: 'out' }
  ];

  const handlePincodeCheck = () => {
      if(pincode.length !== 6) {
          setDeliveryStatus('invalid');
          return;
      }
      setDeliveryStatus('checking');
      setTimeout(() => {
          const date = new Date();
          date.setDate(date.getDate() + 3);
          setDeliveryDate(date.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short' }));
          setDeliveryStatus('valid');
      }, 1500);
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: product.name,
          text: `Check out this fit on Stash: ${product.name}`,
          url: window.location.href,
        });
      } else {
        navigator.clipboard.writeText(window.location.href);
        alert("Link copied to clipboard!");
      }
    } catch (error) { console.log('Error sharing', error); }
  };

  const handleGenerate = async () => {
    if (!tryOnImg) return;
    setIsGenerating(true);
    try {
      const result = await generateVirtualTryOn(tryOnImg, product.image, product.description);
      setGeneratedImage(result);
      setCompliment("This fit was made for you! 😍");
    } catch (e) {
      alert("Sorry bestie, I'm still improving my fashion skills! 🥺 Can you try uploading a clearer photo?");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGetStyling = async () => {
    if (!stylingQuery.trim()) return;
    setIsStyling(true);
    try {
      const advice = await getAiStylingAdvice(stylingQuery, `Product: ${product.name}.`);
      setStylingAdvice(advice);
    } catch (e) {
      setStylingAdvice("Stylist is busy.");
    } finally {
      setIsStyling(false);
    }
  };

  return (
    <div className="bg-white dark:bg-stash-black min-h-screen text-black dark:text-white font-sans transition-colors duration-500 pb-28 relative">
       
       {/* Fixed Header Actions */}
       <div className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-6 py-4 pointer-events-none">
          <button onClick={() => navigate(-1)} className="p-3 bg-white/80 dark:bg-black/50 backdrop-blur-xl rounded-full shadow-sm pointer-events-auto hover:scale-105 transition">
             <ChevronLeft size={20} />
          </button>
          <div className="flex gap-3 pointer-events-auto">
              <button onClick={handleShare} className="p-3 bg-white/80 dark:bg-black/50 backdrop-blur-xl rounded-full shadow-sm hover:scale-105 transition">
                 <Share2 size={20} />
              </button>
              <button onClick={() => setWishlisted(!wishlisted)} className="p-3 bg-white/80 dark:bg-black/50 backdrop-blur-xl rounded-full shadow-sm hover:scale-105 transition group">
                 <Heart size={20} className={`transition-colors ${wishlisted ? 'fill-red-500 text-red-500' : ''}`} />
              </button>
          </div>
       </div>

       {/* 1. Hero Image Section */}
       <div className="w-full h-[70vh] relative">
          <img src={product.image} className="w-full h-full object-cover" alt={product.name} />
          <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-white dark:from-stash-black to-transparent"></div>
          
          {/* Try On Floating Trigger */}
          <div className="absolute bottom-8 right-6">
               <button 
                  onClick={() => setShowTryOn(true)}
                  className="flex items-center gap-2 bg-white/90 dark:bg-black/80 backdrop-blur-md px-5 py-3 rounded-full shadow-xl border border-white/20 animate-float hover:scale-105 transition"
               >
                   <Sparkles size={18} className="text-stash-acid" />
                   <span className="font-bold text-sm">Virtual Try-On</span>
               </button>
          </div>
       </div>

       {/* 2. Product Details */}
       <div className="px-6 -mt-6 relative z-10">
          <div className="flex justify-between items-start mb-2">
              <div>
                  <h2 className="text-sm font-bold text-black/50 dark:text-white/50 uppercase tracking-widest mb-1">{product.brand}</h2>
                  <h1 className="text-3xl font-serif leading-tight text-black dark:text-white">{product.name}</h1>
              </div>
              <div className="text-right">
                  <p className="text-2xl font-bold">₹{product.price}</p>
                  <p className="text-sm opacity-40 line-through">₹{product.originalPrice}</p>
              </div>
          </div>

          <div className="flex items-center gap-2 mb-8">
               <div className="flex">
                  {[1,2,3,4,5].map(i => <Star key={i} size={12} className="fill-yellow-400 text-yellow-400"/>)}
               </div>
               <span className="text-xs opacity-60 font-medium">(128 Reviews)</span>
          </div>

          {/* 3. Size Selection - CULT CLASSIC UI */}
          <div className="mb-10">
              <div className="flex justify-between items-center mb-4">
                  <span className="font-mono text-xs font-bold uppercase tracking-widest opacity-60">Select Size</span>
                  <button className="text-xs font-bold flex items-center gap-1 opacity-60 hover:opacity-100"><Ruler size={12}/> Guide</button>
              </div>
              <div className="grid grid-cols-4 gap-0 border border-black/10 dark:border-white/10 rounded-none overflow-hidden">
                  {sizes.map((s, i) => {
                      const isOut = s.stock === 'out';
                      const isSelected = selectedSize === s.label;
                      return (
                          <button
                              key={s.label}
                              disabled={isOut}
                              onClick={() => setSelectedSize(s.label)}
                              className={`
                                  h-14 flex items-center justify-center relative transition-all font-mono text-sm
                                  ${i !== 3 ? 'border-r border-black/10 dark:border-white/10' : ''}
                                  ${isSelected ? 'bg-black dark:bg-white text-white dark:text-black font-bold' : 'bg-transparent hover:bg-black/5 dark:hover:bg-white/5'}
                                  ${isOut ? 'opacity-20 cursor-not-allowed line-through' : ''}
                              `}
                          >
                              {s.label}
                              {s.stock === 'low' && !isSelected && <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-red-500 rounded-full"></div>}
                          </button>
                      );
                  })}
              </div>
          </div>

          {/* 4. Delivery - TERMINAL UI */}
          <div className="mb-10">
              <h3 className="font-mono text-xs font-bold uppercase tracking-widest opacity-60 mb-3">Check Delivery</h3>
              <div className="relative">
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 font-mono text-stash-acid text-lg">{'>'}</span>
                  <input 
                      type="tel" 
                      maxLength={6}
                      placeholder="ENTER_PINCODE" 
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value.replace(/\D/g,''))}
                      className="w-full bg-transparent border-b-2 border-black/10 dark:border-white/10 pl-6 py-2 text-lg font-mono outline-none focus:border-black dark:focus:border-white transition-colors placeholder:text-black/20 dark:placeholder:text-white/20 tracking-widest"
                  />
                  <button onClick={handlePincodeCheck} className="absolute right-0 top-1/2 -translate-y-1/2 text-xs font-bold bg-black/5 dark:bg-white/10 px-3 py-1 rounded uppercase hover:bg-stash-acid hover:text-black transition-colors">Check</button>
              </div>
              {deliveryStatus === 'valid' && (
                  <div className="mt-3 font-mono text-xs space-y-1 text-green-600 dark:text-green-400 animate-enter">
                      <p>[+] Estimated: {deliveryDate}</p>
                      <p>[+] COD Available</p>
                  </div>
              )}
          </div>

          {/* 5. Trust Badges - SPEC SHEET UI */}
          <div className="mb-10 border-t border-b border-black/10 dark:border-white/10 py-4">
               <div className="flex justify-between text-[10px] font-mono uppercase tracking-wider opacity-70">
                  <div className="flex items-center gap-2">
                      <span>Authentic</span>
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  </div>
                  <div className="w-px h-4 bg-current opacity-20"></div>
                  <div className="flex items-center gap-2">
                      <span>QC Passed</span>
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  </div>
                  <div className="w-px h-4 bg-current opacity-20"></div>
                  <div className="flex items-center gap-2">
                      <span>Easy Returns</span>
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  </div>
               </div>
          </div>

          {/* 6. Description & Fit */}
          <div className="space-y-8 mb-10">
              <div>
                  <h3 className="font-serif text-xl mb-3">The Details</h3>
                  <p className="opacity-70 leading-relaxed font-light text-base">
                      {product.description} Featuring premium stitching and durable fabric construction tailored for the modern aesthetic. Designed in Mumbai.
                  </p>
              </div>
              <div>
                  <h3 className="font-serif text-xl mb-3">Size & Fit</h3>
                  <ul className="space-y-2 opacity-70 text-sm list-disc list-inside font-light">
                      <li>Model is 6'1" tall and wearing size L</li>
                      <li>Fit Type: Oversized / Relaxed Fit</li>
                      <li>Composition: 100% Premium Cotton (240 GSM)</li>
                      <li>Care: Machine wash cold, do not tumble dry</li>
                  </ul>
              </div>
          </div>

          {/* 7. AI Styling Section */}
          <div className="mb-10 p-6 bg-gradient-to-br from-black to-gray-900 dark:from-white/5 dark:to-white/10 rounded-3xl text-white">
             <div className="flex justify-between items-center mb-4">
                 <div className="flex items-center gap-2">
                    <Bot className="text-stash-acid" />
                    <h3 className="font-serif text-xl">DripBot Advice</h3>
                 </div>
                 <button onClick={() => setShowStyling(!showStyling)} className="text-xs font-bold underline">
                    {showStyling ? 'Close' : 'Ask'}
                 </button>
             </div>
             {showStyling ? (
                 <div className="animate-enter">
                     {!stylingAdvice ? (
                         <div className="flex gap-2">
                            <input 
                               type="text" 
                               placeholder="How to style this?"
                               value={stylingQuery}
                               onChange={(e) => setStylingQuery(e.target.value)}
                               className="flex-1 bg-white/10 rounded-xl px-4 py-2 text-sm outline-none"
                            />
                            <button onClick={handleGetStyling} disabled={isStyling} className="bg-stash-acid text-black p-2 rounded-lg">
                               {isStyling ? '...' : <ArrowRight size={16}/>}
                            </button>
                         </div>
                     ) : (
                         <div>
                            <p className="text-sm italic opacity-90 mb-3">"{stylingAdvice}"</p>
                            <button onClick={() => setStylingAdvice(null)} className="text-xs font-bold text-stash-acid">Ask another</button>
                         </div>
                     )}
                 </div>
             ) : (
                 <p className="text-sm opacity-60">Not sure how to style this? Ask our AI stylist for outfit ideas.</p>
             )}
          </div>

          {/* 8. Reviews Section */}
          <div className="mb-8">
               <div className="flex justify-between items-end mb-6">
                   <h3 className="font-serif text-2xl">Reviews</h3>
                   <button className="text-xs font-bold underline">Write a Review</button>
               </div>
               
               <div className="space-y-6">
                   {[1, 2].map((review) => (
                       <div key={review} className="border-b border-black/5 dark:border-white/5 pb-6">
                           <div className="flex justify-between mb-2">
                               <div className="flex items-center gap-2">
                                   <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-white/10 flex items-center justify-center text-xs font-bold">AB</div>
                                   <span className="text-sm font-bold">Aryan B.</span>
                               </div>
                               <span className="text-xs opacity-40">2 days ago</span>
                           </div>
                           <div className="flex mb-2">
                               {[1,2,3,4,5].map(i => <Star key={i} size={10} className="fill-black dark:fill-white text-black dark:text-white"/>)}
                           </div>
                           <p className="text-sm opacity-70 leading-relaxed">
                               Absolutely love the fit! The material feels super premium and it looks exactly like the photos. Highly recommend getting a size up if you want that baggy look.
                           </p>
                       </div>
                   ))}
               </div>
               <button className="w-full py-4 text-sm font-bold opacity-50 hover:opacity-100 mt-2">View All 128 Reviews</button>
          </div>
       </div>

       {/* Sticky Bottom CTA Bar */}
       <div className="fixed bottom-0 left-0 w-full p-5 bg-white/80 dark:bg-[#050505]/80 backdrop-blur-xl border-t border-black/5 dark:border-white/5 z-40 pb-safe">
           <div className="flex gap-4 max-w-md mx-auto">
                <div className="flex-1">
                     <p className="text-xs opacity-50 mb-1">Total Price</p>
                     <p className="text-xl font-bold font-serif">₹{product.price}</p>
                </div>
                <Button 
                    variant="acid" 
                    size="lg" 
                    className="flex-[2]" 
                    onClick={() => addToCart(product, selectedSize || 'M')}
                >
                    Add to Bag
                </Button>
           </div>
       </div>

       {/* Virtual Try-On Modal (Same Logic as before) */}
       {showTryOn && (
         <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4">
             <div className="w-full max-w-md bg-[#0A0A0A] rounded-3xl p-6 border border-white/10 max-h-[85vh] overflow-y-auto flex flex-col relative">
                <div className="flex justify-between items-center mb-6 sticky top-0 bg-[#0A0A0A] z-20 py-2">
                    <h3 className="text-2xl font-serif text-white">AI Try-On</h3>
                    <button onClick={() => { setShowTryOn(false); setGeneratedImage(null); setTryOnImg(null); }} className="text-white p-2 bg-white/10 rounded-full hover:bg-white/20"><X size={20}/></button>
                </div>

                {!generatedImage ? (
                    <div className="flex-1 flex flex-col gap-4">
                        <div className="aspect-[3/4] bg-white/5 rounded-2xl border-2 border-dashed border-white/20 flex items-center justify-center relative overflow-hidden">
                            {tryOnImg ? (
                                <img src={tryOnImg} className="w-full h-full object-cover" />
                            ) : (
                                <div className="flex flex-col items-center text-white/50 p-4 text-center">
                                    <Upload size={32} className="mb-2 opacity-50"/>
                                    <p>Tap to upload full-body photo</p>
                                </div>
                            )}
                            <input type="file" className="absolute inset-0 opacity-0 cursor-pointer z-10" onChange={(e) => {
                                if(e.target.files?.[0]) {
                                    const reader = new FileReader();
                                    reader.onload = (ev) => setTryOnImg(ev.target?.result as string);
                                    reader.readAsDataURL(e.target.files[0]);
                                }
                            }}/>
                            {isGenerating && <CuteWaitOverlay />}
                        </div>
                        
                        {tryOnImg && (
                            <Button variant="acid" fullWidth onClick={handleGenerate} disabled={isGenerating}>
                                {isGenerating ? "Wait for it..." : <><Sparkles size={18}/> Generate Look</>}
                            </Button>
                        )}
                    </div>
                ) : (
                    <div className="flex-1 flex flex-col gap-4 animate-enter">
                         <div className="aspect-[3/4] bg-white/5 rounded-2xl border border-white/10 overflow-hidden relative">
                            <img src={generatedImage} className="w-full h-full object-cover" />
                            <div className="absolute top-4 left-4 bg-stash-acid text-black text-xs font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1">
                                <Sparkles size={12}/> Stash loves you ✨
                            </div>
                            <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-md text-black px-4 py-2 rounded-xl shadow-xl text-sm font-bold border-2 border-white">
                                {compliment}
                            </div>
                         </div>
                         <div className="grid grid-cols-2 gap-3">
                            <Button variant="secondary" onClick={() => setGeneratedImage(null)}>Try Another</Button>
                            <Button variant="acid" onClick={() => { addToCart(product, selectedSize || 'M'); setShowTryOn(false); }}>Buy Now</Button>
                         </div>
                    </div>
                )}
             </div>
         </div>
       )}
    </div>
  );
};

// --- OTHER COMPONENTS (Home, etc. remain largely same but consume updated StashLogo) ---

const FloatingDock = () => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;
  
  // Hide on Product Page to avoid overlaying CTAs
  if (location.pathname.startsWith('/product/')) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
      <div className="glass-panel rounded-full px-2 py-2 flex items-center gap-1 shadow-2xl shadow-black/20 dark:shadow-black/50">
        {[
          { path: '/', icon: Home, label: 'Home' },
          { path: '/ai-reels', icon: Play, label: 'Reels' },
          { path: '/picks', icon: Sparkles, label: 'Picks' },
          { path: '/cart', icon: ShoppingBag, label: 'Bag' },
          { path: '/profile', icon: User, label: 'Me' },
        ].map((item) => (
          <Link key={item.path} to={item.path} className={`relative p-4 rounded-full transition-all duration-300 ${isActive(item.path) ? 'bg-black text-white dark:bg-white dark:text-black scale-110' : 'text-black/60 dark:text-white/60 hover:bg-black/5 dark:hover:bg-white/10'}`}>
            <item.icon size={20} strokeWidth={isActive(item.path) ? 2.5 : 2} />
            {isActive(item.path) && <span className="absolute -top-2 -right-1 w-2 h-2 bg-stash-acid rounded-full animate-pulse"></span>}
          </Link>
        ))}
      </div>
    </div>
  );
};

const StoryBubble: React.FC<{ story: Story }> = ({ story }) => {
  const brandId = BRANDS_LIST.find(b => b.name === story.brandName)?.id || '1';
  return (
    <Link to={`/brand/${brandId}`} className="flex flex-col items-center gap-2 cursor-pointer group shrink-0">
      <div className={`w-[72px] h-[72px] rounded-full p-[2px] ${story.isViewed ? 'bg-gray-200 dark:bg-white/20' : 'bg-gradient-to-tr from-stash-acid to-black dark:to-white'}`}>
        <div className="w-full h-full rounded-full border-[3px] border-white dark:border-stash-black overflow-hidden relative">
          <img src={story.image} className="w-full h-full object-cover transition group-hover:scale-110" alt={story.brandName} />
          <img src={story.logo} className="absolute bottom-0 right-0 w-6 h-6 rounded-full border border-white dark:border-black" alt="Logo"/>
        </div>
      </div>
      <span className="text-[10px] font-bold tracking-wider uppercase text-black/80 dark:text-white/80">{story.brandName}</span>
    </Link>
  );
};

const DripBotWidget: React.FC = () => {
  const [expanded, setExpanded] = useState(false);
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<{role: 'user'|'bot', text: string, products?: Product[]}[]>([{ role: 'bot', text: "Hey! I'm DripBot. Ask me anything about your fit!" }]);
  const [loading, setLoading] = useState(false);
  const handleSend = async () => {
    if (!query.trim()) return;
    const userQ = query; setQuery(''); setMessages(prev => [...prev, { role: 'user', text: userQ }]); setLoading(true);
    const keywords = userQ.toLowerCase().split(' ');
    const relatedProducts = MOCK_PRODUCTS.filter(p => keywords.some(k => p.name.toLowerCase().includes(k) || p.tags.some(t => t.includes(k)) || p.category.toLowerCase().includes(k))).slice(0, 3);
    try {
      const responseText = await getAiStylingAdvice(userQ, "Context: User is browsing.");
      setMessages(prev => [...prev, { role: 'bot', text: responseText, products: relatedProducts }]);
    } catch (e) { setMessages(prev => [...prev, { role: 'bot', text: "My connection is a bit fuzzy!" }]); } finally { setLoading(false); }
  };
  return (
    <div className={`mx-5 my-6 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${expanded ? 'h-[500px]' : 'h-auto'}`}>
      {!expanded ? (
        <div onClick={() => setExpanded(true)} className="p-6 rounded-[2rem] bg-gradient-to-r from-[#1a1a1a] to-black border border-white/10 relative overflow-hidden group cursor-pointer shadow-2xl">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-600 blur-[60px] opacity-40 group-hover:opacity-60 transition duration-500"></div>
            <div className="relative z-10 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-purple-400"><Bot size={24} /></div>
                <div><h3 className="text-white font-serif text-xl">Ask DripBot Stylist</h3><p className="text-white/60 text-xs">Tap to expand & chat.</p></div>
                <div className="ml-auto bg-white/10 p-2 rounded-full"><ArrowUpRight className="text-white" size={20} /></div>
            </div>
        </div>
      ) : (
        <div className="h-full flex flex-col rounded-[2rem] bg-[#0A0A0A] border border-white/10 shadow-2xl overflow-hidden relative">
           <div className="p-4 bg-white/5 flex justify-between items-center border-b border-white/5">
              <div className="flex items-center gap-2"><Bot className="text-purple-400" size={20} /><span className="text-white font-bold">DripBot</span></div>
              <button onClick={(e) => { e.stopPropagation(); setExpanded(false); }} className="text-white/50 hover:text-white"><X size={20}/></button>
           </div>
           <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
              {messages.map((m, i) => (
                <div key={i} className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
                   <div className={`max-w-[85%] px-4 py-2 rounded-2xl text-sm ${m.role === 'user' ? 'bg-purple-600 text-white' : 'bg-white/10 text-white/90'}`}>{m.text}</div>
                   {m.products && m.products.length > 0 && (
                     <div className="mt-3 flex gap-3 overflow-x-auto w-full no-scrollbar pb-1">
                        {m.products.map(p => (
                          <Link to={`/product/${p.id}`} key={p.id} className="shrink-0 w-24 bg-white/5 rounded-xl overflow-hidden border border-white/10">
                             <img src={p.image} className="w-full h-24 object-cover" /><div className="p-2"><p className="text-[10px] text-white truncate">{p.name}</p><p className="text-[10px] text-stash-acid">₹{p.price}</p></div>
                          </Link>
                        ))}
                     </div>
                   )}
                </div>
              ))}
              {loading && <div className="text-white/30 text-xs italic ml-4">DripBot is thinking...</div>}
           </div>
           <div className="p-4 bg-white/5 border-t border-white/5 flex gap-2">
              <input className="flex-1 bg-black border border-white/10 rounded-xl px-4 py-2 text-white text-sm outline-none focus:border-purple-500" placeholder="Type your fashion query..." value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSend()} autoFocus />
              <button onClick={handleSend} className="bg-purple-600 p-2 rounded-xl text-white hover:bg-purple-700"><Send size={20}/></button>
           </div>
        </div>
      )}
    </div>
  );
};

const ProductCardHero: React.FC<{ product: Product }> = ({ product }) => (
  <Link to={`/product/${product.id}`} className="block w-[85vw] shrink-0 snap-center relative group">
    <div className="aspect-[4/5] overflow-hidden rounded-[2rem] relative bg-gray-100 dark:bg-gray-900">
      <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-100 dark:opacity-90 dark:group-hover:opacity-60" />
      <div className="absolute top-4 left-4 z-10"><span className="px-3 py-1 bg-white/20 backdrop-blur rounded-full text-white text-xs font-bold flex items-center gap-1 border border-white/10"><Sparkles size={12} /> Try On</span></div>
      <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-white/90 via-white/40 to-transparent dark:from-black dark:via-black/60 dark:to-transparent pt-20">
        <div className="flex justify-between items-end">
          <div><p className="text-stash-acid dark:text-stash-acid font-bold text-xs uppercase tracking-[0.2em] mb-2 mix-blend-darken dark:mix-blend-normal">{product.brand}</p><h3 className="text-3xl font-serif text-black dark:text-white leading-none mb-1">{product.name}</h3></div>
          <div className="w-12 h-12 rounded-full bg-black/10 dark:bg-white/10 backdrop-blur flex items-center justify-center text-black dark:text-white group-hover:bg-stash-acid group-hover:text-black transition-colors"><ArrowUpRight size={24} /></div>
        </div>
      </div>
    </div>
  </Link>
);

const BrandProfilePage = () => {
  const { id } = useParams(); const brand = BRANDS_LIST.find(b => b.id === id); const brandProducts = MOCK_PRODUCTS.filter(p => p.brand === brand?.name || (brand?.name === 'Bonkers Corner' && p.category === 'Tees') || p.brand === 'UrbanThreads' );
  if (!brand) return <div className="pt-20 text-center">Brand not found</div>;
  return (
    <div className="min-h-screen bg-white dark:bg-stash-black text-black dark:text-white pb-32">
      <div className="h-[40vh] relative w-full"><img src={brand.coverImage} className="w-full h-full object-cover" /><div className="absolute inset-0 bg-gradient-to-b from-transparent to-white dark:to-stash-black"></div><Link to="/" className="absolute top-6 left-6 p-3 bg-white/20 backdrop-blur-md rounded-full z-50"><ChevronLeft size={24} className="text-white" /></Link></div>
      <div className="px-5 -mt-20 relative z-10"><div className="glass-panel p-6 rounded-3xl bg-white/50 dark:bg-black/50 border border-black/5 dark:border-white/10 backdrop-blur-xl"><div className="flex justify-between items-start mb-4"><img src={brand.logo} className="w-20 h-20 rounded-full border-4 border-white dark:border-stash-black shadow-xl" /><Button variant="acid" className="px-6 py-2 text-sm">Follow</Button></div><h1 className="text-4xl font-serif mb-1">{brand.name}</h1><p className="text-sm opacity-60 mb-4">{brand.handle} • {brand.followers} Followers</p><p className="text-lg leading-relaxed opacity-90">{brand.description}</p></div></div>
      <div className="px-5 mt-10"><h2 className="text-2xl font-serif mb-6">Collection</h2><div className="grid grid-cols-2 gap-4">{brandProducts.length > 0 ? brandProducts.map(product => (<Link key={product.id} to={`/product/${product.id}`} className="group"><div className="aspect-[3/4] rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-900 mb-3 relative"><img src={product.image} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" /></div><h3 className="font-bold text-sm leading-tight">{product.name}</h3><p className="text-xs opacity-60">₹{product.price}</p></Link>)) : (<p className="col-span-2 text-center opacity-50 py-10">New drop coming soon.</p>)}</div></div>
    </div>
  );
};

const HomePage: React.FC<ThemeProps> = ({ theme, toggleTheme }) => {
  const partyWear = MOCK_PRODUCTS.filter(p => p.tags.includes('party') || p.tags.includes('glam'));
  const tryOnPicks = MOCK_PRODUCTS.filter(p => ['Dresses', 'Tops', 'Sets', 'Jackets'].includes(p.category)).slice(0, 5);
  return (
    <div className="bg-stash-offwhite dark:bg-stash-black min-h-screen pb-32 font-sans selection:bg-stash-acid selection:text-black transition-colors duration-500">
       <header className="px-5 pt-safe pb-4 flex justify-between items-center sticky top-0 z-40 bg-white/80 dark:bg-stash-black/80 backdrop-blur-xl border-b border-black/5 dark:border-white/5">
          <div className="flex items-center gap-2"><StashLogo className="w-8 h-8" /><div className="flex flex-col"><span className="font-serif text-xl text-black dark:text-white leading-none">Stash</span><span className="text-[8px] font-bold uppercase tracking-widest text-stash-acid bg-black px-1 rounded dark:bg-white dark:text-black">Good Stuff</span></div></div>
          <div className="flex gap-4 text-black dark:text-white"><Search size={24} className="opacity-70 hover:opacity-100" /><button onClick={toggleTheme} className="relative opacity-70 hover:opacity-100">{theme === 'dark' ? <Sun size={24} /> : <Moon size={24} />}</button></div>
       </header>
       <div className="px-5 py-6 overflow-x-auto no-scrollbar flex gap-5 border-b border-black/5 dark:border-white/5">{STORIES_DATA.map(story => <StoryBubble key={story.id} story={story} />)}</div>
       <div className="py-4 bg-stash-acid overflow-hidden whitespace-nowrap flex"><div className="animate-marquee flex gap-8 items-center pr-8">{ALL_BRANDS_DATA.map((b, i) => <span key={i} className="text-black font-black uppercase tracking-tight text-sm">{b.name} • </span>)}</div><div className="animate-marquee flex gap-8 items-center pr-8" aria-hidden="true">{ALL_BRANDS_DATA.map((b, i) => <span key={i} className="text-black font-black uppercase tracking-tight text-sm">{b.name} • </span>)}</div></div>
       <DripBotWidget />
       <div className="py-4 px-5"><h3 className="text-black/50 dark:text-white/50 font-bold uppercase tracking-widest text-xs mb-4">Curated For You</h3><div className="flex gap-4 overflow-x-auto no-scrollbar snap-x snap-mandatory">{OFFERS.map(offer => (<div key={offer.id} className={`shrink-0 snap-center w-64 h-32 rounded-2xl bg-gradient-to-r ${offer.bgGradient} p-6 flex justify-between items-center relative overflow-hidden group`}><div className="relative z-10 text-white"><p className="text-xs font-bold opacity-90">{offer.subtitle}</p><h4 className="text-3xl font-black italic">{offer.title}</h4></div><span className="text-6xl opacity-20 group-hover:scale-125 transition duration-500">{offer.icon}</span></div>))}</div></div>
       <div className="py-6 bg-black/5 dark:bg-white/5 mb-8"><div className="px-5 mb-4 flex items-center gap-2"><Sparkles className="text-stash-acid" size={20} /><h2 className="text-2xl font-serif text-black dark:text-white">Virtual Try-On Picks</h2></div><div className="flex overflow-x-auto gap-4 px-5 snap-x snap-mandatory no-scrollbar">{tryOnPicks.map(p => (<Link to={`/product/${p.id}`} key={p.id} className="shrink-0 w-40 group snap-center"><div className="aspect-[3/4] rounded-2xl overflow-hidden relative mb-2"><img src={p.image} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" /><div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition"></div><div className="absolute bottom-2 left-2 right-2 text-center"><span className="px-2 py-1 bg-stash-acid text-black text-[10px] font-bold rounded-full w-full block">Try Now</span></div></div><h4 className="text-xs font-bold truncate">{p.name}</h4><p className="text-xs opacity-60">{p.brand}</p></Link>))}</div></div>
       <div className="pt-2 pb-6"><div className="px-5 mb-6 flex justify-between items-end"><h2 className="text-4xl font-serif text-black dark:text-white leading-[0.9]">Fresh<br/>Drops</h2><span className="text-xs font-mono text-black dark:text-stash-acid border border-black dark:border-stash-acid px-2 py-1 rounded-full">SS25 COLLECTION</span></div><div className="flex overflow-x-auto gap-4 px-5 snap-x snap-mandatory no-scrollbar pb-8">{MOCK_PRODUCTS.slice(0, 8).map(p => <ProductCardHero key={p.id} product={p} />)}</div></div>
       <div className="px-5 mb-8"><h3 className="text-black/50 dark:text-white/50 font-bold uppercase tracking-widest text-xs mb-4">After Hours</h3><div className="grid grid-cols-2 gap-4">{partyWear.slice(0, 6).map(p => (<Link key={p.id} to={`/product/${p.id}`} className="block group"><div className="aspect-[4/5] rounded-2xl overflow-hidden mb-2 relative"><img src={p.image} className="w-full h-full object-cover group-hover:opacity-80 transition" />{p.tags.includes('glam') && <div className="absolute top-2 right-2 bg-purple-500 text-white text-[10px] font-bold px-2 py-0.5 rounded">GLAM</div>}</div><h4 className="font-bold text-sm truncate">{p.name}</h4><p className="text-xs opacity-50">₹{p.price}</p></Link>))}</div></div>
       <div className="px-5 mb-10"><h3 className="text-black/50 dark:text-white/50 font-bold uppercase tracking-widest text-xs mb-6">Trending Brands</h3><div className="grid grid-cols-3 gap-3">{BRANDS_LIST.map(brand => (<Link to={`/brand/${brand.id}`} key={brand.id} className="aspect-square bg-white dark:bg-white/5 rounded-2xl flex flex-col items-center justify-center p-3 border border-black/5 dark:border-white/5 hover:border-stash-acid transition"><img src={brand.logo} className="w-10 h-10 rounded-full mb-2 grayscale hover:grayscale-0 transition" /><span className="text-[10px] font-bold text-center text-black dark:text-white leading-tight">{brand.name}</span></Link>))}<div className="aspect-square rounded-2xl flex items-center justify-center border border-dashed border-black/20 dark:border-white/20"><span className="text-xs text-black/50 dark:text-white/50">View All</span></div></div></div>
       <div className="px-5 pb-10"><h3 className="text-black/50 dark:text-white/50 font-bold uppercase tracking-widest text-xs mb-6">Shop by Mood</h3><div className="grid grid-cols-3 grid-rows-3 gap-2 h-[400px]"><div className="col-span-2 row-span-2 rounded-[2rem] relative overflow-hidden group cursor-pointer"><img src={OCCASIONS[0].image} className="w-full h-full object-cover group-hover:scale-110 transition duration-700" /><div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition"></div><div className="absolute bottom-4 left-4"><h3 className="text-2xl font-serif text-white">{OCCASIONS[0].title}</h3></div></div><div className="col-span-1 row-span-2 bg-stash-acid rounded-[2rem] p-3 flex flex-col items-center justify-between relative overflow-hidden group cursor-pointer"><ArrowRight className="text-black -rotate-45" /><span className="text-xl font-serif text-black writing-vertical rotate-180">{OCCASIONS[1].title}</span></div><div className="col-span-1 row-span-1 rounded-[2rem] relative overflow-hidden group cursor-pointer bg-gray-800"><img src={OCCASIONS[2].image} className="w-full h-full object-cover opacity-60 group-hover:opacity-80" /><span className="absolute center inset-0 flex items-center justify-center text-white font-bold text-xs uppercase tracking-wider">{OCCASIONS[2].title}</span></div><div className="col-span-2 row-span-1 rounded-[2rem] relative overflow-hidden group cursor-pointer bg-gray-800"><img src={OCCASIONS[3].image} className="w-full h-full object-cover opacity-60 group-hover:opacity-80" /><div className="absolute inset-0 flex items-center justify-center gap-2"><h3 className="text-xl font-serif text-white italic">{OCCASIONS[3].title}</h3><ArrowRight size={16} className="text-white" /></div></div></div></div>
       <div className="pb-10 text-center"><p className="text-xs font-mono text-black/30 dark:text-white/30 uppercase tracking-widest">Crafted with 🫶🏻</p></div>
    </div>
  );
};

const PicksPage: React.FC<{ addToCart: (p: Product, size?: string) => void }> = ({ addToCart }) => {
  const [cards, setCards] = useState(MOCK_PRODUCTS); const [liked, setLiked] = useState<Product[]>([]);
  const handleLike = () => { if (cards.length === 0) return; setLiked([...liked, cards[0]]); setCards(cards.slice(1)); };
  const handlePass = () => { if (cards.length === 0) return; setCards(cards.slice(1)); };
  
  // Swipe Logic
  const [dragX, setDragX] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);
  
  const handleTouchStart = (e: React.TouchEvent) => {
      setDragX(0);
      const startX = e.touches[0].clientX;
      const handleMove = (ev: TouchEvent) => {
          setDragX(ev.touches[0].clientX - startX);
      };
      const handleEnd = () => {
          document.removeEventListener('touchmove', handleMove);
          document.removeEventListener('touchend', handleEnd);
          // Check drag distance
          if (dragX > 100) handleLike(); // Right
          else if (dragX < -100) handlePass(); // Left
          else setDragX(0); // Reset
      };
      document.addEventListener('touchmove', handleMove);
      document.addEventListener('touchend', handleEnd);
  };
  
  // Reset dragX if card changes
  useEffect(() => setDragX(0), [cards]);

  if (cards.length === 0) return (<div className="h-screen flex flex-col items-center justify-center bg-stash-offwhite dark:bg-stash-black text-black dark:text-white p-6 text-center"><Sparkles size={48} className="text-stash-acid mb-4" /><h2 className="text-2xl font-serif mb-2">That's all for now!</h2><Button onClick={() => setCards(MOCK_PRODUCTS)}>Reset Deck</Button></div>);
  const current = cards[0]; const next = cards[1];
  
  const rotate = dragX * 0.05;
  const opacity = 1 - Math.abs(dragX) * 0.002;
  
  return (
    <div className="h-screen bg-stash-offwhite dark:bg-stash-black text-black dark:text-white overflow-hidden relative touch-action-none">
       <div className="absolute top-6 left-0 w-full text-center pt-safe z-10"><h1 className="font-serif text-3xl">Top Picks</h1></div>
       <div className="h-full w-full flex items-center justify-center relative">
          {next && (<div className="absolute w-[85vw] h-[60vh] bg-gray-200 dark:bg-gray-800 rounded-3xl scale-95 translate-y-4 opacity-50"><img src={next.image} className="w-full h-full object-cover rounded-3xl" /></div>)}
          <div 
             ref={cardRef}
             onTouchStart={handleTouchStart}
             style={{ transform: `translateX(${dragX}px) rotate(${rotate}deg)`, opacity: opacity }}
             className="w-[85vw] h-[60vh] bg-white dark:bg-gray-900 rounded-3xl shadow-2xl relative overflow-hidden z-20 animate-enter transition-transform duration-0"
          >
             <img src={current.image} className="w-full h-full object-cover pointer-events-none" />
             <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-black/80 to-transparent text-white pointer-events-none">
                 <h2 className="text-3xl font-serif">{current.name}</h2>
                 <p className="text-stash-acid font-bold mb-2">₹{current.price}</p>
                 <div className="flex gap-2 flex-wrap">{current.tags.map(t => <span key={t} className="px-2 py-1 bg-white/20 backdrop-blur rounded-md text-xs uppercase">{t}</span>)}</div>
             </div>
             
             {/* Swipe Indicators */}
             {dragX > 50 && <div className="absolute top-4 left-4 border-4 border-green-500 text-green-500 font-bold px-4 py-2 rounded text-2xl -rotate-12 bg-black/20">LIKE</div>}
             {dragX < -50 && <div className="absolute top-4 right-4 border-4 border-red-500 text-red-500 font-bold px-4 py-2 rounded text-2xl rotate-12 bg-black/20">NOPE</div>}
          </div>
       </div>
       <div className="absolute bottom-24 w-full flex justify-center gap-6 z-30"><button onClick={handlePass} className="w-16 h-16 rounded-full bg-white dark:bg-white/10 shadow-xl flex items-center justify-center text-red-500 hover:scale-110 transition"><X size={32} /></button><button onClick={handleLike} className="w-16 h-16 rounded-full bg-stash-acid shadow-[0_0_30px_rgba(212,255,0,0.4)] flex items-center justify-center text-black hover:scale-110 transition"><Heart size={32} fill="black" /></button></div>
    </div>
  );
};

const CartPage: React.FC<{ cart: CartItem[], updateCart: (id: string, qty: number) => void, checkout: () => void }> = ({ cart, updateCart, checkout }) => {
  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0); const [paymentMethod, setPaymentMethod] = useState('upi'); const [processing, setProcessing] = useState(false); const [success, setSuccess] = useState(false); const navigate = useNavigate();
  const handleCheckout = () => { setProcessing(true); setTimeout(() => { setProcessing(false); setSuccess(true); setTimeout(() => { setSuccess(false); cart.forEach(item => updateCart(item.id, 0)); checkout(); navigate('/'); }, 2500); }, 3000); };
  if (processing) return (<div className="min-h-screen flex flex-col items-center justify-center bg-stash-black text-white"><div className="w-16 h-16 border-4 border-stash-acid rounded-full border-t-transparent animate-spin mb-4"></div><p className="font-serif text-xl animate-pulse">Securely Processing...</p></div>);
  if (success) return (<div className="min-h-screen flex flex-col items-center justify-center bg-stash-acid text-black"><div className="bg-white p-4 rounded-full mb-4 animate-enter"><Check size={48} className="text-black" /></div><h1 className="font-serif text-4xl mb-2">Payment Successful!</h1></div>);
  return (
    <div className="min-h-screen bg-stash-offwhite dark:bg-stash-black text-black dark:text-white pt-safe px-5 pb-32">
       <h1 className="text-4xl font-serif mb-6 mt-4">My Bag <span className="text-lg font-sans opacity-50">({cart.length})</span></h1>
       {cart.length === 0 ? (<div className="flex flex-col items-center justify-center h-[50vh] opacity-50"><ShoppingBag size={64} strokeWidth={1} className="mb-4" /><p>Your bag is empty.</p></div>) : (<div className="space-y-4">{cart.map(item => (<div key={item.id} className="flex gap-4 p-4 bg-white dark:bg-white/5 rounded-2xl border border-black/5 dark:border-white/5"><img src={item.image} className="w-24 h-32 object-cover rounded-xl bg-gray-100" /><div className="flex-1 flex flex-col justify-between"><div><div className="flex justify-between items-start"><h3 className="font-bold leading-tight w-2/3">{item.name}</h3><button onClick={() => updateCart(item.id, 0)} className="text-red-500"><Trash2 size={18}/></button></div><p className="text-xs opacity-60 mt-1">{item.brand} • Size {item.size}</p></div><div className="flex justify-between items-center"><p className="font-mono font-bold">₹{item.price}</p><div className="flex items-center gap-3 bg-gray-100 dark:bg-black rounded-full px-2 py-1"><button onClick={() => updateCart(item.id, item.quantity - 1)}><Minus size={14}/></button><span className="text-xs font-bold w-4 text-center">{item.quantity}</span><button onClick={() => updateCart(item.id, item.quantity + 1)}><Plus size={14}/></button></div></div></div></div>))}<div className="mt-8 p-6 bg-white dark:bg-white/5 rounded-3xl border border-black/5 dark:border-white/5"><PaymentSelector selected={paymentMethod} onSelect={setPaymentMethod} /><div className="flex justify-between mb-2 opacity-60 border-t border-black/10 dark:border-white/10 pt-4"><span>Subtotal</span><span>₹{total}</span></div><div className="flex justify-between text-xl font-bold mb-6 border-t border-black/10 dark:border-white/10 pt-4"><span>Total</span><span>₹{total}</span></div><Button fullWidth variant="acid" onClick={handleCheckout}>Pay & Checkout <ArrowRight size={18} /></Button></div></div>)}
    </div>
  );
};

const ProfilePage: React.FC<ProfileProps> = ({ theme, toggleTheme, user, logout }) => {
  const [aiQuery, setAiQuery] = useState(''); const [aiResponse, setAiResponse] = useState<string | null>(null); const [loadingAi, setLoadingAi] = useState(false);
  const handleAskDripBot = async () => { if (!aiQuery.trim()) return; setLoadingAi(true); setAiResponse(null); try { const res = await getAiStylingAdvice(aiQuery, `User Profile: ${user?.name}`); setAiResponse(res); } catch (e) { setAiResponse("Sorry, I tripped on my laces. Try again."); } finally { setLoadingAi(false); } };
  return (
    <div className="min-h-screen bg-stash-offwhite dark:bg-stash-black text-black dark:text-white pt-safe pb-32">
       <div className="px-5 pt-10 flex justify-between items-start mb-8"><h1 className="text-4xl font-serif">My<br/>Profile</h1><div className="flex gap-2"><button onClick={toggleTheme} className="p-3 rounded-full bg-white dark:bg-white/10 shadow-lg">{theme === 'dark' ? <Sun size={24} /> : <Moon size={24} />}</button></div></div>
       <div className="px-5 mb-8"><div className="flex items-center gap-4 p-4 bg-white dark:bg-white/5 rounded-3xl border border-black/5 dark:border-white/5 relative overflow-hidden"><div className="w-16 h-16 rounded-full bg-gradient-to-br from-stash-acid to-black flex items-center justify-center text-2xl font-serif font-bold text-white">{user?.name.charAt(0) || 'U'}</div><div><h3 className="text-xl font-bold">{user?.name || 'Guest User'}</h3><p className="opacity-50 text-sm">+91 {user?.phone || '00000 00000'}</p></div><StashLogo className="absolute -right-4 -bottom-4 w-24 h-24 opacity-5" /></div></div>
       <div className="px-5 mb-8"><div className="p-6 bg-gradient-to-br from-gray-900 to-black border border-white/10 rounded-3xl text-white relative overflow-hidden"><div className="absolute -right-10 -top-10 w-32 h-32 bg-purple-500 blur-[60px] opacity-30"></div><div className="flex items-center gap-2 mb-4 relative z-10"><Bot className="text-purple-400" /><h3 className="font-bold text-lg">DripBot Stylist</h3></div>{!aiResponse ? (<div className="space-y-3 relative z-10"><p className="text-sm opacity-70">Ask me anything about your style.</p><div className="flex gap-2"><input type="text" value={aiQuery} onChange={e => setAiQuery(e.target.value)} placeholder="What should I wear to..." className="flex-1 bg-white/10 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-purple-500" /><button onClick={handleAskDripBot} disabled={loadingAi} className="bg-purple-500 p-2 rounded-xl hover:bg-purple-600 disabled:opacity-50">{loadingAi ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <Send size={20}/>}</button></div></div>) : (<div className="relative z-10 animate-enter"><p className="text-sm leading-relaxed mb-4 bg-white/5 p-3 rounded-xl border border-white/5">{aiResponse}</p><button onClick={() => { setAiResponse(null); setAiQuery(''); }} className="text-xs text-purple-400 font-bold uppercase">Ask Another</button></div>)}</div></div>
       <div className="px-5 space-y-3">{[{ icon: ShoppingBag, label: 'My Orders' }, { icon: Heart, label: 'Wishlist' }, { icon: Wallet, label: 'Payment Methods' }].map((item, i) => (<button key={i} className={`w-full flex items-center justify-between p-4 bg-white dark:bg-white/5 rounded-2xl border border-black/5 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-white/10`}><div className="flex items-center gap-4"><item.icon size={20} /><span className="font-bold">{item.label}</span></div><ChevronLeft size={16} className="rotate-180 opacity-50" /></button>))} <button onClick={logout} className={`w-full flex items-center justify-between p-4 bg-white dark:bg-white/5 rounded-2xl border border-black/5 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-white/10 text-red-500`}><div className="flex items-center gap-4"><LogOut size={20} /><span className="font-bold">Log Out</span></div><ChevronLeft size={16} className="rotate-180 opacity-50" /></button></div>
    </div>
  );
};

const StashReels: React.FC<{ reels: Reel[] }> = ({ reels }) => {
  return (
    <div className="bg-black h-screen w-full relative">
       <div className="absolute top-0 left-0 w-full z-30 p-6 pt-safe flex justify-between items-center pointer-events-none text-white"><span className="font-serif text-3xl font-bold drop-shadow-lg">Reels</span><Camera className="pointer-events-auto cursor-pointer" /></div>
       <div className="h-full w-full overflow-y-scroll snap-y snap-mandatory no-scrollbar">{reels.map((reel) => (<div key={reel.id} className="h-screen w-full snap-start relative bg-gray-900"><video src={reel.videoUrl} className="h-full w-full object-cover" loop autoPlay muted playsInline /><div className="absolute bottom-0 left-0 w-full p-6 pb-32 bg-gradient-to-t from-black/90 via-black/40 to-transparent"><div className="flex items-center gap-3 mb-4"><img src={reel.userAvatar} className="w-10 h-10 rounded-full border-2 border-white" /><span className="text-white font-bold">{reel.user}</span><button className="px-3 py-1 bg-white/20 backdrop-blur rounded-full text-[10px] font-bold text-white uppercase">Follow</button></div><p className="text-white/90 text-sm mb-4 line-clamp-2">{reel.product.description}</p><div className="glass-panel p-3 rounded-xl flex items-center gap-4"><img src={reel.product.image} className="w-10 h-10 rounded-lg object-cover" /><div className="flex-1"><p className="text-white text-xs font-bold">{reel.product.name}</p><p className="text-stash-acid text-xs">₹{reel.product.price}</p></div><button className="bg-white text-black p-2 rounded-lg"><ShoppingBag size={16}/></button></div></div></div>))}</div>
    </div>
  );
};

const App = () => {
  const [cart, setCart] = useState<CartItem[]>([]); const [reels, setReels] = useState<Reel[]>(REELS_DATA); const [theme, setTheme] = useState<'dark'|'light'>('dark'); const [user, setUser] = useState<UserProfile | null>(null); const [pageLoading, setPageLoading] = useState(false); const location = useLocation();
  useEffect(() => { setPageLoading(true); const timer = setTimeout(() => setPageLoading(false), 800); return () => clearTimeout(timer); }, [location.pathname]);
  useEffect(() => { const savedUser = localStorage.getItem('stash_user'); if (savedUser) setUser(JSON.parse(savedUser)); }, []);
  const handleOnboardingComplete = (name: string, phone: string) => { const newUser = { name, phone, isLoggedIn: true, joinedDate: new Date().toISOString() }; setUser(newUser); localStorage.setItem('stash_user', JSON.stringify(newUser)); };
  const handleLogout = () => { setUser(null); localStorage.removeItem('stash_user'); };
  const addToCart = (p: Product, size: string = 'M') => { const exists = cart.find(i => i.id === p.id && i.size === size); if (exists) setCart(cart.map(i => (i.id === p.id && i.size === size) ? { ...i, quantity: i.quantity + 1 } : i)); else setCart([...cart, { ...p, quantity: 1, size }]); };
  const updateCart = (id: string, qty: number) => { if (qty <= 0) setCart(cart.filter(i => i.id !== id)); else setCart(cart.map(i => i.id === id ? { ...i, quantity: qty } : i)); };
  const checkout = () => { console.log("Checkout completed"); };
  const toggleTheme = () => { setTheme(prev => prev === 'dark' ? 'light' : 'dark'); };
  useEffect(() => { document.documentElement.classList.remove('dark', 'light'); document.documentElement.classList.add(theme); const handleContextMenu = (e: MouseEvent) => { e.preventDefault(); return false; }; window.addEventListener('contextmenu', handleContextMenu); return () => window.removeEventListener('contextmenu', handleContextMenu); }, [theme]);

  return (
      <div className={`min-h-screen font-sans antialiased bg-noise text-black dark:text-white`}>
        {pageLoading && user && <PageLoader />}
        {!user ? (<Onboarding onComplete={handleOnboardingComplete} />) : (
          <>
            <Routes>
              <Route path="/" element={<HomePage theme={theme} toggleTheme={toggleTheme} />} />
              <Route path="/product/:id" element={<ProductPage addToCart={addToCart} />} />
              <Route path="/brand/:id" element={<BrandProfilePage />} />
              <Route path="/ai-reels" element={<StashReels reels={reels} />} />
              <Route path="/cart" element={<CartPage cart={cart} updateCart={updateCart} checkout={checkout} />} />
              <Route path="/profile" element={<ProfilePage theme={theme} toggleTheme={toggleTheme} user={user} logout={handleLogout} />} />
              <Route path="/picks" element={<PicksPage addToCart={addToCart} />} />
            </Routes>
            <FloatingDock />
          </>
        )}
      </div>
  );
};

export default App;