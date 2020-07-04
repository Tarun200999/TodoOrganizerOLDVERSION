import { Mongo } from 'meteor/mongo';
import { Tracker } from 'meteor/tracker'; 
export const Tasks= new Mongo.Collection('tasks');// collections is made global to everyone
export const Todo= new Mongo.Collection('todo');//collections to store the todos name
export const Network= new Mongo.Collection('networks');