import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useGameSession } from '../../hooks/useGameSession';
import congratulations from '../../assets/congratulations.png';

const ITEMS = ['🍎', '🍌', '🍇', '🍓', '🍊'];

const PatternCompletion: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { avatarId } = (location.state as { avatarId?: string }) || {};
    const { score, round, maxRounds, isGameOver, recordSuccess, resetGame } = useGameSession(5);
    const [pattern, setPattern] = useState<string[]>([]);
    const [target, setTarget] = useState('');
    const [options, setOptions] = useState<string[]>([]);
    // const [score, setScore] = useState(0);
    const [message, setMessage] = useState('What comes next?');

    const generateRound = () => {
        const item1 = ITEMS[Math.floor(Math.random() * ITEMS.length)];
        const item2 = ITEMS.filter(i => i !== item1)[Math.floor(Math.random() * (ITEMS.length - 1))];

        // Pattern: A B A B ?
        const newPattern = [item1, item2, item1, item2];
        const next = item1;

        setPattern(newPattern);
        setTarget(next);
        setOptions(ITEMS.sort(() => Math.random() - 0.5));
        setMessage('Complete the pattern!');
    };

    useEffect(() => {
        if (!isGameOver) {
            generateRound();
        }
    }, [isGameOver, round]);

    const handleSelect = (item: string) => {
        if (item === target) {
            setMessage('Awesome! 🌟');
            recordSuccess();
        } else {
            setMessage('Not quite, try again! ❤️');
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
                    <h2 style={{ fontSize: 'clamp(1.5rem, 5vw, 2.5rem)', margin: 0, flex: 2, textAlign: 'center' }}>Pattern Power</h2>
                    <div style={{ flex: 1, textAlign: 'right', fontWeight: 'bold' }}>Round {round}/{maxRounds}</div>
                </div>

                <div className="pattern-display" style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '1rem',
                    margin: '3rem 0',
                    background: '#f9f9f9',
                    padding: '2rem',
                    borderRadius: '20px'
                }}>
                    {pattern.map((item, idx) => (
                        <div key={idx} style={{ fontSize: '4rem' }}>{item}</div>
                    ))}
                    <div style={{
                        fontSize: '4rem',
                        width: '80px',
                        height: '80px',
                        border: '4px dashed #ccc',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '10px'
                    }}>❓</div>
                </div>

                <p style={{ fontWeight: 800, color: '#666', marginBottom: '2rem' }}>{message}</p>

                <div className="options-grid" style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '1rem',
                    flexWrap: 'wrap'
                }}>
                    {options.map((item, idx) => (
                        <button
                            key={idx}
                            className="clay-button"
                            style={{ background: 'white', fontSize: '3rem', minWidth: '100px' }}
                            onClick={() => handleSelect(item)}
                        >
                            {item}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default PatternCompletion;
