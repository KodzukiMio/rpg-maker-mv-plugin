//=============================================================================
// SZN_Expand.js	2022/01/28
// Copyright (c) 2022 SZN
//=============================================================================
/*:
 * @plugindesc [v1.3] 拓展
 * @author SZN
 * 
 * @param Error
 * @desc 插件报错
 * 默认值：0
 * @default 0
 * 
 * @param MaxTp
 * @desc 默认TP最大值
 * 默认值：100
 * @default 100
 * 
 * @param Prize ID
 * @desc 奖品ID
 * 默认值：76
 * @default 76
 * 
 * @param Prize State
 * @desc 中奖提示
 * 默认值：1
 * @default 1
 * 
 * @param Universal template ID
 * @desc 通用模板ID
 * 默认值：200
 * 此模板ID为获取基本数据对应的数据库ID
 * @default 200
 * 
 * @param Encouragement Award
 * @desc 鼓励奖
 * 默认值：$gameParty.gainGold(M);
 * @default $gameParty.gainGold(M);
 * 
 * @param Energy Level
 * @desc 角色能级开关(此功能需要自行到JS调整参数)
 * 默认值：0
 * @default 0
 * 
 * @param Debug_
 * @desc (此功能需要Jquery.js)
 * (插件调试用)
 * 默认值：0
 * @default 0
 * 
 * @param Time
 * @desc (MOG_TimeSystem与-ShoraLighting兼容)
 * 地图备注使用<NOLIGHT>关闭MOG的光照
 * 默认值：0
 * @default 0
 * 
 * @param LOADTIME
 * @desc (如果出现recipeItem报错,根据需求适当增加 加载时间(ms))
 * 默认值：2000
 * @default 2000
 * @help 
 * ============================================================================      
 * [如果不需要某些功能,请自行在插件注释掉]
 * ============================================================================
 * 需要LZstring.js(如果libs里没有)
 * ============================================================================
 * 1.战斗受到伤害时触发状态(被攻击后先附加状态再计算伤害)
 * 
 * (注意:如果miss不会触发状态(就是触发onDamage函数时))
 * 
 *      武器备注<SZN_Damage_State:id>
 *      id为状态ID
 * 
 * ----------------------------------------------------------------------------
 * 2.抽奖
 * 
 * 脚本:KUR_JS._Lottery(n, m);   //n类别,m次数
 * 使用前请先修改右侧的Prize ID与Encouragement Award
 * n:1物品
 *   2武器
 *   3护甲
 *   4角色
 * 
 * 使用方法:
 * 使用var xxx = KUR_JS._CreateProbabilityTable();创建概率表
 * 然后使用xxx.x[id] = number;来添加或修改概率
 * 使用KUR_JS._LoadProbabilityTable(xxx);加载概率表,这里xxx必须是引用类型!!!
 * 可以自行创建json来保存概率表或者之间在编辑器的脚本里设置
 * 
 * ----------------------------------------------------------------------------
 * 3.添加了角色能级(战斗力)在菜单栏
 * ----------------------------------------------------------------------------
 * 4.最大TP  在右侧参数修改
 * ----------------------------------------------------------------------------
 * 5.优化
 * 优化了等级显示
 * ----------------------------------------------------------------------------
 * 6.IF效果,ADD效果
 * 
 * 技能备注 <SZN_if_state:xx yy zz>
 *          <SZN_add_state:xx yy zz>
 * 里面的xx yy zz为状态ID
 * 被技能施加的对象,如果有状态...则添加状态...
 * 
 * ----------------------------------------------------------------------------
 * 7.在游戏里可以创建技能,物品,武器,角色,护甲,状态,敌人,敌群
 * 
 * 注意!!!:每次启用新插件时必须清空KUR_DATA文件夹
 * 或者使用 KUR.Json("c",{},"all"); 来清空
 * 
 * 使用前请修改基本模板ID(Universal template ID):ID为数据库中对应ID的数据
 * (可以使用config.example=number;)来修改模板ID
 * (注意::本功能目前无法在运行在移动端上,只适用于桌面端>>
 * 如果你想要运行在移动端,可以修改KUR.JSON()->(加载数据用的,自行修改为从存档加载))
 * 使用var xxx = KUR_JS._CreateBasicDataTemplate(target);来创建基本模板
 * target的值请使用KUR_JS._BasicName();来查询
 * 然后修改xxx的属性值
 * 最后使用KUR_JS._CreateData(xxx);来创建数据
 * 使用var xxx = KUR_JS._Find(target, Attributes, value);
 * 来查找符合target的Attributes属性==value的对象;
 * 函数返回一个数组
 * xxx为查找结果
 * (例如var f=KUR_JS._Find("item","name","生命药水");)
 * (f就是符合$dataItems[..].name=="生命药水"的对象集合)
 * 如果要修改数据,请使用KUR_target来修改数据(target的值请使用KUR_JS._BasicName();来查询)
 * 例如KUR_item
 * 然后使用KUR_Data.Reload_(target);来重新加载数据(例如KUR_Data.Reload_("item");)
 * 
 * 保姆教程:
 * 
 * 我设置了Universal template ID为10
 * 所以模板ID变为了10
 * 我使用 var part_1 = KUR_JS._CreateBasicDataTemplate("item");
 * (以数据库的10号物品为模板创建数据)
 * 然后 part_1.data.name = "ABCD";(物品名修改)
 *      part_1.data.iconIndex = 100;(物品图标修改)
 * 最后 KUR_JS._CreateData(part_1);
 * 于是就在数据库添加了新的物品(id为数据库物品ID的最大值+1).
 * 我使用了 $gameParty.gainItem($dataItems[200],1,);(这里200是创建后自动生成的物品ID)
 * 于是我获得了名为"ABCD"的新物品
 * (技能,物品,武器,角色,护甲,状态,敌人,敌群)同理
 * 
 * ----------------------------------------------------------------------------
 * 8.技能&伤害 色调
 * 
 * 使用这个可以改变技能色调
 * 
 * 角色或者敌人备注:
 *      <KUR_SkillHue:ID,hue1,hue2>
 *      <KUR_DamageHue:ID,hue>
 *      ID为技能ID
 *      hue1为技能对应动画的图像1色调
 *      hue2为技能对应动画的图像2色调
 *      hue为技能对应伤害图片的色调
 * 
 * ---------------------------------------------------------------------------- 
 * END.其它
 * 
 * 使用KUR_...来查看
 * 
 * ----------------------------------------------------------------------------*/
