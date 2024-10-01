class Ratext { // rate text
    static V = {
        //D: ['-','+'], // D:direction(inline方向), -:短縮/縮小, +:伸長/拡張/拡大
        D: ['S','L'], // D:direction(inline方向), S:Short/短縮/縮小, L:Long/伸長/拡張/拡大
        R: [5,4,3,2], // R:Rate(比率), 5:1/5cut(20%OFF), 4:1/4cut(25%OFF), 3:1/3cut(33%OFF) 2:1/2cut(50%OFF)
    }
    constructor(options) {
        this._prefix = options?.prefix ?? ''
        this._suffix = options?.suffix ?? ''
        this.run()
    }
    run() {
        for (let cls of this.#targetClasses) {
            for (let target of document.querySelectorAll(`.${cls}`)) { this.#run(target, cls) }
        }
    }
    get #targetClasses() { // S5,S4,S2,L5,L4,L2
        const clss = []
        for (let d of Ratext.V.D) { for (let r of Ratext.V.R) { clss.push(`${this._prefix}${d}${r}${this._suffix}`) } }
        console.log(clss)
        return clss
    }
    #getScaleDirRate(cls) {return {scaleDir:'L'===cls[0] ? 'X' : 'Y', rate:(1-(1/parseInt(cls[1])))}}  // cls: L5,L4,L2,W5,W4,W2
    #getDirRate(cls) {
        const C = cls.replace(this._prefix, '').replace(this._suffix, '')
        return [C[0], parseInt(C[1])]
    }
    #getRate(D,R) { return (D==='S' ? 1-(1/R) : 1+(1/R)) } // sideways-[rl/lr] は考慮してない
    #run(target, cls) {
        const [D, R] = this.#getDirRate(cls)
        const dir = getComputedStyle(target).direction
        const wm = getComputedStyle(target)['writing-mode']
        const scaleAxe = (wm.includes('horizontal') ? 'X' : 'Y') // sideways-[rl/lr] は考慮してない
//        const rate = (cls.includes('S') ? 1-(1/R) : 1+(1/R)) // sideways-[rl/lr] は考慮してない
        const rate = this.#getRate(D,R) // sideways-[rl/lr] は考慮してない
        //const {scaleDir, rate} = this.#getScaleDirRate(cls)
        const inlineDirName = (wm.includes('horizontal') ? 'width' : 'height') // sideways-[rl/lr] は考慮してない
        const inlineSize = target.getBoundingClientRect()[inlineDirName]
        target.style.whiteSpace = 'nowrap';
        target.style.transform = `scale${scaleAxe}(${rate})` 
        target.style.display = 'inline-block';
        target.style.transformOrigin = 'top left';
        //target.style[inlineDirName] = `${Math.ceil(inlineSize * rate)}px`
        target.style[inlineDirName] = `${inlineSize * rate}px`
    }
}
/*
class Textrans {
    static V = {
        D: ['L','W'], // D:direction(方向), L:Long(長体/縦長), W:Wide(平体/横長)
        R: [5,4,2], // R:Rate(比率), 5:1/5cut(20%OFF), 4:1/4cut(25%OFF), 2,1/2cut(50%OFF)
    }
    constructor(options) {
        this._prefix = options?.prefix ?? ''
        this._suffix = options?.suffix ?? ''
        this.run()
    }
    run() {
        for (let cls of this.#targetClasses) {
            for (let target of document.querySelectorAll(`.${cls}`)) { this.#run(target, cls) }
        }
    }
    get #targetClasses() { // L5,L4,L2,W5,W4,W2
        const clss = []
        for (let d of Ratext.V.D) { for (let r of Ratext.V.R) { clss.push(`${this._prefix}${d}${r}${this._suffix}`) } }
        return clss
    }
    #getScaleDirRate(cls) {return {scaleDir:'L'===cls[0] ? 'X' : 'Y', rate:(1-(1/parseInt(cls[1])))}}  // cls: L5,L4,L2,W5,W4,W2
    #run(target, cls) {
        const dir = getComputedStyle(target).direction
        const wm = getComputedStyle(target)['writing-mode']
        //const scaleDir = (wm.includes('horizontal') ? 'X' : 'Y')
        const {scaleDir, rate} = this.#getScaleDirRate(cls)
        const inlineDirName = (wm.includes('horizontal') ? 'width' : 'height') // sideways-[rl/lr] は考慮してない
        const inlineSize = target.getBoundingClientRect()[inlineDirName]
        target.style.whiteSpace = 'nowrap';
        target.style.transform = `scale${scaleDir}(${rate})` 
        target.style.display = 'inline-block';
        target.style.transformOrigin = 'top left';
        target.style[inlineDirName] = `${Math.ceil(inlineSize * rate)}px`
    }
}
*/
/*
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
*/
