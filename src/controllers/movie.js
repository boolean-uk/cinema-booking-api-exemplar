const prisma = require('../utils/prisma');

const createMovie = async (req, res) => {
    // req 2.1 - Build a route to create a new movie
    // const { title, runtimeMins } = req.body;
    // const createdMovie = await prisma.movie.create({
    //     data: {
    //         title,
    //         runtimeMins
    //     }
    // });

    // req 2.2 - Include the ability to create screenings for the movie if the request body has a `screenings` property
    const { title, runtimeMins, screenings } = req.body;
    const data = {
        title,
        runtimeMins
    };

    if (screenings) {
        data.screenings = {
            create: screenings.map(screening => ({...screening, startsAt: new Date(screening.startsAt)}))
        }
    }

    const createdMovie = await prisma.movie.create({
        data,
        include: {
            screenings: true
        }
    });

    // for req 2.3 - Send back an error message if a movie with the same name already exists in the database
    // You'd do something like .findMany({ where: { title: req.body.title }})
    // and if it gives you a result, res.json an error back

    res.json({ data: createdMovie });
}

const getAllMovies = async (req, res) => {
    // req 1.1 - Build a route to retrieve a list of every movie
    // const allMovies = await prisma.movie.findMany();

    // req 1.2 - Include the available screenings for each movie in the response
    // const allMovies = await prisma.movie.findMany({
    //     include: {
    //         screenings: true
    //     }
    // });

    // req 1.3 - Add the ability to filter movies by runtime (in minutes), both less than and greater than a value provided in a query
    const prismaQuery = {
        where: buildWhereClause(req.query),
        include: {
            screenings: true
        }
    }

    const allMovies = await prisma.movie.findMany(prismaQuery);

    res.json({ data: allMovies })
}

const buildWhereClause = (query) => {
    const clause = {};
    const { runtimeMinsLt, runtimeMinsGt } = query;

    if (runtimeMinsLt && runtimeMinsGt) {
        clause.AND = [
            {
                runtimeMins: {
                    gt: +runtimeMinsGt
                }
            },
            {
                runtimeMins: {
                    lt: +runtimeMinsLt
                }
            }
        ]

        return clause;
    }

    if (runtimeMinsGt) {
        clause.runtimeMins = {
            gt: +runtimeMinsGt
        }

        return clause;
    }

    if (runtimeMinsLt) {
        clause.runtimeMins = {
            lt: +runtimeMinsLt
        }

        return clause;
    }

    return clause;
}

module.exports = {
    getAllMovies,
    createMovie
}