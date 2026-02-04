import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useGameSession } from '../../hooks/useGameSession';
import congratulations from '../../assets/congratulations.png';

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
