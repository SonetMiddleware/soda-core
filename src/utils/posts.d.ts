export declare const postIdParser: (node: HTMLElement) => string;
export declare const postAvatarParser: (node: HTMLElement) => string;
export declare const postContentParser: (node: HTMLElement) => string;
export declare const canonifyImgUrl: (url: string) => string | string[];
export declare const postImagesParser: (node: HTMLElement) => Promise<string[]>;
