import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CreateAvatar: React.FC = () => {
    const navigate = useNavigate();
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [selectedStyle, setSelectedStyle] = useState<string>('clay');

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

    const artStyles = [
        { id: 'clay', name: 'Claymorphism', color: '#B8E4D5' },
        { id: 'pixel', name: 'Pixel Art', color: '#FFDAB9' },
        { id: 'voxel', name: 'Voxel (3D)', color: '#A2D2FF' },
    ];

    return (
        <div className="create-avatar-container" style={{ width: '100%', maxWidth: '600px', padding: '20px' }}>
            <div className="clay-container">
                <button
                    className="clay-button secondary"
                    style={{ padding: '8px 16px', fontSize: '0.9rem', marginBottom: '1rem' }}
                    onClick={() => navigate('/')}
                >
                    ← Back
                </button>

                <h2 style={{ fontSize: '2rem', marginBottom: '2rem', color: '#4A90E2', textAlign: 'center' }}>Create Your Avatar</h2>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    {/* Top Section: Upload */}
                    <div className="clay-card" style={{ textAlign: 'center' }}>
                        <h3 style={{ marginBottom: '1rem' }}>1. Upload Your Photo</h3>
                        <div
                            style={{
                                width: '100%',
                                height: '220px',
                                background: '#f8fafc',
                                borderRadius: '20px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                overflow: 'hidden',
                                border: '3px dashed var(--soft-blue)',
                                marginBottom: '1.5rem',
                                position: 'relative'
                            }}
                        >
                            {selectedImage ? (
                                <img src={selectedImage} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                                <div style={{ textAlign: 'center', color: '#64748b' }}>
                                    <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>📸</div>
                                    <p>Click "Select Image" to begin</p>
                                </div>
                            )}
                        </div>
                        <input
                            type="file"
                            accept="image/*"
                            id="avatar-upload"
                            style={{ display: 'none' }}
                            onChange={handleImageUpload}
                        />
                        <label htmlFor="avatar-upload" className="clay-button" style={{ display: 'inline-block', fontSize: '1.1rem' }}>
                            Select Image
                        </label>
                    </div>

                    {/* Bottom Section: Style Selection */}
                    <div className="clay-card">
                        <h3 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>2. Choose Your Style</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem' }}>
                            {artStyles.map((style) => (
                                <div
                                    key={style.id}
                                    onClick={() => setSelectedStyle(style.id)}
                                    style={{
                                        padding: '16px',
                                        borderRadius: '20px',
                                        background: selectedStyle === style.id ? style.color : 'rgba(255,255,255,0.8)',
                                        border: '3px solid',
                                        borderColor: selectedStyle === style.id ? 'white' : 'transparent',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                                        fontWeight: 700,
                                        textAlign: 'center',
                                        boxShadow: selectedStyle === style.id ? 'var(--clay-shadow-inset)' : 'var(--clay-shadow)',
                                        transform: selectedStyle === style.id ? 'scale(0.95)' : 'scale(1)'
                                    }}
                                >
                                    <div style={{
                                        width: '30px',
                                        height: '30px',
                                        borderRadius: '50%',
                                        background: style.color,
                                        margin: '0 auto 10px auto',
                                        border: '2px solid white'
                                    }}></div>
                                    {style.name}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div style={{ textAlign: 'center', marginTop: '3rem' }}>
                    <button
                        className="clay-button"
                        style={{ width: '100%', padding: '16px', fontSize: '1.3rem' }}
                        disabled={!selectedImage}
                        onClick={() => navigate('/avatar-view', { state: { image: selectedImage, style: selectedStyle } })}
                    >
                        Generate 3D Avatar! ✨
                    </button>
                    {!selectedImage && <p style={{ fontSize: '0.9rem', color: '#ff6b6b', marginTop: '0.8rem', fontWeight: 600 }}>Please upload an image first</p>}
                </div>
            </div>
        </div>
    );
};

export default CreateAvatar;
