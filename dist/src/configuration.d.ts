export declare function readFile(path: string): string | undefined;
export declare function readJson<T = any>(path: string): T | undefined;
export declare function readModel(path: string): Required<Pick<import("@openfga/sdk").AuthorizationModel, "type_definitions" | "schema_version">> | undefined;
