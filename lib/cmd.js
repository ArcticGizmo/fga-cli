import { execSync, spawn } from "child_process";

export function cmd(command, opts = {}) {
  try {
    if (opts.show) {
      console.log(command);
    }

    const options = { ...opts };

    if (opts.output === false) {
      options.stdio = [];
    }

    const output = execSync(command, options).toString();

    return { success: true, output };
  } catch (error) {
    return { success: false, output: error.output.join("\n") };
  }
}

export function liveCmd(command, opts = {}) {
  if (opts.show) {
    console.log(command);
  }

  const [rootCmd, ...rest] = command.split(" ");

  const child = spawn(rootCmd, rest);

  const resp = new Promise((resolve, reject) => {
    child.stdout.on("data", (data) => {
      console.log(data.toString());
    });

    child.stderr.on("data", (data) => {
      console.log(data.toString());
    });

    child.on("exit", (code) => {
      if (code > 0) {
        reject(code);
      } else {
        resolve(code);
      }
    });
  });

  return { child, resp };
}
