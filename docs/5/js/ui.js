;(function(){
try { Type }
catch (e) {
    class _Type {
        isFn(v) {return 'function'===typeof v}
        isInt(v) {return Number.isInteger(v)}
        isStr(v) {return 'string'===typeof v || v instanceof String}
        isAry(v) {return Array.isArray(v)}
        throw(msg) {throw new TypeError(msg) }
    }
    Type = new _Type
}
class ItemData {
    constructor(data, onValid, onSetDatas=null, onSetData=null) {
        if (!Type.isAry(data)) {throw new TypeError(`dataは配列型であるべきです。`)}
        this._onValid = (Type.isFn(onValid)) ? onValid : ()=>true
        this._onSetDatas = (Type.isFn(onSetDatas)) ? onSetDatas : ()=>{}
        this._onSetData = (Type.isFn(onSetData)) ? onSetData : ()=>{}
        this._data = data
    }
    get d() { return this._data }
    set d(v) {
        if (!Type.isAry(v)) {throw new TypeError(`dataは配列型であるべきです。`)}
        if (!v.every(V=>this._onValid(V))) {throw new TypeError(`data要素の値はonValidが真を返す値であるべきです。`)}
        this._data = v
        this._onSetDatas(this._data)
    }
    setData(v,i) {
        if(!this._onValid(v)) {throw new TypeError(`data要素の値はonValidが真を返す値であるべきです。`)}
        if(i<0 || this.d.length-1<i) {throw new TypeError(`iはdata配列の範囲内であるべきです。i:${i} 0〜${this.d.length-1}`)}
        this.d[i] = v
        this._onSetData(this.d[i], i)
    }
    get onSetDatas( ) { return this._onSetDatas }
    set onSetDatas(v) { if(Type.isFn(v)){this._onSetDatas=v} }
    get onSetData( ) { return this._onSetData }
    set onSetData(v) { if(Type.isFn(v)){this._onSetData=v} }
}
class OptionSetter {
    setOption(options) {
        if (null!==options && 'object'===typeof options && Object===options.constructor) {
            for (let key of Object.keys(options)) {
                if (Object.getPrototypeOf(this).hasOwnProperty(key)) { this[key] = options[key] }
            }
        }
    }
}
class PageLoopCursorData {
    constructor(options) {
        this._o = options
        //this._cur = new PageLoopCursor(this._o.data.length, this._o.row)
        this._cur = new Cursor.Page.Loop(this._o.data.length, this._o.row)
        //this._data = new ItemData(this._o.data, this._o.onValidData, (d)=>this._cur.al = d.length)
        this._data = new ItemData(this._o.data, this._o.onValidData)
    }
    get d() { return this._data }
    get c() { return this._cur }
    get selected() { return this._data.d[this._cur.ai] }
    get paged() { return  this._cur.pageAis.map(ai=>this._data.d[ai]) }
    set d(v) {
        this._data.d = v
        this._cur.al = this._data.d.length
    }
}

class PageLoopListCommand {
    constructor(options) {
    }
    next() {}
    prev() {}
    forward() {}
    back() {}
    select() {}
    choose() {}
}
class PageLoopList {
    constructor(options) {
        this._o = options
        this._data = new PageLoopCursorData({data:this._o.data, onValidData:(v)=>Number.isInteger(v), row:this._o.row})
        this._data.onSetDatas = (d)=>{
            this._data.c.al = d.length
            this._listEl.remake(this._data.paged)
            this._pageEl.remake(this._data.d)
        }
        this._listEl = new ListEl({
            row: this._o.row, 
            onMake: this._o.onMake, 
            height: this._o.height, 
            onSetHeight : ()=>{},
            onMakeChild: this._o.onMakeChild,
            onMouseEnter: (e)=>{
                this._el.focus()
                console.log(this._listEl.lis, e.target)
                this._data.c.ri = this._listEl.lis.indexOf(e.target)
                this.#show()
//                this.#clear()
                //const selected = this._listEl.lis.indexOf(e.target)
//                const selected = this._listEl.lis.filter((li,i)=>li===e.target)[0]
//                selected.classList.add('selected');
            },
            onMouseLeave: (e)=>{
                this.#clear()
            },
        })
        this._pageEl = new PageEl({
            cursor: this._data.c, 
            dir: this._o.pageDir ?? 'horizontal', 
            onPrev: (c)=>this._listEl.remake(this._data), 
            onNext: (c)=>this._listEl.remake(this._data)
        })
/*
        this._config = {
            key: new ListKeyConfig(),
            pad: new ListPadConfig(),
            touch: new ListMouseConfig(),
            mouth: new ListTouchConfig(),
        }
        */
        this._data.onSetDatas = (d)=>{
            this._cur.L = d.length // カーソルの長さを更新する
            this._listEl.remake() // HTML要素とイベントを再作成する delEvent(), make(), addEvent()
            this._pageEl.remake() // HTML要素とイベントを再作成する delEvent(), make(), addEvent()
        }
        this._data.onSetData = (d,i)=>{
            // HTML要素とイベントを再作成する（表示領域内なら）
        }
        this._el = this.#make()
    }
    get el() { return this._el }
    get c() { return this._data.c }
    get data( ) { return this._data }

    get paged() { return this._listEl.lis }
    get selected() { return this._listEl.lis[this._data.c.ri] }
    #show() {this.#clear(); this.selected.classList.add('selected');}
    //#clear() {this._listEl.lis.filter(li=>li.classList.contains('selected')).map(li=>li.classList.remove('selected'))}
    #clear() {this._listEl.lis.map(li=>li.classList.remove('selected'))}

//    get datas( ) { return this._data.d.d }
//    set datas(v) { this._data.d.d = v }
//    get data( ) { return this._data.d[this._cur.i] }
//    set data(v) { this._data.setData(v, this._cur.i) }
    /*
    get ai() { return this.c.ai } // 相対カーソル（最大表示項目数に対するカーソル位置0〜N）
    get ri() { return this.c.ri } // 絶対カーソル（全項目数に対するカーソル位置0〜N）
    get pi() { return this.c.pi } // 現ページ数（1〜N）
    get pl() { return this.c.pl } // 全ページ数（1〜N）
    nextCursor() { this.ai++ }
    prevCursor() { this.ai-- }
    nextPage() { this.pi++ }
    prevPage() { this.pi-- }
    setCursor(i,p) {
        if (i) { this._cur.i = i; }
        if (p) { this._cur.p.i = p; }
    }
    */
    //#make() { console.log(this.datas);return van.tags.div(this._listEl.make(this.datas), this._pageEl.make()) }
    #make() { console.log(this.data);return van.tags.div(this._listEl.make(this.data), this._pageEl.make()) }
}
class ListEl {
    constructor(options) {
        this._o = options
        this._li = new LiEl({height:this._o.height, 
            onSetHeight: this._o.onSetHeight, 
            onMakeChild: this._o.onMakeChild, 
            onMouseEnter:this._o.onMouseEnter,
            onMouseLeave:this._o.onMouseLeave})
        this._ol = new OlEl({row:this._o.row, onMake:this._o.onMake, liEl:this._li})
        this._el = null
    }
    get el() { return this._el }
    get ol() { return this._ol }
    get li() { return this._li }
    get lis() { return this._ol.lis }
    make(data) { this._el = this.ol.make(data); return this._el; }
    remake(data) { this.ol.remake(data) }
    /*
    make(data) {
        console.log(`ListEl.make`)
        if (this._el) { this.#delEvent() }
        this._el = this.ol.make(data)
        this.#addEvent()
        return this._el
    }
    remake(data) {
        if (this._el) { this.#delEvent() }
        this.ol.remake(data)
        this.#addEvent()
    }
    */
    #addEvent() {
        this._ol.addEvent()
        this._li.addEvent()
    }
    #delEvent() {
        this._ol.addEvent()
        this._li.delEvent()
    }
}
// ol要素
class OlEl extends OptionSetter  {
    constructor(options) {
        super()
        this._o = options
        //this._data = this._o.data
        this._liEl = this._o.liEl
        this._num = {
            row: van.state(7),
//            row: 7,
//            col: 1,
        }
        this._onMake = ((Type.isFn(this._o.onMake)) ? this._o.onMake : ()=>{})
        this._el = null
        this._lis = null
        this.setOption(options)
    }
    get el() { return this._el }
    get lis() { return this._lis }
    get row() { return this._num.row.val }
    set row(v) { if(Type.isInt(v)){this._num.row.val = v} }
    get onMake() { return this._onMake }
    set onMake(v) { if(Type.isFn(v)){this._onMake=v} }
    make(data) {
        console.log(`OlEl.make`)
        if (this._el) { this.delEvent() }
        this._el = van.tags.ol({tabindex:0, style:()=>`padding:0;margin:0;box-sizing:border-box;height:${this._liEl.height*this.row}px;overflow-y:auto;`}, this.#makeLis(data))
        this.addEvent()
        return this._el
    }
    remake(data) { this._el.replaceWith(this.make(data)) }
    //make(data) { return van.tags.ol({tabindex:0, style:()=>`padding:0;margin:0;box-sizing:border-box;height:${this._liEl.height*this.row}px;overflow-y:auto;`}, this.#makeLis(data)) }
    //#makeLis(data) { console.log(data);return [...Array(this._num.row)].map((_,i)=>this._liEl.make(data[i], i)) }
    //#makeLis(data) { console.log(data, data.c.pageAis);return [...Array(data.c.pageAis)].map((d,i)=>this._liEl.make(d,i)) }
    //#makeLis(data) { console.log(data, data.c.pageAis, data.d, data.d.d);return [...Array(data.c.pageAis)].map((d,i)=>this._liEl.make(data.d.d[d],i)) }
    //#makeLis(data) { return data.c.pageAis.map((d,i)=>this._liEl.make(data.d.d[d],i)) }
    #makeLis(data) {
        console.log(`OlEl.#makeLis`, data)
        if (this._lis) { this._lis.map(li=>this._liEl.delEvent(li)) }
        this._lis = data.c.pageAis.map((d,i)=>this._liEl.make(data.d.d[d],i))
        console.log(this._lis)
        this._lis.map(li=>this._liEl.addEvent(li))
        console.log(`OlEl.#makeLis end`)
        return this._lis
    }

