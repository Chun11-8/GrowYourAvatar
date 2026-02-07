import { useState, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { completeGameSession } from '../utils/storage';
import { soundManager } from '../utils/SoundManager';

interface GameSessionResult {
    score: number;
    round: number;
    maxRounds: number;
    isGameOver: boolean;
    leveledUp: boolean; // New prop
    recordSuccess: () => void;
    recordFailure: () => void;
    resetGame: () => void;
    claimReward: () => void;
}

export const useGameSession = (maxRounds: number = 5, avatarId?: string): GameSessionResult & { claimReward: () => void } => {
    const location = useLocation();
    const effectiveAvatarId = avatarId || (location.state as any)?.avatarId || localStorage.getItem('currentAvatarId');

    const [score, setScore] = useState(0);
    const [round, setRound] = useState(1);
    const [isGameOver, setIsGameOver] = useState(false);
    const [leveledUp, setLeveledUp] = useState(false);

    // Scenario 2: Manual claim reward
    const claimReward = useCallback(() => {
        if (effectiveAvatarId) {
            const { leveledUp: didLevelUp } = completeGameSession(effectiveAvatarId);
            if (didLevelUp) {
                setLeveledUp(true);
                soundManager.playLevelUp();
            } else {
                soundManager.playClick(); // Feedback for claiming
            }
        }
    }, [effectiveAvatarId]);

    const checkGameOver = useCallback((currentRound: number) => {
        if (currentRound > maxRounds) {
            setIsGameOver(true);
            soundManager.playWin(); // Session complete fanfare
            return true;
        }
        return false;
    }, [maxRounds]);

    const recordSuccess = useCallback(() => {
        if (isGameOver) return;

        soundManager.playCorrect();
        setScore(prev => prev + 1);
        const nextRound = round + 1;
        setRound(nextRound);
        checkGameOver(nextRound);
    }, [round, isGameOver, checkGameOver]);

    const recordFailure = useCallback(() => {
        if (isGameOver) return;

        soundManager.playWrong();
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
        resetGame,
        claimReward
    };
};
