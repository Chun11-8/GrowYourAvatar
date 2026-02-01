import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const MOVES = [
    { name: 'Rock', emoji: '✊', beats: 'Scissors' },
    { name: 'Paper', emoji: '✋', beats: 'Rock' },
    { name: 'Scissors', emoji: '✌️', beats: 'Paper' },
];

const RockPaperScissors: React.FC = () => {
    const navigate = useNavigate();
    const [userMove, setUserMove] = useState<any>(null);
    const [compMove, setCompMove] = useState<any>(null);
    const [result, setResult] = useState('');

    const play = (move: any) => {
        const computerMove = MOVES[Math.floor(Math.random() * MOVES.length)];
        setUserMove(move);
        setCompMove(computerMove);

        if (move.name === computerMove.name) {
            setResult("It's a Tie! 🤝");
        } else if (move.beats === computerMove.name) {
            setResult("You Win! 🏆");
        } else {
            setResult("Computer Wins! 🤖");
        }
    };

    return (
        <div className="game-container" style={{ padding: '20px', textAlign: 'center' }}>
            <div className="clay-container" style={{ background: '#fff' }}>
                <button className="clay-button secondary" onClick={() => navigate('/game-hub')} style={{ float: 'left' }}>← Back</button>
                <h2 style={{ fontSize: '2.5rem', marginTop: '1rem' }}>Rock Paper Scissors</h2>
                <div style={{ clear: 'both' }}></div>

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
