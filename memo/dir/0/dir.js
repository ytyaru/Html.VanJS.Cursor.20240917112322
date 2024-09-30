;(function(){
class TextDir {
    /*
    static D_L = 'ltr'
    static D_R = 'rtl'
    static W_H = 'horizontal-tb'
    static W_VR = 'vertical-rl'
    static W_VL = 'vertical-lr'
    static W_SR = 'sideways-rl'
    static W_SL = 'sideways-lr'
    static O_SL = 'sideways-lr'
    */
    static V = {
        D: { L:'ltr', R:'rtl' },
        W: {
            H: 'horizontal-tb',
            VR: 'vertical-rl',
            VL: 'vertical-lr',
            SR: 'sideways-rl',
            SL: 'sideways-lr',
        },
        T: {
            M: 'mixed',
            U: 'upright',
            S: 'sideways'
        },
        G: {
            R: 'row',
            C: 'column',
            RD: 'row dense',
            CD: 'column dense',
        }
    }
    get isL() { return TextDir.V.D.L===this.direction }
    get isR() { return TextDir.V.D.R===this.direction }
    get isH() { return TextDir.V.W.H===this.writingMode }
    get isV() { return [TextDir.V.W.VR,TextDir.V.W.VL].some(V===this.writingMode) }
    get isVR() { return TextDir.V.W.VR===this.writingMode }
    get isVL() { return TextDir.V.W.VL===this.writingMode }
    get isS() { return [TextDir.V.W.SR,TextDir.V.W.SL].some(V===this.writingMode) }
    get isSR() { return TextDir.V.W.SR===this.writingMode }
    get isSL() { return TextDir.V.W.SL===this.writingMode }
    get isM() { return TextDir.V.T.M===this.textOrientation }
    get isU() { return TextDir.V.T.U===this.textOrientation }
    get isTS() { return TextDir.V.T.S===this.textOrientation }
    get isR() { return TextDir.V.G.R===this.gridAutoFlow }
    get isC() { return TextDir.V.G.C===this.gridAutoFlow }
    get isRD() { return TextDir.V.G.RD===this.gridAutoFlow }
    get isCD() { return TextDir.V.G.CD===this.gridAutoFlow }
    constructor(options) {
        this._direction = `ltr`
        this._writingMode= `horizontal-tb`
        this._textOrientation = `mixed`
        this._gridAutoFlow = `row`
        this._gridAutoColumns = ``
        this._gridAutoRows = ``
        this._rel = new TextDirId(this)
    }
    get directions() { return [`ltr`, `rtl`] }
    get writingModes() { return 'horizontal-tb,vertical-rl,vertical-lr,sideways-rl,sideways-lr'.split(',') }
    get textOrientations() { return 'mixed,upright,sideways'.split(',') }
    get gridAutoFlows() { return 'row,column,row dense,column dense'.split(',') }
    get direction() { return this._direction }
    set direction(v) {
        if (this.directions.some(V=>V===v.toLowerCase())) { this._direction = v }
        else if ('L'===v.toUpperCase()) { this._direction = 'ltr' }
        else if ('R'===v.toUpperCase()) { this._direction = 'rtl' }
        else { throw new TypeError(`directionの値が不正です。: ${v}。次のいずれかであるべきです。: ${this.directions}`) }
    }
    get rel() { return this._rel }
    get writingMode() { return this._writingMode }
    set writingMode(v) {
        if (this.writingModes.some(V=>V===v.toLowerCase())) { this._writingMode = v }
        else if (['h','horizontal'].some(V=>V===v.toLowerCase())) { this._writingMode = 'horizontal-tb' }
        else if (['v','vertical'].some(V=>V===v.toLowerCase())) { this._writingMode = 'vertial-rl' }
        else if (['s','sideways'].some(V=>V===v.toLowerCase())) { this._writingMode = 'sideways-lr' }
        else if (['h','horizontal'].some(V=>V===v.toUpperCase())) { this._writingMode = 'ltr' }
        else { throw new TypeError(`writingModeの値が不正です。: ${v}。次のいずれかであるべきです。: ${this.writingModes}`) }
    }
    get textOrientation() { return this._textOrientation }
    set textOrientation(v) {
        if (this.textOrientations.some(V=>V===v.toLowerCase())) { this._textOrientation = v }
        else if ('m'===v.toLowerCase()) { this._direction = 'mixed' }
        else if ('u'===v.toLowerCase()) { this._direction = 'upright' }
        else if ('s'===v.toLowerCase()) { this._direction = 'sideways' }
        else { throw new TypeError(`textOrientationの値が不正です。: ${v}。次のいずれかであるべきです。: ${this.textOrientations}`) }
    }
    get gridAutoFlow() { return this._gridAutoFlow }
    set gridAutoFlow(v) {
        if (this.gridAutoFlows.some(V=>V===v.toLowerCase())) { this._gridAutoFlow = v }
        else if (['r'].some(V=>V===v.toLowerCase())) { this._gridAutoFlow = 'row' }
        else if (['c','col'].some(V=>V===v.toLowerCase())) { this._gridAutoFlow = 'col' }
        else if (['rd'].some(V=>V===v.toLowerCase())) { this._gridAutoFlow = 'row dense' }
        else if (['cd'].some(V=>V===v.toUpperCase())) { this._gridAutoFlow = 'column dense' }
        else { throw new TypeError(`gridAutoFlowの値が不正です。: ${v}。次のいずれかであるべきです。: ${this.gridAutoFlows}`) }
    }
    get keys() { return 'direction,writingMode,textOrientation,gridAutoFlow'.split(',') }
    get style() { return this.keys.map(k=>`${k.Chain}:${this[k]};`).join('') }
    /*
    'direction,writingMode,textOrientation,gridAutoFlow'.map(k=>`${k.Chain}:${this[k]};`)
    get style() { return `direction:${this.direction};writing-mode:${this.writingMode};text-orientation:${this.textOrientation};` }
        this._direction = `ltr`
        this._writingMode= `horizontal-tb`
        this._textOrientation = `mixed`
        this._gridAutoFlow = `row`
        this._gridAutoColumns = ``
        this._gridAutoRows = ``
    */
}
class TextDirId {
    static V = {
        /*
        ABS: 'up,down,left,right'.split(','),
        REL: 'blockBefore,blockAfter,inlineBefore,inlineAfter'.split(','),
        INLINE: 0,
        BLOCK: 1,
        BEFORE: 0,
        AFTER: 1,
        */
        ABS: {
            U: [0, 'u', 'up'],
            D: [1, 'd', 'down'],
            L: [2, 'l', 'left'],
            R: [3, 'r', 'right'],
        },
        REL: {
            BB: [0, 'bb', 'blockBefore'],
            BA: [1, 'ba', 'blockAfter'],
            IB: [2, 'ib', 'inlineBefore'],
            IA: [3, 'ia', 'inlineAfter'],
        },
    }
    constructor(textDir) {
        this._d = null
        this.d = textDir
        this._names = [
            ['bb', 'blockBefore'],
            ['ba', 'blockAfter'],
            ['ib', 'inlineBefore'],
            ['ia', 'inlineAfter'],
        ]
    }
    get d() { return this._d }
    set d(v) { if(TextDir===v.constructor){this._d=v}else{throw new TypeError(`dはTextDir型インスタンスであるべきです。`)}}
//    set d(v) { if (TextDir!==v.constructor) { throw new TypeError(`dはTextDir型インスタンスであるべきです。`) }; this._d = v; }
//    set d(v) { if (TextDir===v.constructor) { this._d = v } }
//    getRels(i=2) { return [...Object.keys(this.V.ABS)].map(k=>this.V.REL[k][i]) } // i=0:番号,1:略名,2:全名
    #getAbss(i=2) { return [...Object.keys(this.V.ABS)].map(k=>this.V.ABS[k][i]) } // i=0:番号,1:略名,2:全名
    //getRel(abs, i=1) { // abs:up,down,left,right,  i=0:番号,1:略名,2:全名
    get(abs, i=1) { // abs:up,down,left,right,  i=0:番号,1:略名,2:全名
        const ks = [...Object.keys(TextDirId.V.ABS)].filter(k=>abs===TextDirId.V.ABS[k][1] || abs===TextDirId.V.ABS[k][2])
        if (1!==ks.length) { throw new TypeError(`引数absは${this.#getAbss(2)}か${this.#getAbss(1)}のいずれかのみ有効です。abs: ${abs}`) }
        const K = ks[0]
        if ('U'===K) {
            if (this.d.isL) {
                     if (this.d.isH)  { return TextDirId.V.REL.BB[i] }
                else if (this.d.isVR) { return TextDirId.V.REL.IB[i] }
                else if (this.d.isVL) { return TextDirId.V.REL.IB[i] }
                else if (this.d.isSR) { return TextDirId.V.REL.IB[i] }
                else if (this.d.isSL) { return TextDirId.V.REL.IA[i] }
                else { throw new TypeError(`不正値です。`) }
            } else if (this.d.isR) {
                     if (this.d.isH)  { return TextDirId.V.REL.BB[i] }
                else if (this.d.isVR) { return TextDirId.V.REL.IA[i] }
                else if (this.d.isVL) { return TextDirId.V.REL.IA[i] }
                else if (this.d.isSR) { return TextDirId.V.REL.IB[i] }
                else if (this.d.isSL) { return TextDirId.V.REL.IA[i] }
                else { throw new TypeError(`不正値です。`) }
            } else { throw new TypeError(`不正値です。`) }
        } else if ('D'===K) {
            if (this.d.isL) {
                     if (this.d.isH)  { return TextDirId.V.REL.BA[i] }
                else if (this.d.isVR) { return TextDirId.V.REL.IA[i] }
                else if (this.d.isVL) { return TextDirId.V.REL.IA[i] }
                else if (this.d.isSR) { return TextDirId.V.REL.IA[i] }
                else if (this.d.isSL) { return TextDirId.V.REL.IB[i] }
                else { throw new TypeError(`不正値です。`) }
            } else if (this.d.isR) {
                     if (this.d.isH)  { return TextDirId.V.REL.BA[i] }
                else if (this.d.isVR) { return TextDirId.V.REL.IB[i] }
                else if (this.d.isVL) { return TextDirId.V.REL.IB[i] }
                else if (this.d.isSR) { return TextDirId.V.REL.IA[i] }
                else if (this.d.isSL) { return TextDirId.V.REL.IB[i] }
                else { throw new TypeError(`不正値です。`) }
            } else { throw new TypeError(`不正値です。`) }
        } else if ('L'===K) {
            if (this.d.isL) {
                     if (this.d.isH)  { return TextDirId.V.REL.IB[i] }
                else if (this.d.isVR) { return TextDirId.V.REL.BA[i] }
                else if (this.d.isVL) { return TextDirId.V.REL.BB[i] }
                else if (this.d.isSR) { return TextDirId.V.REL.BA[i] }
                else if (this.d.isSL) { return TextDirId.V.REL.BB[i] }
                else { throw new TypeError(`不正値です。`) }
            } else if (this.d.isR) {
                     if (this.d.isH)  { return TextDirId.V.REL.IA[i] }
                else if (this.d.isVR) { return TextDirId.V.REL.BA[i] }
                else if (this.d.isVL) { return TextDirId.V.REL.BB[i] }
                else if (this.d.isSR) { return TextDirId.V.REL.BA[i] }
                else if (this.d.isSL) { return TextDirId.V.REL.BB[i] }
                else { throw new TypeError(`不正値です。`) }
            } else { throw new TypeError(`不正値です。`) }
        } else if ('R'===K) {
            if (this.d.isL) {
                     if (this.d.isH)  { return TextDirId.V.REL.IA[i] }
                else if (this.d.isVR) { return TextDirId.V.REL.BB[i] }
                else if (this.d.isVL) { return TextDirId.V.REL.BA[i] }
                else if (this.d.isSR) { return TextDirId.V.REL.BB[i] }
                else if (this.d.isSL) { return TextDirId.V.REL.BA[i] }
                else { throw new TypeError(`不正値です。`) }
            } else if (this.d.isR) {
                     if (this.d.isH)  { return TextDirId.V.REL.IB[i] }
                else if (this.d.isVR) { return TextDirId.V.REL.BB[i] }
                else if (this.d.isVL) { return TextDirId.V.REL.BA[i] }
                else if (this.d.isSR) { return TextDirId.V.REL.BB[i] }
                else if (this.d.isSL) { return TextDirId.V.REL.BA[i] }
                else { throw new TypeError(`不正値です。`) }
            } else { throw new TypeError(`不正値です。`) }
        } else { throw new TypeError(`不正値です。`) }
    }
    gets(i=1) { // i=0:番号,1:略名,2:全名
    //getRels(isFullName=false) { // d:textDir
        if (this.d.isL) {
            if (this.d.isH) { return {
                up:    TextDirId.V.REL.BB[i],
                down:  TextDirId.V.REL.BA[i],
                left:  TextDirId.V.REL.IB[i],
                right: TextDirId.V.REL.IA[i],
            } }
            else if (this.d.isVR) { return {
                up:    TextDirId.V.REL.IB[i],
                down:  TextDirId.V.REL.IA[i],
                left:  TextDirId.V.REL.BA[i],
                right: TextDirId.V.REL.BB[i],
            } }
            else if (this.d.isVL) { return {
                up:    TextDirId.V.REL.IB[i],
                down:  TextDirId.V.REL.IA[i],
                left:  TextDirId.V.REL.BB[i],
                right: TextDirId.V.REL.BA[i],
            } }
            else if (this.d.isSR) { return {
                up:    TextDirId.V.REL.IB[i],
                down:  TextDirId.V.REL.IA[i],
                left:  TextDirId.V.REL.BA[i],
                right: TextDirId.V.REL.BB[i],
            } }
            else if (this.d.isSL) { return {
                up:    TextDirId.V.REL.IA[i],
                down:  TextDirId.V.REL.IB[i],
                left:  TextDirId.V.REL.BB[i],
                right: TextDirId.V.REL.BA[i],
            } }
            else {throw new TypeError(`不正値です。`) }
        }
        else if (this.d.isR) {
            if (this.d.isH) { return {
                up:    TextDirId.V.REL.BB[i],
                down:  TextDirId.V.REL.BA[i],
                left:  TextDirId.V.REL.IA[i],
                right: TextDirId.V.REL.IB[i],
            } }
            else if (this.d.isVR) { return {
                up:    TextDirId.V.REL.IA[i],
                down:  TextDirId.V.REL.IB[i],
                left:  TextDirId.V.REL.BA[i],
                right: TextDirId.V.REL.BB[i],
            } }
            else if (this.d.isVL) { return {
                up:    TextDirId.V.REL.IA[i],
                down:  TextDirId.V.REL.IB[i],
                left:  TextDirId.V.REL.BB[i],
                right: TextDirId.V.REL.BA[i],
            } }
            else if (this.d.isSR) { return {
                up:    TextDirId.V.REL.IB[i],
                down:  TextDirId.V.REL.IA[i],
                left:  TextDirId.V.REL.BA[i],
                right: TextDirId.V.REL.BB[i],
            } }
            else if (this.d.isSL) { return {
                up:    TextDirId.V.REL.IA[i],
                down:  TextDirId.V.REL.IB[i],
                left:  TextDirId.V.REL.BB[i],
                right: TextDirId.V.REL.BA[i],
            } }
            else {throw new TypeError(`不正値です。`) }
        }
        else {throw new TypeError(`不正値です。`) }
    }
    // obj{'bb':?, 'ba':?, 'ib':?, 'ia':?} -> {up:?, down:?, left:?, right:?}
    convert(obj, i=1) { return [...Object.entries(this.gets(i))].reduce((o,v,i)=>({...o, [v[0]]: obj[v[1]]}), {}) }
}
class GridDir {
    constructor(options) {
        this._gridAutoFlow = `row`
        this._gridAutoColumns = ``
        this._gridAutoRows = ``
    }
}
class GridLen {
    constructor(options) {
        this._gridAutoFlow = `row`
        this._gridAutoColumns = ``
        this._gridAutoRows = ``
    }
}

class ItemLength {
    constructor(options) {
        this._gridAutoFlow = `row`
        this._gridAutoColumns = ``
        this._gridAutoRows = ``



        this._num = [3, 2] // 
        this._direction = `ltr`
        this._writingMode= `horizontal-tb`
        this._textOrientation = `mixed`
        this._gridAutoFlow = `row`
        this._gridAutoColumns = ``
        this._gridAutoRows = ``
    }
}

class List {
    constructor(options) {
        this._style = {
            direction: `ltr`,
            writingMode: `horizontal-tb`,
            textOrientation: `mixed`,
        }
    }
}
window.TextDir = TextDir 
})();
