import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const EMOJIS = ['🍎', '🐶', '🍕', '🚗', '🎈', '👻'];

interface Card {
    id: number;
    emoji: string;
    isFlipped: boolean;
    isMatched: boolean;
}

const MemoryGame: React.FC = () => {
    const navigate = useNavigate();
    const [cards, setCards] = useState<Card[]>([]);
    const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
    const [score, setScore] = useState(0);

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
        setScore(0);
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
                    setScore(s => s + 1);
                    if (matchedCards.every(c => c.isMatched)) {
                        alert('You found them all! 🎉');
                        initGame();
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

    return (
        <div className="game-container" style={{ padding: '20px', textAlign: 'center' }}>
            <div className="clay-container" style={{ background: '#fff' }}>
                <button className="clay-button secondary" onClick={() => navigate('/game-hub')} style={{ float: 'left' }}>← Back</button>
                <h2 style={{ fontSize: '2.5rem', marginTop: '1rem' }}>Memory Match</h2>
                <div style={{ clear: 'both' }}></div>

                <div className="score-board" style={{ fontSize: '1.5rem', margin: '1rem 0', fontWeight: 700 }}>
                    Matches: {score}
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
                <button className="clay-button secondary" onClick={initGame}>Reset Game</button>
            </div>
        </div>
    );
};

export default MemoryGame;
