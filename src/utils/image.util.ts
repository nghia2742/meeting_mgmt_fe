import { FilePreview } from "@/components/modal/AddNewFile";

export const isImage = (name: string) => {
    return /\.(jpg|jpeg|png|gif)$/.test(name);
};