var szn_n = new Array();
var Imported = Imported || {};
Imported.SZN_Expand = true;
var szn = szn || {};
var params = PluginManager.parameters("SZN_Expand");

function isMobile() {
    if (window.navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i)) {
        return true; // 移动端
    } else {
        return false; // PC端
    }
};
//TOOD
var config = {
    id1: Number(params["Prize ID"]) || 76, //抽奖物品ID
    event1: 5, //debug事件
    id2: 1, //debug Name
    Smaxtp: Number(params["MaxTp"]) || 100,
    example: Number(params["Universal template ID"]) || 200, //通用模板ID
    M1: Number(params["Encouragement Award"]) || "$gameParty.gainGold(M);", //鼓励奖
    error: Number(params["Error"]) || 0,
    Eadd: Number(params["Energy Level"]) || 0,
    debug: Number(params["Debug_"]) || 0,
    load_time: Number(params["LoadTime"]) || 1000,
    time: Number(params["Time"]) || 0,
    hours: 65,
    time_stat: 0,
    ismobile: isMobile(),
    lottery: Number(params["Prize State"]) || 0,
    LOAD_TIME: Number(params["LOADTIME"]) || 2000,
};
var config_ = { //默认概率表
    a: {
        '物品': 100, //100为权重(默认最大100)
        //'42': 100, //例如这个,42号物品权重为100
    },
    b: {
        '武器': 100,
    },
    c: {
        '护甲': 100,
    },
    d: {
        '角色': 100,
    },
};
var _config = { //这个是模板,请不要动第一个元素.
    a: {
        '物品': 100,
    },
    b: {
        '武器': 100,
    },
    c: {
        '护甲': 100,
    },
    d: {
        '角色': 100,
    },
};

function ERROR_THOROUGH(err) {
    if (config.error) {
        return console.error(err);
    } else {
        return;
    };
};

