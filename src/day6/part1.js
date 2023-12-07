const getRaces = (input) => {
  const [times, distances] = input
    .split("\n")
    .map(str => str.split(":")[1]
      .trim()
      .split(" ")
      .filter(str => str != "" && str != " ")
    )

  return times.map((time, i) => ({
    time,
    distance: distances[i]
  }))
}

const getRaceRecords = (race) => {
  const speedRecords = []
  for (let speed = 1; speed < race.time; speed++) {
    const distance = (race.time - speed) * speed
    if (distance > race.distance) speedRecords.push(speed)
  }
  return speedRecords
}

const run = (input) => {
  const races = getRaces(input)
  const records = races.map(getRaceRecords)
  return records.reduce((acc, record) => record.length * acc , 1)
}

module.exports = run