/// <reference types="node" />
interface CmdOpts {
    show?: boolean;
    output?: boolean;
    stdio?: string[];
}
export declare function cmd(command: string, opts?: CmdOpts): {
    success: boolean;
    output: any;
};
export declare function liveCmd(command: string, opts?: CmdOpts): {
    child: import("child_process").ChildProcessWithoutNullStreams;
    resp: Promise<unknown>;
};
export {};
