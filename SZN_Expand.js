//=============================================================================
// SZN_Expand.js	2021/05/22
// Copyright (c) 2021 SZN
//=============================================================================
/*:
 * @plugindesc [v1.0] 拓展
 * @author SZN
 * @param Window width
 * @desc TEST
 * 默认值：200
 * @default 200
 * @param Window height
 * @desc TEST
 * 默认值:Graphics.height
 * @default Graphics.height
 * @param MaxTp
 * @desc 默认TP最大值
 * 默认值：100
 * @default 100
 * @help 
 * ============================================================================
 * Plugin Commands [如果不需要某些功能,请自行在插件注释掉]
 * ============================================================================
 * 需要lz-string.js
 * ============================================================================
 * 1.战斗受到伤害时触发状态(被攻击后先附加状态再计算伤害)
 * (注意:如果miss不会触发状态(就是触发onDamage函数时))
 * 
 *      武器备注<SZN_Damage_State:id>
 *      id为状态ID
 * ----------------------------------------------------------------------------
 * 2.抽奖,
 * 脚本:rad.rad(n,m)   n类别,m次数
 * 
 * n:1物品
 *   2武器
 *   3护甲
 *   4角色
 * 
 * 抽奖的概率表在JS的对象'ui'进行修改;
 * 类别1-3单次抽奖的鼓励奖默认给予金钱,可在函数'M1'进行修改;
 * 如果想更改角色抽奖的鼓励奖
 * 请在mad函数修改
 * function mad(o) {
 * p = 物品个数;
 * id = 物品ID;
 * ...};
 * 目前只支持4个概率表,如上类别.
 * ----------------------------------------------------------------------------
 * 3.添加了角色能级(战斗力)在菜单栏
 * ----------------------------------------------------------------------------
 * 4.最大TP  在右侧参数修改
 * ----------------------------------------------------------------------------
 * 5.优化
 * 优化了等级显示
 * ----------------------------------------------------------------------------*/
var szn_n = new Array();
var Imported = Imported || {};
Imported.SZN_Expand = true;
var szn = szn || {};
var params = PluginManager.parameters("SZN_Expand");
var szn_cf = Number(params["Window width"]) || 200;
var Smaxtp = Number(params["MaxTp"]) || 100;
var szn_cfu = params["Window height"];
var szn_inbattle = Game_Unit.prototype.initialize;
var szn_plc = Game_Interpreter.prototype.pluginCommand;
var szn_cf1 = szn_cf;
Game_Interpreter.prototype.pluginCommand = function (command, args) {
    szn_plc.call(this, command, args);
    switch (command) {
        case "Szncfset":
            szn_aid = Number(args[0]) || 1;
            szn_chf = Number(args[1]) || 0;
            szn_n[szn_aid] = szn_chf;
            break;
        case "Szncfadd":
            szn_aid = Number(args[0]) || 1;
            szn_chf = Number(args[1]) || 0;
            szn_an = szn_n[szn_aid] + szn_chf;
            szn_n[szn_aid] = szn_an;
            break;
        case "Szncfdel":
            szn_aid = Number(args[0]) || 1;
            szn_chf = Number(args[1]) || 0;
            szn_an = szn_n[szn_aid] - szn_chf;
            szn_n[szn_aid] = szn_an;
            break;
        case "Szncfval":
            szn_aid = Number(args[0]);
            szn_chf = Number(args[1]);
            $gameVariables.setValue(szn_chf, szn_n[szn_aid]);
        case "Szncfope":
            szn_cf1 = szn_cf;
        case "Szncfclo":
            szn_cf1 = 0;
        default:
            break;
    }
}
var szn_cfrw = function () {
    var szn_crf = Scene_Map.prototype.start;
    Scene_Map.prototype.start = function () {
        szn_crf.call(this);
        var szn_win = new Szn_cfWindow();
        this.addWindow(szn_win);
    };
};

