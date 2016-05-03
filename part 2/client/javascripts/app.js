/* jshint browser: true, jquery: true, curly: true, eqeqeq: true, forin: true, immed: true, indent: 4, latedef: true, newcap: true, nonew: true, quotmark: double, undef: true, unused: true, strict: true, trailing: true*/
/* globals io,ko */
"use strict";

function TodoViewModel() {
    var scope = this;
    scope.active = ko.observable("New");
    scope.activeClass = {};
    scope.activeClass.New = ko.observable("active");
    scope.activeClass.Old = ko.observable("");
    scope.activeClass.Tags = ko.observable("");
    scope.activeClass.Add = ko.observable("");
    scope.todos = ko.observableArray([]);
    scope.todoTags = ko.observableArray([]);
    
    scope.inputDescription = ko.observable("");
    scope.inputTags = ko.observable("");
    

    function initialize(){
        var tags = [];

        scope.todos().forEach(function (toDo) {
            toDo.tags.forEach(function (tag) {
                if (tags.indexOf(tag) === -1) {
                    tags.push(tag);
                }
            });
        });
        console.log(tags);
        
        var tagObjects = tags.map(function (tag) {
            var toDosWithTag = [];
            scope.todos().forEach(function (toDo) {
                if (toDo.tags.indexOf(tag) !== -1) {
                    toDosWithTag.push(toDo.description);
                }
            });
            return { "name": tag, "toDos": toDosWithTag };
        });
        
        console.log(tagObjects);
        scope.todoTags(tagObjects);
    }
    $.getJSON("todos.json", function (toDoObjects) {
        scope.todos(toDoObjects);
        initialize();
    });
    
    function setActiveClass(tab){
        scope.activeClass.New("");
        scope.activeClass.Old("");
        scope.activeClass.Tags("");
        scope.activeClass.Add("");
        if(tab === "Tags"){
            //computeTagsView();
        }
        switch (tab){
            case "New": scope.activeClass.New("active"); break;
            case "Old": scope.activeClass.Old("active"); break;
            case "Tags": scope.activeClass.Tags("active"); break;
            case "Add": scope.activeClass.Add("active"); break;
        }
    }
    
    scope.changetab = function(tab){
        scope.active(tab);
        setActiveClass(tab);
    };
    var socket = io();
    scope.addTodo = function(){
         var description = scope.inputDescription(),
            tags = scope.inputTags().split(","),
            newToDo = { "description": description, "tags":tags};
        if(description !== "" && tags[0] !== ""){
            socket.emit("newtodo", newToDo);
            scope.inputDescription("");
            scope.inputTags("");
        }else{
            window.alert("Please add description and tags separated by comma.");
        }
    };
    
    /***************************************** */
    socket.on("newtodo", function(newToDo){
        //toDoObjects.push(newToDo);
        scope.todos.push(newToDo);
        initialize();
    });
}

ko.applyBindings(new TodoViewModel());
