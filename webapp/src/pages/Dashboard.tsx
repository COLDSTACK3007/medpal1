
import { Activity, Users, AlertTriangle, Stethoscope } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
    const navigate = useNavigate();

    return (
        <div className="animate-fade-in dashboard-page">
            <header className="page-header">
                <div>
                    <h2>Welcome, Dr. Singh</h2>
                    <p className="text-muted">Community Health Worker Dashboard</p>
                </div>
            </header>

            <div className="emergency-banner card" onClick={() => alert('Emergency Alert Sent!')}>
                <div className="emergency-content">
                    <div className="emergency-icon">
                        <AlertTriangle color="white" size={32} />
                    </div>
                    <div>
                        <h3 style={{ color: 'white', marginBottom: '4px' }}>EMERGENCY ALERT</h3>
                        <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '0.9rem' }}>Click to broadcast location and need</p>
                    </div>
                </div>
            </div>

            <div className="stats-grid">
                <div className="card stat-card">
                    <Users color="var(--primary)" size={28} />
                    <div className="stat-info">
                        <h4>124</h4>
                        <span className="text-muted">Patients</span>
                    </div>
                </div>
                <div className="card stat-card">
                    <Activity color="var(--success)" size={28} />
                    <div className="stat-info">
                        <h4>8</h4>
                        <span className="text-muted">Cases Today</span>
                    </div>
                </div>
            </div>

            <div className="quick-actions">
                <h3>Quick Actions</h3>
                <div className="actions-grid">
                    <button className="card action-btn" onClick={() => navigate('/symptom-checker')}>
                        <div className="action-icon" style={{ backgroundColor: '#EFF6FF', color: 'var(--primary)' }}>
                            <Stethoscope size={24} />
                        </div>
                        <span>Symptom Check</span>
                    </button>

                    <button className="card action-btn" onClick={() => navigate('/records')}>
                        <div className="action-icon" style={{ backgroundColor: '#F8FAFC', color: 'var(--text-muted)' }}>
                            <Users size={24} />
                        </div>
                        <span>Patient Records</span>
                    </button>
                </div>
            </div>

            <div className="recent-activity card">
                <h3>Recent Activity</h3>
                <div className="activity-list">
                    <div className="activity-item">
                        <div className="status-dot pending"></div>
                        <div className="activity-info">
                            <h4>Ramesh Kumar - High Fever</h4>
                            <p className="text-muted">2 hours ago • Sync Pending offline</p>
                        </div>
                    </div>
                    <div className="activity-item">
                        <div className="status-dot synced"></div>
                        <div className="activity-info">
                            <h4>Sita Devi - Routine Checkup</h4>
                            <p className="text-muted">5 hours ago • Synced</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
