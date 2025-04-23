const debug = require('debug')(require('path').basename(__filename));

const Yeelight = require('yeelight2');
const dgram = require('dgram');

var Address_MGR = require('../../Util/Address_MGR.js');
var address_mgr = new Address_MGR();

var Device_MGR = require('../../Util/Device_MGR.js');
var device_mgr = new Device_MGR();

function mapDeviceType(light_model)
{
    let device_Type = null;

    switch (light_model) {
        // 🟠 色溫燈（白光或暖白，無 RGB）
        case "mono":
        case "ceiling":
        case "ceiling1":
        case "ceiling10":
        case "ceiling15":
        case "ceiling20":
        case "ceiling4":
        case "ceiling13":
        case "ceiling18":
        case "ceiling19":
        case "ceiling23":
        case "ceiling28":
        case "bslamp1":
        case "ceiling25":
        case "ceiling26":
        case "ceiling30":
        case "ceiling39":
        case "bslamp2":
            device_Type = "Color Temperature Light";
            break;
    
        // 🌈 彩光燈（RGB + 色溫）
        case "color":
        case "color4":
        case "color6":
        case "stripe":
        case "lamp1":
        case "bslamp":
        case "desklamp":
        case "colorc":
        case "colorc2":
        case "lamp15":
        case "strip1":
        case "stripe1":
        case "stripe2":
        case "ceiling21":
        case "ceiling22":
        case "ceiling23":
        case "ceiling40":
            device_Type = "Extended Color Light";
            break;
    }

    return device_Type;
}

function mapDeviceName(light_model) {
    let device_Name = null;

    switch (light_model) {
        // 🏡 Ceiling Lights
        case "mono":
            device_Name = "Yeelight Ceiling Light (White)"; break;
        case "ceiling1":
            device_Name = "Yeelight Ceiling Light"; break;
        case "ceiling2":
            device_Name = "Yeelight Ceiling Light - Youth Version"; break;
        case "ceiling3":
            device_Name = "Yeelight Ceiling Light (Jiaoyue 450)"; break;
        case "ceiling4":
            device_Name = "Yeelight Ceiling Light (Jiaoyue 650)"; break;
        case "ceiling10":
            device_Name = "Yeelight Meteorite Pendant Light"; break;
        case "ceiling15":
        case "ceiling19":
        case "ceiling20":
        case "ceiling24":
        case "ceiling26":
            device_Name = "Yeelight LED Ceiling Light"; break;
        case "ceila":
            device_Name = "Yeelight Ceiling Light - Updated HomeKit 23W"; break;
        case "ceilc":
            device_Name = "Yeelight Ceiling Light"; break;

        // 💡 Bulbs
        case "mono1":
            device_Name = "Yeelight LED Bulb (White)"; break;
        case "mono5":
            device_Name = "Yeelight Filament Bulb (White)"; break;
        case "color1":
            device_Name = "Yeelight LED Bulb (Color)"; break;
        case "color2":
            device_Name = "Yeelight LED Bulb (Color) - 2nd Generation"; break;
        case "color4":
            device_Name = "Yeelight LED Bulb 1S (Color)"; break;
        case "color5":
            device_Name = "Xiaomi Mi Smart LED Bulb Essential (White and Color) - EU"; break;
        case "color6":
            device_Name = "Yeelight LED Bulb Google (Color)"; break;
        case "colorc":
            device_Name = "Yeelight GU10 W1 (Color)"; break;
        case "ct_bulb":
        case "ct2":
            device_Name = "Yeelight Color Temperature Bulb"; break;

        // 🌈 Light Strips
        case "strip1":
        case "strip2":
        case "strip4":
        case "strip6":
            device_Name = "Yeelight Lightstrip (Color)"; break;

        // 🔦 Lamps
        case "lamp1":
            device_Name = "Xiaomi Mijia Smart LED Desk Lamp"; break;
        case "lamp3":
            device_Name = "Yeelight Serene Eye-Friendly Desk Lamp"; break;
        case "lamp4":
            device_Name = "Yeelight Desk Lamp"; break;
        case "lamp15":
            device_Name = "Yeelight LED Screen Light Bar Pro"; break;

        // 🛏️ Bedside Lamps
        case "bslamp1":
            device_Name = "Xiaomi Mijia Bedside Lamp"; break;
        case "bslamp2":
            device_Name = "Xiaomi Mijia Bedside Lamp II"; break;
        case "bslamp3":
            device_Name = "Xiaomi Mijia Bedside Lamp III"; break;
    }

    return device_Name;
}

