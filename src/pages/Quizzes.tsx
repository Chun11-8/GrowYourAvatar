import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getAvatarById, saveAvatar } from '../utils/storage';

interface Question {
    id: string | number;
    question: string;
    options: string[];
    answer: string;
    timer?: number;
}

const Quizzes: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const { questions = [], avatarId } = (location.state as { questions?: Question[], avatarId?: string }) || { questions: [] };

    const [currentIndex, setCurrentIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(questions[0]?.timer || 20);
    const [gameState, setGameState] = useState<'playing' | 'feedback' | 'finished'>('playing');
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);

    useEffect(() => {
        if (gameState !== 'playing') return;

        if (timeLeft <= 0) {
            handleTimeUp();
            return;
        }

        const timerId = setInterval(() => {
            setTimeLeft(prev => prev - 1);
        }, 1000);

        return () => clearInterval(timerId);
    }, [timeLeft, gameState]);

    const handleTimeUp = () => {
        setFeedback('wrong');
        setGameState('feedback');
        setTimeout(nextQuestion, 2000);
    };

    const handleAnswer = (option: string) => {
        if (gameState !== 'playing') return;

        setSelectedOption(option);
        const isCorrect = option === questions[currentIndex].answer;

        if (isCorrect) {
            setScore(prev => prev + 1);
            setFeedback('correct');
        } else {
            setFeedback('wrong');
        }

        setGameState('feedback');
        setTimeout(nextQuestion, 2000);
    };

    const nextQuestion = () => {
        if (currentIndex < questions.length - 1) {
            const nextIdx = currentIndex + 1;
            setCurrentIndex(nextIdx);
            setTimeLeft(questions[nextIdx].timer || 20);
            setGameState('playing');
            setSelectedOption(null);
            setFeedback(null);
        } else {
            if (avatarId) {
                const avatar = getAvatarById(avatarId);
                if (avatar) {
                    saveAvatar({ ...avatar, quizCompleted: true });
                    console.log('Quiz completed recorded');
                }
            }
            setGameState('finished');
        }
    };

    if (!questions || questions.length === 0) {
        return <div style={{ textAlign: 'center', padding: '50px' }}>No quest found! <button onClick={() => navigate('/game-hub')}>Go Back</button></div>;
    }

    if (gameState === 'finished') {
        return (
            <div className="quiz-game-container" style={{
                background: 'linear-gradient(180deg, #A0E7E5 0%, #B4F8C8 100%)',
                height: '100vh',
                width: '100vw',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                padding: '20px',
                boxSizing: 'border-box'
            }}>
                <div className="clay-container" style={{
                    width: '100%',
                    maxWidth: '500px',
                    margin: 'auto',
                    background: 'linear-gradient(180deg, #81ECEC 0%, #74B9FF 100%)', // Underwater gradient
                    display: 'flex',
                    flexDirection: 'column',
                    zIndex: 9999,
                    overflow: 'hidden',
                    fontFamily: '"Fredoka", sans-serif',
                    padding: 'clamp(20px, 5vw, 40px)',
                    borderRadius: '30px',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                    position: 'relative',
                    boxSizing: 'border-box'
                }}>
                    {/* Background Decorations (Fish) */}
                    <div style={{ position: 'absolute', bottom: '5%', left: '5%', fontSize: '3rem', opacity: 0.6, animation: 'float 3s infinite ease-in-out' }}>🐠</div>
                    <div style={{ position: 'absolute', bottom: '15%', right: '10%', fontSize: '2.5rem', opacity: 0.6, animation: 'float 4s infinite ease-in-out reverse' }}>🐟</div>
                    <div style={{ position: 'absolute', bottom: '2%', right: '30%', fontSize: '4rem', opacity: 0.4, transform: 'rotate(-10deg)' }}>🐙</div>
                    <div style={{ position: 'absolute', top: '20%', left: '-20px', fontSize: '8rem', opacity: 0.1, color: 'white', pointerEvents: 'none' }}>bubbles</div>


                    <style>{`
                @keyframes float {
                    0% { transform: translateY(0px); }
                    50% { transform: translateY(-10px); }
                    100% { transform: translateY(0px); }
                }
            `}</style>
                    <div style={{ fontSize: 'clamp(3rem, 15vw, 5rem)', marginBottom: '10px' }}>🏆</div>
                    <h1 style={{ color: '#2c3e50', fontSize: 'clamp(1.5rem, 6vw, 2.5rem)', marginBottom: '10px' }}>Quest Complete!</h1>
                    <h2 style={{ color: '#4A90E2', fontSize: 'clamp(1rem, 4vw, 1.5rem)', marginBottom: '20px' }}>You Scored: {score} / {questions.length}</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        {score >= 7 ? (
                            <button
                                onClick={() => navigate('/game-hub', { state: { avatarId } })}
                                style={{
                                    fontSize: 'clamp(1rem, 4vw, 1.3rem)',
                                    padding: '15px 20px',
                                    background: '#00b894',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '15px',
                                    width: '100%',
                                    fontWeight: 'bold',
                                    boxShadow: '0 5px 0 #008f72'
                                }}
                            >
                                Adventure Complete! 🏠
                            </button>
                        ) : (
                            <button
                                onClick={() => navigate('/avatar-view')}
                                style={{
                                    fontSize: 'clamp(1rem, 4vw, 1.3rem)',
                                    padding: '15px 20px',
                                    background: '#0984e3',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '15px',
                                    width: '100%',
                                    fontWeight: 'bold',
                                    boxShadow: '0 5px 0 #06528f'
                                }}
                            >
                                Try Again 🏠
                            </button>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    const currentQ = questions[currentIndex];
    const progress = ((currentIndex + 1) / questions.length) * 100;

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(180deg, #81ECEC 0%, #74B9FF 100%)', // Underwater gradient
            display: 'flex',
            flexDirection: 'column',
            zIndex: 9999,
            overflow: 'hidden',
            fontFamily: '"Fredoka", sans-serif',
            paddingTop: 'calc(env(safe-area-inset-top) + 20px)',
            paddingBottom: 'calc(env(safe-area-inset-bottom) + 20px)',
            paddingLeft: '20px',
            paddingRight: '20px',
            boxSizing: 'border-box'
        }}>
            {/* Background Decorations (Fish) */}
            <div style={{ position: 'absolute', bottom: '5%', left: '5%', fontSize: '3rem', opacity: 0.6, animation: 'float 3s infinite ease-in-out' }}>🐠</div>
            <div style={{ position: 'absolute', bottom: '15%', right: '10%', fontSize: '2.5rem', opacity: 0.6, animation: 'float 4s infinite ease-in-out reverse' }}>🐟</div>
            <div style={{ position: 'absolute', bottom: '2%', right: '30%', fontSize: '4rem', opacity: 0.4, transform: 'rotate(-10deg)' }}>🐙</div>
            <div style={{ position: 'absolute', top: '20%', left: '-20px', fontSize: '8rem', opacity: 0.1, color: 'white', pointerEvents: 'none' }}>bubbles</div>

            <style>{`
                @keyframes float {
                    0% { transform: translateY(0px); }
                    50% { transform: translateY(-10px); }
                    100% { transform: translateY(0px); }
                }
            `}</style>

            {/* Header */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '20px',
                zIndex: 10,
                padding: '0 5px'
            }}>


                <div style={{ flex: 1, margin: '0 15px', textAlign: 'center' }}>
                    <div style={{
                        color: '#2d3436',
                        fontWeight: 800,
                        fontSize: '1rem',
                        marginBottom: '5px',
                        textTransform: 'uppercase',
                        letterSpacing: '1px'
                    }}>
                        Question {currentIndex + 1}/{questions.length}
                    </div>
                    {/* Progress Bar Container */}
                    <div style={{
                        width: '100%',
                        maxWidth: '200px',
                        height: '10px',
                        background: 'rgba(255,255,255,0.3)',
                        borderRadius: '10px',
                        margin: '0 auto',
                        overflow: 'hidden'
                    }}>
                        {/* Progress Fill */}
                        <div style={{
                            width: `${progress}%`,
                            height: '100%',
                            background: '#FDCB6E', // Yellow bar
                            borderRadius: '10px',
                            transition: 'width 0.3s ease'
                        }}></div>
                    </div>
                </div>

                {/* Timer Display */}
                <div style={{
                    background: 'white',
                    padding: '8px 15px',
                    borderRadius: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                    flexShrink: 0
                }}>
                    <span style={{ fontSize: '1.2rem' }}>⏱️</span>
                    <span style={{
                        fontSize: '1.2rem',
                        fontWeight: 800,
                        color: timeLeft < 5 ? '#ff7675' : '#2d3436',
                        minWidth: '25px',
                        textAlign: 'center'
                    }}>
                        {timeLeft}
                    </span>
                </div>
            </div>

            {/* Scrollable Content Wrapper */}
            <div style={{
                flex: 1,
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                zIndex: 10,
                paddingBottom: '20px' // Extra space at bottom
            }}>

                {/* Question Card */}
                <div style={{
                    background: '#4834d4', // Deep blue/purple
                    borderRadius: '25px',
                    padding: '30px 20px',
                    textAlign: 'center',
                    marginBottom: '30px',
                    boxShadow: '0 10px 20px rgba(0,0,0,0.15)',
                    color: 'white',
                    zIndex: 10,
                    position: 'relative'
                }}>
                    <h2 style={{
                        fontSize: 'clamp(2rem, 8vw, 2.5rem)',
                        margin: 0,
                        fontWeight: 700,
                        textShadow: '0 2px 4px rgba(0,0,0,0.2)'
                    }}>
                        {currentQ.question}
                    </h2>
                </div>

                {/* Feedback Overlay - Centered over answer area if needed, or just standard box */}
                <div style={{
                    height: '40px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '10px',
                    zIndex: 10
                }}>
                    {gameState === 'feedback' && feedback && (
                        <div className="animate-bounce" style={{
                            fontSize: '1.5rem',
                            fontWeight: 'bold',
                            color: feedback === 'correct' ? '#00b894' : '#d63031',
                            background: 'white',
                            padding: '5px 20px',
                            borderRadius: '20px',
                            boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
                        }}>
                            {feedback === 'correct' ? '🎉 Amazing!' : '🤔 Try Again!'}
                        </div>
                    )}
                </div>

                {/* Answer Grid */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: '15px',
                    flex: 1, // Fill remaining space
                    alignContent: 'start', // Start from top
                    zIndex: 10,
                    paddingBottom: '80px' // Space for floating buttons if any
                }}>
                    {currentQ.options.map((opt, idx) => {
                        let transform = 'scale(1)';
                        let boxShadow = '0 6px 0 #dfe6e9'; // Default shadow style
                        let bg = 'white';
                        let color = '#2d3436';

                        if (gameState === 'feedback') {
                            if (opt === currentQ.answer) {
                                bg = '#55efc4'; // Bright green
                                color = 'white';
                                boxShadow = '0 6px 0 #00b894';
                                transform = 'scale(1.05)';
                            } else if (opt === selectedOption) {
                                bg = '#ff7675'; // Red
                                color = 'white';
                                boxShadow = '0 6px 0 #d63031';
                                transform = 'scale(0.95)';
                            } else {
                                // Dim others
                                bg = 'rgba(255,255,255,0.7)';
                                boxShadow = 'none';
                            }
                        }

                        return (
                            <button
                                key={idx}
                                disabled={gameState !== 'playing'}
                                onClick={() => handleAnswer(opt)}
                                style={{
                                    background: bg,
                                    color: color,
                                    border: 'none',
                                    borderRadius: '25px',
                                    padding: '20px 10px',
                                    fontSize: 'clamp(1.5rem, 6vw, 2rem)', // Large text
                                    fontWeight: 800,
                                    cursor: 'pointer',
                                    boxShadow: boxShadow,
                                    transform: transform,
                                    transition: 'all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                                    height: '100%',
                                    minHeight: '100px', // Ensure nice block size
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                            >
                                {opt}
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default Quizzes;
