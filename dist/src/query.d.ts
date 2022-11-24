interface QueryOpts {
    store: string;
    user?: string;
    relation?: string;
    object: string;
    pageSize?: number;
    token?: string;
}
export declare function queryTuples(opts: QueryOpts): Promise<void>;
export {};
