import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getAllAvatars, deleteAvatar, type AvatarData } from '../utils/storage';

const SelectAvatar: React.FC = () => {
    const [avatars, setAvatars] = useState<AvatarData[]>([]);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [deadAlertName, setDeadAlertName] = useState<string | null>(null);

    // Scroll ref to center items (optional polish)
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const savedAvatars = getAllAvatars();
        setAvatars(savedAvatars);

        // Auto-select the first alive avatar if available
        const firstAlive = savedAvatars.find(a => !a.isDead);
        if (firstAlive) {
            setSelectedId(firstAlive.id);
        }

        const state = location.state as { deathAlert?: string };
        if (state?.deathAlert) {
            setDeadAlertName(state.deathAlert);
            window.history.replaceState({}, document.title);
        }
    }, [location.state]);

    const handleSelect = (avatar: AvatarData) => {
        if (avatar.isDead) return;
        setSelectedId(avatar.id);
        // Optional: Scroll to center this item
        // document.getElementById(`avatar-card-${avatar.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    };

    const handlePlay = () => {
        if (selectedId) {
            navigate('/avatar-view', { state: { avatarId: selectedId } });
        }
    };

    const handleDeleteClick = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        setDeletingId(id);
    };

    const confirmDelete = () => {
        if (deletingId) {
            deleteAvatar(deletingId);
            setAvatars(prev => {
                const updated = prev.filter(a => a.id !== deletingId);
                // If we deleted the selected one, select another
                if (selectedId === deletingId) {
                    const firstAlive = updated.find(a => !a.isDead);
                    setSelectedId(firstAlive ? firstAlive.id : null);
                }
                return updated;
            });
            setDeletingId(null);
        }
    };

    const cancelDelete = () => {
        setDeletingId(null);
    };

    const selectedAvatar = avatars.find(a => a.id === selectedId);

    return (
        <div className="select-avatar-container" style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: '#039BE5', // Theme Blue
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            fontFamily: '"Fredoka", sans-serif'
        }}>
            {/* Header Section */}
            <div style={{
                height: '35%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                position: 'relative',
                zIndex: 1,
                color: 'white',
                paddingBottom: '20px',
                // Subtle Monster Pattern Background
                backgroundImage: 'radial-gradient(rgba(255,255,255,0.1) 20%, transparent 20%), radial-gradient(rgba(255,255,255,0.1) 20%, transparent 20%)',
                backgroundColor: '#039BE5',
                backgroundPosition: '0 0, 25px 25px',
                backgroundSize: '50px 50px',
            }}>
                {/* Floating Monsters (CSS Only) */}
                <div style={{ position: 'absolute', top: '10%', left: '10%', fontSize: '2rem', opacity: 0.3, filter: 'grayscale(100%)', transform: 'rotate(-10deg)' }}>👾</div>
                <div style={{ position: 'absolute', bottom: '20%', right: '15%', fontSize: '2.5rem', opacity: 0.3, filter: 'grayscale(100%)', transform: 'rotate(15deg)' }}>🦖</div>
                <div style={{ position: 'absolute', top: '20%', right: '25%', fontSize: '1.5rem', opacity: 0.3, filter: 'grayscale(100%)', transform: 'rotate(5deg)' }}>🦄</div>
                <div style={{ position: 'absolute', bottom: '10%', left: '20%', fontSize: '2rem', opacity: 0.3, filter: 'grayscale(100%)', transform: 'rotate(-5deg)' }}>🐉</div>
                {/* Back Button */}
                <button
                    onClick={() => navigate('/')}
                    style={{
                        position: 'absolute',
                        top: 'calc(env(safe-area-inset-top) + 20px)',
                        left: '20px',
                        background: 'rgba(255,255,255,0.2)',
                        border: 'none',
                        borderRadius: '50%',
                        width: '40px',
                        height: '40px',
                        color: 'white',
                        fontSize: '1.2rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    ⬅️
                </button>

                {/* Top User Mock (from reference) */}
                <div style={{
                    position: 'absolute',
                    top: 'calc(env(safe-area-inset-top) + 20px)',
                    right: '20px',
                    display: 'flex',
                    gap: '10px'
                }}>

                </div>

                <div style={{ textAlign: 'center', marginTop: '20px' }}>
                    <h1 style={{
                        margin: 0,
                        fontSize: 'clamp(1.8rem, 6vw, 2.5rem)',
                        fontWeight: 700,
                        textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                        color: 'white'
                    }}>
                        Hand-pick Your<br />Character
                    </h1>
                    <div style={{
                        width: '40px',
                        height: '4px',
                        background: 'rgba(255,255,255,0.5)',
                        margin: '10px auto',
                        borderRadius: '2px'
                    }}></div>
                </div>
            </div>

            {/* Bottom Sheet */}
            <div style={{
                flex: 1,
                background: '#E1F5FE', // Light Blue Background
                borderTopLeftRadius: '35px',
                borderTopRightRadius: '35px',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                padding: '30px 0 0 0',
                boxShadow: '0 -10px 30px rgba(0,0,0,0.1)'
            }}>
                <div style={{ padding: '0 30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <h2 style={{ fontSize: '1.2rem', color: '#0277BD', margin: 0 }}>Choose Your Avatar</h2>
                </div>

                {/* Horizontal Scroll Area */}
                <div
                    ref={scrollContainerRef}
                    style={{
                        flex: 1,
                        overflowX: 'auto',
                        overflowY: 'hidden',
                        whiteSpace: 'nowrap',
                        padding: '10px 20px 30px 20px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '20px',
                        scrollSnapType: 'x mandatory',
                        WebkitOverflowScrolling: 'touch'
                    }}
                >


                    {avatars.map(avatar => {
                        const isSelected = selectedId === avatar.id;
                        const isDead = avatar.isDead;

                        return (
                            <div
                                key={avatar.id}
                                id={`avatar-card-${avatar.id}`}
                                onClick={() => handleSelect(avatar)}
                                style={{
                                    flex: '0 0 auto',
                                    width: isSelected ? 'clamp(160px, 45vw, 220px)' : 'clamp(140px, 40vw, 180px)',
                                    height: isSelected ? 'clamp(220px, 55vh, 340px)' : 'clamp(200px, 50vh, 300px)',
                                    background: isSelected ? '#fff' : '#fff',
                                    borderRadius: '24px',
                                    scrollSnapAlign: 'center',
                                    position: 'relative',
                                    transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                                    display: 'inline-flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    padding: '10px',
                                    border: isSelected ? '2px solid transparent' : '1px solid #eee',
                                    // Stronger, opaque shadow for clear segregation
                                    boxShadow: isSelected
                                        ? '0 20px 40px -5px rgba(0, 0, 0, 0.2), 0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                                        : '0 10px 20px -5px rgba(0, 0, 0, 0.1), 0 5px 10px -2px rgba(0, 0, 0, 0.05)',
                                    transform: isSelected ? 'translateY(-15px)' : 'none',
                                    opacity: isDead ? 0.7 : 1,
                                    cursor: isDead ? 'default' : 'pointer',
                                    margin: '10px 5px' // Add a little margin for spacing
                                }}
                            >
                                {/* Orange/Highlight Background for Selected */}
                                {isSelected && (
                                    <div style={{
                                        position: 'absolute',
                                        top: '15%',
                                        left: '10%',
                                        right: '10%',
                                        bottom: '15%',
                                        background: 'linear-gradient(135deg, #FF9800 0%, #FFB74D 100%)',
                                        borderRadius: '30px',
                                        zIndex: 0,
                                        opacity: 0.1
                                    }}></div>
                                )}

                                {/* Delete Button */}
                                <button
                                    onClick={(e) => handleDeleteClick(e, avatar.id)}
                                    style={{
                                        position: 'absolute',
                                        top: '10px',
                                        right: '10px',
                                        width: '24px',
                                        height: '24px',
                                        background: '#ffebee',
                                        color: '#ff6b6b',
                                        border: 'none',
                                        borderRadius: '50%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        zIndex: 10,
                                        cursor: 'pointer'
                                    }}
                                >
                                    ✕
                                </button>

                                {/* Avatar Image */}
                                <div style={{
                                    width: '80%',
                                    aspectRatio: '1/1',
                                    borderRadius: '50%',
                                    overflow: 'hidden',
                                    marginTop: '20px',
                                    marginBottom: 'auto',
                                    zIndex: 1,
                                    border: isSelected ? '4px solid white' : 'none',
                                    boxShadow: isSelected ? '0 8px 16px rgba(0,0,0,0.1)' : 'none',
                                    background: isDead ? '#eee' : 'transparent',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    {isDead ? (
                                        <div style={{ fontSize: '3rem' }}>🪦</div>
                                    ) : avatar.image ? (
                                        <img src={avatar.image} alt={avatar.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    ) : (
                                        <div style={{ fontSize: '3rem' }}>🐕</div>
                                    )}
                                </div>


                                {/* Text Info */}
                                <div style={{
                                    zIndex: 1,
                                    textAlign: 'center',
                                    marginBottom: '30px',
                                    opacity: isSelected ? 1 : 0.6,
                                    transition: 'opacity 0.3s',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    gap: '8px',
                                    width: '100%'
                                }}>
                                    <h3 style={{
                                        margin: '0',
                                        fontSize: isSelected ? '1.4rem' : '1.1rem',
                                        fontWeight: 700,
                                        color: '#333'
                                    }}>
                                        {avatar.name || 'Unnamed'}
                                    </h3>

                                    {/* Level Badge */}
                                    <div style={{
                                        background: '#E0F7FA',
                                        color: '#006064',
                                        padding: '4px 12px',
                                        borderRadius: '15px',
                                        fontSize: '0.9rem',
                                        fontWeight: 700,
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '5px',
                                        boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                                    }}>
                                        <span>🏆</span> Lvl {avatar.level || 1}
                                    </div>

                                    {/* Stats Grid - Only show when selected */}
                                    {isSelected && (
                                        <div style={{
                                            display: 'grid',
                                            gridTemplateColumns: 'repeat(3, 1fr)',
                                            gap: '8px',
                                            marginTop: '10px',
                                            padding: '8px',
                                            background: '#fff',
                                            borderRadius: '12px',
                                            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                                            width: '90%'
                                        }}>
                                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                                <span style={{ fontSize: '1.2rem' }}>❤️</span>
                                                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#555' }}>
                                                    {avatar.stats?.health ?? 5}
                                                </span>
                                            </div>
                                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                                <span style={{ fontSize: '1.2rem' }}>⚡</span>
                                                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#555' }}>
                                                    {avatar.stats?.mana ?? 5}
                                                </span>
                                            </div>
                                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                                <span style={{ fontSize: '1.2rem' }}>🌟</span>
                                                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#555' }}>
                                                    {avatar.stats?.mood ?? 5}
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}

                    {/* Create New Card */}
                    <div
                        onClick={() => navigate('/create-avatar')}
                        style={{
                            flex: '0 0 auto',
                            width: 'clamp(140px, 40vw, 180px)',
                            height: 'clamp(200px, 50vh, 300px)',
                            background: '#F0F4F8',
                            borderRadius: '24px',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            scrollSnapAlign: 'center',
                            border: '3px dashed #B0BEC5',
                            cursor: 'pointer',
                            color: '#B0BEC5'
                        }}
                    >
                        <div style={{ fontSize: '3rem', marginBottom: '10px' }}>➕</div>
                        <span style={{ fontWeight: 700 }}>New Friend</span>
                    </div>
                </div>

                {/* Bottom Action Area (Price/Select) */}
                <div style={{
                    padding: '20px 30px calc(env(safe-area-inset-bottom) + 20px) 30px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    {selectedAvatar ? (
                        <button
                            onClick={handlePlay}
                            style={{
                                background: 'white',
                                color: '#039BE5',
                                border: 'none',
                                borderRadius: '30px',
                                padding: '18px 50px',
                                fontSize: '1.3rem',
                                fontWeight: 800,
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                boxShadow: '0 8px 25px rgba(255, 255, 255, 0.4), 0 5px 15px rgba(0,0,0,0.1)',
                                cursor: 'pointer',
                                transition: 'transform 0.1s, box-shadow 0.2s',
                                textTransform: 'uppercase',
                                letterSpacing: '1px'
                            }}
                        >
                            <span className="animate-pulse">👑 Play with {selectedAvatar.name || 'Friend'}</span>
                        </button>
                    ) : (
                        <div style={{ height: '50px' }}></div>
                    )}
                </div>
            </div>

            {/* Modals (Death / Delete) - Simplified styles for brevity */}
            {deadAlertName && (
                <div style={{
                    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999
                }}>
                    <div style={{ background: 'white', padding: '30px', borderRadius: '20px', maxWidth: '300px', textAlign: 'center' }}>
                        <h1>🪦</h1>
                        <h2 style={{ color: '#d63031' }}>Rest in Peace</h2>
                        <p>{deadAlertName} has passed away.</p>
                        <button onClick={() => setDeadAlertName(null)} style={{ padding: '10px 20px', background: '#ff6b6b', color: 'white', border: 'none', borderRadius: '10px' }}>Okay</button>
                    </div>
                </div>
            )}

            {deletingId && (
                <div style={{
                    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999
                }}>
                    <div style={{ background: 'white', padding: '30px', borderRadius: '20px', maxWidth: '300px', textAlign: 'center' }}>
                        <h1>😟</h1>
                        <h3>Delete Friend?</h3>
                        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '20px' }}>
                            <button onClick={cancelDelete} style={{ padding: '10px 20px', background: '#ddd', border: 'none', borderRadius: '10px' }}>Cancel</button>
                            <button onClick={confirmDelete} style={{ padding: '10px 20px', background: '#ff6b6b', color: 'white', border: 'none', borderRadius: '10px' }}>Delete</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SelectAvatar;
