window.addEventListener('DOMContentLoaded', (event) => {
    console.log('DOMContentLoaded!!');
    const {h1, p, a} = van.tags
    const author = 'ytyaru'
    van.add(document.querySelector('main'), 
        h1(a({href:`https://github.com/${author}/Html.VanJS.Cursor.20240917112322/`}, 'Cursor')),
        p('Cursor'),
//        p('Cursor'),
    )
    van.add(document.querySelector('footer'),  new Footer('ytyaru', '../').make())

    const loop = new Cursor.Loop()
    /*
    console.log(`i:${loop.i} l:${loop.l} d:${loop.d} q:${loop.q}`)
    loop.next()
    console.log(`i:${loop.i} l:${loop.l} d:${loop.d} q:${loop.q}`)
    loop.next()
    loop.next()
    loop.next()
    loop.next()
    loop.next()
    console.log(`i:${loop.i} l:${loop.l} d:${loop.d} q:${loop.q}`)
    loop.next()
    console.log(`i:${loop.i} l:${loop.l} d:${loop.d} q:${loop.q}`)
    loop.next()
    console.log(`i:${loop.i} l:${loop.l} d:${loop.d} q:${loop.q}`)
    */
//    ;[...Array(loop.l*2)].map(i=>{loop.next();loop.log();})

    ;['Loop','Yoyo','Stop'].map(c=>new Cursor[c](5)).map(c=>[...Array(c.l*3)].map(i=>{c.next();c.log();}))
});
window.addEventListener('beforeunload', (event) => {
    console.log('beforeunload!!');
});

