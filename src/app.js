// resources
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

// app-level middleware --------------
const app = express();
app.use(morgan('dev'));
app.use(express.json());
app.use(cors())

// Routes
const Authors = require('./models/authors');
const authors = new Authors();
const Categories = require('./models/categories');
const categories = new Categories();

function getModel (req, res, next) {
    const model = req.params.model
    switch (model) {
        case 'authors':
            req.model = authors;
            console.log('req.model',req.model)
            next();
            break
        case 'categories':
            req.model = categories;
            next();
            break;
        default:
            throw new Error('Invalid route');
    }
}

//bring modelrouter function in here
const {
    handleGetAll, 
    handleGetOne,
    handlePost,
    handlePut,
    handleDelete} = require('./api/modelrouter')

// get the route 
app.param('model', getModel);
// handle the route
app.get('/:model', handleGetAll);
app.get('/:model/:id', handleGetOne);
app.post('/:model', handlePost);
app.put('/:model/:id', handlePut);
app.delete('/:model/:id', handleDelete);

app.get('t', (req, res) => {
    throw new Error('500 error');
})

app.get('/this_route_will_error', (req, res) => {
    throw new Error('Yo this is an error');
})

// Error Catch-alls
const {
    notFoundHandler, 
    internalServerErrorHandler} = require('./middlewares/errorHandlers.js')
app.use(notFoundHandler);
app.use(internalServerErrorHandler);

let isRunning = false;

module.exports = {
    server: app,
    start: function (port) {
        if (!isRunning) {
            isRunning = true;
            app.listen(port);
            console.log(``)
        } else {
            console.error('Server is already running!')
        }
    }
}