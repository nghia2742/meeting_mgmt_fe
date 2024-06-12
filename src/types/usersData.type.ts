export interface Users {
    fullName: string;
    email: string;
    gender: 'male' | 'female' | 'other';
    dateOfBirth: Date | null;
    phoneNumber: string;
    address: string;
    avatar: string;
    provider: string;
}