function Szn_cfWindow() {
    this.initialize.apply(this, arguments);
}
Szn_cfWindow.prototype = Object.create(Window_Command.prototype);
Szn_cfWindow.prototype.constructor = Szn_cfWindow;
Szn_cfWindow.prototype.windowWidth = function () {
    return parseInt(window.innerWidth / 5);
};
Szn_cfWindow.prototype.windowHeight = function () {
    return Number(szn_cfu) || Graphics.height;
};
Szn_cfWindow.prototype.maxCols = function () {
    return 1;
};
Szn_cfWindow.prototype.makeCommandList = function () {
    for (var i in szn_n) {
        this.addCommand($gameActors.actor(i)._name + ":" + szn_n[i], "szn_cf", true);
    }
};

//TOOD
//----------------------------------------------------------------------------------------------
//variables
var ku = "ku",
    Ma = 0,
    dr = "";
const message_plu_1 = "AQKAVMhLxob3KL4qgncgLgNoA9BccoJcjBOQQSQCKAw/wJ7qAOpoDwKANAG7qAbyoPOJBAuuMKBAMoBeAdgGMAZgGcApgBdgqYMXaA+6MB2/gXSpAIW45AvpqB8Q0BleujkR2vQUICGAEwvTZ7QHkagAqViO3YAYlFepztj/YRbEANjaGwIDzioCIOs567viqGtje3L5CNGZBMjTsgGA6TDRK6B7xLonAJsIA9gAOYuyAykaAAPougDKugEbpJWVCAgHl7IDOioC3qc0tQA=";
const message_plu_2 = "k+6g1tQU6gNINvGGjKhcckAA";
const message_plu_3 = "gbynbgzp+oIW6JZOiDKo79GAp1QMwGFBlQp+aGh3IAA=";
const message_plu_4 = "u3BnT9IA";
const message_plu_5 = "A4FyAA==";
const message_plu_6 = "kuRicggEQAA=";
//----------------------------------------------------------------------------------------------
//Base64 & MD5
var base = new Base64();

