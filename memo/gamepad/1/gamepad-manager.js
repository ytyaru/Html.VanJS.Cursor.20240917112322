class GamepadManager {
    constructor(options) {
        this._pads = []
        this._pad = null
        this._onChangedPad = options.onChangedPad ?? (()=>{})
        this._onLoop = options.onLoop ?? (()=>{})
    }
    addEvent() {
        window.addEventListener('gamepadconnected', async(e)=>{
            console.log('gamepadconnected:', e)
            this._pads[e.gamepad.index] = e.gamepad
            // onConnect
            // onConnectStandard
            // onConnectNotStandard
            //requestAnimationFrame(this.#onLoop.bind(this, e))
            this.#onLoop(e)
        });
    }
    delEvent() {
        window.addEventListener('gamepaddisconnected', async(e)=>{
            console.log('gamepaddisconnected:', e)
            cancelAnimationFrame(this.#onLoop.bind(this, e))
        });
    }
    get onChangedPad() { return this._onChangedPad }
    set onChangedPad(v) { if('function'===typeof v){this._onChangedPad=v} }
    get onLoop() { return this._onLoop}
    set onLoop(v) { if('function'===typeof v){this._onLoop=v} }
    #onLoop(e) {
        const oPad = this._pad
        this._pad = e.gamepad
        if (!this._pad) { return }
        if (oPad !== this._pad) { this.onChangedPad(e) }
        this.onLoop(e)
        if (0 < this._pads.length) { window.requestAnimationFrame(this.#onLoop.bind(this)) }
        /*
        //for (let [idx, pad] of Object.entries(navigator.getGamepads())) {
        for (let pad of navigator.getGamepads()) {
            if (!pad) { continue }
            for (let b=0; b<pad.buttons.length; b++) {
                if (pad.buttons[b].pressed) {
                    
                }
            }
            for (let a=0; a<pad.axes.length; a++) {
                if (0!==pad.axes[a]) { this._onAxisMove(a, pad.axes[a], pad); this._time = now; }
            }
        if (0 < this._pads.length) { window.requestAnimationFrame(this.#onLoop.bind(this)) }
        */
    }
}