function KUR_JS() {
    this.initialize.apply(this, arguments);
};
KUR_JS._Lottery = function (n, m) {
    rad.rad(n, m);
};
KUR_JS._CreateProbabilityTable = function () { //创建慨率表
    return KUR_JS.CreateObject(_config);
};
KUR_JS.CreateObject = function (target) {
    return Object.assign(Object.create(Object.getPrototypeOf(target)), target);
};
KUR_JS._LoadProbabilityTable = function (target) { //这里target必须是引用类型!!!
    config_ = target;
};
KUR_JS._BasicName = function () {
    return KUR_json_name;
};
var RESULT = [];
KUR_JS._Find = function (target, Attributes, value) { //查找符合target的Attributes属性==value的对象;
    RESULT = [];
    var tar = KUR.to$(target);
    try {
        var tar_ = eval(tar);
        var len = tar_.length;
        var value_ = value;
        if (typeof value == "string") {
            value_ = "\"" + value + "\"";
        };
        for (var i = 0; i < len; i++) {
            try {
                if (eval(tar + "[" + i + "]." + Attributes + " == " + value_)) {
                    RESULT.push(eval(tar + "[" + i + "]"));
                }
            } catch (er) {};
        }
    } catch (e) {
        return console.error(e);
    };
    return RESULT;
}
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
//其它
function axf(max, min) { //随机数
    return Math.floor(Math.random() * (max - min)) + min
}
var szn_vul1 = szn_vul1 || parseInt(axf(10000000, 99999999));
var szn_vul2 = base.encode(String(szn_vul1));
let Count = Number;
var Lb64 = LZString.decompressFromBase64;
//----------------------------------------------------------------------------------------------
//函数_1
function sznskill(..._args) {
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

function to_number(str_array) { //字符串数组转换数字
    var len = str_array.length;
    var newarr = [];
    for (i = 0; i < len; i++) {
        newarr[i] = Number(str_array[i]);
    }
    return newarr;
};

KUR.prototype.GAMEDATA = {
    DEBUG: {},
    MESSAGE: {}
};

function KUR() {
    this.initialize.apply(this, arguments);
};
var fs;
try {
    fs = require("fs");
} catch (e) {};
//var fs = require("stream");
var KUR_item = [];
var KUR_armor = [];
var KUR_skill = [];
var KUR_actor = [];
var KUR_weapon = [];
var KUR_state = [];
var KUR_enemy = [];
var KUR_troop = [];
var KUR_class = [];
var KUR_compare = ["$dataItems", "$dataArmors", "$dataSkills", "$dataActors", "$dataWeapons", "$dataStates", "$dataEnemies", "$dataTroops", "$dataClasses"];
var KUR_json_name = ["item", "armor", "skill", "actor", "weapon", "state", "enemy", "troop", "class"];
var KUR_w_data = [];
var KUR_json_member_length = [];

KUR.to$ = function (items) { //获取对应名称
    var f1 = KUR.Find(KUR_json_name, items);
    var f2 = KUR.Find(KUR_compare, items);
    if (f1 !== -1) {
        return KUR_compare[f1];
    } else if (f2 !== -1) {
        return KUR_json_name[f2];
    } else {
        return 0;
    }
};
KUR.Find = function (target, items, start = 0) { //查找
    var len = target.length;
    if (len) {
        for (var i = start; i < len; i++) {
            if (target[i] == items) {
                return i;
            };
        };
        return -1;
    } else {
        return -1;
    }
};
KUR.GetLength = function (items) {
    return eval(KUR.to$(items) + ".length;");
};
KUR.GetStaticLength = function (target) {
    return KUR_json_member_length[KUR.Find(KUR_json_name, target)];
};
KUR.Load_json_length = function () {
    // var len = KUR_json_name.length;
    // for (var i = 0; i < len; i++) {
    //     KUR_json_member_length.push(KUR.GetLength(KUR_json_name[i]));
    // };
    KUR_json_member_length = datalength;
    return true;
};
//麻烦的JSON操作
KUR.Json = function (target = "read", data = {}, target_ = "") {
    var len = KUR_json_name.length - 1;
    if (target == "read" || target == 'r') {
        if (target_ != "") {
            var str1 = "./KUR_DATA/" + target_ + ".json";
            var str2 = "KUR_" + target_;
            eval("fs.readFile(str1, function (err, data){if(err){return ERROR_THOROUGH(err);};" + str2 + "=data.toString();" + str2 + "=JSON.parse(" + str2 + ");});");
        } else {
            for (i = 0; i < len; i++) {
                var str1 = "./KUR_DATA/" + KUR_json_name[i] + ".json";
                var str2 = "KUR_" + KUR_json_name[i];
                eval("fs.readFile(str1, function (err, data){if(err){return ERROR_THOROUGH(err);};" + str2 + "=data.toString();" + str2 + "=JSON.parse(" + str2 + ");});");
            };
        }
    } else if (target == "clear" || target == 'c') {
        if (target_ == "all") {
            for (i = 0; i < len; i++) {
                var str1 = "./KUR_DATA/" + KUR_json_name[i] + ".json";
                fs.writeFile(str1, "[]", function (err) {
                    if (err) {
                        ERROR_THOROUGH(err);
                    };
                });
            };
        } else {
            var str1 = "./KUR_DATA/" + target_ + ".json";
            fs.writeFile(str1, "[]", function (err) {
                if (err) {
                    ERROR_THOROUGH(err);
                };
            });
        }
    } else if (target == "save") {
        var str_ = "./KUR_DATA/" + target_ + ".json";
        var str_n = "KUR_" + target_;
        eval("var st=JSON.stringify(" + str_n + ");fs.writeFile(\"" + str_ + "\",st,function(err){if(err){ERROR_THOROUGH(err);};});");
    } else {
        KUR_w_data = data;
        var str_ = "./KUR_DATA/" + target + ".json";
        var str_n = "KUR_" + target;
        eval(str_n + ".push(KUR_w_data);var st=JSON.stringify(" + str_n + ");fs.writeFile(\"" + str_ + "\",st,function(err){if(err){ERROR_THOROUGH(err);}});");
    };
};
KUR.Load = function (target) { //加载json
    var data = eval("KUR_" + target);
    var len = data.length;
    for (var i = 0; i < len; i++) {
        KUR_Data.add(data[i], target);
    }
};
var KUR_load_count = 0;
KUR.reload = function (target) { //重加载json到$data
    var tar = eval(KUR.to$(target));
    if (tar) {
        //tar.length = KUR.GetStaticLength(target);
        KUR.Load(target);
        KUR_load_count++;
    }
};
KUR.Save = function (target, mode = "") { //保存json
    if (mode == "all") {
        var len = KUR_json_name.length - 1;
        for (var i = 0; i < len; i++) {
            KUR.Json("save", {}, kur_json_name[i]);
        }
    } else {
        KUR.Json("save", {}, target);
    }
};
KUR.Read = function (target) { //读取json
    KUR.Json('r', {}, target);
};
KUR.prototype._cout = {
    c: function (message) {
        console.log(message);
    },
    e: function (message) {
        console.log(eval(message));
    }
};
var cout = KUR.prototype._cout.c;
var eout = KUR.prototype._cout.e;
var Quick = {
    getmapid: function (x, y) {
        return KUR.prototype._getxy.MapEvent(x, y);
    },
};
KUR.prototype._getxy = { //一些小功能
    x: function (id) {
        return $gameMap.event(id).x;
    },
    y: function (id) {
        return $gameMap.event(id).y;
    },
    MapEventId: function (x, y) {
        return $gameMap.eventIdXy(x, y);
    }
};
KUR.prototype._SetEventPosition = function (id, x, y) { //设置事件位置
    $gameMap.event(id).setPosition(x, y);
};
KUR.prototype.STORE = [];
//sleep(时间(毫秒),"执行代码块","参数名1,参数名2,...",[参数1,参数2])
KUR.prototype._sleep = function (str, time = 0, params = "", res = "") {
    try {
        if (params != "") {
            params = params.split(',');
            var len = params.length;
            var str_ = "";
            var count = 0;
            while (len--) {
                str_ += params[count++].toString() + ",";
            }
            str_ += "NONE=null";
            len = res.length;
            var res_ = "";
            count = 0;
            while (len--) {
                res_ += res[count++].toString() + ",";
            }
            res_ += "NONE=null";
        }
        setTimeout("(function(" + str_ + "){" + str + "})(" + res_ + ")", time);

    } catch (e) {
        var E = e.toString();
        console.log(E);
        return E;
    }
    return KUR.prototype.STORE;
}

function GameCommand(command, args) {
    return Game_Interpreter.prototype.pluginCommand(command, args);
};
var STORE_ = KUR.prototype.STORE;
//------------------------------
//与MOG和shora light支持
var TIME__ = [0, 1, 2, 21, 22, 23];
var TIME__S = false;

function TIME_(time) {
    var len = TIME__.length;
    for (var i = 0; i < len; i++) {
        if (time == TIME__[i]) {
            TIME__S = true;
            return true;
        };
    }
    TIME__S = false;
    return false;
}
var t_h_ = 0;
var MapID = 0;
var KUR_TIME__ = DataManager.onLoad;
DataManager.onLoad = function (object) {
    KUR_TIME__.call(this, object);
    if (object === $dataMap) {
        try {
            object.meta.NOLIGHT == true ? (config.time_stat = 1) : (config.time_stat = 0);
        } catch (e) {};
    };
};
var time_loadfirst = 150;

function TIME() {
    try {
        if (t_h_ == time_loadfirst && !$gameParty.inBattle()) {
            var t_h = $gameVariables._data[config.hours];
            if (config.time_stat) {
                GameCommand("ambient", ["#232323", "200"]);
            } else if (TIME_(t_h)) {
                GameCommand("ambient", ["#232323", "200"]);
            } else {
                GameCommand("ambient", ["#FFFFFF", "100"]);
            };
            t_h_ = 0;
        };
        t_h_++;
    } catch (e) {};
};
KUR.prototype.update = SceneManager.update;
SceneManager.update = function () {
    KUR.prototype.update.call(this);
    if (config.time) {
        TIME();
    };
}
KUR.prototype.EXE_STATE = false;
KUR.prototype.EXE_S = function (EVAL_FUNCTION = "") {
    if (!KUR.prototype.EXE_STATE) {
        eval("SceneManager.update=function(){KUR.prototype.update.call(this);if (config.time) {TIME();};" + EVAL_FUNCTION + "}");
    } else {
        return;
    }
    KUR.prototype.EXE_STATE = true;
}
KUR.prototype.EXE_E = function () {
    KUR.prototype.EXE_STATE = false;
    eval("SceneManager.update=function(){KUR.prototype.update.call(this);if (config.time) {TIME();};}");
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
                    var id = config.id1;
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
            eval(config.M1);
        }

        function mo(m, y) {
            for (i = 0; i < m; i++) {
                q(y);
            };
            if (config.lottery) {
                $gameMessage.add(Lb64(message_plu_4) + Ma + Lb64(message_plu_5));
                $gameMessage.add(Lb64(message_plu_3));
            };
        }
    },
    ui: config_,
};
//----------------------------------------------------------------------------------------------
//(可以把$document)Debug
var SDEBUG = false;
if (config.debug) {
    try {
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
            if (event.ctrlKey && event.keyCode == 192 && SDEBUG) {
                $gameTemp.reserveCommonEvent(config.event1);

            }

        });
    } catch (e) {};
};


