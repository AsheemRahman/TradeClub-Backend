export type UserMinimal = {
    _id: string;
    fullName: string;
    profilePicture?: string;
    role: "User" | "Expert";
    lastMessage?: string;
    unreadCount?: number;
    updatedAt?: string;
};