function Base64() {

    // private property  
    _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

    // public method for encoding  
    this.encode = function (input) {
        var output = "";
        var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
        var i = 0;
        input = _utf8_encode(input);
        while (i < input.length) {
            chr1 = input.charCodeAt(i++);
            chr2 = input.charCodeAt(i++);
            chr3 = input.charCodeAt(i++);
            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;
            if (isNaN(chr2)) {
                enc3 = enc4 = 64;
            } else if (isNaN(chr3)) {
                enc4 = 64;
            }
            output = output +
                _keyStr.charAt(enc1) + _keyStr.charAt(enc2) +
                _keyStr.charAt(enc3) + _keyStr.charAt(enc4);
        }
        return output;
    }

    // public method for decoding  
    this.decode = function (input) {
        var output = "";
        var chr1, chr2, chr3;
        var enc1, enc2, enc3, enc4;
        var i = 0;
        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
        while (i < input.length) {
            enc1 = _keyStr.indexOf(input.charAt(i++));
            enc2 = _keyStr.indexOf(input.charAt(i++));
            enc3 = _keyStr.indexOf(input.charAt(i++));
            enc4 = _keyStr.indexOf(input.charAt(i++));
            chr1 = (enc1 << 2) | (enc2 >> 4);
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            chr3 = ((enc3 & 3) << 6) | enc4;
            output = output + String.fromCharCode(chr1);
            if (enc3 != 64) {
                output = output + String.fromCharCode(chr2);
            }
            if (enc4 != 64) {
                output = output + String.fromCharCode(chr3);
            }
        }
        output = _utf8_decode(output);
        return output;
    }

    // private method for UTF-8 encoding  
    _utf8_encode = function (string) {
        string = string.replace(/\r\n/g, "\n");
        var utftext = "";
        for (var n = 0; n < string.length; n++) {
            var c = string.charCodeAt(n);
            if (c < 128) {
                utftext += String.fromCharCode(c);
            } else if ((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            } else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }

        }
        return utftext;
    }

    // private method for UTF-8 decoding  
    _utf8_decode = function (utftext) {
        var string = "";
        var i = 0;
        var c = c1 = c2 = 0;
        while (i < utftext.length) {
            c = utftext.charCodeAt(i);
            if (c < 128) {
                string += String.fromCharCode(c);
                i++;
            } else if ((c > 191) && (c < 224)) {
                c2 = utftext.charCodeAt(i + 1);
                string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                i += 2;
            } else {
                c2 = utftext.charCodeAt(i + 1);
                c3 = utftext.charCodeAt(i + 2);
                string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                i += 3;
            }
        }
        return string;
    }
}! function (n) {
    "use strict";

    function d(n, t) {
        var r = (65535 & n) + (65535 & t);
        return (n >> 16) + (t >> 16) + (r >> 16) << 16 | 65535 & r
    }

    function f(n, t, r, e, o, u) {
        return d((c = d(d(t, n), d(e, u))) << (f = o) | c >>> 32 - f, r);
        var c, f
    }

    function l(n, t, r, e, o, u, c) {
        return f(t & r | ~t & e, n, t, o, u, c)
    }

    function v(n, t, r, e, o, u, c) {
        return f(t & e | r & ~e, n, t, o, u, c)
    }

    function g(n, t, r, e, o, u, c) {
        return f(t ^ r ^ e, n, t, o, u, c)
    }

    function m(n, t, r, e, o, u, c) {
        return f(r ^ (t | ~e), n, t, o, u, c)
    }

    function i(n, t) {
        var r, e, o, u, c;
        n[t >> 5] |= 128 << t % 32, n[14 + (t + 64 >>> 9 << 4)] = t;
        var f = 1732584193,
            i = -271733879,
            a = -1732584194,
            h = 271733878;
        for (r = 0; r < n.length; r += 16) f = l(e = f, o = i, u = a, c = h, n[r], 7, -680876936), h = l(h, f, i, a, n[r + 1], 12, -389564586), a = l(a, h, f, i, n[r + 2], 17, 606105819), i = l(i, a, h, f, n[r + 3], 22, -1044525330), f = l(f, i, a, h, n[r + 4], 7, -176418897), h = l(h, f, i, a, n[r + 5], 12, 1200080426), a = l(a, h, f, i, n[r + 6], 17, -1473231341), i = l(i, a, h, f, n[r + 7], 22, -45705983), f = l(f, i, a, h, n[r + 8], 7, 1770035416), h = l(h, f, i, a, n[r + 9], 12, -1958414417), a = l(a, h, f, i, n[r + 10], 17, -42063), i = l(i, a, h, f, n[r + 11], 22, -1990404162), f = l(f, i, a, h, n[r + 12], 7, 1804603682), h = l(h, f, i, a, n[r + 13], 12, -40341101), a = l(a, h, f, i, n[r + 14], 17, -1502002290), f = v(f, i = l(i, a, h, f, n[r + 15], 22, 1236535329), a, h, n[r + 1], 5, -165796510), h = v(h, f, i, a, n[r + 6], 9, -1069501632), a = v(a, h, f, i, n[r + 11], 14, 643717713), i = v(i, a, h, f, n[r], 20, -373897302), f = v(f, i, a, h, n[r + 5], 5, -701558691), h = v(h, f, i, a, n[r + 10], 9, 38016083), a = v(a, h, f, i, n[r + 15], 14, -660478335), i = v(i, a, h, f, n[r + 4], 20, -405537848), f = v(f, i, a, h, n[r + 9], 5, 568446438), h = v(h, f, i, a, n[r + 14], 9, -1019803690), a = v(a, h, f, i, n[r + 3], 14, -187363961), i = v(i, a, h, f, n[r + 8], 20, 1163531501), f = v(f, i, a, h, n[r + 13], 5, -1444681467), h = v(h, f, i, a, n[r + 2], 9, -51403784), a = v(a, h, f, i, n[r + 7], 14, 1735328473), f = g(f, i = v(i, a, h, f, n[r + 12], 20, -1926607734), a, h, n[r + 5], 4, -378558), h = g(h, f, i, a, n[r + 8], 11, -2022574463), a = g(a, h, f, i, n[r + 11], 16, 1839030562), i = g(i, a, h, f, n[r + 14], 23, -35309556), f = g(f, i, a, h, n[r + 1], 4, -1530992060), h = g(h, f, i, a, n[r + 4], 11, 1272893353), a = g(a, h, f, i, n[r + 7], 16, -155497632), i = g(i, a, h, f, n[r + 10], 23, -1094730640), f = g(f, i, a, h, n[r + 13], 4, 681279174), h = g(h, f, i, a, n[r], 11, -358537222), a = g(a, h, f, i, n[r + 3], 16, -722521979), i = g(i, a, h, f, n[r + 6], 23, 76029189), f = g(f, i, a, h, n[r + 9], 4, -640364487), h = g(h, f, i, a, n[r + 12], 11, -421815835), a = g(a, h, f, i, n[r + 15], 16, 530742520), f = m(f, i = g(i, a, h, f, n[r + 2], 23, -995338651), a, h, n[r], 6, -198630844), h = m(h, f, i, a, n[r + 7], 10, 1126891415), a = m(a, h, f, i, n[r + 14], 15, -1416354905), i = m(i, a, h, f, n[r + 5], 21, -57434055), f = m(f, i, a, h, n[r + 12], 6, 1700485571), h = m(h, f, i, a, n[r + 3], 10, -1894986606), a = m(a, h, f, i, n[r + 10], 15, -1051523), i = m(i, a, h, f, n[r + 1], 21, -2054922799), f = m(f, i, a, h, n[r + 8], 6, 1873313359), h = m(h, f, i, a, n[r + 15], 10, -30611744), a = m(a, h, f, i, n[r + 6], 15, -1560198380), i = m(i, a, h, f, n[r + 13], 21, 1309151649), f = m(f, i, a, h, n[r + 4], 6, -145523070), h = m(h, f, i, a, n[r + 11], 10, -1120210379), a = m(a, h, f, i, n[r + 2], 15, 718787259), i = m(i, a, h, f, n[r + 9], 21, -343485551), f = d(f, e), i = d(i, o), a = d(a, u), h = d(h, c);
        return [f, i, a, h]
    }

    function a(n) {
        var t, r = "",
            e = 32 * n.length;
        for (t = 0; t < e; t += 8) r += String.fromCharCode(n[t >> 5] >>> t % 32 & 255);
        return r
    }

    function h(n) {
        var t, r = [];
        for (r[(n.length >> 2) - 1] = void 0, t = 0; t < r.length; t += 1) r[t] = 0;
        var e = 8 * n.length;
        for (t = 0; t < e; t += 8) r[t >> 5] |= (255 & n.charCodeAt(t / 8)) << t % 32;
        return r
    }

    function e(n) {
        var t, r, e = "0123456789abcdef",
            o = "";
        for (r = 0; r < n.length; r += 1) t = n.charCodeAt(r), o += e.charAt(t >>> 4 & 15) + e.charAt(15 & t);
        return o
    }

    function r(n) {
        return unescape(encodeURIComponent(n))
    }

    function o(n) {
        return a(i(h(t = r(n)), 8 * t.length));
        var t
    }

    function u(n, t) {
        return function (n, t) {
            var r, e, o = h(n),
                u = [],
                c = [];
            for (u[15] = c[15] = void 0, 16 < o.length && (o = i(o, 8 * n.length)), r = 0; r < 16; r += 1) u[r] = 909522486 ^ o[r], c[r] = 1549556828 ^ o[r];
            return e = i(u.concat(h(t)), 512 + 8 * t.length), a(i(c.concat(e), 640))
        }(r(n), r(t))
    }

    function t(n, t, r) {
        return t ? r ? u(t, n) : e(u(t, n)) : r ? o(n) : e(o(n))
    }
    "function" == typeof define && define.amd ? define(function () {
        return t
    }) : "object" == typeof module && module.exports ? module.exports = t : n.md5 = t
}(this);
//# sourceMappingURL=md5.min.js.map
//----------------------------------------------------------------------------------------------
//其它类
function axf(max, min) {
    return Math.floor(Math.random() * (max - min)) + min
}
var szn_vul1 = szn_vul1 || parseInt(axf(10000000, 99999999));
var szn_vul2 = base.encode(String(szn_vul1));
let Count = Number;
var Lb64 = LZString.decompressFromBase64;
//----------------------------------------------------------------------------------------------
//函数_1
function sznskill(N, num, numadd, Aatk, Adef, Amat, Amdf, Amhp, Alevel, Ahp, Amp, Aagi, Atp, Ammp, Aluk, Batk, Bmdf, Bdef, Bmat, Bmhp, Bmmp, Blevel, Bmp, Bhp, Bagi, Btp, Bluk, n) {
    switch (N) {
        case "count":

        case "kill":
            return 9999999999999999999999999999
        case 51:
            let q1 = Aatk >= 50 ? 800 + Aatk : Aatk;
            return q1
    }
}