function szn_debug() {
    SDEBUG = true;
    var vConsole = new VConsole() || {};
    /* console.log("SH()") */
    //$gameTemp.reserveCommonEvent(69);
};

function szn_de() { //use debug
    md5($gameActors._data[config.id2]._name) == "5f4c478bc603a3281edb0b03f29ae372" ? szn_debug() : null;
};

function debug_load() {
    md5($gameActors._data[config.id2]._name) == "5f4c478bc603a3281edb0b03f29ae372" ? $gameActors._data[config.id2]._name = $dataActors[config.id2].name : null;
};

function KUR_DEBUG() {
    this.initialize.apply(this, arguments);
};
KUR_DEBUG.prototype.initialize = function () {

};
KUR_DEBUG.prototype.SDEBUG = function (state) {
    if (state) {
        SDEBUG = true;
    } else {
        SDEBUG = false;
    }
}
KUR_DEBUG.prototype.ShowDebugWindow = function () {
    SceneManager.push(Scene_Debug);
}
KUR_DEBUG.prototype._debug = function () {
    szn_debug();
}
KUR_DEBUG.prototype._debug_show = function () {
    $gameTemp.reserveCommonEvent(config.event1);
}
KUR_DEBUG.prototype.Get_all_roles = function () {
    var num = $dataActors.length - 1;
    for (i = 0; i < num; ++i) {
        try {
            if (!$dataActors[i].battlerName == "") {
                $gameParty.addActor(i);
            }
        } catch (e) {};
    };
};
KUR_DEBUG.prototype.EVALCODE = function (id) {
    var ID = id.toString();
    var kdata = KUR.prototype.GAMEDATA.DEBUG;
    var len = kdata.length;
    for (i = 0; i < len; i++) {
        if (kdata[i].id == ID) {
            return eval(kdata[i].code);
        }
    }
}
//----------------------------------------------------------------------------------------------
//战斗受到伤害前添加状态(在武器备注写: <SZN_Damage_State:状态ID> )
function act_w(id) { //解析注释
    try {
        var q = Number($gameActors.actor(id).weapons(0)[0].metaArray.SZN_Damage_State[0]);
        $gameActors.actor(id).addState(q);
    } catch (err) {} finally {}
}
var SZN_Game_Battler_onDamage = Game_Battler.prototype.onDamage;
Game_Battler.prototype.onDamage = function (value) { //受到伤害时
    SZN_Game_Battler_onDamage.call(this, value);
    act_w(this._actorId);
    /*     this.chargeTpByDamage(value / this.mmp); */
};
//----------------------------------------------------------------------------------------------
//战斗拓展
var SKILL_ID = 1;
var THIS_PERSON = 0;
var KUR_find = [];

