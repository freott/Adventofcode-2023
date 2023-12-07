const getRace = (input) => {
  const [time, distance] = input
    .split("\n")
    .map(str => str.split(":")[1]
      .replaceAll(" ", "")
    )

  return {
    time: Number(time),
    distance: Number(distance)
  }
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
  const race = getRace(input)
  console.log(race)
  const records = getRaceRecords(race)
  console.log(records)
  return records.length
}

module.exports = run