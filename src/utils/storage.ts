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
