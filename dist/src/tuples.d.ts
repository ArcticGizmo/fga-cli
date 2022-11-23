interface OptionalFlags {
    file?: string;
}
export declare function addTupleOrTuples(storeName: string, user: string, relation: string, object: string, flags: OptionalFlags): Promise<void>;
export declare function removeTupleOrTuples(storeName: string, user: string, relation: string, object: string, flags: OptionalFlags): Promise<void>;
export {};
