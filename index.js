const DAY = process.argv[2] || 5
const PART = process.argv[3] || 2

const run = require('./src/run')

console.log('Running day', Number(DAY), 'part', Number(PART))
run(DAY, PART)