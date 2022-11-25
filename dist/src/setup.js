"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logInstance = exports.stopInstance = exports.startInstance = void 0;
const cmd_1 = require("./cmd");
const NAME = 'fga-transient';
function awaitUserTermination() {
    return __awaiter(this, void 0, void 0, function* () {
        let isKilling = false;
        let hasKilled = false;
        process.stdin.setRawMode(true);
        return new Promise(resolve => {
            process.stdin.on('data', data => {
                const code = [...data][0];
                // this allows everything to be flushed out before terminating
                if (hasKilled) {
                    console.log('done');
                    resolve(undefined);
                    return;
                }
                // ctrl+c
                if (code !== 3) {
                    return;
                }
                if (isKilling) {
                    return;
                }
                isKilling = true;
                console.log('terminating ...');
                (0, cmd_1.cmd)(`docker stop ${NAME}`);
                hasKilled = true;
            });
        });
    });
}
function startInstance(opts) {
    return __awaiter(this, void 0, void 0, function* () {
        const ports = `-p 8080:${opts.http} -p 8081:${opts.grpc} -p 3000:${opts.playground}`;
        const detach = opts.detach ? ' -d' : '';
        const startCmd = `docker run --rm${detach} --name ${NAME} ${ports} openfga/openfga run`;
        const runner = (0, cmd_1.liveCmd)(startCmd, { show: true });
        // exit if naturally terminated
        runner.resp
            .then((code) => {
            process.exit(code);
        })
            .catch(() => {
            console.log('Process has been terminated from elsewhere');
            process.exit(0);
        });
        // await user termination
        yield awaitUserTermination();
    });
}
exports.startInstance = startInstance;
function stopInstance() {
    return __awaiter(this, void 0, void 0, function* () {
        const command = `docker stop ${NAME}`;
        yield (0, cmd_1.liveCmd)(command, { show: true }).resp;
    });
}
exports.stopInstance = stopInstance;
function logInstance() {
    return __awaiter(this, void 0, void 0, function* () {
        const command = `docker logs -f ${NAME}`;
        yield (0, cmd_1.liveCmd)(command, { show: true }).resp;
    });
}
exports.logInstance = logInstance;
