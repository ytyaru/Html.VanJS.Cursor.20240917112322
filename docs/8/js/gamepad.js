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
        this._time = Date.now()
    }
    get pads() { return this._pads }
    get pad() { return (this._idx) ? this._pads[idx] : null }
    onPoll() {
        console.log('onPoll')
        const now = Date.now()
        for (let [idx, pad] of Object.entries(navigator.getGamepads())) {
            for (let b=0; b<pad.buttons.length; b++) {
                if (pad.buttons[b].pressed) {
                    if (this._delay < (now - this._time)) {
                        this._onButtonDown(b, pad)
                        this._time = now
                    }
                }
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
            this.onPoll()
        });
        target.addEventListener("gamepaddisconnected", (e)=>{
            console.log(`Gamepad disconnected: ${e.gamepad.id}`);
//            delete gamepads[e.gamepad.index];
        });
    }
}
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