function counts(n = 0) {
    let count = Number;
    count > Number(num) ? count = 0 : count += Number(numadd);
    Count = count;
    return Count *= n
}
//----------------------------------------------------------------------------------------------
//抽奖
var rad = {
    rad: function (n, m) { //抽奖,n编号,m次数
        Ma = 0;

        function q(e) {
            function i(e) {
                switch (e) {
                    case "a":
                        return '$dataItems[Number(o)]'
                    case "b":
                        return '$dataWeapons[Number(o)]'
                    case "c":
                        return '$dataArmors[Number(o)]'
                }
            }
            var a1 = parseInt(Math.random() * Object.keys(rad.ui[String(e)]).length + 1);
            var M = Math.floor((Math.random() * 100) + 1);
            var o = Object.keys(rad.ui[String(e)])[a1];
            Number(rad.ui[String(e)][String(o)]) >= M ? $gameParty.gainItem(eval(i(e)), 1, ) : M1(M); //TOOD
        }
        switch (n) { //编号 
            case 1:
                mo(m, "a")
                break;
            case 2:
                mo(m, "b")
                break;
            case 3:
                mo(m, "c")
                break;
            case 4:
                var lis = $gameParty._actors;
                for (i = 0; i < m; i++) {
                    var a1 = parseInt(Math.random() * Object.keys(rad.ui['d']).length + 1);
                    var M = Math.floor((Math.random() * 100) + 1);
                    var o = Object.keys(rad.ui['d'])[a1];
                    Number(rad.ui['d'][String(o)]) >= M ? message_addactor(Number(o)) : $gameParty.gainGold(M);
                }

                function mad(o) {
                    var id = 76;
                    var g = $gameActors._data[o];
                    var p = parseInt((g.agi + g.atk + g.def + g.mdf + g.mat + g.mhp + g.mmp) / g.level);
                    $gameMessage.add(Lb64(message_plu_6) + String($gameActors._data[o]._name) + Lb64(message_plu_2) + " " + String($dataItems[id].name) + "x" + String(p));
                    $gameParty.gainItem($dataItems[id], p, )
                }

                function message_addactor(o) {
                    lis.indexOf(o) == -1 ? $gameParty.addActor(o) : mad(o);

                }
                break;

        }


        function M1(M) {
            Ma += M;
            $gameParty.gainGold(M);
        }

        function mo(m, y) {
            for (i = 0; i < m; i++) {
                q(y);
            }
            $gameMessage.add(Lb64(message_plu_4) + Ma + Lb64(message_plu_5));
            $gameMessage.add(Lb64(message_plu_3));
        }
    },
    ui: { //不要动第一个元素
        a: {
            '物品': 100, //100为权重(默认最大100)
            42: 100, //例如这个,42号物品权重为100
            2: 80,
            18: 80,
            17: 50,
            6: 100,
            7: 100,
        },
        b: {
            '武器': 100,
            28: 100,

        },
        c: {
            '护甲': 100,
            26: 100,

        },
        d: {
            '角色': 100,
            4: 10,
            5: 80,
            6: 50,
            71: 50,

        },
    },
    /* check: function () {//概率
        var len = {
            _a_len = Object.keys(rad.ui.a).length,
            _b_len = Object.keys(rad.ui.b).length,
            _c_len = Object.keys(rad.ui.c).length,
            _d_len = Object.keys(rad.ui.d).length
        };
        
    } */
};
//----------------------------------------------------------------------------------------------
//Debug
var SDEBUG = false;
$(document).keyup = function (event) {
    if (!event.ctrlKey && !event.altKey) {
        switch (event.keyCode) {
            case 116: // F5
                if (Utils.isNwjs()) {
                    location.reload();
                }
                break;
            case 119: // F8
                if (SDEBUG) {
                    require('nw.gui').Window.get().showDevTools();
                }
                break;
            case 120:
                if (SDEBUG) {
                    var ND = KMS_DEBUG() || {};
                }
        }
    }
};
$(document).keyup(function (event) {
    if (event.ctrlKey && event.keyCode == 192) {
        SDEBUG = true;
        $gameTemp.reserveCommonEvent(5);

    }

});

