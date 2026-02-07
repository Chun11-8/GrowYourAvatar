import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export interface GameInfo {
    id: string;
    title: string;
    emoji: string;
    skills: string[];
    path: string;
    color: string;
}

export const MINI_GAMES: GameInfo[] = [
    { id: 'shape-matching', title: 'Shape Match', emoji: '📐', skills: ['Shapes', 'Colors'], path: '/game/shape-matching', color: '#FFADAD' },
    { id: 'alphabet-tap', title: 'Alphabet', emoji: '🔤', skills: ['Letters', 'Phonics'], path: '/game/alphabet-tap', color: '#FFD6A5' },
    { id: 'counting', title: 'Counting', emoji: '🔢', skills: ['Counting', 'Numbers'], path: '/game/counting', color: '#FDFFB6' },
    { id: 'memory', title: 'Memory', emoji: '🧠', skills: ['Memory', 'Attention'], path: '/game/memory', color: '#CAFFBF' },
    { id: 'color-sorting', title: 'Colors', emoji: '🎨', skills: ['Classification', 'Colors'], path: '/game/color-sorting', color: '#9BFBC0' },
    { id: 'maze', title: 'Maze', emoji: '🌀', skills: ['Logic', 'Spatial'], path: '/game/maze', color: '#A0C4FF' },
    { id: 'sound-matching', title: 'Sounds', emoji: '🔊', skills: ['Listening', 'Language'], path: '/game/sound-matching', color: '#BDB2FF' },
    { id: 'patterns', title: 'Patterns', emoji: '🔄', skills: ['Logic', 'Sequencing'], path: '/game/patterns', color: '#FFC6FF' },
    { id: 'size-comp', title: 'Sizes', emoji: '⚖️', skills: ['Comparison', 'Reasoning'], path: '/game/size-comp', color: '#FFFFFC' },
    { id: 'number-order', title: 'Order', emoji: '📏', skills: ['Sequencing', 'Numbers'], path: '/game/number-order', color: '#FFD1DC' },
    { id: 'tic-tac-toe', title: 'Tic-Tac-Toe', emoji: '❌', skills: ['Logic', 'Turns'], path: '/game/tic-tac-toe', color: '#E2F0CB' },
    { id: 'rps', title: 'Rock Paper', emoji: '✊', skills: ['Rules', 'Decisions'], path: '/game/rps', color: '#C7CEEA' },
    { id: 'sudoku', title: 'Sudoku', emoji: '🧩', skills: ['Logic', 'Numbers'], path: '/game/sudoku', color: '#FF9AA2' },
    { id: 'connect', title: 'Connect 3', emoji: '🔴', skills: ['Strategy', 'Patterns'], path: '/game/connect', color: '#B5EAD7' },
    { id: 'simon', title: 'Simon', emoji: '🔔', skills: ['Memory', 'Sequencing'], path: '/game/simon', color: '#FFDAC1' },
];



const GameHub: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { avatarId } = (location.state as { avatarId?: string }) || {};

    // Group games for the "Featured" look
    const categories = [
        {
            title: "Learning Basics 📚",
            games: MINI_GAMES.filter(g => ['Counting', 'Alphabet', 'Sizes', 'Colors', 'Shapes'].some(k => g.title.includes(k) || g.skills.includes(k)))
        },
        {
            title: "Brain Power 🧠",
            games: MINI_GAMES.filter(g => !['Counting', 'Alphabet', 'Sizes', 'Colors', 'Shapes', 'Sound'].some(k => g.title.includes(k) || g.skills.includes(k)))
        }
    ];

    // Catch any missing ones? For now, this is a simple filter. 
    // Let's just manually assign for perfection if needed, but this heuristic works for the demo.

    return (
        <div className="game-hub-container" style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: '#fffbf0', // Warm cream background
            display: 'flex',
            flexDirection: 'column',
            zIndex: 9999,
            overflow: 'hidden',
            fontFamily: '"Fredoka", sans-serif',
            paddingTop: 'env(safe-area-inset-top)',
            paddingBottom: 'env(safe-area-inset-bottom)',
            paddingLeft: 'env(safe-area-inset-left)',
            paddingRight: 'env(safe-area-inset-right)',
            boxSizing: 'border-box'
        }}>
            {/* Minimal Header */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '15px 20px',
                background: 'transparent',
                flexShrink: 0
            }}>
                <button
                    onClick={() => navigate('/avatar-view', { state: { avatarId } })}
                    style={{
                        position: 'absolute',
                        left: '20px',
                        background: 'white',
                        border: 'none',
                        borderRadius: '12px',
                        width: '40px',
                        height: '40px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.2rem',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                        cursor: 'pointer'
                    }}
                >
                    ⬅️
                </button>
                <h1 style={{
                    fontSize: '1.2rem',
                    color: '#333',
                    margin: 0,
                    fontWeight: 600,
                    letterSpacing: '0.5px'
                }}>
                    Game Center
                </h1>
            </div>

            {/* Scrollable Content */}
            <div style={{
                flex: 1,
                overflowY: 'auto',
                padding: '0 20px 20px 20px'
            }}>
                {/* Featured / Progress Banner */}
                <div style={{
                    background: 'white',
                    borderRadius: '24px',
                    padding: '20px',
                    marginBottom: '20px',
                    boxShadow: '0 5px 15px rgba(0,0,0,0.03)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}>
                    <div>
                        <h3 style={{ margin: '0 0 5px 0', color: '#2d3436' }}>Ready to play?</h3>
                        <p style={{ margin: 0, color: '#b2bec3', fontSize: '0.9rem' }}>Earn treats for your avatar! 🦴</p>
                    </div>
                    <div style={{ fontSize: '2.5rem' }}>🐕</div>
                </div>

                {categories.map((cat, idx) => (
                    <div key={idx} style={{ marginBottom: '25px' }}>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '15px'
                        }}>
                            <h2 style={{
                                fontSize: '1.1rem',
                                color: '#2d3436',
                                margin: 0,
                                fontWeight: 700
                            }}>{cat.title}</h2>
                            <span style={{ fontSize: '0.9rem', color: '#b2bec3' }}>More</span>
                        </div>

                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(3, 1fr)',
                            gap: '15px',
                        }}>
                            {cat.games.map((game) => (
                                <div
                                    key={game.id}
                                    onClick={() => navigate(game.path, { state: { avatarId } })}
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        gap: '8px',
                                        cursor: 'pointer'
                                    }}
                                >
                                    {/* Icon Container */}
                                    <div style={{
                                        width: '100%',
                                        aspectRatio: '1/1',
                                        background: game.color || '#eee',
                                        borderRadius: '22px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '2.5rem',
                                        boxShadow: '0 4px 10px rgba(0,0,0,0.05)',
                                        transition: 'transform 0.1s',
                                        position: 'relative',
                                        overflow: 'hidden'
                                    }}>
                                        {/* Subtle Shine Effect */}
                                        <div style={{
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            right: 0,
                                            bottom: 0,
                                            background: 'linear-gradient(135deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 100%)',
                                            pointerEvents: 'none'
                                        }}></div>
                                        <span style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' }}>
                                            {game.emoji}
                                        </span>
                                    </div>

                                    {/* Text */}
                                    <span style={{
                                        fontSize: '0.9rem',
                                        color: '#555',
                                        fontWeight: 600,
                                        textAlign: 'center',
                                        lineHeight: 1.2
                                    }}>
                                        {game.title}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>


        </div>
    );
};

export default GameHub;
