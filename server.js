var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

app.use(express.static(__dirname + '/angular/dist'));

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, './static')));
app.set('views', path.join(__dirname, './views'));
mongoose.connect('mongodb://localhost/Restful');

const TaskSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: {type: String, required:true},
    completed: { type: Boolean, default: false }
}, {timestamps: {createdAt:"created_at", updatedAt:"updated_at"}});
const Task = mongoose.model('tesk', TaskSchema);

// company page
app.get('/', function(req,res){
    Task.find({}, function(err,task){
        res.json({tasks:task});
    });
});

// create
app.post('/tasks', function(req,res){
    Task.create(req.body, function(err, task) {
        if (err) {
            res.json({ error: task.errors });
        }
        else {
            res.json({task:task});
        }
    })
})

// show
app.get('/tasks/:id', function(req,res){
    Task.find({_id: req.params.id}, function(err,task){
        res.json({task:task})
    })
})

// update
app.put('/tasks/:id', function(req,res){
    Task.findByIdAndUpdate({ _id: req.params.id }, req.body, function (err, task){
        if (err) {
            res.json({ error: task.errors });
        }
        else {
            res.json({ task: task });
        }    
    })
})

//delete
app.delete('/tasks/:id',function(req,res){
    Task.findByIdAndRemove({ _id: req.params.id }, function (err) {

    })
    res.json();
})

var server = app.listen(8000, function () {
    console.log("listening on port 8000");
})