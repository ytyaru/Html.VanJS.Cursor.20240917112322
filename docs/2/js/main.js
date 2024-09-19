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

    console.log('----next()-----')
    ;['Loop','Yoyo','Stop'].map(c=>new Cursor[c](5)).map(c=>[...Array(c.l*3)].map(i=>{c.next();c.log();}))
    console.log('----prev()----')
    ;['Loop','Yoyo','Stop'].map(c=>new Cursor[c](5)).map(c=>[...Array(c.l*3)].map(i=>{c.prev();c.log();}))
    console.log('----add()-----')
    ;['Loop','Yoyo','Stop'].map(c=>new Cursor[c](5)).map(c=>[...Array(c.l*3)].map(i=>{c.next();c.log();}))
    console.log('----sub()----')
    ;['Loop','Yoyo','Stop'].map(c=>new Cursor[c](5)).map(c=>[...Array(c.l*3)].map(i=>{c.prev();c.log();}))
});
window.addEventListener('beforeunload', (event) => {
    console.log('beforeunload!!');
});

