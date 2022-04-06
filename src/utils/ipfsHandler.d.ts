declare const ipfs: import("ipfs-http-client/dist/src/types").IPFSHTTPClient;
declare const ipfsAdd: (file: File | Blob | ArrayBuffer | string) => Promise<string>;
declare const ipfsGet: (cid: string) => Promise<Uint8Array>;
declare const getImgDataFromU8Array: (content: Uint8Array) => string;
export { ipfsAdd, ipfsGet, getImgDataFromU8Array };
export default ipfs;
