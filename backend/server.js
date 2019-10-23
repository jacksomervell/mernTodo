const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const todoRoutes = express.Router();
const PORT = 4000;
const axios = require('axios')
var request = require('request');
var https = require('https');
https.post = require('https-post');
var cookieParser = require('cookie-parser');

let Todo = require('./todo.model');

app.use(cors());
app.use(bodyParser.json());
// app.use(cookieParser());

// mongoose.connect('mongodb://127.0.0.1:27017/todos', { useNewUrlParser: true });
// const connection = mongoose.connection;

// connection.once('open', function() {
//     console.log("MongoDB database connection established successfully");
// })



todoRoutes.route('/fish/:leagueId').get(function(req, res) {



    const url = 'https://users.premierleague.com/accounts/login/';

    function getHttpsCookies() {
        https.post(url, {
            redirect_uri: 'https://fantasy.premierleague.com/a/login',
            app: 'plfpl-web',
            login: 'jacksomervell@gmail.com',
            password: 'Littlederek12'
        }, function(result) {
            let cookie = result.headers['set-cookie'][0];
            console.log(cookie);
                axios.get('https://fantasy.premierleague.com/api/leagues-classic/' + req.params.leagueId + '/standings/', {
                    headers: {
                        Cookie: cookie
                    }
                }).then((response) => {
                    res.json(response.data);
                })
            }
        )}

    getHttpsCookies();

});

todoRoutes.route('/:id').get(function(req, res) {
    let id = req.params.id;
    Todo.findById(id, function(err, todo) {
        res.json('todo');
    });
});

todoRoutes.route('/update/:id').post(function(req, res) {
    Todo.findById(req.params.id, function(err, todo) {
        if (!todo)
            res.status(404).send("data is not found");
        else
            todo.todo_description = req.body.todo_description;
            todo.todo_responsible = req.body.todo_responsible;
            todo.todo_priority = req.body.todo_priority;
            todo.todo_completed = req.body.todo_completed;

            todo.save().then(todo => {
                res.json('Todo updated!');
            })
            .catch(err => {
                res.status(400).send("Update not possible");
            });
    });
});

todoRoutes.route('/add').post(function(req, res) {
    let todo = new Todo(req.body);
    todo.save()
        .then(todo => {
            res.status(200).json({'todo': 'todo added successfully'});
        })
        .catch(err => {
            res.status(400).send('adding new todo failed');
        });
});



app.use('/todos', todoRoutes);

app.listen(process.env.PORT || 4000, function() {
    console.log("Server is running on Port: " + PORT);
});