//-----------------------------Reloj en vivo------------------------------------
var reloj = '';
var reloj2 = '';
//
function show5() {
    if (!document.layers && !document.all && !document.getElementById)
        return;

    var Digital = new Date();
    var hours = Digital.getHours();
    var minutes = Digital.getMinutes();
    var seconds = Digital.getSeconds();

    var dn = "PM";
    if (hours < 12)
        dn = "AM";
    if (hours > 12)
        hours = hours - 12;
    if (hours == 0)
        hours = 12;

    if (hours <= 9)
        hours = "0" + hours;
    if (minutes <= 9)
        minutes = "0" + minutes;
    if (seconds <= 9)
        seconds = "0" + seconds;
    //change font size here to your desire
//    myclock = hours + ":" + minutes + ":" + seconds + " " + dn;
    myclock = hours + ":" + minutes + " " + dn;
    myclock2 = hours + ":" + minutes + ':' + seconds;
    if (document.layers) {
        document.layers.liveclock.document.write(myclock);
        document.layers.liveclock.document.close();
    } else if (document.all) {
        reloj = myclock;
        reloj2 = myclock2;
    } else if (document.getElementById) {
        reloj = myclock;
        reloj2 = myclock2;
        setTimeout("show5()", 1000);
    }
}

//
var app = new Framework7({
    // App root element
    root: '#appVisualizadorE2',
    // App Name
    name: 'appVisualizadorE2',
    // App id
    id: 'com.appVisualizadorE2',
    // Enable swipe panel
    panel: {
        swipe: 'left'
    },
    // Add default routes
    routes: [
        {
            path: '/home/',
            url: 'index.html'
        }
    ]
});

//
var $$ = Dom7;

//
var mainView = app.views.create('.view-main');

//
var arrayT = [];
var urlServer = '';

//
document.addEventListener('deviceready', function () {
    //
    show5();
    //
    voz('', 0);
    //
    if (localStorage.ipServidor === undefined) {
        //
        app.dialog.prompt('', 'Ip Servidor?', function (ip) {
            //
            localStorage.ipServidor = ip;
            urlServer = 'http://' + ip + '/visualizadorE2Php/';
            fechaHora();
            cargarCodigoAzules();
            cargarLlamados();
        });
    } else {
        //
        urlServer = 'http://' + localStorage.ipServidor + '/visualizadorE2Php/';
        fechaHora();
        cargarCodigoAzules();
        cargarLlamados();
    }
    //
    if (localStorage.codigosAzules !== undefined) {
        //
        cargarTablaCodigosAzules();
    }
    //
    serial.requestPermission(successS, error);
    //
    for (var i = 0; i < 5; i++) {
        //
        document.getElementById("modulo" + i).style.fontSize = '6.5vh';
        document.getElementById("cliente" + i).style.fontSize = '6.5vh';
        document.getElementById("hora" + i).style.fontSize = '6.5vh';
    }
    //
    document.getElementById("fecha").style.fontSize = '3.5vh';
    document.getElementById("hora").style.fontSize = '3.5vh';
    //
//    cordova.plugins.CordovaMqTTPlugin.connect({
//        url: 'tcp://165.227.89.32', //a public broker used for testing purposes only. Try using a self hosted broker for production.
//        port: '1883',
//        clientId: 'com.appVisualizadorE2',
//        willTopicConfig: {
//            qos: 0, //default is 0
//            retain: false, //default is true
//            topic: "appVisualizadorE2/prueba",
//            payload: ""
//        },
//        username: "fabian",
//        password: '1234',
//        success: function (s) {
//            subscribirse();
//        },
//        error: function (e) {
////            console.log('error: ' + e);
//        },
//        onConnectionLost: function (e) {
////            console.log('conexion perdida: ' + e);
//        }
//    });
    //
    actualizarTurnos();
    actualizarArrayCiclico();
});

function fechaHora() {
    //
    setInterval(function () {
        //
        app.request.post(urlServer + 'read/fechaHora', {},
                function (rsp) {
                    //
                    var data = JSON.parse(rsp);
                    //
                    $$('#fecha').html(data.fecha);
                    $$('#hora').html(data.hora);
                    $$('#fecha').css('font-weight', 'bold');
                    $$('#hora').css('font-weight', 'bold');
                    $$('#fecha').css('color', '#5B5B5A');
                    $$('#hora').css('color', '#5B5B5A');
                });
    }, 5000);
}

//
function editarIpServidor() {
    //
    app.dialog.prompt('', 'Ip servidor', function (ip) {
        //
        localStorage.ipServidor = ip;
        urlServer = 'http://' + ip + '/visualizadorE2Php/';
        cargarCodigoAzules();
        cargarLlamados();
    });
}

