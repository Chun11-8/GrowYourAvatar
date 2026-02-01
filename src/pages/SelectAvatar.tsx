import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllAvatars, type AvatarData } from '../utils/storage';

const SelectAvatar: React.FC = () => {
    const [avatars, setAvatars] = useState<AvatarData[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        const savedAvatars = getAllAvatars();
        setAvatars(savedAvatars);
    }, []);

    const handleSelect = (avatar: AvatarData) => {
        navigate('/avatar-view', { state: { avatarId: avatar.id } });
    };

    return (
        <div className="select-avatar-container" style={{ width: '100%', maxWidth: '800px', padding: '20px' }}>
            <div className="clay-container">
                <button
                    className="clay-button secondary"
                    style={{ padding: '8px 16px', fontSize: '0.9rem', marginBottom: '2rem' }}
                    onClick={() => navigate('/')}
                >
                    ← Back
                </button>

                <h1 style={{ textAlign: 'center', fontSize: '2.5rem', marginBottom: '1rem' }}>Welcome Back!</h1>
                <p style={{ textAlign: 'center', marginBottom: '3rem', color: '#666' }}>
                    Select your avatar to continue your adventure
                </p>

                {avatars.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '3rem' }}>
                        <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>🥚</div>
                        <h3>You don't have any avatars yet!</h3>
                        <button
                            className="clay-button"
                            style={{ marginTop: '1.5rem' }}
                            onClick={() => navigate('/create-avatar')}
                        >
                            Create Your First Avatar
                        </button>
                    </div>
                ) : (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                        gap: '2rem'
                    }}>
                        {avatars.map((avatar) => (
                            <div
                                key={avatar.id}
                                className="clay-card"
                                style={{
                                    cursor: 'pointer',
                                    textAlign: 'center',
                                    transition: 'transform 0.2s',
                                    padding: '1.5rem'
                                }}
                                onClick={() => handleSelect(avatar)}
                                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                            >
                                <div style={{
                                    width: '120px',
                                    height: '120px',
                                    borderRadius: '50%',
                                    background: 'var(--soft-blue)',
                                    margin: '0 auto 1rem auto',
                                    overflow: 'hidden',
                                    border: '4px solid white',
                                    boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
                                }}>
                                    <img
                                        src={avatar.image}
                                        alt="Avatar"
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                </div>
                                <h3 style={{ color: '#4A90E2', marginBottom: '0.5rem' }}>{avatar.style.charAt(0).toUpperCase() + avatar.style.slice(1)} Friend</h3>
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    gap: '10px',
                                    fontSize: '0.9rem'
                                }}>
                                    <span>❤️ {avatar.stats.health}/5</span>
                                    <span>😊 {avatar.stats.mood}/5</span>
                                </div>
                            </div>
                        ))}

                        {/* New Avatar Card */}
                        <div
                            className="clay-card"
                            style={{
                                cursor: 'pointer',
                                textAlign: 'center',
                                border: '3px dashed var(--soft-blue)',
                                background: 'rgba(255,255,255,0.4)',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center',
                                padding: '1.5rem'
                            }}
                            onClick={() => navigate('/create-avatar')}
                        >
                            <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>➕</div>
                            <p style={{ fontWeight: 700, color: 'var(--soft-blue)' }}>New Avatar</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SelectAvatar;
