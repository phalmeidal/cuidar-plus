import { spawn } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import dotenv from 'dotenv';

const externalEnvironment = new Set(Object.keys(process.env));

if (existsSync('.env')) {
  dotenv.config({ path: '.env' });
}

if (existsSync('.env.local')) {
  const localEnvironment = dotenv.parse(readFileSync('.env.local'));
  for (const [key, value] of Object.entries(localEnvironment)) {
    if (!externalEnvironment.has(key)) {
      process.env[key] = value;
    }
  }
}

const [command, ...args] = process.argv.slice(2);

if (!command) {
  console.error('Usage: node scripts/run-with-env.mjs <command> [...args]');
  process.exit(1);
}

let executable = command;
let commandArgs = args;

if (command === 'node') {
  executable = process.execPath;
} else if (command === 'prisma') {
  executable = process.execPath;
  commandArgs = [resolve('node_modules', 'prisma', 'build', 'index.js'), ...args];
}

const child = spawn(executable, commandArgs, {
  env: process.env,
  stdio: 'inherit',
});

child.on('exit', (code) => process.exit(code ?? 1));
child.on('error', (error) => {
  console.error(error);
  process.exit(1);
});
