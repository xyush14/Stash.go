
import React, { useState, useRef, useEffect } from 'react';
import { HashRouter, Routes, Route, Link, useNavigate, useParams, useLocation } from 'react-router-dom';
import { 
  ShoppingBag, Search, Menu, X, Camera, Sparkles, ArrowRight, Heart, Share2, 
  User, Home, Play, ChevronLeft, Volume2, VolumeX, ArrowUpRight,
  PlusCircle, Upload, Smartphone, Wallet, CreditCard, Truck, CheckCircle, LogOut,
  Sun, Moon, Trash2, Minus, Plus, Ruler, Eye, Clock, Bot, MessageSquare, Send, Lock, ChevronRight,
  Star, Zap
} from 'lucide-react';
import { MOCK_PRODUCTS, OFFERS, BRANDS_LIST, REELS_DATA, ALL_BRANDS_DATA, STORIES_DATA, OCCASIONS } from './constants';
import { Product, CartItem, Reel, GalleryImage, PaymentMethod, Brand, Story, UserProfile } from './types';
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
  variant?: 'primary' | 'secondary' | 'acid' | 'glass' | 'danger';
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
    danger: "bg-red-500 text-white hover:bg-red-600 rounded-xl"
  };
  
  return (
    <button disabled={disabled} onClick={onClick} className={`${base} ${sizeClasses[size]} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}>
      {children}
    </button>
  );
};

// --- BRANDING ASSETS ---

const StashLogo: React.FC<{ className?: string }> = ({ className = "w-10 h-10" }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 20L50 20L80 50L80 80L50 80L20 50L20 20Z" className="fill-black dark:fill-white" fillOpacity="0.2"/>
    <path d="M20 20L50 50L20 80V20Z" className="fill-stash-acid"/>
    <path d="M80 80L50 50L80 20V80Z" className="fill-black dark:fill-white"/>
  </svg>
);

// --- TRIPPY TRANSITION ---
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
      {/* Starfield effect simulated */}
      <div className="absolute inset-0 w-full h-full animate-[spin_4s_linear_infinite] opacity-50">
         <div className="absolute top-1/2 left-1/2 w-[200vw] h-[2px] bg-white -translate-x-1/2"></div>
         <div className="absolute top-1/2 left-1/2 h-[200vh] w-[2px] bg-white -translate-y-1/2"></div>
      </div>
    </div>
  );
}

// --- ONBOARDING FLOW ---

const Onboarding: React.FC<{ onComplete: (name: string, phone: string) => void }> = ({ onComplete }) => {
  const [step, setStep] = useState<'phone' | 'otp' | 'name'>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [showTrippy, setShowTrippy] = useState(false);

  const handlePhoneSubmit = () => {
    if (phone.length < 10) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep('otp');
    }, 1500);
  };

  const handleOtpSubmit = () => {
    if (otp.length < 4) return;
    if (otp !== '1234') return alert("Invalid OTP. Hint: 1234");
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep('name');
    }, 1000);
  };

  const handleNameSubmit = () => {
    if (name.length < 2) return;
    setShowTrippy(true);
  };

  if (showTrippy) {
    return <TrippyTransition onFinish={() => onComplete(name, phone)} />;
  }

  return (
    <div className="fixed inset-0 z-[9999] bg-stash-black text-white flex flex-col items-center justify-center p-8">
       <div className="w-full max-w-md flex flex-col h-full justify-between py-10">
          
          {/* Header */}
          <div className="flex flex-col items-center">
             <StashLogo className="w-20 h-20 mb-6 animate-float" />
             <h1 className="font-serif text-4xl text-center">
               {step === 'phone' && "Welcome to Stash."}
               {step === 'otp' && "Verify Access."}
               {step === 'name' && "What should we call you?"}
             </h1>
             <p className="text-white/50 mt-2 text-center">
               {step === 'phone' && "Stash - Find good stuff here."}
               {step === 'otp' && `Sent to +91 ${phone}`}
               {step === 'name' && "Let's get introduced."}
             </p>
          </div>

          {/* Form Area */}
          <div className="flex-1 flex flex-col justify-center gap-6">
             
             {step === 'phone' && (
               <div className="space-y-4 animate-enter">
                  <div className="bg-white/10 border border-white/10 rounded-2xl p-4 flex items-center gap-3 transition focus-within:border-stash-acid">
                     <span className="text-stash-acid font-bold">+91</span>
                     <input 
                       type="tel" 
                       value={phone}
                       onChange={(e) => setPhone(e.target.value.replace(/\D/g,'').slice(0,10))}
                       className="bg-transparent border-none outline-none text-xl font-mono w-full placeholder:text-white/20"
                       autoFocus
                     />
                  </div>
                  <Button 
                    variant="acid" 
                    fullWidth 
                    size="lg" 
                    onClick={handlePhoneSubmit} 
                    disabled={loading || phone.length < 10}
                  >
                    {loading ? "Sending..." : "Get OTP"}
                  </Button>
               </div>
             )}

             {step === 'otp' && (
               <div className="space-y-4 animate-enter">
                  <div className="flex justify-between gap-2">
                     {[0,1,2,3].map((i) => (
                       <div key={i} className={`w-16 h-20 bg-white/10 border rounded-2xl flex items-center justify-center text-3xl font-mono relative overflow-hidden transition-all ${otp.length === i ? 'border-stash-acid scale-105' : 'border-white/10'}`}>
                          {otp[i] || ""}
                       </div>
                     ))}
                  </div>
                  <input 
                     type="tel" 
                     value={otp}
                     onChange={(e) => setOtp(e.target.value.replace(/\D/g,'').slice(0,4))}
                     className="absolute opacity-0 inset-0 h-1/2" 
                     autoFocus
                  />
                  <Button 
                    variant="acid" 
                    fullWidth 
                    size="lg" 
                    onClick={handleOtpSubmit} 
                    disabled={loading || otp.length < 4}
                  >
                    {loading ? "Verifying..." : "Verify Access"}
                  </Button>
                  <p className="text-center text-xs text-white/40">Hint: Enter 1234</p>
               </div>
             )}

            {step === 'name' && (
               <div className="space-y-4 animate-enter">
                  <div className="bg-white/10 border border-white/10 rounded-2xl p-4 transition focus-within:border-stash-acid">
                     <input 
                       type="text" 
                       value={name}
                       onChange={(e) => setName(e.target.value)}
                       className="bg-transparent border-none outline-none text-xl w-full placeholder:text-white/20 text-center"
                       autoFocus
                     />
                  </div>
                  <Button 
                    variant="acid" 
                    fullWidth 
                    size="lg" 
                    onClick={handleNameSubmit} 
                    disabled={loading || name.length < 2}
                  >
                    {loading ? "Creating Profile..." : "Enter Stash"}
                  </Button>
               </div>
             )}

          </div>

          {/* Footer */}
          <div className="text-center opacity-30 text-xs">
             By joining, you agree to our Terms & Privacy.
          </div>
       </div>
    </div>
  );
};

// --- NAVIGATION (Floating Dock) ---

const FloatingDock = () => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;
  
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
          <Link 
            key={item.path} 
            to={item.path} 
            className={`relative p-4 rounded-full transition-all duration-300 ${
              isActive(item.path) 
                ? 'bg-black text-white dark:bg-white dark:text-black scale-110' 
                : 'text-black/60 dark:text-white/60 hover:bg-black/5 dark:hover:bg-white/10'
            }`}
          >
            <item.icon size={20} strokeWidth={isActive(item.path) ? 2.5 : 2} />
            {isActive(item.path) && (
              <span className="absolute -top-2 -right-1 w-2 h-2 bg-stash-acid rounded-full animate-pulse"></span>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
};

// --- COMPONENT: STORY BUBBLE ---
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

// --- COMPONENT: DRIPBOT WIDGET (EXPANDABLE) ---
const DripBotWidget: React.FC = () => {
  const [expanded, setExpanded] = useState(false);
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<{role: 'user'|'bot', text: string, products?: Product[]}[]>([
    { role: 'bot', text: "Hey! I'm DripBot. Ask me anything about your fit, or what to wear tonight!" }
  ]);
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!query.trim()) return;
    const userQ = query;
    setQuery('');
    setMessages(prev => [...prev, { role: 'user', text: userQ }]);
    setLoading(true);

    // Keyword analysis logic
    const keywords = userQ.toLowerCase().split(' ');
    const relatedProducts = MOCK_PRODUCTS.filter(p => 
      keywords.some(k => 
        p.name.toLowerCase().includes(k) || 
        p.tags.some(t => t.includes(k)) || 
        p.category.toLowerCase().includes(k) ||
        (k === 'party' && p.tags.includes('party')) ||
        (k === 'summer' && p.tags.includes('summer'))
      )
    ).slice(0, 3);

    try {
      const responseText = await getAiStylingAdvice(userQ, "Context: User is browsing the home screen looking for recommendations.");
      setMessages(prev => [...prev, { role: 'bot', text: responseText, products: relatedProducts }]);
    } catch (e) {
      setMessages(prev => [...prev, { role: 'bot', text: "My connection is a bit fuzzy, but you look great anyway!" }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`mx-5 my-6 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${expanded ? 'h-[500px]' : 'h-auto'}`}>
      {!expanded ? (
        <div 
          onClick={() => setExpanded(true)}
          className="p-6 rounded-[2rem] bg-gradient-to-r from-[#1a1a1a] to-black border border-white/10 relative overflow-hidden group cursor-pointer shadow-2xl"
        >
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-600 blur-[60px] opacity-40 group-hover:opacity-60 transition duration-500"></div>
            <div className="relative z-10 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-purple-400">
                   <Bot size={24} />
                </div>
                <div>
                   <h3 className="text-white font-serif text-xl">Ask DripBot Stylist</h3>
                   <p className="text-white/60 text-xs">Tap to expand & chat.</p>
                </div>
                <div className="ml-auto bg-white/10 p-2 rounded-full">
                  <ArrowUpRight className="text-white" size={20} />
                </div>
            </div>
        </div>
      ) : (
        <div className="h-full flex flex-col rounded-[2rem] bg-[#0A0A0A] border border-white/10 shadow-2xl overflow-hidden relative">
           {/* Header */}
           <div className="p-4 bg-white/5 flex justify-between items-center border-b border-white/5">
              <div className="flex items-center gap-2">
                 <Bot className="text-purple-400" size={20} />
                 <span className="text-white font-bold">DripBot</span>
              </div>
              <button onClick={(e) => { e.stopPropagation(); setExpanded(false); }} className="text-white/50 hover:text-white"><X size={20}/></button>
           </div>
           
           {/* Chat Area */}
           <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
              {messages.map((m, i) => (
                <div key={i} className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
                   <div className={`max-w-[85%] px-4 py-2 rounded-2xl text-sm ${m.role === 'user' ? 'bg-purple-600 text-white' : 'bg-white/10 text-white/90'}`}>
                      {m.text}
                   </div>
                   {/* Product Recommendations inside Chat */}
                   {m.products && m.products.length > 0 && (
                     <div className="mt-3 flex gap-3 overflow-x-auto w-full no-scrollbar pb-1">
                        {m.products.map(p => (
                          <Link to={`/product/${p.id}`} key={p.id} className="shrink-0 w-24 bg-white/5 rounded-xl overflow-hidden border border-white/10">
                             <img src={p.image} className="w-full h-24 object-cover" />
                             <div className="p-2">
                                <p className="text-[10px] text-white truncate">{p.name}</p>
                                <p className="text-[10px] text-stash-acid">₹{p.price}</p>
                             </div>
                          </Link>
                        ))}
                     </div>
                   )}
                </div>
              ))}
              {loading && <div className="text-white/30 text-xs italic ml-4">DripBot is thinking...</div>}
           </div>
           
           {/* Input */}
           <div className="p-4 bg-white/5 border-t border-white/5 flex gap-2">
              <input 
                className="flex-1 bg-black border border-white/10 rounded-xl px-4 py-2 text-white text-sm outline-none focus:border-purple-500"
                placeholder="Type your fashion query..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                autoFocus
              />
              <button onClick={handleSend} className="bg-purple-600 p-2 rounded-xl text-white hover:bg-purple-700"><Send size={20}/></button>
           </div>
        </div>
      )}
    </div>
  );
};

// --- COMPONENT: EDITORIAL PRODUCT CARD ---
const ProductCardHero: React.FC<{ product: Product }> = ({ product }) => (
  <Link to={`/product/${product.id}`} className="block w-[85vw] shrink-0 snap-center relative group">
    <div className="aspect-[4/5] overflow-hidden rounded-[2rem] relative bg-gray-100 dark:bg-gray-900">
      <img 
        src={product.image} 
        alt={product.name} 
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-100 dark:opacity-90 dark:group-hover:opacity-60"
      />
      
      {/* Try On Badge */}
      <div className="absolute top-4 left-4 z-10">
         <span className="px-3 py-1 bg-white/20 backdrop-blur rounded-full text-white text-xs font-bold flex items-center gap-1 border border-white/10">
            <Sparkles size={12} /> Try On
         </span>
      </div>

      {/* Overlay Content */}
      <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-white/90 via-white/40 to-transparent dark:from-black dark:via-black/60 dark:to-transparent pt-20">
        <div className="flex justify-between items-end">
          <div>
            <p className="text-stash-acid dark:text-stash-acid font-bold text-xs uppercase tracking-[0.2em] mb-2 mix-blend-darken dark:mix-blend-normal">{product.brand}</p>
            <h3 className="text-3xl font-serif text-black dark:text-white leading-none mb-1">{product.name}</h3>
          </div>
          <div className="w-12 h-12 rounded-full bg-black/10 dark:bg-white/10 backdrop-blur flex items-center justify-center text-black dark:text-white group-hover:bg-stash-acid group-hover:text-black transition-colors">
            <ArrowUpRight size={24} />
          </div>
        </div>
      </div>
    </div>
  </Link>
);

// --- PAGE: BRAND PROFILE ---
const BrandProfilePage = () => {
  const { id } = useParams();
  const brand = BRANDS_LIST.find(b => b.id === id);
  const brandProducts = MOCK_PRODUCTS.filter(p => p.brand === brand?.name || (brand?.name === 'Bonkers Corner' && p.category === 'Tees')); 

  if (!brand) return <div className="pt-20 text-center">Brand not found</div>;

  return (
    <div className="min-h-screen bg-white dark:bg-stash-black text-black dark:text-white pb-32">
      {/* Hero Cover */}
      <div className="h-[40vh] relative w-full">
        <img src={brand.coverImage} className="w-full h-full object-cover" alt="Cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white dark:to-stash-black"></div>
        <Link to="/" className="absolute top-6 left-6 p-3 bg-white/20 backdrop-blur-md rounded-full z-50">
           <ChevronLeft size={24} className="text-white" />
        </Link>
      </div>

      {/* Brand Info Card */}
      <div className="px-5 -mt-20 relative z-10">
        <div className="glass-panel p-6 rounded-3xl bg-white/50 dark:bg-black/50 border border-black/5 dark:border-white/10 backdrop-blur-xl">
           <div className="flex justify-between items-start mb-4">
              <img src={brand.logo} className="w-20 h-20 rounded-full border-4 border-white dark:border-stash-black shadow-xl" />
              <Button variant="acid" className="px-6 py-2 text-sm">Follow</Button>
           </div>
           <h1 className="text-4xl font-serif mb-1">{brand.name}</h1>
           <p className="text-sm opacity-60 mb-4">{brand.handle} • {brand.followers} Followers</p>
           <p className="text-lg leading-relaxed opacity-90">{brand.description}</p>
           
           {brand.endorsedBy.length > 0 && (
             <div className="mt-6 pt-6 border-t border-black/10 dark:border-white/10">
                <p className="text-xs uppercase tracking-widest opacity-50 mb-3">As Seen On</p>
                <div className="flex gap-3">
                  {brand.endorsedBy.map((c, i) => (
                    <div key={i} className="flex flex-col items-center">
                       <img src={c.image} className="w-12 h-12 rounded-full object-cover border border-white/20" />
                       <span className="text-[10px] mt-1 opacity-70">{c.name}</span>
                    </div>
                  ))}
                </div>
             </div>
           )}
        </div>
      </div>

      {/* Collection Grid */}
      <div className="px-5 mt-10">
         <h2 className="text-2xl font-serif mb-6">Collection</h2>
         <div className="grid grid-cols-2 gap-4">
            {brandProducts.length > 0 ? brandProducts.map(product => (
              <Link key={product.id} to={`/product/${product.id}`} className="group">
                 <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-900 mb-3 relative">
                    <img src={product.image} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                 </div>
                 <h3 className="font-bold text-sm leading-tight">{product.name}</h3>
                 <p className="text-xs opacity-60">₹{product.price}</p>
              </Link>
            )) : (
              <p className="col-span-2 text-center opacity-50 py-10">New drop coming soon.</p>
            )}
         </div>
      </div>
    </div>
  );
};

// --- PAGE: HOME (The Editorial Feed) ---
const HomePage: React.FC<ThemeProps> = ({ theme, toggleTheme }) => {
  // Filter products for different sections
  const partyWear = MOCK_PRODUCTS.filter(p => p.tags.includes('party') || p.tags.includes('glam'));
  const summerFits = MOCK_PRODUCTS.filter(p => p.tags.includes('summer') || p.category === 'Sets');
  const tryOnPicks = MOCK_PRODUCTS.filter(p => ['Dresses', 'Tops', 'Sets'].includes(p.category)).slice(0, 5);

  return (
    <div className="bg-stash-offwhite dark:bg-stash-black min-h-screen pb-32 font-sans selection:bg-stash-acid selection:text-black transition-colors duration-500">
       {/* Header */}
       <header className="px-5 pt-safe pb-4 flex justify-between items-center sticky top-0 z-40 bg-white/80 dark:bg-stash-black/80 backdrop-blur-xl border-b border-black/5 dark:border-white/5">
          <div className="flex items-center gap-2">
             <StashLogo className="w-8 h-8" />
             <div className="flex flex-col">
               <span className="font-serif text-xl text-black dark:text-white leading-none">Stash</span>
               <span className="text-[8px] font-bold uppercase tracking-widest text-stash-acid bg-black px-1 rounded dark:bg-white dark:text-black">Good Stuff</span>
             </div>
          </div>
          <div className="flex gap-4 text-black dark:text-white">
            <Search size={24} className="opacity-70 hover:opacity-100" />
            <button onClick={toggleTheme} className="relative opacity-70 hover:opacity-100">
              {theme === 'dark' ? <Sun size={24} /> : <Moon size={24} />}
            </button>
          </div>
       </header>

       {/* Stories Rail */}
       <div className="px-5 py-6 overflow-x-auto no-scrollbar flex gap-5 border-b border-black/5 dark:border-white/5">
          {STORIES_DATA.map(story => <StoryBubble key={story.id} story={story} />)}
       </div>

       {/* Hero Marquee (Infinite Scroll) */}
       <div className="py-4 bg-stash-acid overflow-hidden whitespace-nowrap flex">
         <div className="animate-marquee flex gap-8 items-center pr-8">
            {ALL_BRANDS_DATA.map((b, i) => (
              <span key={i} className="text-black font-black uppercase tracking-tight text-sm">{b.name} • </span>
            ))}
         </div>
         <div className="animate-marquee flex gap-8 items-center pr-8" aria-hidden="true">
            {ALL_BRANDS_DATA.map((b, i) => (
              <span key={i} className="text-black font-black uppercase tracking-tight text-sm">{b.name} • </span>
            ))}
         </div>
       </div>
       
       {/* DripBot Stylist Widget (Expandable) */}
       <DripBotWidget />

       {/* Offers Carousel */}
       <div className="py-4 px-5">
          <h3 className="text-black/50 dark:text-white/50 font-bold uppercase tracking-widest text-xs mb-4">Curated For You</h3>
          <div className="flex gap-4 overflow-x-auto no-scrollbar snap-x snap-mandatory">
             {OFFERS.map(offer => (
               <div key={offer.id} className={`shrink-0 snap-center w-64 h-32 rounded-2xl bg-gradient-to-r ${offer.bgGradient} p-6 flex justify-between items-center relative overflow-hidden group`}>
                  <div className="relative z-10 text-white">
                     <p className="text-xs font-bold opacity-90">{offer.subtitle}</p>
                     <h4 className="text-3xl font-black italic">{offer.title}</h4>
                  </div>
                  <span className="text-6xl opacity-20 group-hover:scale-125 transition duration-500">{offer.icon}</span>
               </div>
             ))}
          </div>
       </div>

       {/* VIRTUAL TRY-ON CAROUSEL */}
       <div className="py-6 bg-black/5 dark:bg-white/5 mb-8">
          <div className="px-5 mb-4 flex items-center gap-2">
              <Sparkles className="text-stash-acid" size={20} />
              <h2 className="text-2xl font-serif text-black dark:text-white">Virtual Try-On Picks</h2>
          </div>
          <div className="flex overflow-x-auto gap-4 px-5 snap-x snap-mandatory no-scrollbar">
             {tryOnPicks.map(p => (
               <Link to={`/product/${p.id}`} key={p.id} className="shrink-0 w-40 group snap-center">
                  <div className="aspect-[3/4] rounded-2xl overflow-hidden relative mb-2">
                      <img src={p.image} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition"></div>
                      <div className="absolute bottom-2 left-2 right-2 text-center">
                         <span className="px-2 py-1 bg-stash-acid text-black text-[10px] font-bold rounded-full w-full block">Try Now</span>
                      </div>
                  </div>
                  <h4 className="text-xs font-bold truncate">{p.name}</h4>
                  <p className="text-xs opacity-60">{p.brand}</p>
               </Link>
             ))}
          </div>
       </div>

       {/* Editorial Feed: Just Dropped */}
       <div className="pt-2 pb-6">
          <div className="px-5 mb-6 flex justify-between items-end">
             <h2 className="text-4xl font-serif text-black dark:text-white leading-[0.9]">
               Fresh<br/>Drops
             </h2>
             <span className="text-xs font-mono text-black dark:text-stash-acid border border-black dark:border-stash-acid px-2 py-1 rounded-full">SS25 COLLECTION</span>
          </div>
          
          <div className="flex overflow-x-auto gap-4 px-5 snap-x snap-mandatory no-scrollbar pb-8">
             {MOCK_PRODUCTS.slice(0, 8).map(p => <ProductCardHero key={p.id} product={p} />)}
          </div>
       </div>

       {/* New Section: Party Wear */}
       <div className="px-5 mb-8">
          <h3 className="text-black/50 dark:text-white/50 font-bold uppercase tracking-widest text-xs mb-4">After Hours</h3>
          <div className="grid grid-cols-2 gap-4">
              {partyWear.map(p => (
                 <Link key={p.id} to={`/product/${p.id}`} className="block group">
                    <div className="aspect-[4/5] rounded-2xl overflow-hidden mb-2 relative">
                        <img src={p.image} className="w-full h-full object-cover group-hover:opacity-80 transition" />
                        {p.tags.includes('glam') && <div className="absolute top-2 right-2 bg-purple-500 text-white text-[10px] font-bold px-2 py-0.5 rounded">GLAM</div>}
                    </div>
                    <h4 className="font-bold text-sm">{p.name}</h4>
                    <p className="text-xs opacity-50">₹{p.price}</p>
                 </Link>
              ))}
          </div>
       </div>

       {/* Trending Brands Grid */}
        <div className="px-5 mb-10">
          <h3 className="text-black/50 dark:text-white/50 font-bold uppercase tracking-widest text-xs mb-6">Trending Brands</h3>
          <div className="grid grid-cols-3 gap-3">
             {BRANDS_LIST.map(brand => (
               <Link to={`/brand/${brand.id}`} key={brand.id} className="aspect-square bg-white dark:bg-white/5 rounded-2xl flex flex-col items-center justify-center p-3 border border-black/5 dark:border-white/5 hover:border-stash-acid transition">
                  <img src={brand.logo} className="w-10 h-10 rounded-full mb-2 grayscale hover:grayscale-0 transition" />
                  <span className="text-[10px] font-bold text-center text-black dark:text-white leading-tight">{brand.name}</span>
               </Link>
             ))}
             <div className="aspect-square rounded-2xl flex items-center justify-center border border-dashed border-black/20 dark:border-white/20">
                <span className="text-xs text-black/50 dark:text-white/50">View All</span>
             </div>
          </div>
        </div>

       {/* Shop by Mood (Bento Layout) */}
       <div className="px-5 pb-10">
          <h3 className="text-black/50 dark:text-white/50 font-bold uppercase tracking-widest text-xs mb-6">Shop by Mood</h3>
          <div className="grid grid-cols-3 grid-rows-3 gap-2 h-[400px]">
             {/* Mood 1 (Large) */}
             <div className="col-span-2 row-span-2 rounded-[2rem] relative overflow-hidden group cursor-pointer">
                <img src={OCCASIONS[0].image} className="w-full h-full object-cover group-hover:scale-110 transition duration-700" />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition"></div>
                <div className="absolute bottom-4 left-4">
                   <h3 className="text-2xl font-serif text-white">{OCCASIONS[0].title}</h3>
                </div>
             </div>
             
             {/* Mood 2 (Tall) */}
             <div className="col-span-1 row-span-2 bg-stash-acid rounded-[2rem] p-3 flex flex-col items-center justify-between relative overflow-hidden group cursor-pointer">
                 <ArrowRight className="text-black -rotate-45" />
                 <span className="text-xl font-serif text-black writing-vertical rotate-180">{OCCASIONS[1].title}</span>
             </div>

             {/* Mood 3 */}
             <div className="col-span-1 row-span-1 rounded-[2rem] relative overflow-hidden group cursor-pointer bg-gray-800">
                <img src={OCCASIONS[2].image} className="w-full h-full object-cover opacity-60 group-hover:opacity-80" />
                <span className="absolute center inset-0 flex items-center justify-center text-white font-bold text-xs uppercase tracking-wider">{OCCASIONS[2].title}</span>
             </div>

             {/* Mood 4 (Wide) */}
             <div className="col-span-2 row-span-1 rounded-[2rem] relative overflow-hidden group cursor-pointer bg-gray-800">
                 <img src={OCCASIONS[3].image} className="w-full h-full object-cover opacity-60 group-hover:opacity-80" />
                 <div className="absolute inset-0 flex items-center justify-center gap-2">
                    <h3 className="text-xl font-serif text-white italic">{OCCASIONS[3].title}</h3>
                    <ArrowRight size={16} className="text-white" />
                 </div>
             </div>
          </div>
       </div>

       {/* Footer */}
       <div className="pb-10 text-center">
          <p className="text-xs font-mono text-black/30 dark:text-white/30 uppercase tracking-widest">Crafted with 🫶🏻</p>
       </div>
    </div>
  );
};

// --- PAGE: PICKS (Tinder-style Swipe) ---
const PicksPage: React.FC<{ addToCart: (p: Product) => void }> = ({ addToCart }) => {
  const [cards, setCards] = useState(MOCK_PRODUCTS);
  const [liked, setLiked] = useState<Product[]>([]);
  
  // Simple simulation of swipe logic via buttons for robustness
  const handleLike = () => {
    if (cards.length === 0) return;
    const current = cards[0];
    setLiked([...liked, current]);
    setCards(cards.slice(1));
    // Auto add to wishlist logic here
  };

  const handlePass = () => {
    if (cards.length === 0) return;
    setCards(cards.slice(1));
  };

  if (cards.length === 0) return (
    <div className="h-screen flex flex-col items-center justify-center bg-stash-offwhite dark:bg-stash-black text-black dark:text-white p-6 text-center">
       <Sparkles size={48} className="text-stash-acid mb-4" />
       <h2 className="text-2xl font-serif mb-2">That's all for now!</h2>
       <p className="opacity-60 mb-6">Check back later for more drops.</p>
       <Button onClick={() => setCards(MOCK_PRODUCTS)}>Reset Deck</Button>
    </div>
  );

  const current = cards[0];
  const next = cards[1];

  return (
    <div className="h-screen bg-stash-offwhite dark:bg-stash-black text-black dark:text-white overflow-hidden relative">
       <div className="absolute top-6 left-0 w-full text-center pt-safe z-10">
          <h1 className="font-serif text-3xl">Top Picks</h1>
       </div>

       <div className="h-full w-full flex items-center justify-center relative">
          {/* Background Card (Next) */}
          {next && (
             <div className="absolute w-[85vw] h-[60vh] bg-gray-200 dark:bg-gray-800 rounded-3xl scale-95 translate-y-4 opacity-50">
                <img src={next.image} className="w-full h-full object-cover rounded-3xl" />
             </div>
          )}

          {/* Foreground Card (Current) */}
          <div className="w-[85vw] h-[60vh] bg-white dark:bg-gray-900 rounded-3xl shadow-2xl relative overflow-hidden z-20 animate-enter">
             <img src={current.image} className="w-full h-full object-cover" />
             <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-black/80 to-transparent text-white">
                <h2 className="text-3xl font-serif">{current.name}</h2>
                <p className="text-stash-acid font-bold mb-2">₹{current.price}</p>
                <div className="flex gap-2 flex-wrap">
                   {current.tags.map(t => <span key={t} className="px-2 py-1 bg-white/20 backdrop-blur rounded-md text-xs uppercase">{t}</span>)}
                </div>
             </div>
          </div>
       </div>

       {/* Action Buttons */}
       <div className="absolute bottom-24 w-full flex justify-center gap-6 z-30">
          <button onClick={handlePass} className="w-16 h-16 rounded-full bg-white dark:bg-white/10 shadow-xl flex items-center justify-center text-red-500 hover:scale-110 transition">
             <X size={32} />
          </button>
          <button onClick={handleLike} className="w-16 h-16 rounded-full bg-stash-acid shadow-[0_0_30px_rgba(212,255,0,0.4)] flex items-center justify-center text-black hover:scale-110 transition">
             <Heart size={32} fill="black" />
          </button>
       </div>
    </div>
  );
};

// --- PAGE: CART ---
const CartPage: React.FC<{ cart: CartItem[], updateCart: (id: string, qty: number) => void, checkout: () => void }> = ({ cart, updateCart, checkout }) => {
  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <div className="min-h-screen bg-stash-offwhite dark:bg-stash-black text-black dark:text-white pt-safe px-5 pb-32">
       <h1 className="text-4xl font-serif mb-6 mt-4">My Bag <span className="text-lg font-sans opacity-50">({cart.length})</span></h1>
       
       {cart.length === 0 ? (
         <div className="flex flex-col items-center justify-center h-[50vh] opacity-50">
            <ShoppingBag size={64} strokeWidth={1} className="mb-4" />
            <p>Your bag is empty.</p>
         </div>
       ) : (
         <div className="space-y-4">
            {cart.map(item => (
              <div key={item.id} className="flex gap-4 p-4 bg-white dark:bg-white/5 rounded-2xl border border-black/5 dark:border-white/5">
                 <img src={item.image} className="w-24 h-32 object-cover rounded-xl bg-gray-100" />
                 <div className="flex-1 flex flex-col justify-between">
                    <div>
                       <div className="flex justify-between items-start">
                          <h3 className="font-bold leading-tight w-2/3">{item.name}</h3>
                          <button onClick={() => updateCart(item.id, 0)} className="text-red-500"><Trash2 size={18}/></button>
                       </div>
                       <p className="text-xs opacity-60 mt-1">{item.brand} • Size {item.size}</p>
                    </div>
                    <div className="flex justify-between items-center">
                       <p className="font-mono font-bold">₹{item.price}</p>
                       <div className="flex items-center gap-3 bg-gray-100 dark:bg-black rounded-full px-2 py-1">
                          <button onClick={() => updateCart(item.id, item.quantity - 1)}><Minus size={14}/></button>
                          <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                          <button onClick={() => updateCart(item.id, item.quantity + 1)}><Plus size={14}/></button>
                       </div>
                    </div>
                 </div>
              </div>
            ))}

            <div className="mt-8 p-6 bg-white dark:bg-white/5 rounded-3xl border border-black/5 dark:border-white/5">
               <div className="flex justify-between mb-2 opacity-60">
                  <span>Subtotal</span>
                  <span>₹{total}</span>
               </div>
               <div className="flex justify-between mb-4 opacity-60">
                  <span>Shipping</span>
                  <span>₹0</span>
               </div>
               <div className="flex justify-between text-xl font-bold mb-6 border-t border-black/10 dark:border-white/10 pt-4">
                  <span>Total</span>
                  <span>₹{total}</span>
               </div>
               <Button fullWidth variant="acid" onClick={checkout}>Checkout <ArrowRight size={18} /></Button>
            </div>
         </div>
       )}
    </div>
  );
};

// --- PAGE: PROFILE ---
const ProfilePage: React.FC<ProfileProps> = ({ theme, toggleTheme, user, logout }) => {
  const [aiQuery, setAiQuery] = useState('');
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);

  const handleAskDripBot = async () => {
    if (!aiQuery.trim()) return;
    setLoadingAi(true);
    setAiResponse(null);
    try {
      const res = await getAiStylingAdvice(aiQuery, `User Profile: ${user?.name}. Style: Streetwear, Relaxed, Gen Z.`);
      setAiResponse(res);
    } catch (e) {
      setAiResponse("Sorry, I tripped on my laces. Try again.");
    } finally {
      setLoadingAi(false);
    }
  };

  return (
    <div className="min-h-screen bg-stash-offwhite dark:bg-stash-black text-black dark:text-white pt-safe pb-32">
       <div className="px-5 pt-10 flex justify-between items-start mb-8">
          <h1 className="text-4xl font-serif">My<br/>Profile</h1>
          <div className="flex gap-2">
            <button onClick={toggleTheme} className="p-3 rounded-full bg-white dark:bg-white/10 shadow-lg">
              {theme === 'dark' ? <Sun size={24} /> : <Moon size={24} />}
            </button>
          </div>
       </div>

       {/* User Info */}
       <div className="px-5 mb-8">
          <div className="flex items-center gap-4 p-4 bg-white dark:bg-white/5 rounded-3xl border border-black/5 dark:border-white/5 relative overflow-hidden">
             <div className="w-16 h-16 rounded-full bg-gradient-to-br from-stash-acid to-black flex items-center justify-center text-2xl font-serif font-bold text-white">
                {user?.name.charAt(0) || 'U'}
             </div>
             <div>
                <h3 className="text-xl font-bold">{user?.name || 'Guest User'}</h3>
                <p className="opacity-50 text-sm">+91 {user?.phone || '00000 00000'}</p>
             </div>
             <StashLogo className="absolute -right-4 -bottom-4 w-24 h-24 opacity-5" />
          </div>
       </div>

       {/* DripBot Personal Stylist */}
       <div className="px-5 mb-8">
          <div className="p-6 bg-gradient-to-br from-gray-900 to-black border border-white/10 rounded-3xl text-white relative overflow-hidden">
            <div className="absolute -right-10 -top-10 w-32 h-32 bg-purple-500 blur-[60px] opacity-30"></div>
             <div className="flex items-center gap-2 mb-4 relative z-10">
                <Bot className="text-purple-400" />
                <h3 className="font-bold text-lg">DripBot Stylist</h3>
             </div>
             
             {!aiResponse ? (
               <div className="space-y-3 relative z-10">
                 <p className="text-sm opacity-70">Ask me anything about your style, upcoming events, or trends.</p>
                 <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={aiQuery}
                      onChange={e => setAiQuery(e.target.value)}
                      placeholder="What should I wear to..."
                      className="flex-1 bg-white/10 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-purple-500"
                    />
                    <button 
                      onClick={handleAskDripBot}
                      disabled={loadingAi}
                      className="bg-purple-500 p-2 rounded-xl hover:bg-purple-600 disabled:opacity-50"
                    >
                      {loadingAi ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <Send size={20}/>}
                    </button>
                 </div>
               </div>
             ) : (
               <div className="relative z-10 animate-enter">
                  <p className="text-sm leading-relaxed mb-4 bg-white/5 p-3 rounded-xl border border-white/5">
                    {aiResponse}
                  </p>
                  <button onClick={() => { setAiResponse(null); setAiQuery(''); }} className="text-xs text-purple-400 font-bold uppercase">Ask Another</button>
               </div>
             )}
          </div>
       </div>

       {/* Menu */}
       <div className="px-5 space-y-3">
          {[
             { icon: ShoppingBag, label: 'My Orders' },
             { icon: Heart, label: 'Wishlist' },
             { icon: Wallet, label: 'Payment Methods' },
          ].map((item, i) => (
             <button key={i} className={`w-full flex items-center justify-between p-4 bg-white dark:bg-white/5 rounded-2xl border border-black/5 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-white/10`}>
                <div className="flex items-center gap-4">
                   <item.icon size={20} />
                   <span className="font-bold">{item.label}</span>
                </div>
                <ChevronLeft size={16} className="rotate-180 opacity-50" />
             </button>
          ))}
           <button onClick={logout} className={`w-full flex items-center justify-between p-4 bg-white dark:bg-white/5 rounded-2xl border border-black/5 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-white/10 text-red-500`}>
                <div className="flex items-center gap-4">
                   <LogOut size={20} />
                   <span className="font-bold">Log Out</span>
                </div>
                <ChevronLeft size={16} className="rotate-180 opacity-50" />
           </button>
       </div>
    </div>
  );
};

// --- PAGE: PRODUCT (Bottom Sheet Style) ---
const ProductPage: React.FC<{ addToCart: (p: Product) => void }> = ({ addToCart }) => {
  const { id } = useParams();
  const product = MOCK_PRODUCTS.find(p => p.id === id) || MOCK_PRODUCTS[0];
  const [showTryOn, setShowTryOn] = useState(false);
  const [tryOnImg, setTryOnImg] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  
  // AI Styling State
  const [showStyling, setShowStyling] = useState(false);
  const [stylingQuery, setStylingQuery] = useState('');
  const [stylingAdvice, setStylingAdvice] = useState<string | null>(null);
  const [isStyling, setIsStyling] = useState(false);

  const [viewers] = useState(Math.floor(Math.random() * 15) + 5);
  const date = new Date();
  date.setDate(date.getDate() + 3);
  const deliveryDate = date.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' });

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
    } catch (error) {
      console.log('Error sharing', error);
    }
  };

  const handleGenerate = async () => {
    if (!tryOnImg) return;
    setIsGenerating(true);
    try {
      const result = await generateVirtualTryOn(tryOnImg, product.image, product.description);
      setGeneratedImage(result);
    } catch (e) {
      alert("Sorry bestie, I'm still improving my fashion skills! 🥺 Can you try uploading a clearer photo? I promise to do better!");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGetStyling = async () => {
    if (!stylingQuery.trim()) return;
    setIsStyling(true);
    try {
      const advice = await getAiStylingAdvice(stylingQuery, `Product: ${product.name}. Brand: ${product.brand}. Category: ${product.category}. Description: ${product.description}`);
      setStylingAdvice(advice);
    } catch (e) {
      setStylingAdvice("Oops, stylist is busy.");
    } finally {
      setIsStyling(false);
    }
  }

  return (
    <div className="bg-stash-offwhite dark:bg-stash-black min-h-screen text-black dark:text-white font-sans transition-colors duration-500">
       {/* Full Screen Image Fixed */}
       <div className="fixed top-0 left-0 w-full h-[60vh] z-0">
          <img src={product.image} className="w-full h-full object-cover opacity-100 dark:opacity-90" alt={product.name} />
          <div className="absolute inset-0 bg-gradient-to-b from-white/30 dark:from-black/30 via-transparent to-stash-offwhite dark:to-stash-black"></div>
          <Link to="/" className="absolute top-6 left-6 p-3 bg-white/20 dark:bg-black/20 backdrop-blur-md rounded-full z-50 border border-white/10">
             <ChevronLeft size={24} className="text-black dark:text-white" />
          </Link>
          <button onClick={handleShare} className="absolute top-6 right-6 p-3 bg-white/20 dark:bg-black/20 backdrop-blur-md rounded-full z-50 border border-white/10">
             <Share2 size={24} className="text-black dark:text-white" />
          </button>
       </div>

       {/* Scrollable Content Sheet */}
       <div className="relative z-10 mt-[50vh] bg-stash-offwhite dark:bg-stash-black rounded-t-[2.5rem] min-h-[60vh] px-6 pt-10 pb-32 border-t border-black/5 dark:border-white/10 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] dark:shadow-[0_-10px_40px_rgba(0,0,0,0.8)] animate-enter">
          <div className="w-12 h-1 bg-black/10 dark:bg-white/20 rounded-full mx-auto mb-8"></div>
          
          <div className="flex justify-between items-start mb-2">
             <h1 className="text-4xl font-serif leading-tight w-2/3">{product.name}</h1>
             <div className="text-right">
                <p className="text-2xl font-bold text-stash-acid mix-blend-darken dark:mix-blend-normal">₹{product.price}</p>
                <p className="text-sm opacity-50 line-through">₹{product.originalPrice}</p>
             </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-bold text-red-500 mb-6">
              <div className="flex items-center gap-1 bg-red-500/10 px-2 py-1 rounded-full">
                  <Eye size={12} /> {viewers} people viewing
              </div>
              <div className="flex items-center gap-1 bg-green-500/10 text-green-600 px-2 py-1 rounded-full">
                  <Clock size={12} /> Get it by {deliveryDate}
              </div>
          </div>

          <div className="flex gap-2 mb-8 overflow-x-auto no-scrollbar">
             {product.tags.map(tag => (
               <span key={tag} className="px-4 py-1.5 border border-black/10 dark:border-white/20 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition">
                  {tag}
               </span>
             ))}
          </div>

          <div className="flex gap-4 mb-8">
              <div className="flex-1 p-3 border border-black/10 dark:border-white/10 rounded-xl flex items-center justify-between cursor-pointer hover:bg-black/5 dark:hover:bg-white/5">
                  <div>
                      <p className="text-xs opacity-50 uppercase font-bold">Size</p>
                      <p className="font-bold">Medium</p>
                  </div>
                  <ChevronLeft className="-rotate-90 opacity-50" size={16}/>
              </div>
              <button className="p-3 border border-black/10 dark:border-white/10 rounded-xl flex items-center justify-center aspect-square hover:bg-black/5 dark:hover:bg-white/5" title="Size Guide">
                  <Ruler size={20} />
              </button>
          </div>

          <p className="opacity-70 leading-relaxed text-lg font-light mb-6">
             {product.description}
          </p>
          
          {/* AI Stylist Button */}
          <div className="mb-10">
            <button 
               onClick={() => setShowStyling(!showStyling)}
               className="flex items-center gap-2 text-sm font-bold text-purple-400 hover:text-purple-300 transition"
            >
               <Sparkles size={16} /> {showStyling ? "Hide Stylist" : "Ask AI Stylist"}
            </button>
            
            {showStyling && (
               <div className="mt-4 p-4 bg-black/5 dark:bg-white/5 rounded-2xl animate-enter">
                  {!stylingAdvice ? (
                     <div className="flex gap-2">
                        <input 
                           type="text" 
                           placeholder="E.g. How to style this for a date?"
                           value={stylingQuery}
                           onChange={(e) => setStylingQuery(e.target.value)}
                           className="flex-1 bg-transparent border-b border-black/10 dark:border-white/10 p-2 text-sm outline-none"
                        />
                        <button 
                           onClick={handleGetStyling} 
                           disabled={isStyling}
                           className="bg-purple-500 text-white p-2 rounded-lg disabled:opacity-50"
                        >
                           {isStyling ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <ArrowRight size={16}/>}
                        </button>
                     </div>
                  ) : (
                     <div>
                        <p className="text-sm italic opacity-80 mb-3">"{stylingAdvice}"</p>
                        <button onClick={() => setStylingAdvice(null)} className="text-xs font-bold underline">Ask another</button>
                     </div>
                  )}
               </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
             <Button variant="secondary" onClick={() => setShowTryOn(true)} size="md">
                <Sparkles size={18} /> Try-On
             </Button>
             <Button variant="acid" onClick={() => addToCart(product)} size="md">
                Add to Bag
             </Button>
          </div>
       </div>
       
       {/* Virtual Try-On Modal (Improved Z-Index and Layout) */}
       {showTryOn && (
         <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4">
             <div className="w-full max-w-md bg-[#0A0A0A] rounded-3xl p-6 border border-white/10 max-h-[85vh] overflow-y-auto flex flex-col relative">
                <div className="flex justify-between items-center mb-6 sticky top-0 bg-[#0A0A0A] z-20 py-2">
                    <h3 className="text-2xl font-serif text-white">AI Try-On</h3>
                    <button onClick={() => { setShowTryOn(false); setGeneratedImage(null); setTryOnImg(null); }} className="text-white p-2 bg-white/10 rounded-full hover:bg-white/20"><X size={20}/></button>
                </div>

                {!generatedImage ? (
                    <div className="flex-1 flex flex-col gap-4">
                        <div className="aspect-[3/4] bg-white/5 rounded-2xl border-2 border-dashed border-white/20 flex items-center justify-center relative overflow-hidden group">
                            {tryOnImg ? (
                                <img src={tryOnImg} className="w-full h-full object-cover" />
                            ) : (
                                <div className="flex flex-col items-center text-white/50 p-4 text-center">
                                    <Upload size={32} className="mb-2 opacity-50"/>
                                    <p>Tap to upload full-body photo</p>
                                </div>
                            )}
                            {/* Input covers the area only if no image, or we need a change button */}
                            <input type="file" className="absolute inset-0 opacity-0 cursor-pointer z-10" onChange={(e) => {
                                if(e.target.files?.[0]) {
                                    const reader = new FileReader();
                                    reader.onload = (ev) => setTryOnImg(ev.target?.result as string);
                                    reader.readAsDataURL(e.target.files[0]);
                                }
                            }}/>
                            {tryOnImg && (
                                <div className="absolute bottom-4 right-4 z-20 pointer-events-none">
                                    <span className="bg-black/50 backdrop-blur px-3 py-1 rounded-full text-xs text-white border border-white/10">Change</span>
                                </div>
                            )}
                        </div>
                        
                        {tryOnImg && (
                            <Button 
                                variant="acid" 
                                fullWidth 
                                onClick={handleGenerate}
                                disabled={isGenerating}
                                className="mt-2"
                            >
                                {isGenerating ? (
                                    <span className="flex items-center gap-2"><div className="animate-spin w-4 h-4 border-2 border-black border-t-transparent rounded-full"></div> Styling...</span>
                                ) : (
                                    <><Sparkles size={18}/> Generate Look</>
                                )}
                            </Button>
                        )}
                         <p className="text-white/40 text-center text-xs mt-2">Powered by Gemini 3 Pro • 5s generation</p>
                    </div>
                ) : (
                    <div className="flex-1 flex flex-col gap-4">
                         <div className="aspect-[3/4] bg-white/5 rounded-2xl border border-white/10 overflow-hidden relative">
                            <img src={generatedImage} className="w-full h-full object-cover" />
                            <div className="absolute bottom-4 right-4 bg-stash-acid text-black text-xs font-bold px-2 py-1 rounded">AI Generated</div>
                         </div>
                         <div className="grid grid-cols-2 gap-3">
                            <Button variant="secondary" onClick={() => setGeneratedImage(null)}>Try Another</Button>
                            <Button variant="acid" onClick={() => { addToCart(product); setShowTryOn(false); }}>Buy Now</Button>
                         </div>
                    </div>
                )}
             </div>
         </div>
       )}
    </div>
  );
};

// --- PAGE: REELS (Immersive) ---
const StashReels: React.FC<{ reels: Reel[] }> = ({ reels }) => {
  return (
    <div className="bg-black h-screen w-full relative">
       {/* Header */}
       <div className="absolute top-0 left-0 w-full z-30 p-6 pt-safe flex justify-between items-center pointer-events-none text-white">
         <span className="font-serif text-3xl font-bold drop-shadow-lg">Reels</span>
         <Camera className="pointer-events-auto cursor-pointer" />
       </div>

       <div className="h-full w-full overflow-y-scroll snap-y snap-mandatory no-scrollbar">
         {reels.map((reel) => (
           <div key={reel.id} className="h-screen w-full snap-start relative bg-gray-900">
              <video 
                src={reel.videoUrl} 
                className="h-full w-full object-cover" 
                loop autoPlay muted playsInline 
              />
              <div className="absolute bottom-0 left-0 w-full p-6 pb-32 bg-gradient-to-t from-black/90 via-black/40 to-transparent">
                 <div className="flex items-center gap-3 mb-4">
                    <img src={reel.userAvatar} className="w-10 h-10 rounded-full border-2 border-white" />
                    <span className="text-white font-bold">{reel.user}</span>
                    <button className="px-3 py-1 bg-white/20 backdrop-blur rounded-full text-[10px] font-bold text-white uppercase">Follow</button>
                 </div>
                 <p className="text-white/90 text-sm mb-4 line-clamp-2">{reel.product.description}</p>
                 <div className="glass-panel p-3 rounded-xl flex items-center gap-4">
                    <img src={reel.product.image} className="w-10 h-10 rounded-lg object-cover" />
                    <div className="flex-1">
                       <p className="text-white text-xs font-bold">{reel.product.name}</p>
                       <p className="text-stash-acid text-xs">₹{reel.product.price}</p>
                    </div>
                    <button className="bg-white text-black p-2 rounded-lg"><ShoppingBag size={16}/></button>
                 </div>
              </div>
           </div>
         ))}
       </div>
    </div>
  );
};

// --- MAIN APP ---

const App = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [reels, setReels] = useState<Reel[]>(REELS_DATA);
  const [theme, setTheme] = useState<'dark'|'light'>('dark');
  const [user, setUser] = useState<UserProfile | null>(null);

  // Init State from LocalStorage
  useEffect(() => {
     const savedUser = localStorage.getItem('stash_user');
     if (savedUser) {
       setUser(JSON.parse(savedUser));
     }
  }, []);

  const handleOnboardingComplete = (name: string, phone: string) => {
     const newUser = { name, phone, isLoggedIn: true, joinedDate: new Date().toISOString() };
     setUser(newUser);
     localStorage.setItem('stash_user', JSON.stringify(newUser));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('stash_user');
  };

  const addToCart = (p: Product) => {
    const exists = cart.find(i => i.id === p.id);
    if (exists) setCart(cart.map(i => i.id === p.id ? { ...i, quantity: i.quantity + 1 } : i));
    else setCart([...cart, { ...p, quantity: 1, size: 'M' }]);
  };
  
  const updateCart = (id: string, qty: number) => {
     if (qty <= 0) setCart(cart.filter(i => i.id !== id));
     else setCart(cart.map(i => i.id === id ? { ...i, quantity: qty } : i));
  };

  const checkout = () => {
     alert("Proceeding to Razorpay Payment Gateway...");
  };

  const toggleTheme = () => {
     setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  // Apply theme class to body/html
  useEffect(() => {
     document.documentElement.classList.remove('dark', 'light');
     document.documentElement.classList.add(theme);
     
     // BLOCK CONTEXT MENU (Content Protection)
     const handleContextMenu = (e: MouseEvent) => {
       e.preventDefault();
       return false;
     };
     
     window.addEventListener('contextmenu', handleContextMenu);
     return () => window.removeEventListener('contextmenu', handleContextMenu);
  }, [theme]);

  return (
    <HashRouter>
      <div className={`min-h-screen font-sans antialiased bg-noise text-black dark:text-white`}>
        {!user ? (
           <Onboarding onComplete={handleOnboardingComplete} />
        ) : (
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
    </HashRouter>
  );
};

export default App;
