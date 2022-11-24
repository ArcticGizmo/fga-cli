import { TupleKey } from '@openfga/sdk';
interface OptionalFlags {
    file?: string;
    user?: string;
    relation?: string;
    object?: string;
}
export declare function addTupleOrTuples(storeName: string, flags: OptionalFlags): Promise<void>;
export declare function addTuples(tuples: TupleKey[]): Promise<void>;
export declare function removeTupleOrTuples(storeName: string, flags: OptionalFlags): Promise<void>;
export {};
