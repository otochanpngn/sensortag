var polling_interval = 100; //ms | NOTE: Interval for polling in periodic

var SensorTag = require('../../node_modules/sensortag');
var async = require('../../node_modules/async');

var moment = require('../../node_modules/moment');

var fs = require('fs');
require('../../node_modules/date-utils');

var USE_READ = true;

var fileName = "test/"

/*
var sensortag_id = ["c4:be:84:00:00:72:8d:0e",
                    "c4:be:84:00:00:72:5a:0a",
                    "c4:be:84:00:00:72:63:8e",
                    "c4:be:84:00:00:70:c9:84",
                    "a0:e6:f8:00:00:af:61:81",
                    "b0:b4:48:00:00:ed:81:06",
                    "68:c9:0b:00:00:05:21:81",
                    "a0:e6:f8:00:00:af:69:84"];
*/

var dt = new Date();
var formatted = dt.toFormat("YYYY/MM/DD/HH24:MI:SS:") + moment().milliseconds();
console.log(formatted);
//fs.appendFile("c4:be:84:00:00:72:8d:0e.csv", formatted + "," + "加速度x,加速度y,加速度z,ジャイロx,ジャイロy,ジャイロz,磁気x,磁気y,磁気z,\n");
fs.appendFile(fileName + "c4:be:84:00:00:72:5a:0a.csv", formatted + "," + "加速度x,加速度y,加速度z,ジャイロx,ジャイロy,ジャイロz,磁気x,磁気y,磁気z,\n");
fs.appendFile(fileName + "c4:be:84:00:00:72:63:8e.csv", formatted + "," + "加速度x,加速度y,加速度z,ジャイロx,ジャイロy,ジャイロz,磁気x,磁気y,磁気z,\n");
fs.appendFile(fileName + "c4:be:84:00:00:70:c9:84.csv", formatted + "," + "加速度x,加速度y,加速度z,ジャイロx,ジャイロy,ジャイロz,磁気x,磁気y,磁気z,\n");
fs.appendFile(fileName + "a0:e6:f8:00:00:af:61:81.csv", formatted + "," + "加速度x,加速度y,加速度z,ジャイロx,ジャイロy,ジャイロz,磁気x,磁気y,磁気z,\n");
fs.appendFile(fileName + "b0:b4:48:00:00:ed:81:06.csv", formatted + "," + "加速度x,加速度y,加速度z,ジャイロx,ジャイロy,ジャイロz,磁気x,磁気y,磁気z,\n");
//fs.appendFile("68:c9:0b:00:00:05:21:81.csv", formatted + "," + "加速度x,加速度y,加速度z,ジャイロx,ジャイロy,ジャイロz,磁気x,磁気y,磁気z,\n");
fs.appendFile(fileName + "a0:e6:f8:00:00:af:69:84.csv", formatted + "," + "加速度x,加速度y,加速度z,ジャイロx,ジャイロy,ジャイロz,磁気x,磁気y,磁気z,\n");

/*
fs.appendFile("c4:be:84:00:00:72:8d:0e.csv", formatted + "," + "加速度x,加速度y,加速度z,ジャイロx,ジャイロy,ジャイロz,磁気x,磁気y,磁気z,\n");
fs.appendFile("c4:be:84:00:00:72:5a:0a.csv", formatted + "," + "加速度x,加速度y,加速度z,ジャイロx,ジャイロy,ジャイロz,磁気x,磁気y,磁気z,\n");
fs.appendFile("c4:be:84:00:00:72:63:8e.csv", formatted + "," + "加速度x,加速度y,加速度z,ジャイロx,ジャイロy,ジャイロz,磁気x,磁気y,磁気z,\n");
fs.appendFile("c4:be:84:00:00:70:c9:84.csv", formatted + "," + "加速度x,加速度y,加速度z,ジャイロx,ジャイロy,ジャイロz,磁気x,磁気y,磁気z,\n");
fs.appendFile("a0:e6:f8:00:00:af:61:81.csv", formatted + "," + "加速度x,加速度y,加速度z,ジャイロx,ジャイロy,ジャイロz,磁気x,磁気y,磁気z,\n");
fs.appendFile("b0:b4:48:00:00:ed:81:06.csv", formatted + "," + "加速度x,加速度y,加速度z,ジャイロx,ジャイロy,ジャイロz,磁気x,磁気y,磁気z,\n");
fs.appendFile("68:c9:0b:00:00:05:21:81.csv", formatted + "," + "加速度x,加速度y,加速度z,ジャイロx,ジャイロy,ジャイロz,磁気x,磁気y,磁気z,\n");
fs.appendFile("a0:e6:f8:00:00:af:69:84.csv", formatted + "," + "加速度x,加速度y,加速度z,ジャイロx,ジャイロy,ジャイロz,磁気x,磁気y,磁気z,\n");
*/

