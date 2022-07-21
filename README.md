# Code Breaking Tool

**Code Breaking Tool** (or **CBT** for short) is a simple [Node.JS](https://nodejs.dev/) application that allows you to try your hardest and fastest at guessing the keys used for encrypting text through [aesencryption.net](https://aesencryption.net). It works by starting a PHP server that hosts the aesencryption.net code on your local machine, so you don't have to worry about flooding anyone with GET requests (other than yourself).

Note that you need to already have PHP (5.3+) and NodeJS installed on your system, and their respective binaries in your `PATH`. If you get some error about `openssl_decrypt` or something make sure that the module is enabled in your `php.ini`

## Installation

```bash
$ git clone https://github.com/debil03311/cbt
$ cd cbt
$ npm i
```

## Usage

```bash
$ node . # starts on :8000
$ node . 4545 # starts on :4545
```

You will be prompted to enter your AES-encrypted string, and after doing so you will enter guessing mode. All you then have to do is type your guess and hit `Enter`, then do it again, and again, and again, and again, and again... until you maybe guess it.

Additionally, you can press `Enter` with no input to see a list of all your previous guesses.