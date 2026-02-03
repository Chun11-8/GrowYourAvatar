import React from 'react';
import { useNavigate } from 'react-router-dom';

export interface GameInfo {
    id: string;
    title: string;
    emoji: string;
    skills: string[];
    path: string;
    color: string;
}

export const MINI_GAMES: GameInfo[] = [
    { id: 'shape-matching', title: 'Shape Matching', emoji: '📐', skills: ['Shapes', 'Colors'], path: '/game/shape-matching', color: '#FFADAD' },
    { id: 'alphabet-tap', title: 'Alphabet Tap', emoji: '🔤', skills: ['Letters', 'Phonics'], path: '/game/alphabet-tap', color: '#FFD6A5' },
    { id: 'counting', title: 'Counting Objects', emoji: '🔢', skills: ['Counting', 'Numbers'], path: '/game/counting', color: '#FDFFB6' },
    { id: 'memory', title: 'Memory Flip', emoji: '🧠', skills: ['Memory', 'Attention'], path: '/game/memory', color: '#CAFFBF' },
    { id: 'color-sorting', title: 'Color Sorting', emoji: '🎨', skills: ['Classification', 'Colors'], path: '/game/color-sorting', color: '#9BFBC0' },
    { id: 'maze', title: 'Maze Runner', emoji: '🌀', skills: ['Logic', 'Spatial'], path: '/game/maze', color: '#A0C4FF' },
    { id: 'sound-matching', title: 'Sound Match', emoji: '🔊', skills: ['Listening', 'Language'], path: '/game/sound-matching', color: '#BDB2FF' },
    { id: 'patterns', title: 'Patterns', emoji: '🔄', skills: ['Logic', 'Sequencing'], path: '/game/patterns', color: '#FFC6FF' },
    { id: 'size-comp', title: 'Size Comparison', emoji: '⚖️', skills: ['Comparison', 'Reasoning'], path: '/game/size-comp', color: '#FFFFFC' },
    { id: 'number-order', title: 'Number Order', emoji: '📏', skills: ['Sequencing', 'Numbers'], path: '/game/number-order', color: '#FFD1DC' },
    { id: 'tic-tac-toe', title: 'Tic-Tac-Toe', emoji: '❌', skills: ['Logic', 'Turns'], path: '/game/tic-tac-toe', color: '#E2F0CB' },
    { id: 'rps', title: 'Rock Paper Scissors', emoji: '✊', skills: ['Rules', 'Decisions'], path: '/game/rps', color: '#C7CEEA' },
    { id: 'sudoku', title: 'Mini Sudoku', emoji: '🧩', skills: ['Logic', 'Patterns'], path: '/game/sudoku', color: '#B5EAD7' },
    { id: 'connect', title: 'Connect-3', emoji: '🔵', skills: ['Planning', 'Patterns'], path: '/game/connect', color: '#FF9AA2' },
    { id: 'simon', title: 'Simon Says', emoji: '🚥', skills: ['Memory', 'Attention'], path: '/game/simon', color: '#E2F0CB' },
];

