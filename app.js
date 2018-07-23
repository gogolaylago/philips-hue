'use strict';

let rest = require('restler');
let express = require('express');
let bodyParser = require('body-parser');

let app = express();
app.use(bodyParser.json({type: 'application/json'}));

let ip = '10.0.1.3';
let usertoken = 'gRaNY9iLnJxw-3cimxO9WmP5cYGXEdInAzszNDVP';
let url = `http://${ip}/api/${usertoken}/lights/2/state`;

let turnOn = (hue,timeout) =>{
	console.log('Turning on lights');
	return new Promise((resolve,reject) => {
		let data = {"on":true, "sat":254, "bri":254,"hue":hue};

		rest.putJson(url,data)
		.on('complete', (result)=> {
		  if (result instanceof Error) {
		    console.log('Error:', result.message);
		    this.retry(5000); // try again after 5 sec
		  } else {
		    console.log(result);
		    setTimeout(()=>{
		    	resolve();
		    },timeout);
		  }
		});
	});
}

let turnOff = (timeout) =>{
	console.log('Turning off lights');
	return new Promise((resolve,reject) => {
		let data = {"on":false};

		rest.putJson(url,data)
		.on('complete', (result)=> {
		  if (result instanceof Error) {
		    console.log('Error:', result.message);
		    this.retry(5000); // try again after 5 sec
		  } else {
		    console.log(result);
		    setTimeout(()=>{
		    	resolve();
		    },timeout);
		  }
		});
	});
}


app.get('/start', function (req, res) {
  start();
  res.send('Light show!');
});


app.get('/lights/:color/:duration', function (req, res) {
	let color = Number(req.params.color),
		duration = Number(req.params.duration);

	turnOn(color,duration)
	.then(()=>{
		if(duration!=0){
			return turnOff(0);
		}		
	})

  	res.send('OK');	
});



if (module === require.main) {
  // [START server]
  // Start the server
  let server = app.listen(process.env.PORT || 4000, function () {
    let port = server.address().port;
    console.log('App listening on port %s', port);
  });
  // [END server]
}


let start = () =>{
	turnOn(10000,1000)
	.then(()=>{
		return turnOn(20000,1000);
	})
	.then(()=>{
		return turnOn(30000,1000);
	})
	.then(()=>{
		return turnOff(3000);
	})

}

start();