import { cmd, liveCmd } from "./cmd.js";

const NAME = "fga-transient";

async function awaitUserTermination() {
  let isKilling = false;
  let hasKilled = false;
  process.stdin.setRawMode(true);
  return new Promise((resolve) => {
    process.stdin.on("data", (data) => {
      const code = [...data][0];

      // this allows everything to be flushed out before terminating
      if (hasKilled) {
        console.log("  done");
        resolve();
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

      process.stdout.write("terminating ...");
      cmd(`docker stop ${NAME}`);
      hasKilled = true;
    });
  });
}

export async function startInstance() {
  const ports = "-p 8080:8080 -p 8081:8081 -p 3000:3000";
  const startCmd = `docker run --rm --name ${NAME} ${ports} openfga/openfga run`;

  const runner = liveCmd(startCmd, { show: true });

  // exit if naturally terminated
  runner.resp.then(process.exit).catch(() => {
    console.log("Process has been terminated from elsewhere");
    process.exit(0);
  });

  // await user termination
  await awaitUserTermination();
}

export async function stopInstance() {
  const command = `docker stop ${NAME}`;
  await liveCmd(command, { show: true }).resp;
}

export async function logInstance() {
  const command = `docker logs -f ${NAME}`;
  await liveCmd(command, { show: true }).resp;
}
