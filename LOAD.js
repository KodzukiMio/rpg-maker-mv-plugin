var time_load = performance.now();
//Base64 & MD5
var base64 = new Base64();

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
function KUR_TEXT_MESSAGE_RANDOM() {
    /*
    什么?
    什么事?
    还有工作要做?
    你好。
    你好啊。
    欢迎你。
    你好吗？
    怎么啦？
    跟我聊聊吧。
    你有事儿吗？
    很高兴见到你。
    想来点儿酒吗？
    你有什么事儿吗？
    我能为你做点什么？
    再见。
    保重。
    旅途平安。
    一路走好。
    待会儿见。
    多加小心。
    小心点儿！
    这可不好笑。
    你可真没趣儿。
    我有点儿烦你了。
    你认为那很可笑，是吗？
    我在听。
    我很荣幸。
    祝你平安。
    愿艾露恩与你同在。
    你来这里有什么事吗？
     小心。
    再见。
    保重。
    一路平安。
    愿女神保佑你。
    祝你好运，朋友。
    愿月神照亮你的道路。
    愿星辰指引你的道路.
    请随意。
    再见。
    就这样吧。
    别说废话了。
    你不是要走吗？
    你没有别的事情可干了吗？
    我生气的时候就有你好看了。
    嗯？
    有话快说。
    胜利就在眼前！
    你有什么事吗？
    我们会坚持到底！
    为了辛多雷的荣耀。
    黑暗的时代就要过去了。
    永恒的太阳指引着我们。
    我们的敌人必将被消灭！
     再见。
    一路走好。
    时间宝贵。
    要保持警惕。
    抬起你的头来。
    时刻做好准备。
    我们会报仇的！
    报仇指日可待了！
    记住太阳之井的耻辱。
    与我们作对就是死路一条！
    欢迎。
    你要找什么？
    不要浪费时间。
    世间万物都可以明码标价。
    小心点儿。
    你还要干什么？
    你在浪费我的时间。
    走开，讨厌的家伙！
    这可真是个黑暗的时代。
    我没多少耐心了。
    你能活这么久真是个奇迹。
    你智商不怎么高吧？
    啊，你活腻了吗？
    我不会轻易被蠢货惹怒的。
    什么？
    再活一天……
    你好啊，陌生人。
    我们幸存了下来。
    不能……放弃……
    陌生人，你需要什么？
    圣光。必须时刻牢记圣光。
     再会。
    再见。
    去吧。
    祝你好运。
    记得回来看看。
    祝你一切顺利。
    我能帮你什么忙吗？
    有什么你喜欢的吗？
    有你喜欢的东西吗？
    你想要什么？
    你在干什么？
    ＜叹气＞
    什么？
    走开！
    你很奇怪！
    欢迎，欢迎。
    我能为您提供什么服务？
    我很期待这次商事谈判。
    好了好了，我很用心地在听你说话。
    请不要扯我的绷带。
    别恭维我了。我是来做生意，不是来找乐子的。
    水乃生命之源。
    聆听河水的声音。
    河水预言了此次会面。
    河水颂扬着你的功绩。
    你听见河水的歌声了吗？
    再见。
    与水流同行吧。
    河水肆意流淌。
    不要惧怕逆流而行。
    愿你的池水永远满溢。
    水中蕴藏着智慧。也有其它东西，但主要是——智慧。
    祝你好运。
    一路平安。
    祝你长寿，我的朋友。
    这是什么地方？
    一定要阻止这些怪物！
    请救救我。
    这简直是噩梦！
    愿圣光保佑我们，远离这些灾难。
    他们在做什么？
    暗影蔽日。
    黑暗的风已经刮起。
    这诅咒打不垮我！
    离开了天空的我们，算是什么？
     一路小心。
    躲在阴影里。
    小心燃烧的天空。
    利爪之王指引着我们。
    伊利丹大人指引着我们。
    艾泽拉斯决不能陨落。
    我牺牲了一切，你又付出了什么？
    我这辈子都在为摧毁燃烧军团而奋斗。
    我们是防止燃烧军团毁灭这个世界的最后力量。
    记住，摧毁燃烧军团才是最重要的。
    如果后会无期，那么祝你死得其所。
    不要屈服于燃烧军团的淫威。
    相信伊利丹大人的计划。
    让燃烧军团去死吧.
    你刚才碰我了吗？
    如果我是你，就不会那么做。
    我通常只猎杀恶魔，但你将是个例外。
    你要再这样，我就把你的脑袋砍下来当磨刀石。
    你不是恶魔，可我一样能揍扁你。
    我要吞噬你的灵魂！
    有事吗？
    王子背叛了我们。
    一万年前，阿苏纳曾经非常美丽。
    法罗迪斯不该跟艾萨拉女王作对的。
    我们是被诅咒的孤魂野鬼，永世不得解脱。
    我是鬼魂，你碰不到我的！天才。
    你可以住手了！
    这真的很烦人！
    我有的是时间来复仇！
    不！哈哈哈哈……
    你好，旅行者。
    河流滋养万物。
    至高岭屹立不倒。
    这是飞翔的好日子。
    看看风把谁吹来了！
    你感觉到风向的变化了么？
    你好，旅行者。
    河流滋养万物。
    至高岭屹立不倒。
    这是飞翔的好日子。
    看看风把谁吹来了！
    你感觉到风向的变化了么？
    想要靠近点儿看吗？来吧，头槌！
    从这座山上摔下去的话，可不得了。
    我的角可不是摆设。
    要不要给你脸上来一蹄子？
    你比卓格巴尔还要坏。
    愿你迷失在地洞里。
    你想聊聊吗？
    你想要什么？
    我们的命运即将实现。
    暗夜井滋养着我们。
    我能帮你什么忙么？
    我们再也不用躲藏了。
    赞美艾利桑德的智慧。
    我们已经躲藏了太久了。
    我们又回到了星空之下。
    再会。
    快点回来。
    夏多雷必将崛起。
    我们的时代已经到来。
    愿星辰指引你的道路。
    你想来点什么？
    看看吧，我这什么都有。
    你看起来很年轻，还能玩这种把戏。你能为我考虑下吗？
    这是我从一个虚弱的斥候身上弄来的，他管这叫自拍神器。哦！你知道这是什么吗？
    我们将探索广阔的世界，告诉他们我们依然重要。
    苏拉玛仍然是大分裂的废墟中一颗闪亮的明珠。
    嗨！
    天空真漂亮！
    我没闯祸，对吧？
    想跟我们玩儿吗？但你得当坏人。
    你要来点儿魔力果汁吗？我喝饱了……
    有事汇报吗？
    碰到麻烦了？
    很高兴认识你。
    你真是气宇非凡。
    请问你有何贵干？
    海风带来了什么消息吗？
    事态很严重，是吗？
    恐怕和平再也不会降临。
    陆地上有什么消息吗？
    该起锚了。
    我将永远效忠。
    时刻留心，准备战斗。
    你有金币吗？
    有空再来。
    祝你旅途顺利。
    你就是满肚子坏水，是吧？
    你的船上大概只有一只船桨吧！
    你知道海怪肚子里长啥样吗？再不闭嘴就送你去参观！
    你难道真的没事可做了吗？什么事都找不到？
    你听到了吗？好像有人在叫你的名字，就在那儿！好像是急事！
    天哪，看看都几点了！啊，你要走了，对吗？
    你还没完没了了，是吗？
    你这幅末样可不太招人喜欢。
    救命！救命！有人骚扰我！
    你刚才朝我扔刀子了吧？
    啊哈，这是封建体制的固有暴力！
    救命！救命！有人骚扰我！
    管好你自己的事。
    陆地人，啊？
    这儿很少有游客。
    你好啊！不管你是先生，还是女士。
    靠近点儿，好好说话。
    我见过的东西，可以把你的壳儿都吓没了！
    我刚刚在读一部上好的卷轴。
    旅行的意义在于过程，而不在于结果。
    我的曾孙都比你大了。
    下次有空记得再来看看。
    下次给我讲点更好的故事。
    要是找到什么稀奇的宝贝，带给我看看。
    并不是海里所有的东西都像我这么英俊，像我这样好脾气。
    好，走吧，反正我也没什么想跟你说了。
    哦我的背疼死了。
    知识就是力量，愚蠢的知识除外，请尽量不要接触。
    这就要走了？这故事可有意思了，我才讲了个开头呢。
    你有什么古董想卖给我吗？至少得有两百年历史才行。
    知识是最棒的货币，但我也接受金币和有意思的玩意儿。
    我曾经被你讨厌的多的人骚扰过更长的时间。
    比耐心的话，你以为可以比得过我？
    你们这群人连语言都没有的时候，我就已经像现在这么老了！
    我离开安戈洛环形山，就是因为受不了你这种家伙。
    你觉得自己又强大又聪明——我龟壳里有一个地方，疼的时间比你们整个文明都长。
    */
};

