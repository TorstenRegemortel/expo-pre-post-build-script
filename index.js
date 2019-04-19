#!/usr/bin/env node

const { executePre } = require('./pre');
const { executePost } = require('./post');

const varidables = process.argv.slice(2);

if (varidables[0] === 'pre') {
  return executePre(varidables[1]);
}

if (varidables[0] === 'post') {
  return executePost();
}

console.log('no script defined');
