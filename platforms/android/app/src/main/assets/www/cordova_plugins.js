cordova.define('cordova/plugin_list', function(require, exports, module) {
  module.exports = [
    {
      "id": "phonegap-plugin-speech-synthesis.SpeechSynthesis",
      "file": "plugins/phonegap-plugin-speech-synthesis/www/SpeechSynthesis.js",
      "pluginId": "phonegap-plugin-speech-synthesis",
      "clobbers": [
        "window.speechSynthesis"
      ]
    },
    {
      "id": "phonegap-plugin-speech-synthesis.SpeechSynthesisUtterance",
      "file": "plugins/phonegap-plugin-speech-synthesis/www/SpeechSynthesisUtterance.js",
      "pluginId": "phonegap-plugin-speech-synthesis",
      "clobbers": [
        "SpeechSynthesisUtterance"
      ]
    },
    {
      "id": "phonegap-plugin-speech-synthesis.SpeechSynthesisEvent",
      "file": "plugins/phonegap-plugin-speech-synthesis/www/SpeechSynthesisEvent.js",
      "pluginId": "phonegap-plugin-speech-synthesis",
      "clobbers": [
        "SpeechSynthesisEvent"
      ]
    },
    {
      "id": "phonegap-plugin-speech-synthesis.SpeechSynthesisVoice",
      "file": "plugins/phonegap-plugin-speech-synthesis/www/SpeechSynthesisVoice.js",
      "pluginId": "phonegap-plugin-speech-synthesis",
      "clobbers": [
        "SpeechSynthesisVoice"
      ]
    },
    {
      "id": "phonegap-plugin-speech-synthesis.SpeechSynthesisVoiceList",
      "file": "plugins/phonegap-plugin-speech-synthesis/www/SpeechSynthesisVoiceList.js",
      "pluginId": "phonegap-plugin-speech-synthesis",
      "clobbers": [
        "SpeechSynthesisVoiceList"
      ]
    },
    {
      "id": "cordovarduino.Serial",
      "file": "plugins/cordovarduino/www/serial.js",
      "pluginId": "cordovarduino",
      "clobbers": [
        "window.serial"
      ]
    },
    {
      "id": "cordova-plugin-mqtt.MQTTEmitter",
      "file": "plugins/cordova-plugin-mqtt/www/MQTTEmitter.js",
      "pluginId": "cordova-plugin-mqtt",
      "clobbers": [
        "ME"
      ]
    },
    {
      "id": "cordova-plugin-mqtt.CordovaMqTTPlugin",
      "file": "plugins/cordova-plugin-mqtt/www/cordova-plugin-mqtt.js",
      "pluginId": "cordova-plugin-mqtt",
      "clobbers": [
        "cordova.plugins.CordovaMqTTPlugin"
      ]
    }
  ];
  module.exports.metadata = {
    "cordova-plugin-whitelist": "1.3.4",
    "phonegap-plugin-speech-synthesis": "0.1.1",
    "cordovarduino": "0.0.10",
    "cordova-plugin-mqtt": "0.3.8"
  };
});