const ProgressBar = () => {
    // Pixel-art style circle CSS
    const circleStyle: React.CSSProperties = {
        width: '50px',
        height: '50px',
        borderRadius: '50%',
        border: '4px solid #333',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1.5rem',
        background: 'white',
        position: 'relative',
        zIndex: 2,
        boxShadow: '4px 4px 0px rgba(0,0,0,0.2)' // Pixel shadow effect
    };

    const activeStyle: React.CSSProperties = {
        ...circleStyle,
        background: '#FF6B6B',
        color: 'white',
        borderColor: '#8B0000',
    };

    const completedStyle: React.CSSProperties = {
        ...circleStyle,
        background: '#4CD137',
        color: 'white',
        borderColor: '#2E7D32',
    };

    const lineStyle: React.CSSProperties = {
        position: 'absolute',
        top: '50%',
        left: '0',
        right: '0',
        height: '6px',
        background: '#ddd',
        transform: 'translateY(-50%)',
        zIndex: 1,
        border: '2px solid #ccc'
    };

    return (
        <div style={{ position: 'relative', width: '100%', maxWidth: '300px', margin: '0 auto 2rem auto', display: 'flex', justifyContent: 'space-between' }}>
            {/* Connecting Line */}
            <div style={lineStyle}>
                {/* Progress fill (50% because we are at step 2 of 3) */}
                <div style={{ width: '50%', height: '100%', background: '#4CD137' }}></div>
            </div>

            {/* Step 1: Quiz (Done) */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 2 }}>
                <div style={completedStyle}>📝</div>
                <span style={{ fontSize: '0.8rem', fontWeight: 'bold', marginTop: '5px', color: '#4CD137' }}>Quiz</span>
            </div>

            {/* Step 2: Game Hub (Active) */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 2 }}>
                <div style={activeStyle}>🎮</div>
                <span style={{ fontSize: '0.8rem', fontWeight: 'bold', marginTop: '5px', color: '#FF6B6B' }}>Games</span>
            </div>

            {/* Step 3: Flag (Pending) */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 2 }}>
                <div style={circleStyle}>🚩</div>
                <span style={{ fontSize: '0.8rem', fontWeight: 'bold', marginTop: '5px', color: '#999' }}>Goal</span>
            </div>
        </div>
    );
};

const GameHub: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="game-hub-container" style={{ width: '100%', maxWidth: '1000px', padding: '20px' }}>
            <div className="clay-container" style={{ background: '#f8f9fa' }}>
                <button
                    className="clay-button secondary"
                    style={{ padding: '8px 16px', fontSize: '0.9rem', marginBottom: '2rem' }}
                    onClick={() => navigate('/avatar-view')}
                >
                    ← Back to Avatar
                </button>

                <ProgressBar />

                <h1 style={{ textAlign: 'center', fontSize: '3rem', marginBottom: '0.5rem', color: '#FF6B6B' }}>Play & Grow!</h1>
                <p style={{ textAlign: 'center', marginBottom: '3rem', fontSize: '1.2rem', color: '#666' }}>
                    Choose a game to earn food and make your avatar happy!
                </p>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '10px',
                    padding: '10px'
                }}>
                    {MINI_GAMES.map((game) => (
                        <div
                            key={game.id}
                            className="clay-card"
                            style={{
                                cursor: 'pointer',
                                textAlign: 'center',
                                background: `linear-gradient(135deg, ${game.color} 0%, rgba(255,255,255,0.8) 100%)`,
                                border: '4px solid white',
                                transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                                padding: '10px',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                minHeight: '140px',
                                boxShadow: '0 5px 10px rgba(0,0,0,0.1)'
                            }}
                            onClick={() => navigate(game.path)}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'scale(1.05) translateY(-5px)';
                                e.currentTarget.style.boxShadow = '0 15px 30px rgba(0,0,0,0.2)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'scale(1) translateY(0)';
                                e.currentTarget.style.boxShadow = '0 10px 20px rgba(0,0,0,0.1)';
                            }}
                        >
                            <div style={{
                                fontSize: '2.5rem',
                                marginBottom: '0.5rem',
                                filter: 'drop-shadow(0 4px 4px rgba(0,0,0,0.1))'
                            }}>{game.emoji}</div>

                            <h3 style={{
                                fontSize: '1rem',
                                marginBottom: '0.2rem',
                                color: '#333',
                                fontWeight: 800
                            }}>{game.title}</h3>

                            <div style={{ display: 'none' }}>
                                {/* Hidden skills for mobile compactness, or we can make them very small.
                                User asked for 3x3 grid, which is tight. Hiding skills helps. 
                                Or we can just show 1 skill. Let's hide for cleaner look similar to iOS folders. 
                            */}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div >
    );
};

export default GameHub;
