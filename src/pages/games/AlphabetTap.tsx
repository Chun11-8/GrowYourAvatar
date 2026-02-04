import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useGameSession } from '../../hooks/useGameSession';
import congratulations from '../../assets/congratulations.png';

const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

const AlphabetTap: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { avatarId } = (location.state as { avatarId?: string }) || {};
    const { score, round, maxRounds, isGameOver, recordSuccess, resetGame } = useGameSession(5);

    const [targetLetter, setTargetLetter] = useState('A');
    const [options, setOptions] = useState<string[]>([]);
    // const [score, setScore] = useState(0); // Handled by hook
    const [message, setMessage] = useState('Tap the letter!');

    const generateRound = () => {
        const target = LETTERS[Math.floor(Math.random() * LETTERS.length)];
        setTargetLetter(target);

        const others = LETTERS.filter(l => l !== target)
            .sort(() => Math.random() - 0.5)
            .slice(0, 3);

        setOptions([target, ...others].sort(() => Math.random() - 0.5));
        setMessage(`Where is the letter ${target}?`);
    };

    useEffect(() => {
        if (!isGameOver) {
            generateRound();
        }
    }, [isGameOver, round]); // Regenerate when round changes

    const handleSelect = (letter: string) => {
        if (letter === targetLetter) {
            setMessage('Awesome! 🌟');
            recordSuccess(); // Increments score & round
        } else {
            setMessage('Try another one! ❤️');
            // recordFailure(); // Optional: if you want 'wrong' to advance round without points, uncomment.
            // But prompt says "match correctly plus 1 ,wrong , do nothing", so we do nothing here?
            // "match correctly plus 1 ,wrong , do nothing." -> So failed attempt doesn't end round?
            // "limit the rounds to only maximum of 5" -> usually implies 5 questions.
            // If wrong does nothing, they can just keep clicking.
            // Let's assume they keep trying until right, OR we can count attempts.
            // For now, let's Stick to: Right = +1 & Next Round. Wrong = Retry same round.
        }
    };

    if (isGameOver) {
        return (
            <div
                className="game-container"
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100vw',
                    height: '100vh',
                    background: 'rgba(0,0,0,0.8)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000,
                    cursor: 'pointer'
                }}
                onClick={() => navigate('/avatar-view', { state: { avatarId } })}
            >
                <div className="clay-container" style={{
                    background: '#fff',
                    padding: '30px',
                    maxWidth: '90%',
                    width: '500px',
                    textAlign: 'center',
                    borderRadius: '20px',
                    animation: 'popIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                }}>
                    <img
                        src={congratulations}
                        alt="Congratulations"
                        style={{
                            width: '100%',
                            borderRadius: '15px',
                            marginBottom: '20px',
                            border: '4px solid #FFD1DC'
                        }}
                    />

                    <h2 style={{ color: '#FF6B6B', fontSize: '2rem', marginBottom: '10px' }}>
                        Congratulation! 🎉
                    </h2>

                    <p style={{ fontSize: '1.2rem', color: '#555', marginBottom: '20px', lineHeight: '1.5' }}>
                        You have completed the mission and here is your rewards!
                    </p>

                    <div style={{ fontSize: '5rem', marginBottom: '20px', animation: 'bounce 2s infinite' }}>
                        🍎
                    </div>

                    <p style={{ fontSize: '1rem', color: '#888' }}>
                        (Tap anywhere to collect)
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="game-container" style={{ padding: '20px', textAlign: 'center' }}>

            <div className="clay-container" style={{ background: '#fff' }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                    <button className="clay-button secondary" onClick={() => navigate('/game-hub', { state: { avatarId } })} style={{ marginRight: 'auto' }}>← Back</button>
                    <h2 style={{ fontSize: 'clamp(1.5rem, 5vw, 2.5rem)', margin: 0, flex: 2, textAlign: 'center' }}>Alphabet Tap</h2>
                    <div style={{ flex: 1, textAlign: 'right', fontWeight: 'bold' }}>Round {round}/{maxRounds}</div>
                </div>

                <div className="score-board" style={{ fontSize: '1.5rem', margin: '1rem 0', fontWeight: 700 }}>
                    Score: {score}
                </div>

                <div className="target-area" style={{
                    padding: '2rem',
                    background: '#E2F0CB',
                    borderRadius: '20px',
                    margin: '1rem auto',
                    maxWidth: '300px'
                }}>
                    <h1 style={{ fontSize: 'clamp(3rem, 15vw, 5rem)', color: '#4A90E2', margin: '0 0 1rem 0' }}>{targetLetter}</h1>
                    <p style={{ fontWeight: 800 }}>{message}</p>
                </div>

                <div className="options-grid" style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: '1.5rem',
                    maxWidth: '400px',
                    margin: '0 auto'
                }}>
                    {options.map((letter, idx) => (
                        <button
                            key={idx}
                            className="clay-button"
                            style={{ background: 'white', fontSize: '3rem', padding: '1rem', color: '#FF6B6B' }}
                            onClick={() => handleSelect(letter)}
                        >
                            {letter}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AlphabetTap;