    addEvent() {
        /*
        if (!this.ol) {return}
        this.#addEventLis()
        this.ol.addEventListener('wheel', this.#onWheel.bind(this), {passive:false})
        this.ol.addEventListener('mouseup', this.#onMouseUp.bind(this))
        this.ol.addEventListener('keydown', this.#onKeyDown.bind(this))
        */
    }
    delEvent() {
        /*
        if (!this.el) {return}
        this.#delEventLis()
        this.ol.removeEventListener('wheel', this.#onWheel.bind(this), {passive:false})
        this.ol.removeEventListener('mouseup', this.#onMouseUp.bind(this))
        this.ol.removeEventListener('keydown', this.#onKeyDown.bind(this))
        */
    }

        /*
    remake() { // 頁遷移したときにli要素の内容を更新する
        this.#delEventLis()
        const items = this.#nowPageItems
        items.map((item,i)=>this.ol.children[i].replaceWith(this.#makeLi(item,i)))
        if (items.length < this.row) {
            const blankLen = this.row - items.length
            const blankIdxs = [...Array(blankLen)].map((_,i)=>this.row - blankLen + i)
            blankIdxs.map(idx=>this.ol.children[idx].style.display='none')
        }
        this.#addEventLis()
    }
    #onMouseEnter(e) {
        console.log(`MouseEnter:`, e)
        this.ol.focus()
        this._y = [...e.target.parentElement.children].indexOf(e.target)
        console.log(`MouseEnter: y=${this._y}`)
        this.#show()
    }
    #onMouseLeave(e) {
        console.log(`MouseLeave:`, e)
        this.#clear()
    }
    #onWheel(e) {
        console.log(`Wheel:`, e)
        this.ol.focus()
        if (e.deltaY<0) { this.onWheelUp(e) }
        else if (0<e.deltaY) { this.onWheelDown(e) }
        else if (e.deltaX<0) { this.onWheelLeft(e) }
        else if (0<e.deltaX) { this.onWheelRight(e) }
        e.preventDefault()
    }
    #onMouseUp(e) {
        console.log(`MouseUp:`, e)
        this.ol.focus()
             if (0===e.button) {console.log(`マウス左ボタン押下`)}
        else if (1===e.button) {console.log(`マウス中ボタン押下`)}
        else if (2===e.button) {console.log(`マウス右ボタン押下`)}
        else if (3===e.button) {console.log(`マウス戻るボタン押下`)}
        else if (4===e.button) {console.log(`マウス進むボタン押下`)}
        else {console.log(`不明なマウスボタンを押下した。`)}
    }
    #onKeyDown(e) {
        console.log(`keydown: ${e.key}`)
        if (event.isComposing || event.keyCode === 229) {return} // IME変換中操作を無視する
        else {this.onKeyDown(e)}
        e.preventDefault()
    }
    #addEventLis() {
        this.#lis.map(li=>li.addEventListener('mouseenter', this.#onMouseEnter.bind(this)))
        this.#lis.map(li=>li.addEventListener('mouseleave', this.#onMouseLeave.bind(this)))
    }
    #delEventLis() {
        this.#lis.map(li=>li.removeEventListener('mouseenter', this.#onMouseEnter.bind(this)))
        this.#lis.map(li=>li.removeEventListener('mouseleave', this.#onMouseLeave.bind(this)))
    }
    #addEvent() {
        if (!this.ol) {return}
        this.#addEventLis()
        this.ol.addEventListener('wheel', this.#onWheel.bind(this), {passive:false})
        this.ol.addEventListener('mouseup', this.#onMouseUp.bind(this))
        this.ol.addEventListener('keydown', this.#onKeyDown.bind(this))
    }
    #delEvent() {
        if (!this.el) {return}
        this.#delEventLis()
        this.ol.removeEventListener('wheel', this.#onWheel.bind(this), {passive:false})
        this.ol.removeEventListener('mouseup', this.#onMouseUp.bind(this))
        this.ol.removeEventListener('keydown', this.#onKeyDown.bind(this))
    }
        */
}
// li要素
class LiEl extends OptionSetter {
    constructor(options) {
        super()
        this._size = {
            height: van.state(24),
            //height: 24,
        }
        this._onMakeChild = this.#onMakeChild.bind(this)
        this._onSetHeight = ()=>{}
        this._onMouseEnter = ()=>{}
        this._onMouseLeave = ()=>{}
        this._els = null
        this.setOption(options)
    }
    get els() { return this._els }
    get height( ) { return this._size.height.val }
    //set height(v) { if(Number.isFinite(v) && 16<=v) { this._size.height.val = v; this.resize(); } }
    set height(v) { if(Number.isFinite(v) && 16<=v) { this._size.height.val = v; this._onSetHeight(); } }
    get onSetHeight() { return this._onSetHeight }
    set onSetHeight(v) { if(Type.isFn(v)) { this._onSetHeight = v } }
    get onMakeChild( ) { return this._onMakeChild }
    set onMakeChild(v) { if(Type.isFn(v)) { this._onMakeChild = v } }
    get onMouseEnter ( ) { return this._onMouseEnter  }
    set onMouseEnter (v) { if(Type.isFn(v)) { this._onMouseEnter  = v } }
    get onMouseLeave ( ) { return this._onMouseLeave  }
    set onMouseLeave (v) { if(Type.isFn(v)) { this._onMouseLeave  = v } }

