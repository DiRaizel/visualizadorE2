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
    root: '#appVisualizadorE',
    // App Name
    name: 'visualizadorE',
    // App id
    id: 'com.visualizadorE',
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

//
document.addEventListener('deviceready', function () {
    //
    show5();
    //
    voz('', 0);
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
        document.getElementById("modulo" + i).style.fontSize = '7vh';
        document.getElementById("cliente" + i).style.fontSize = '7vh';
        document.getElementById("hora" + i).style.fontSize = '7vh';
    }
    //
    document.getElementById("fecha").style.fontSize = '3.5vh';
    document.getElementById("hora").style.fontSize = '3.5vh';
    //
    fecha();
    //
    setInterval(function () {
        //
        fecha();
    }, 1000);
    //
    cordova.plugins.CordovaMqTTPlugin.connect({
        url: 'tcp://165.227.89.32', //a public broker used for testing purposes only. Try using a self hosted broker for production.
        port: '1883',
        clientId: 'com.visualizadorE',
        willTopicConfig: {
            qos: 0, //default is 0
            retain: false, //default is true
            topic: "appLlamadoEnf/prueba",
            payload: ""
        },
        username: "fabian",
        password: '1234',
        success: function (s) {
            subscribirse();
        },
        error: function (e) {
//            console.log('error: ' + e);
        },
        onConnectionLost: function (e) {
//            console.log('conexion perdida: ' + e);
        }
    });
    //
    actualizarTurnos();
    actualizarArrayCiclico();
});

//
function fecha() {
    //
    var dias = ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'];
    var meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    var fecha = new Date();
    var diaS = fecha.getDay();
    var diaM = fecha.getDate();
    var mes = fecha.getMonth();
    var year = fecha.getFullYear();
    //
    if (year == '2020') {
        //
        $$('#fecha').html(dias[diaS] + ' ' + diaM + '/' + meses[mes] + '/' + year);
        $$('#hora').html(reloj);
        $$('#fecha').css('font-weight', 'bold');
        $$('#hora').css('font-weight', 'bold');
        $$('#fecha').css('color', '#5B5B5A');
        $$('#hora').css('color', '#5B5B5A');
    }
}

//
var controlCA = false;

//
function actualizarArrayTurnos(str, str2, str3, str4) {
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
                        actualizarArrayTurnos('Cod. Azul', element.descripcion, str3, 0);
                    }
                });
            }
        }
    } else {
        //
        if (str3 === 0) {
            //
            for (var i = 0; i < arrayT.length; i++) {
                //
                if (arrayT[i]['modulo'] === str && arrayT[i]['tipo'] === str2) {
                    //
                    arrayT.splice(i, 1);
                }
            }
        } else {
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
                            if (int2 > 20) {
                                //
                                var b = int2 - 20;
                                //
                                cb = 'Baño ' + b;
                            } else {
                                //
                                cb = 'Cama ' + int2;
                            }
                            //
                            actualizarArrayTurnos(h, cb, s, int);
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
        topic: 'appLlamadoEnf/prueba',
        qos: 0,
        success: function (s) {
            //
            cordova.plugins.CordovaMqTTPlugin.listen("appLlamadoEnf/prueba", function (payload, params) {
                //
                if (payload !== '' && payload !== null && payload !== undefined) {
                    //
                    var arrayPayload = payload.split(';;');
                    var estado = parseInt(arrayPayload[1]);
                    //
                    actualizarArrayTurnos('Domicilio', arrayPayload[0], estado, 0);
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
function guardarCodigoAzul() {
    //
    if ($$('#descripcion').val() !== '' && $$('#descripcion').val() !== ' ' && $$('#descripcion').val() !== null) {
        //
        if (arrayCodigosAzules.length > 0) {
            //
            var cant = arrayCodigosAzules.length;
            //
            arrayCodigosAzules[cant] = {codigo: 101 + cant, descripcion: $$('#descripcion').val()};
            //
            localStorage.codigosAzules = JSON.stringify(arrayCodigosAzules);
        } else {
            //
            arrayCodigosAzules[0] = {codigo: 101, descripcion: $$('#descripcion').val()};
            //
            localStorage.codigosAzules = JSON.stringify(arrayCodigosAzules);
        }
        //
        cargarTablaCodigosAzules();
        //
        var toastBottom = app.toast.create({
            text: 'Codigo azul guardado!',
            closeTimeout: 2000
        });
        //
        toastBottom.open();
    } else {
        //
        var toastBottom = app.toast.create({
            text: 'Llena el campo!',
            closeTimeout: 2000
        });
        //
        toastBottom.open();
        //
        $$('#descripcion').focus();
    }

}

//
function cargarTablaCodigosAzules() {
    //
    if (localStorage.codigosAzules !== undefined) {
        //
        arrayCodigosAzules = JSON.parse(localStorage.codigosAzules);
        //
        var campos = '';
        //
        for (var i = 0; i < arrayCodigosAzules.length; i++) {
            //
            campos += '<tr><td class="numeric-cell">' + arrayCodigosAzules[i]['codigo'] + '</td>';
            campos += '<td class="label-cell"><input style="width: 100%; border-bottom: 1px solid #E0E0E0;" type="text" id="descripcion' + i + '" name="descripcion" value="' + arrayCodigosAzules[i]['descripcion'] + '" placeholder="Descripción Código"></td>';
            campos += '<td class="label-cell"><a onclick="editarCodigoAzul(' + i + ')" type="submit" class="button button-fill" href="#"><i class="fas fa-save"></i></a></td></tr>';
        }
        //
        $$('#tablaCodigosAzules').html(campos);
    }
}

//
function editarCodigoAzul(valor) {
    //
    if ($$('#descripcion' + valor).val() !== '' && $$('#descripcion' + valor).val() !== ' ' && $$('#descripcion' + valor).val() !== null) {
        //
        arrayCodigosAzules[valor]['descripcion'] = $$('#descripcion' + valor).val();
        //
        localStorage.codigosAzules = JSON.stringify(arrayCodigosAzules);
        //
        var toastBottom = app.toast.create({
            text: 'Código azul editado!',
            closeTimeout: 2000
        });
        //
        toastBottom.open();
    } else {
        //
        var toastBottom = app.toast.create({
            text: 'No debes dejar el campo vacío!',
            closeTimeout: 2000
        });
        //
        toastBottom.open();
        //
        $$('#descripcion' + valor).focus();
    }

}