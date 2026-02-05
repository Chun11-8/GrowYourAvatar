import { useState, useCallback, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { completeGameSession } from '../utils/storage';

interface GameSessionResult {
    score: number;
    round: number;
    maxRounds: number;
    isGameOver: boolean;
    leveledUp: boolean; // New prop
    recordSuccess: () => void;
    recordFailure: () => void;
    resetGame: () => void;
}

export const useGameSession = (maxRounds: number = 5, avatarId?: string): GameSessionResult => {
    const location = useLocation();
    const effectiveAvatarId = avatarId || (location.state as any)?.avatarId;

    const [score, setScore] = useState(0);
    const [round, setRound] = useState(1);
    const [isGameOver, setIsGameOver] = useState(false);
    const [leveledUp, setLeveledUp] = useState(false);

    // Scenario 2: Handle game completion rewards
    useEffect(() => {
        if (isGameOver && effectiveAvatarId) {
            const { rewarded, leveledUp: didLevelUp } = completeGameSession(effectiveAvatarId);
            if (rewarded) {
                console.log('Health reward granted for avatar:', effectiveAvatarId);
            }
            if (didLevelUp) {
                setLeveledUp(true);
            }
        }
    }, [isGameOver, effectiveAvatarId]);

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
        setLeveledUp(false);
    }, []);

    return {
        score,
        round: Math.min(round, maxRounds), // Cap display at maxRounds
        maxRounds,
        isGameOver,
        leveledUp,
        recordSuccess,
        recordFailure,
        resetGame
    };
};
