/* App.js - Main app file for hpc-bot */

require('dotenv').config();	// Load environment variables from .env

var eventbus = require('./lib/eventbus'); // Global event bus that modules can pub/sub to

// Initialize Twitch connection
var tmi = require("tmi.js");	// Initialize tmi.js here so we can inject it during testing
var config = require("./lib/twitch/config/tmi-options.js");
var twitchClient = new tmi.client(config.options);
twitchClient.connect();

var Twitch = require('./lib/twitch');
var twitch = Twitch.start(eventbus, twitchClient, config.options.channels[0]);

var Chat = require ('./lib/chat');
var chat = Chat.start(eventbus);

var Commands = require ('./lib/commands');
var commands = Commands.start(eventbus);

// Load Models
var db = require('./lib/db');
db.connect();

var User = require('./lib/models/user');
var user = User.start(eventbus, db);


// Load Command Modules
var Rules = require('./lib/commands/rules');
var rules = Rules.start(eventbus);

var House = require('./lib/commands/house');
var house = House.start(eventbus, db);

var Join = require('./lib/commands/join');
var join = Join.start(eventbus, db);

var Commends = require('./lib/commands/commends');
var commends = Commends.start(eventbus, db);