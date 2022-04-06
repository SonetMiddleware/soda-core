/**
 * index starts at one.
 */
export declare function regexMatch(str: string, regexp: RegExp, index?: number): string | null;
export declare function regexMatch(str: string, regexp: RegExp, index: null): RegExpMatchArray | null;
export declare const getTwitterId: () => Promise<string>;
export declare const getFacebookId: () => Promise<string>;
export declare const twitterUrl: {
    hostIdentifier: string;
    hostLeadingUrl: string;
    hostLeadingUrlMobile: string;
};
export declare const isMobileTwitter: boolean;
export declare const twitterDomain: string;
export interface CustomEvents {
    paste: [text: string | {
        type: 'image';
        value: number[];
    }];
    input: [text: string];
    instagramUpload: [url: string];
}
export declare const CustomEventId = "abcf4ff0ce64-6fea93e2-1ce4-442f-b2f9";
export declare function dispatchCustomEvents<T extends keyof CustomEvents>(element: Element | Document | null, event: T, ...x: CustomEvents[T]): void;
export declare const EXTENSION_LINK = "https://s.plat.win?";
export declare const POST_SHARE_TEXT = "$!Please visit https://s.plat.win to download the latest Chrome extension!$";
export declare const removeTextInSharePost: (dom: HTMLElement) => void;
