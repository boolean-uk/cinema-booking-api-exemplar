const prisma = require('../utils/prisma');
const {
  createMovieQuery,
  findManyQuery,
  getMovieQuery
} = require('../movies/queries.js')

const getMovies = async (req, res) => {
    const runtimeMinsFilters = findManyQuery({...req})

    const movies = await prisma.movie.findMany({
        where: runtimeMinsFilters,
        include: {
            screenings: true
        }
    })

    res.json({ data: movies });
}

const createMovie = async (req, res)=> {
    const movieData = createMovieQuery({...req})

    try {
      const movie = await prisma.movie.create({ data: movieData })
      res.json({ data: movie });
    } catch (e) {
      return res.status(400).json({ error: e.message })
    }
}

const getMovie = async (req, res) => {
  const whereData = getMovieQuery({...req})

  try {
    const movie = await prisma.movie.findUnique({
      where: whereData,
      rejectOnNotFound: true
    })
    res.json({ data: movie });
  } catch (e) {
    res.status(404).json({ error: e.message });
  }
}

module.exports = {
    getMovies,
    createMovie,
    getMovie
};
