import type { MutationObserverWatcher } from '@dimensiondev/holoflows-kit';
export declare function startWatch<T extends MutationObserverWatcher<any, any, any, any>>(watcher: T, signal?: AbortSignal): T;
