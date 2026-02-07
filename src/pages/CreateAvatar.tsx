import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CreateAvatar: React.FC = () => {
    const navigate = useNavigate();
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [avatarName, setAvatarName] = useState<string>('');

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setSelectedImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="create-avatar-container" style={{
            position: 'fixed',
            inset: 0,
            overflow: 'hidden',
            backgroundColor: '#039BE5',
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column'
        }}>
            {/* Header / Background Area */}
            <div style={{
                flex: '0 0 32%',
                position: 'relative',
                backgroundImage: 'radial-gradient(rgba(255,255,255,0.1) 20%, transparent 20%), radial-gradient(rgba(255,255,255,0.1) 20%, transparent 20%)',
                backgroundSize: '20px 20px',
                backgroundColor: '#039BE5',
            }}>
                {/* Back Button */}
                <button
                    onClick={() => navigate('/')}
                    style={{
                        position: 'absolute',
                        top: 'calc(env(safe-area-inset-top) + 20px)',
                        left: '20px',
                        background: 'rgba(255, 255, 255, 0.9)',
                        border: 'none',
                        borderRadius: '50%',
                        width: '45px',
                        height: '45px',
                        fontSize: '1.2rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                        cursor: 'pointer',
                        zIndex: 10
                    }}
                >
                    ⬅️
                </button>

                {/* Overlay/Title for Top Section */}
                <div style={{
                    position: 'absolute',
                    bottom: '40px',
                    width: '100%',
                    textAlign: 'center',
                    zIndex: 1
                }}>
                    <h2 style={{
                        color: 'white',
                        fontSize: '1.8rem',
                        fontWeight: 700,
                        textShadow: '0 2px 4px rgba(0,0,0,0.2)'
                    }}>
                        New Friend
                    </h2>
                </div>
            </div>

            {/* Content Sheet - Overflow VISIBLE so avatar can pop out */}
            <div style={{
                flex: 1,
                backgroundColor: 'white',
                borderTopLeftRadius: '35px',
                borderTopRightRadius: '35px',
                padding: '0 24px', // Removed vertical padding from container
                display: 'flex',
                flexDirection: 'column',
                marginTop: '-30px',
                zIndex: 2,
                boxShadow: '0 -10px 30px rgba(0,0,0,0.1)',
                overflow: 'visible' // This is the key fix!
            }}>

                {/* Photo Upload - Fixed at the top, overflowing upwards */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    marginBottom: '10px',
                    marginTop: '-70px',
                    flexShrink: 0
                }}>
                    <div style={{
                        width: '140px',
                        height: '140px',
                        borderRadius: '50%',
                        background: 'white',
                        padding: '5px',
                        boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
                        position: 'relative'
                    }}>
                        <div style={{
                            width: '100%',
                            height: '100%',
                            borderRadius: '50%',
                            background: '#F0F4F8',
                            overflow: 'hidden',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: '3px dashed #B3E5FC',
                            position: 'relative'
                        }}>
                            {selectedImage ? (
                                <img src={selectedImage} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                                <span style={{ fontSize: '3rem', opacity: 0.5 }}>📸</span>
                            )}

                            {/* Hidden Input */}
                            <input
                                type="file"
                                accept="image/*"
                                id="avatar-upload"
                                style={{
                                    position: 'absolute',
                                    inset: 0,
                                    opacity: 0,
                                    cursor: 'pointer'
                                }}
                                onChange={handleImageUpload}
                            />
                        </div>
                        {/* Edit Icon Badge */}
                        <div style={{
                            position: 'absolute',
                            bottom: '5px',
                            right: '5px',
                            background: '#039BE5',
                            width: '35px',
                            height: '35px',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            border: '3px solid white',
                            pointerEvents: 'none'
                        }}>✏️</div>
                    </div>
                </div>

                {/* Scrollable Form Content */}
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '25px',
                    flex: 1,
                    overflowY: 'auto', // Scroll handled here
                    paddingBottom: '30px',
                    paddingTop: '10px'
                }}>

                    {/* Name Input */}
                    <div>
                        <label style={{ display: 'block', marginBottom: '10px', fontWeight: 600, color: '#546E7A', marginLeft: '10px' }}>
                            Name Your Avatar
                        </label>
                        <input
                            type="text"
                            placeholder="e.g. Sparky"
                            value={avatarName}
                            onChange={(e) => setAvatarName(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '18px',
                                borderRadius: '20px',
                                border: '2px solid #E1F5FE',
                                background: '#F9FAFB',
                                fontSize: '1.2rem',
                                color: '#37474F',
                                outline: 'none',
                                fontWeight: 500,
                                transition: 'border-color 0.2s'
                            }}
                            onFocus={(e) => e.target.style.borderColor = '#039BE5'}
                            onBlur={(e) => e.target.style.borderColor = '#E1F5FE'}
                        />
                    </div>

                    {/* Generate Button - Pushed to bottom of content flow */}
                    <button
                        disabled={!selectedImage || !avatarName.trim()}
                        onClick={() => navigate('/avatar-view', { state: { image: selectedImage, name: avatarName } })}
                        style={{
                            width: '100%',
                            backgroundColor: (!selectedImage || !avatarName.trim()) ? '#B0BEC5' : '#039BE5',
                            color: 'white',
                            border: 'none',
                            borderRadius: '20px',
                            padding: '20px',
                            fontSize: '1.3rem',
                            fontWeight: 700,
                            boxShadow: (!selectedImage || !avatarName.trim()) ? 'none' : '0 6px 0 #0277BD, 0 10px 20px rgba(3, 155, 229, 0.3)',
                            cursor: (!selectedImage || !avatarName.trim()) ? 'default' : 'pointer',
                            transition: 'all 0.2s',
                            marginTop: 'auto',
                            marginBottom: '10px'
                        }}
                    >
                        Create Friend! ✨
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreateAvatar;