function CheckNote(tag) { //查看注释是否存在并储存
    KUR_find = [];
    try {
        var per = THIS_PERSON.notetags();
        var len = per.length;
        for (var i = 0; i < len; i++) {
            if (per[i].indexOf(tag) == -1) {
                continue;
            } else {
                KUR_find.push(per[i]);
            };
        };
        return KUR_find.length;
    } catch (error) {
        return 0;
    };
};
var KUR_Sprite_Animation_setup = Sprite_Animation.prototype.setup;
Sprite_Animation.prototype.setup = function (target, animation, mirror, delay) {
    if (CheckNote("KUR_SkillHue")) { //技能ID色调
        var kf;
        for (var i = 0; i < KUR_find.length; i++) {
            kf = KUR_find[i].split(',');
            if (Number(kf[0].split(':')[1]) == SKILL_ID.id) {
                animation.animation1Hue = Number(kf[1]);
                animation.animation2Hue = Number(kf[2].substring(0, kf[2].length - 1));
                break;
            } else {
                continue;
            };
        };
    };
    KUR_Sprite_Animation_setup.call(this, target, animation, mirror, delay);
};
var KUR_Game_Action_setEnemyAction = Game_Action.prototype.setEnemyAction;
Game_Action.prototype.setEnemyAction = function (action) { //设置敌人动作
    KUR_Game_Action_setEnemyAction.call(this, action);
    last_use_skill_id = action.skillId;
};
var KUR_Game_Enemy_selectAllActions = Game_Enemy.prototype.selectAllActions;
Game_Enemy.prototype.selectAllActions = function (actionList) { //选择动作
    KUR_Game_Enemy_selectAllActions.call(this, actionList);
    this._use_skill_id = this._last_USE_Skill_Id;
    this._last_USE_Skill_Id = last_use_skill_id;
};
var KUR_Game_BattlerBase_paySkillCost = Game_BattlerBase.prototype.paySkillCost;
Game_BattlerBase.prototype.paySkillCost = function (skill) { //技能花费
    THIS_PERSON = this;
    KUR_Game_BattlerBase_paySkillCost.call(this, skill);
    SKILL_ID = skill;
};

