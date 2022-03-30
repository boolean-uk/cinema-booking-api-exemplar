const prisma = require('../utils/prisma');

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
    getAllMovies
}