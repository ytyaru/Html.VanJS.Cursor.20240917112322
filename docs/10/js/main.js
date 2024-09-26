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
    console.log('----page.next()----')
    const page = new Cursor.Page.Loop(10,4);
    page.log()
    ;[...Array(page.al*3)].map(I=>{page.next();page.log();})
    console.log('----page.forward()----')
    page.ai=3
    page.log()
    ;[...Array(page.al*3)].map(I=>{page.forward();page.log();})
    console.log('----page.back()----')
    page.ai=0
    page.log()
    ;[...Array(page.al*3)].map(I=>{page.back();page.log();})

    const pageElH = new PageEl({cursor:new Cursor.Page.Loop(10,4), dir:'horizontal'})
    van.add(document.body, pageElH.make())
    const pageElV = new PageEl({cursor:new Cursor.Page.Loop(10,4), dir:'vertical'})
    van.add(document.body, pageElV.make())

    const listUi = new PageLoopList({
        data: [...Array(100)].map((_,i)=>i),
        row: 7,
        onMake: ()=>{},
        height: 24,
        onMakeChid: (d,i)=>document.createTextNode(d.toString()),
    })
    van.add(document.body, listUi.el)

    const listUiA = new PageLoopList({
        data: [...Array(26)].map((v, i) => String.fromCodePoint(i + 65)),
        row: 3,
        onMake: ()=>{},
        height: 24,
        onMakeChid: (d,i)=>document.createTextNode(d.toString()),
    })
    van.add(document.body, listUiA.el)

    // gamepad
    const gamepad = new GamePad({
        onButtonDown:(idx, pad)=>{
                 if (12===idx) { listUi.commands.prevAi() } // 上
            else if (13===idx) { listUi.commands.nextAi() } // 下
            else if (14===idx) { listUi.commands.prevPage() } // 左
            else if (15===idx) { listUi.commands.nextPage() } // 右
        },
        onAxisMove:(idx, val, pad)=>{
            console.log(idx, val, pad)
        }
    })
    gamepad.addEvent()

    // pointer
    const hammer = new Hammer(listUi.el)
    hammer.get('swipe').set({ direction: Hammer.DIRECTION_ALL });
    hammer.get('press').set({ time: 1000 });
    hammer.on('tap', async(e)=>{
        console.log('tap:', e)
    })
    hammer.on('press', async(e)=>{
        console.log('press:', e)
        e.preventDefault()
        e.srcEvent.preventDefault()
    })
    hammer.on('pressup', async(e)=>{
        console.log('pressup:', e)
        e.preventDefault()
        e.srcEvent.preventDefault()
    })
    hammer.on('swipeleft', async(e)=>{
        console.log('swipeleft:', e)
    })
    hammer.on('swiperight', async(e)=>{
        console.log('swiperight:', e)
    })
    hammer.on('swipeup', async(e)=>{
        console.log('swipeup:', e)
    })
    hammer.on('swipedown', async(e)=>{
        console.log('swipedown:', e)
    })



/*
function handleButtonClick(button) {
  if (button.textContent === "Disconnect") {
    gamepadSimulator.disconnect();
    button.textContent = "Connect";
  } else {
    gamepadSimulator.connect();
    button.textContent = "Disconnect";
  }
}

let pdTime = Date.now()
const delay = 200
const gamepads = {};
function readValues() {
  const cgs = navigator.getGamepads();
  const indexes = Object.keys(gamepads);
  for (let x = 0; x < indexes.length; x++) {
    const buttons = cgs[indexes[x]].buttons;
    const axes = cgs[indexes[x]].axes;
    for (let y = 0; y < buttons.length; y++) {
      if (buttons[y].pressed) {
        console.log(`button ${y} pressed.`);
//        document.querySelector("#events")
//                .insertAdjacentHTML('afterbegin', `<div>Button ${y} pressed.</div>`);
        if (12<=y && y<=15) {
            const now = Date.now()
            const diff = now - pdTime
            if (delay < diff) {
                     if (12===y) { listUi.commands.prevAi() } // 上
                else if (13===y) { listUi.commands.nextAi() } // 下
                else if (14===y) { listUi.commands.prevPage() } // 左
                else if (15===y) { listUi.commands.nextPage() } // 右
                pdTime = now
            }
        }
      }
    }
    for (let y = 0; y < axes.length; y++) {
      if (axes[y] != 0) {
        const axe = Math.floor(y / 2);
        const dir = y % 2;
        let move = "up"
        if (dir === 0 && axes[y] == 1) {
          move = "right";
        } else if (dir === 0 && axes[y] == -1) {
          move = "left";
        } else if (dir === 1 && axes[y] == 1) {
          move = "down";
        }
        console.log(`axe ${axe} moved ${move}.`);
//        document.querySelector("#events")
//                .insertAdjacentHTML('afterbegin', `<div>Axe ${axe} moved ${move}.</div>`);
      }
    }
  }
  if (indexes.length > 0) {
    window.requestAnimationFrame(readValues);
  }
}
window.addEventListener("gamepadconnected", (e)=>{
  console.log(`Gamepad connected: ${e.gamepad.id}`);
//  document.querySelector("#events")
//          .insertAdjacentHTML('afterbegin', '<div><b>Gamepad connected.</b></div>');
  gamepads[e.gamepad.index] = true;
  readValues();
});
window.addEventListener("gamepaddisconnected", (e)=>{
  console.log(`Gamepad disconnected: ${e.gamepad.id}`);
//  document.querySelector("#events")
//          .insertAdjacentHTML('afterbegin', '<div><b>Gamepad disconnected.</b></div>');
  delete gamepads[e.gamepad.index];
});
*/
gamepadSimulator.create();
gamepadSimulator.connect();

})
window.addEventListener('beforeunload', (event) => {
    console.log('beforeunload!!');
});

