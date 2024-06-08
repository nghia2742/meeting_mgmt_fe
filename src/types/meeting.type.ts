export type Meeting = {
    id: string;
    title: string;
    type: string;
    description: string;
    notes: string;
    startTime: Date;
    endTime: Date;
    location: string;
    createdBy: string;
    updatedBy: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
}