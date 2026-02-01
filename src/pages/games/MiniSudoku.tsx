import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const MiniSudoku: React.FC = () => {
    const navigate = useNavigate();
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
        initGrid();
    }, []);

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
            initGrid();
        }
    };

    return (
        <div className="game-container" style={{ padding: '20px', textAlign: 'center' }}>
            <div className="clay-container" style={{ background: '#fff' }}>
                <button className="clay-button secondary" onClick={() => navigate('/game-hub')} style={{ float: 'left' }}>← Back</button>
                <h2 style={{ fontSize: '2rem', marginTop: '1rem' }}>Mini Sudoku</h2>
                <div style={{ clear: 'both' }}></div>

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