//
var controlCA = false;

//
function actualizarArrayTurnos(str, str2, str3, str4, str5, str6, str7) {
    //
    if (str4 > 100) {
        //
        controlCA = true;
        //
        if (arrayCodigosAzules.length > 0) {
            //
            let found = arrayCodigosAzules.find(element => element.codigo === str4);
            //
            if (found === "undefined" || found === undefined) {
                //
            } else {
                //
                arrayCodigosAzules.find((element) => {
                    //
                    if (element.codigo === str4) {
                        //
                        actualizarArrayTurnos('Cod. Azul', element.descripcion, str3, 0, str5, str6, str4);
                    }
                });
            }
        }
    } else {
        //
        guardarLlamado(str, str2, str3, str4);
        //
        if (str3 === 0) {
            //
            for (var i = 0; i < arrayT.length; i++) {
                //
                if (arrayT[i]['modulo'] === str && arrayT[i]['tipo'] === str2) {
                    //
                    if (str !== 'Cod. Azul') {
                        //
                        guardarLlamadoR(str4, str5, str6);
                        //
                    } else if (str === 'Cod. Azul') {
                        //
                        guardarLlamadoR(str7, str5, str6);
                    }
                    //
                    arrayT.splice(i, 1);
                }
            }
        } else {
            //
            var controlJ = 1;
            //
            if (arrayT.length > 0) {
                //
                var j = -1;
                var h = '';
                //
                for (var i = 0; i < arrayT.length; i++) {
                    //
                    if (arrayT[i]['modulo'] === str && arrayT[i]['tipo'] === str2) {
                        //
                        j = i;
                        h = arrayT[i]['hora'];
                        controlJ = 2;
                    }
                }
                //
                if (j !== -1) {
                    //
                    while (j >= 0) {
                        //
                        if (j === 0) {
                            //
                            arrayT[j] = {modulo: str, tipo: str2, hora: h};
                        } else {
                            //
                            arrayT[j] = arrayT[j - 1];
                        }
                        //
                        j--;
                    }
                } else {
                    //
                    var k = arrayT.length;
                    //
                    if (k > 49) {
                        //
                        k = 49;
                    }
                    //
                    while (k > 0) {
                        //
                        arrayT[k] = arrayT[k - 1];
                        //
                        k--;
                        //
                        if (k === 0) {
                            //
                            arrayT[k] = {modulo: str, tipo: str2, hora: reloj2};
                        }
                    }
                }
            } else {
                //
                arrayT[0] = {modulo: str, tipo: str2, hora: reloj2};
            }
            //
            if (controlJ === 1 && str !== 'Cod. Azul') {
                //
                guardarLlamadoR(str4, str5, str6);
                //
            } else if (controlJ === 1 && str === 'Cod. Azul') {
                //
                guardarLlamadoR(str7, str5, str6);
            }
            //
            var controlColorDiv = false;
            var controlColorDivT = 0;
            //
            if (controlCA) {
                //
                var intervaloC = setInterval(function () {
                    //
                    controlColorDivT++;
                    //
                    if (controlColorDiv) {
                        //
                        $$('#conttL').css('background', '');
                        $$('.divcontd0').css('color', '#5B5B5A');
                        $$('.flechaImagen0').attr('src', 'img/flecha azul.png');
                        //
                        controlColorDiv = false;
                    } else {
                        //
                        $$('#conttL').css('background', 'linear-gradient(to bottom, rgba(43,123,160,1) 0%, rgba(16,63,84,1) 100%)');
                        $$('.divcontd0').css('color', 'white');
                        $$('.flechaImagen0').attr('src', 'img/flecha-blanca.png');
                        //
                        controlColorDiv = true;
                    }
                    //
                    if (controlColorDivT >= 9) {
                        //
                        $$('#conttL').css('background', '');
                        $$('.divcontd0').css('color', '#5B5B5A');
                        $$('.flechaImagen0').attr('src', 'img/flecha azul.png');
                        //
                        clearInterval(intervaloC);
                        //
                        controlColorDivT = 0;
                    }
                }, 1000);
                //
                controlCA = false;
                //
                voz('Atención Código azul en ' + str2, 1);
            } else {
                //
                var intervaloC = setInterval(function () {
                    //
                    controlColorDivT++;
                    //
                    if (controlColorDiv) {
                        //
                        $$('#conttL').css('background', '');
                        $$('.divcontd0').css('color', '#5B5B5A');
                        $$('.flechaImagen0').attr('src', 'img/flecha azul.png');
                        $$('#divcontt').css('border', '2px #256e90 solid');
                        $$('.titulos').css('border-bottom', '2px #256e90 solid');
                        //
                        controlColorDiv = false;
                    } else {
                        //
                        $$('#conttL').css('background', 'linear-gradient(to bottom, rgba(156,34,46,1) 0%, rgba(156,34,46,1) 12%, rgba(221,75,86,1) 100%)');
                        $$('.divcontd0').css('color', 'white');
                        $$('.flechaImagen0').attr('src', 'img/flecha-blanca.png');
                        $$('#divcontt').css('border', '2px #c93e4a solid');
                        $$('.titulos').css('border-bottom', '2px #c93e4a solid');
                        //
                        controlColorDiv = true;
                    }
                    //
                    if (controlColorDivT >= 9) {
                        //
                        $$('#conttL').css('background', '');
                        $$('.divcontd0').css('color', '#5B5B5A');
                        $$('.flechaImagen0').attr('src', 'img/flecha azul.png');
                        $$('#divcontt').css('border', '2px #256e90 solid');
                        $$('.titulos').css('border-bottom', '2px #256e90 solid');
                        //
                        clearInterval(intervaloC);
                        //
                        controlColorDivT = 0;
                    }
                }, 1000);
                //
                var snd = document.getElementById("audio");
                snd.load();
                snd.play();
            }

        }
    }
}

