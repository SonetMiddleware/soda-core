import { browser } from 'webextension-polyfill-ts';

export enum StorageKeys {
  MNEMONICS = 'TWIN_MNEMONICS',
  ACCOUNTS = 'TWIN_ACCOUNTS',
  TWITTER_NICKNAME = 'TWITTER_NICKNAME',
  MNEMONICS_CREATING = 'MNEMONICS_CREATING',
  TWITTER_BINDED = 'TWITTER_BINDED',
  FACEBOOK_ID = 'FACEBOOK_ID',
  WAITING_TWITTER_BINDING_POST = 'WAITING_TWITTER_BINDING_POST',
  WAITING_FACEBOOK_BINDING_POST = 'WAITING_FACEBOOK_BINDING_POST',
  TWITTER_BIND_RESULT = 'TWITTER_BIND_RESULT',
  FACEBOOK_BIND_RESULT = 'FACEBOOK_BIND_RESULT',
  SHARING_NFT_META = 'SHARING_NFT_META'
}

export const saveMnenonics = async (mnemonics: string) => {
  await browser.storage.local.set({
    [StorageKeys.MNEMONICS]: mnemonics,
  });
};

export const getMnemonics = async (): Promise<string> => {
  const local = await browser.storage.local.get(StorageKeys.MNEMONICS);
  return local[StorageKeys.MNEMONICS] || '';
};

export const saveLocal = async (key: string, value: string) => {
  await browser.storage.local.set({ [key]: value });
};

export const removeLocal = async (key: string) => {
  await browser.storage.local.remove(key);
};

export const getLocal = async (key: string): Promise<string> => {
  const local = await browser.storage.local.get(key);
  return local[key];
};

export const hasCreated = async () => {
  const mnemonics = await getLocal(StorageKeys.MNEMONICS);
  return mnemonics && mnemonics !== '';
};
