import { Routes, Route, NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Dumbbell, Bot, Video,
  Search, Bell, Menu, ChevronLeft, ChevronRight,
  MapPin, FileText, Activity, Calendar, Settings,
  LogOut, User, Globe, Moon, Key, Phone, Mail
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from './context/AuthContext';

// Pages
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import UserDashboard from './pages/UserDashboard';
import Fitness from './pages/Fitness';
import AICompanion from './pages/AICompanion';
import Records from './pages/Records'; // This will be renamed to Patient Records
import Telemedicine from './pages/Telemedicine';
import Hospitals from './pages/Hospitals';
import Tracker from './pages/Tracker';
import Vault from './pages/Vault';
import Vitals from './pages/Vitals';
import Appointments from './pages/Appointments';

const BrandLogo = ({ collapsed }: { collapsed: boolean }) => (
  <div className={`flex items-center ${collapsed ? 'justify-center' : 'gap-3'} px-2 h-10`}>
    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand to-teal flex items-center justify-center flex-shrink-0 shadow-lg shadow-brand-glow relative overflow-hidden group">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-white z-10 relative group-hover:scale-110 transition-transform duration-500">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
      </svg>
      <div className="absolute inset-0 bg-white/20 blur-md rounded-full scale-0 group-hover:scale-150 transition-transform duration-700" />
    </div>
    
    <div className={`flex flex-col whitespace-nowrap transition-all duration-300 overflow-hidden ${collapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'}`}>
      <h1 className="text-xl tracking-tight leading-none flex items-center">
        <span className="font-light text-white">Med</span>
        <span className="font-extrabold text-teal">Pal</span>
        <span className="w-1.5 h-1.5 rounded-full bg-brand ml-1 mb-2 shadow-[0_0_8px_var(--color-brand)] animate-pulse" />
      </h1>
      <span className="text-[0.55rem] font-bold uppercase tracking-[0.2em] text-txt-muted mt-1">Enterprise Health</span>
    </div>
  </div>
);

function App() {
  const { currentUser, logout, updateProfile, changePassword } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  
  // Modals & Popups
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // Onboarding Form State
  const [onboardData, setOnboardData] = useState({ fullName: '', address: '', email: '', age: '', gender: 'Male', contact: '', height: '', weight: '', guardianName: '', guardianPhone: '', guardianEmail: '' });
  const [onboardError, setOnboardError] = useState('');
  
  // Settings Profile State
  const [profileData, setProfileData] = useState({ contact: '', email: '' });

  useEffect(() => {
    if (showSettings && currentUser) {
      setProfileData({ contact: currentUser.contact || '', email: currentUser.email || '' });
    }
  }, [showSettings, currentUser]);
  
  // Change Password State
  const [pwState, setPwState] = useState({ old: '', new: '', confirm: '', error: '', success: false });
  
  // Settings Guardian State
  const [showAddGuardian, setShowAddGuardian] = useState(false);
  const [newGuardian, setNewGuardian] = useState({ name: '', phone: '', email: '' });
  const [guardianError, setGuardianError] = useState('');

  // Auto-collapse sidebar
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsSidebarOpen(false);
        setIsMobile(window.innerWidth < 768);
      } else {
        setIsSidebarOpen(true);
        setIsMobile(false);
      }
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Protect Routes
  if (!currentUser) {
    return <LandingPage />;
  }

  // Handle Onboarding Submission
  const handleOnboardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onboardData.contact && onboardData.guardianPhone && onboardData.contact === onboardData.guardianPhone) {
      setOnboardError("Guardian's phone number cannot be the same as your contact number. Please enter a different number.");
      return;
    }
    if (onboardData.email && onboardData.guardianEmail && onboardData.email.toLowerCase() === onboardData.guardianEmail.toLowerCase()) {
      setOnboardError("Guardian's email cannot be the same as your email address. Please enter a different email.");
      return;
    }
    setOnboardError('');
    const { guardianName, guardianPhone, guardianEmail, ...rest } = onboardData;
    updateProfile({
      ...rest,
      guardians: [{ name: guardianName, phone: guardianPhone, email: guardianEmail }]
    });
  };

  const handleAddGuardian = (e: React.FormEvent) => {
    e.preventDefault();
    if (newGuardian.phone && currentUser?.contact && newGuardian.phone === currentUser.contact) {
      setGuardianError("Guardian's phone number cannot be the same as your contact number.");
      return;
    }
    if (newGuardian.email && currentUser?.email && newGuardian.email.toLowerCase() === currentUser.email.toLowerCase()) {
      setGuardianError("Guardian's email cannot be the same as your email address.");
      return;
    }
    setGuardianError('');
    if (newGuardian.name && newGuardian.email) {
      const updatedGuardians = [...(currentUser.guardians || []), newGuardian];
      updateProfile({ guardians: updatedGuardians });
      setShowAddGuardian(false);
      setNewGuardian({ name: '', phone: '', email: '' });
    }
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (pwState.new !== pwState.confirm) {
      setPwState({ ...pwState, error: 'Passwords do not match', success: false });
      return;
    }
    if (changePassword(pwState.old, pwState.new)) {
      setPwState({ old: '', new: '', confirm: '', error: '', success: true });
    } else {
      setPwState({ ...pwState, error: 'Incorrect current password', success: false });
    }
  };

  const doLogout = () => {
    logout();
    navigate('/');
  };

  // Nav Items configured with roles
  const navItems = [
    { to: "/", icon: <LayoutDashboard size={20} />, label: "Dashboard", section: "main", roles: ['admin', 'user'] },
    { to: "/fitness", icon: <Dumbbell size={20} />, label: "Fitness & Wellness", section: "main", roles: ['admin', 'user'] },
    { to: "/companion", icon: <Bot size={20} />, label: "AI Companion", section: "main", roles: ['admin', 'user'] },
    
    { to: "/tracker", icon: <Bell size={20} />, label: "Medical Tracker", section: "clinical", roles: ['admin', 'user'] },
    { to: "/vault", icon: <FileText size={20} />, label: "Health Vault", section: "clinical", roles: ['admin', 'user'] },
    { to: "/vitals", icon: <Activity size={20} />, label: "Vital Signs", section: "clinical", roles: ['admin', 'user'] },
    { to: "/records", icon: <FileText size={20} />, label: "Patient Records", section: "clinical", roles: ['admin'] },
    { to: "/hospitals", icon: <MapPin size={20} />, label: "Find Hospital", section: "clinical", roles: ['admin', 'user'] },
    { to: "/appointments", icon: <Calendar size={20} />, label: "Appointments", section: "clinical", roles: ['admin', 'user'] },
    { to: "/telemedicine", icon: <Video size={20} />, label: "Telemedicine", section: "clinical", roles: ['admin', 'user'] },
  ];

  const allowedNavItems = navItems.filter(n => n.roles.includes(currentUser.role));
  const getPageTitle = () => allowedNavItems.find(n => n.to === location.pathname)?.label || 'MedPal';

  return (
    <div className="h-screen w-screen bg-base p-3 sm:p-4 flex gap-3 sm:gap-4 overflow-hidden relative">
      
      {/* Onboarding Modal Overlay */}
      {currentUser.role === 'user' && !currentUser.hasOnboarded && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-8 border border-gray-200" style={{ opacity: 1 }}>
            <h2 className="text-2xl font-black text-gray-900 mb-2">Welcome to MedPal!</h2>
            <p className="text-gray-600 text-sm mb-6">Let's set up your health profile. This information is securely stored in your Patient Records.</p>
            {onboardError && <div className="mb-4 p-3 bg-red-100 text-red-700 text-sm rounded-xl font-bold">{onboardError}</div>}
            <form onSubmit={handleOnboardSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500">Full Name *</label>
                <input type="text" required value={onboardData.fullName} onChange={e => setOnboardData({...onboardData, fullName: e.target.value})} className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-2 text-gray-900 outline-none focus:border-brand" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500">Address *</label>
                <input type="text" required value={onboardData.address} onChange={e => setOnboardData({...onboardData, address: e.target.value})} className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-2 text-gray-900 outline-none focus:border-brand" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500">Age</label>
                  <input type="number" required value={onboardData.age} onChange={e => setOnboardData({...onboardData, age: e.target.value})} className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-2 text-gray-900 outline-none focus:border-brand" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500">Gender</label>
                  <select value={onboardData.gender} onChange={e => setOnboardData({...onboardData, gender: e.target.value})} className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-2 text-gray-900 outline-none focus:border-brand">
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500">Contact No *</label>
                  <input type="tel" required value={onboardData.contact} onChange={e => setOnboardData({...onboardData, contact: e.target.value})} className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-2 text-gray-900 outline-none focus:border-brand" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500">Email Address *</label>
                  <input type="email" required value={onboardData.email} onChange={e => setOnboardData({...onboardData, email: e.target.value})} className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-2 text-gray-900 outline-none focus:border-brand" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500">Guardian Name *</label>
                  <input type="text" required value={onboardData.guardianName} onChange={e => setOnboardData({...onboardData, guardianName: e.target.value})} className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-2 text-gray-900 outline-none focus:border-brand" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500">Guardian Phone (Optional)</label>
                  <input type="tel" value={onboardData.guardianPhone} onChange={e => setOnboardData({...onboardData, guardianPhone: e.target.value})} className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-2 text-gray-900 outline-none focus:border-brand" />
                </div>
                <div className="space-y-1 col-span-2">
                  <label className="text-xs font-bold text-gray-500">Guardian Email *</label>
                  <input type="email" required value={onboardData.guardianEmail} onChange={e => setOnboardData({...onboardData, guardianEmail: e.target.value})} className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-2 text-gray-900 outline-none focus:border-brand" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500">Height (cm) - Optional</label>
                  <input type="number" value={onboardData.height} onChange={e => setOnboardData({...onboardData, height: e.target.value})} className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-2 text-gray-900 outline-none focus:border-brand" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500">Weight (kg) - Optional</label>
                  <input type="number" value={onboardData.weight} onChange={e => setOnboardData({...onboardData, weight: e.target.value})} className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-2 text-gray-900 outline-none focus:border-brand" />
                </div>
              </div>
              <button type="submit" className="w-full bg-brand text-white font-bold py-3 rounded-xl hover:bg-brand-hover shadow-lg mt-4">Save Profile</button>
            </form>
          </div>
        </div>
      )}

      {/* Settings Modal (Right Sidebar) */}
      {showSettings && (
        <>
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm" onClick={() => setShowSettings(false)} />
          <div className="fixed top-0 right-0 h-full w-full sm:w-96 bg-surface shadow-2xl z-50 border-l border-border-dark transform transition-transform overflow-y-auto custom-scrollbar">
            <div className="p-6 border-b border-border-dark flex justify-between items-center bg-base">
              <h2 className="text-xl font-bold text-txt flex items-center gap-2"><Settings size={20} className="text-brand" /> Settings</h2>
              <button onClick={() => setShowSettings(false)} className="text-txt-muted hover:text-txt">✕</button>
            </div>
            <div className="p-6 space-y-8">
              
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-txt-muted uppercase tracking-wider">Preferences</h3>
                <div className="flex items-center justify-between p-3 bg-base border border-border-dark rounded-xl">
                  <div className="flex items-center gap-3 text-txt"><Globe size={18} className="text-brand"/> Language</div>
                  <select className="bg-transparent text-sm font-bold text-txt outline-none cursor-pointer"><option>English</option><option>Hindi</option></select>
                </div>
                <div className="flex items-center justify-between p-3 bg-base border border-border-dark rounded-xl">
                  <div className="flex items-center gap-3 text-txt"><Moon size={18} className="text-teal"/> Theme</div>
                  <select className="bg-transparent text-sm font-bold text-txt outline-none cursor-pointer"><option>System</option><option>Dark</option><option>Light</option></select>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-bold text-txt-muted uppercase tracking-wider">Account Settings</h3>
                <div className="p-3 bg-base border border-border-dark rounded-xl space-y-3">
                  <div className="flex items-center gap-3">
                    <User size={18} className="text-brand"/>
                    <div className="w-full">
                      <p className="text-xs text-txt-muted">Username (Non-editable)</p>
                      <p className="text-sm font-bold text-txt">{currentUser.username}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 border-t border-border-dark pt-2">
                    <Phone size={18} className="text-teal"/>
                    <div className="w-full">
                      <p className="text-xs text-txt-muted">Contact Number</p>
                      <input 
                        type="tel" 
                        value={profileData.contact} 
                        onChange={e => setProfileData({...profileData, contact: e.target.value})}
                        onBlur={() => updateProfile({ contact: profileData.contact })}
                        className="w-full bg-transparent text-sm font-bold text-txt outline-none border-b border-transparent focus:border-brand transition-colors"
                        placeholder="Add contact number"
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-3 border-t border-border-dark pt-2">
                    <Mail size={18} className="text-blue-500"/>
                    <div className="w-full">
                      <p className="text-xs text-txt-muted">Email Address</p>
                      <input 
                        type="email" 
                        value={profileData.email} 
                        onChange={e => setProfileData({...profileData, email: e.target.value})}
                        onBlur={() => updateProfile({ email: profileData.email })}
                        className="w-full bg-transparent text-sm font-bold text-txt outline-none border-b border-transparent focus:border-brand transition-colors"
                        placeholder="Add email address"
                      />
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-base border border-border-dark rounded-xl space-y-3">
                  <p className="text-sm font-bold text-txt">Guardians</p>
                  {currentUser.guardians && currentUser.guardians.length > 0 ? (
                    <ul className="space-y-2">
                      {currentUser.guardians.map((g, i) => (
                        <li key={i} className="flex flex-col text-sm bg-surface p-2 rounded-lg border border-border-dark">
                          <span className="font-bold text-txt">{g.name}</span>
                          <span className="text-xs text-txt-muted">📞 {g.phone}</span>
                          <span className="text-xs text-txt-muted">✉️ {g.email}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-xs text-txt-muted">No guardians added yet.</p>
                  )}
                  
                  {showAddGuardian ? (
                    <form onSubmit={handleAddGuardian} className="space-y-2 pt-2 border-t border-border-dark mt-2">
                      {guardianError && <p className="text-xs text-danger font-bold">{guardianError}</p>}
                      <input type="text" placeholder="Guardian Name" required value={newGuardian.name} onChange={e=>setNewGuardian({...newGuardian, name: e.target.value})} className="w-full bg-surface border border-border-dark rounded-lg px-3 py-2 text-sm text-txt outline-none focus:border-brand" />
                      <input type="tel" placeholder="Guardian Phone (Optional)" value={newGuardian.phone} onChange={e=>setNewGuardian({...newGuardian, phone: e.target.value})} className="w-full bg-surface border border-border-dark rounded-lg px-3 py-2 text-sm text-txt outline-none focus:border-brand" />
                      <input type="email" placeholder="Guardian Email" required value={newGuardian.email} onChange={e=>setNewGuardian({...newGuardian, email: e.target.value})} className="w-full bg-surface border border-border-dark rounded-lg px-3 py-2 text-sm text-txt outline-none focus:border-brand" />
                      <div className="flex gap-2">
                        <button type="button" onClick={() => setShowAddGuardian(false)} className="flex-1 text-xs py-2 bg-surface text-txt border border-border-dark rounded-lg font-bold">Cancel</button>
                        <button type="submit" className="flex-1 text-xs py-2 bg-brand text-white rounded-lg font-bold hover:bg-brand-hover">Save</button>
                      </div>
                    </form>
                  ) : (
                    <button onClick={() => setShowAddGuardian(true)} className="text-xs text-brand font-bold hover:underline">
                      + Add Another Guardian
                    </button>
                  )}
                </div>
                
                <form onSubmit={handlePasswordChange} className="p-4 bg-base border border-border-dark rounded-xl space-y-3">
                  <p className="text-sm font-bold text-txt flex items-center gap-2"><Key size={16} className="text-orange-500" /> Change Password</p>
                  {pwState.error && <p className="text-xs text-danger font-bold">{pwState.error}</p>}
                  {pwState.success && <p className="text-xs text-teal font-bold">Password updated successfully!</p>}
                  <input type="password" placeholder="Current Password" required value={pwState.old} onChange={e=>setPwState({...pwState, old: e.target.value})} className="w-full bg-surface border border-border-dark rounded-lg px-3 py-2 text-sm text-txt outline-none focus:border-brand" />
                  <input type="password" placeholder="New Password" required value={pwState.new} onChange={e=>setPwState({...pwState, new: e.target.value})} className="w-full bg-surface border border-border-dark rounded-lg px-3 py-2 text-sm text-txt outline-none focus:border-brand" />
                  <input type="password" placeholder="Confirm New Password" required value={pwState.confirm} onChange={e=>setPwState({...pwState, confirm: e.target.value})} className="w-full bg-surface border border-border-dark rounded-lg px-3 py-2 text-sm text-txt outline-none focus:border-brand" />
                  <button type="submit" className="w-full bg-brand/10 text-brand font-bold py-2 rounded-lg hover:bg-brand hover:text-white transition-colors">Update Password</button>
                </form>
              </div>

              <div className="pt-4 border-t border-border-dark">
                <button onClick={doLogout} className="w-full flex items-center justify-center gap-2 bg-danger/10 text-danger font-bold py-3 rounded-xl hover:bg-danger hover:text-white transition-colors">
                  <LogOut size={18} /> Sign Out Completely
                </button>
              </div>

            </div>
          </div>
        </>
      )}
      
      {/* ===== FLOATING SIDEBAR ===== */}
      <aside className={`
        bg-sidebar rounded-2xl shadow-xl flex flex-col transition-all duration-400 ease-[cubic-bezier(0.25,1,0.5,1)]
        ${isMobile ? (isSidebarOpen ? 'fixed inset-y-4 left-4 z-40 w-64' : 'hidden') : (isSidebarOpen ? 'w-64' : 'w-20')}
        border border-border-dark relative
      `}>
        {!isMobile && (
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="absolute -right-3 top-8 w-6 h-6 rounded-full bg-sidebar border border-border-dark flex items-center justify-center text-white/80 hover:text-white hover:border-brand shadow-md transition-all z-20">
            {isSidebarOpen ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
          </button>
        )}
        <div className="p-5 pb-2 pt-6">
          <BrandLogo collapsed={!isSidebarOpen && !isMobile} />
        </div>
        <div className="flex-1 overflow-y-auto py-5 flex flex-col gap-1 px-3 custom-scrollbar">
          {!isSidebarOpen && !isMobile ? <div className="w-8 mx-auto h-px bg-border-dark mb-4" /> : <p className="text-[0.65rem] font-bold uppercase tracking-[0.12em] text-white/60 px-3 mb-2 mt-2">Main Menu</p>}
          {allowedNavItems.filter(n => n.section === 'main').map(item => (
            <NavLink key={item.to} to={item.to} end={item.to === '/'} onClick={() => isMobile && setIsSidebarOpen(false)}
              className={({ isActive }) => `
                group flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200 relative
                ${isActive ? 'bg-brand text-white shadow-md shadow-brand/20' : 'text-white/80 hover:bg-sidebar-hover hover:text-white'}
                ${!isSidebarOpen && !isMobile ? 'justify-center' : ''}
              `} title={!isSidebarOpen && !isMobile ? item.label : undefined}>
              {item.icon}
              <span className={`whitespace-nowrap transition-all duration-300 overflow-hidden ${!isSidebarOpen && !isMobile ? 'w-0 opacity-0' : 'w-auto opacity-100'}`}>{item.label}</span>
              {!isSidebarOpen && !isMobile && location.pathname === (item.to === '/' ? '/' : item.to) && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-white rounded-r-full shadow-[0_0_8px_white]" />}
            </NavLink>
          ))}
          {!isSidebarOpen && !isMobile ? <div className="w-8 mx-auto h-px bg-border-dark my-4" /> : <p className="text-[0.65rem] font-bold uppercase tracking-[0.12em] text-white/60 px-3 mt-4 mb-2">Clinical</p>}
          {allowedNavItems.filter(n => n.section === 'clinical').map(item => (
            <NavLink key={item.to} to={item.to} onClick={() => isMobile && setIsSidebarOpen(false)}
              className={({ isActive }) => `
                group flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200 relative
                ${isActive ? 'bg-brand text-white shadow-md shadow-brand/20' : 'text-white/80 hover:bg-sidebar-hover hover:text-white'}
                ${!isSidebarOpen && !isMobile ? 'justify-center' : ''}
              `} title={!isSidebarOpen && !isMobile ? item.label : undefined}>
              {item.icon}
              <span className={`whitespace-nowrap transition-all duration-300 overflow-hidden ${!isSidebarOpen && !isMobile ? 'w-0 opacity-0' : 'w-auto opacity-100'}`}>{item.label}</span>
              {!isSidebarOpen && !isMobile && location.pathname === item.to && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-white rounded-r-full shadow-[0_0_8px_white]" />}
            </NavLink>
          ))}
        </div>
        
        {/* User Profile */}
        <div className="p-4 mt-auto relative">
          <div 
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className={`flex items-center gap-3 p-2 rounded-xl transition-colors cursor-pointer ${!isSidebarOpen && !isMobile ? 'justify-center hover:bg-sidebar-hover' : 'bg-sidebar-hover hover:bg-brand/20'}`}
          >
            <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-md ${currentUser.role === 'admin' ? 'bg-gradient-to-br from-brand to-teal' : 'bg-gradient-to-br from-blue-500 to-indigo-500'}`}>
              {currentUser.username.substring(0, 2).toUpperCase()}
            </div>
            <div className={`flex-1 min-w-0 transition-all duration-300 overflow-hidden ${!isSidebarOpen && !isMobile ? 'w-0 opacity-0' : 'w-auto opacity-100'}`}>
              <p className="text-sm font-bold text-white truncate">{currentUser.username}</p>
              <p className="text-[0.65rem] text-teal truncate uppercase tracking-wider font-semibold">{currentUser.role === 'admin' ? 'Administrator' : 'Patient'}</p>
            </div>
          </div>
          
          {/* Profile Popup */}
          {showProfileMenu && (
            <div className={`absolute bottom-16 ${!isSidebarOpen && !isMobile ? 'left-16' : 'left-4 right-4'} bg-surface border border-border-dark rounded-xl shadow-2xl overflow-hidden z-50`}>
              <button onClick={doLogout} className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-danger hover:bg-danger/10 transition-colors">
                <LogOut size={16} /> Sign Out
              </button>
            </div>
          )}
        </div>
      </aside>

      {isMobile && isSidebarOpen && <div className="fixed inset-0 bg-black/60 z-30 backdrop-blur-sm" onClick={() => setIsSidebarOpen(false)} />}

      {/* ===== MAIN CONTENT AREA ===== */}
      <div className="flex-1 flex flex-col min-w-0 transition-all duration-400 relative">
        <header className="bg-header rounded-2xl shadow-xl h-16 flex items-center justify-between px-5 md:px-6 mb-3 sm:mb-4 border border-border-dark flex-shrink-0 relative z-10">
          <div className="flex items-center gap-3">
            {isMobile && (
              <button className="p-2 -ml-2 rounded-lg text-white/80 hover:bg-sidebar-hover transition-colors" onClick={() => setIsSidebarOpen(true)}>
                <Menu size={20} />
              </button>
            )}
            <h2 className="text-sm sm:text-base font-bold text-white tracking-wide">{getPageTitle()}</h2>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            <div className="hidden sm:flex items-center gap-2 bg-white rounded-full px-4 py-2 min-w-[240px] lg:min-w-[300px] transition-shadow focus-within:ring-2 focus-within:ring-brand/50 shadow-inner group">
              <Search size={15} className="text-txt-muted group-focus-within:text-brand transition-colors" />
              <input type="text" placeholder="Search resources..." className="bg-transparent border-none outline-none text-sm text-txt placeholder:text-txt-muted w-full transition-colors" />
            </div>
            
            <div className="relative flex items-center gap-1 sm:gap-2">
              <button onClick={() => setShowNotifications(!showNotifications)} className="relative p-2 rounded-xl text-white/80 hover:text-white hover:bg-sidebar-hover transition-all">
                <Bell size={18} />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-danger rounded-full shadow-[0_0_6px_var(--color-danger)] animate-pulse" />
              </button>
              
              <button onClick={() => setShowSettings(true)} className="p-2 rounded-xl text-white/80 hover:text-white hover:bg-sidebar-hover transition-all">
                <Settings size={18} />
              </button>
              
              {showNotifications && (
                <div className="absolute right-0 top-12 mt-2 w-72 bg-white rounded-xl shadow-2xl z-50 overflow-hidden border border-gray-200" style={{ opacity: 1, backgroundColor: '#ffffff' }}>
                  <div className="p-3 border-b border-gray-200 bg-gray-50">
                    <h3 className="font-bold text-gray-800 text-sm">Notifications</h3>
                  </div>
                  <div className="p-2 space-y-1 max-h-[300px] overflow-y-auto bg-white">
                    <div className="p-3 bg-brand/10 rounded-lg border border-brand/20">
                      <p className="text-xs font-bold text-brand mb-1">System Alert</p>
                      <p className="text-sm text-gray-800">Welcome to MedPal Health Suite</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto rounded-2xl bg-base pb-20 sm:pb-4 custom-scrollbar relative z-0">
          <Routes>
            <Route path="/" element={currentUser.role === 'admin' ? <Dashboard /> : <UserDashboard />} />
            <Route path="/fitness" element={<Fitness />} />
            <Route path="/companion" element={<AICompanion />} />
            <Route path="/tracker" element={<Tracker />} />
            <Route path="/vault" element={<Vault />} />
            <Route path="/vitals" element={<Vitals />} />
            <Route path="/records" element={<Records />} />
            <Route path="/hospitals" element={<Hospitals />} />
            <Route path="/appointments" element={<Appointments />} />
            <Route path="/telemedicine" element={<Telemedicine />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;
