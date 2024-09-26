class Swipe {
    constructor(target) {
        this._target = target
        this._pos = { s:{x:0, y:0}, e:{x:0, y:0} }
        this._len = { w:0, h:0 }
        this._threshold = {
            x: Math.min(window.innerWidth/4, 300),
            y: Math.min(window.innerHeight/6, 50),
        }
        this._events = {}
    }
    get target() { return this._target }
    set target(v) { this._target = v }
    addEvent() {
        console.log(`Swipe.addEvent:`, this._target)
        this._target.addEventListener('touchstart', this.#onTouchStart.bind(this), {passive:true})
        this._target.addEventListener('touchmove', this.#onTouchMove.bind(this), {passive:true})
        this._target.addEventListener('touchcancel', this.#onTouchCancel.bind(this), {passive:true})
        this._target.addEventListener('touchend', this.#onTouchEnd.bind(this), {passive:true})
        window.addEventListener('resize', this.#setThreshold.bind(this));
    }
    delEvent() {
        console.log(`Swipe.delEvent`)
        this._target.removeEventListener('touchstart', this.#onTouchStart.bind(this), {passive:true})
        this._target.removeEventListener('touchmove', this.#onTouchMove.bind(this), {passive:true})
        this._target.removeEventListener('touchcancel', this.#onTouchCancel.bind(this), {passive:true})
        this._target.removeEventListener('touchend', this.#onTouchEnd.bind(this), {passive:true})
        window.removeEventListener('resize', this.#setThreshold.bind(this));
    }
    #setThreshold() {
        this._threshold.x = Math.min(window.innerWidth/4, 300)
        this._threshold.y = Math.min(window.innerHeight/6, 50)
    }
    #onTouchStart(e) {
        this._pos.s.x = e.touches[0].pageX;
        this._pos.s.y = e.touches[0].pageY;
        this._pos.e.x = this._pos.s.x;
        this._pos.e.y = this._pos.s.y;
        this.#kickEvent('swipe.start');
    }
    #onTouchMove(e) {
        this._pos.e.x = e.touches[0].pageX;
        this._pos.e.y = e.touches[0].pageY;
        this._len.w = this._pos.e.x - this._pos.s.x
        this._len.h = this._pos.e.y - this._pos.s.y
        this.#kickEvent('swipe.move');
    }
    #onTouchCancel(e) {
        this.#reset();
        this.#kickEvent('swipe.cancel');
    }
    #onTouchEnd(e) {
        // 横方向の移動が閾値を超えてる＝＞左右スワイプ
        if (Math.abs(this._len.w) >= this._threshold.x) {
            if (this._len.w < 0) { this.#kickEvent('swipe.left') }
            else { this.#kickEvent('swipe.right') }
        // 左右の検出をしたかったけど閾値超えず＝＞キャンセル
//        } else if (direction == "lr") {
//            kickEvent("swipe.cancel");
//        }
        }
        // 縦方向の移動が閾値を超えてる＝＞上下スワイプ
        if (Math.abs(this._len.h) >= this._threshold.y) {
            if (this._len.h < 0) { this.#kickEvent('swipe.up') }
            else { this.#kickEvent('swipe.down') }
        }
        // 上下の検出をしたかったけど閾値超えず＝＞キャンセル
//        else if (direction == "ud") {
//            kickEvent("swipe.cancel");
//        }
        this.#reset();
    }
    #kickEvent(evNm) {
//        if (undefined==this._events[evNm]) { this._events[evNm] = new Event(evNm) }
//        this._target.dispatchEvent(this._events[evNm]);
        if (undefined===this._events[evNm]) { this._events[evNm] = new CustomEvent(evNm, { detail: {
            w: this._len.w, 
            h: this._len.h,
            sx: this._pos.s.x,
            sy: this._pos.s.y,
            ex: this._pos.e.x,
            ey: this._pos.e.y,
        }}) }
        this._target.dispatchEvent(this._events[evNm])
    }
    #reset() {
        this._pos.s.x = 0
        this._pos.s.y = 0
        this._pos.e.x = 0
        this._pos.e.y = 0
        this._len.w = 0
        this._len.h = 0
    }
    /*
    #cancel() {
        this.#reset();
        this.#kickEvent('swipe.cancel');
    }
    */
}
