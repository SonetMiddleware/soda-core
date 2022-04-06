export declare function randomId(): string;
export declare const sendMessage: (message: any) => Promise<unknown>;
export declare const MessageTypes: {
    Connect_Metamask: string;
    Mint_Token: string;
    Sing_Message: string;
    Get_Owner: string;
    Get_Minter: string;
};
export declare const getOwner: (tokenId: string) => Promise<any>;
export declare const getMinter: (tokenId: string) => Promise<any>;
export declare const getUserAccount: () => Promise<string>;
export declare const getChainId: () => Promise<any>;
