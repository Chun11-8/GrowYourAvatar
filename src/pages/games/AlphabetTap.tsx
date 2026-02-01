import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

const AlphabetTap: React.FC = () => {
    const navigate = useNavigate();
    const [targetLetter, setTargetLetter] = useState('A');
    const [options, setOptions] = useState<string[]>([]);
    const [score, setScore] = useState(0);
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
        generateRound();
    }, []);

    const handleSelect = (letter: string) => {
        if (letter === targetLetter) {
            setScore(s => s + 1);
            setMessage('Awesome! 🌟');
            setTimeout(generateRound, 1000);
        } else {
            setMessage('Try another one! ❤️');
        }
    };

    return (
        <div className="game-container" style={{ padding: '20px', textAlign: 'center' }}>
            <div className="clay-container" style={{ background: '#fff' }}>
                <button className="clay-button secondary" onClick={() => navigate('/game-hub')} style={{ float: 'left' }}>← Back</button>
                <h2 style={{ fontSize: '2.5rem', marginTop: '1rem' }}>Alphabet Tap</h2>
                <div style={{ clear: 'both' }}></div>

                <div className="score-board" style={{ fontSize: '1.5rem', margin: '1rem 0', fontWeight: 700 }}>
                    Score: {score}
                </div>

                <div className="target-area" style={{
                    padding: '2rem',
                    background: '#E2F0CB',
                    borderRadius: '20px',
                    margin: '2rem auto',
                    maxWidth: '300px'
                }}>
                    <h1 style={{ fontSize: '5rem', color: '#4A90E2' }}>{targetLetter}</h1>
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
