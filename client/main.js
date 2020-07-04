import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Tasks } from "/lib/collection.js";
import { Todo } from "/lib/collection.js";
import { Network } from "/lib/collection.js";
import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import './main.html';
import 'bootstrap/dist/css/bootstrap.css';
import "bootstrap";
window.Tasks = Tasks
window.Todo=Todo
window.Network=Network
Router.configure({
	layoutTemplate: 'ApplicationLayout'
});
Router.route('/', function () {
	if(!Meteor.user())
	  {	
        this.render('homepage',{
  	     to:"1"
        });
      }
      else
    {
    
     this.render('navbar',{
  	to:"1"
     });
     this.render('add_todo_form',{
  	   to:"2"
     });
     	
    }
    
    
  });
Router.route('/showtodo', function () 
{
	  this.render('navbar',{
  	to:"1"
     });
     
     	this.render('add_todo_form',{
  	   to:"2"
     });
     	this.render('showtodo',{
  	   to:"3"
     });
});
Router.route('/showtodo/addtask/:_id', function () 
{
	  this.render('navbar',{
  	   to:"1"
         });
     
     	this.render('add_todo_form',{
  	   to:"2"
         });
     	this.render('showtodo',{
  	   to:"3"
         });
});    
Router.route('/showtodo/networks', function () 
{    
	  this.render('navbar',{
  	   to:"1"
         });
     
     	this.render('add_todo_form',{
  	   to:"2"
         });
     	this.render('showtodo',{
  	   to:"3"
         });
     	this.render('network_collections',{
  	   to:"4"
         });
});    
Accounts.ui.config({
  passwordSignupFields: 'USERNAME_ONLY'
});
//this is used to configer the user login form

Template.showtodo.helpers({
	todo: function () {

		return Todo.find({todoBy:Meteor.user()._id});
	
	},
	item: function () {

		return Tasks.find({createdOn:Session.get("currtodoid")},{sort:{createdAt:-1}});
	
	},
	 networksname : function()
	 {
	 	return Network.find({todo_id:Session.get("todoidofperson")});
	 },
	 getnetwork_useranme :function(user_id)
	 {
	 	return Meteor.users.findOne({_id:user_id}).username;
	 },
	 checkTheuser_showtodo:function(user_id)
	 {  
	 	if(user_id==Meteor.user()._id)
	 		return "you";
	 	else
	 	{
	 		return Meteor.users.findOne({_id:user_id}).username;
	 	}
	 	
	 }

	
});
Template.network_collections.helpers({
	network: function(){
         return Network.find({network_id:Meteor.user()._id});
	},
	getTodo: function(todo_id,user_id)
	{
       Session.set("network_todo",todo_id);
       //Session.set("network_id",user_id);
	},
	todo:function()
	{   
		return Todo.find({_id:Session.get("network_todo")});
	},
	getusername:function(user_id)
	{   
		return Meteor.users.findOne({_id:user_id}).username;
	},
	gettitle:function(todo_id)
	{   
		return Todo.findOne({_id:todo_id}).title;
	}
	,
	getdescription:function(todo_id)
	{
		return Todo.findOne({_id:todo_id}).description;
	},
	item : function()
	{
		return Tasks.find({createdOn:Session.get("currtodoid_network")},{sort:{createdAt:-1}});

	},
	checkTheuser:function(user_id)
	{
		if(user_id==Meteor.user()._id)
			return "you";
		else
			return Meteor.users.findOne({_id:user_id}).username;
	}


});
Template.network_collections.events({
	'click .js_addtask_button_network':function(event)
	  {  
	  	 Session.set("currtodoid_network",Network.findOne({_id:this._id}).todo_id);
	  	 Session.set("currid_network",Network.findOne({_id:this._id}).curr_id);
         $("#modal_add_task_network").modal('show');
        },
        'click .remove_todo_from_network':function(){
			Meteor.call("removetodo_fromnetwork",this._id);
			
		    return false;
	     },
	     'submit .add_task_network': function(event)
	       {   if(Meteor.user())
		     {   var curr=Session.get("currtodoid_network");
			     var task=event.target.task_title.value;
			     var description=event.target.task_description.value;
			     var user_id=Meteor.user()._id;
                 if(task.length==0)
        	       alert("Invalid Entry");
                 else
                 { 
        	       Meteor.call("addtask",task,curr,description,user_id);
                   event.target.task_title.value="";
                   event.target.task_description.value="";
                 }
		      }
		else
		{
			alert("Login/SignUp to inset task");
		}
       
        return false;
	}
});

