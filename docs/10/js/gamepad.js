;(function(){
class GamePad {
    constructor(options) { // pad: index, id, buttons, axes
        //this._pads = navigator.getGamepads()
        this._pads = []
        console.log('pads:', this._pads)
//        this._idxs = this._pads.map(pad=>pad.index)
        this._idx = 0===this._pads.length ? null : this._pads[0].index
        this._onButtonDown = Type.isFn(options.onButtonDown) ? options.onButtonDown : this.#onButtonDown.bind(this)
        this._onAxisMove = Type.isFn(options.onAxisMove) ? options.onAxisMove : this.#onAxisMove.bind(this)
        this._repeater = new ButtonRepeater({
            delay: 500,
            interval: 100,
            onButtonDown: this._onButtonDown,
        })
    }
    get pads() { return this._pads }
    get pad() { return (this._idx) ? this._pads[idx] : null }
    onPoll() {
//        console.log('onPoll')
        const now = Date.now()
        for (let [idx, pad] of Object.entries(navigator.getGamepads())) {
            for (let b=0; b<pad.buttons.length; b++) {
                this._repeater.onButtonDown(b, idx, pad, now)
            }
            for (let a=0; a<pad.axes.length; a++) {
                if (0!==pad.axes[a]) { this._onAxisMove(a, pad.axes[a], pad); this._time = now; }
            }
        }
        if (0 < this._pads.length) { window.requestAnimationFrame(this.onPoll.bind(this)) }
    }
    #onButtonDown(b, pad) {
        console.log(b, pad)
    }
    #onAxisMove(a, v, pad) {
        console.log(a, v, pad)
    }
    addEvent(target=window) {
        target.addEventListener("gamepadconnected", (e)=>{
            console.log(`Gamepad connected: ${e.gamepad.id}`, e.gamepad);
            this._pads[e.gamepad.index] = e.gamepad
            this._repeater.add(e.gamepad)
            this.onPoll()
        });
        target.addEventListener("gamepaddisconnected", (e)=>{
            console.log(`Gamepad disconnected: ${e.gamepad.id}`);
//            delete gamepads[e.gamepad.index];
        });
    }
}
class ButtonRepeater {
    constructor(options) {
        this._delay = options.delay ?? 500
        this._interval = options.interval ?? 100
        this._onButtonDown = options.onButtonDown ?? (()=>{})
        this._states = []
    }
    get delay( ) { return this._delay }
    set delay(v) { if (Number.isInteger(v) && 0 <= v) { this._delay = v } }
    get interval( ) { return this._interval }
    set interval(v) { if (Number.isInteger(v) && 0 <= v) { this._interval = v } }
    get onButtonDown( ) { return this._onButtonDown }
    set onButtonDown(v) { if ('function'===typeof v) { this._onButtonDown = v } }
    add(pad) {
        this._states.push([...Array(pad.buttons.length)].map((_,i)=>({
            isPressed: false, // 最初に押下した
            isRepeating: false, // リピート中である
            pressedTime: Date.now(), // 最初に押下した時点
        })))
    }
    onButtonDown(b, idx, pad, now) {
        if (pad.buttons[b].pressed) { // ボタン押下中
            if (this._states[idx][b].isPressed && this._delay < (now - this._states[idx][b].pressedTime)) {
                this._states[idx][b].isRepeating = true; // リピート発火
            }
            if (this._states[idx][b].isRepeating) { // リピート中
                if (this._interval < (now - this._states[idx][b].pressedTime)) {
                    this._onButtonDown(b, pad)
                    this._states[idx][b].pressedTime = now
                }
            }
            else { // 非リピート（初回即時実行）
                if (!this._states[idx][b].isPressed) {
                    this._onButtonDown(b, pad)
                    this._states[idx][b].isPressed = true
                    this._states[idx][b].pressedTime = now
                }
            }
        }
        else { // ボタン離反中
            this._states[idx][b].isPressed = false
            this._states[idx][b].isRepeating = false
        }
    }
}
window.GamePad = GamePad
})();
