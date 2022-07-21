import readlinePromise from 'readline-promise';
import { stdin, stdout } from 'node:process';

import axios from 'axios';
import phpServer from 'php-server';

const readline = readlinePromise.default;

const readlineInterface = readline.createInterface({
  input: stdin,
  output: stdout,
  termina: true,
});

const server = await phpServer({
  port: parseInt(process.argv[2]) || 8000,
  router: './aes.php',
});

console.log(`PHP server started on ${server.url}`);

process.on('exit', ()=> {
  readlineInterface.close();
  server.stop();
});


const RESULT_PADDER = '----------------';
const BIT_SIZES = [128, 192, 256];
const guessHistory = [];

const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  yellow: '\x1b[33m',
  magenta: '\x1b[35m',
}

function colorize(text, color) {
  return color + text + colors.reset;
}

const encryptedString = await readlineInterface.questionAsync(
  '\nEncrypted string: ');

const serverUrl = new URL(server.url);
serverUrl.searchParams.set('string', encryptedString);

for (;;) {
  const guess = await readlineInterface.questionAsync(
    colorize('\n[GUESS] ', colors.cyan));

  if (!guess) {
    console.log(
      colorize('Tried:', colors.yellow),
      guessHistory.sort().join(colorize(', ', colors.yellow)) )

    continue;
  }

  serverUrl.searchParams.set('key', guess);
  guessHistory.push(guess);

  for (const bits of BIT_SIZES) {
    serverUrl.searchParams.set('bits', bits);
    const response = await axios.get(serverUrl.toString());

    if (response.data) {
      console.log(colorize(
        `${RESULT_PADDER} Result for ${bits}bit key ${RESULT_PADDER}`,
        colors.green));

      console.log(response.data);
    }
  }
}