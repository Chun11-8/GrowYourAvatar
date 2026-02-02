import { useState, useCallback } from 'react';

interface GameSessionResult {
    score: number;
    round: number;
    maxRounds: number;
    isGameOver: boolean;
    recordSuccess: () => void;
    recordFailure: () => void;
    resetGame: () => void;
}

export const useGameSession = (maxRounds: number = 5): GameSessionResult => {
    const [score, setScore] = useState(0);
    const [round, setRound] = useState(1);
    const [isGameOver, setIsGameOver] = useState(false);

    const checkGameOver = useCallback((currentRound: number) => {
        if (currentRound > maxRounds) {
            setIsGameOver(true);
            return true;
        }
        return false;
    }, [maxRounds]);

    const recordSuccess = useCallback(() => {
        if (isGameOver) return;

        setScore(prev => prev + 1);
        const nextRound = round + 1;
        setRound(nextRound);
        checkGameOver(nextRound);
    }, [round, isGameOver, checkGameOver]);

    const recordFailure = useCallback(() => {
        if (isGameOver) return;

        // Score doesn't increase, but round does
        const nextRound = round + 1;
        setRound(nextRound);
        checkGameOver(nextRound);
    }, [round, isGameOver, checkGameOver]);

    const resetGame = useCallback(() => {
        setScore(0);
        setRound(1);
        setIsGameOver(false);
    }, []);

    return {
        score,
        round: Math.min(round, maxRounds), // Cap display at maxRounds
        maxRounds,
        isGameOver,
        recordSuccess,
        recordFailure,
        resetGame
    };
};