var device_timers = {}; // NOTE: Storage for setinterval objects

var onDiscover = function(sensorTag) {
	sensorTag.once('disconnect', function() {
		clearInterval(device_timers[sensorTag.id]);
		delete(device_timers[sensorTag.id]);
		console.info(sensorTag.id, 'disconnected');
	});

	async.series({
		connectAndSetUp: function(next) {
			console.info(sensorTag.id, 'discovered');
			sensorTag.connectAndSetUp(function() {
				SensorTag.discover(onDiscover); // NOTE: resume for discover other devices
				next();
			});
		},
		enableSensors: function(next) {
			sensorTag.enableAccelerometer();
      sensorTag.enableGyroscope();
      sensorTag.enableMagnetometer();
			sensorTag.notifySimpleKey();
      sensorTag.setAccelerometerPeriod(1);
      sensorTag.setGyroscopePeriod(1);
      sensorTag.setMagnetometerPeriod(1);
			console.info(sensorTag.id, 'ready');
			next();
		},
	}, function() {
			// NOTE: In case of polling in periodic
			device_timers[sensorTag.id] = setInterval(function() {
				async.parallel({
					Info: function(next) {
						var info = {id: sensorTag.id, type: sensorTag.type};
						sensorTag._peripheral.updateRssi(function(error, rssi) {
							info.rssi = rssi;
						});
						next(null, info);
					},
					Accelerometer: function(next) {
						sensorTag.readAccelerometer(function(error, acc_x, acc_y, acc_z) {
							next(null, {acc_x: acc_x, acc_y: acc_y, acc_z: acc_z});
						});
					},
          Gyroscope: function(next) {
            sensorTag.readGyroscope(function(error, gyr_x, gyr_y, gyr_z) {
              next(null, {gyr_x: gyr_x, gyr_y: gyr_y, gyr_z: gyr_z});
            });
          },
          Magnetometer: function(next) {
            sensorTag.readMagnetometer(function(error, mag_x, mag_y, mag_z) {
              next(null, {mag_x: mag_x, mag_y: mag_y, mag_z: mag_z});
            });
          },
				}, function(err, data) {
					//console.log(JSON.stringify(data));
          console.log(data.Info.id);
          dt = new Date();
          formatted = dt.toFormat("YYYY/MM/DD/HH24:MI:SS:") + moment().milliseconds();
          if(data.Info.id == "d7dd6df38066447c85721aa1150fce03"){
            fs.appendFile(fileName + "68:c9:0b:00:00:05:21:81.csv",
                            formatted + "," +
                            data.Accelerometer.acc_x + "," +
                            data.Accelerometer.acc_y + "," +
                            data.Accelerometer.acc_z + "," +
                            data.Gyroscope.gyr_x + "," +
                            data.Gyroscope.gyr_y + "," +
                            data.Gyroscope.gyr_z + "," +
                            data.Magnetometer.mag_x + "," +
                            data.Magnetometer.mag_y + "," +
                            data.Magnetometer.mag_z + "," +
                            "\n");
          }
          if(data.Info.id == "04dab04b3644433a8347889fd4f3a73a"){
            fs.appendFile(fileName + "c4:be:84:00:00:72:8d:0e.csv",
                            formatted + "," +
                            data.Accelerometer.acc_x + "," +
                            data.Accelerometer.acc_y + "," +
                            data.Accelerometer.acc_z + "," +
                            data.Gyroscope.gyr_x + "," +
                            data.Gyroscope.gyr_y + "," +
                            data.Gyroscope.gyr_z + "," +
                            data.Magnetometer.mag_x + "," +
                            data.Magnetometer.mag_y + "," +
                            data.Magnetometer.mag_z + "," +
                            "\n");
          }
          if(data.Info.id == "bcca022a5f7a4264b3984ceb3311cca0"){
            fs.appendFile(fileName + "c4:be:84:00:00:72:63:8e.csv",
                            formatted + "," +
                            data.Accelerometer.acc_x + "," +
                            data.Accelerometer.acc_y + "," +
                            data.Accelerometer.acc_z + "," +
                            data.Gyroscope.gyr_x + "," +
                            data.Gyroscope.gyr_y + "," +
                            data.Gyroscope.gyr_z + "," +
                            data.Magnetometer.mag_x + "," +
                            data.Magnetometer.mag_y + "," +
                            data.Magnetometer.mag_z + "," +
                            "\n");
          }
          if(data.Info.id == "96060e34f07e4cf8a1cbed35bee42392"){
            fs.appendFile(fileName + "b0:b4:48:00:00:ed:81:06.csv",
                            formatted + "," +
                            data.Accelerometer.acc_x + "," +
                            data.Accelerometer.acc_y + "," +
                            data.Accelerometer.acc_z + "," +
                            data.Gyroscope.gyr_x + "," +
                            data.Gyroscope.gyr_y + "," +
                            data.Gyroscope.gyr_z + "," +
                            data.Magnetometer.mag_x + "," +
                            data.Magnetometer.mag_y + "," +
                            data.Magnetometer.mag_z + "," +
                            "\n");
          }
          if(data.Info.id == "298fa783bbd144f6946c627f0cfad536"){
            fs.appendFile(fileName + "a0:e6:f8:00:00:af:69:84.csv",
                            formatted + "," +
                            data.Accelerometer.acc_x + "," +
                            data.Accelerometer.acc_y + "," +
                            data.Accelerometer.acc_z + "," +
                            data.Gyroscope.gyr_x + "," +
                            data.Gyroscope.gyr_y + "," +
                            data.Gyroscope.gyr_z + "," +
                            data.Magnetometer.mag_x + "," +
                            data.Magnetometer.mag_y + "," +
                            data.Magnetometer.mag_z + "," +
                            "\n");
          }
          if(data.Info.id == "33b6c573fe564c6298165a91b25ad96c"){
            fs.appendFile(fileName + "a0:e6:f8:00:00:af:61:81.csv",
                            formatted + "," +
                            data.Accelerometer.acc_x + "," +
                            data.Accelerometer.acc_y + "," +
                            data.Accelerometer.acc_z + "," +
                            data.Gyroscope.gyr_x + "," +
                            data.Gyroscope.gyr_y + "," +
                            data.Gyroscope.gyr_z + "," +
                            data.Magnetometer.mag_x + "," +
                            data.Magnetometer.mag_y + "," +
                            data.Magnetometer.mag_z + "," +
                            "\n");
          }
          if(data.Info.id == "9c7da4ad48b346b3933efbe1f961c8a8"){
            fs.appendFile(fileName + "c4:be:84:00:00:70:c9:84.csv",
                            formatted + "," +
                            data.Accelerometer.acc_x + "," +
                            data.Accelerometer.acc_y + "," +
                            data.Accelerometer.acc_z + "," +
                            data.Gyroscope.gyr_x + "," +
                            data.Gyroscope.gyr_y + "," +
                            data.Gyroscope.gyr_z + "," +
                            data.Magnetometer.mag_x + "," +
                            data.Magnetometer.mag_y + "," +
                            data.Magnetometer.mag_z + "," +
                            "\n");
          }
          if(data.Info.id == "b4dd6ff63f4e4ba1b9862dfda47ca470"){
            fs.appendFile(fileName + "c4:be:84:00:00:72:5a:0a.csv",
                            formatted + "," +
                            data.Accelerometer.acc_x + "," +
                            data.Accelerometer.acc_y + "," +
                            data.Accelerometer.acc_z + "," +
                            data.Gyroscope.gyr_x + "," +
                            data.Gyroscope.gyr_y + "," +
                            data.Gyroscope.gyr_z + "," +
                            data.Magnetometer.mag_x + "," +
                            data.Magnetometer.mag_y + "," +
                            data.Magnetometer.mag_z + "," +
                            "\n");
          }
				});
			}, polling_interval);
			// NOTE: In case of listening for notification
			sensorTag.on('simpleKeyChange', function(left, right) {
				var data = {Info: {id: sensorTag.id}, SimpleKey: {left: left, right: right}};
				console.log(JSON.stringify(data));
			});
		}
	);
};

console.info('start');
SensorTag.discover(onDiscover);
