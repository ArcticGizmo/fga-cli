import { TupleKey } from '@openfga/sdk';
interface CheckOptions {
    store: string;
    context?: TupleKey[];
}
export declare function checkTuple(user: string, relation: string, object: string, opts: CheckOptions, a: any): Promise<void>;
export {};
