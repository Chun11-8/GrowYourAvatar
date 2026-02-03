import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useGameSession } from '../../hooks/useGameSession';

const GRID_SIZE = 5;
const MAZE = [
    [0, 0, 1, 0, 0],
    [1, 0, 1, 0, 1],
    [0, 0, 0, 0, 0],
    [0, 1, 1, 1, 0],
    [0, 0, 0, 0, 0],
];


const MazeRunner: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { avatarId } = (location.state as { avatarId?: string }) || {};
    const { score, round, maxRounds, isGameOver, recordSuccess, resetGame } = useGameSession(5);
    const [pos, setPos] = useState({ x: 0, y: 0 });
    const target = { x: 4, y: 4 };

    const move = (dx: number, dy: number) => {
        const nx = pos.x + dx;
        const ny = pos.y + dy;

        if (nx >= 0 && nx < GRID_SIZE && ny >= 0 && ny < GRID_SIZE && MAZE[ny][nx] === 0) {
            setPos({ x: nx, y: ny });
            if (nx === target.x && ny === target.y) {
                setTimeout(() => {
                    alert('You reached the goal! 🌟');
                    recordSuccess();
                    setPos({ x: 0, y: 0 });
                }, 100);
            }
        }
    };

    if (isGameOver) {
        return (
            <div className="game-container" style={{ padding: '20px', textAlign: 'center' }}>
                <div className="clay-container" style={{ background: '#fff' }}>
                    <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Game Over! 🎉</h2>
                    <p style={{ fontSize: '1.5rem', marginBottom: '2rem' }}>You scored {score} out of {maxRounds}!</p>
                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                        <button className="clay-button" onClick={() => { resetGame(); setPos({ x: 0, y: 0 }); }}>Play Again</button>
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
                    <h2 style={{ fontSize: 'clamp(1.5rem, 5vw, 2.5rem)', margin: 0, flex: 2, textAlign: 'center' }}>Maze Runner</h2>
                    <div style={{ flex: 1, textAlign: 'right', fontWeight: 'bold' }}>Round {round}/{maxRounds}</div>
                </div>

                <div className="maze-grid" style={{
                    display: 'grid',
                    gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
                    gap: '5px',
                    width: '300px',
                    margin: '2rem auto',
                    background: '#eee',
                    padding: '10px',
                    borderRadius: '15px'
                }}>
                    {MAZE.map((row, y) => row.map((cell, x) => (
                        <div key={`${x}-${y}`} style={{
                            width: '50px',
                            height: '50px',
                            background: cell === 1 ? '#555' : 'white',
                            borderRadius: '5px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '2rem'
                        }}>
                            {pos.x === x && pos.y === y ? '🐥' : (target.x === x && target.y === y ? '⭐' : '')}
                        </div>
                    )))}
                </div>

                <div className="controls" style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '10px',
                    width: '200px',
                    margin: '0 auto'
                }}>
                    <div></div>
                    <button className="clay-button" onClick={() => move(0, -1)}>▲</button>
                    <div></div>
                    <button className="clay-button" onClick={() => move(-1, 0)}>◀</button>
                    <button className="clay-button" onClick={() => move(0, 1)}>▼</button>
                    <button className="clay-button" onClick={() => move(1, 0)}>▶</button>
                </div>
                <p style={{ marginTop: '1rem', fontWeight: 600 }}>Use arrows to guide the chick to the star!</p>
            </div>
        </div>
    );
};

export default MazeRunner;
