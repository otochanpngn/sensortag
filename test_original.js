var util = require('../../node_modules/util');

var async = require('../../node_modules/async');

var SensorTag = require('../../node_modules/sensortag/index');

var fs = require('fs');
require('../../node_modules/date-utils');

var USE_READ = true;

var sensortag_id = ["c4:be:84:00:00:70:c9:84",
                    "c4:be:84:00:00:72:63:8e",
                    "c4:be:84:00:00:72:15:0e",
                    "68:c9:0b:00:00:05:21:81",
                    "c4:be:84:00:00:72:5a:0a",
                    "c4:be:84:00:00:72:8d:0e"];

var dt = new Date();
var formatted = dt.toFormat("YYYY/MM/DD/HH24:MI:SS");
console.log(formatted);
fs.appendFile("c4:be:84:00:00:70:c9:84.csv", formatted + "," + "加速度x,加速度y,加速度z,ジャイロx,ジャイロy,ジャイロz,\n");
fs.appendFile("c4:be:84:00:00:72:63:8e.csv", formatted + "," + "加速度x,加速度y,加速度z,ジャイロx,ジャイロy,ジャイロz,\n");
fs.appendFile("c4:be:84:00:00:72:15:0e.csv", formatted + "," + "加速度x,加速度y,加速度z,ジャイロx,ジャイロy,ジャイロz,\n");
fs.appendFile("68:c9:0b:00:00:05:21:81.csv", formatted + "," + "加速度x,加速度y,加速度z,ジャイロx,ジャイロy,ジャイロz,\n");
fs.appendFile("c4:be:84:00:00:72:5a:0a.csv", formatted + "," + "加速度x,加速度y,加速度z,ジャイロx,ジャイロy,ジャイロz,\n");
fs.appendFile("c4:be:84:00:00:72:8d:0e.csv", formatted + "," + "加速度x,加速度y,加速度z,ジャイロx,ジャイロy,ジャイロz,\n");

SensorTag.discoverById("04dab04b3644433a8347889fd4f3a73a", function(sensorTag) {
  console.log('discovered: ' + sensorTag);

  sensorTag.on('disconnect', function() {
    console.log('disconnected!');
    process.exit(0);
  });
  console.log("connectAndSetup");
  sensorTag.connectAndSetUp(function(){
    console.log("enableAccelerometer");
    sensorTag.enableAccelerometer(function(){
      console.log("enableGyroscope");
      sensorTag.enableGyroscope(function(){

        setInterval(function(){
          async.series([
            function(callback) {
              setTimeout(callback, 1000);
            },
            function(callback){
              //console.log("readAccelerometer");
              sensorTag.readSystemId(function(error,systemId){
                sensorTag.readAccelerometer(function(error, x, y, z){
                  sensorTag.readGyroscope(function(error, gx, gy, gz){

                    for(i = 0; i < sensortag_id.length;){

                      if(systemId == sensortag_id[i]){

                        dt = new Date();
                        formatted = dt.toFormat("YYYY/MM/DD/HH24:MI:SS");
                        //console.log(formatted);
                        console.log('system id = ' + systemId);
                        //console.log("%dG", x.toFixed(1));
                        //console.log("%dG", y.toFixed(1));
                        //console.log("%dG", z.toFixed(1));
                        //console.log("%d°/s", gx.toFixed(1));
                        //console.log("%d°/s", gy.toFixed(1));
                        //console.log("%d°/s", gz.toFixed(1));

                        var acc_x = x.toFixed(1);
                        var acc_y = y.toFixed(1);
                        var acc_z = z.toFixed(1);
                        //console.log(x.toFixed(1) + "," +
                        //            y.toFixed(1) + "," +
                        //            z.toFixed(1))

                        var acc_x_id = sensortag_id[i] + "_x";
                        var acc_y_id = sensortag_id[i] + "_y";
                        var acc_z_id = sensortag_id[i] + "_z";

                        fs.appendFile(sensortag_id[i] + ".csv",
                                        formatted + "," +
                                        x.toFixed(1) +  "," +
                                        y.toFixed(1) +  "," +
                                        z.toFixed(1) +  "," +
                                        gx.toFixed(1) +  "," +
                                        gy.toFixed(1) +  "," +
                                        gz.toFixed(1) +  "," +
                                        "\n");
                      }
                      i++;
                    }

                    callback();

                  });
                });
              });
            }
          ]);
        }, 1000);

      })

    });
  });
});