function axf(max, min) { //随机数
    return Math.floor(Math.random() * (max - min)) + min
};
var KUR_Data_RandomMessage = KUR_TEXT_MESSAGE_RANDOM.toString().substring(40, 3056).split("\n");

function ShowRandomMessage() {
    try {
        $gameMessage.add(KUR_Data_RandomMessage[axf(KUR_Data_RandomMessage.length - 1, 0)]);
    } catch (error) {};
};
var szn_vul1 = szn_vul1 || parseInt(axf(10000000, 99999999)); //私用
var szn_vul2 = base64.encode(String(szn_vul1)); //私用
var Lb64 = LZString.decompressFromBase64;
var __ENABLE__ENCRYPT = 0; //Process >> TODO

var kur_cprocess;
try {
    kur_cprocess = require('child_process');
} catch (error) {};

function RunProcess(path, params) {
    kur_cprocess.execFile(path, params);
};
var __PATH = "";
var __SRC = "";
var KUR_COUNT = 0;
var KUR_count = 0;


function DataApply(path_ = __PATH) {
    if (!__ENABLE__ENCRYPT) {
        return 0;
    };
    __PATH = path_;
    if (!KUR_count) {
        KUR_count++;
        RunProcess("data.exe", [process.cwd() + "\\www\\data\\" + __PATH]);
    };
    if (isOk()) {
        KUR_COUNT = 0;
        KUR_count = 0;
        return __SRC;
    } else {
        if (KUR_COUNT >= 1000) {
            return 0;
        };
        KUR_COUNT++;
        return sleepFun(DataApply, 10);
    };
};