/* function SH() {
    var e = jQuery.Event("keyup"); //键盘事件
    e.keyCode = 120; //keyCode=120 F9
    $("#test").trigger(e);
}
 */
function szn_debug() {
    SDEBUG = true;
    $gameParty.gainItem($dataItems[8], 1, );
    var vConsole = new VConsole() || {};
    /* console.log("SH()") */
    //$gameTemp.reserveCommonEvent(69);
};

function szn_de() { //use debug
    md5($gameActors._data[1]._name) == "5f4c478bc603a3281edb0b03f29ae372" ? szn_debug() : null;
};

//----------------------------------------------------------------------------------------------
//角色能级
function szn_Eadd(actor) {
    return actor.agi + actor.atk + actor.def + actor.mdf + actor.mat + actor.mhp + actor.mmp
}
var SZN_Window_drawActorSimpleStatus = Window_Base.prototype.drawActorSimpleStatus
Window_Base.prototype.drawActorSimpleStatus = function (actor, x, y, width) {
    SZN_Window_drawActorSimpleStatus.call(this, actor, x, y, width);
    var lineHeight = this.lineHeight();
    this.draw_nj(actor, x, y + lineHeight * 1);
    //this.drawActorNickname(this.actor,432,y);//nickname
};
Window_Base.prototype.draw_nj = function (actor, x, y) {
    this.changeTextColor('#FF0000');
    this.drawText("能级", x + window.innerWidth * 0.21875 - 50, y - 35, 48);
    this.resetTextColor();
    this.drawText(szn_Eadd(actor), x + window.innerWidth * 0.26171875 - 50, y - 35, window.innerWidth / 2, 'left');

};
//----------------------------------------------------------------------------------------------
//等级位置优化
Window_Base.prototype.drawActorLevel = function (actor, x, y) {
    this.changeTextColor(this.systemColor());
    this.drawText(TextManager.levelA, x, y, 48);
    this.resetTextColor();
    this.drawText(actor.level, x + 40, y, parseInt(window.innerWidth / 7), 'lift');
    //
};
//nickname <-懒得改
/* var SZN_Window_BasedrawActorNickname = Window_Base.prototype.drawActornickName;
Window_Base.prototype.drawActorNickname = function(actor, x, y, width) {
    SZN_Window_BasedrawActorNickname.call(this,actor, x, y, width)
    this.drawText(actor.nickname(), x, y, width);
};
 */

//-----------------------------------------------------------------------------------------
//战斗受到伤害前添加状态(在武器备注写: <SZN_Damage_State:状态ID> )
function act_w(id) {
    try {
        var q = Number($gameActors.actor(id).weapons(0)[0].metaArray.SZN_Damage_State[0]);
        $gameActors.actor(id).addState(q);
    } catch (err) {} finally {}
}
var SZN_Game_Battler_onDamage = Game_Battler.prototype.onDamage;
Game_Battler.prototype.onDamage = function (value) {
    SZN_Game_Battler_onDamage.call(this, value);
    act_w(this._actorId);
    /*     this.chargeTpByDamage(value / this.mmp); */
};
//----------------------------------------------------------------------------------------------
//最大TP
Game_BattlerBase.prototype.maxTp = function () {
    return Smaxtp;
};
//----------------------------------------------------------------------------------------------
/* //战斗角色状态栏BUG处理(supertool的bug)
function del_battle_json_part_1() {
    $.get('data/Windows.json', function (_data) {
        $.each(_data.Scene_Battle, function (_name, _item) {
            String(this._name) == "Window_BattleStatus"?null:null;

                console.log(_name, _item);
        })

    })
}; */