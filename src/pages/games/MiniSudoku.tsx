import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useGameSession } from '../../hooks/useGameSession';
import congratulations from '../../assets/congratulations.png';

const MiniSudoku: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { avatarId } = (location.state as { avatarId?: string }) || {};
    const { score, round, maxRounds, isGameOver, recordSuccess, resetGame } = useGameSession(5);
    const [grid, setGrid] = useState<(number | null)[]>([]);
    const [initialIndices, setInitialIndices] = useState<number[]>([]);

    const initGrid = () => {
        // Very simple 4x4 valid grid for kids
        const base = [
            1, 2, 3, 4,
            3, 4, 1, 2,
            2, 1, 4, 3,
            4, 3, 2, 1
        ];
        // Shuffle rows/cols slightly if wanted, or just hide some
        const hiddenIndices: number[] = [];
        const newGrid = base.map((val, idx) => {
            if (Math.random() > 0.6) {
                hiddenIndices.push(idx);
                return null;
            }
            return val;
        });
        setGrid(newGrid);
        setInitialIndices(base.map((_, i) => hiddenIndices.includes(i) ? -1 : i).filter(i => i !== -1));
    };

    useEffect(() => {
        if (!isGameOver) {
            initGrid();
        }
    }, [isGameOver, round]);

    const handleChange = (idx: number) => {
        if (initialIndices.includes(idx)) return;
        const currentVal = grid[idx];
        const nextVal = currentVal === 4 ? 1 : (currentVal ? currentVal + 1 : 1);
        const newGrid = [...grid];
        newGrid[idx] = nextVal;
        setGrid(newGrid);

        // Check if full and valid (simplified check for this version)
        if (newGrid.every(v => v !== null)) {
            alert('Sudoku Solved! 🧩');
            recordSuccess();
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
                    <h2 style={{ fontSize: 'clamp(1.5rem, 5vw, 2.5rem)', margin: 0, flex: 2, textAlign: 'center' }}>Mini Sudoku</h2>
                    <div style={{ flex: 1, textAlign: 'right', fontWeight: 'bold' }}>Round {round}/{maxRounds}</div>
                </div>

                <div className="sudoku-grid" style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(4, 1fr)',
                    gap: '5px',
                    maxWidth: '240px',
                    margin: '2rem auto',
                    background: '#ddd',
                    padding: '10px',
                    borderRadius: '10px'
                }}>
                    {grid.map((val, i) => (
                        <div
                            key={i}
                            onClick={() => handleChange(i)}
                            style={{
                                width: '50px',
                                height: '50px',
                                background: initialIndices.includes(i) ? '#eee' : 'white',
                                color: initialIndices.includes(i) ? '#333' : '#4A90E2',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '1.5rem',
                                fontWeight: 800,
                                cursor: 'pointer',
                                borderRadius: '5px'
                            }}
                        >
                            {val}
                        </div>
                    ))}
                </div>
                <p>Tap the white squares to change numbers!</p>
            </div>
        </div>
    );
};

export default MiniSudoku;
