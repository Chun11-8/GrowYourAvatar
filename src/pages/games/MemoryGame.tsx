import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useGameSession } from '../../hooks/useGameSession';
import congratulations from '../../assets/congratulations.png';

const EMOJIS = ['🍎', '🐶', '🍕', '🚗', '🎈']; // 5 pairs for 5 rounds

interface Card {
    id: number;
    emoji: string;
    isFlipped: boolean;
    isMatched: boolean;
}

const MemoryGame: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { avatarId } = (location.state as { avatarId?: string }) || {};
    const { score, maxRounds, isGameOver, recordSuccess, resetGame } = useGameSession(5); // 5 Pairs = 5 Points = Game Over
    const [cards, setCards] = useState<Card[]>([]);
    const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
    // const [score, setScore] = useState(0);

    const initGame = () => {
        const doubled = [...EMOJIS, ...EMOJIS]
            .sort(() => Math.random() - 0.5)
            .map((emoji, idx) => ({
                id: idx,
                emoji,
                isFlipped: false,
                isMatched: false,
            }));
        setCards(doubled);
        setFlippedIndices([]);
        // setScore(0);
    };

    useEffect(() => {
        initGame();
    }, []);

    const handleFlip = (idx: number) => {
        if (flippedIndices.length === 2 || cards[idx].isFlipped || cards[idx].isMatched) return;

        const newCards = [...cards];
        newCards[idx].isFlipped = true;
        setCards(newCards);

        const newFlipped = [...flippedIndices, idx];
        setFlippedIndices(newFlipped);

        if (newFlipped.length === 2) {
            const [first, second] = newFlipped;
            if (cards[first].emoji === cards[second].emoji) {
                setTimeout(() => {
                    const matchedCards = [...cards];
                    matchedCards[first].isMatched = true;
                    matchedCards[second].isMatched = true;
                    setCards(matchedCards);
                    setFlippedIndices([]);
                    recordSuccess();
                    if (matchedCards.every(c => c.isMatched)) {
                        alert('You found them all! 🎉');
                        // initGame(); // Don't auto-restart, let Game Over screen handle
                    }
                }, 500);
            } else {
                setTimeout(() => {
                    const resetCards = [...cards];
                    resetCards[first].isFlipped = false;
                    resetCards[second].isFlipped = false;
                    setCards(resetCards);
                    setFlippedIndices([]);
                }, 1000);
            }
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
                    <h2 style={{ fontSize: 'clamp(1.5rem, 5vw, 2.5rem)', margin: 0, flex: 2, textAlign: 'center' }}>Memory Match</h2>
                    <div style={{ flex: 1, textAlign: 'right', fontWeight: 'bold' }}>Pairs {score}/{maxRounds}</div>
                </div>

                <div className="cards-grid" style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(4, 1fr)',
                    gap: '1rem',
                    maxWidth: '500px',
                    margin: '2rem auto'
                }}>
                    {cards.map((card, idx) => (
                        <div
                            key={card.id}
                            className="clay-card"
                            style={{
                                height: '100px',
                                background: card.isFlipped || card.isMatched ? 'white' : '#A2D2FF',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '2.5rem',
                                cursor: 'pointer',
                                transition: 'transform 0.3s',
                                transform: card.isFlipped || card.isMatched ? 'rotateY(180deg)' : 'none'
                            }}
                            onClick={() => handleFlip(idx)}
                        >
                            <div style={{ transform: card.isFlipped || card.isMatched ? 'rotateY(180deg)' : 'none' }}>
                                {card.isFlipped || card.isMatched ? card.emoji : '❓'}
                            </div>
                        </div>
                    ))}
                </div>
                <button className="clay-button secondary" onClick={initGame}>Restart Board</button>
            </div>
        </div>
    );
};

export default MemoryGame;
