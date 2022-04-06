export declare const dispatchPasteImgEvent: (img: File | Blob) => Promise<void>;
/** get the un xrayed version of a _DOM_ object */
export declare function un_xray_DOM<T>(x: T): T;
/** Clone a object into the page realm */
export declare function clone_into<T>(x: T): T;
export declare function constructUnXrayedDataTransferProxy(unXrayed_file: File): DataTransfer;
export declare function constructUnXrayedFilesFromUintLike(format: string, fileName: string, xray_fileContent: number[] | Uint8Array): File;
export interface CustomEvents {
    paste: [text: string | {
        type: 'image';
        value: number[];
    }];
    input: [text: string];
    instagramUpload: [url: string];
}
export declare function dispatchPaste(textOrImage: CustomEvents['paste'][0]): void;
