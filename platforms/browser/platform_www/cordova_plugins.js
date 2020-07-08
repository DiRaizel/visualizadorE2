cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "file": "plugins/cordovarduino/www/serial.js",
        "id": "cordovarduino.Serial",
        "pluginId": "cordovarduino",
        "clobbers": [
            "window.serial"
        ]
    },
    {
        "file": "plugins/cordova-plugin-mqtt/www/MQTTEmitter.js",
        "id": "cordova-plugin-mqtt.MQTTEmitter",
        "pluginId": "cordova-plugin-mqtt",
        "clobbers": [
            "ME"
        ]
    },
    {
        "file": "plugins/cordova-plugin-mqtt/www/cordova-plugin-mqtt.js",
        "id": "cordova-plugin-mqtt.CordovaMqTTPlugin",
        "pluginId": "cordova-plugin-mqtt",
        "clobbers": [
            "cordova.plugins.CordovaMqTTPlugin"
        ]
    }
];
module.exports.metadata = 
// TOP OF METADATA
{
    "cordova-plugin-whitelist": "1.3.4",
    "phonegap-plugin-speech-synthesis": "0.1.1",
    "cordovarduino": "0.0.10",
    "cordova-plugin-mqtt": "0.3.8"
}
// BOTTOM OF METADATA
});