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

                <h1 style={{ textAlign: 'center', fontSize: '3rem', marginBottom: '0.5rem', color: '#FF6B6B' }}>Play & Grow! 🎮</h1>
                <p style={{ textAlign: 'center', marginBottom: '3rem', fontSize: '1.2rem', color: '#666' }}>
                    Choose a game to earn coins and make your avatar happy!
                </p>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', // Auto-fit but wider minmax naturally limits cols
                    // Or for strict 3 col on large screens:
                    // gridTemplateColumns: 'repeat(3, 1fr)', 
                    // But we need mobile responsiveness. Let's use media query style logic or CSS Grid smarts.
                    // User asked for "3 by 3 view".
                    gap: '1.5rem',
                    padding: '1rem'
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
                                padding: '1.5rem',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                minHeight: '200px',
                                boxShadow: '0 10px 20px rgba(0,0,0,0.1)'
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
                                fontSize: '4rem',
                                marginBottom: '1rem',
                                filter: 'drop-shadow(0 4px 4px rgba(0,0,0,0.1))'
                            }}>{game.emoji}</div>

                            <h3 style={{
                                fontSize: '1.4rem',
                                marginBottom: '0.5rem',
                                color: '#333',
                                fontWeight: 800
                            }}>{game.title}</h3>

                            <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap', justifyContent: 'center' }}>
                                {game.skills.map(skill => (
                                    <span key={skill} style={{
                                        fontSize: '0.75rem',
                                        background: 'rgba(255,255,255,0.9)',
                                        padding: '4px 10px',
                                        borderRadius: '12px',
                                        fontWeight: 700,
                                        color: '#555',
                                        boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                                    }}>
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div >
    );
};

export default GameHub;
