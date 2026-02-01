import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const NumberOrder: React.FC = () => {
    const navigate = useNavigate();
    const [numbers, setNumbers] = useState<number[]>([]);
    const [targetOrder, setTargetOrder] = useState<number[]>([]);
    const [currentOrder, setCurrentOrder] = useState<number[]>([]);
    const [score, setScore] = useState(0);
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
        generateRound();
    }, []);

    const handleSelect = (num: number) => {
        if (currentOrder.includes(num)) return;

        const nextInTarget = targetOrder[currentOrder.length];
        if (num === nextInTarget) {
            const newOrder = [...currentOrder, num];
            setCurrentOrder(newOrder);
            if (newOrder.length === targetOrder.length) {
                setScore(s => s + 1);
                setMessage('Perfect Order! ✨');
                setTimeout(generateRound, 1200);
            } else {
                setMessage('Next number?');
            }
        } else {
            setMessage('Oops! Start with the smallest!');
            setCurrentOrder([]);
        }
    };

    return (
        <div className="game-container" style={{ padding: '20px', textAlign: 'center' }}>
            <div className="clay-container" style={{ background: '#fff' }}>
                <button className="clay-button secondary" onClick={() => navigate('/game-hub')} style={{ float: 'left' }}>← Back</button>
                <h2 style={{ fontSize: '2.5rem', marginTop: '1rem' }}>Number Order</h2>
                <div style={{ clear: 'both' }}></div>

                <div className="score-board" style={{ fontSize: '1.5rem', margin: '1rem 0', fontWeight: 700 }}>
                    Score: {score}
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
