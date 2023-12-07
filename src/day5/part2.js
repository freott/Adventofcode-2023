const getSeedsRangesAndMaps = (input) => {
  const rows = input.split("\n\n")
  const seedsRanges = rows
    .shift()
    .split("seeds: ")[1]
    .split(" ")
    .map(Number)
    .reduce((acc, seedOrRange, i, arr) => {
      if (i % 2 === 0) acc.push([seedOrRange, arr[i + 1]])
      return acc
    }, []);
  const maps = rows
    .map(mapStr => mapStr
      .split("map:\n")[1]
      .split("\n")
      .map(rowStr => rowStr
        .split(" ")
        .map(Number)
      )
    )

   return [seedsRanges, maps]
}

const stepBackByRange = (mapRows, ranges) => {
  const nextRanges = []
  ranges.forEach(([start, range]) => {
    const end = start + (range - 1)
    for (const [mapStart, source, rng] of mapRows) {
      const targetSourceDiff = source - mapStart
      const mapEnd = mapStart + (rng - 1)

      if (start > mapEnd) continue;
      if (mapStart > end) {
        nextRanges.push([start, range])
        range = 0
        break;
      }

      if (mapStart > start) {
        const rng = mapStart - start
        nextRanges.push([start, rng])
        start = mapStart
        range -= rng
      }

      if (mapEnd >= end) {
        const nextRange = (end + 1) - start
        nextRanges.push([start + targetSourceDiff, nextRange])
        range -= nextRange
        break;
      }

      const nextRange = (mapEnd + 1) - start
      nextRanges.push([
        start + targetSourceDiff, 
        nextRange
      ])
      start = mapEnd + 1
      range -= nextRange
    }
    if (range > 0) {
      nextRanges.push([start, range])
    }
  })
  return nextRanges
}



const stepBack = (mapRows, value) => {
  const map = mapRows
    .find(([target, _, range]) => 
      value >= target && value < target + range
    )
  if (!map) return value
  const [destination, source] = map
  return (value - destination) + source
}

const checkForOverlappingRange = (
  locationRow,
  reversedSortedMaps,
  seedsRanges
) => {
  let nextRanges = [[locationRow[0], locationRow[2]]]
  reversedSortedMaps.forEach((mapRows, ii ) => {
    nextRanges = stepBackByRange(mapRows, nextRanges)
  })

  const hasOverlappingRange = nextRanges.some(finalRange => {
    const finalStart = finalRange[0];
    const finalEnd = finalRange[0] + finalRange[1] - 1;
    return seedsRanges.some(seedRange => {
      const seedStart = seedRange[0]; 
      const seedEnd = seedRange[0] + seedRange[1] - 1;

      return (seedStart <= finalEnd && seedEnd >= finalStart);
    });
  })

  return hasOverlappingRange
}

const findLowestLocation = (seedsRanges, maps) => {
  const reversedSortedMaps = maps
    .reverse()
    .map(mapRows => mapRows.sort((a, b) => a[0] - b[0]))

  const locationMap = reversedSortedMaps[0]
  const lowestLocation = locationMap[0][0]
  if (lowestLocation !== 0) {
      locationMap.unshift([0, 0, lowestLocation])
  }

  let lowestLocationNumber
  for (let locationRow of locationMap) {
    const hasOverlappingRange = checkForOverlappingRange(
      locationRow, reversedSortedMaps, seedsRanges
    )
    
    if (hasOverlappingRange) {
      let [tar, src, rng] = locationRow
      let chunkedLocationRows = []
      while (rng - 10000 > 0) {
        rng -= 10000
        chunkedLocationRows.push([tar + rng, src + rng, 10000])
      }
      chunkedLocationRows.push([tar, src, rng])
      chunkedLocationRows = chunkedLocationRows.reverse()
      
      for (let chunkedLocationRow of chunkedLocationRows) {
        const hasOverlappingRange = checkForOverlappingRange(
          chunkedLocationRow, reversedSortedMaps, seedsRanges
        )
        if (hasOverlappingRange) {
          const [target, source, range] = chunkedLocationRow
          for (let i = target; i < target + range; i++) {
            let value = i;
            for(let mapRows of reversedSortedMaps) {
              value = stepBack(mapRows, value)
            }

            if (seedsRanges
                .some(([start, range]) => value >= start && value < start + range)
             ) {
              return i
             }
          }
        }
      }
    }
  }
}

const run = (input) => {
  const [seedsRanges, maps] = getSeedsRangesAndMaps(input)
  return findLowestLocation(seedsRanges, maps)
}

module.exports = run