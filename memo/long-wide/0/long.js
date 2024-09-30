class Long { // 長体
    constructor(options) {
        this._rate = options?.rate ?? 0.8
        this.run()
    }
    run() { for (let target of document.querySelectorAll('.long')) { this.#run(target) } }
    #run(target) {
        const dir = getComputedStyle(target).direction
        const wm = getComputedStyle(target)['writing-mode']
        const scaleDir = (wm.includes('horizontal') ? 'X' : 'Y')
        const inlineDirName = (wm.includes('horizontal') ? 'width' : 'height')
        const inlineSize = target.getBoundingClientRect()[inlineDirName]
        target.style.whiteSpace = 'nowrap';
        target.style.transform = `scale${scaleDir}(${this._rate})` 
        target.style.display = 'inline-block';
        target.style.transformOrigin = 'top left';
        target.style[inlineDirName] = `${Math.ceil(inlineSize * this._rate)}px`
        target.style.fontFeatureSetting = 'palt'; // `font-feature-settings:"palt"`
    }
}
