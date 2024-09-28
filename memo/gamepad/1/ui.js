class Ui {
    constructor() {
        this._buttons = []
        this._axes = []
    }
    make(e) {
        const pad = e.gamepad;
        this.#makeButtons(e)
        return van.tags.main(
            van.tags.h1(`[${pad.index}] ${pad.id}`),
            van.tags.p(`mapping: ${pad.mapping}`),
            van.tags.p(`buttons: ${pad.buttons.length}`),
            van.tags.p(`axes: ${pad.axes.length}`),
            van.tags.p(`vibrations: ${pad.vibrationActuator}`),
            ...this._buttons,
            ...this._axes,
    );}
    update(e) {
        console.log('ui.update:', e)
        for (let b=0; b<e.gamepad.buttons.length; b++) {
            this._buttons[b].style.backgroundColor = (e.gamepad.buttons[b].pressed) ? 'red' : 'white'
        }
        for (let a=0; a<e.gamepad.axes.length; a++) {
            this._axes[a].style.backgroundColor = (0!==e.gamepad.axes[a]) ? 'red' : 'white'
        }
    }
    #makeButtons(e) {
        this._buttons = [...Array(e.gamepad.buttons.length)].map((_,i)=>van.tags.span({style:()=>`border:1px solid black;`}, `B${i}`))
        this._axes = [...Array(e.gamepad.axes.length)].map((_,i)=>van.tags.span({style:()=>`border:1px solid black;`}, ()=>`A${i}: ${e.gamepad.axes[i]}`))
    }
}
