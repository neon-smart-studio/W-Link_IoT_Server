
var debug = require('debug')(require('path').basename(__filename));

const os = require('os');
const defaultGateway = require('default-gateway');

var IP_Address = function (){
    var self = this;
    
    self.Get_Mac_Address = function()
    {
        try{
            const networkInterfaces = os.networkInterfaces();
        
            for (const name in networkInterfaces) {
                const networkInterface = networkInterfaces[name];
        
                for (const subInterfaceName in networkInterface) {
                    const subInterface = networkInterface[subInterfaceName];
        
                    if (subInterface.family == 'IPv4' && subInterface.internal == false) {
                        debug(`Found mac address ${subInterface.mac}`);
                        return subInterface.mac;
                    }
                }
            }
        
            throw 'No mac address found';
        }
        catch(e)
        {
            debug("[IP_Address] Get_Mac_Address() Error: " + e);
        }
    }
    
    self.Get_IP_Address = function()
    {
        try{
            const networkInterfaces = os.networkInterfaces();
        
            for (const name in networkInterfaces) {
                const networkInterface = networkInterfaces[name];
        
                for (const subInterfaceName in networkInterface) {
                    const subInterface = networkInterface[subInterfaceName];
        
                    if (subInterface.family == 'IPv4' && subInterface.internal == false) {
                        debug(`Found ip address ${subInterface.address}`);
                        return subInterface.address;
                    }
                }
            }
        
            throw 'No ip address found';
        }
        catch(e)
        {
            debug("[IP_Address] Get_IP_Address() Error: " + e);
        }
    }
    
    self.Get_IP_Netmask = function()
    {
        try{
            const networkInterfaces = os.networkInterfaces();
        
            for (const name in networkInterfaces) {
                const networkInterface = networkInterfaces[name];
        
                for (const subInterfaceName in networkInterface) {
                    const subInterface = networkInterface[subInterfaceName];
        
                    if (subInterface.family == 'IPv4' && subInterface.internal == false) {
                        debug(`Found ip netmask ${subInterface.netmask}`);
                        return subInterface.netmask;
                    }
                }
            }
        
            throw 'No ip netmask found';
        }
        catch(e)
        {
            debug("[IP_Address] Get_IP_Netmask() Error: " + e);
        }
    }
    
    self.Get_IP_Default_Gateway = function()
    {
        try{
            const {gateway, interface} = defaultGateway.v4.sync();

            return gateway;
        }
        catch(e)
        {
            debug("[IP_Address] Get_IP_Default_Gateway() Error: " + e);
        }
    }
    
    self.Get_IP_Info = function()
    {
        try{
            const networkInterfaces = os.networkInterfaces();
        
            for (const name in networkInterfaces) {
                const networkInterface = networkInterfaces[name];
        
                for (const subInterfaceName in networkInterface) {
                    const subInterface = networkInterface[subInterfaceName];
        
                    if (subInterface.family == 'IPv4' && subInterface.internal == false) {
                        debug(`Found ip info ${subInterface.address}`);
                        return subInterface;
                    }
                }
            }
        
            throw 'No ip info found';
        }
        catch(e)
        {
            debug("[IP_Address] Get_IP_Info() Error: " + e);
        }
    }
    
}
module.exports = IP_Address;
