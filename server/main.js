import { Meteor } from 'meteor/meteor';
import { Tasks } from "/lib/collection.js";
import { Todo } from "/lib/collection.js";
import { Network } from "/lib/collection.js";
Meteor.startup(function()
{
	
  // code to run on server at startup
}
);

Meteor.methods({
     addtask : function(task,todo_id,description,user_id)
     {    
     	 Tasks.insert({
            task: task,
            createdAt: new Date(),
            description:description,
            createdBy:user_id,
            createdOn:todo_id
        });
     },
     removetask : function(task_id)
     { 
       Tasks.remove(task_id);
     },
     addtodo :function(title,description)
     {
     	Todo.insert({
     		title:title,
     		description:description,
     		todoBy:Meteor.user()._id
     		});
     }
     ,
     removetodo: function(todo_id)
     {
     	Todo.remove(todo_id);
     	Network.remove({todo_id:todo_id});
     },
     addnetwork : function(todo_id,curr_id,network_id)
     {
         console.log(todo_id);
     	 Network.insert({
            todo_id:todo_id,
            createdOn: new Date(),
            curr_id:curr_id,
            network_id:network_id
        });
     },
     removetodo_fromnetwork :function(network_id)
     {
     	Network.remove({_id:network_id});
     }

});
// methods are used to secure the site 


