import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

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
                    setPos({ x: 0, y: 0 });
                }, 100);
            }
        }
    };

    return (
        <div className="game-container" style={{ padding: '20px', textAlign: 'center' }}>
            <div className="clay-container" style={{ background: '#fff' }}>
                <button className="clay-button secondary" onClick={() => navigate('/game-hub')} style={{ float: 'left' }}>← Back</button>
                <h2 style={{ fontSize: '2rem', marginTop: '1rem' }}>Maze Runner</h2>
                <div style={{ clear: 'both' }}></div>

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
