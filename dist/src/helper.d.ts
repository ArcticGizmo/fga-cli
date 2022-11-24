export declare function chunkEvery<T = any>(arr: T[], count: number, step?: number | undefined, leftover?: T[] | string): Array<Array<T>>;
export declare function terminate(msg: string, reason?: number): never;
export declare function delay(duration: number): Promise<unknown>;
