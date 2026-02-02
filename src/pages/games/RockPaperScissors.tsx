import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameSession } from '../../hooks/useGameSession';

const MOVES = [
    { name: 'Rock', emoji: '✊', beats: 'Scissors' },
    { name: 'Paper', emoji: '✋', beats: 'Rock' },
    { name: 'Scissors', emoji: '✌️', beats: 'Paper' },
];

const RockPaperScissors: React.FC = () => {
    const navigate = useNavigate();
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
            <div className="game-container" style={{ padding: '20px', textAlign: 'center' }}>
                <div className="clay-container" style={{ background: '#fff' }}>
                    <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Game Over! 🎉</h2>
                    <p style={{ fontSize: '1.5rem', marginBottom: '2rem' }}>You scored {score} out of {maxRounds}!</p>
                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                        <button className="clay-button" onClick={() => { resetGame(); setResult(''); setUserMove(null); setCompMove(null); }}>Play Again</button>
                        <button className="clay-button secondary" onClick={() => navigate('/game-hub')}>Back to Hub</button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="game-container" style={{ padding: '20px', textAlign: 'center' }}>
            <div className="clay-container" style={{ background: '#fff' }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                    <button className="clay-button secondary" onClick={() => navigate('/game-hub')} style={{ marginRight: 'auto' }}>← Back</button>
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
