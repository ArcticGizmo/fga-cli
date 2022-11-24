interface StartOptions {
    http: string;
    grpc: string;
    playground: string;
}
export declare function startInstance(opts: StartOptions): Promise<void>;
export declare function stopInstance(): Promise<void>;
export declare function logInstance(): Promise<void>;
export {};
