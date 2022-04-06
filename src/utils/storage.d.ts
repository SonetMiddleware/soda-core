export declare enum StorageKeys {
    MNEMONICS = "TWIN_MNEMONICS",
    ACCOUNTS = "TWIN_ACCOUNTS",
    TWITTER_NICKNAME = "TWITTER_NICKNAME",
    MNEMONICS_CREATING = "MNEMONICS_CREATING",
    TWITTER_BINDED = "TWITTER_BINDED",
    FACEBOOK_ID = "FACEBOOK_ID",
    WAITING_TWITTER_BINDING_POST = "WAITING_TWITTER_BINDING_POST",
    WAITING_FACEBOOK_BINDING_POST = "WAITING_FACEBOOK_BINDING_POST",
    TWITTER_BIND_RESULT = "TWITTER_BIND_RESULT",
    FACEBOOK_BIND_RESULT = "FACEBOOK_BIND_RESULT",
    SHARING_NFT_META = "SHARING_NFT_META"
}
export declare const saveMnenonics: (mnemonics: string) => Promise<void>;
export declare const getMnemonics: () => Promise<string>;
export declare const saveLocal: (key: string, value: string) => Promise<void>;
export declare const removeLocal: (key: string) => Promise<void>;
export declare const getLocal: (key: string) => Promise<string>;
export declare const hasCreated: () => Promise<boolean>;
