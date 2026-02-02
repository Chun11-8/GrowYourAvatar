import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameSession } from '../../hooks/useGameSession';

const COLS = 5;
const ROWS = 4;

const ConnectThree: React.FC = () => {
    const navigate = useNavigate();
    const { score, round, maxRounds, isGameOver, recordSuccess, recordFailure, resetGame } = useGameSession(5);
    const [board, setBoard] = useState<(string | null)[][]>(Array(ROWS).fill(null).map(() => Array(COLS).fill(null)));
    const [isRedNext, setIsRedNext] = useState(true);
    const [winner, setWinner] = useState<string | null>(null);

    const checkWin = (b: (string | null)[][]) => {
        // Horizontal, Vertical, Diagonal checks
        for (let r = 0; r < ROWS; r++) {
            for (let c = 0; c < COLS; c++) {
                const player = b[r][c];
                if (!player) continue;
                // Check right
                if (c <= COLS - 3 && player === b[r][c + 1] && player === b[r][c + 2]) return player;
                // Check down
                if (r <= ROWS - 3 && player === b[r + 1][c] && player === b[r + 2][c]) return player;
                // Check diag right
                if (r <= ROWS - 3 && c <= COLS - 3 && player === b[r + 1][c + 1] && player === b[r + 2][c + 2]) return player;
                // Check diag left
                if (r <= ROWS - 3 && c >= 2 && player === b[r + 1][c - 1] && player === b[r + 2][c - 2]) return player;
            }
        }
        return null;
    };

    const drop = (c: number) => {
        if (winner || isGameOver) return;
        const newBoard = board.map(row => [...row]);
        for (let r = ROWS - 1; r >= 0; r--) {
            if (!newBoard[r][c]) {
                newBoard[r][c] = isRedNext ? '🔴' : '🟡';
                setBoard(newBoard);
                setIsRedNext(!isRedNext);
                const win = checkWin(newBoard);
                if (win) {
                    setWinner(win);
                    if (win === '🔴') {
                        recordSuccess();
                    } else {
                        recordFailure();
                    }
                }
                break;
            }
        }
    };

    const handleNextRound = () => {
        setBoard(Array(ROWS).fill(null).map(() => Array(COLS).fill(null)));
        setWinner(null);
        setIsRedNext(true);
    };

    const handleReset = () => {
        resetGame();
        setBoard(Array(ROWS).fill(null).map(() => Array(COLS).fill(null)));
        setWinner(null);
        setIsRedNext(true);
    };


    if (isGameOver) {
        return (
            <div className="game-container" style={{ padding: '20px', textAlign: 'center' }}>
                <div className="clay-container" style={{ background: '#fff' }}>
                    <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Game Over! 🎉</h2>
                    <p style={{ fontSize: '1.5rem', marginBottom: '2rem' }}>You scored {score} out of {maxRounds}!</p>
                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                        <button className="clay-button" onClick={handleReset}>Play Again</button>
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
                    <h2 style={{ fontSize: 'clamp(1.5rem, 5vw, 2.5rem)', margin: 0, flex: 2, textAlign: 'center' }}>Connect-3</h2>
                    <div style={{ flex: 1, textAlign: 'right', fontWeight: 'bold' }}>Round {round}/{maxRounds}</div>
                </div>

                <div style={{ margin: '1rem', fontSize: '1.2rem', fontWeight: 700 }}>
                    {winner ? `Winner: ${winner}! 🎉` : `Turn: ${isRedNext ? '🔴' : '🟡'}`}
                </div>

                <div className="connect-grid" style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '10px',
                    background: '#A0C4FF',
                    padding: '15px',
                    borderRadius: '15px',
                    maxWidth: '400px',
                    margin: '2rem auto'
                }}>
                    {Array.from({ length: COLS }).map((_, c) => (
                        <div key={c} onClick={() => drop(c)} style={{ display: 'flex', flexDirection: 'column', gap: '10px', cursor: 'pointer' }}>
                            {Array.from({ length: ROWS }).map((_, r) => (
                                <div key={r} style={{
                                    width: '50px',
                                    height: '50px',
                                    background: 'white',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '2rem'
                                }}>
                                    {board[r][c]}
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
                {winner && <button className="clay-button" onClick={handleNextRound}>Next Round</button>}
            </div>
        </div>
    );
};

export default ConnectThree;
