import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useGameSession } from '../../hooks/useGameSession';
import congratulations from '../../assets/congratulations.png';

const NumberOrder: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { avatarId } = (location.state as { avatarId?: string }) || {};
    const { score, round, maxRounds, isGameOver, recordSuccess, resetGame } = useGameSession(5);
    const [numbers, setNumbers] = useState<number[]>([]);
    const [targetOrder, setTargetOrder] = useState<number[]>([]);
    const [currentOrder, setCurrentOrder] = useState<number[]>([]);
    // const [score, setScore] = useState(0);
    const [message, setMessage] = useState('Put them in order (1, 2, 3...)');

    const generateRound = () => {
        const start = Math.floor(Math.random() * 5) + 1;
        const nums = [start, start + 1, start + 2].sort(() => Math.random() - 0.5);
        setNumbers(nums);
        setTargetOrder([start, start + 1, start + 2]);
        setCurrentOrder([]);
        setMessage('Put the numbers in order!');
    };

    useEffect(() => {
        if (!isGameOver) {
            generateRound();
        }
    }, [isGameOver, round]);

    const handleSelect = (num: number) => {
        if (currentOrder.includes(num)) return;

        const nextInTarget = targetOrder[currentOrder.length];
        if (num === nextInTarget) {
            const newOrder = [...currentOrder, num];
            setCurrentOrder(newOrder);
            if (newOrder.length === targetOrder.length) {
                setMessage('Perfect Order! ✨');
                recordSuccess();
            } else {
                setMessage('Next number?');
            }
        } else {
            setMessage('Oops! Start with the smallest!');
            setCurrentOrder([]);
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
                    <h2 style={{ fontSize: 'clamp(1.5rem, 5vw, 2.5rem)', margin: 0, flex: 2, textAlign: 'center' }}>Number Order</h2>
                    <div style={{ flex: 1, textAlign: 'right', fontWeight: 'bold' }}>Round {round}/{maxRounds}</div>
                </div>

                <div className="current-line" style={{
                    margin: '2rem 0',
                    padding: '1rem',
                    background: '#f0f7ff',
                    minHeight: '100px',
                    borderRadius: '20px',
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '1rem'
                }}>
                    {currentOrder.map((n, i) => (
                        <div key={i} className="clay-button" style={{ background: '#A0C4FF', color: 'white', fontSize: '2.5rem' }}>{n}</div>
                    ))}
                    {Array.from({ length: 3 - currentOrder.length }).map((_, i) => (
                        <div key={i} style={{ width: '60px', height: '60px', border: '3px dashed #ccc', borderRadius: '15px' }}></div>
                    ))}
                </div>

                <p style={{ fontWeight: 800, fontSize: '1.2rem', marginBottom: '2rem' }}>{message}</p>

                <div className="options" style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
                    {numbers.map((n) => (
                        <button
                            key={n}
                            className="clay-button"
                            style={{
                                background: currentOrder.includes(n) ? '#eee' : 'white',
                                opacity: currentOrder.includes(n) ? 0.5 : 1,
                                fontSize: '2.5rem',
                                minWidth: '80px'
                            }}
                            onClick={() => handleSelect(n)}
                            disabled={currentOrder.includes(n)}
                        >
                            {n}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default NumberOrder;
