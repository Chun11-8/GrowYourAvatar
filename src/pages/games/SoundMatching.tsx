import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useGameSession } from '../../hooks/useGameSession';

const ANIMALS = [
    { name: 'Lion', sound: 'Roar', emoji: '🦁' },
    { name: 'Cow', sound: 'Moo', emoji: '🐮' },
    { name: 'Dog', sound: 'Woof', emoji: '🐶' },
    { name: 'Cat', sound: 'Meow', emoji: '🐱' },
    { name: 'Bee', sound: 'Buzz', emoji: '🐝' },
];

const SoundMatching: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { avatarId } = (location.state as { avatarId?: string }) || {};
    const { score, round, maxRounds, isGameOver, recordSuccess, resetGame } = useGameSession(5);
    const [target, setTarget] = useState(ANIMALS[0]);
    const [options, setOptions] = useState<typeof ANIMALS>([]);
    // const [score, setScore] = useState(0);
    const [message, setMessage] = useState('Who makes this sound?');

    const speak = (text: string) => {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.pitch = 1.2;
        utterance.rate = 0.9;
        window.speechSynthesis.speak(utterance);
    };

    const generateRound = () => {
        const newTarget = ANIMALS[Math.floor(Math.random() * ANIMALS.length)];
        setTarget(newTarget);
        setOptions([...ANIMALS].sort(() => Math.random() - 0.5));
        setMessage(`Listen: "${newTarget.sound}!"`);
    };

    useEffect(() => {
        if (!isGameOver) {
            generateRound();
        }
    }, [isGameOver, round]);

    const handleSelect = (animal: typeof ANIMALS[0]) => {
        if (animal.name === target.name) {
            setMessage('Correct! 🌈');
            speak(animal.name);
            recordSuccess();
        } else {
            setMessage('Not that one, try again! 😊');
        }
    };

    if (isGameOver) {
        return (
            <div className="game-container" style={{ padding: '20px', textAlign: 'center' }}>
                <div className="clay-container" style={{ background: '#fff' }}>
                    <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Game Over! 🎉</h2>
                    <p style={{ fontSize: '1.5rem', marginBottom: '2rem' }}>You scored {score} out of {maxRounds}!</p>
                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                        <button className="clay-button" onClick={resetGame}>Play Again</button>
                        <button className="clay-button secondary" onClick={() => navigate('/game-hub', { state: { avatarId } })}>Back to Hub</button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="game-container" style={{ padding: '20px', textAlign: 'center' }}>
            <div className="clay-container" style={{ background: '#fff' }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                    <button className="clay-button secondary" onClick={() => navigate('/game-hub', { state: { avatarId } })} style={{ marginRight: 'auto' }}>← Back</button>
                    <h2 style={{ fontSize: 'clamp(1.5rem, 5vw, 2.5rem)', margin: 0, flex: 2, textAlign: 'center' }}>Animal Sounds</h2>
                    <div style={{ flex: 1, textAlign: 'right', fontWeight: 'bold' }}>Round {round}/{maxRounds}</div>
                </div>

                <div className="score-board" style={{ fontSize: '1.5rem', margin: '1rem 0', fontWeight: 700 }}>
                    Correct: {score}
                </div>

                <div className="sound-button-area" style={{ margin: '2rem 0' }}>
                    <button
                        className="clay-button"
                        style={{ fontSize: '4rem', padding: '2rem', background: '#FFD6A5' }}
                        onClick={() => speak(target.sound)}
                    >
                        🔊 Play Sound
                    </button>
                    <p style={{ marginTop: '1rem', fontWeight: 800 }}>{message}</p>
                </div>

                <div className="options-grid" style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                    gap: '1rem'
                }}>
                    {options.map((animal) => (
                        <button
                            key={animal.name}
                            className="clay-button"
                            style={{ background: 'white', fontSize: '3rem', minWidth: '100px' }}
                            onClick={() => handleSelect(animal)}
                        >
                            {animal.emoji}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SoundMatching;