function discoverViaUDP(timeoutMs = 3000) {
    return new Promise((resolve) => {
        const discoveredDevices = new Map();
        const socket = dgram.createSocket('udp4');

        const message = Buffer.from(
            'M-SEARCH * HTTP/1.1\r\n' +
            'HOST: 239.255.255.250:1982\r\n' +
            'MAN: "ssdp:discover"\r\n' +
            'ST: wifi_bulb\r\n'
        );

        socket.on('message', (msg, rinfo) => {
            const data = msg.toString();
            const lines = data.split('\r\n');
            const result = {};
            lines.forEach(line => {
                const [key, ...rest] = line.split(':');
                if (key && rest.length > 0) {
                    result[key.trim().toLowerCase()] = rest.join(':').trim();
                }
            });

            const id = result['id'] || rinfo.address;
            if (!discoveredDevices.has(id)) {
                let model = result['model'];
                let name = mapDeviceName(model);
                let support = result['support'];
                let location = result['location'];
                if(name==null){return;}
                discoveredDevices.set(id, {
                    id,
                    ip: rinfo.address,
                    port: rinfo.port,
                    name: name,
                    model: model,
                    support: support,
                    location: location,
                });
            }
        });

        socket.bind(() => {
            socket.setBroadcast(true);
            socket.setMulticastTTL(2);
            socket.send(message, 0, message.length, 1982, '239.255.255.250');
        });

        setTimeout(() => {
            socket.close();
            resolve([...discoveredDevices.values()]);
        }, timeoutMs);
    });
}

async function fetchViaUDP(ip, timeoutMs = 3000) {
    const device = await new Promise((resolve) => {
        const socket = dgram.createSocket('udp4');
        let resolved = false;

        const message = Buffer.from(
            'M-SEARCH * HTTP/1.1\r\n' +
            'HOST: 239.255.255.250:1982\r\n' +
            'MAN: "ssdp:discover"\r\n' +
            'ST: wifi_bulb\r\n'
        );

        socket.on('message', (msg, rinfo) => {
            if (rinfo.address !== ip) return;

            const data = msg.toString();
            const lines = data.split('\r\n');
            const result = {};
            lines.forEach(line => {
                const [key, ...rest] = line.split(':');
                if (key && rest.length > 0) {
                    result[key.trim().toLowerCase()] = rest.join(':').trim();
                }
            });
            
            if (result.id && !resolved) {
                resolved = true;
                socket.close();

                const locationPort = result.location?.includes(':') ? parseInt(new URL(result.location).port) : 55443;
                resolve({
                    id: result.id,
                    model: result.model,
                    support: result.support,
                    ip: rinfo.address,
                    port: locationPort,
                    location: result.location,
                });
            }
        });

        socket.bind(() => {
            socket.setBroadcast(true);
            socket.setMulticastTTL(2);

            // ✅ 對單一 IP 發送（unicast）
            socket.send(message, 0, message.length, 1982, ip);
        });

        setTimeout(() => {
            if (!resolved) {
                socket.close();
                resolve(null);
            }
        }, 3000);
    });
    return device;
}

