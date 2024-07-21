//=============================================================================
// Kurzer 3D Battle Engine Core
// KUR_BEC.js
//=============================================================================
/*:
 * @plugindesc Kurzer 3D Battle Engine Core [20240722]
 * @author Kurzer
 * @help
 * Kurzer的3D战斗引擎核心.
 * 无需引入任何库,无需任何前置插件,没有任何图片资源需求.
 * 兼容200+不同的插件,高度兼容性.
 * 只在在战斗界面下工作.
 * 
 * 50s性能监控,插件总开销时间(Self time):
 * YEP_CoreEngine 557.2ms 平均(11ms->CPU@4200mhz)
 * Olivia_BattleImpact 244.2ms 平均(4.4ms->CPU@4200mhz)
 * KUR_BEC 201ms 平均(4ms->4200mhz) (20ms->CPU@1050mhz)
 * 
 * 实际游戏中(CPU@4.2Ghz)与200+插件一起战斗界面平均每秒帧生成时间不到2ms
 * 
 * 注意:根据drill_up的标准属于<高消耗>插件.
 */
//Bitmap貌似只能用c2d用不了webgl,只能cpu硬算...
"use strict";
var Imported = Imported || {};
Imported.KUR_BEC = true;
var KUR = KUR || {};
(function () {
  KUR.BEC = KUR.BEC || {};
  KUR.Sleep = async function (delay) {
    return new Promise((resolve) => setTimeout(resolve, delay));
  };
  KUR.event = (function (fps = 30) {
    const GeventList = [];
    KUR.GeventID = 0;
    class Gevent {
      constructor(_Pfn) {
        this.pfn = _Pfn;
        this.id = KUR.GeventID++;
      }
    }
    function _pushRequest(pfn) {
      let event = new Gevent(pfn);
      GeventList.push(event);
      return event;
    }
    let _$$ = function (nodes) {
      _$$.push(nodes);
      return _$$;
    };
    _$$.LOCK = false;
    _$$.DER = parseInt(1000 / fps); //pre tick rate
    _$$.IMMEEVENT = [];
    function _pushIMMERequest(_pfn) {
      let event = { pfn: _pfn };
      _$$.IMMEEVENT.push(event);
      return event;
    }
    function _next() {
      if (!_$$.LOCK) {
        for (let i = 0; i < GeventList.length; i++) {
          if (_$$.IMMEEVENT.length)
            while (_$$.IMMEEVENT.length) _$$.IMMEEVENT.shift().pfn();
          GeventList[i].pfn();
        }
      }
    }
    //事件处理
    setInterval(() => {
      _next();
    }, _$$.DER);
    _$$.node = [];
    _$$.GeventList = [];
    //节点处理
    _$$.push = function (nodes) {
      _$$.node = [];
      _$$.node.push(nodes);
      return this;
    };
    //添加事件进入队列
    _$$.pushRequest = function (e) {
      _pushRequest(e);
      return this;
    };
    //添加立即事件进入队列(执行完删除)
    _$$.pushImmeRequest = function (e) {
      _pushIMMERequest(e);
      return this;
    };
    //参数检查
    _$$.check = function () {
      if (this.node) return true;
      throw new Error("Must Select Node");
    };
    //添加监听事件
    _$$.addEventListener = function (event, fn) {
      for (let i = 0; i < this.node.length; i++) {
        if (this.node[i].length != undefined) {
          for (let j = 0; j < this.node[i].length; j++)
            this.node[i][j].addEventListener(event, fn);
          continue;
        }
        this.node[i].addEventListener(event, fn);
      }
      return this;
    };
    //停止处理事件
    _$$.stop = function () {
      _$$.LOCK = true;
    };
    //继续处理事件
    _$$.start = function () {
      _$$.LOCK = false;
    };
    return _$$;
  })();
  KUR.dxdy = new Int8Array([0, -1, 0, 1, -1, 0, 1, 0]);
  KUR.astar_map = null;
  KUR.allow_continue = true;
  KUR.create2DPath = function (w, h) {
    let ret = [];
    for (let i = 0; i < h; ++i)ret.push(new Uint32Array(w));
    return ret;
  }
  KUR.Heap = class {
    constructor(_CmpFn = (up, down) => up < down) {
      this._CmpFn = _CmpFn;
      this.data = [null];
    }
    size() {
      return this.data.length - 1;
    }
    clear() {
      this.data = [null];
    }
    swap(idx1, idx2) {
      const temp = this.data[idx1];
      this.data[idx1] = this.data[idx2];
      this.data[idx2] = temp;
    }
    insert(value) {
      if (!value || typeof value.f === 'undefined') throw new Error("Invalid value inserted into heap");
      this.data.push(value);
      let pos = this.size();
      while (pos > 1) {
        const next = pos >> 1;
        if (this._CmpFn(this.data[next], value)) break;
        this.swap(next, pos);
        pos = next;
      }
      return this;
    }
    get() {
      if (!this.size()) return null;
      const rv = this.data[1];
      const lv = this.data.pop();
      if (this.size()) {
        this.data[1] = lv;
        let lp = 1, rp;
        while ((rp = lp << 1) <= this.size()) {
          if (rp + 1 <= this.size() && !this._CmpFn(this.data[rp], this.data[rp + 1])) ++rp;
          if (this._CmpFn(lv, this.data[rp])) break;
          [this.data[lp], lp] = [this.data[rp], rp];
        }
        this.data[lp] = lv;
      }
      return rv;
    }
  };
  KUR.press_alt = false;
  KUR.Camera = {
    subtract(a, b) {
      return [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
    },
    dot(a, b) {
      return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
    },
    cross(a, b) {
      return [
        a[1] * b[2] - a[2] * b[1],
        a[2] * b[0] - a[0] * b[2],
        a[0] * b[1] - a[1] * b[0],
      ];
    },
    multiplyScalar(vector, scalar) {
      return [vector[0] * scalar, vector[1] * scalar, vector[2] * scalar];
    },
    multiply2Scalar(vec2, s2) {
      return [vec2[0] * s2[0], vec2[1] * s2[1]];
    },
    add(a, b) {
      return [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
    },
    normalize(a) {
      const magnitude = Math.sqrt(a[0] * a[0] + a[1] * a[1] + a[2] * a[2]);
      return [a[0] / magnitude, a[1] / magnitude, a[2] / magnitude];
    },
    camera(point3, position, target, up, fov, near = 1, far = 1000, width = Graphics.width, height = Graphics.height) {
      const zAxis = KUR.Camera.normalize(KUR.Camera.subtract(position, target));
      const xAxis = KUR.Camera.normalize(KUR.Camera.cross(up, zAxis));
      const yAxis = KUR.Camera.cross(zAxis, xAxis);
      const pointCamera = KUR.Camera.subtract(point3, position);
      const x = KUR.Camera.dot(pointCamera, xAxis);
      const y = KUR.Camera.dot(pointCamera, yAxis);
      const z = KUR.Camera.dot(pointCamera, zAxis);
      if (Math.abs(z) < near || Math.abs(z) > far) return null;
      const aspectRatio = width / height;
      const tanHalfFovY = Math.tan((fov * Math.PI / 180) / 2);
      const xProjNDC = (x / (aspectRatio * tanHalfFovY)) * (near / -z);
      const yProjNDC = (y / tanHalfFovY) * (near / -z);
      const xFinal = (xProjNDC + 1) / 2;
      const yFinal = (-yProjNDC + 1) / 2;
      return [xFinal, yFinal];
    },
    multiplyMatrices(a, b) {
      const result = [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0],
      ];
      for (let i = 0; i < 3; i++)for (let j = 0; j < 3; j++)for (let k = 0; k < 3; k++)result[i][j] += a[i][k] * b[k][j];
      return result;
    },
  }
  KUR.getBattleActor = function () {
    return BattleManager.actor();
  }
  KUR.createBaseVertex = function () {//TODO 游戏object的绘制

  };
  KUR.BaseDrawObject = class {
    constructor(parent) {
      this.parent = parent;
      this.Vertex = [];
    }
  }
  KUR.DarwObject = class {
    constructor(parent) {
      this.parent = parent;
      this.position = [0, 0, 0];
      this.child = [];
      this.model = [];
    }
  }
  KUR.BaseSprite = class extends Sprite {
    constructor() {
      super();
      KUR.base_sprite = this;
    }
  }
  KUR.GridSprite = class extends Sprite {//同一时刻只能存在一个实例.
    constructor(color = 'rgba(0, 0, 0, 1)') {
      super();
      this.width = Graphics.width;
      this.height = Graphics.height;
      this.bitmap = new Bitmap(this.width, this.height);
      this.ctx = this.bitmap.__context;
      this.color = color;
      this.lineWidth = 1;
      this.mw = 15;//网格宽度
      this.mh = 15;//网格长度
      if (this.mw < 2 || this.mh < 2) {
        this.mw = 2;
        this.mh = 2;
      }
      this.gridSize = 20;//单位宽度(px)
      this.gridSizeZ = 20;//(Z特殊)
      this.matrix = KUR.create2DMatrix(this.mw, this.mh);
      this._position = [344, 140, 175];//默认摄像机位置
      this._target = [(this.mw / 2) * this.gridSize, (this.mh / 2) * this.gridSize, 0];//默认摄像机朝向
      this._up = [0, 0, 1];//默认摄像机向上的方向向量
      this._fov = 90;//默认Fov
      this._require_update = true;
      this.camera_limit = true;//限制摄像机转动范围
      this.camera_range_limit = true;//限制摄像机移动范围
      this.z_range = [165, 384];//只在camera_range_limit为true有效
      this.y_range = [-256, 512];
      this.x_range = [-256, 512];
      this.base_speed = 5;
      this.xy_rate = 1.5;
      this.draw_frame = [];
      this.half_size = this.gridSize >> 1;
      this.dtx = null;
      this.dty = null;
      KUR.grid = this;
      this.drawGrid();
    }
    //虽然叫做drawTexture,但是c2d没办法用matrix3d来变换纹理,所以只能用纯色,而且没有做视锥剔除,会有显示BUG
    drawTexture(color, args) {//args为3个连成线的点的坐标,绘制一个纯色平行四边形
      let points = [
        [arguments[1], arguments[2], arguments[3]],
        [arguments[4], arguments[5], arguments[6]],
        [arguments[7], arguments[8], arguments[9]],
        [0, 0, 0]
      ];
      points[3] = KUR.Camera.add(points[0], KUR.Camera.subtract(points[2], points[1]));
      for (let i = 0; i < 4; ++i)if (!(points[i] = this.camera(points[i]))) return;
      else {
        points[i][0] *= this.width;
        points[i][1] *= this.height;
      }
      this.ctx.save();
      const ctx = this.ctx;
      ctx.beginPath();
      ctx.moveTo(points[0][0], points[0][1]);
      ctx.lineTo(points[1][0], points[1][1]);
      ctx.lineTo(points[2][0], points[2][1]);
      ctx.lineTo(points[3][0], points[3][1]);
      ctx.closePath();
      ctx.clip();
      ctx.fillStyle = color;
      ctx.fill();
      this.ctx.restore();
    }
    setBlockType(blockType, vx, vy) {
      if (KUR._battle_matrix) {
        if (vx < 0 || vx >= this.mw || vy < 0 || vy >= this.mh) return false;
        KUR._battle_matrix[vx][vy] = blockType;
        return true;
      }
      return false;
    }
    camera(vec3) {//出BUG注意!!!这里返回的是相对范围[-1,1],需要手动转换为屏幕坐标!
      return KUR.Camera.camera(vec3, this._position, this._target, this._up, this._fov);
    }
    toScreenXY(vec3) {
      return KUR.Camera.multiply2Scalar(this.camera(vec3), [this.width, this.height]);
    }
    getSpeed() {
      return parseInt(this.base_speed);
    }
    getSpeedR() {
      return parseInt(this.base_speed * this.xy_rate);
    }
    drawLine(x0, y0, x1, y1, color = "black") {
      this.ctx.beginPath();
      this.ctx.strokeStyle = color;
      this.ctx.moveTo(x0, y0);
      this.ctx.lineTo(x1, y1);
      this.ctx.stroke();
    }
    //如果修改了mw,mh,gridSize,color,lineWidth请调用这个函数
    applyChange() {
      this._require_update = true;
    }
    //调用此函数应用更改
    update() {
      this.bitmap._setDirty();
    }
    moveX(px, line = false) {
      let xt = this._target[0];
      if (line) xt = this._target[0] + px;
      const xp = this._position[0] + px;
      if (this.camera_range_limit) if (xp > this.x_range[1] || xp < this.x_range[0]) return;
      this._target[0] = xt;
      this._position[0] = xp;
    }
    moveY(px, line = false) {
      let yt = this._target[1];
      if (line) yt = this._target[1] + px;
      const yp = this._position[1] + px;
      if (this.camera_range_limit) if (yp > this.y_range[1] || yp < this.y_range[0]) return;
      this._target[1] = yt;
      this._position[1] = yp;
    }
    moveZ(px, line = false) {
      let zt = this._target[2];
      if (line) zt = this._target[2] + px;
      const zp = this._position[2] + px;
      if (this.camera_range_limit) if (zp < this.z_range[0] || zp > this.z_range[1]) return;
      this._target[2] = zt;
      this._position[2] = zp;
    }
    moveTz(px) {
      let zt = this._target[2] + px;
      if (this.camera_limit) if (zt > this.z_range[1] || zt >= this._position[2]) return;
      this._target[2] = zt;
    }
    moveFB(px, line = false, changeZ = false) {//方向为摄像机的前后方向
      const direction = KUR.Camera.normalize(KUR.Camera.subtract(this._target, this._position));
      const vec3 = direction.map(x => x * px);
      this.moveX(vec3[0], line);
      this.moveY(vec3[1], line);
      if (changeZ) this.moveZ(vec3[2], line);
    }
    moveLR(px, line = false, changeZ = false) {//方向为摄像机的左右方向
      const direction = KUR.Camera.normalize(KUR.Camera.cross(this._up, KUR.Camera.subtract(this._target, this._position)));
      const vec3 = direction.map(x => x * px);
      this.moveX(vec3[0], line);
      this.moveY(vec3[1], line);
      if (changeZ) this.moveZ(vec3[2], line);
    }
    rotateRz(angle) {
      const dx = this._position[0] - this._target[0];
      const dy = this._position[1] - this._target[1];
      const rad = angle * Math.PI / 180;
      const new_dx = Math.cos(rad) * dx - Math.sin(rad) * dy;
      const new_dy = Math.sin(rad) * dx + Math.cos(rad) * dy;
      this._position[0] = this._target[0] + new_dx;
      this._position[1] = this._target[1] + new_dy;
    }
    updateCharacters() {//TODO:角色脚下的颜色格子
      for (let i in KUR.BattleMembers.all) {

      }
    }
    reDrawPlus(cx, cy, color = null) {
      this.dtx = cx * this.gridSize;
      this.dty = cy * this.gridSize;
      const px0 = this.dtx - this.half_size;
      const py0 = this.dty - this.half_size;
      const px1 = this.dtx + this.half_size;
      const py2 = this.dty + this.half_size;
      let col = "green";
      this.drawGrid();
      if (cx < 0 || cy < 0 || cx >= this.mw || cy >= this.mh) {
        col = "red";
      } else if (!KUR._battle_matrix[cx][cy]) col = "yellow";
      if (color) col = color;
      this.drawTexture(col, px0, py0, 0, px1, py0, 0, px1, py2, 0);
      this.updateCharacters();
      this.update();
    }
    reDraw() {
      this.drawGrid();
      this.updateCharacters();
      this.update();
    }
    clear() {
      this.ctx.clearRect(0, 0, this.width, this.height);
    }
    draw2Point(i0, j0, i1, j1, color = "black") {
      if (this.matrix[i0][j0] && this.matrix[i1][j1] && this.matrix[i0][j0][1] > 0 && this.matrix[i1][j1][1] > 0)
        this.drawLine(this.matrix[i0][j0][0], this.matrix[i0][j0][1], this.matrix[i1][j1][0], this.matrix[i1][j1][1], color);
    }
    draw2Vector(v0, v1, color = "black") {
      this.drawLine(v0[0], v0[1], v1[0], v1[1], color);
    }
    drawSide(mz = -100) {
      const mw = (this.mw - 1) * this.gridSize;
      const mh = (this.mh - 1) * this.gridSize;
      this.drawTexture("gray", 0, 0, 0, mw, 0, 0, mw, 0, mz);
      this.drawTexture("gray", 0, 0, 0, 0, mh, 0, 0, mh, mz);
      this.drawTexture("gray", mw, 0, 0, mw, mh, 0, mw, mh, mz);
      this.drawTexture("gray", 0, mh, 0, mw, mh, 0, mw, mh, mz);
      this.drawTexture("white", 0, 0, 0, mw, 0, 0, mw, mh, 0);
    }
    drawGrid() {
      this.clear();
      const mw = this.mw, mh = this.mh;
      if (this._require_update) {
        this.ctx.lineWidth = this.lineWidth;
        this._require_update = false;
      }
      this.drawSide();
      for (let i = 0; i < mh; i++) {
        for (let j = 0; j < mw; j++) {
          const xy = this.camera([j * this.gridSize, i * this.gridSize, 0]);
          if (xy) this.matrix[i][j] = [xy[0] * this.width, xy[1] * this.height];
          else this.matrix[i][j] = null;
        }
      }
      for (let i = 0; i < mw; i++)for (let j = 0; j < mh; j++) {//高消耗
        if (i + 1 < mw) this.draw2Point(i, j, i + 1, j, this.color);
        if (j + 1 < mh) this.draw2Point(i, j, i, j + 1, this.color);
      }
      const p0 = this.toScreenXY([0, 0, 50]);
      if (p0) {
        const px = this.toScreenXY([50, 0, 50]);
        const py = this.toScreenXY([0, 50, 50]);
        const pz = this.toScreenXY([0, 0, 100]);
        if (px) this.draw2Vector(p0, px, "red");//红色X轴
        if (py) this.draw2Vector(p0, py, "green");//绿色Y轴
        if (pz) this.draw2Vector(p0, pz, "blue");//蓝色Z轴
      }
    }
    move(direction) {//前后左右上下
      //direction += 6;
      switch (direction) {
        case 1:
          this.moveFB(this.getSpeedR(), false);//false为绕中心旋转
          break;
        case 2:
          this.moveFB(-this.getSpeedR(), false);
          break;
        case 3:
          this.moveLR(this.getSpeed(), false);//false为绕中心旋转
          break;
        case 4:
          this.moveLR(-this.getSpeed(), false);
          break;
        case 5:
          this.moveZ(-this.getSpeed(), !KUR.press_alt)
          break;
        case 6:
          this.moveZ(this.getSpeed(), !KUR.press_alt);
          break;
        case 7:
          this.moveFB(this.getSpeedR(), true);//ture为直线移动
          break;
        case 8:
          this.moveFB(-this.getSpeedR(), true);
          break;
        case 9:
          this.moveLR(this.getSpeed(), true);//ture为直线移动
          break;
        case 10:
          this.moveLR(-this.getSpeed(), true);
          break;
      }
      this.reDraw();
    }
    rotate(direction) {//上下左右
      switch (direction) {
        case 1:
          this.moveTz(this.getSpeed());
          break;
        case 2:
          this.moveTz(-this.getSpeed());
          break;
        case 3:
          this.rotateRz(this.getSpeed());
          break;
        case 4:
          this.rotateRz(-this.getSpeed())
          break;
      }
      this.reDraw();
    }
  }
  KUR.BattleSceneStart = function (scene_battle) {
    scene_battle.initCharacterMovement();
  }
  KUR.BattleSceneUpgrade = function (this_) {
    this_.updateCharacterMovement();
  }
  KUR.InputCamera = function () {
    if (Input.isPressed('alt')) KUR.press_alt = true;
    else KUR.press_alt = false;
    if (KUR.set_3dchoice) return;
    if (Input.isPressed('moveUp')) KUR.grid.move(1);
    if (Input.isPressed('moveDown')) KUR.grid.move(2);
    if (Input.isPressed('moveLeft')) KUR.grid.move(3);
    if (Input.isPressed('moveRight')) KUR.grid.move(4);
  }
  KUR.create2DMatrix = function (mw, mh, dv = 0) {
    return Array.from({ length: mh }).map(() => Array(mw).fill(dv));
  }
  KUR.getRandomInt = function (max) {
    return Math.floor(Math.random() * max);
  }
  KUR.randomResult = [];
  KUR.randomPostion = function (target) {
    const mw = KUR.grid.mw;
    const mh = KUR.grid.mh;
    let result = null;
    while (true) {
      result = [KUR.getRandomInt(mw), KUR.getRandomInt(mh)];
      for (let i = 0; i < KUR.randomResult.length; i++)if (KUR.randomResult[i] == result) continue;
      break;
    }
    KUR.randomResult.push(result);
    target.pos_manager.set_grid_postion(result[0], result[1]);
    target.pos_manager.setBlockType(0);
  }
  KUR.BattleMembers = { actor: [], enemy: [], all: [] };
  KUR.randomStartPostion = function () {
    for (let i = 0; i < KUR.BattleMembers.actor.length; i++)KUR.randomPostion(KUR.BattleMembers.actor[i]);
    for (let i = 0; i < KUR.BattleMembers.enemy.length; i++)KUR.randomPostion(KUR.BattleMembers.enemy[i]);
  }
  KUR.BEC._Scene_Battle_initialize = Scene_Battle.prototype.initialize;
  Scene_Battle.prototype.initialize = function () {
    KUR.BattleMembers.actor = [];
    KUR.BattleMembers.enemy = [];
    KUR.BattleMembers.all = []
    KUR.BEC._Scene_Battle_initialize.call(this);
  };
  if (Imported.MOG_ATB) {
    KUR.ATB_max = Moghunter.atb_MaxValue;
    KUR.BEC.BattleManager_update_ATB = BattleManager.update_ATB;
    BattleManager.update_ATB = function () {
      if (!KUR.allow_continue) return;
      KUR.BEC.BattleManager_update_ATB.call(this);
    }
  }
  KUR.BEC._Scene_Battle_start = Scene_Battle.prototype.start;
  Scene_Battle.prototype.start = function () {
    KUR.BEC._Scene_Battle_start.call(this);
    KUR.Scene_Battle = this;
    KUR.BattleSceneStart(this);
    var KUR_tmp_all = [];
    for (let i = 0; i < KUR.BattleMembers.all.length; ++i) {
      if (KUR.BattleMembers.all[i]._actor) {
        KUR.BattleMembers.actor.push(KUR.BattleMembers.all[i]);
        KUR_tmp_all.push(KUR.BattleMembers.all[i]);
      }
      if (KUR.BattleMembers.all[i]._enemy) {
        KUR.BattleMembers.enemy.push(KUR.BattleMembers.all[i]);
        KUR_tmp_all.push(KUR.BattleMembers.all[i]);
      }
    };
    KUR.BattleMembers.all = KUR_tmp_all;
    if (Imported.MOG_ATB) {
      for (let i = 0; i < KUR.BattleMembers.all.lengh; ++i) {
        const tar = KUR.BattleMembers.all[i];
        KUR.ATB_max = Math.max(KUR.ATB_max, tar._actor ? tar._actor.agi : tar._enemy.agi);
      }
      for (let i = 0; i < KUR.BattleMembers.all.lengh; i++) {
        const tar = KUR.BattleMembers.all[i];
        tar._actor ? tar._actor._max_atb : tar._enemy._max_atb = KUR.ATB_max;
      }
    }
    KUR._battle_matrix = KUR.create2DMatrix(KUR.grid.mw, KUR.grid.mh, 1);
    KUR.randomStartPostion();
  };
  Scene_Battle.prototype.initCharacterMovement = function () {
    //Input.keyMapper[16] = 'shift';
    //Input.keyMapper[32] = 'space';
    Input.keyMapper[18] = 'alt';
    Input.keyMapper[65] = 'moveLeft';
    Input.keyMapper[68] = 'moveRight';
    Input.keyMapper[83] = 'moveDown';
    Input.keyMapper[87] = 'moveUp';
  };
  KUR.BEC._Scene_Battle_update = Scene_Battle.prototype.update;
  Scene_Battle.prototype.update = function () {
    KUR.BattleSceneUpgrade(this);
    KUR.BEC._Scene_Battle_update.call(this);
  };
  Scene_Battle.prototype.updateCharacterMovement = function () {
    if (this.isActive()) KUR.InputCamera();
  };
  KUR.BEC.Spriteset_Battle_prototype_createBattleback = Spriteset_Battle.prototype.createBattleback;
  Spriteset_Battle.prototype.createBattleback = function () {
    KUR.Spriteset_Battle = this;
    this._battleField.addChild(new KUR.BaseSprite());
    KUR.base_sprite.addChild(new KUR.GridSprite());
    KUR.BEC.Spriteset_Battle_prototype_createBattleback.call(this);
  }
  KUR.BEC.Sprite_Battler_updatePosition = Sprite_Battler.prototype.updatePosition;
  Sprite_Battler.prototype.updatePosition = function () {
    KUR.BEC.Sprite_Battler_updatePosition.call(this);
    if (!this || !this._battler) return;
    this.pos_manager.update();
  };
  KUR._lastActorId = null;
  KUR.PostionManager = class {
    constructor(target, hx = 0, hy = 0, static_ = false) {//static = true为不动
      this.target = target;
      this.target._homeX = hx;
      this.target._homeY = hy;
      this.visual_x = 0;
      this.visual_y = 0;
      this.visual_z = 0;
      this.scale_factor = 200;
      this.max_scale = 1.2;
      this.min_scale = 0.1;
      this.static = static_;
      this.base_dir = 0;
      this.rotate_dir = 0;//0-2pi
      this.face_target = null;
      this.is_3d_move = false;
      this.dv = [0, 0, 0];
      this.dtmp = [0, 0, 0];
      this.deque_step = [];
      this.to_point = [0, 0];
      this.move_path = null;
      this.dframe = 10;//每单位帧
    }
    push_dv_req(dv, frame) {//将dv,frame加入移动队列
      this.deque_step.push([dv, frame]);
      return this;
    }
    execute_move() {//执行多次移动
      if (this.deque_step.length) {
        let _next = this.deque_step.shift();
        this.startMove(_next[0][0], _next[0][1], _next[0][2], _next[1]);
      }
      return this;
    }
    setVxyz(vx = this.visual_x, vy = this.visual_y, vz = this.visual_z) {
      this.visual_x = vx;
      this.visual_y = vy;
      this.visual_z = vz;
      if (!this.setBlockType(0)) throw new Error("KUR._battle_matrix is undefined");
    }
    setBlockType(blockType) {
      return KUR.grid.setBlockType(blockType, this.visual_x, this.visual_y);
    }
    getRealx() {
      return KUR.grid.gridSize * this.visual_x;
    };
    getRealy() {
      return KUR.grid.gridSize * this.visual_y;
    };
    getRealz() {
      return KUR.grid.gridSizeZ * this.visual_z;
    }
    getDistance() {
      return Math.hypot(this.getRealx() - KUR.grid._position[0], this.getRealy() - KUR.grid._position[1], this.getRealz() - KUR.grid._position[2] + (this.target.height >> 1));
    }
    getPostion() {
      return [this.getRealx(), this.getRealy(), this.getRealz()];
    }
    set_face_target(sprite2d) {
      this.face_target = sprite2d;
    }
    move(dx = 0, dy = 0) {
      this.visual_x += dx;
      this.visual_y += dy;
      if (this.visual_x < 0 || this.visual_x >= KUR.grid.mw || this.visual_y < 0 || this.visual_y >= KUR.grid.mh) {
        this.visual_x -= dx;
        this.visual_y -= dy;
        return false;
      }
      return true;
    }
    moveTo(x, y) {
      return this.move(x - this.visual_x, y - this.visual_y);
    }
    setMoving() {
      this.is_3d_move = true;
    }
    isMoving() {
      if (this.target._movementDuration < 0) this.target._movementDuration = 0;
      return this.is_3d_move || this.deque_step.lengh || this.target._movementDuration;
    }
    setStop() {
      this.is_3d_move = false;
      this.target._movementDuration = 0;
    }
    move_finish() {
      this.setVxyz(this.dtmp[0], this.dtmp[1], this.dtmp[2]);
      this.setBlockType(0);
      this.setStop();
    }
    move_update() {
      this.visual_x += this.dv[0];
      this.visual_y += this.dv[1];
      this.visual_z += this.dv[2];
      const xy = KUR.grid.toScreenXY(this.getPostion());
      if (xy) this.set_hxy(xy[0], xy[1]);
      this.update_scale();
    }
    startMove(dx = 0, dy = 0, dz = 0, frams = 10) {
      this.setMoving();
      this.setBlockType(1);
      this.dv = [dx / frams, dy / frams, dz / frams];
      this.dtmp = [this.visual_x + dx, this.visual_y + dy, this.visual_z + dz];
      this.target._movementDuration = frams;
    }
    updateFace() {
      if (this.face_target) {
        const ftpm = this.face_target.pos_manager;
        this.faceTo(ftpm.getRealx(), ftpm.getRealy(), ftpm.getRealz());
      };
    }
    setScale(scale) {
      if (scale > this.max_scale) this.scale = this.max_scale;
      else if (scale < this.min_scale) this.scale = this.min_scale;
      else this.scale = scale;
    }
    update_scale() {
      this.distance = this.getDistance();
      this.setScale(this.scale_factor / this.distance);
      this.updateFace();
      this.transformXY(this.scale, this.scale);
    }
    update() {
      if (this.is_3d_move) {
        this.update_scale();
        return;
      };
      const xy = KUR.grid.toScreenXY(this.getPostion());
      if (xy) {
        this.set_hxy(xy[0], xy[1]);
        this.update_scale();
      } else {
        this.set_hxy(0, 0);
        this.distance = -1;
        this.scale = 0;
      };
    }
    getDir() {
      return this.base_dir + this.rotate_dir;
    }
    getFaceTo() {
      return this.getDir() % 360 >= 180 ? -1 : 1;
    }
    _faceTo(x, y, z) {
      const camera_face = KUR.Camera.subtract(KUR.grid._target, KUR.grid._position);
      const sprite_face = KUR.Camera.subtract([x, y, z], this.getPostion());
      const vec2mul = camera_face[0] * sprite_face[0] + camera_face[1] * sprite_face[1];
      if (vec2mul < 0) this.rotate_dir = 180;
      else this.rotate_dir = 0;
    }
    faceTo(x, y, z) {
      this._faceTo(x, y, z);
      if (this.face_target) this.face_target.pos_manager.set_face_target(this.target);
    }
    set_hxy(hx, hy) {
      this.target._homeX = hx;
      this.target._homeY = hy;
    }
    transformXY(x, y) {
      if (this.target._battler.isEnemy()) {
        let tar = this.target._battler.enemy();
        tar.spriteScaleX = x * this.getFaceTo();
        tar.spriteScaleY = y;
      } else {
        this.target.transform.scale.x = x * this.getFaceTo();
        this.target.transform.scale.y = y;
      }
    }
    set_grid_postion(x, y) {
      this.visual_x = x;
      this.visual_y = y;
    }
    _G_function(x, y) {//从起点到当前节点的实际代价
      return Math.abs(this.visual_x - x) + Math.abs(this.visual_y - y);
    }
    _H_function(x, y) {//从当前节点到终点的估计代价
      return Math.abs(this.to_point[0] - x) + Math.abs(this.to_point[1] - y);
    }
    _hash(x, y) {
      return KUR.grid.mw * y + x;
    }
    canMove(x, y) {
      return x < KUR.grid.mw && x >= 0 && y < KUR.grid.mh && y >= 0 && KUR._battle_matrix[x][y];
    }
    aStar(tx, ty) {//返回路径(如果为null就是走不通)
      this.to_point[0] = tx;
      this.to_point[1] = ty;
      if (!KUR.astar_map) KUR.astar_map = new Uint32Array(KUR.grid.mw * KUR.grid.mh);
      const mp = KUR.astar_map.fill(0);
      const deque = new KUR.Heap((u, d) => u.f < d.f);
      deque.insert({ x: this.visual_x, y: this.visual_y, g: 0, f: this._H_function(tx, ty), parent: null });
      while (deque.size()) {
        const n = deque.get();
        if (n.x === tx && n.y === ty) {
          let path = [];
          let cur_n = n;
          while (cur_n) {
            path.push([cur_n.x, cur_n.y]);
            cur_n = cur_n.parent;
          }
          return path.reverse();
        }
        mp[this._hash(n.x, n.y)] = 1;
        for (let i = 0; i < 8; i += 2) {
          const nx = KUR.dxdy[i] + n.x;
          const ny = KUR.dxdy[i + 1] + n.y;
          if (this.canMove(nx, ny) && !mp[this._hash(nx, ny)]) {
            const g_cost = n.g + Math.abs(KUR.dxdy[i]) + Math.abs(KUR.dxdy[i + 1]);
            deque.insert({ x: nx, y: ny, g: g_cost, f: g_cost + this._H_function(tx, ty), parent: n });
          }
        }
      }
      return null;
    }
    tryMove(tx, ty, steps) {//尝试移动判定
      if (tx < 0 || ty < 0 || tx >= KUR.grid.mw || ty >= KUR.grid.mh || !KUR._battle_matrix[tx][ty]) return false;
      if (this.isMoving() || this.visual_x == tx && this.visual_y == ty || this._G_function(tx, ty) > steps) return false;
      if (this.move_path = this.aStar(tx, ty)) return this.move_path.length <= steps;
      return false;
    }
    nextMove() {//当tryMove为真才能使用这个函数
      if (!this.move_path) return;
      for (let i = 1; i < this.move_path.length; ++i)
        this.push_dv_req([this.move_path[i][0] - this.move_path[i - 1][0], this.move_path[i][1] - this.move_path[i - 1][1], 0], this.dframe);
      this.move_path = null;
      this.execute_move();
    }
  };
  KUR.BEC.Sprite_Battler_startMove = Sprite_Battler.prototype.startMove;
  Sprite_Battler.prototype.startMove = function (x, y, duration) {
    this.pos_manager.faceTo(x, y, 0);
    KUR.BEC.Sprite_Battler_startMove.call(this, x, y, duration);
  }
  KUR.BEC.Sprite_Battler_initMembers = Sprite_Battler.prototype.initMembers;
  Sprite_Battler.prototype.initMembers = function () {
    KUR.BEC.Sprite_Battler_initMembers.call(this);
    this.pos_manager = new KUR.PostionManager(this, this._homeX, this._homeY);
  }
  KUR.BEC.Sprite_Battler_prototype_initialize = Sprite_Battler.prototype.initialize;
  Sprite_Battler.prototype.initialize = function (battler) {
    KUR.BEC.Sprite_Battler_prototype_initialize.call(this, battler);
    KUR.BattleMembers.all.push(this);
  };
  Sprite_Battler.prototype.faceTo = function (target) {//bug:每次行动完才换方向
    this.pos_manager.set_face_target(target);
    this.pos_manager.updateFace();
  }
  KUR.getId = function (target) {//target是静态数据
    if (!target.last_sprite == undefined) {
      if (target.isActor()) return target._actor._actorId;
      else return target._enemy._enemyId;
    }
    if (target.isActor && target.isActor()) return target._actorId;
    else return target._enemyId;
  }
  KUR.getSprite = function (target) {//target是静态数据
    let id = KUR.getId(target);
    target.last_sprite = null;
    if (target.isActor && target.isActor()) {
      for (let i = 0; i < KUR.BattleMembers.actor.length; ++i) {
        if (id == KUR.getId(KUR.BattleMembers.actor[i])) {
          target.last_sprite = KUR.BattleMembers.actor[i];
          break;
        }
      }
    } else if (target.isEnemy && target.isEnemy()) {
      for (let i = 0; i < KUR.BattleMembers.enemy.length; ++i) {
        if (id == KUR.getId(KUR.BattleMembers.enemy[i])) {
          target.last_sprite = KUR.BattleMembers.enemy[i];
          break;
        }
      }
    }
    return target.last_sprite;
  };
  KUR.BEC.BattleManager_invokeAction = BattleManager.invokeAction;
  BattleManager.invokeAction = function (subject, target) {
    var k_sub = KUR.getSprite(subject);
    var k_target = KUR.getSprite(target);
    if (k_sub && k_target) k_sub.faceTo(k_target);
    KUR.BEC.BattleManager_invokeAction.call(this, subject, target);
  }
  KUR.BEC.Sprite_Battler_updateMove = Sprite_Battler.prototype.updateMove;
  Sprite_Battler.prototype.updateMove = function () {
    if (this.pos_manager.is_3d_move) {
      if (this._movementDuration > 0) {
        this.pos_manager.move_update();
        this._movementDuration--;
        if (this._movementDuration === 0) {
          if (this.pos_manager.deque_step.length) {
            var _next = this.pos_manager.deque_step.shift();
            this.pos_manager.move_finish();
            this.pos_manager.startMove(_next[0][0], _next[0][1], _next[0][2], _next[1]);
            return;
          }
          this.pos_manager.move_finish();
          this.onMoveEnd();
        }
      }
      return;
    }
    KUR.BEC.Sprite_Battler_updateMove.call(this);
  };
  KUR.BEC.onMoveEnd = Sprite_Battler.prototype.onMoveEnd;
  Sprite_Battler.prototype.onMoveEnd = function () {
    KUR.BEC.onMoveEnd.call(this);
    this.pos_manager.setStop();
  };
  if (Imported.YEP_BattleEngineCore) {
    Sprite_Actor.prototype.stepForward = function () { };
  }
  if (Imported.YEP_X_ActSeqPack2) {//插件兼容:copy & edit from YEP_X_ActSeqPack2
    Sprite_Battler.prototype.updateStateSprites = function () {
      if (this._stateIconSprite) {
        var height = this._battler.spriteHeight() * -1;
        height -= Sprite_StateIcon._iconHeight;
        //height /= this.scale.y;//防止状态图标高度错误
        this._stateIconSprite.y = height;
      }
      if (this._stateSprite) {
        var height = (this._battler.spriteHeight() - 64 * this.scale.y) * -1;
        this._stateSprite.y = height;
      }
      var heightRate = 0;
      heightRate += this.getFloatHeight();
      heightRate += this.getJumpHeight();
      if (Imported.YEP_X_AnimatedSVEnemies) if (this._enemy && this._enemy.isFloating()) heightRate += this.addFloatingHeight();
      var height = this._battler.spriteHeight();
      if (this._stateIconSprite) this._stateIconSprite.y += Math.ceil(heightRate * -height);
      if (this._stateSprite) this._stateSprite.y += Math.ceil(heightRate * -height);
    };
  }
  KUR.BEC.Window_ActorCommand_makeCommandList = Window_ActorCommand.prototype.makeCommandList;
  Window_ActorCommand.prototype.makeCommandList = function () {
    KUR.BEC.Window_ActorCommand_makeCommandList.call(this);
    if (this._actor) this.addCommand("移动", "3dmove", true);
  }
  KUR.BEC.Scene_Battle_createActorCommandWindow = Scene_Battle.prototype.createActorCommandWindow;
  Scene_Battle.prototype.createActorCommandWindow = function () {
    KUR.BEC.Scene_Battle_createActorCommandWindow.call(this);
    this._actorCommandWindow.setHandler('3dmove', this.move3dCmd.bind(this));
  };
  KUR.BEC.Scene_Base_isBusy = Scene_Base.isBusy;
  Scene_Base.isBusy = function () {
    if (!KUR.allow_continue) return true;
    KUR.BEC.Scene_Base_isBusy.call(this);
  }
  KUR.set_3dchoice = false;
  KUR.move_target = null;
  KUR.allow_3dchoice = false;
  Scene_Battle.prototype.move3dCmd = function () {
    KUR.setAllowContinue(false);
    for (let i = 0; i < KUR.BattleMembers.actor.length; ++i) {
      if (KUR._lastActorId == KUR.BattleMembers.actor[i]._actor._actorId) {
        this.move3d_process(KUR.BattleMembers.actor[i]);
        break;
      }
    }
  }
  KUR.setAllowContinue = function (bflag) {//继续|暂停
    KUR.allow_continue = bflag;
    SceneManager._scene._windowLayer.visible = bflag;
  }
  KUR.set3DChoice = function (bflag) {//true中断键盘操作并进入选择处理
    KUR.set_3dchoice = bflag;
  }
  KUR.allow3DChoice = function (bflag) {//等待摄像机动画播放完毕后执行这个
    KUR.allow_3dchoice = bflag;
  }
  KUR.fsteps = 0;
  Scene_Battle.prototype.move3d_process = function (target_sprite) {
    KUR.set3DChoice(true);
    KUR.allow3DChoice(false);
    KUR.move_target = target_sprite;
    (async () => {//将摄像机平滑移动到网格正上方
      const pxy = KUR.grid._position;
      const txy = KUR.grid._target;
      const distance = Math.hypot(pxy[0] - txy[0], pxy[1] - txy[1]);
      const fsteps = Math.floor(distance / KUR.grid.getSpeed());
      const tbs = KUR.grid.base_speed;
      //----------------------------------------------------------------
      const dr = KUR.Camera.subtract(txy, pxy);
      let angleToRotate = Math.atan2(dr[1], dr[0]) - Math.atan2(0, -1);
      if (angleToRotate > Math.PI) angleToRotate -= 2 * Math.PI;
      else if (angleToRotate < -Math.PI) angleToRotate += 2 * Math.PI;
      const angularSpeedPerStep = Math.PI / 90;// 2 * pi / 180
      let rsteps = Math.abs(angleToRotate / angularSpeedPerStep);
      KUR.grid.base_speed = 2;
      for (let i = 0; i < rsteps; i++) {
        await KUR.Sleep(16);
        if (angleToRotate > 0) KUR.grid.rotate(4);
        else KUR.grid.rotate(3);
        angleToRotate -= angularSpeedPerStep * (angleToRotate > 0 ? -1 : 1);
        if (Math.abs(angleToRotate) < angularSpeedPerStep) {
          break;
        }
      }
      //----------------------------------------------------------------
      KUR.grid.base_speed = tbs << 2;
      KUR.grid.camera_range_limit = false;
      KUR.fsteps = fsteps;
      for (let i = 0; i < fsteps; i++) {
        KUR.grid.move(1);//拉近镜头
        await KUR.Sleep(KUR.rfps);//60fps
      }
      KUR.grid.moveX(pxy[0] - txy[0], false);
      KUR.grid.moveY(pxy[1] - txy[1], false);
      KUR.grid.base_speed = tbs;
      KUR.grid.camera_range_limit = true;
      //----------------------------------------------------------------
      KUR.allow3DChoice(true);
      let cflag = true;
      while (cflag) {
        if (KUR.allow_continue) {
          cflag = false;
          this.selectNextCommand();
        }
        await KUR.Sleep(100);
      }
    })();
  }
  KUR.BEC.Window_ActorCommand_processOk = Window_ActorCommand.prototype.processOk;
  Window_ActorCommand.prototype.processOk = function () {
    KUR._lastActorId = BattleManager.actor()._actorId;
    KUR.BEC.Window_ActorCommand_processOk.call(this);
  }
  KUR.BEC.Game_BattlerBase_initMembers = Game_BattlerBase.prototype.initMembers;
  Game_BattlerBase.prototype.initMembers = function () {//TODO:可能需要写入存档
    this.m3d_pt = 5;//移动点
    this.m3d_max = 5;//最大移动点
    this.m3d_rec_rate = 1;//每回合回复m3d点数
    KUR.BEC.Game_BattlerBase_initMembers.call(this);
  }
  KUR.BEC.BattleManager_startTurn = BattleManager.startTurn;
  BattleManager.startTurn = function () {
    for (let i = 0; i < KUR.BattleMembers.all.length; ++i) {//回复m3d点数
      var _kur_battler = KUR.BattleMembers.all[i]._battler;
      _kur_battler.m3d_pt = Math.min(_kur_battler.m3d_pt + _kur_battler.m3d_rec_rate, _kur_battler.m3d_max);
    }
    KUR.BEC.BattleManager_startTurn.call(this);
  }
  KUR.mouse_x = 0;
  KUR.mouse_y = 0;
  KUR.rfps = 16;
  KUR.throttle = function (func, delay) {
    let timeoutId = null;
    return function (...args) {
      if (!timeoutId) {
        timeoutId = setTimeout(() => {
          func.apply(this, args);
          timeoutId = null;
        }, delay);
      }
    };
  }
  document.addEventListener('mousemove', KUR.throttle(function (event) {
    if (KUR.set_3dchoice) {
      KUR.mouse_x = event.pageX;
      KUR.mouse_y = event.pageY;
    }
  }, KUR.rfps));
  KUR.press_Lmouse = false;
  KUR.press_Rmouse = false;
  KUR.event.pushRequest(() => {//此时摄像机方向向量:[0,0,-1],但网格是歪的
    if (!KUR.allow_3dchoice) return;
    const ofx = KUR.grid.matrix[0][0];
    const ofx2 = KUR.grid.matrix[KUR.grid.mh - 1][KUR.grid.mw - 1];
    const _dr = KUR.grid.matrix[0][KUR.grid.mw - 1];
    const rs = [ofx2[0] - ofx[0], ofx2[1] - ofx[1]];//原始向量
    const rt = [KUR.mouse_x - ofx[0], KUR.mouse_y - ofx[1]];//鼠标向量
    const dr = Math.atan2(_dr[1] - ofx[1], _dr[0] - ofx[0]);//计算偏移角
    const cs = Math.cos(dr);
    const sn = Math.sin(dr);
    const rdxy = [rt[0] * cs - rt[1] * sn, rt[0] * sn + rt[1] * cs];//鼠标向量旋转
    const rdxy2 = [rs[0] * cs - rs[1] * sn, rs[0] * sn + rs[1] * cs]//原始向量旋转
    const dtx = Math.round(rdxy[0] / rdxy2[0] * KUR.grid.mw);
    const dty = Math.round(rdxy[1] / rdxy2[1] * KUR.grid.mh);
    KUR.grid.reDrawPlus(dtx, dty);
    if (KUR.press_Rmouse) {
      (async function () {
        KUR.allow3DChoice(false);
        KUR.set3DChoice(false);
        const tsp = KUR.grid.base_speed;
        KUR.grid.base_speed = tsp << 2;
        for (let i = 0; i < KUR.fsteps; i++) {
          KUR.grid.move(2);//拉远镜头
          await KUR.Sleep(KUR.rfps);//60fps
        }
        KUR.grid.base_speed = tsp;
        KUR.setAllowContinue(true);
        KUR.grid.reDraw();
      })();
    }
    if (KUR.press_Lmouse) {
      const move_obj = KUR.move_target;
      if (move_obj.pos_manager.tryMove(dtx, dty, move_obj._battler.m3d_pt + 1)) {
        move_obj._battler.m3d_pt -= move_obj.pos_manager.move_path.length;
        ++move_obj._battler.m3d_pt;
        move_obj.pos_manager.nextMove(dtx, dty);
      } else KUR.grid.reDrawPlus(dtx, dty, "blue");
    }
  });
  document.addEventListener('mousedown', KUR.throttle(function (event) {
    if (event.button === 0) KUR.press_Lmouse = true;
    if (event.button === 2) KUR.press_Rmouse = true;
  }, KUR.rfps));
  document.addEventListener('mouseup', KUR.throttle(function () {
    KUR.press_Lmouse = false;
    KUR.press_Rmouse = false;
  }, KUR.rfps));
})();
//TODO:敌人移动AI,技能的范围限制,md3点数的HUD绘制与距离估算消耗
