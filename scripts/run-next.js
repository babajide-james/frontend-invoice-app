const net = require("net");
const { spawn } = require("child_process");
const path = require("path");

const mode = process.argv[2] || "dev";
const preferredPort = Number(process.env.PORT || 3000);
const maxAttempts = 10;

function findOpenPort(startPort) {
  return new Promise((resolve, reject) => {
    let port = startPort;

    function tryPort() {
      const server = net.createServer();

      server.unref();

      server.on("error", (error) => {
        if (error.code === "EADDRINUSE" && port < startPort + maxAttempts) {
          port += 1;
          tryPort();
          return;
        }
        reject(error);
      });

      server.listen(port, () => {
        const { port: openPort } = server.address();
        server.close(() => resolve(openPort));
      });
    }

    tryPort();
  });
}

async function main() {
  try {
    const port = await findOpenPort(preferredPort);
    const nextBin = require.resolve("next/dist/bin/next");
    const args = [nextBin, mode, "-p", String(port)];

    if (port !== preferredPort) {
      console.log(
        `Port ${preferredPort} is busy, starting Next.js on port ${port} instead.`,
      );
    }

    const child = spawn(process.execPath, args, {
      stdio: "inherit",
      cwd: process.cwd(),
      env: process.env,
    });

    child.on("exit", (code) => {
      process.exit(code ?? 0);
    });
  } catch (error) {
    console.error("Unable to find an open port for Next.js:", error.message);
    process.exit(1);
  }
}

main();
