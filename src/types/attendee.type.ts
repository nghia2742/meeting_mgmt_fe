import { User } from "./user.type";

export type Attendee = User & {
    avatar: string;
}