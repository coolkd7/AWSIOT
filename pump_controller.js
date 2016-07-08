var fs = require('fs');

const thingShadow = require('../thing/');

var thingShadows = thingShadow({
	keyPath: '',
	certPath: '',
	caPath:'',
	clientId: 'pump1',
	region: '',
	host: ''
});

function setGpio(value) {
 console.log("Set GPIO="+value);
}

function getGpio(){
	return process.argv[2];
}

var clientTokenUpdate;
var myCallbacks = { };

var initialPumpState = getGpio();

console.log("Pump is " + initialPumpState);

var pumpState = {"state":{"reported":{"pump_mode":initialPumpState}}};
console.log(JSON.stringify(pumpState));

thingShadows.on('connect',function(){
	var clientToken;


thingShadows.register('pump1');

setTimeout(function(){
	clientToken = thingShadows.update('pump1',pumpState);
},2000);
});



thingShadows.on('status',
	function(thingName, stat, clientToken, stateObject) {
		console.log('recieved '+stat+' on '+thingName+': '+
					JSON.stringify(stateObject));
});

thingShadows.on('delta',
	function(thingName, stateObject) {
		console.log('recieve delta '+' on '+thingName+': '+
					JSON.stringify(stateObject));
		if(stateObject.state.pump_mode === "ON") {
			console.log("~~~~~~~~changing Mode ----> ON~~~~~");
			setGpio(1);
		setTimeout(function(){
			clientToken = thingShadows.update('pump1',{"state":{"reported":{"pump_mode":"ON"}}});
		}, 1000);
		} else if(stateObject.state.pump_mode === "OFF") {
			console.log("~~~~~CHANGING MODE ----> OFF ~~~~~");
			setGpio(0);
			setTimeout(function() {
				clientToken = thingShadows.update('pump1',{"state":{"reported":{"pump_mode":"OFF"}}});
			}, 1000);
		}
	});
thingShadows.on('timeout',
	function(thingName, clientToken) {
		console.log('receive timeout'+' on '+thingName+': '+
					clientToken);
	});
