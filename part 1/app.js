/*globals ko*/
"use strict";
function CommentsViewModel() {
    var scope = this;
    
    scope.comment = ko.observable("");
    scope.comments = ko.observableArray([
        { title : "first comment"},
        { title : "second comment"}
    ]);
    
    scope.addComment = function () {
        scope.comments.push({ title : scope.comment() });
        scope.comment("");
    };
}


ko.applyBindings(new CommentsViewModel());
