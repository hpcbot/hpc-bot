/* Test for lib/chat.js */

var assert = require('chai').assert;
var sinon = require('sinon');

var EventEmitter = require('events');
var eventbus = new EventEmitter;	// Temporary event bus to prevent events firing across files

var Chat = require('.');

// Defaults that do not change
var self;
var sortinghat;

describe('Chat parser', function() {
	beforeEach(function() {
		Chat.start({events: eventbus, whitelist: ['bdickason']});

		self = false;
		sortinghat = {
			name: 'sortinghat',
			type: 'chat',
			whitelist: false,
			event: 'house:set'
		};
	});
	describe('Adding Commands', function() {

	});
	describe('input from Twitch', function() {
		beforeEach(function() {

		})
		it('Ignores a command without an exclamation mark', function() {
			var channel = "#harrypotterclan";
			var userstate = {};
			var message = "sortinghat";
			var type = 'chat';

			var count = 0;	// How many times was the event called?
			var spy = sinon.spy();

			Chat.add(sortinghat);

			eventbus.once('house:set', spy);

			eventbus.emit('chat:parse', userstate, message, type,self);
			sinon.assert.notCalled(spy);
		});
		it('Processes a proper command', function(done) {
			var userstate = {
				username: 'bdickason'
			};
			var message = "!sortinghat";
			var type = 'chat';

			var _username = "bdickason";
			var _parameters = null;

			Chat.add(sortinghat);

			eventbus.once('house:set', function(username, parameters) {
				assert.equal(username, _username);
				assert.equal(parameters, _parameters);
				done();
			});

			eventbus.emit('chat:parse', userstate, message, type, self);
		});

		it('Ignores case on a command', function(done) {
			var userstate = {
				username: 'bdickason'
			};
			var message = "!SorTingHat";
			var type = 'chat';
			var self=false;

			var _username = 'bdickason';
			var _parameters = null;

			Chat.add(sortinghat);

			eventbus.once('house:set', function(username, parameters) {
				assert.equal(username, _username);
				assert.equal(parameters, _parameters);
				done();
			});

			eventbus.emit('chat:parse', userstate, message, type, self);
		});

		it('Accepts parameters after the command', function(done) {
			var userstate = {
				username: 'bdickason'
			};
			var message = "!house teamalea";
			var type = 'chat';
			var self=false;

			var _username = 'bdickason';
			var _parameters = 'teamalea';

			// Setup the command
			var house = {
				name: 'house',
				type: 'chat',
				whitelist: false,
				event: 'house:get'
			};
			Chat.add(house);

			eventbus.once('house:get', function(username, parameters) {
				assert.equal(username, _username);
				assert.equal(parameters, _parameters);
				done();
			});

			eventbus.emit('chat:parse', userstate, message, type, self);
		});

		it('Whisper: Accepts a whitelisted whisper from Twitch', function(done) {
			var userstate = {
				username: 'bdickason'
			};
			var message = '!setcommends 53'
			var type = 'whisper';
			var self = false;

			var _username = 'bdickason';
			var _parameters = '53'

			// Setup the command
			var setcommends = {
				name: 'setcommends',
				type: 'whisper',
				whitelist: true,
				event: 'commends:set'
			};
			Chat.add(setcommends);

			eventbus.once('commends:set', function(username, parameters) {
				assert.equal(_username, username);
				assert.equal(setcommends.type, type);
				assert.equal(_parameters, parameters);
				done();
			});


			eventbus.emit('chat:parse', userstate, message, type, self);
		});

		it('Whisper: Rejects a non-whitelisted whisper from Twitch', function(done) {
			var userstate = {
				username: 'randomUser'
			};
			var message = '!setcommends 53'
			var type = 'whisper';
			var self = false;

			var _username = 'randomUser';
			var _parameters = '53'

			// Setup the command
			var setcommends = {
				name: 'setcommends',
				type: 'whisper',
				whitelist: true,
				event: 'commends:set'
			};
			Chat.add(setcommends);

			var spy = sinon.spy();
			eventbus.once('commends:set', spy);

			eventbus.emit('chat:parse', userstate, message, type, self);
			sinon.assert.notCalled(spy);

			done();
		});
	});

	describe('Utility Functions', function() {
		describe('isMod', function() {
			it('Returns true if user is whitelisted', function() {
				var username = 'bdickason';
				var _mod = true;

				var mod = Chat.isMod(username);
				assert.equal(mod, _mod);
			});
			it('Returns false if user is not whitelisted', function() {
				var username = 'randoMcRanderson';
				var _mod = false;

				var mod = Chat.isMod(username);
				assert.equal(mod, _mod);
			});
		});
	});
});
