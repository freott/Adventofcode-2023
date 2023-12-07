const getSeedsAndMaps = (input) => {
  const rows = input.split("\n\n")
  const seeds = rows
    .shift()
    .split("seeds: ")[1]
    .split(" ")
    .map(Number)
  const maps = rows
    .map(mapStr => mapStr
      .split("map:\n")[1]
      .split("\n")
      .map(rowStr => rowStr
        .split(" ")
        .map(Number)
      )
     
    )
         
   return [seeds, maps]
}

const step = (mapRows, value) => {
  const map = mapRows
    .find(([_, source, range]) => 
      value >= source && value < source + range
    )
  if (!map) return value
  const [destination, source, range] = map
  
  return (value - source) + destination
}

const run = (input) => {
  const [seeds, maps] = getSeedsAndMaps(input)
  console.log(seeds)
  console.log(maps)
  const locations = seeds.map(seed => 
    maps
      .reduce(
        (value, mapRows) => step(mapRows, value), 
      seed)
  )
  return Math.min(...locations)
}

module.exports = run