function KUR_GAME() {
    this.initialize.apply(this, arguments);
};
KUR_GAME.prototype._get_use_skill = function () { //获取当前使用技能ID
    return SKILL_ID;
}
KUR_GAME.prototype._target = function () { //目标获取
    return BattleManager._targets;
};
KUR_GAME.prototype._last_Actor = function () { //上一个角色
    return BattleManager.actor();
};
KUR_GAME.prototype._last_target = function () { //上一个目标
    var Last = KUR_GAME.prototype._target();
    return Last[Last.length - 1];
};
KUR_GAME.prototype._last_Actor_Skill = function () { //上次角色使用的技能ID
    var a;
    try {
        a = KUR_GAME.prototype._last_Actor().lastBattleSkill();
    } catch (e) {
        return null;
    }
    return a;
};
KUR_GAME.prototype._last_target_Skill_id = function () { //上一个使用技能的目标ID
    try {
        var last = KUR_GAME.prototype._last_target();
        if (last.isActor()) {
            return last._last_USE_Skill_Id;
        } else {
            return KUR_GAME.prototype._last_Actor_Skill().id;
        }
    } catch (e) {};
};
var id = 0;
KUR_GAME.prototype._start = function (str) { //拓展集成
    switch (str) {
        case "onDamage":
            Effect.prototype.UseSkillonState(KUR_GAME.prototype._last_target());
            break;
        case "star_event":
            break;
        case "onDamae":

            break;
        case "onDamge":

            break;
    };
};

function KUR_Data() {
    this.initialize.apply(this, arguments);
};
KUR_example = {};
KUR_Data.copy = function (target) { //复制对象
    KUR_example = Object.assign(Object.create(Object.getPrototypeOf(target)), target);
};
KUR_Data.isempty = function (obj) {
    return false;
};
KUR_Data.example = function (target) { //数据模板
    KUR_Data.copy(eval(KUR.to$(target) + "[config.example]"));
    KUR_example.id = KUR.GetStaticLength(target) + eval("KUR_" + target + ".length");
    return KUR_example;
};
var KUR_DATA_ADD_item = {};
KUR_Data.add = function (target = {}, to = "") { //向$dataxxx添加对象
    if (!KUR_Data.isempty(target)) {
        KUR_DATA_ADD_item = target;
        eval(KUR.to$(to) + '[' + target.id + ']' + "=KUR_DATA_ADD_item;");
        return true;
    } else {
        return false;
    }
};
KUR_Data.create = function (target) { //获取基本数据模板
    eval("KUR_" + target + ".push(KUR_Data.example(\"" + target + "\"));");
    return eval("KUR_" + target + "[KUR_" + target + ".length-1];");
};
KUR_Data.CreateBasic = function (target) { //获取基本数据模板
    return KUR_Data.create(target);
};
KUR_Data.Create_ = {};
KUR_Data.Reload_ = function (target, mode = "") { //数据重新装载到$data
    if (mode == "") {
        KUR.reload(target);
    } else if (mode == "all") {
        var len = KUR_json_name.length;
        for (var i = 0; i < len; i++) {
            KUR.reload(KUR_json_name[i]);
        };
    };
};
KUR_Data.Save_ = function (target, mode = "") { //数据保存
    KUR.Save(target, mode);
};
//各种数据创建
KUR_Data.BasicConfig = { //基本模板
    "item": {
        _typename: "item",
        data: null
    },
    "actor": {
        _typename: "actor",
        data: null
    },
    "skill": {
        _typename: "skill",
        data: null
    },
    "armor": {
        _typename: "armor",
        data: null
    },
    "weapon": {
        _typename: "weapon",
        data: null
    },
    "enemy": {
        _typename: "enemy",
        data: null
    },
    "state": {
        _typename: "state",
        data: null
    },
    "class": {
        _typename: "class",
        data: null
    },
};
KUR_Data.Create_.BasicTemplate = function (target) { //获取基本数据模板
    KUR_Data.BasicConfig[target].data = KUR_Data.example(target);
    return KUR_JS.CreateObject(KUR_Data.BasicConfig[target]);
};
KUR_Data.CreateData = function (target) { //创建数据
    var types = target._typename;
    eval("KUR_" + types + ".push(target.data);");
    KUR_Data.Reload_(types);
    KUR_Data.Save_(types); //如果想手动保存请删除这一行
};
KUR_JS._CreateData = function (target) { //创建数据
    KUR_Data.CreateData(target);
};
KUR_JS._CreateBasicDataTemplate = function (target) { //获取基本数据模板
    return KUR_Data.Create_.BasicTemplate(target);
};

