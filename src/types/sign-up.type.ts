import { UserTrade } from ".";

export type SignUpDto = {
    name: string;
    email: string;
    password: string;
    location: string;
    userType: UserTrade;
    phone: string;
};