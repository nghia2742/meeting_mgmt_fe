export const getExtension = (file: any): string => {
    const parts = file.split('.');
    const extension = parts[parts.length - 1];
    return extension;
}