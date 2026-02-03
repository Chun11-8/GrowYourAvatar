import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useGameSession } from '../../hooks/useGameSession';

const COLORS = ['#FFADAD', '#A0C4FF', '#CAFFBF', '#FDFFB6'];

const SimonSays: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { avatarId } = (location.state as { avatarId?: string }) || {};
    const { score, round, maxRounds, isGameOver, recordSuccess, recordFailure, resetGame } = useGameSession(5);
    const [sequence, setSequence] = useState<number[]>([]);
    const [userIdx, setUserIdx] = useState(0);
    const [activeColor, setActiveColor] = useState<number | null>(null);
    const [isShowing, setIsShowing] = useState(false);
    // const [score, setScore] = useState(0);

    const nextRound = () => {
        const next = Math.floor(Math.random() * 4);
        setSequence(s => [...s, next]);
        setUserIdx(0);
        setIsShowing(true);
    };

    useEffect(() => {
        if (isShowing) {
            let i = 0;
            const interval = setInterval(() => {
                setActiveColor(sequence[i]);
                setTimeout(() => setActiveColor(null), 600);
                i++;
                if (i >= sequence.length) {
                    clearInterval(interval);
                    setIsShowing(false);
                }
            }, 1000);
        }
    }, [isShowing, sequence]);

    const handleTap = (idx: number) => {
        if (isShowing) return;
        setActiveColor(idx);
        setTimeout(() => setActiveColor(null), 300);

        if (idx === sequence[userIdx]) {
            if (userIdx + 1 === sequence.length) {
                recordSuccess();
                setTimeout(nextRound, 1000);
            } else {
                setUserIdx(userIdx + 1);
            }
        } else {
            alert('Game Over! Try again! ❤️');
            setSequence([]);
            // setScore(0);
            setTimeout(nextRound, 1000);
            recordFailure();
        }
    };

    if (isGameOver) {
        return (
            <div className="game-container" style={{ padding: '20px', textAlign: 'center' }}>
                <div className="clay-container" style={{ background: '#fff' }}>
                    <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Game Over! 🎉</h2>
                    <p style={{ fontSize: '1.5rem', marginBottom: '2rem' }}>You completed {score} sequences!</p>
                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                        <button className="clay-button" onClick={() => { resetGame(); setSequence([]); }}>Play Again</button>
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
                    <h2 style={{ fontSize: 'clamp(1.5rem, 5vw, 2.5rem)', margin: 0, flex: 2, textAlign: 'center' }}>Simon Says</h2>
                    <div style={{ flex: 1, textAlign: 'right', fontWeight: 'bold' }}>Round {round}/{maxRounds}</div>
                </div>

                <div className="simon-grid" style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: '20px',
                    maxWidth: '300px',
                    margin: '2rem auto'
                }}>
                    {COLORS.map((c, i) => (
                        <div
                            key={i}
                            onClick={() => handleTap(i)}
                            className="clay-card"
                            style={{
                                height: '120px',
                                background: activeColor === i ? 'white' : c,
                                opacity: activeColor === i ? 1 : 0.8,
                                transform: activeColor === i ? 'scale(1.1)' : 'scale(1)',
                                transition: 'all 0.1s',
                                cursor: 'pointer',
                                border: '6px solid white'
                            }}
                        ></div>
                    ))}
                </div>
                {!sequence.length && <button className="clay-button" onClick={nextRound}>Start Game</button>}
                <p style={{ marginTop: '1rem', fontWeight: 700 }}>{isShowing ? 'Watch closely!' : 'Your turn!'}</p>
            </div>
        </div>
    );
};

export default SimonSays;
