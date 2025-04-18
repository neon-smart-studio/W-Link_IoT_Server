
var debug = require('debug')(require('path').basename(__filename));

const dgram = require("dgram");

var twinkly_discover_device_timeout_timer = null;

var Twinkly_Discover_API = function () {
    var self = this;

    self.Discover_New_Twinkly_Light_Device = async function (discover_duration) {
        try {
            if(discover_duration>=60000)
            {
                discover_duration = 60000;
            }

            var discover_results = [];

            const do_discover = function(){
                return new Promise(function(resolve, reject) {
                    let socket = dgram.createSocket("udp4");
                    this.socket = socket;

                    socket.on("message", (message, info) => {
                        if (message[4]==79 && message[5]==75) {
                            let address = info.address;
                            let name = message.subarray(6).toString();
                            
                            discover_results.push({
                                name: name,
                                ip_address: address
                            });
                        }
                    });

                    socket.on("listening", () => {
                        debug("Broadcasting to find devices...");

                        socket.setBroadcast(true);
                        
                        let message = Buffer.from("\x01discover");

                        socket.send(message, 0, message.length, 5555, "255.255.255.255");

                        twinkly_discover_device_timeout_timer = setTimeout(()=>{
                            socket.close();
                            resolve();
                        }, discover_duration);
                    });

                    socket.on("error", err => {
                        debug(`Discovery error: ${err}`);
                        socket.close();

                        clearTimeout(twinkly_discover_device_timeout_timer);

                        resolve();
                    });

                    socket.bind();
                });
            }
            
            await do_discover();

            return discover_results;
        }
        catch (e) {
            debug("[Twinkly_Discover_API] Discover_New_Twinkly_Light_Device() Error " + e);
        }
    };
}

module.exports = Twinkly_Discover_API;