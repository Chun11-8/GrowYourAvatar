import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { generateVoxelScene } from '../services/gemini';
import {
    getAvatarById,
    saveAvatar,
    createInitialStats,
    type AvatarData,
    type MoodState
} from '../utils/storage';

const AvatarView: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const iframeRef = useRef<HTMLIFrameElement>(null);

    // Params from state
    const { image, style, avatarId } = (location.state as { image?: string, style?: string, avatarId?: string }) || {};

    const [avatar, setAvatar] = useState<AvatarData | null>(null);
    const [status, setStatus] = useState<'idle' | 'generating' | 'error'>('idle');
    const [thinkingText, setThinkingText] = useState<string | null>(null);
    const [errorMsg, setErrorMsg] = useState('');

    // Load or Generate Avatar
    useEffect(() => {
        if (avatarId) {
            const saved = getAvatarById(avatarId);
            if (saved) {
                setAvatar(saved);
                return;
            }
        }

        if (image && style && !avatar) {
            handleGenerateVoxel();
        }
    }, [avatarId, image, style]);

    const handleGenerateVoxel = async () => {
        if (!image || !style) return;
        setStatus('generating');
        setErrorMsg('');

        try {
            const code = await generateVoxelScene(image, (thought) => {
                setThinkingText(thought);
            });

            const newAvatar: AvatarData = {
                id: Math.random().toString(36).substr(2, 9),
                image,
                style,
                voxelCode: code,
                stats: createInitialStats(),
                currentMoodState: 'happy',
                createdAt: Date.now()
            };

            setAvatar(newAvatar);
            saveAvatar(newAvatar);
            setStatus('idle');
            setThinkingText(null);
        } catch (err: any) {
            console.error(err);
            setStatus('error');
            setErrorMsg(err.message || 'Failed to generate 3D avatar.');
        }
    };

    const handleAction = (action: string) => {
        if (!avatar) return;

        const newStats = { ...avatar.stats };
        let newMood: MoodState | undefined;

        switch (action) {
            case 'feed':
                newStats.health = Math.min(5, newStats.health + 1);
                newMood = 'happy';
                break;
            case 'play':
                // Navigate to Game Hub
                navigate('/game-hub');
                return; // Exit early as we are navigating
            case 'rest':
                newStats.mana = Math.min(5, newStats.mana + 1);
                newMood = 'sleepy';
                break;
            case 'train':
                newStats.mana = Math.max(0, newStats.mana - 1);
                newStats.health = Math.min(5, newStats.health + 1);
                newMood = 'excited';
                break;
        }

        const updatedAvatar: AvatarData = {
            ...avatar,
            stats: newStats,
            currentMoodState: newMood || avatar.currentMoodState
        };

        saveAvatar(updatedAvatar);
        setAvatar(updatedAvatar);

        // Notify iframe if mood changed
        if (newMood && iframeRef.current?.contentWindow) {
            iframeRef.current.contentWindow.postMessage({ type: 'CHANGE_MOOD', mood: newMood }, '*');
        }
    };

    if (!avatar && status !== 'generating' && status !== 'error') {
        return (
            <div className="avatar-view-container" style={{ textAlign: 'center', padding: '50px' }}>
                <div className="clay-container">
                    <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>No Avatar Found</h2>
                    <p style={{ marginBottom: '2rem' }}>You need to create or select an avatar first!</p>
                    <button className="clay-button" onClick={() => navigate('/select-avatar')}>Go Select One!</button>
                </div>
            </div>
        );
    }

    return (
        <div className="avatar-view-container" style={{ width: '100%', maxWidth: '800px', padding: '10px' }}>
            <div className="clay-container" style={{ position: 'relative', overflow: 'hidden', paddingTop: '4rem' }}>

                {/* Back/Home Button */}
                <button
                    className="clay-button secondary"
                    style={{ position: 'absolute', top: '1.5rem', left: '1.5rem', padding: '8px 16px', fontSize: '0.9rem', zIndex: 10 }}
                    onClick={() => navigate('/select-avatar')}
                >
                    ← Friends
                </button>

                {/* Stats Bar */}
                <div style={{
                    position: 'absolute',
                    top: '1.5rem',
                    right: '1.5rem',
                    display: 'flex',
                    gap: '1rem',
                    zIndex: 10
                }}>
                    <StatBadge label="❤️" value={avatar?.stats.health || 0} />
                    <StatBadge label="✨" value={avatar?.stats.mana || 0} />
                    <StatBadge label="😊" value={avatar?.stats.mood || 0} />
                </div>

                <div style={{ clear: 'both' }}></div>

                {/* Main View Area */}
                <div style={{
                    margin: '1rem auto',
                    width: '100%',
                    height: '500px',
                    background: 'linear-gradient(180deg, #f0f7ff 0%, #ffffff 100%)',
                    borderRadius: '40px',
                    boxShadow: 'var(--clay-shadow-inset)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    overflow: 'hidden',
                    border: '8px solid white'
                }}>
                    {status === 'generating' && (
                        <div style={{
                            position: 'absolute',
                            inset: 0,
                            background: 'white',
                            zIndex: 20,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '2rem'
                        }}>
                            <div className="clay-card" style={{ background: 'var(--soft-blue)', color: 'white', textAlign: 'center' }}>
                                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✨</div>
                                <h3 style={{ marginBottom: '10px' }}>Creating Magic...</h3>
                                <p style={{ fontSize: '0.9rem', opacity: 0.9 }}>{thinkingText || 'Bringing your avatar to life in 3D'}</p>
                                <div style={{ marginTop: '20px', display: 'flex', gap: '8px', justifyContent: 'center' }}>
                                    {[0, 1, 2].map(i => (
                                        <div key={i} style={{
                                            width: '12px',
                                            height: '12px',
                                            background: 'white',
                                            borderRadius: '50%',
                                            animation: `float 1s infinite alternate ${i * 0.2}s`
                                        }}></div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {status === 'error' && (
                        <div style={{ padding: '20px', color: '#ff6b6b', textAlign: 'center', zIndex: 20 }}>
                            <h3>Oops! Something went wrong</h3>
                            <p>{errorMsg}</p>
                            <button className="clay-button" onClick={handleGenerateVoxel} style={{ marginTop: '20px' }}>Try Again</button>
                        </div>
                    )}

                    {avatar?.voxelCode ? (
                        <iframe
                            ref={iframeRef}
                            title="Voxel Scene"
                            srcDoc={avatar.voxelCode}
                            style={{ width: '100%', height: '100%', border: '0' }}
                            sandbox="allow-scripts allow-same-origin"
                        />
                    ) : (
                        avatar?.image && (
                            <div style={{ textAlign: 'center' }}>
                                <img src={avatar.image} alt="Avatar" style={{ width: '250px', borderRadius: '40px', boxShadow: 'var(--clay-shadow)' }} />
                            </div>
                        )
                    )}

                    {/* Interaction Tooltip */}
                    <div style={{
                        position: 'absolute',
                        bottom: '20px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        background: 'rgba(255,255,255,0.8)',
                        padding: '8px 16px',
                        borderRadius: '20px',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        color: '#4A90E2',
                        backdropFilter: 'blur(4px)',
                        pointerEvents: 'none'
                    }}>
                        Tap to Pat or Tickle! ✨
                    </div>
                </div>

                {/* Interaction Buttons */}
                <div style={{
                    display: 'flex',
                    gap: '1rem',
                    justifyContent: 'center',
                    marginTop: '1.5rem',
                    flexWrap: 'wrap'
                }}>
                    <ActionButton icon="🍎" label="Feed" onClick={() => handleAction('feed')} />
                    <ActionButton icon="🎮" label="Play" onClick={() => handleAction('play')} />
                    <ActionButton icon="💤" label="Rest" onClick={() => handleAction('rest')} />
                    <ActionButton icon="✨" label="Train" onClick={() => handleAction('train')} />
                </div>

                {/* Current Mood Text */}
                <div style={{
                    textAlign: 'center',
                    marginTop: '2rem',
                    fontSize: '1.2rem',
                    fontWeight: 700,
                    color: '#666'
                }}>
                    Feeling {avatar?.currentMoodState || 'happy'} today!
                </div>
            </div>
        </div>
    );
};

// Sub-components
const StatBadge = ({ label, value }: { label: string, value: number }) => (
    <div style={{
        background: 'white',
        padding: '6px 14px',
        borderRadius: '15px',
        boxShadow: 'var(--clay-shadow)',
        fontWeight: 800,
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        color: '#555',
        border: '2px solid rgba(0,0,0,0.05)'
    }}>
        <span>{label}</span>
        <span style={{ color: '#4A90E2' }}>{value}/5</span>
    </div>
);

const ActionButton = ({ icon, label, onClick }: { icon: string, label: string, onClick: () => void }) => (
    <button
        className="clay-button"
        onClick={onClick}
        style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '5px',
            padding: '12px',
            minWidth: '80px',
            background: 'white'
        }}
    >
        <span style={{ fontSize: '1.5rem' }}>{icon}</span>
        <span style={{ fontSize: '0.8rem' }}>{label}</span>
    </button>
);

export default AvatarView;
