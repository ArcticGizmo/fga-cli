import { execSync, spawn } from 'child_process';

interface CmdOpts {
  show?: boolean;
  output?: boolean;
  stdio?: string[];
}

export function cmd(command: string, opts: CmdOpts = {}) {
  try {
    if (opts.show) {
      console.log(command);
    }

    const options = { ...opts };

    if (opts.output === false) {
      options.stdio = [];
    }

    const output = execSync(command, options as any).toString();

    return { success: true, output };
  } catch (error: any) {
    return { success: false, output: error.output.join('\n') };
  }
}

export function liveCmd(command: string, opts: CmdOpts = {}) {
  if (opts.show) {
    console.log(command);
  }

  const [rootCmd, ...rest] = command.split(' ');

  const child = spawn(rootCmd, rest);

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
      } else {
        resolve(code);
      }
    });
  });

  return { child, resp };
}
