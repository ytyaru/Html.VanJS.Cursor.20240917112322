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
        this._delay = 200
        this._repeat = {
            delay: 500, // リピート遅延時間ms
            interval: 100, // リピート間隔ms
        }
        this._btnRepeats = []
        this._time = Date.now()
    }
    get pads() { return this._pads }
    get pad() { return (this._idx) ? this._pads[idx] : null }
    onPoll() {
//        console.log('onPoll')
        const now = Date.now()
        for (let [idx, pad] of Object.entries(navigator.getGamepads())) {
            if (!pad) { continue }
            // console.log(pad)
            for (let b=0; b<pad.buttons.length; b++) {
                if (pad.buttons[b].pressed) {
                    if (this._btnRepeats[idx][b].isPressed && this._repeat.delay < (now - this._btnRepeats[idx][b].pressedTime)) {
                        this._btnRepeats[idx][b].isRepeating = true; // リピート発火
                    }
                    if (this._btnRepeats[idx][b].isRepeating) { // リピート中
                        if (this._repeat.interval < (now - this._btnRepeats[idx][b].pressedTime)) {
                            this._onButtonDown(b, pad)
                            this._btnRepeats[idx][b].pressedTime = now
                        }
                    }
                    else { // 非リピート（初回即時実行）
                        if (!this._btnRepeats[idx][b].isPressed) {
                            this._onButtonDown(b, pad)
                            this._btnRepeats[idx][b].isPressed = true
                            this._btnRepeats[idx][b].pressedTime = now
                        }
                    }
                }
                else {
                    this._btnRepeats[idx][b].isPressed = false
                    this._btnRepeats[idx][b].isRepeating = false
                }
            }
            for (let a=0; a<pad.axes.length; a++) {
                if (0!==pad.axes[a]) { this._onAxisMove(a, pad.axes[a], pad); this._time = now; }
            }
        }
        if (0 < this._pads.length) { window.requestAnimationFrame(this.onPoll.bind(this)) }
    }

    /*
    onPoll() {
        console.log('onPoll')
        const now = Date.now()
        const diff = now - this._time
        if (this._delay < diff) {
            console.log(navigator.getGamepads())
            for (let [idx, pad] of Object.entries(navigator.getGamepads())) {
                for (let b=0; b<pad.buttons.length; b++) {
                    if (pad.buttons[b].pressed) { this._onButtonDown(b, pad); this._time = now; }
                }
                for (let a=0; a<pad.axes.length; a++) {
                    if (0!==pad.axes[a]) { this._onAxisMove(a, pad.axes[a], pad); this._time = now; }
                }
            }
        }
        if (0 < this._pads.length) { window.requestAnimationFrame(this.onPoll.bind(this)) }
    }
    */
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
            //this._btnRepeats.push([...Array(e.gamepad.buttons.length)].map((_,i)=>({is:false, start: Date.now()})))
            this._btnRepeats.push([...Array(e.gamepad.buttons.length)].map((_,i)=>({
                isPressed:false, // 最初に押下した
                isRepeating:false, // リピート中である
                pressedTime: Date.now(), // 最初に押下した時点
                start: Date.now(), // リピート開始時間
                })))
//            gamepads[e.gamepad.index] = true;
//            readValues();
            this.onPoll()
        });
        target.addEventListener("gamepaddisconnected", (e)=>{
            console.log(`Gamepad disconnected: ${e.gamepad.id}`);
//            delete gamepads[e.gamepad.index];
            cancelAnimationFrame(this.onPoll.bind(this))
        });
    }
}
/*
class ButtonRepeat {
    constructor(onButtonDown) {
        this._states = []
        this._onButtonDown = onButtonDown
    }
    add(pad) {
        this._states.push([...Array(e.gamepad.buttons.length)].map((_,i)=>({
            isPressed: false, // 最初に押下した
            isRepeating: false, // リピート中である
            pressedTime: Date.now(), // 最初に押下した時点
        })))
    }
    onButtonDown(b, pad) {
        if (pad.buttons[b].pressed) {
            if (this._states[idx][b].isPressed && this._repeat.delay < (now - this._states[idx][b].pressedTime)) {
                this._states[idx][b].isRepeating = true; // リピート発火
            }
            if (this._states[idx][b].isRepeating) { // リピート中
                if (this._repeat.interval < (now - this._states[idx][b].pressedTime)) {
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
        else {
            this._states[idx][b].isPressed = false
            this._states[idx][b].isRepeating = false
        }
    }
}
*/
class Command {
    constructor(ids) {
        this._ids = ids
    }
    get valid() {
        this._ids
    }
}
window.GamePad = GamePad
})();