const Yeelight_Device_API = function () {
    const self = this;

    self.Discover_Nearby_Yeelight = async function (username) {
        try {
            let discoveryResults = await discoverViaUDP(5000);
            return {
                num_of_yeelight: discoveryResults.length,
                discovered_yeelight_list: discoveryResults
            };
        } catch (e) {
            debug("[Yeelight_Device_API] Discover_Yeelight_Device Error", e);
        }
    };

    self.Link_To_Yeelight_Device = async function (username, ip) {
        try {
            let device = await fetchViaUDP(ip, 1000);

            if (!device) return false;

            const light_model = device.model || "Unknown";
            const device_ID = device.id.replace(/^0x/i, '');
    
            if (light_model === "Unknown") {
                device.destroy(); // 斷開連線
                return false;
            }
    
            let device_Type = mapDeviceType(light_model);
            if(device_Type==null)
            {
                return false;
            }
            let device_Name = mapDeviceName(light_model);
            if(device_Name==null)
            {
                return false;
            }

            const yeelight_new_dev_info = {
                device_Name: device_Name,
                network_Type: "TCP/IP",
                protocol_Type: "Yeelight API Tunnel",
                device_Type: device_Type,
                model: light_model,
                ip_address: ip,
                port: device.port
            };

            if(!await device_mgr.Save_Device_Info("Yeelight", username, device_ID, yeelight_new_dev_info))
            {
                return false;
            }
    
            return await device_mgr.Save_Device_Info(device_Type, username, device_ID, yeelight_new_dev_info);
        } catch (e) {
            debug("[Yeelight_Device_API] Link_To_Yeelight_Device Error", e);
        }
    };

    self.Rename_Yeelight_Device = async function (username, device_ID, new_name) {
        try {
            if(!await device_mgr.Device_Change_Name("Yeelight", username, device_ID, new_name))
            {
                return false;
            }
            if(await device_mgr.Is_Exist("Extended Color Light", username, device_ID))
            {
                return await device_mgr.Device_Change_Name("Extended Color Light", username, device_ID, new_name);
            }
            if(await device_mgr.Is_Exist("Dimmable Light", username, device_ID))
            {
                return await device_mgr.Device_Change_Name("Dimmable Light", username, device_ID, new_name);
            }
            return false;
        } catch (e) {
            debug("[Yeelight_Device_API] Rename_Yeelight_Device Error", e);
        }
    };

    self.Remove_Yeelight_Device = async function (username, device_ID) {
        try {
            if(!await device_mgr.Remove_Device("Yeelight", username, device_ID, new_name))
            {
                return false;
            }
            if(await device_mgr.Is_Exist("Extended Color Light", username, device_ID))
            {
                return await device_mgr.Remove_Device("Extended Color Light", username, device_ID, new_name);
            }
            if(await device_mgr.Is_Exist("Dimmable Light", username, device_ID))
            {
                return await device_mgr.Remove_Device("Dimmable Light", username, device_ID, new_name);
            }
            return false;
        } catch (e) {
            debug("[Yeelight_Device_API] Remove_Yeelight_Device Error", e);
        }
    };

    self.Get_Yeelight_Device_Session = async function (device_ID) {
        try {
            var address_inf = await address_mgr.Read_Address_Info(device_ID);
            if (!address_inf) return null;

            let device_Info = await device_mgr.Read_Device_Inf("Yeelight", null, device_ID);
            if(!device_Info)
            {
                return null;
            }
        
            const device = new Yeelight("yeelight://"+address_inf.ip_address, address_inf.port);
        
            // 等待連線與初始化
            await new Promise((resolve, reject) => {
                device.once('connect', resolve);
                device.once('error', reject);
            });

            // 執行 sync 等待裝置回傳資訊
            await device.sync();

            device["device_Type"] = device_Info.device_Type;

            return device;
        } catch (e) {
            debug("[Yeelight_Device_API] Get_Yeelight_Device_Session Error", e);
        }
    };
};

module.exports = Yeelight_Device_API;
