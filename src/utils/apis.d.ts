export declare const BINDING_CONTENT_TITLE = "Binding with Soda";
export declare enum PLATFORM {
    Twitter = "Twitter",
    Facebook = "Facebook",
    Instgram = "Instgram"
}
export interface IBindTwitterParams {
    addr: string;
    tid: string;
    sig: string;
    platform: PLATFORM;
}
export declare const bindTwitterId: (params: IBindTwitterParams) => Promise<boolean>;
export interface IBindPostParams {
    addr: string;
    tid: string;
    platform: PLATFORM;
    content_id: string;
}
export declare const bindPost: (params: IBindPostParams) => Promise<boolean>;
export interface IUnbindAddrParams {
    addr: string;
    tid: string;
    platform: string;
    sig: string;
}
export declare const unbindAddr: (params: IUnbindAddrParams) => Promise<boolean>;
export interface IPlatformAccount {
    platform: PLATFORM;
    account: string;
}
export interface IGetTwitterBindResultParams {
    addr?: string;
    tid?: string;
}
export interface IBindResultData {
    addr: string;
    tid: string;
    platform: PLATFORM;
    content_id?: string;
}
export declare const getTwitterBindResult: (params: IGetTwitterBindResultParams) => Promise<IBindResultData[]>;
export declare const getOrderByTokenId: (tokenId: string, status?: number) => Promise<any>;
export interface IGetOwnedNFTParams {
    addr: string;
    contract?: string;
    token_id?: string;
    page?: number;
    gap?: number;
}
export interface IOwnedNFTData {
    contract: string;
    erc: string;
    token_id: string;
    amount: string;
    uri: string;
    owner: string;
    update_block: string;
}
export interface IOwnedNFTResp {
    total: number;
    data: IOwnedNFTData[];
}
export declare const getOwnedNFT: (params: IGetOwnedNFTParams) => Promise<IOwnedNFTResp>;
export interface IGetFavNFTParams {
    addr: string;
    contract?: string;
    page?: number;
    gap?: number;
}
export interface IFavNFTData {
    addr: string;
    contract: string;
    token_id: number;
    uri: string;
    isOwned?: boolean;
    isMinted?: boolean;
}
export interface IFavNFTResp {
    total: number;
    data: IFavNFTData[];
}
export declare const getFavNFT: (params: IGetFavNFTParams) => Promise<IFavNFTResp>;
export interface IAddToFavParams {
    addr: string;
    contract: string;
    token_id: string;
    uri: string;
    fav: number;
}
export declare const addToFav: (params: IAddToFavParams) => Promise<boolean>;
export interface IGenReferralCodeParams {
    addr: string;
    platform: string;
    tid: string;
}
export declare const genReferralCode: (params: IGenReferralCodeParams) => Promise<string>;
export interface IAcceptReferralCodeParams {
    addr: string;
    referral: string;
    sig: string;
}
export declare const acceptReferralCode: (params: IAcceptReferralCodeParams) => Promise<boolean>;
export declare const getAcceptedReferralCode: (addr: string) => Promise<string>;
export declare const getAcceptedCount: (code: string) => Promise<number>;
export interface IGetMyReferralCodeParams {
    addr: string;
    platform: string;
    tid: string;
}
export declare const getMyReferralCode: (params: IGetMyReferralCodeParams) => Promise<string>;