function KUR_Battle() {
    this.initialize.apply(this, arguments);
};
var KUR_GameBattler_onDamage = Game_Battler.prototype.onDamage;
Game_Battler.prototype.onDamage = function (value) {
    KUR_GameBattler_onDamage.call(this, value);
    KUR_GAME.prototype._start("onDamage");
};
KUR_Battle.prototype._onDamage_addState = function (id) {
    var num = KUR_GAME.prototype._target().length;
    for (i = num; i < num; i++) {
        BattleManager._targets[i].addState(id);
    };
};
var KUR_Sprite_Damage_prototype_initialize = Sprite_Damage.prototype.initialize;
Sprite_Damage.prototype.initialize = function () {
    KUR_Sprite_Damage_prototype_initialize.call(this);
    var k_hue = 0;
    if (CheckNote("KUR_DamageHue")) {
        var kf;
        for (var i = 0; i < KUR_find.length; i++) {
            kf = KUR_find[i].split(',');
            if (Number(kf[0].split(':')[1]) == SKILL_ID.id) {
                k_hue = Number(kf[1].substr(0, kf[1].length - 1));
                break;
            } else {
                continue;
            };
        };
    };
    this._damageBitmap = ImageManager.loadSystem('Damage', k_hue);
};
//----------------------------------------------------------------------------------------------
//效果
function Effect() {
    this.initialize.apply(this, arguments);
};
Effect.prototype.UseSkillonState = function (target) { //技能状态
    var skill_id = KUR_GAME.prototype._get_use_skill().id; //TOOD
    if (skill_id == 0) {
        return;
    }
    var st = false;
    var if_, add_;
    try {
        if_ = to_number($dataSkills[skill_id].meta.SZN_if_state.split(' '));
        add_ = to_number($dataSkills[skill_id].meta.SZN_add_state.split(' '));
    } catch (e) {
        return;
    }
    var len_i = if_.length;
    var len_a = add_.length;
    var s = target.states();
    var s_l = s.length;
    for (i = 0; i < len_i; i++) {
        for (j = 0; j < s_l; j++) {
            if (s[j].id == if_[i]) {
                st = true;
            }
        }
    }
    if (st) {
        for (i = 0; i < len_a; i++) {
            target.addState(add_[i]);
        }
    }
}
//----------------------------------------------------------------------------------------------
//(可删除)角色能级
if (config.Eadd) {
    function szn_Eadd(actor) {
        return actor.agi + actor.atk + actor.def + actor.mdf + actor.mat + actor.mhp + actor.mmp
    }
    var SZN_Window_drawActorSimpleStatus = Window_Base.prototype.drawActorSimpleStatus;
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
}
//----------------------------------------------------------------------------------------------
//(可删除)等级位置优化
Window_Base.prototype.drawActorLevel = function (actor, x, y) { //修改等级位置
    this.changeTextColor(this.systemColor());
    this.drawText(TextManager.levelA, x, y, 48);
    this.resetTextColor();
    this.drawText(actor.level, x + 40, y, parseInt(window.innerWidth / 7), 'lift');
};
//----------------------------------------------------------------------------------------------
//最大TP
Game_BattlerBase.prototype.maxTp = function () {
    return config.Smaxtp;
};
//----------------------------------------------------------------------------------------------
//特殊函数
function KUR_EXE() {
    this.initialize.apply(this, arguments);
};
KUR_EXE.prototype.initialize = function () {

};
KUR_EXE.prototype.DetectMapEventID_XY = function (x, y, id) { //检测位于(x,y)的事件ID
    var ID = KUR.prototype._getxy.MapEventId(x, y);
    if (!ID) {
        return ID;
    } else {
        if (id == ID) {
            return true;
        } else {
            return false;
        }

    }
};
var EVENT_MAP = function () {};
var EVENT_ID = 0;
KUR_EXE.prototype.MOVE_XY_ID = function (x, y, id, SET_ID, eventid) { //事件移动检测
    EVENT_ID = SET_ID;
    EVENT_MAP = function () {
        if (!KUR_EXE.prototype.DetectMapEventID_XY(x, y, id)) {} else {
            KUR.prototype.EXE_E();
            $gameTemp.reserveCommonEvent(eventid);
            return;
        }
    }
    KUR.prototype.EXE_S("EVENT_MAP();");
};
var ERROR_MESSAGE = 0;

