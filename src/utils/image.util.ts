import { FilePreview } from "@/components/modal/AddNewFile";

export const isImage = (file: FilePreview) => {
    return /\.(jpg|jpeg|png|gif)$/.test(file.name);
};