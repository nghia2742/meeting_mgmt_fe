export interface UserProfile {
    id: string;
    fullName: string;
    email: string;
    gender: 'male' | 'female' | 'other';
    dateOfBirth: Date | null;
    phoneNumber: string;
    address: string;
    avatar: string;
    provider: string;

}

