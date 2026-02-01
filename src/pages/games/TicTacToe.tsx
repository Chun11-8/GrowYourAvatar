import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const TicTacToe: React.FC = () => {
    const navigate = useNavigate();
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
        if (winner || board[i]) return;
        const newBoard = [...board];
        newBoard[i] = 'X';
        setBoard(newBoard);
        setIsXNext(false);
        const win = checkWinner(newBoard);
        if (win) setWinner(win);
        else if (newBoard.every(s => s !== null)) setWinner('Draw');
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
                    if (win) setWinner(win);
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

    return (
        <div className="game-container" style={{ padding: '20px', textAlign: 'center' }}>
            <div className="clay-container" style={{ background: '#fff' }}>
                <button className="clay-button secondary" onClick={() => navigate('/game-hub')} style={{ float: 'left' }}>← Back</button>
                <h2 style={{ fontSize: '2.5rem', marginTop: '1rem' }}>Tic-Tac-Toe</h2>
                <div style={{ clear: 'both' }}></div>

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
                {winner && <button className="clay-button" onClick={reset}>Play Again</button>}
            </div>
        </div>
    );
};

export default TicTacToe;
