import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ITEMS = ['🍎', '🍌', '🍇', '🍓', '🍊'];

const PatternCompletion: React.FC = () => {
    const navigate = useNavigate();
    const [pattern, setPattern] = useState<string[]>([]);
    const [target, setTarget] = useState('');
    const [options, setOptions] = useState<string[]>([]);
    const [score, setScore] = useState(0);
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
        generateRound();
    }, []);

    const handleSelect = (item: string) => {
        if (item === target) {
            setScore(s => s + 1);
            setMessage('Awesome! 🌟');
            setTimeout(generateRound, 1000);
        } else {
            setMessage('Not quite, try again! ❤️');
        }
    };

    return (
        <div className="game-container" style={{ padding: '20px', textAlign: 'center' }}>
            <div className="clay-container" style={{ background: '#fff' }}>
                <button className="clay-button secondary" onClick={() => navigate('/game-hub')} style={{ float: 'left' }}>← Back</button>
                <h2 style={{ fontSize: '2.5rem', marginTop: '1rem' }}>Pattern Power</h2>
                <div style={{ clear: 'both' }}></div>

                <div className="score-board" style={{ fontSize: '1.5rem', margin: '1rem 0', fontWeight: 700 }}>
                    Patterns Done: {score}
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
