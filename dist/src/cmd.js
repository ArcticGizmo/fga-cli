"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.liveCmd = exports.cmd = void 0;
const child_process_1 = require("child_process");
function cmd(command, opts = {}) {
    try {
        if (opts.show) {
            console.log(command);
        }
        const options = Object.assign({}, opts);
        if (opts.output === false) {
            options.stdio = [];
        }
        const output = (0, child_process_1.execSync)(command, options).toString();
        return { success: true, output };
    }
    catch (error) {
        return { success: false, output: error.output.join('\n') };
    }
}
exports.cmd = cmd;
function liveCmd(command, opts = {}) {
    if (opts.show) {
        console.log(command);
    }
    const [rootCmd, ...rest] = command.split(' ');
    const child = (0, child_process_1.spawn)(rootCmd, rest);
    const resp = new Promise((resolve, reject) => {
        child.stdout.on('data', data => {
            console.log(data.toString());
        });
        child.stderr.on('data', data => {
            console.log(data.toString());
        });
        child.on('exit', code => {
            if (code == null || code > 0) {
                reject(code || 0);
            }
            else {
                resolve(code);
            }
        });
    });
    return { child, resp };
}
exports.liveCmd = liveCmd;