function isOk(path = "isOk.data") {
    if (!__ENABLE__ENCRYPT) {
        return 0;
    };
    var src = fs.readFileSync(path).toString();
    if (src == "OK") {
        fs.writeFile(path, "", function (err) {
            if (err) {
                ERROR_THOROUGH(err);
            };
        });
        __SRC = fs.readFileSync("load.json").toString();
        fs.writeFile("load.json", "", function (err) {
            if (err) {
                ERROR_THOROUGH(err);
            };
        });
        return 1;
    };
    return 0;
};
var kur_fs1, kur_fs2;
if (__ENABLE__ENCRYPT) {
    kur_fs1 = fs.createWriteStream("isOk.data");
    kur_fs1.write("");
    kur_fs2 = fs.createWriteStream("load.json");
    kur_fs2.write("");
};
//----------------------------------------------------------
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
//插件Debug
var SDEBUG = false;
if (true) {
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
                $gameTemp.reserveCommonEvent(5);

            }

        });
    } catch (e) {};
};


function szn_debug() {
    SDEBUG = true;
    var vConsole = new VConsole() || {};
};

function szn_de() { //use debug
    try {
        md5($gameActors._data[1]._name) == "5f4c478bc603a3281edb0b03f29ae372" ? szn_debug() : null;
    } catch (error) {};
};

function debug_load() {
    try {
        md5($gameActors._data[1]._name) == "5f4c478bc603a3281edb0b03f29ae372" ? $gameActors._data[1]._name = $dataActors[1].name : null;
    } catch (error) {};
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
    $gameTemp.reserveCommonEvent(5);
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
};