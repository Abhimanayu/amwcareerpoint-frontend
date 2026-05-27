import { spawn } from 'node:child_process';

const port = process.env.PORT || '3000';
const host = process.env.HOSTNAME || '0.0.0.0';
const command = process.platform === 'win32' ? 'npx.cmd' : 'npx';

const child = spawn(command, ['next', 'start', '-H', host, '-p', port], {
  stdio: 'inherit',
  env: {
    ...process.env,
    NODE_ENV: 'production',
    NEXT_TELEMETRY_DISABLED: process.env.NEXT_TELEMETRY_DISABLED || '1',
  },
});

child.on('exit', (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }

  process.exit(code ?? 0);
});
