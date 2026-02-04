export interface AvatarStats {
    health: number;
    mana: number;
    mood: number;
}

export type MoodState = 'happy' | 'sad' | 'excited' | 'sleepy';

export interface AvatarData {
    id: string;
    image: string;
    style: string;
    voxelCode?: string;
    stats: AvatarStats;
    currentMoodState: MoodState;
    createdAt: number;
    lastDailyUpdate?: number;
    lastPlayedAt?: number;
    quizCompleted?: boolean;
}

const STORAGE_KEY = 'grow_your_avatar_data';

export const saveAvatar = (avatar: AvatarData): void => {
    const avatars = getAllAvatars();
    const existingIndex = avatars.findIndex(a => a.id === avatar.id);

    if (existingIndex > -1) {
        avatars[existingIndex] = avatar;
    } else {
        avatars.push(avatar);
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(avatars));
};

export const getAllAvatars = (): AvatarData[] => {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    try {
        return JSON.parse(data);
    } catch (e) {
        console.error('Failed to parse avatar data', e);
        return [];
    }
};

export const getAvatarById = (id: string): AvatarData | undefined => {
    return getAllAvatars().find(a => a.id === id);
};

export const deleteAvatar = (id: string): void => {
    const avatars = getAllAvatars().filter(a => a.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(avatars));
};

export const createInitialStats = (): AvatarStats => ({
    health: 5,
    mana: 5,
    mood: 5
});

/**
 * Handles logic for Scenario 2: Earning HP after Quiz + Game
 */
export const completeGameSession = (avatarId: string): { rewarded: boolean } => {
    const avatar = getAvatarById(avatarId);
    if (!avatar) return { rewarded: false };

    let rewarded = false;
    const updatedAvatar = { ...avatar };

    // Scenario 2: if quiz was completed, give 1 health
    if (avatar.quizCompleted) {
        updatedAvatar.stats = {
            ...avatar.stats,
            health: Math.min(5, avatar.stats.health + 1)
        };
        updatedAvatar.quizCompleted = false; // Reset for next session
        rewarded = true;
    }

    // Mark as played to prevent Scenario 1 penalty
    updatedAvatar.lastPlayedAt = Date.now();

    saveAvatar(updatedAvatar);
    return { rewarded };
};
