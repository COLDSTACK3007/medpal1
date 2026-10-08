import { Activity, Calendar, FileText, Bell, MapPin, AlertTriangle, ArrowUpRight, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { API_BASE_URL } from '../config';

const UserDashboard = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [sosStatus, setSosStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold text-txt">Welcome back, {currentUser?.username}!</h1>
          <p className="text-sm text-txt-muted">Here is your health overview for today.</p>
        </div>
      </div>

      {/* EMERGENCY ALERT BUTTON */}
      <button 
        onClick={() => {
          setSosStatus('loading'); // Show loading popup IMMEDIATELY

          const notifyGuardian = async (locString: string) => {
            if (currentUser?.guardians && currentUser.guardians.length > 0) {
              // Extract all valid emails from all guardians and join them with a comma
              const allGuardianEmails = currentUser.guardians
                .map(g => g.email)
                .filter(email => email && email.trim() !== "")
                .join(",");
              
              if (!allGuardianEmails) {
                alert("No guardian emails are configured! Please update in settings.");
                setSosStatus('idle');
                return;
              }

              try {
                const response = await fetch(`${API_BASE_URL}/api/emergency/email`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    guardianEmail: allGuardianEmails,
                    patientName: currentUser?.fullName || currentUser?.username,
                    patientAge: currentUser?.age,
                    patientGender: currentUser?.gender,
                    patientContact: currentUser?.contact,
                    patientEmail: currentUser?.email,
                    patientAddress: currentUser?.address,
                    locationUrl: locString
                  })
                });

                if (response.ok) {
                  setSosStatus('success');
                } else {
                  setSosStatus('error');
                }
              } catch (error) {
                setSosStatus('error');
              }
            }
          };

          if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
              (pos) => notifyGuardian(`https://www.google.com/maps?q=${pos.coords.latitude},${pos.coords.longitude}`),
              () => notifyGuardian("Location sharing denied/unavailable")
            );
          } else {
            notifyGuardian("Location sharing not supported");
          }
        }}
        className="w-full bg-danger text-white rounded-2xl p-4 flex items-center justify-between hover:bg-red-600 transition-all shadow-[0_0_20px_var(--color-danger)] animate-pulse hover:animate-none group"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
            <AlertTriangle size={24} className="text-white" />
          </div>
          <div className="text-left">
            <h2 className="font-black text-lg tracking-wide">EMERGENCY ALERT SYSTEM</h2>
            <p className="text-sm text-white/90">Broadcast your location and emergency need to guardians <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full ml-2">(108 Dialing Disabled for Testing)</span></p>
          </div>
        </div>
        <ArrowUpRight size={24} className="opacity-50 group-hover:opacity-100 transition-opacity" />
      </button>

      {/* Quick Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: <Bell size={24} />, title: "Medications", desc: "2 pills remaining today", color: "text-brand", bg: "bg-brand/10", nav: "/tracker" },
          { icon: <Calendar size={24} />, title: "Appointments", desc: "No upcoming visits", color: "text-teal", bg: "bg-teal/10", nav: "/appointments" },
          { icon: <FileText size={24} />, title: "Health Vault", desc: "3 new lab reports", color: "text-blue-500", bg: "bg-blue-500/10", nav: "/vault" },
          { icon: <Activity size={24} />, title: "Vitals", desc: "BP is normal (118/78)", color: "text-orange-500", bg: "bg-orange-500/10", nav: "/vitals" },
        ].map((card, i) => (
          <div 
            key={i} 
            onClick={() => navigate(card.nav)}
            className="p-5 rounded-2xl bg-surface border border-border hover:border-brand/50 cursor-pointer transition-all shadow-sm flex flex-col gap-3 group"
          >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${card.bg} ${card.color} group-hover:scale-110 transition-transform`}>
              {card.icon}
            </div>
            <div>
              <h3 className="font-bold text-txt">{card.title}</h3>
              <p className="text-xs text-txt-secondary mt-0.5">{card.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-4">
        {/* Find Hospital Shortcut */}
        <div className="lg:col-span-2 bg-gradient-to-br from-brand to-teal rounded-3xl p-8 text-white shadow-xl relative overflow-hidden flex flex-col justify-center min-h-[250px]">
          <div className="z-10 max-w-md space-y-4">
            <h2 className="text-3xl font-black">Need a specialist?</h2>
            <p className="text-white/80 font-medium">Search our nationwide database of top-rated hospitals and book an appointment instantly.</p>
            <button 
              onClick={() => navigate('/appointments')}
              className="px-6 py-3 bg-white text-brand rounded-xl font-bold hover:shadow-[0_0_20px_rgba(255,255,255,0.4)] transition-all flex items-center gap-2 w-max"
            >
              <MapPin size={18} /> Find Hospitals
            </button>
          </div>
          <MapPin size={200} className="absolute -right-10 -bottom-10 text-white/10 rotate-12" />
        </div>

        {/* Mini Vitals Summary */}
        <div className="bg-surface border border-border rounded-3xl p-6 shadow-sm">
          <h3 className="font-bold text-txt mb-4 flex items-center gap-2">
            <Activity size={18} className="text-brand" /> Recent Vitals
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-base rounded-xl border border-border-dark">
              <span className="text-sm font-medium text-txt-secondary">Blood Pressure</span>
              <span className="font-bold text-txt">118/78</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-base rounded-xl border border-border-dark">
              <span className="text-sm font-medium text-txt-secondary">Heart Rate</span>
              <span className="font-bold text-txt">72 bpm</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-base rounded-xl border border-border-dark">
              <span className="text-sm font-medium text-txt-secondary">Weight</span>
              <span className="font-bold text-txt">{currentUser?.weight || '--'} kg</span>
            </div>
            <button 
              onClick={() => navigate('/vitals')}
              className="w-full py-2 text-sm font-bold text-brand hover:underline mt-2"
            >
              View Full History &rarr;
            </button>
          </div>
        </div>
      </div>

      {/* SOS MODAL */}
      {sosStatus !== 'idle' && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white max-w-sm w-full rounded-2xl p-8 flex flex-col items-center text-center shadow-2xl">
            {sosStatus === 'loading' && (
              <>
                <Loader2 size={64} className="text-brand animate-spin mb-4" />
                <h3 className="text-xl font-black text-gray-900 mb-2">Sending SOS...</h3>
                <p className="text-gray-500 text-sm">Notifying your guardian. Please hold on.</p>
              </>
            )}
            {sosStatus === 'success' && (
              <>
                <CheckCircle size={64} className="text-teal mb-4" />
                <h3 className="text-xl font-black text-gray-900 mb-2">SOS Sent Successfully</h3>
                <p className="text-gray-500 text-sm mb-6">Your guardian has been notified with your live location.</p>
                <button onClick={() => setSosStatus('idle')} className="w-full bg-gray-100 text-gray-800 font-bold py-3 rounded-xl hover:bg-gray-200">Close</button>
              </>
            )}
            {sosStatus === 'error' && (
              <>
                <XCircle size={64} className="text-danger mb-4" />
                <h3 className="text-xl font-black text-gray-900 mb-2">Failed to Send</h3>
                <p className="text-gray-500 text-sm mb-6">There was an error communicating with the server.</p>
                <button onClick={() => setSosStatus('idle')} className="w-full bg-gray-100 text-gray-800 font-bold py-3 rounded-xl hover:bg-gray-200">Close</button>
              </>
            )}
          </div>
        </div>
      )}

    </div>
  );
};

export default UserDashboard;
