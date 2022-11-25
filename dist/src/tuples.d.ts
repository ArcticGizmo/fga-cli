import { TupleKey } from '@openfga/sdk';
interface OptionalFlags {
    storeName: string;
    file?: string;
    user?: string;
    relation?: string;
    object?: string;
}
export declare function addTupleOrTuples(flags: OptionalFlags): Promise<void>;
export declare function addTuples(tuples: TupleKey[]): Promise<void>;
export declare function removeTupleOrTuples(flags: OptionalFlags): Promise<void>;
export {};
