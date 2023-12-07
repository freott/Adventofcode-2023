const fs = require('fs');

const run = (day, part) => {
  const solver = require(`./day${day}/part${part}`)
  const input = fs.readFileSync(`./inputs/day${day}.txt`, 'utf8')

  const result = solver(input)

  console.log(result)
}

module.exports = run