function CheckFile(file) { //文件检查
    var BOOL;
    fs.access("./KUR_DATA/" + file + ".json", fs.constants.F_OK, (err) => {
        console.log(`${file} ${err ? (BOOL=false) : (BOOL=true)}`);
        if (BOOL) {
            return;
        } else {
            if (!ERROR_MESSAGE) {
                cout("第一次运行此插件会自动创建必要文件.");
            };
            ERROR_MESSAGE++;
            var fs_ = fs.createWriteStream("./KUR_DATA/" + file + ".json");
            fs_.write("[]");
            cout("文件" + file + ".json不存在,自动创建");
        };
    });

};

function FileCheck() { //文件检查
    fs.mkdir("KUR_DATA");
    var len = KUR_json_name.length;
    for (var i = 0; i < len; i++) {
        CheckFile(KUR_json_name[i]);
    };
};
//----------------------------------------------------------------------------------------------
//加载
var count_load = 0;


function GAME_DATA_LOAD() { //数据加载
    FileCheck();
    ReadLength()
    KUR.Json();
    KUR.Load_json_length();
    if (ERROR_MESSAGE) {
        return GAME_DATA_LOAD();
    };
};

function START_LOAD() { //开始加载JSON
    if (!count_load) {
        GAME_DATA_LOAD();
    }
    KUR.prototype._sleep(config.LOAD_TIME, "KUR_Data.Reload_(\"\", \"all\");");

};
var KUR_LOAD_ = SceneManager.onSceneStart;
var time_load = 0;
SceneManager.onSceneStart = function () {
    KUR_LOAD_.call(this);
    if (!config.ismobile) {
        START_LOAD();
    };
    count_load++;
};

//(可删除)js文件处理json
function OutJsToJson() {
    try {
        var len = $plugins.length;
        var str = "";
        for (var i = 0; i < len; i++) {
            str = str + "$" + "START:" + $plugins[i].name + ":FINAL";
        }
        szn_file_output(str, "plugins");
        return 1;
    } catch (e) {
        return 0;
    };
};
var _databaseFiles = [{
        name: '$dataItems',
        src: 'data/Items.json'
    },
    {
        name: '$dataArmors',
        src: 'data/Armors.json'
    },
    {
        name: '$dataSkills',
        src: 'data/Skills.json'
    },
    {
        name: '$dataActors',
        src: 'data/Actors.json'
    },
    {
        name: '$dataWeapons',
        src: 'data/Weapons.json'
    },
    {
        name: '$dataStates',
        src: 'data/States.json'
    },
    {
        name: '$dataEnemies',
        src: 'data/Enemies.json'
    },
    {
        name: '$dataTroops',
        src: 'data/Troops.json'
    },
    {
        name: '$dataClasses',
        src: 'data/Classes.json'
    }
];

var datalength = [];

function ReadLength() {
    try {
        for (var i = 0; i < _databaseFiles.length; i++) {
            datalength.push(JSON.parse(fs.readFileSync(_databaseFiles[i].src).toString()).length);
        };
    } catch (error) {};
};
(function () {
    try {
        $.getJSON("debug.json", function (data) {
            KUR.prototype.GAMEDATA.DEBUG = data;
        });
    } catch (e) {};
}());
//----------------------------------------------------------------------------------------------
var $kur = { //引用
    KUR,
    KUR_Battle,
    KUR_DEBUG,
    KUR_EXE,
    KUR_GAME,
    KUR_Data,
    Effect,
    KUR_JS,
};