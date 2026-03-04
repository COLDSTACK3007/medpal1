
import { PhoneOff, MicOff, VideoOff, SwitchCamera } from 'lucide-react';
import './Telemedicine.css';

const Telemedicine = () => {
    return (
        <div className="telemedicine-page animate-fade-in">
            <div className="video-container card">
                {/* Remote Video Placeholder */}
                <div className="remote-video">
                    <div className="video-overlay text-center">
                        <h3 style={{ color: 'white', fontWeight: 500 }}>Waiting for Dr. Sharma</h3>
                        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem' }}>(Pediatrician)</p>
                    </div>
                </div>

                {/* Local Video Picture-in-Picture Placeholder */}
                <div className="local-video glass">
                    <span style={{ color: 'white', fontSize: '0.8rem', fontWeight: 500 }}>You</span>
                </div>

                {/* Call Controls */}
                <div className="call-controls glass">
                    <button className="control-btn"><MicOff size={22} /></button>
                    <button className="control-btn"><VideoOff size={22} /></button>
                    <button className="control-btn"><SwitchCamera size={22} /></button>
                    <button className="control-btn btn-danger" style={{ backgroundColor: 'var(--danger)' }}><PhoneOff size={22} /></button>
                </div>
            </div>
        </div>
    );
};

export default Telemedicine;
