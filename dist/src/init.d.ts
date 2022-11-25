interface Credential {
    method: 'api_token';
    config: {
        token: string;
    };
}
interface CreateOptions {
    apiScheme: string;
    apiHost: string;
    presharedKey?: string;
    credentials?: Credential;
}
export declare function createConfig(opts: CreateOptions): void;
export declare function createModel(): void;
export declare function createTuples(): void;
export declare function createState(): void;
export declare function createAll(opts: CreateOptions): void;
export {};
