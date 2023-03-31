#! /usr/bin/env node
const iregexp = require('../dist/iregexp.umd.min');

process.stdin.setEncoding('utf-8');


if (process.argv.length < 2) {
    console.log("Must provide a regular expression.");
    process.exit(1);
}

const checked = iregexp.check(process.argv[2]);
console.log(checked);
