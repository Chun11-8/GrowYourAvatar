import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const UploadQuiz: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { avatarId } = (location.state as { avatarId?: string }) || {};

    const options = [
        {
            id: 'camera',
            title: 'CAMERA POSE',
            // desc: 'Upload from your gallery or by document',
            icon: '📸',
            illustration: '📸',
            color: '#FF9F43', // Orange
            gradient: 'linear-gradient(135deg, #FF9F43 0%, #FFC75F 100%)',
            textColor: 'white'
        },
        {
            id: 'manual',
            title: 'MANUAL INPUT',
            // desc: 'Type in your own questions and answers',
            icon: '✍️',
            illustration: '📝',
            color: '#A29BFE', // Purple
            gradient: 'linear-gradient(135deg, #A29BFE 0%, #6C5CE7 100%)',
            textColor: 'white'
        },
        {
            id: 'ai',
            title: 'AI GENERATION',
            // desc: 'Let the magic AI create questions for you',
            icon: '✨',
            illustration: '🤖',
            color: '#00B894', // Green
            gradient: 'linear-gradient(135deg, #00B894 0%, #55E6C1 100%)',
            textColor: 'white'
        }
    ];

    const handleChoice = (id: string) => {
        const state = { avatarId };
        if (id === 'manual') {
            navigate('/manual-quiz', { state });
        } else if (id === 'camera') {
            navigate('/quiz-upload', { state });
        } else if (id === 'ai') {
            navigate('/quiz-generation', { state });
        } else {
            navigate('/game-hub', { state });
        }
    };

    return (
        <div className="upload-quiz-container" style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: '#039BE5',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            fontFamily: '"Fredoka", sans-serif',
            zIndex: 9999
        }}>
            {/* Header Section (1/3 of UI) */}
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
                // Theme Background
                backgroundImage: 'radial-gradient(rgba(255,255,255,0.1) 20%, transparent 20%), radial-gradient(rgba(255,255,255,0.1) 20%, transparent 20%)',
                backgroundColor: '#039BE5',
                backgroundPosition: '0 0, 25px 25px',
                backgroundSize: '50px 50px',
            }}>
                {/* Back Button */}
                <button
                    onClick={() => navigate('/avatar-view', { state: { avatarId } })}
                    style={{
                        position: 'absolute',
                        top: 'calc(env(safe-area-inset-top) + 20px)',
                        left: '20px',
                        background: 'rgba(255,255,255,0.2)',
                        border: 'none',
                        borderRadius: '50%',
                        width: '45px',
                        height: '45px',
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

                <div style={{ textAlign: 'center', marginTop: '10px' }}>
                    <h1 style={{
                        margin: 0,
                        fontSize: 'clamp(2rem, 8vw, 3rem)',
                        fontWeight: 700,
                        textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                        color: 'white'
                    }}>
                        Select Mode
                    </h1>
                    <p style={{
                        margin: '5px 0 0 0',
                        fontSize: '1rem',
                        opacity: 0.9,
                        fontWeight: 500
                    }}>
                        Choose how to create your quiz
                    </p>
                </div>
            </div>

            {/* Bottom Sheet (Rest of UI) */}
            <div style={{
                flex: 1,
                background: '#E1F5FE',
                borderTopLeftRadius: '35px',
                borderTopRightRadius: '35px',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                padding: '30px',
                boxShadow: '0 -10px 30px rgba(0,0,0,0.1)',
                gap: '20px',
                paddingBottom: 'calc(env(safe-area-inset-bottom) + 20px)'
            }}>
                {options.map((opt) => (
                    <div
                        key={opt.id}
                        className="touch-active"
                        onClick={() => handleChoice(opt.id)}
                        style={{
                            flex: 1, // Fill available space equally
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '0 30px',
                            cursor: 'pointer',
                            background: opt.gradient,
                            borderRadius: '30px',
                            boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
                            transition: 'transform 0.1s ease',
                            position: 'relative',
                            overflow: 'hidden',
                            border: '3px solid rgba(255,255,255,0.2)'
                        }}
                        onPointerDown={(e) => {
                            e.currentTarget.style.transform = 'scale(0.97)';
                        }}
                        onPointerUp={(e) => {
                            e.currentTarget.style.transform = 'scale(1)';
                        }}
                        onPointerLeave={(e) => {
                            e.currentTarget.style.transform = 'scale(1)';
                        }}
                    >
                        {/* Text Content */}
                        <div style={{ zIndex: 2 }}>
                            <h3 style={{
                                fontSize: 'clamp(1.4rem, 5vw, 1.8rem)',
                                margin: 0,
                                color: opt.textColor,
                                fontWeight: 800,
                                letterSpacing: '1px',
                                textTransform: 'uppercase',
                                textShadow: '0 2px 0 rgba(0,0,0,0.1)'
                            }}>{opt.title}</h3>
                        </div>

                        {/* Illustration / Icon */}
                        <div style={{
                            zIndex: 1,
                            fontSize: '3.5rem',
                            filter: 'drop-shadow(0 4px 4px rgba(0,0,0,0.1))',
                            transform: 'rotate(10deg)'
                        }}>
                            {opt.illustration}
                        </div>

                        {/* Background Decoration */}
                        <div style={{
                            position: 'absolute',
                            right: '-10px',
                            bottom: '-20px',
                            fontSize: '8rem',
                            opacity: 0.15,
                            transform: 'rotate(-15deg)',
                            pointerEvents: 'none'
                        }}>
                            {opt.icon}
                        </div>
                    </div>
                ))}
            </div>

            <style>{`
                .touch-active {
                    user-select: none;
                    -webkit-tap-highlight-color: transparent;
                }
            `}</style>
        </div>
    );
};

export default UploadQuiz;
