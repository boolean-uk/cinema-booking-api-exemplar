const filters = {
  'lessThan': 'lt',
  'greaterThan': 'gt'
}

const createMovieQuery = req => {
  const { screenings } = req.body
  const movieData = {
    title: req.body.title,
    runtimeMins: Number(req.body.runtimeMins)
  }
  if (screenings) {
    movieData.screenings = {
      create: screenings
    }
  }
  return movieData
}

const findManyQuery = req => {
  const {runtimeMins, comparison} = req.query
  let runtimeMinsFilters = {}

  if (runtimeMins && comparison) {
    runtimeMinsFilters.runtimeMins = {}
    runtimeMinsFilters.runtimeMins[filters[comparison]] = Number(runtimeMins)
  }

  return runtimeMinsFilters
}

const getMovieQuery = req => {
  let identifier = req.params.id
  const whereData = {}

  if (identifier == Number(identifier)) {
    whereData.id = Number(identifier)
  } else {
    whereData.title = identifier
  }

  return whereData
}

module.exports = {
  createMovieQuery,
  findManyQuery,
  getMovieQuery
}
