import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

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

    const questions: Question[] = location.state?.questions || [];

    const [currentIndex, setCurrentIndex] = useState(0);
    const [score, setScore] = useState(0);
    // Initialize timer correctly for the first question immediately
    const [timeLeft, setTimeLeft] = useState(questions[0]?.timer || 20);
    const [gameState, setGameState] = useState<'playing' | 'feedback' | 'finished'>('playing');
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);

    // Remove separate useEffect for timer initialization to avoid race conditions
    // The timer is now reset in nextQuestion explicitly

    // Timer countdown
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

            // Critical Fix: Reset timer BEFORE changing state back to playing
            // This prevents the countdown effect from seeing 0 and triggering timeUp again immediately
            setTimeLeft(questions[nextIdx].timer || 20);

            setGameState('playing');
            setSelectedOption(null);
            setFeedback(null);
        } else {
            setGameState('finished');
        }
    };

    // Colors for options (Kids style)
    const optionColors = ['#FFADAD', '#CAFFBF', '#FDFFB6', '#A0C4FF']; // Red, Green, Yellow, Blue pastel

    if (!questions || questions.length === 0) {
        return <div style={{ textAlign: 'center', padding: '50px' }}>No quest found! <button onClick={() => navigate('/game-hub')}>Go Back</button></div>;
    }

    if (gameState === 'finished') {
        return (
            <div className="quiz-game-container" style={{ background: '#FFD6A5', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div className="clay-container" style={{ textAlign: 'center', padding: '40px' }}>
                    <div style={{ fontSize: '5rem', marginBottom: '20px' }}>🏆</div>
                    <h1 style={{ color: '#2c3e50', fontSize: '3rem', marginBottom: '10px' }}>Quest Complete!</h1>
                    <h2 style={{ color: '#4A90E2', marginBottom: '30px' }}>You Scored: {score} / {questions.length}</h2>
                    {score >= 7 && (
                        <button
                            className="clay-button"
                            onClick={() => navigate('/game-hub')}
                            style={{ fontSize: '1.5rem', padding: '15px 30px', background: '#CAFFBF' }}
                        >
                            Adventure Complete! 🏠
                        </button>)}
                    {score < 7 && (
                        <button
                            className="clay-button"
                            onClick={() => navigate('/avatar-view')}
                            style={{ fontSize: '1.5rem', padding: '15px 30px', background: '#CAFFBF' }}
                        >
                            Try Again 🏠
                        </button>
                    )}
                </div>
            </div>
        );
    }

    const currentQ = questions[currentIndex];

    return (
        <div className="quiz-game-container" style={{
            background: '#FDCB6E', // Orange-ish yellow bg from reference
            minHeight: '100vh',
            padding: '20px',
            fontFamily: '"Comic Sans MS", "Chalkboard SE", sans-serif' // Kid friendly font fallback
        }}>
            {/* Header/Progress */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', color: 'white', fontWeight: 800, fontSize: '1.2rem', textShadow: '2px 2px 0 rgba(0,0,0,0.1)' }}>
                <div>Question {currentIndex + 1}/{questions.length}</div>
                <div>Score: {score}</div>
            </div>

            {/* Timer Bar */}
            <div style={{ width: '100%', height: '20px', background: 'rgba(255,255,255,0.5)', borderRadius: '10px', marginBottom: '30px', overflow: 'hidden' }}>
                <div style={{
                    width: `${(timeLeft / (currentQ.timer || 20)) * 100}%`,
                    height: '100%',
                    background: timeLeft < 5 ? '#FF6B6B' : '#4CD137',
                    transition: 'width 1s linear'
                }}></div>
            </div>

            {/* Question Card */}
            <div className="clay-container" style={{
                background: 'white',
                padding: '30px',
                minHeight: '200px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                marginBottom: '30px',
                position: 'relative'
            }}>
                <div style={{
                    position: 'absolute',
                    top: '-40px',
                    background: '#54a0ff',
                    color: 'white',
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '2.5rem',
                    boxShadow: '0 5px 15px rgba(0,0,0,0.2)',
                    border: '5px solid white'
                }}>
                    ?
                </div>
                <h2 style={{ fontSize: '1.8rem', color: '#2d3436', marginTop: '20px' }}>{currentQ.question}</h2>
            </div>

            {/* Feedback Message */}
            {gameState === 'feedback' && feedback && (
                <div style={{ textAlign: 'center', marginBottom: '20px', fontSize: '1.5rem', fontWeight: 'bold', color: feedback === 'correct' ? '#4CD137' : '#FF6B6B' }}>
                    {feedback === 'correct' ? '🎉 Correct!' : '😢 Oops!'}
                </div>
            )}

            {/* Options */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {currentQ.options.map((opt, idx) => {
                    // Logic for coloring buttons during feedback
                    let bgColor = 'white'; // Default white/pastel
                    let borderColor = 'transparent';

                    if (gameState === 'feedback') {
                        if (opt === currentQ.answer) {
                            bgColor = '#CAFFBF'; // Correct is green
                            borderColor = '#4CD137';
                        } else if (opt === selectedOption) {
                            bgColor = '#FFADAD'; // Wrong selected is red
                            borderColor = '#FF6B6B';
                        }
                    } else {
                        // Different colors for basic state? Or just white cards with colorful bullets?
                        // Let's use user reference style: white bar, colored bullet/icon
                        bgColor = 'white';
                    }

                    return (
                        <button
                            key={idx}
                            disabled={gameState !== 'playing'}
                            onClick={() => handleAnswer(opt)}
                            className="clay-button"
                            style={{
                                background: bgColor,
                                color: '#333',
                                textAlign: 'left',
                                padding: '15px 20px',
                                fontSize: '1.2rem',
                                display: 'flex',
                                alignItems: 'center',
                                border: gameState === 'feedback' && (opt === currentQ.answer || opt === selectedOption)
                                    ? `4px solid ${borderColor}`
                                    : '4px solid white',
                                transform: gameState !== 'playing' ? 'none' : undefined // disable active effect if not playing
                            }}
                        >
                            <div style={{
                                background: optionColors[idx % 4],
                                width: '40px',
                                height: '40px',
                                borderRadius: '10px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginRight: '15px',
                                fontWeight: 800,
                                fontSize: '1.2rem',
                                color: '#555'
                            }}>
                                {['A', 'B', 'C', 'D'][idx]}
                            </div>
                            {opt}
                            {gameState === 'feedback' && opt === currentQ.answer && <span style={{ marginLeft: 'auto' }}>✅</span>}
                            {gameState === 'feedback' && opt === selectedOption && opt !== currentQ.answer && <span style={{ marginLeft: 'auto' }}>❌</span>}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default Quizzes;
