import { useState, useEffect } from 'react';
import { Search, User, Plus, FileText, RefreshCw, CheckCircle2 } from 'lucide-react';
import localforage from 'localforage';
import './Records.css';

interface Patient {
    id: string;
    name: string;
    age: number;
    gender: string;
    village: string;
    lastVisit: string;
    synced: boolean;
}

const INITIAL_MOCK_DATA: Patient[] = [
    { id: 'PT-1001', name: 'Ramesh Kumar', age: 45, gender: 'M', village: 'Rampur', lastVisit: '2023-10-25', synced: true },
    { id: 'PT-1002', name: 'Sita Devi', age: 32, gender: 'F', village: 'Rampur', lastVisit: '2023-10-26', synced: true },
    { id: 'PT-1003', name: 'Arjun Singh', age: 12, gender: 'M', village: 'Sitapur', lastVisit: '2023-10-20', synced: false },
];

const Records = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [patients, setPatients] = useState<Patient[]>([]);
    const [syncing, setSyncing] = useState(false);

    useEffect(() => {
        // Initialize Local Storage Records
        const loadData = async () => {
            let stored = await localforage.getItem<Patient[]>('patients_db');
            if (!stored || stored.length === 0) {
                await localforage.setItem('patients_db', INITIAL_MOCK_DATA);
                stored = INITIAL_MOCK_DATA;
            }
            setPatients(stored);
        };
        loadData();
    }, []);

    const handleSync = async () => {
        setSyncing(true);
        const unsynced = patients.filter(p => !p.synced);

        if (unsynced.length === 0) {
            setTimeout(() => setSyncing(false), 500);
            return;
        }

        try {
            const response = await fetch('http://localhost:3000/api/sync', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ records: unsynced })
            });

            if (response.ok) {
                // Mark all as synced in local DB
                const updated = patients.map(p => ({ ...p, synced: true }));
                await localforage.setItem('patients_db', updated);
                setPatients(updated);
            }
        } catch (e) {
            console.error("Sync failed (Offline Mode Active)", e);
            alert("Network unavailable. Records remain saved locally.");
        } finally {
            setSyncing(false);
        }
    };

    const filteredPatients = patients.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.id.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="records-page animate-fade-in">
            <header className="records-header">
                <div>
                    <h2>Patient Records</h2>
                    <p className="text-muted">Offline-first local database</p>
                </div>
                <div className="header-actions">
                    <button
                        className={`btn btn-secondary sync-btn ${syncing ? 'syncing' : ''}`}
                        onClick={handleSync}
                        disabled={syncing}
                    >
                        <RefreshCw size={18} />
                        <span className="hide-mobile">{syncing ? 'Syncing...' : 'Sync Pending'}</span>
                    </button>
                    <button className="btn btn-primary btn-icon">
                        <Plus size={20} />
                    </button>
                </div>
            </header>

            <div className="search-bar">
                <Search color="var(--text-muted)" size={20} className="search-icon" />
                <input
                    type="text"
                    placeholder="Search by name or ID (e.g. PT-1001)"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            <div className="patients-list">
                {filteredPatients.length === 0 ? (
                    <div className="empty-state text-center">
                        <User size={48} color="var(--text-muted)" style={{ opacity: 0.5, margin: '0 auto 16px' }} />
                        <p className="text-muted">No patients found.</p>
                    </div>
                ) : (
                    filteredPatients.map((item) => (
                        <div key={item.id} className="card patient-card">
                            <div className="patient-header">
                                <div className="patient-avatar">
                                    <User color="var(--primary)" size={24} />
                                </div>
                                <div className="patient-info">
                                    <div className="patient-title-row">
                                        <h3>{item.name}</h3>
                                        {item.synced ? (
                                            <div title="Synced with server" style={{ display: 'inline-flex' }}>
                                                <CheckCircle2 size={16} color="var(--success)" />
                                            </div>
                                        ) : (
                                            <div className="status-dot pending" title="Pending Sync" style={{ marginTop: 0 }}></div>
                                        )}
                                    </div>
                                    <p className="text-muted">{item.id} • {item.age} yrs • {item.gender}</p>
                                </div>
                            </div>

                            <div className="patient-details">
                                <div className="detail-row">
                                    <span className="detail-label">Village:</span>
                                    <span className="detail-value">{item.village}</span>
                                </div>
                                <div className="detail-row">
                                    <span className="detail-label">Last Visit:</span>
                                    <span className="detail-value">{item.lastVisit}</span>
                                </div>
                            </div>

                            <div className="patient-actions">
                                <button className="btn-text">
                                    <FileText size={16} /> View History
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Records;
