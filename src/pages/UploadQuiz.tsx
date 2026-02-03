import React from 'react';
import { useNavigate } from 'react-router-dom';

const UploadQuiz: React.FC = () => {
    const navigate = useNavigate();

    const options = [
        {
            id: 'camera',
            title: 'Photo or Upload',
            desc: 'Upload from your gallery or by document',
            icon: '📸',
            color: '#FFADAD'
        },
        {
            id: 'manual',
            title: 'Manual Input',
            desc: 'Type in your own questions and answers',
            icon: '✍️',
            color: '#A0C4FF'
        },
        {
            id: 'ai',
            title: 'AI Generation',
            desc: 'Let the magic AI create questions for you',
            icon: '✨',
            color: '#CAFFBF'
        }
    ];

    const handleChoice = (id: string) => {
        if (id === 'manual') {
            navigate('/manual-quiz');
        } else if (id === 'camera') {
            navigate('/quiz-upload');
        } else if (id === 'ai') {
            navigate('/quiz-generation');
        } else {
            navigate('/game-hub');
        }
    };

    return (
        <div className="upload-quiz-container" style={{ width: '100%', maxWidth: '800px', padding: '20px' }}>
            <div className="clay-container" style={{ position: 'relative', background: '#f8f9fa' }}>
                <button
                    className="clay-button secondary"
                    onClick={() => navigate(-1)}
                    style={{ position: 'absolute', top: '20px', left: '20px' }}
                >
                    ← Back
                </button>

                <div style={{ textAlign: 'center', marginTop: '60px' }}>
                    <div style={{ fontSize: '4rem', marginBottom: '10px' }}>🧭</div>
                    <h1 style={{ fontSize: '2.5rem', color: '#FF6B6B', marginBottom: '10px', textShadow: '2px 2px 0px rgba(0,0,0,0.1)' }}>Prepare Your Quest!</h1>
                    <p style={{ fontSize: '1.2rem', color: '#7f8c8d', marginBottom: '40px' }}>Choose how you want to create your game questions</p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        {options.map((opt) => (
                            <div
                                key={opt.id}
                                className="clay-card"
                                onClick={() => handleChoice(opt.id)}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    padding: '25px',
                                    gap: '25px',
                                    cursor: 'pointer',
                                    background: `linear-gradient(135deg, ${opt.color} 0%, white 120%)`,
                                    border: '4px solid white',
                                    transition: 'all 0.3s ease',
                                    boxShadow: '0 8px 16px rgba(0,0,0,0.08)'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'scale(1.02) translateX(10px)';
                                    e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.15)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'scale(1) translateX(0)';
                                    e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.08)';
                                }}
                            >
                                <div style={{
                                    fontSize: '3.5rem',
                                    filter: 'drop-shadow(0 4px 4px rgba(0,0,0,0.1))'
                                }}>{opt.icon}</div>
                                <div style={{ textAlign: 'left' }}>
                                    <h3 style={{ fontSize: '1.5rem', marginBottom: '5px', color: '#2c3e50', fontWeight: 800 }}>{opt.title}</h3>
                                    <p style={{ fontSize: '1rem', color: '#555', fontWeight: 500 }}>{opt.desc}</p>
                                </div>
                                <div style={{ marginLeft: 'auto', fontSize: '2rem', opacity: 0.5 }}>➜</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UploadQuiz;
