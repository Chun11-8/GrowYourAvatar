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

                <h1 style={{ textAlign: 'center', fontSize: '1.8rem', marginBottom: '0.5rem', color: '#4A90E2' }}>My Friends</h1>
                <p style={{ textAlign: 'center', marginBottom: '1.5rem', color: '#666', fontSize: '0.9rem' }}>
                    Select your avatar to continue
                </p>

                {avatars.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '2rem' }}>
                        <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>🥚</div>
                        <h3>No friends yet!</h3>
                        <button
                            className="clay-button"
                            style={{ marginTop: '1rem' }}
                            onClick={() => navigate('/create-avatar')}
                        >
                            Create One!
                        </button>
                    </div>
                ) : (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3, 1fr)',
                        gap: '0.8rem',
                        width: '100%'
                    }}>
                        {avatars.map((avatar) => (
                            <div
                                key={avatar.id}
                                className="clay-card"
                                style={{
                                    cursor: 'pointer',
                                    textAlign: 'center',
                                    transition: 'transform 0.2s',
                                    padding: '0.6rem',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    background: 'white'
                                }}
                                onClick={() => handleSelect(avatar)}
                                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                            >
                                <div style={{
                                    width: 'clamp(50px, 15vw, 90px)',
                                    height: 'clamp(50px, 15vw, 90px)',
                                    borderRadius: '50%',
                                    background: 'var(--soft-blue)',
                                    margin: '0 auto 0.5rem auto',
                                    overflow: 'hidden',
                                    border: '3px solid white',
                                    boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                                }}>
                                    <img
                                        src={avatar.image}
                                        alt="Avatar"
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                </div>
                                <h3 style={{
                                    color: '#4A90E2',
                                    fontSize: '0.75rem',
                                    marginBottom: '0.3rem',
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    width: '100%'
                                }}>
                                    {avatar.style.charAt(0).toUpperCase() + avatar.style.slice(1)}
                                </h3>
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    gap: '5px',
                                    fontSize: '0.65rem',
                                    fontWeight: 700
                                }}>
                                    <span>❤️ {avatar.stats.health}</span>
                                    <span>😊 {avatar.stats.mood}</span>
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
                                padding: '0.6rem',
                                minHeight: '100px'
                            }}
                            onClick={() => navigate('/create-avatar')}
                        >
                            <div style={{ fontSize: '1.5rem', marginBottom: '0.3rem' }}>➕</div>
                            <p style={{ fontWeight: 700, color: 'var(--soft-blue)', fontSize: '0.7rem' }}>New</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SelectAvatar;
