;(function(){
class IndexCursor { // カーソル位置を制御する（一次元）
    static _OverMethods = { // 端到達時の挙動
        Loop: 'loop', // 同向 & 逆i
        Yoyo: 'yoyo', // 逆向
        Stop: 'stop', // 停止
    }
    static _Dirs = { // 向き
        Minus: -1, // -
        Plus: 1,   // +
    }
    static get OverMethods() { return this._OverMethods }
    static get Dirs() { return this._Dirs  }
    constructor(l=7) {
        this._i = 0 // index  添字
        this._l = l // length 長さ
        this._d = 1 // direction 方向
        this._q = 1 // quantity 量
        console.log(IndexCursor.OverMethods)
        console.log(IndexCursor.OverMethods)
        this._overMethod = IndexCursor.OverMethods.Loop // 端到達時の挙動
    }
    get i( ) { return this._i }
    set i(v) { if (0<=v && v<this.l) { this._i = v } }

    get fi( ) { return 0 }
    get li( ) { return this._l - 1 }

    get l( ) { return this._l }
    set l(v) { if (Number.isInteger(v) && 0 < l) { this._i = v } }

    get d( ) { return this._d }
    set d(v) { if ([...Object.values(IndexCursor.Dirs)].some(V=>V===v)) { this._d = v } }
    get q( ) { return this._q }
    set q(v) { if (Number.isInteger(v) && 0 < v && v < this.l) { this._q = v } }

    get overMethod( ) { return this._overMethod }
    set overMethod(v) { if ([...Object.values(IndexCursor.OverMethods)].some(V=>V===v)) { this._overMethod = v } }

    get isF() { return this.i===this.fi }
    get isL() { return this.i===this.li }

    // protected
    _isOverF(i) { return i < this.fi }
    _isOverL(i) { return this.li < i }
    _setI(v,oF,oL) { // v:nextI
             if (this._isOverF(v)) { oF() }
        else if (this._isOverL(v)) { oL() }
        else { this._i = v }
    }
    _revDir() { this._d *= -1 }

    next() { this.i += (this.q * this.d) } // 指定した方向と量に従い移動する
    prev() { this.i += (this.q * (this.d * -1)) } // 指定したのと逆方向へ移動する
    moveToPlus() { this.i += (this.q * IndexCursor.Dirs.Plus) }
    moveToMinus() { this.i += (this.q * IndexCursor.Dirs.Minus) }

    // d方向に進む／d逆方向に進む、マイナス方向へ進む／プラス方向へ進む、指定した量と方向に進む、指定した位置に移動する
    // i++,i--,i+=q,i-=q,i=x
    // i=x:           q=-, d=-
    // i++:           q=1, d=1
    // i--:           q=1, d=-1
    // i+=Q:          q=Q, d=1
    // i-=Q:          q=Q, d=-1
    // next():        q=q, d=d
    // prev():        q=q, d=d*-1
    // moveToPlus():  q=q, d=1
    // moveToMinus(): q=q, d=-1

    log() { console.log(`i:${this.i} l:${this.l} d:${this.d} q:${this.q}`) }
    
}
class LoopCursor extends IndexCursor {
    constructor(l) { super(l) }
    get i( ) { return this._i }
    set i(v) { // v:nextI
             if (this._isOverF(v)) { this._i = (this.isF) ? this.li : this.fi }
        else if (this._isOverL(v)) { this._i = (this.isL) ? this.fi : this.li }
        else { this._i = v }
//        this._i = ifel(this.isOverF(v), (this.isF) ? this.li : this.fi,
//                       this.isOverL(v), (this.isL) ? this.fi : this.li,
//                       v);
    }
}
class YoyoCursor extends IndexCursor {
    constructor(l) { super(l) }
    get i( ) { return this._i }
    set i(v) { // v:nextI
             if (this._isOverF(v)) { this.d*=-1; this._i += (this.q * this.d) }
        else if (this._isOverL(v)) { this.d*=-1; this._i = this.l + ((this.q + 1) * this.d) }
        else { super.i = v }
//        console.log(`yoyo: i:${this.i} d:${this.d} isOF:${this._isOverF(v)} isOL:${this._isOverL(v)}`)
    }
}
class StopCursor extends IndexCursor {
    constructor(l) { super(l) }
    get i( ) { return this._i }
    set i(v) { // v:nextI
             if (this._isOverF(v)) { this._i = this.fi }
        else if (this._isOverL(v)) { this._i = this.li }
        else { super.i = v }
    }
}
window.Cursor = {
    Loop: LoopCursor,
    Yoyo: YoyoCursor,
    Stop: StopCursor,
}
})();
