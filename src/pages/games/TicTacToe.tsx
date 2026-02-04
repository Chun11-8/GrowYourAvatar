import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useGameSession } from '../../hooks/useGameSession';
import congratulations from '../../assets/congratulations.png';

const TicTacToe: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { avatarId } = (location.state as { avatarId?: string }) || {};
    const { score, round, maxRounds, isGameOver, recordSuccess, recordFailure, resetGame } = useGameSession(5);
    const [board, setBoard] = useState<(string | null)[]>(Array(9).fill(null));
    const [isXNext, setIsXNext] = useState(true);
    const [winner, setWinner] = useState<string | null>(null);

    const checkWinner = (squares: (string | null)[]) => {
        const lines = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6]
        ];
        for (let i = 0; i < lines.length; i++) {
            const [a, b, c] = lines[i];
            if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
                return squares[a];
            }
        }
        return null;
    };

    const handleClick = (i: number) => {
        if (winner || board[i] || isGameOver) return;
        const newBoard = [...board];
        newBoard[i] = 'X';
        setBoard(newBoard);
        setIsXNext(false);
        const win = checkWinner(newBoard);
        if (win) {
            setWinner(win);
            if (win === 'X') {
                recordSuccess();
            } else {
                recordFailure();
            }
        } else if (newBoard.every(s => s !== null)) {
            setWinner('Draw');
            recordFailure();
        }
    };

    useEffect(() => {
        if (!isXNext && !winner) {
            const timer = setTimeout(() => {
                const emptyIndices = board.map((s, i) => s === null ? i : null).filter(i => i !== null) as number[];
                if (emptyIndices.length > 0) {
                    const randomIndex = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
                    const newBoard = [...board];
                    newBoard[randomIndex] = 'O';
                    setBoard(newBoard);
                    setIsXNext(true);
                    const win = checkWinner(newBoard);
                    if (win) {
                        setWinner(win);
                        recordFailure();
                    } else if (newBoard.every(s => s !== null)) {
                        setWinner('Draw');
                        recordFailure();
                    }
                }
            }, 600);
            return () => clearTimeout(timer);
        }
    }, [isXNext, winner, board]);

    const reset = () => {
        setBoard(Array(9).fill(null));
        setIsXNext(true);
        setWinner(null);
    };

    const handleReset = () => {
        resetGame();
        reset();
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
                    <h2 style={{ fontSize: 'clamp(1.5rem, 5vw, 2.5rem)', margin: 0, flex: 2, textAlign: 'center' }}>Tic-Tac-Toe</h2>
                    <div style={{ flex: 1, textAlign: 'right', fontWeight: 'bold' }}>Round {round}/{maxRounds}</div>
                </div>

                <div style={{ margin: '1rem', fontSize: '1.5rem', fontWeight: 700 }}>
                    {winner ? (winner === 'Draw' ? "It's a Tie! 🤝" : `${winner === 'X' ? 'You' : 'Computer'} Wins! 🏆`) : `Player turn: ${isXNext ? 'X' : 'O'}`}
                </div>

                <div className="ttt-grid" style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '10px',
                    maxWidth: '300px',
                    margin: '2rem auto'
                }}>
                    {board.map((val, i) => (
                        <button
                            key={i}
                            className="clay-card"
                            style={{
                                height: '90px',
                                background: 'white',
                                fontSize: '2.5rem',
                                color: val === 'X' ? '#FF6B6B' : '#4A90E2',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                            onClick={() => handleClick(i)}
                        >
                            {val}
                        </button>
                    ))}
                </div>
                {winner && <button className="clay-button" onClick={reset}>Next Round</button>}
            </div>
        </div>
    );
};

export default TicTacToe;
