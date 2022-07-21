import { argv, exit } from 'node:process';
import { readFileSync } from 'node:fs';

import axios from 'axios';
import phpServer from 'php-server';

if (!argv[2])
  throw new Error('No file specified.');

const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  yellow: '\x1b[33m',
  magenta: '\x1b[35m',
}

const colorize =(text, color)=> color + text + colors.reset;

const guesses = readFileSync(argv[2], 'utf-8').split('\n');
console.log(colorize(`Found ${argv[2]}`, colors.green));

const encryptedString = guesses.shift();

const server = await phpServer({
  port: parseInt(process.argv[3]) || 8000,
  router: './aes.php',
});

console.log(colorize(
  `PHP server started on ${server.url}`,
  colors.yellow));

const RESULT_PADDER = '----------------';
const BIT_SIZES = [128, 192, 256];

const serverUrl = new URL(server.url);
serverUrl.searchParams.set('string', encryptedString);

for (const guess of guesses) {
  serverUrl.searchParams.set('key', guess);

  for (const bits of BIT_SIZES) {
    serverUrl.searchParams.set('bits', bits);
    const response = await axios.get(serverUrl.toString());

    if (response.data) {
      console.log(colorize(
        `\n${bits}bit key: ${guess}`,
        colors.green));

      console.log(response.data);
    }
  }
}

server.stop();