// it is used to send the data to the items template

Template.navbar.helpers({
	username: function () {
		if(Meteor.user())
			{   
				return Meteor.user().username;
			}
			else
			{
				return "anonamous user";
			}
	}
});

Template.showtodo.events({
	'click .remove':function(){
			Meteor.call("removetodo",this._id);

		    return false;
	},
	'click .js_addtask_button':function(event){
		Session.set("currtodoid",this._id);
      $("#modal_add_task").modal('show');
        }
    ,
    'submit .js_remove-task_from_todo':function(event)
    {  
    	Meteor.call("removetask",this._id);
       return false;
    },
    'click .js_showtodo_network_delete':function(event)
    {  
       Meteor.call("removetodo_fromnetwork",this._id);
       return false;
    },

    'click .js_addnetwork_button':function(event){
    	Session.set("todoidofperson",this._id);
      $("#modal_add_network").modal('show');
        }
     ,
    'submit .add-task': function(event)
	{   if(Meteor.user())
		{   var curr=Session.get("currtodoid");
			var task=event.target.task_title.value;
			var description=event.target.task_description.value;
			var user_id=Meteor.user()._id;
            if(task.length==0)
        	alert("Invalid Entry");
            else
            { 
        	  Meteor.call("addtask",task,curr,description,user_id);
              event.target.task_title.value="";
              event.target.task_description.value="";


            }
		}
		else
		{
			alert("Login/SignUp to inset task");
		}
       
        return false;
	},
	'submit .add_network': function(event)
	{   if(Meteor.user())
		{   var todo_id=Session.get("todoidofperson");
            console.log(todo_id);
			var user_name=event.target.network_user_name.value;
            if(user_name.length==0)
            {
        	   alert("Invalid Entry");
            }
            else
            { 
        	  if(!Meteor.users.findOne({username:user_name}))
        	    {
        	  	  alert("user not found man");
        	    }
        	  	else
        	  	{
        	  	  var user_id_found=Meteor.users.findOne({username:user_name})._id;
        	  	   if(Network.findOne({todo_id:todo_id,network_id:user_id_found}))
        	  	       alert("this person is already added");
        	  	   else
        	  	   {  if(user_id_found==Meteor.user()._id)
        	  	   	    alert("you can'nt add yourself");
        	  	   	  else
        	  	   	  {  
        	  	 	  Meteor.call('addnetwork',todo_id,Meteor.user()._id,user_id_found);
                      
                      }
        	  	   }   	
        	    }
                
            }
		}
		else
		{
			alert("Login/SignUp to inset task");
		}
       event.target.network_user_name.value="";
        return false;
	}


});

Template.taskdisplay.events({
	'click .remove':function(){
			Meteor.call("removetask",this._id);
		    return false;
	}
	
});


Template.add_todo_form.events({
    
	'submit .js_addtodo_button':function(event){
      $("#modal_add_todo").modal('show');
        return false;
        },
	

   'submit .save_todo':function(event){ 
      if(Meteor.user())
		{   console.log("your todo is added");
			var title=event.target.todo_title.value;
			var description=event.target.todo_description.value;
			if(Todo.findOne({title:title}))
			   alert("Todo title exits");
			else
			{
               if(title.length==0)
        	      alert("Invalid Entry");
               else
               {
        	     Meteor.call("addtodo",title,description);
                 event.target.todo_title.value="";
                 event.target.todo_description.value="";
               }
		    }
		}    
		else
		{
			alert("Login/SignUp to inset task");
		}
        $("#modal_add_todo").modal('hide');
       
        return false;
    }
});

