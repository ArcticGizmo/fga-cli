import { execSync } from "child_process";

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
    if (opts.output !== false) {
      error.output.forEach((l) => {
        console.error((l || "").toString());
      });
    }

    return { success: false, output: error.output.join("\n") };
  }
}
