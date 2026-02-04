import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useGameSession } from '../../hooks/useGameSession';
import congratulations from '../../assets/congratulations.png';

const MOVES = [
    { name: 'Rock', emoji: '✊', beats: 'Scissors' },
    { name: 'Paper', emoji: '✋', beats: 'Rock' },
    { name: 'Scissors', emoji: '✌️', beats: 'Paper' },
];

const RockPaperScissors: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { avatarId } = (location.state as { avatarId?: string }) || {};
    const { score, round, maxRounds, isGameOver, recordSuccess, recordFailure, resetGame } = useGameSession(5);
    const [userMove, setUserMove] = useState<any>(null);
    const [compMove, setCompMove] = useState<any>(null);
    const [result, setResult] = useState('');

    const play = (move: any) => {
        if (isGameOver) return;
        const computerMove = MOVES[Math.floor(Math.random() * MOVES.length)];
        setUserMove(move);
        setCompMove(computerMove);

        if (move.name === computerMove.name) {
            setResult("It's a Tie! 🤝");
            recordFailure();
        } else if (move.beats === computerMove.name) {
            setResult("You Win! 🏆");
            recordSuccess();
        } else {
            setResult("Computer Wins! 🤖");
            recordFailure();
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
                    <h2 style={{ fontSize: 'clamp(1.5rem, 5vw, 2.5rem)', margin: 0, flex: 2, textAlign: 'center' }}>Rock Paper Scissors</h2>
                    <div style={{ flex: 1, textAlign: 'right', fontWeight: 'bold' }}>Round {round}/{maxRounds}</div>
                </div>

                <div className="battleground" style={{ display: 'flex', justifyContent: 'center', gap: '3rem', margin: '3rem 0' }}>
                    <div style={{ textAlign: 'center' }}>
                        <p style={{ fontWeight: 700 }}>You</p>
                        <div style={{ fontSize: '5rem', height: '100px' }}>{userMove?.emoji || '❓'}</div>
                    </div>
                    <div style={{ fontSize: '2rem', display: 'flex', alignItems: 'center' }}>VS</div>
                    <div style={{ textAlign: 'center' }}>
                        <p style={{ fontWeight: 700 }}>Computer</p>
                        <div style={{ fontSize: '5rem', height: '100px' }}>{compMove?.emoji || '❓'}</div>
                    </div>
                </div>

                <h3 style={{ fontSize: '2rem', color: '#FF6B6B', minHeight: '3rem' }}>{result}</h3>

                <p style={{ marginBottom: '1.5rem', fontWeight: 700 }}>Choose your move:</p>
                <div className="options" style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
                    {MOVES.map((m) => (
                        <button
                            key={m.name}
                            className="clay-button"
                            style={{ background: 'white', fontSize: '3rem', padding: '1rem' }}
                            onClick={() => play(m)}
                        >
                            {m.emoji}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default RockPaperScissors;