    //make(data,i) { return van.tags.li({style:()=>`list-style-type:none;box-sizing:border-box;border:1px solid black;height:${this._size.height.val}px;`}, this._onMakeChild(data,i)) }
    make(data,i) { return van.tags.li({style:this.#style.bind(this)}, this._onMakeChild(data,i)) }
    /*
    make(data,i) {
        if (this._els) { this.delEvent() }
        this._els = van.tags.li({style:this.#style.bind(this)}, this._onMakeChild(data,i))
        this.addEvent()
        return this._els
    }
    */
    //#style() {return `list-style-type:none;box-sizing:border-box;border:1px solid black;height:${this._size.height.val}px;` }
    #style() {return `list-style-type:none;box-sizing:border-box;border:1px solid black;height:${this._size.height}px;` }
    #onMakeChild(data,i) { console.log(data,i);return document.createTextNode(data.toString()) }
    addEvent(li) {
        console.log(`LiEl.addEvent: `,li)
        li.addEventListener('mouseenter', this._onMouseEnter)
        li.addEventListener('mouseleave', this._onMouseLeave)
//        li.addEventListener('mouseenter', this._onMouseEnter.bind(this))
//        li.addEventListener('mouseleave', this._onMouseLeave.bind(this))
//        li.addEventListener('mouseenter', this.#onMouseEnter.bind(this))
//        li.addEventListener('mouseleave', this.#onMouseLeave.bind(this))
//        this._els.map(li=>li.addEventListener('mouseenter', this.#onMouseEnter.bind(this)))
//        this._els.map(li=>li.addEventListener('mouseleave', this.#onMouseLeave.bind(this)))
        //this.#lis.map(li=>li.addEventListener('mouseenter', this.#onMouseEnter.bind(this)))
        //this.#lis.map(li=>li.addEventListener('mouseleave', this.#onMouseLeave.bind(this)))
    }
    delEvent(li) {
        li.removeEventListener('mouseenter', this._onMouseEnter)
        li.removeEventListener('mouseleave', this._onMouseLeave)
//        li.removeEventListener('mouseenter', this._onMouseEnter.bind(this))
//        li.removeEventListener('mouseleave', this._onMouseLeave.bind(this))
//        li.removeEventListener('mouseenter', this.#onMouseEnter.bind(this))
//        li.removeEventListener('mouseleave', this.#onMouseLeave.bind(this))
//        this._els.map(li=>li.removeEventListener('mouseenter', this.#onMouseEnter.bind(this)))
//        this._els.map(li=>li.removeEventListener('mouseleave', this.#onMouseLeave.bind(this)))
//        this.#lis.map(li=>li.removeEventListener('mouseenter', this.#onMouseEnter.bind(this)))
//        this.#lis.map(li=>li.removeEventListener('mouseleave', this.#onMouseLeave.bind(this)))
    }

    /*
    addEvent() {
        //this.#lis.map(li=>li.addEventListener('mouseenter', this.#onMouseEnter.bind(this)))
        //this.#lis.map(li=>li.addEventListener('mouseleave', this.#onMouseLeave.bind(this)))
        this._els.map(li=>li.addEventListener('mouseenter', this.#onMouseEnter.bind(this)))
        this._els.map(li=>li.addEventListener('mouseleave', this.#onMouseLeave.bind(this)))
    }
    delEvent() {
        this._els.map(li=>li.removeEventListener('mouseenter', this.#onMouseEnter.bind(this)))
        this._els.map(li=>li.removeEventListener('mouseleave', this.#onMouseLeave.bind(this)))
//        this.#lis.map(li=>li.removeEventListener('mouseenter', this.#onMouseEnter.bind(this)))
//        this.#lis.map(li=>li.removeEventListener('mouseleave', this.#onMouseLeave.bind(this)))
    }
    */
    #onMouseEnter(e) {
        console.log(`MouseEnter:`, e)
//        this.ol.focus()
//        this._y = [...e.target.parentElement.children].indexOf(e.target)
//        console.log(`MouseEnter: y=${this._y}`)
//        this.#show()
        this._onMouseEnter()
    }
    #onMouseLeave(e) {
        console.log(`MouseLeave:`, e)
//        this.#clear()
        this._onMouseLeave()
    }
}
class PageEl extends OptionSetter {
    //constructor(cur) {
    constructor(options) {
        super()
        this._o = options
        this._cur = this._o.cursor // PageLoopCursor 
        this._now = van.state(this._cur.pi)
        this._all = van.state(this._cur.pl)
        this._dir = van.state('horizontal') // vertical
        this.dir = this._o.dir
        this._onPrev = ()=>{}
        this._onNext = ()=>{}
        console.log(options, this.dir)
        this.setOption(options)
    }
    get now() { return this._now.val }
    get all() { return this._all.val }
    get dir() { return this._dir.val }
    set now(v) { this._now.val = v }
    set all(v) { this._all.val = v }
    set dir(v) { if (['horizontal','vertical'].some(V=>V===v)) { this._dir.val = v } }l
    get onPrev( ) { return this._onPrev }
    set onPrev(v) { if(Type.isFn(v)){this._onPrev=v} }
    get onNext( ) { return this._onNext }
    set onNext(v) { if(Type.isFn(v)){this._onNext=v} }

