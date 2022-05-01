//=============================================================================
// KUR_Expand.js	2022/03/15
// Copyright (c) 2022 KURZER
//=============================================================================
/*:
 * @plugindesc [v1.66] 拓展
 * @author KURZER
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
 * 
 * @param WindowActor
 * @desc 是否开启数据窗口
 * 默认值：1
 * @default 1
 * 
 * @param WindowActorAttribute
 * @desc 窗口名
 * 默认值：额外数据
 * @default 额外数据
 * 
 * @param WindowActorAttribute_max
 * @desc 每列最大变量长度个数
 * 默认值：9
 * @default 9
 * 
 * @param WindowActorAttribute_x_offset
 * @desc 变量名-偏移量
 * 默认值：200
 * @default 200
 * 
 * @param WindowActorAttribute_x_next_offset
 * @desc 变量数值-偏移量
 * 默认值：100
 * @default 100
 * 
 * @help 
 * ============================================================================      
 * [如果不需要某些功能,请自行在插件注释掉]
 * ============================================================================
 * 注意:确保MV版本为1.6以上!!!
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
 * 消息提示请再JS内搜索 "const message_plu_" ... 自行修改.
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
 * (可以使用config_3.example=number;)来修改模板ID
 * (注意::本功能目前在移动端无效(在移动端除了此功能外其它功能都生效),只适用于桌面端>>
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
 * 9.角色数据显示
 * 
 * 在角色备注使用以下格式来显示(注意:不允许空行!!!)
 * 在菜单栏对应的选项内查看显示
 * 
 * <KUR_KAA>
 * [name0,value0]
 * [name1,value1]
 * [name2,value2,color]
 * ...
 * </KUR_KAA>
 * 
 * 例如
 * <KUR_KAA>
 * ["金钱",$gameParty.gold()]
 * ["a"+"b",7+8]
 * ["232323","你好","#FFFF00"]
 * ...
 * </KUR_KAA>
 * 
 * 颜色查询:https://www.sojson.com/rgb.html
 * 
 * ---------------------------------------------------------------------------- 
 * 10.Code
 * 
 * 
 * I:战斗每次行动执行
 * 
 * 在角色备注里填入
 * 
 * <KUR_CODE[n]>
 * 
 * ...(使用 target 指代行动者)
 * 
 * </KUR_CODE[n]>
 * 
 * n = 0,1,2,3,4
 * 
 * 0:每次行动结束
 * 1:行动开始前
 * 2:行动开始后
 * 3:行动中
 * 4:行动结束前
 * 
 * 
 * II:每次使用技能/物品时执行
 * 
 * 在备注里填入
 * 
 * <KUR_CODE>
 * ...(使用 target 指代目标)
 * </KUR_CODE>
 * 
 * (可以使用$gameParty.inBattle()来区别战斗与非战斗)
 * 
 * [注意!请不要使用target_作为变量名!]
 * [使用请注意不是无效技能或物品,例如技能伤害为0]
 * ---------------------------------------------------------------------------- 
 * END.其它
 * 
 * 使用KUR_...来查看
 * 
 * ---------------------------------------------------------------------------- 
 * 如有BUG请反馈
 * QQ 3528609938
 * ----------------------------------------------------------------------------*/
//  var blm = function(filter, cp) {
//         filter.blur = cp[0];
//         filter.bloomScale = 0.4;
//         filter.threshold = 0.8;
//         filter.brightness = cp[3];
//     };
var params = PluginManager.parameters("KUR_Expand");
//----------------------------------------------------------------------------------------------
//variables
const message_plu_2 = "已存在,转化为";
const message_plu_3 = "你获得的物品请在背包查看";
const message_plu_4 = "获得";
const message_plu_5 = "pt";
const message_plu_6 = "角色";

