const Joi = require('joi');
const express = require('express');
const app = express();

app.use(express.json());

// list of genres
const genres =
[
    { id: 1, name: 'genre1' },
    { id: 2, name: 'genre2' },
    { id: 3, name: 'genre3' },
];

// get all genres
app.get('/api/genres', (req, res) => 
{
    res.send(genres);
});

// get specific genre
app.get('/api/genres/:id', (req, res) =>
{
    const genre = checkGenreExists(req.params.id, res);

    res.send(genre);

});

// create new genre and add to list
app.post('/api/genres', (req, res) =>
{
    checkValidationError(req.body, res);

    const genre =
    {
        id: genres.length + 1,
        name: req.body.name
    };

    genres.push(genre);
    res.send(genre);
});

// update existing genre
app.put('/api/genres/:id', (req, res) =>
{
    const genre = checkGenreExists(req.params.id, res);

    checkValidationError();

    genre.name = req.body.name;

    res.send(genre);
});

// delete existing genre
app.delete('/api/genres/:id', (req, res) =>
{
    const genre = checkGenreExists(req.params.id, res);

    const index = genres.indexOf(genre);
    genres.splice(index, 1);

    res.send(genre);
});

// check if genre exists
function checkGenreExists(reqParamsId, res)
{
    const genre = genres.find(g => g.id === parseInt(reqParamsId));

    if (!genre)
    {
        return res.status(404).send('The genre with the given id was not found');
    }
    
    else return genre;
}

// validate input is correct
function validateGenre(genre)
{
    const schema =
    {
        name: Joi.string().min(3).required()
    };

    return Joi.validate(genre, schema);
}

// check if error on validation
function checkValidationError(reqBody, res)
{
    const { error } = validateGenre(reqBody);

    if (error)
    {
        return res.status(400).send(error.detail);
    }
}

const port = process.env.port || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));