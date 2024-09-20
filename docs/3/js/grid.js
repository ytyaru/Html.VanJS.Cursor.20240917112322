;(function(){
class IntRange { // int型の範囲
    constructor(min=0, max=7) {
        this.set(min, max)
    }
    set(min, max) {
        if (![min,max].every(v=>Number.isInteger(v)) { throw new TypeError(`min,maxはint型であるべきです。min:${min} max:${max}`) }
        if (max <= min) { throw new TypeError(`maxはminより大きい値であるべきです。min:${min} max:${max}`) }
        this._min = min
        this._max = max
    }
    get min( ) { return this._min }
    set min(v) { this.set(v, this._max) }
    get max( ) { return this._max }
    set max(v) { this.set(this._min, v) }
    within(v) { return Number.isInteger(v) && this._min <= v && v <= this._max }
    withinThrow(v) { if (this.within(v)) { return true } else { throw new RangeError(`引数値は範囲外です。v:${v} min:${this._min} max:${this._max}`) } }
    withoutMin(v) { return v < this._min }
    withoutMax(v) { return this._max < v }
}
class RangeInt { // int型の範囲内にあるint値
    constructor(min=0, max=7, v) {
        this._range = new IntRange(min, max)
        this.v = (v) ? v : min
    }
    get range() { return this._range }
    get v( ) { return this._v }
    set v(x) { this._range.withinThrow(x); this._v = x; }
    set(min, max, v) { this._range.set(min, max); this.v = v; }
    get isMin() { return this._v === this._range.min }
    get isMax() { return this._v === this._range.max }
}
class LengthCursor {
    constructor(l, fi=0) {
        this._l = l                    // Length
        this._fi = fi // first index  min index  index's offset
        //this._i = new RangeInt(0, l-1) // RangeCursor
        this._i = new RangeInt(min, l+fi-1) // RangeCursor
    }
    get i() { return this._i.v }
    set i(v) { this._i.v = v }
    get l() { return this._l }
    set l(v) {
        const [i, l, fi] = [this._i.v, this.l, this._fi]
        this._i.set(fi, l+fi-1, (i<l+fi) ? i : 0)
    }
    get fi() { return this._fi }
    get li() { return this._l + this._fi -1 }
    get _r() { return this._i.range } // range.set(...) されると l との整合性が取れなくなるので取扱注意！
    next() { this.i++ }
    prev() { this.i-- }
}
class QuantCursor extends LengeCursor {
    constructor(l) {
        super(l)
        this._q = 1 // 量(quantity)
    }
    get q( ) { return this._q }
    set q(v) { if (Number.isInteger(v) && 0 < v && v < this.l) { this._q = v } }
    next() { this.i += this.q }
    prev() { this.i -= this.q }
}
class DirCursor extends QuantCursor {
    static _Dirs = { // 向き(direction)
        Minus: -1, // -
        Plus: 1,   // +
    }
    static get Dirs() { return this._Dirs  }
    constructor(l) {
        super(l)
        this._d = 1 // 方向
    }
    get d( ) { return this._d }
    set d(v) { if ([...Object.values(IndexCursor.Dirs)].some(V=>V===v)) { this._d = v } }

    revD() { this._d *= -1 }

    next() { this.i += (this.q * this.d) } // 指定した方向と量に従い移動する
    prev() { this.i += (this.q * (this.d * -1)) } // 指定したのと逆方向へ移動する
//    moveToPlus() { this.i += (this.q * IndexCursor.Dirs.Plus) }
//    moveToMinus() { this.i += (this.q * IndexCursor.Dirs.Minus) }
//    stepPlus()
//    stepMinus()
    add() { this.i += (this.q * DirCursor.Dirs.Plus) } // +方向に移動する
    sub() { this.i += (this.q * DirCursor.Dirs.Minus) } // -方向に移動する
}
class WithoutCursor extends DirCursor {
    constructor(l, onWoMin, onWoMax) {
        super(l)
        this._onWoMin = onWoMin
        this._onWoMax = onWoMax
    }
    get i( ) { return this._i }
    set i(v) {
             if (this.i.range.withoutMin(v)) { this._onWoMin(this) }
        else if (this.i.range.withoutMax(v)) { this._onWoMax(this) }
        else { this._i = v }
    }
}
class LoopCursor extends WithoutCursor {
    constructor(l) {
        super(l, (self)=>self._i = (self.i.isMin) ? self.li : self.fi, 
                 (self)=>self._i = (self.i.isMax) ? self.fi : self.li)
    }
}
class YoyoCursor extends WithoutCursor {
    constructor(l) {
        super(l, (self)=>{ self.revD(); self._i += (self.q * self.d); },
                 (self)=>{ self.revD(); self._i = self.l + ((self.q + 1) * self.d) })
    }
}
class StopCursor extends WithoutCursor {
    constructor(l) {
        super(l, (self)=>self._i = self.fi,
                 (self)=>self._i = self.li)
    }
}


class WithoutGridCursor {
    constructor(row=1, col=1, onWoMinX, onWoMaxX, onWoMinY, onWoMaxY) {
        this._x = new WithoutCursor(col, onWoMinX, onWoMaxX)
        this._y = new WithoutCursor(row, onWoMinY, onWoMaxY)
        this._onWoMinX = onWoMinX
        this._onWoMaxX = onWoMaxX
        this._onWoMinY = onWoMinY
        this._onWoMaxY = onWoMaxY
        //this._xy = [new LengthCursor(col), new LengthCursor(row)]
    }
    get x( ) { return this._x }
    set x(v) {
             if (this.x._r.range.withoutMin(v)) { this._onWoMinX(this) }
        else if (this.x._r.range.withoutMax(v)) { this._onWoMaxX(this) }
        else { this.x.i = v }
//             if (this.x.i.range.withoutMin(v)) { this._onWoMin(this) }
//        else if (this.x.i.range.withoutMax(v)) { this._onWoMax(this) }
//        else { this._i = v }
    }
    get y( ) { return this._y }
    set y(v) {
             if (this.y._r.range.withoutMin(v)) { this._onWoMinY(this) }
        else if (this.y._r.range.withoutMax(v)) { this._onWoMaxY(this) }
        else { this.y.i = v }
//             if (this.x.i.range.withoutMin(v)) { this._onWoMin(this) }
//        else if (this.x.i.range.withoutMax(v)) { this._onWoMax(this) }
//        else { this._i = v }
    }
}
class LoopGridCursor extends WithoutGridCursor {
    constructor(row, col) {
        super(row, col, 
            (self)=>self.x.i = (self.x.isMin) ? self.x.li : self.x.fi, 
            (self)=>self.x.i = (self.x.isMax) ? self.x.fi : self.x.li,
            (self)=>self.y.i = (self.y.isMin) ? self.y.li : self.y.fi, 
            (self)=>self.y.i = (self.y.isMax) ? self.y.fi : self.y.li)
    }
}
class YoyoCursor extends WithoutCursor {
    constructor(row, col) {
        super(row, col, 
            (self)=>{ self.x.revD(); self.x.i += (self.x.q * self.x.d); },
            (self)=>{ self.x.revD(); self.x.i = self.x.l + ((self.x.q + 1) * self.x.d) },
            (self)=>{ self.revD(); self.y.i += (self.y.q * self.y.d); },
            (self)=>{ self.revD(); self.y.i = self.y.l + ((self.y.q + 1) * self.y.d) },
        )
    }
}
class StopCursor extends WithoutCursor {
    constructor(row, col) {
        super(row, col,
            (self)=>self.x.i = self.x.fi,
            (self)=>self.x.i = self.x.li,
            (self)=>self.y.i = self.y.fi,
            (self)=>self.y.i = self.y.li,
        )
    }
}


class GridSize {
    constructor(row=1, col=1) {
        this._row = new LengthCursor(row, 1)
        this._col = new LengthCursor(col, 1)

        this._row = new RangeInt(1, row)
        this._col = new RangeInt(1, col)
    }
    get row( ) { return this._row }
    get col( ) { return this._col }
}
class GridPos {
    constructor(w, h) {
        this._x = new LengthCursor(w, 1)
        this._y = new LengthCursor(h, 1)

        this._x = new RangeInt()
        this._y = new RangeInt()
    }
    get x( ) { return this._x }
    get y( ) { return this._y }
}

class GridCursor {
    constructor(row, col) {
        this._size = new GridSize(row, col)
        this._pos = new GridPos()
    }
}


window.Cursor = {
    Loop: LoopCursor,
    Yoyo: YoyoCursor,
    Stop: StopCursor,
}
})();
