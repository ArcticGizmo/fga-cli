import { AuthorizationModel, TupleKey, UserConfigurationParams, WriteAuthorizationModelRequest } from '@openfga/sdk';
import type { Store } from '@openfga/sdk';
interface ConfigurationOptions extends UserConfigurationParams {
    storeName?: string;
}
interface QueryOpts {
    pageSize?: number;
    token?: string;
}
declare class FGAClient {
    private _fga;
    private _storeName?;
    get storeId(): string;
    get storeName(): string | undefined;
    configure(options: ConfigurationOptions): Promise<void>;
    getStoreByName(name: string): Promise<Store | undefined>;
    getStoreById(id: string): Promise<Store | undefined>;
    setStoreByName(name: string): Promise<void>;
    setStoreById(id: string): Promise<void>;
    createStore(name: string): Promise<import("@openfga/sdk/dist/common").CallResult<import("@openfga/sdk").CreateStoreResponse>>;
    storeExistsByName(name: string): Promise<Store | undefined>;
    deleteStoreByName(name: string): Promise<void>;
    deleteStoreById(id: string): Promise<void>;
    deleteAllStores(): Promise<Store[]>;
    listAllStores(): Promise<Store[]>;
    private getAllStores;
    getPagedStores(token?: string): Promise<import("@openfga/sdk/dist/common").CallResult<import("@openfga/sdk").ListStoresResponse>>;
    createModel(definition: WriteAuthorizationModelRequest): Promise<import("@openfga/sdk/dist/common").CallResult<import("@openfga/sdk").WriteAuthorizationModelResponse>>;
    listModels(): Promise<AuthorizationModel[]>;
    private getAllModels;
    getPagedModels(token?: string): Promise<import("@openfga/sdk/dist/common").CallResult<import("@openfga/sdk").ReadAuthorizationModelsResponse>>;
    writeTuples(writes?: Array<TupleKey>, deletes?: Array<TupleKey>): Promise<void>;
    addTuple(user: string, relation: string, object: string): Promise<void>;
    deleteTuple(user: string, relation: string, object: string): Promise<void>;
    check(user: string, relation: string, object: string, contextTuples?: TupleKey[]): Promise<boolean | undefined>;
    query(tuple: TupleKey, opts?: QueryOpts): Promise<import("@openfga/sdk/dist/common").CallResult<import("@openfga/sdk").ReadResponse>>;
}
export declare const FGA: FGAClient;
export {};