function isMobile() {
    if (window.navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i)) {
        return true; // 移动端
    } else {
        return false; // PC端
    }
};
//获取设置
var config_3 = {
    id1: Number(params["Prize ID"]) || 76, //抽奖物品ID
    Smaxtp: Number(params["MaxTp"]) || 100,
    example: Number(params["Universal template ID"]) || 200, //通用模板ID
    M1: Number(params["Encouragement Award"]) || "$gameParty.gainGold(M);", //鼓励奖
    error: Number(params["Error"]) || 0,
    Eadd: Number(params["Energy Level"]) || 0,
    load_time: Number(params["LoadTime"]) || 1000,
    time: Number(params["Time"]),
    hours: 65,
    time_stat: 0,
    ismobile: isMobile(),
    lottery: Number(params["Prize State"]) || 0,
    LOAD_TIME: Number(params["LOADTIME"]) || 2000,
    window_actor: Number(params["WindowActor"]),
    window_actor_name: params["WindowActorAttribute"] || "额外属性",
    window_actor_max: Number(params["WindowActorAttribute_max"]) || 9,
    window_actor_x_offset: Number(params["WindowActorAttribute_x_offset"]),
    window_actor_x_next_offset: Number(params["WindowActorAttribute_x_next_offset"]),
    battle_light: 0,
};
var config_3_2 = { //默认概率表
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
var _config_3_1 = { //这个是模板,请不要动第一个元素.
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

function ERROR_THOROUGH(err) { //错误抛出
    if (config_3.error) {
        return console.error(err);
    } else {
        return;
    };
};

function NoteTags(target) {
    if (target.isEnemy()) {
        return target.enemy().note.split(/[\r\n]+/)
    };
    if (target.isActor()) {
        return target.actor().note.split(/[\r\n]+/)
    };
};

function KUR_JS() {
    this.initialize.apply(this, arguments);
};
KUR_JS._Lottery = function (n, m) { //抽奖
    rad.rad(n, m);
};
KUR_JS._CreateProbabilityTable = function () { //创建慨率表
    return KUR_JS.CreateObject(_config_3_1);
};
KUR_JS.CreateObject = function (target) { //对象复制
    return Object.assign(Object.create(Object.getPrototypeOf(target)), target);
};
KUR_JS._LoadProbabilityTable = function (target) { //这里target必须是引用类型!!!
    config_3_2 = target;
};
KUR_JS._BasicName = function () { //基础名
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
//其它
function RandomNumber(max, min) { //随机数
    return Math.floor(Math.random() * (max - min)) + min
}
//----------------------------------------------------------------------------------------------

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
//加载数据使用
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
KUR.GetLength = function (item) { //获取数据长度
    return eval(KUR.to$(item) + ".length;");
};
KUR.GetStaticLength = function (target) { //获取数据原本长度
    return KUR_json_member_length[KUR.Find(KUR_json_name, target)];
};
KUR.Load_json_length = function () { //加载
    KUR_json_member_length = datalength;
    return true;
};
//JSON操作
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
KUR.prototype._cout = { //偷懒用
    c: function (message) {
        console.log(message);
    },
    e: function (message) {
        console.log(eval(message));
    }
};
var cout = KUR.prototype._cout.c;
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

function GameCommand(command, args) { //插件命令
    return Game_Interpreter.prototype.pluginCommand(command, args);
};
var STORE_ = KUR.prototype.STORE;
//------------------------------
//与MOG和shora light支持
var TIME__ = [0, 1, 2, 21, 22, 23];
var TIME__S = false;

function TIME_(time) { //时间检测
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
var KUR_t_h_ = 0;
var MapID = 0;
var KUR_TIME__ = DataManager.onLoad;
DataManager.onLoad = function (object) {
    KUR_TIME__.call(this, object);
    if (object === $dataMap) {
        try {
            object.meta.NOLIGHT == true ? (config_3.time_stat = 1) : (config_3.time_stat = 0);
        } catch (e) {};
    };
};
var time_loadfirst = 150;
var _kur_time_filter = 0;

function TIME_FILTER() { //滤镜设置
    try {
        var t_h = $gameVariables._data[config_3.hours];
        if (TIME_(t_h)) {
            if ($gameMap.enableFilter(0, 1)) {
                Set_Filter(1, 10, 0);
                Set_Filter(0, 0, 0);
            };
        } else {
            if (!$gameMap.enableFilter(0, 1)) {
                Set_Filter(1, 10, 0);
                if (!config_3.time_stat) {
                    Set_Filter(1, 0, 0);
                };
            };
        };
    } catch (e) {};

};

function TIME() { //时间控制
    try {
        if (KUR_t_h_ == time_loadfirst && !$gameParty.inBattle()) {
            var t_h = $gameVariables._data[config_3.hours];
            if (config_3.time_stat) {
                Set_Filter(0, 0, 0);
                GameCommand("ambient", ["#232323", "200"]);
            } else if (TIME_(t_h)) {
                GameCommand("ambient", ["#232323", "200"]);
            } else {
                GameCommand("ambient", ["#FFFFFF", "100"]);
            };
            TIME_FILTER();
            KUR_t_h_ = 0;
        };
        KUR_t_h_++;
    } catch (e) {};
};
KUR.prototype.update = SceneManager.update;
SceneManager.update = function () {
    KUR.prototype.update.call(this);
    if (config_3.time) {
        TIME();
    };
}
KUR.prototype.EXE_STATE = false;
KUR.prototype.EXE_S = function (EVAL_FUNCTION = "") { //偷梁换柱
    if (!KUR.prototype.EXE_STATE) {
        eval("SceneManager.update=function(){KUR.prototype.update.call(this);if (config_3.time) {TIME();};" + EVAL_FUNCTION + "}");
    } else {
        return;
    }
    KUR.prototype.EXE_STATE = true;
}
KUR.prototype.EXE_E = function () {
    KUR.prototype.EXE_STATE = false;
    eval("SceneManager.update=function(){KUR.prototype.update.call(this);if (config_3.time) {TIME();};}");
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
                    var id = config_3.id1;
                    var g = $gameActors._data[o];
                    var p = parseInt((g.agi + g.atk + g.def + g.mdf + g.mat + g.mhp + g.mmp) / g.level);
                    $gameMessage.add(message_plu_6 + String($gameActors._data[o]._name) + message_plu_2 + " " + String($dataItems[id].name) + "x" + String(p));
                    $gameParty.gainItem($dataItems[id], p, )
                }

                function message_addactor(o) {
                    lis.indexOf(o) == -1 ? $gameParty.addActor(o) : mad(o);

                }
                break;

        }


        function M1(M) {
            Ma += M;
            eval(config_3.M1);
        }

        function mo(m, y) {
            for (i = 0; i < m; i++) {
                q(y);
            };
            if (config_3.lottery) {
                $gameMessage.add(message_plu_4 + Ma + message_plu_5);
                $gameMessage.add(message_plu_3);
            };
        }
    },
    ui: config_3_2,
};
//----------------------------------------------------------------------------------------------
//战斗受到伤害前添加状态(在武器备注写: <SZN_Damage_State:状态ID> )
function SZN_Damage_State_act_w(id) { //解析注释
    try {
        var q = Number($gameActors.actor(id).weapons(0)[0].metaArray.SZN_Damage_State[0]);
        $gameActors.actor(id).addState(q);
    } catch (err) {};
};
var SZN_Game_Battler_onDamage = Game_Battler.prototype.onDamage;
Game_Battler.prototype.onDamage = function (value) { //受到伤害时
    SZN_Game_Battler_onDamage.call(this, value);
    SZN_Damage_State_act_w(this._actorId);
};
//----------------------------------------------------------------------------------------------
//战斗拓展
var SKILL_ID = 1;
var THIS_PERSON = 0;
var KUR_find = [];
var KUR_BattleManager_endBattle = BattleManager.endBattle;
var KUR_BattleManager_setup = BattleManager.setup;
BattleManager.setup = function (troopId, canEscape, canLose) {
    KUR_BattleManager_setup.call(this, troopId, canEscape, canLose);
};
BattleManager.endBattle = function (result) {
    KUR_BattleManager_endBattle.call(this, result);
};

function CheckNote(tag) { //查看注释是否存在并储存
    KUR_find = [];
    try {
        var per = NoteTags(THIS_PERSON);
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
    KUR_Data.copy(eval(KUR.to$(target) + "[config_3.example]"));
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
KUR_Data.Basicconfig_3 = { //基本模板
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
    KUR_Data.Basicconfig_3[target].data = KUR_Data.example(target);
    return KUR_JS.CreateObject(KUR_Data.Basicconfig_3[target]);
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
Sprite_Damage.prototype.initialize = function () { //伤害颜色
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
    KUR_CODE(0, 1, target);
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
if (config_3.Eadd) {
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
    return config_3.Smaxtp;
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
//WINDOW
var KUR_find_kaa;

function CheckNote_KAA(tag) { //检查note
    KUR_find_kaa = [];
    try {
        var per = NoteTags(KAA_THIS_ACTOR);
        var len = per.length;
        for (var i = 0; i < len; i++) {
            if (per[i].indexOf(tag) == -1) {
                continue;
            } else {
                KUR_find_kaa.push(i);
            };
        };
        if (KUR_find_kaa.length == 0) {
            return 0;
        } else {
            var l1 = KUR_find_kaa[0] + 1;
            var l2 = KUR_find_kaa[1];
            KUR_find_kaa = [];
            for (; l1 < l2; l1++) {
                KUR_find_kaa.push(per[l1]);
            };
            return 1;
        };
    } catch (error) {
        return 0;
    };

};
//------------------------------
//角色数据面版
var KUR_Window_MenuCommand_addMainCommands = Window_MenuCommand.prototype.addMainCommands;
Window_MenuCommand.prototype.addMainCommands = function () { //添加命令
    KUR_Window_MenuCommand_addMainCommands.call(this);
    if (config_3.window_actor) {
        this.addCommand(config_3.window_actor_name, "KUR_ACTOR_ATTRIBUTE", 1);
    };
};
//------------------------------
var _Scene_Menu_createCommandWindow = Scene_Menu.prototype.createCommandWindow;
Scene_Menu.prototype.createCommandWindow = function () {
    _Scene_Menu_createCommandWindow.call(this);
    this._commandWindow.setHandler("KUR_ACTOR_ATTRIBUTE", this.actorAttribute.bind(this));
};
Scene_Menu.prototype.actorAttribute = function () {
    this._statusWindow.setFormationMode(false);
    this._statusWindow.selectLast();
    this._statusWindow.activate();
    this._statusWindow.setHandler('ok', this.kaa_ok.bind(this));
    this._statusWindow.setHandler('cancel', this.kaa_cancel.bind(this));
};
Scene_Menu.prototype.kaa_ok = function () {
    SceneManager.push(KUR_KAA);
};
Scene_Menu.prototype.kaa_cancel = function () {
    this._statusWindow.deselect();
    this._commandWindow.activate();
};

Window_MenuStatus.prototype.processOk = function () {
    $gameParty.setMenuActor($gameParty.members()[this.index()]);
    Window_Selectable.prototype.processOk.call(this);
};
//----------------------------------------------------------------
function KUR_KAA() {
    this.initialize.apply(this, arguments);
}

KUR_KAA.prototype = Object.create(Scene_MenuBase.prototype);
KUR_KAA.prototype.constructor = KUR_KAA;

KUR_KAA.prototype.initialize = function () {
    Scene_MenuBase.prototype.initialize.call(this);
};

KUR_KAA.prototype.create = function () {
    Scene_MenuBase.prototype.create.call(this);
    this._statusWindow = new Window_kaa();
    this._statusWindow.setHandler('cancel', this.popScene.bind(this));
    this._statusWindow.setHandler('pagedown', this.nextActor.bind(this));
    this._statusWindow.setHandler('pageup', this.previousActor.bind(this));
    this._statusWindow.reserveFaceImages();
    this.addWindow(this._statusWindow);
};

KUR_KAA.prototype.start = function () {
    Scene_MenuBase.prototype.start.call(this);
    this.refreshActor();
};

KUR_KAA.prototype.refreshActor = function () {
    var actor = this.actor();
    this._statusWindow.setActor(actor);
};

KUR_KAA.prototype.onActorChange = function () {
    this.refreshActor();
    this._statusWindow.activate();
};
//------------------------------
var KAA_THIS_ACTOR;

function Window_kaa() {
    this.initialize.apply(this, arguments);
}

Window_kaa.prototype = Object.create(Window_Selectable.prototype);
Window_kaa.prototype.constructor = Window_kaa;

Window_kaa.prototype.initialize = function () {
    var width = Graphics.boxWidth;
    var height = Graphics.boxHeight;
    Window_Selectable.prototype.initialize.call(this, 0, 0, width, height);
    this._actor = null;
    this.refresh();
    this.activate();
};

Window_kaa.prototype.setActor = function (actor) {
    if (this._actor !== actor) {
        this._actor = actor;
        KAA_THIS_ACTOR = this._actor;
        this.refresh();
    }
};

Window_kaa.prototype.refresh = function () {
    this.contents.clear();
    if (this._actor) {
        var lineHeight = this.lineHeight();
        this.drawBlock1(lineHeight * 0);
        this.drawHorzLine(lineHeight * 1);
        this.drawParameters(48, lineHeight * 2);
    }
};

Window_kaa.prototype.drawBlock1 = function (y) {
    this.drawActorName(this._actor, 6, y);
    this.drawActorClass(this._actor, 192, y);
    this.drawActorNickname(this._actor, 432, y);
};

Window_kaa.prototype.drawHorzLine = function (y) {
    var lineY = y + this.lineHeight() / 2 - 1;
    this.contents.paintOpacity = 48;
    this.contents.fillRect(0, lineY, this.contentsWidth(), 2, this.lineColor());
    this.contents.paintOpacity = 255;
};

Window_kaa.prototype.lineColor = function () {
    return this.normalColor();
};

Window_kaa.prototype.drawParameters = function (x, y) { //绘制数据
    if (CheckNote_KAA("KUR_KAA")) {
        var lineHeight = this.lineHeight();
        var kaa = KUR_find_kaa;
        var lines = 1;
        for (var i = 0; i < KUR_find_kaa.length; i++) {
            if ((i % (config_3.window_actor_max * lines)) != i) {
                lines++;
            };
            var y2 = y + lineHeight * (i % config_3.window_actor_max);
            var kaa_ = eval(kaa[i]);
            this.changeTextColor(kaa_.length > 2 ? kaa_[2] : this.systemColor());
            this.drawText(kaa_[0], x + config_3.window_actor_x_offset * (lines - 1), y2, Graphics.boxWidth);
            this.resetTextColor();
            this.drawText(kaa_[1], x + config_3.window_actor_x_next_offset + (lines - 1) * config_3.window_actor_x_offset, y2, Graphics.boxWidth, 'left');
        };
    };
};
//------------------------------
//TRAITS
function GetTraits(ID) { //特性获取
    return $dataActors[ID].traits;
};

function AddTrait(ActorId, Code, DataId, Value) { //添加特性
    GetTraits(ActorId).push({
        code: Code,
        dataId: DataId,
        value: Value
    });
};

function LOAD_SAVE() { //储存至System
    try {
        if (typeof ($gameSystem.KUR) == "undefined") {
            $gameSystem.KUR = {};
        };
    } catch (e) {};
};
var __trait = {
    code: 0,
    dataId: 0,
    value: 0
};
var _kur_trait = {
    TRAIT_ELEMENT_RATE: 11,
    TRAIT_DEBUFF_RATE: 12,
    TRAIT_STATE_RATE: 13,
    TRAIT_STATE_RESIST: 14,
    TRAIT_PARAM: 21,
    TRAIT_XPARAM: 22,
    TRAIT_SPARAM: 23,
    TRAIT_ATTACK_ELEMENT: 31,
    TRAIT_ATTACK_STATE: 32,
    TRAIT_ATTACK_SPEED: 33,
    TRAIT_ATTACK_TIMES: 34,
    TRAIT_STYPE_ADD: 41,
    TRAIT_STYPE_SEAL: 42,
    TRAIT_SKILL_ADD: 43,
    TRAIT_SKILL_SEAL: 44,
    TRAIT_EQUIP_WTYPE: 51,
    TRAIT_EQUIP_ATYPE: 52,
    TRAIT_EQUIP_LOCK: 53,
    TRAIT_EQUIP_SEAL: 54,
    TRAIT_SLOT_TYPE: 55,
    TRAIT_ACTION_PLUS: 61,
    TRAIT_SPECIAL_FLAG: 62,
    TRAIT_COLLAPSE_TYPE: 63,
    TRAIT_PARTY_ABILITY: 64,
    FLAG_ID_AUTO_BATTLE: 0,
    FLAG_ID_GUARD: 1,
    FLAG_ID_SUBSTITUTE: 2,
    FLAG_ID_PRESERVE_TP: 3,
    ICON_BUFF_START: 32,
    ICON_DEBUFF_START: 48,
};
var _kur_params = {
    MHP: 0,
    MMP: 1,
    ATK: 2,
    DEF: 3,
    MAT: 4,
    MDEF: 5,
    AGI: 6,
    LUK: 7
};

function AddParam(ActorId, paramId, value) { //属性操作
    $gameActors.actor(ActorId).addParam(paramId, value);
};
//----------------------------------------------------------------------------------------------
//加载
var count_load = 0;
var __COPY = KUR_JS.CreateObject;

function GAME_DATA_LOAD() { //数据加载
    FileCheck();
    ReadLength()
    KUR.Json();
    KUR.Load_json_length();
    if (ERROR_MESSAGE) {
        return GAME_DATA_LOAD();
    };
};
var _kur_load_filter = 0;

function START_LOAD() { //开始加载JSON
    if (!$gameParty.inBattle()) {
        if (!count_load) {
            GAME_DATA_LOAD();
        };
        KUR.prototype._sleep(config_3.LOAD_TIME, "KUR_Data.Reload_(\"\", \"all\");");
        LOAD_SAVE();
        TIME_FILTER();
        if (!_kur_load_filter) {
            Set_Filter(0, 0, 0);
            Set_Filter(1, 10, 0);
            _kur_load_filter++;
        };
    };
};

function KUR_FILTER_1() {
    try {
        if (!$gameTemp._shiftfilter.length) {
            $gameTemp.createshiftfilter(300, 250, 1000, 00, 999999, 2);
        };
    } catch (error) {};
};
var KUR_LOAD_ = SceneManager.onSceneStart;
var time_load = 0;
SceneManager.onSceneStart = function () {
    if (!SceneManager._exiting) {
        KUR_FILTER_1();
    };
    KUR_LOAD_.call(this);
    if (!config_3.ismobile) {
        START_LOAD();
    };
    count_load++;
};
//----------------------------------------------------------
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

function ReadLength() { //读取数据文件
    try {
        for (var i = 0; i < _databaseFiles.length; i++) {
            datalength.push(JSON.parse(fs.readFileSync(_databaseFiles[i].src).toString()).length);
        };
    } catch (error) {};
};
(function () { //读取debug文件
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
    KUR_EXE,
    KUR_GAME,
    KUR_Data,
    Effect,
    KUR_JS,
};
//滤镜名
var _kur_filter = [{
    id: 0,
    name: "godray" //often
}, {
    id: 1,
    name: "ascii"
}, {
    id: 2,
    name: "crosshatch"
}, {
    id: 3,
    name: "dot"
}, {
    id: 4,
    name: "emboss" //often
}, {
    id: 5,
    name: "shockwave"
}, {
    id: 6,
    name: "zoomblur"
}, {
    id: 7,
    name: "noise"
}, {
    id: 8,
    name: "blur"
}, {
    id: 9,
    name: "oldfilm" //often
}, {
    id: 10,
    name: "bloom" //often
}, {
    id: 11,
    name: "godray-np"
}, {
    id: 12,
    name: "reflection-w"
}, {
    id: 13,
    name: "reflection-m"
}, {
    id: 14,
    name: "crt"
}];

function Set_Filter(mode_, id, mode = 0) { //滤镜设置
    try {
        if (mode_) {
            $gameMap.createFilter(id, _kur_filter[id].name, mode);
        } else {
            $gameMap.eraseFilterAfterMove(id);
        };
    } catch (error) {};
};

function KUR_CODE(tag, tag1 = 0, target = 0) { //字符串解析
    try {
        if (!tag1) {
            if (BattleManager.isInTurn() || BattleManager.isTurnEnd()) {
                var members = BattleManager.allBattleMembers();
                for (var i = 0; i < members.length; i++) {
                    var codes = [];
                    var sub = [];
                    var note = NoteTags(members[i]);
                    for (var j = 0; j < note.length; j++) {
                        if (note[j].indexOf(tag) == -1) {
                            continue;
                        } else {
                            sub.push(j);
                        };
                    };
                    if (!sub.length) {
                        continue;
                    };
                    var l1 = 1 + sub[0];
                    var l2 = sub[1];
                    for (; l1 < l2; l1++) {
                        codes.push(note[l1]);
                    };
                    KUR_CODE_EVAL(codes, members[i], tag);
                };
            };
        } else {
            KUR_CODE_SKILL(target);
        };
    } catch (error) {};
};

function KUR_CODE_SKILL(target_) { //执行CODE
    var note = $dataSkills[KUR_GAME.prototype._get_use_skill().id].note;
    var start = note.indexOf("<KUR_CODE>");
    if (start == -1) {
        return;
    };
    note = note.substring(start + 10, note.indexOf("</KUR_CODE>"));
    try {
        eval("var target=target_;" + note);
    } catch (error) {
        cout(error);
    };
};

function KUR_CODE_EVAL(code, target_, tag) { //执行CODE
    if ((tag == "KUR_CODE[0]") && BattleManager.isTurnEnd()) {
        var codes = "";
        for (var i = 0; i < code.length; i++) {
            codes += code[i];
        };
        try {
            eval("var target=target_;" + codes);
        } catch (error) {
            cout(error);
        };
    } else if (tag != "KUR_CODE[0]") {
        var codes = "";
        for (var i = 0; i < code.length; i++) {
            codes += code[i];
        };
        try {
            eval("var target=target_;" + codes);
        } catch (error) {
            cout(error);
        };
    };
};
var KUR_CODE_BattleManager_startTurn = BattleManager.startTurn;
BattleManager.startTurn = function () { //检测
    KUR_CODE_BattleManager_startTurn.call(this);
    KUR_CODE("KUR_CODE[1]");
};
var KUR_CODE_BattleManager_processTurn = BattleManager.processTurn;
BattleManager.processTurn = function () { //检测
    KUR_CODE("KUR_CODE[2]");
    KUR_CODE_BattleManager_processTurn.call(this);
    KUR_CODE("KUR_CODE[3]");
};
var KUR_CODE_BattleManager_endTurn = BattleManager.endTurn;
BattleManager.endTurn = function () { //检测
    KUR_CODE("KUR_CODE[4]");
    KUR_CODE_BattleManager_endTurn.call(this);
    KUR_CODE("KUR_CODE[0]");
};

function KUR_CODE_ITEM(target_, subject) { //执行CODE
    if (subject._item._dataClass == "skill" && $gameParty.inBattle()) {
        return;
    };
    var note = subject.item().note;
    var start = note.indexOf("<KUR_CODE>");
    if (start == -1) {
        return;
    };
    note = note.substring(start + 10, note.indexOf("</KUR_CODE>"));
    try {
        eval("var target=target_;" + note);
    } catch (error) {
        cout(error);
    };
};
var KUR_TARGET = 0;
var KUR_TARGET_ITEM = 0;
var KUR_Game_Action_apply = Game_Action.prototype.apply;
Game_Action.prototype.apply = function (target) {
    KUR_Game_Action_apply.call(this, target);
    KUR_TARGET = target;
    KUR_TARGET_ITEM = this;
    KUR_CODE_ITEM(KUR_TARGET, KUR_TARGET_ITEM);
};
let sleepFun = function (fun, time) {
    setTimeout(function () {
        return fun();
    }, time);
};
