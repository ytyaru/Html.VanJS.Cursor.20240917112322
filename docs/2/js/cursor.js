;(function(){
try { Type }
catch (e) {
    class _Type {
        isFn(v) {return 'function'===typeof v}
        isInt(v) {return Number.isInteger(v)}
        isStr(v) {return 'string'===typeof v || v instanceof String}
        throw(msg) {throw new TypeError(msg) }
    }
    Type = new _Type
}
console.log(Type)
/*
class TypeSetter {
    constructor(v, def, onValid, throwMsg) {
        this._onValid = (Type.isFn(v)) ? v : ()=>true
        this._throwMsg = (Type.isStr(throwMsg)) ? throwMsg : `不正な型です。`
        this._def = (this._onValid(def)) ? def : null
        this._v = (this._onValid(v)) ? v : null
    }
    get v( ) { return this._v }
    set v(v) { if (this.valid(v)) { this._v = v } else { this.throw() } }
    get def( ) { return this._def }
    set def(v) { if (this.valid(v)) { this._def = v } else { this.throw() } }
    get onValid( ) { return this._onValid }
    set onValid(v) { if(Type.isFn(v)){this._onValid=v}else{throw new TypeError(`値の型は関数であるべきです。`)} }
    throw() { throw new TypeError(this._throwMsg) }
    static create(target, kvs) { // privateプロパティ＆getter/setter生成
// 呼び出し
//        FnSetter.init(['onChangeMin','onChangeMax'])
//        this._onChangeMin = new FnSetter(onChangeMin)
//        this._onChangeMax = new FnSetter(onChangeMin)
//        get onChangeMin( ) { return this._onChangeMin.fn }
//        set onChangeMin(v) { this._onChangeMin.fn = v }
        console.log(target)
        for (let [k,v] of kvs) {
            target[`_${k}`] = this.constructor(v)
            Object.defineProperty(target, k, {
                get: ( )=>{ return this[`_${k}`].v },
                set: (v)=>{ this[`_${k}`].v = v },
            })
        }
    }
}
class FnSetter extends TypeSetter { constructor(fn) { super(()=>{}, ()=>{}, ()=>Type.isFn(v), `値の型は関数であるべきです。`) } }
class IntSetter extends TypeSetter { constructor(fn) { super(0, 0, ()=>Type.isInt(v), `値の型はintであるべきです。`) } }
*/

/*
class TypeSetter {
    constructor(v, onValid, throwMsg) {
        this._onValid = (this.valid(v)) ? v : ()=>{}
        this._throwMsg = (throwMsg) ? throwMsg : `不正な型です。`
        this._def = (this.valid(v)) ? v : ()=>{}
        this._v = this._def
    }
    get fn( ) { return this._v }
    set fn(v) { if (this.valid(v)) { this._v = v } else { this.throw() } }
    get def( ) { return this._def }
    set def(v) { if (this.valid(v)) { this._def = v } else { this.throw() } }
    valid(v) { return true }
    throw() { throw new TypeError(this._throwMsg) }
    #isFn(v) { return ('function'===typeof v) }
}
class FnSetter extends TypeSetter {
    constructor(fn) { super(fn, ()=>('function'===typeof v), `値の型は関数であるべきです。`) }
}
class FnSetter {
    constructor(fn) {
        this._defFn = (Type.isFn(fn)) ? fn : ()=>{}
        this._fn = this._defFn
    }
    get fn( ) { return this._fn }
    set fn(v) { if (Type.isFn(v)) { this._fn = v } else { this.#throw() } }
    get def( ) { return this._def }
    set def(v) { if (Type.isFn(v)) { this._fn = v } else { this.#throw() } }
    #isFn(v) { return ('function'===typeof v) }
    #throw() { throw new TypeError(`値の型は関数であるべきです。`) }
}
class IntSetter {
    constructor(fn) {
        this._defFn = (this.#isInt(fn)) ? fn : 0
        this._fn = this._defFn
    }
    get fn( ) { return this._fn }
    set fn(v) { if (Type.isFn(v)) { this._fn = v } else { this.#throw() } }
    get def( ) { return this._def }
    set def(v) { if (Type.isFn(v)) { this._fn = v } else { this.#throw() } }
    #isFn(v) { return Type.isInt(v) }
    #throw() { throw new TypeError(`値の型はintであるべきです。`) }
}
*/


class Range { // 範囲(int型)
    //constructor(min=0, max=7) { this.set(min, max) }
    constructor(min=0, max=7, onChangeMin=null, onChangeMax=null) {
//        FnSetter.create(this, ['onChangeMin ', 'onChangeMax'])
        this.onChangeMin = (Type.isFn(onChangeMin)) ? onChangeMin : ()=>{} 
        this.onChangeMax = (Type.isFn(onChangeMax)) ? onChangeMax : ()=>{} 

//        this.set(min, max)
        if (this.#valid(min,max)) { this._min = min; this._max = max; }
    }
    set(min, max) {
//        if (![min,max].every(v=>Type.isInt(v))) {throw new TypeError(`min,maxはint型であるべきです。min:${min} max:${max}`)}
//        if (max <= min) { throw new TypeError(`maxはminより大きい値であるべきです。min:${min} max:${max}`) }
//        if (min<0) {Type.throw(`minは0以上であるべきです。min:${min}`)}
//        if (![min,max].every(v=>Type.isInt(v))) {Type.throw(`min,maxはint型であるべきです。min:${min} max:${max}`)}
//        if (max <= min) {Type.throw(`maxはminより大きい値であるべきです。min:${min} max:${max}`)}
        this.#valid(min,max)
        const [oMin, oMax] = [this._min, this._max] // 旧値
        this._min = min
        this._max = max
        if (oMin!==this._min) { this._onChangeMin(this) }
        if (oMax!==this._max) { this._onChangeMax(this) }
    }
    get min( ) { return this._min }
    set min(v) { this.set(v, this._max) }
    get max( ) { return this._max }
    set max(v) { this.set(this._min, v) }
    within(v) { return Type.isInt(v) && this._min <= v && v <= this._max }
    //withinThrow(v) { if (this.within(v)) { return true } else { throw new RangeError(`引数値は範囲外です。v:${v} min:${this._min} max:${this._max}`) } }
    withinThrow(v) { if (this.within(v)) { return true } else { this.throw(`引数値は範囲外です。v:${v} min:${this._min} max:${this._max}`) } }
    withoutMin(v) { return v < this._min }
    withoutMax(v) { return this._max < v }
    get onChangeMin( ) { return this._onChangeMin }
    set onChangeMin(v) { if(Type.isFn(v)){this._onChangeMin =v} }
    get onChangeMax( ) { return this._onChangeMax }
    set onChangeMax(v) { if(Type.isFn(v)){this._onChangeMax=v} }
    #valid(min,max) {
        if (![min,max].every(v=>Type.isInt(v))) {Type.throw(`min,maxはint型であるべきです。min:${min} max:${max}`)}
        //if (max <= min) {Type.throw(`maxはminより大きい値であるべきです。min:${min} max:${max}`)}
        if (max < min) {Type.throw(`maxはmin以上であるべきです。min:${min} max:${max}`)}
        return true
    }
    throw(msg) { throw new RangeError(msg) }
}
class LengthRange extends Range { // 範囲(+長さ)
    //constructor(min=0, max=7) { super(min, max) }
    constructor(min=0, max=7, onShort=null, onLong=null, onChangeLength=null) {
        super(min, max)
        this.onShort = (Type.isFn(onShort)) ? onShort : ()=>{}
        this.onLong = (Type.isFn(onLong)) ? onLong : ()=>{}
        this.onChangeLength = (Type.isFn(onChangeLength)) ? onChangeLength : ()=>{} 
    }
    set(min, max) {
        const len = this.len // 旧len
        super.set(min, max)
        this.len = this.len // 新len
    }
    //get len( ) { return this._max - this._min + 1 }
    get len( ) {
             if (this.min === this.max) { return 0 }
        else if (this.min < 0 && this.max < 0) { return Math.abs(this.min) - Math.abs(this.max) + 1 } // 両方負数
        else if (this.min < 0) { return Math.abs(this.min) + this.max + 1 } // 片方負数
        else { return this._max - this._min + 1 } // 両方正数
    }
    set len(v) {
        //if (v-1 <= this._min) { throw new RangeError(`lenはminより大きい値であるべきです。len:${v} min:${this.min}`) }
        //if (v-1 <= this._min) { this.throw(`lenはminより大きい値であるべきです。len:${v} min:${this._min}`) }
        if (v <= this._min) { this.throw(`lenはminより大きい値であるべきです。len:${v} min:${this.min}`) }
        const max = this._max // 旧max
        this._max = v + this.min // 新max
             if (max < this._max) { this._onLong(this,max) }  // 長くなった
        else if (this._max < max) { this._onShort(this,max) } // 短くなった
        else {return}                                         // 同じ
        this._onChangeLength(this,max)
    }
    get onLong( ) { return this._onLong }
    set onLong(v) { if(Type.isFn(v)){this._onLong=v} }
    get onShort( ) { return this._onShort }
    set onShort(v) { if(Type.isFn(v)){this._onShort=v} }
    get onChangeLength( ) { return this._onChange }
    set onChangeLength(v) { if(Type.isFn(v)){this._onChange=v} }
}
class RangeValue { // 範囲内にある値(int型)
    constructor(min=0, max=7, v=0, onWoMin=null, onWoMax=null, onSet=null) {
        this._range = new LengthRange(min, max, ()=>{if(this.r.max<this.v){this.v=this.r.max}})
        this._range.onChangeMin = ()=>{if(this.v<this.r.min){this.v=this.r.min}}
        this._range.onChangeMax = ()=>{if(this.r.max<this.v){this.v=this.r.max}}
        this._onWoMin = Type.isFn(onWoMin) ? onWoMin : this.#onWoMin.bind(this)
        this._onWoMax = Type.isFn(onWoMax) ? onWoMax : this.#onWoMax.bind(this)
        this._onSet = Type.isFn(onSet) ? onSet : ()=>{}
        this.v = (v) ? v : min
    }
    get r() { return this._range }
    get v( ) { return this._v }
    set v(v) {
        if (!Type.isInt(v)) { throw new TypeError(`vはint型であるべきです。v:${v}`) }
             if (this.r.withoutMin(v)) { if(this._onWoMin(this,v)){return} }
        else if (this.r.withoutMax(v)) { if(this._onWoMax(this,v)){return} }
        else { this._v = v }
        this._onSet(this,v)
    }
    set(min, max, v) { this._range.set(min, max); this.v = v; }
    get isMin() { return this._v === this._range.min }
    get isMax() { return this._v === this._range.max }
    get onWoMin( ) { return this._onWoMin }
    set onWoMin(v) { if(Type.isFn(v)){this._onWoMin=v} }
    get onWoMax( ) { return this._onWoMax}
    set onWoMax(v) { if(Type.isFn(v)){this._onWoMax=v} }
    get onSet( ) { return this._onSet}
    set onSet(v) { if(Type.isFn(v)){this._onSet=v} }
    #onWoMin(v) { this.r.throw(`vは不正値です。minを下回りました。v:${v} min:${this.min}`) }
    #onWoMax(v) { this.r.throw(`vは不正値です。maxを上回りました。v:${v} max:${this.max}`) }
//    #onWoMin(v) { throw new RangeError(`vは不正値です。minを下回りました。v:${v} min:${this.min}`) }
//    #onWoMax(v) { throw new RangeError(`vは不正値です。maxを上回りました。v:${v} max:${this.max}`) }
}
class LengthCursor {
    constructor(l, fi=0) {
        this._fi = fi // first index  min index  index's offset
        //this._i = new RangeValue(fi, l+fi-1, fi, onWoMin, onWoMax) // RangeCursor
        this._i = new RangeValue(fi, l+fi-1, fi) // RangeCursor
    }
    get _v() { return this._i } // this._i.r.set(...) されると l との整合性が取れなくなるので取扱注意！
    //get r() { return this._i.r } // this._i.r.set(...) されると l との整合性が取れなくなるので取扱注意！
    get i() { return this._i.v }
    set i(v) { this._i.v = v }
    get l() { return this._i.r.len }
    set l(v) { this._i.r.len = v }
    get fi() { return this._i.r.min }
    get li() { return this._i.r.max }
    next() { this.i++ }
    prev() { this.i-- }
}
class QuantCursor extends LengthCursor {
    constructor(l, fi=0) {
        super(l, fi)
        this._q = 1 // 量(quantity)
    }
    get q( ) { return this._q }
    set q(v) { if (Type.isInt(v) && 0 < v && v < this.l) { this._q = v } }
    next() { this.i += this.q }
    prev() { this.i -= this.q }
}
class DirCursor extends QuantCursor {
    static #Dirs = { // 向き(direction)
        Minus: -1, // -
        Plus: 1,   // +
    }
    static get Dirs() { return this.#Dirs }
    constructor(l, fi=0) {
        super(l, fi)
        this._d = 1 // 方向
    }
    get d( ) { return this._d }
    set d(v) { if ([...Object.values(DirCursor.Dirs)].some(V=>V===v)) { this._d = v } }

    revD() { this._d *= -1 }

    next() { this.i += (this.q * this.d) } // 指定した方向と量に従い移動する
    prev() { this.i += (this.q * (this.d * -1)) } // 指定したのと逆方向へ移動する
//    moveToPlus() { this.i += (this.q * IndexCursor.Dirs.Plus) }
//    moveToMinus() { this.i += (this.q * IndexCursor.Dirs.Minus) }
//    stepPlus()
//    stepMinus()
    add() { this.i += (this.q * DirCursor.Dirs.Plus) } // +方向に移動する
    sub() { this.i += (this.q * DirCursor.Dirs.Minus) } // -方向に移動する

    log() { console.log(`i:${this.i} l:${this.l} d:${this.d} q:${this.q}`) }
}
class LoopCursor extends DirCursor {
    constructor(l, fi=0) {
        super(l, fi)
//        this._v.onWoMin = (self)=>self.i = (self.fi===self.i) ? self.li : self.fi
//        this._v.onWoMax = (self)=>self.i = (self.li===self.i) ? self.fi : self.li
//        this._v.onWoMin = (self)=>this.i = (this.fi===this.i) ? this.li : this.fi
//        this._v.onWoMax = (self)=>this.i = (this.li===this.i) ? this.fi : this.li
//        this._v.onWoMin = ()=>this.i = (this.fi===this.i) ? this.li : this.fi
//        this._v.onWoMax = ()=>this.i = (this.li===this.i) ? this.fi : this.li
        this._v.onWoMin = ()=>this.i = this.li
        this._v.onWoMax = ()=>this.i = this.fi
    }
}
class YoyoCursor extends DirCursor {
    constructor(l, fi=0) {
        super(l, fi)
        this._v.onWoMin = (self,v)=>{ this._v._v = Math.abs(this.fi - v) % this.l; }
//        this._v.onWoMax = (self,v)=>{ console.log(v,self.l); this.i = self.l - Math.abs(v % self.l) }
        this._v.onWoMax = (self,v)=>{ this._v._v = this.l - Math.abs(v % this.l) - 1; }
//        this._v.onWoMin = (self,v)=>{ this.i = Math.abs(this.fi - v) % this.l; }
//        this._v.onWoMax = (self,v)=>{ this.i = this.l - Math.abs(v % this.l) }
//        this._v.onWoMin = (self,v)=>{ self.i = Math.abs(self.fi - v) % self.l; }
//        this._v.onWoMax = (self,v)=>{ self.i = self.l - Math.abs(v % self.l) }
//        this._v.onWoMin = (self,v)=>{ self._v.v = Math.abs(self.fi - v) % self.l; }
//        this._v.onWoMax = (self,v)=>{ self._v.v = self.l - Math.abs(v % self.l) }
//        this._v.onWoMin = (self,v)=>{ this._v.v = Math.abs(this.fi - v) % this.l; }
//        this._v.onWoMax = (self,v)=>{ this._v.v = this.l - Math.abs(v % this.l) }
//        this._v.onWoMin = (self,v)=>{ this.i = self.fi + self.q; }
//        this._v.onWoMax = (self)=>{ self.revD(); self._v.v = (self.li + 1) + ((self.q + 1) * self.d) }
//        this._v.onWoMin = (self)=>{ if(-1===this.d){self.revD()}; self._v.v = self.fi + self.q; }
//        this._v.onWoMax = (self)=>{ self.revD(); self._v.v = (self.li + 1) + ((self.q + 1) * self.d) }
    }
}
class StopCursor extends DirCursor {
    constructor(l, fi=0) {
        super(l, fi)
        this._v.onWoMin = (self)=>self.i = self.fi
        this._v.onWoMax = (self)=>self.i = self.li
    }
}
/*
class WithoutCursor extends DirCursor {
    constructor(l, fi=0, onWoMin=null, onWoMax=null) {
        super(l, fi)
        this.onWoMin = onWoMin
        this.onWoMax = onWoMax
    }
    get i( ) { return super.i }
    set i(v) {
             if (v < this.fi) { this._onWoMin(this) }
        else if (this.li < v) { this._onWoMax(this) }
        else { super.i = v }
    }
    get onWoMin( ) { return this._onWoMin }
    set onWoMin(v) { if(Type.isFn(v)){this._onWoMin=v} }
    get onWoMax( ) { return this._onWoMax}
    set onWoMax(v) { if(Type.isFn(v)){this._onWoMax=v} }
    #isFn(v) { return ('function'===typeof v) }
    log() { console.log(`i:${this.i} l:${this.l} d:${this.d} q:${this.q}`) }
}
class LoopCursor extends WithoutCursor {
    constructor(l, fi=0) {
        super(l, fi, (self)=>self.i = (self.fi===self.i) ? self.li : self.fi, 
                     (self)=>self.i = (self.li===self.i) ? self.fi : self.li)
//        super(l, fi, (self)=>self._v.v = (self.fi===self.i) ? self.li : self.fi, 
//                     (self)=>self._v.v = (self.li===self.i) ? self.fi : self.li)
    }
}
class YoyoCursor extends WithoutCursor {
    constructor(l, fi=0) {
        super(l, fi, (self)=>{ if(-1===this.d){self.revD()}; self._v.v = self.fi + self.q; },
                     (self)=>{ self.revD(); self._v.v = (self.li + 1) + ((self.q + 1) * self.d) })
//        super(l, fi, (self)=>{ self.revD(); self._v.v = self.fi + self.q; },
//                     (self)=>{ self.revD(); self._v.v = (self.li + 1) + ((self.q + 1) * self.d) })
//        super(l, fi, (self)=>{ self.revD(); self._v.v = self.q * self.d + self.fi; },
//                     (self)=>{ self.revD(); self._v.v = (self.li + 1) + ((self.q + 1) * self.d) })
//        super(l, fi, (self)=>{ self.revD(); self.i = self.q * self.d + self.fi; },
//                     (self)=>{ self.revD(); self.i = (self.li + 1) + ((self.q + 1) * self.d) })
//        super(l, fi, (self)=>{ self.revD(); self.i = self.q * self.d + self.fi; },
//                     (self)=>{ self.revD(); self.i = (self.li + 1) + ((self.q + 1) * self.d) })
//        super(l, fi, (self)=>{ self.revD(); self.i += (self.q * self.d); },
//                     (self)=>{ self.revD(); self.i = self.l + ((self.q + 1) * self.d) })
    }
}
class StopCursor extends WithoutCursor {
    constructor(l, fi=0) {
        super(l, fi, (self)=>self.i = self.fi,
                     (self)=>self.i = self.li)
    }
}
*/
/*
class Page extends LoopCursor {
    constructor(l=1, n=1) {
        super(Math.max(1, Math.floor(l/n)), 1)
    }
    get now() { return this.i }
    get all() { return this.l }
    set now(v) { this.i = v }
    set all(v) { this.l = v }
}
*/

/*
// Page
class PageLoopCursor {
    constructor(L=1, l=1) { // L:全項目数, l:一画面に表示する最大項目数
        this._c = new LoopCursor(L) // 全項目数に対する絶対カーソル
        this._i = new LoopCursor(l) // 表示項目数に対する相対カーソル
        this._p = new LoopCursor(Math.max(1, Math.ceil(L/l)), 1)
        //this._p = new Page(l, n)
    }
    get I() { return this._c.i } // cursor: 全項目数に対する絶対カーソル
//    get c() { return this._c } // cursor: 全項目数カーソル
//    get p() { return this._p } // page: l÷n
//    get np() { return this._p.i } // nowPage
//    get ap() { return this._p.l } // allPage
    get p() { return this._p } // p.now, p.all
    get l() { return this._i.l }  // l: 一画面に表示する最大件数
    //get i() { return this.c.i % this.n } // i: 表示件数に対する相対カーソル
    get i() { return this._i.i } // i: 表示件数に対する相対カーソル

    set l(v) { this._i.l = v }
    set i(v) {
        if (v < this._i.fi) { // 前頁の末尾へ
            this._i.i = v
            //this.p.now--
            this.p.i--
            //this._c.i = this._i.i + ((this.p.now - 1) * this.n)
            this._c.i = this._i.i + ((this.p.i - 1) * this.n)
        }
        else if (this._n.li < v) {
            this._i.i = v
            //this.p.now++
            this.p.i++
            //this._c.i = this._i.i + ((this.p.now - 1) * this.n)
            this._c.i = this._i.i + ((this.p.i - 1) * this.n)
        }
        else {
            this._i.i = v
            this._c.i = this._i.i + ((this.p.i - 1) * this.n)
        }
    }
    set I(v) {
        const I = this.I
        const i = this.i
        const p = this.p.i
        this._c.i = v
        this._i.i = this._c.i % this._i.l
        this._p.i = parseInt(this._c.i / this._i.l) + 1
        //this._p.i = Math.floor(this._c.i / this._i.l)
//        console.log(`I:${this._c.i}  l:${this._i.l} p:${this._p.i}`)
//        if (I!==this._c.i) { this.onChangeAI(this) }
//        if (i!==this._i.i) { this.onChangeRI(this) }
//        if (p!==this._p.i) { this.onChangeP(this) }
    }

    get L( ) { return this._c.l }
    set L(v) {
        const ci = this.c.i
        const pi = this.p.i
        this.c.l = v
        this.p.l = Math.floor(this.L / this.l)
        c.i = (c.l<=ci) ? c.fi : ci
        p.i = (p.l<=pi) ? p.fi : pi
    }
//    next() { this.i.next() }
//    prev() { this.i.prev() }
    //next() { this.I.next() }
    //prev() { this.I.prev() }
//    next() { this._c.next() }
//    prev() { this._c.prev() }
//    forward() { this.p.next() }
//    back() { this.p.prev() }
    next() { this.I++ }
    prev() { this.I-- }
    forward() { this.p.i++ }
    back() { this.p.i-- }
    log () { console.log(`I:${this.I} L:${this.L} i:${this.i} l:${this.l} p:${this.p.i}/${this.p.l}`) }
}
*/

// Page
class PageLoopCursor {
    constructor(L=1, l=1, onChangeAi=null, onChangeRi=null, onChangePi=null, onChangeAl=null, onChangeRl=null, onChangePl=null) { // L:全項目数, l:一画面に表示する最大項目数
    //constructor(L=1, l=1) { // L:全項目数, l:一画面に表示する最大項目数
        this._a = new LoopCursor(L) // 全項目数に対する絶対カーソル
        this._r = new LoopCursor(l) // 表示項目数に対する相対カーソル
        this._p = new LoopCursor(Math.max(1, Math.ceil(L/l)), 1)
        this._onChangeAi = (Type.isFn(onChangeAi)) ? onChangeAi : ()=>{}
        this._onChangeRi = (Type.isFn(onChangeRi)) ? onChangeRi : ()=>{}
        this._onChangeAl = (Type.isFn(onChangeAl)) ? onChangeAl : ()=>{}
        this._onChangeRl = (Type.isFn(onChangeRl)) ? onChangeRl : ()=>{}
        this._onChangePi = (Type.isFn(onChangePi)) ? onChangePi : ()=>{}
        this._onChangePl = (Type.isFn(onChangePl)) ? onChangePl : ()=>{}


        /*
        this._a.onWoMin = ()=>{
            this.i = this.li
        }
        this._a.onWoMax = ()=>{
            this.i = this.li
        }
        */
        //this._v.onWoMax = ()=>this.i = this.fi

    }
    get ai() { return this._a.i } // cursor: 全項目数に対する絶対カーソル
//    get c() { return this._c } // cursor: 全項目数カーソル
//    get p() { return this._p } // page: l÷n
//    get np() { return this._p.i } // nowPage
//    get ap() { return this._p.l } // allPage
    get p() { return this._p } // p.now, p.all
    get rl() { return this._r.l }  // l: 一画面に表示する最大件数
    //get i() { return this.c.i % this.n } // i: 表示件数に対する相対カーソル
    get ri() { return this._r.i } // i: 表示件数に対する相対カーソル

    set rl(v) { this._r.l = v }
    set ri(v) {
        if (v < this._r.fi) { // 前頁の末尾へ
            this._r.i = v
            //this.p.now--
            this.p.i--
            //this._c.i = this._i.i + ((this.p.now - 1) * this.n)
            this._a.i = this._r.i + ((this.p.i - 1) * this.rl)
        }
        else if (this._r.li < v) {
            this._r.i = v
            //this.p.now++
            this.p.i++
            //this._c.i = this._i.i + ((this.p.now - 1) * this.n)
            this._a.i = this._r.i + ((this.p.i - 1) * this.rl)
        }
        else {
            this._r.i = v
            this._a.i = this._r.i + ((this.p.i - 1) * this.rl)
        }
    }
    set ai(v) {
        const ai = this.ai
        const ri = this.ri
        const pi = this.p.i
        this._a.i = v
        this._r.i = this._a.i % this._r.l
        this._p.i = parseInt(this._a.i / this._r.l) + 1
        //this._p.i = Math.floor(this._c.i / this._i.l)
//        console.log(`I:${this._c.i}  l:${this._i.l} p:${this._p.i}`)
        if (ai!==this._a.i) { this._onChangeAi(this) }
        if (ri!==this._r.i) { this._onChangeRi(this) }
        if (pi!==this._p.i) { this._onChangePi(this) }
    }

    get al( ) { return this._a.l }
    set al(v) {
        const ci = this.a.i
        const pi = this.p.i
        this.c.l = v
        this.p.l = Math.floor(this.al / this.rl)
        c.i = (c.l<=ci) ? c.fi : ci
        p.i = (p.l<=pi) ? p.fi : pi
    }
//    next() { this.i.next() }
//    prev() { this.i.prev() }
    //next() { this.I.next() }
    //prev() { this.I.prev() }
//    next() { this._c.next() }
//    prev() { this._c.prev() }
//    forward() { this.p.next() }
//    back() { this.p.prev() }
    next() { this.ai++ }
    prev() { this.ai-- }
    //forward() { this.p.i++; this._r.i+=this.rl; this._a.i=this.ri+((this.p.i-1)*this.rl); }
    //forward() { this.p.i++; console.log(`ai:${this._a.i} rl:${this.rl}`);this._a.i+=this.rl; this._r.i=this.ai%this.rl; }
    forward() {
             if (this.p.i === this.p.li) { this._a.i = this._a.fi }
//             if (this._a.li === this._a.i && this.p.i === this.p.li) { this._a.i = this._a.fi }
        else if (this._a.li < this.ai+this.rl) { this._a.i = this._a.li }
        else { this._a.i += this.rl }
        this.p.i++
        this._r.i=this.ai%this.rl
    }
    back() {
             if (this.p.i === this.p.fi) { this._a.i = this._a.li }
        else if (this.ai-this.rl < this._a.fi) { this._a.i = this._a.li }
        else { this._a.i -= this.rl }
        this.p.i--
        this._r.i=this.ai%this.rl
    }

//    back() { this.p.i--; this._r.i-=this.rl; this._a.i=this.ri+((this.p.i-1)*this.rl); }
//    forward() { this.ai+=this.rl }
//    back() { this.ai-=this.rl }
//    forward() { this.p.i++ }
//    back() { this.p.i-- }
    log () { console.log(`ai:${this.ai} al:${this.al} ri:${this.ri} rl:${this.rl} p:${this.p.i}/${this.p.l}`) }
}


// Grid
class LoopGridCursor {
    constructor(row=1, col=1) {
        this._y = new LoopCursor(row, 1)
        this._x = new LoopCursor(col, 1)
    }
}
class YoyoGridCursor {
    constructor(row=1, col=1) {
        this._y = new YoyoCursor(row, 1)
        this._x = new YoyoCursor(col, 1)
    }
}
class StopGridCursor {
    constructor(row=1, col=1) {
        this._y = new StopCursor(row, 1)
        this._x = new StopCursor(col, 1)
    }
}


/*
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
    set l(v) { if (Type.isInt(v) && 0 < l) { this._i = v } }

    get d( ) { return this._d }
    set d(v) { if ([...Object.values(IndexCursor.Dirs)].some(V=>V===v)) { this._d = v } }
    get q( ) { return this._q }
    set q(v) { if (Type.isInt(v) && 0 < v && v < this.l) { this._q = v } }

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
*/
window.Cursor = {
    Loop: LoopCursor,
    Yoyo: YoyoCursor,
    Stop: StopCursor,
    Page: {
        Loop: PageLoopCursor,
    },
}
})();