//
function voz(text, volumen) {
    //
    var u = new SpeechSynthesisUtterance();
    //
    u.text = text;
    u.lang = 'es-ES';
    u.volume = volumen;
    speechSynthesis.speak(u);
}

//
function actualizarTurnos() {
    //
    setInterval(function () {
        //
        if (arrayT.length > 0) {
            //
            for (var j = 0; j < arrayT.length; j++) {
                //
                if (j < 5) {
                    //
                    $$('#modulo' + j).html(arrayT[j]['modulo']);
                    $$('#cliente' + j).html(arrayT[j]['tipo']);
                    //
                    var tiempoLlamado = '';
                    //
                    if (arrayT[j]['hora'] === reloj2) {
                        //
                        tiempoLlamado = '0s';
                    } else {
                        //
                        var hora1 = (reloj2).split(":");
                        var hora2 = (arrayT[j]['hora']).split(":");
                        var t1 = new Date();
                        var t2 = new Date();
                        //
                        t1.setHours(hora1[0], hora1[1], hora1[2]);
                        t2.setHours(hora2[0], hora2[1], hora2[2]);
                        //Aquí hago la resta
                        t1.setHours(t1.getHours() - t2.getHours(), t1.getMinutes() - t2.getMinutes(), t1.getSeconds() - t2.getSeconds());
                        //
                        tiempoLlamado = (t1.getHours() ? t1.getHours() + (t1.getHours() > 1 ? "h" : "h") : "") + (t1.getMinutes() ? " " + t1.getMinutes() + (t1.getMinutes() > 1 ? "m" : "m") : "") + (t1.getSeconds() ? (t1.getHours() || t1.getMinutes() ? " " : "") + t1.getSeconds() + (t1.getSeconds() > 1 ? "s" : "s") : "");

                    }
                    //
                    $$('#hora' + j).html(tiempoLlamado);
                }
                //
                var pos = arrayT.length;
                //
                if (pos < 5) {
                    //
                    for (var w = pos; w < 5; w++) {
                        //
                        $$('#modulo' + w).html('');
                        $$('#cliente' + w).html('');
                        $$('#hora' + w).html('');
                    }
                }
            }
        } else {
            //
            for (var i = 0; i < 5; i++) {
                //
                $$('#modulo' + i).html('');
                $$('#cliente' + i).html('');
                $$('#hora' + i).html('');
            }
        }
    }, 1000);
}

//
var controlAC = 5;
var valPos = [];

//
function actualizarArrayCiclico() {
    //
    setInterval(function () {
        //
        if (arrayT.length > controlAC) {
            //
            valPos = arrayT[controlAC];
            var k = controlAC;
            //
            while (k > 0) {
                //
                arrayT[k] = arrayT[k - 1];
                //
                k--;
                //
                if (k === 0) {
                    //
                    arrayT[k] = valPos;
                }
            }
            //
            controlAC++;
            //
            if (controlAC === arrayT.length) {
                //
                controlAC = 5;
            }
        }
    }, 10000);
}

//
function successS() {
    //
    serial.open({baudRate: 9600}, llamado, error);
}
//
function error(error) {
    //
    console.log(error);
}