    make() { return van.tags.div({style:this.#style.bind(this)}, 
        //van.tags.button({onclick:(e)=>{--this._cur.pi;this.now=this._cur.pi;console.log(`pi:${this._cur.pi}`);}}, this.#makePrevBtnTxt()),
        van.tags.button({onclick:(e)=>{
            --this._cur.pi
            this.now = this._cur.pi
            console.log(`pi:${this._cur.pi}`)
            this.onPrev(this._cur)
            }}, this.#makePrevBtnTxt()),
//        ()=>`${this.now}/${this.all}`,
        this.#makePage.bind(this),
        //van.tags.button({onclick:(e)=>{++this._cur.pi;this.now=this._cur.pi;console.log(`pi:${this._cur.pi}`);}}, this.#makeNextBtnTxt()))
        van.tags.button({onclick:(e)=>{
            ++this._cur.pi
            this.now = this._cur.pi
            this.onNext(this._cur)
            console.log(`pi:${this._cur.pi}`);}}, this.#makeNextBtnTxt()))
    }
    #makePrevBtnTxt() { return ('horizontal'===this.dir) ? '◀' : '▲' }
    #makeNextBtnTxt() { return ('horizontal'===this.dir) ? '▶' : '▼' }
    #makePage() { return `${this.now}/${this.all}` }
    #style() { return this.#writingMode()+this.#textOrientation() }
    #writingMode() { return `writing-mode:${('horizontal'===this.dir) ? 'horizontal-tb' : 'vertical-rl' };` }
    #textOrientation() { return `text-orientation:${('horizontal'===this.dir) ? 'mixed' : 'upright' };` }
}

















/*
class PageLoopList {
    constructor(options) {
        this._o = options
        this._data = new ListData({d:this._o.data, onValid:(v)=>Number.isInteger(v)})
        this._cur = Cursor.Page.Loop(this._o.data.length, this._o.row)
        this._listEl = new ListEl({row:this._o.row, onMake:this._o.onMake, height:this._o.height, onMakeChild:this._o.onMakeChild})
        this._pageEl = new PageEl({})
//        this._listEl = new ListEl({row:this._o.row})
//        this._liEl = new ListItemEl({height:this._o.height})
        this._config = {
            key: new ListKeyConfig(),
            pad: new ListPadConfig(),
            touch: new ListMouseConfig(),
            mouth: new ListTouchConfig(),
        }
        this._data.onSetDatas = (d)=>{
            this._cur.L = d.length // カーソルの長さを更新する
            this._listEl.remake() // HTML要素とイベントを再作成する delEvent(), make(), addEvent()
            this._pageEl.remake() // HTML要素とイベントを再作成する delEvent(), make(), addEvent()
        }
        this._data.onSetData = (d,i)=>{
            // HTML要素とイベントを再作成する（表示領域内なら）
        }
    }
    get datas( ) { return this._data.d }
    set datas(v) { this._data.d = v }
    get data( ) { return this._data.d[this._cur.i] }
    set data(v) { this._data.setData(v, this._cur.i) }
    get i() { return this._cur.i } // 相対カーソル（最大表示項目数に対するカーソル位置0〜N）
    get I() { return this._cur.I } // 絶対カーソル（全項目数に対するカーソル位置0〜N）
    get p() { return this._cur.p.i } // 現ページ数（1〜N）
    get P() { return this._cur.p.l } // 全ページ数（1〜N）
    nextCursor() { this._cur.i++ }
    prevCursor() { this._cur.i-- }
    nextPage() { this._cur.p.i++ }
    prevPage() { this._cur.p.i-- }
    setCursor(i,p) {
        if (i) { this._cur.i = i; }
        if (p) { this._cur.p.i = p; }
    }
}
class OptionSetter {
    setOption(options) {
        if (null!==options && 'object'===typeof options && Object===options.constructor) {
            for (let key of Object.keys(options)) {
                if (Object.getPrototypeOf(this).hasOwnProperty(key)) { this[key] = options[key] }
            }
        }
    }
}
// data
class ListData extends OptionSetter {
    constructor(options) {
        this._onValid = (d)=>true
        this._onSetDatas = ()=>{}
        this._onSetData = ()=>{}
        this.d = d
        this.setOption(options)
    }
    get d( ) { return this._d }
    set d(v) { if (Array.isArray(v) && v.every(V=>this._onValid(V))) { this._d = v; this._onSetDatas(v); } }
    setData(d,i) { if (this._onValid(d)) { this._d[i] = d; this._onSetData(d,i);  } }
    get onValid( ) { return this._onValid }
    set onValid(v) { if('function'===typeof v){this._onValid=v} }
    get onSetDatas( ) { return this._onSetDatas }
    set onSetDatas(v) { if('function'===typeof v){this._onSetDatas=v} }
    get onSetData( ) { return this._onSetData }
    set onSetData(v) { if('function'===typeof v){this._onSetData=v} }
    #loadOptions(options) {
        if (null!==options && 'object'===typeof options && Object===options.constructor) {
            for (let key of Object.keys(options)) {
                if (Object.getPrototypeOf(this).hasOwnProperty(key)) { this[key] = options[key] }
            }
        }
    }
}

class ListEl {
    constructor(options) {
        this._o = options
        this._ol = new OlEl({row:this._o.row, onMake:this._o.onMake})
        this._li = new LiEl({height:this._o.height, onMakeChild:this._o.onMakeChild})
    }
    get ol() { return this._ol }
    get li() { return this._li }
}
// ol要素
class OlEl extends OptionSetter  {
    constructor(options) {
        this._num = {
            row: 7,
//            col: 1,
        }
        this._onMake = this.#onMake.bind(this)
        this.setOption(options)
    }
    make() { return van.tags.ol({tabindex:0, style:()=>`padding:0;margin:0;box-sizing:border-box;height:${this._item.height*this._state.row}px;overflow-y:auto;`}, this.#makeLis()) }
    #makeLis() { return [...Array(this._state.row)].map((_,i)=>this._item.make(this._state.datas[i], i)) }
    remake() { // 頁遷移したときにli要素の内容を更新する
        this.#delEventLis()
        const items = this.#nowPageItems
        items.map((item,i)=>this.ol.children[i].replaceWith(this.#makeLi(item,i)))
        if (items.length < this.row) {
            const blankLen = this.row - items.length
            const blankIdxs = [...Array(blankLen)].map((_,i)=>this.row - blankLen + i)
            blankIdxs.map(idx=>this.ol.children[idx].style.display='none')
        }
        this.#addEventLis()

    }
}
// li要素
class LiEl extends OptionSetter {
    constructor(options) {
        this._size = {
            //height: van.state(24),
            height: 24,
        }
        this._onMakeChild = this.#onMakeChild.bind(this)
        this.setOption(options)
    }
    #loadOptions(options) {
        if (null!==options && 'object'===typeof options && Object===options.constructor) {
            for (let key of Object.keys(options)) {
                if (Object.getPrototypeOf(this).hasOwnProperty(key)) { this[key] = options[key] }
            }
        }
    }
    get height( ) { return this._size.height.val }
    set height(v) { if(Number.isFinite(v) && 16<=v) { this._size.height.val = v; this.resize(); } }
    get onMakeChild( ) { return this._onMakeChild }
    set onMakeChild(v) { if('function'===typeof v) { this._onMakeChild = v } }
    //make(data,i) { return van.tags.li({style:()=>`list-style-type:none;box-sizing:border-box;border:1px solid black;height:${this._size.height.val}px;`}, this._onMakeChild(data,i)) }
    make(data,i) { return van.tags.li({style:this.#style.bind(this)}, this._onMakeChild(data,i)) }
    //#style() {return `list-style-type:none;box-sizing:border-box;border:1px solid black;height:${this._size.height.val}px;` }
    #style() {return `list-style-type:none;box-sizing:border-box;border:1px solid black;height:${this._size.height}px;` }
    #onMakeChild(data,i) { return document.createTextNode(data.toString()) }
}


class PageEl {
    constructor(cur) {
        this._cur = cur
    }
    make() { return van.tags.div({}, 
        van.tags.button({onclick:(e)=>--this._cur.p.i}, '◀'),
        ()=>`${this._cur.p.i}/${this._cur.p.l}`,
        van.tags.button({onclick:(e)=>++this._cur.p.i}, '▶'))
    }

}
*/




class ListConfig { // イベント
    constructor() {
        this._ol = new OlConfig()
        this._li = new LiConfig()
    }
    get ol() { return this._ol }
    get li() { return this._li }
    #ids() { return ['ol','li'] }
    addEvent() { this.#ids.map(id=>this[`_${id}`].addEvent()) }
    delEvent() { this.#ids.map(id=>this[`_${id}`].delEvent()) }
}
class OlConfig {
    constructor() {
        this._key = new OlKeyConfig()
        this._pad = new OlPadConfig()
        this._touch = new OlMouseConfig()
        this._mouth = new OlTouchConfig()
    }
    get key() { return this._key }
    get pad() { return this._pad }
    get touch() { return this._touch }
    get mouse() { return this._mouse }
    #ids() { return ['key','pad','touch','mouth'] }
    addEvent() { this.#ids.map(id=>this[`_${id}`].addEvent()) }
    delEvent() { this.#ids.map(id=>this[`_${id}`].delEvent()) }
}
class LiConfig {
    constructor() {
        this._key = new LiKeyConfig()
        this._pad = new LiPadConfig()
        this._touch = new LiMouseConfig()
        this._mouth = new LiTouchConfig()
    }
    get key() { return this._key }
    get pad() { return this._pad }
    get touch() { return this._touch }
    get mouse() { return this._mouse }
    #ids() { return ['key','pad','touch','mouth'] }
    addEvent() { this.#ids.map(id=>this[`_${id}`].addEvent()) }
    delEvent() { this.#ids.map(id=>this[`_${id}`].delEvent()) }
}
class OlKeyConfig { // 上下左右, Sp/BkSp, Enter/Esc, PgUp/PgDn, Home/End

}
class OlPadConfig { // 上下左右, L1/R1, L2/R2, ○/✕ , 


}
class OlMouseConfig { // wheel

}
class OlTouchConfig { // swipe

}

class LiMouseConfig { // enter,leave,down

}
class LiTouchConfig { // tap

}


/*
class LiKeyConfig {

}
class LiPadConfig {

}
*/

window.PageEl = PageEl
window.PageLoopList = PageLoopList
})();

