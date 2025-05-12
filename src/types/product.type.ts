import { Category, Condition } from ".";

export type productDto = {
    name: string;
    desc: string;
    category: Category;
    condition: Condition;
    estimatedPrice: number;
    points: number;
    images: string[];
};