//
function llamado() {
    //
    var errorCallback = function (message) {
        alert('Error: ' + message);
    };
    // register the read callback
    serial.registerReadCallback(
            function success(data) {
                // decode the received message
                var view = new Uint8Array(data);
//                var array = view.split(",");
                var str = '';
                var str2 = '';
                var str3 = '';
                var control = 0;
                var controlG = 0;
                var controlS = 0;
                var controlC = 0;
                var arrayD = [];
                //
                if (view.length >= 1) {
                    //
                    var i = 0;
                    //
                    while (i < view.length) {
                        // if we received a \n, the message is complete, display it
                        var temp_str = String.fromCharCode(view[i]);
                        var str_esc = escape(temp_str);
                        //
                        if (unescape(str_esc) == '*') {
                            //
                            if (i > 0) {
                                //
                                arrayD[controlC] = {h: str, cb: str2, s: str3};
                                //
                                controlC++;
                                //
                                control = 0;
                            }
                            //
                            str = '';
                            str2 = '';
                            str3 = '';
                            controlG = 0;
                            controlS = 0;
                            //
                            i += 2;
                        } else {
                            //
                            if (unescape(str_esc) == ',') {
                                //
                                control++;
                            }
                            //
                            if (control === 0) {
                                //
                                str += unescape(str_esc);
                                //
                            } else if (control === 1) {
                                //
                                if (controlG > 0) {
                                    //
                                    str2 += unescape(str_esc);
                                }
                                //
                                controlG++;
                            } else {
                                //
                                if (controlS > 0) {
                                    //
                                    str3 += unescape(str_esc);
                                }
                                //
                                controlS++;
                            }
                            //
                            i++;
                        }
                        //
                        if (i === view.length) {
                            //
                            arrayD[controlC] = {h: str, cb: str2, s: str3};
                        }
                    }
                }
                //
                if (arrayD.length > 0) {
                    //
                    for (var i = 0; i < arrayD.length; i++) {
                        //
                        if (arrayD[i]['h'] !== '' && arrayD[i]['cb'] !== '') {
                            //
                            var int = parseInt(arrayD[i]['h']);
                            var int2 = parseInt(arrayD[i]['cb']);
                            var h = '';
                            var cb = '';
                            var s = parseInt(arrayD[i]['s']);
                            //
                            if (int > 50) {
                                //
                                h = 'II';
                            } else {
                                //
                                h = 'Hab. ' + int;

                            }
                            //
                            if (int2 > 20 && int2 < 41) {
                                //
                                let b = int2 - 20;
                                //
                                cb = 'Baño ' + b;
                                //
                            } else if (int2 > 40 && int2 < 46) {
                                //
                                let b = int2 - 40;
                                //
                                cb = 'Baño Hombre ' + b;
                            } else if (int2 > 45 && int2 < 51) {
                                //
                                let b = int2 - 45;
                                //
                                cb = 'Baño Mujer ' + b;
                            } else {
                                //
                                cb = 'Cama ' + int2;
                            }
                            //
//                            guardarLlamadoR(int, int2, s);
                            actualizarArrayTurnos(h, cb, s, int, int2, s, 0);
                        }
                    }
                }
            }, errorCallback // error attaching the callback
            );
}

//
function subscribirse() {
    //
    cordova.plugins.CordovaMqTTPlugin.subscribe({
        topic: 'appVisualizadorE2/prueba',
        qos: 0,
        success: function (s) {
            //
            cordova.plugins.CordovaMqTTPlugin.listen("appVisualizadorE2/prueba", function (payload, params) {
                //
                if (payload !== '' && payload !== null && payload !== undefined) {
                    //
                    var arrayPayload = payload.split(';;');
                    var estado = parseInt(arrayPayload[1]);
                    //
                    actualizarArrayTurnos('Domicilio', arrayPayload[0], estado, 0, 0, 0, 0);
                }
            });
        },
        error: function (e) {
            //alert("err!! something is wrong. check the console")
        }
    });
}

//
var arrayCodigosAzules = [];

//
function guardarLlamado(valor, valor2, valor3, valor4) {
    //
    app.request.post(urlServer + 'Create/guardarLlamado', {habitacion: valor, caba: valor2, estado: valor3, codAzul: valor4},
            function (rsp) {
                //
                console.log(rsp);
            });
}

//
function guardarLlamadoR(valor, valor2, valor3) {
    //
    app.request.post(urlServer + 'Create/guardarLlamadoR', {habitacion: valor, caba: valor2, estado: valor3},
            function (rsp) {
                //
                console.log(rsp);
            });
}

//
function cargarCodigoAzules() {
    //
    app.request.post(urlServer + 'Read/cargarCodigoAzules', {},
            function (rsp) {
                //
                var data = JSON.parse(rsp);
                //
                arrayCodigosAzules = data;
            });
}

//
function cargarLlamados() {
    //
    app.request.post(urlServer + 'Read/cargarLlamadosV', {},
            function (rsp) {
                //
                var data = JSON.parse(rsp);
                //
                arrayT = data;
            });
}