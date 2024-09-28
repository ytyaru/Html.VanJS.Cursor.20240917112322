# [GapePad API][]

[GapePad API]:https://developer.mozilla.org/ja/docs/Games/Techniques/Controls_Gamepad_API

```javascript
// index, 物理ボタン名, 論理ボタン名
class GamepadMapping {
    constructor() {
        this._id = null
        this._buttons = [
            [0, 'A', 'RD'],
            [1, 'B', 'RR'],
            [2, 'X', 'RL'],
            [3, 'Y', 'RU'],
            [4, 'L1', 'L1'],
            [5, 'R1', 'R1'],
            [6, 'L2', 'L2'],
            [7, 'R2', 'R2'],
            [8, 'Back', 'CL'],
            [9, 'Start', 'CR'],
            [10, 'LStick', 'AL'],
            [11, 'RStick', 'AR'],
            [12, 'Up', 'LU'],
            [13, 'Down', 'LD'],
            [14, 'Left', 'LL'],
            [15, 'Right', 'LR'],
            [16, 'Guid', 'CC'],
        ]
        this._axes = [
            [0, 'LStickH', 'ALH', {'-':'left', '+':'right'}],
            [1, 'LStickV', 'ALV', {'-':'up', '+':'down'}],
            [2, 'RStickH', 'ARH', {'-':'left', '+':'right'}],
            [3, 'RStickV', 'ARV', {'-':'up', '+':'down'}],
        ]
    }
}
```

* 上面（左右にトリガーボタンがあるL1,L2,R1,R2）
* 正面（十字キー、主要ボタン4〜6、メタボタン2〜、スティック2〜。）
* 背面（2〜4つのボタンがある場合あり）
* 側面（ゲームパッドを掌で押さえるためボタンはないはず）

# ゲームパッド例（Logitech Logitech Dual Action）

　実際にコンロトーラを接続し入力してAPIから取得できるパラメータを参照してみた。

```
gamepad.id:  Logitech Logitech Dual Action (STANDARD GAMEPAD Vendor: 046d Product: c216)
mapping: standard
```

　`mapping: standard`であることから[GapePad API][]にある通りXBox 360コントローラの配置と同じである。

## 嘘

　仕様書[Gamepad API Remapping][]によると主要4ボタンの`standard`な配置は次の通り。

[Gamepad API Remapping]:https://w3c.github.io/gamepad/#remapping

```
　③
②　①
　⓪ 
```

　今回接続したLogitechコントローラの主要4ボタンで入力したら配置は以下だった。

```
   3
　 ④
2①　③1
　 ②
   0
```

　物理ボタンに印字されている番号と、APIが出す番号が違った。非常に紛らわしい。

## Logitech Dual Action 物理印字番号

```
　⑦　　　　　　　　⑧
　⑤　　　　　　　　⑥
　▲　　⑨　⑩　　　④
◀　▶　[MODE]●　①　③
　▼　◎　　　　◎　②
```

　Logitechコントローラのボタン表面に刻印されている番号は上記の通り。

　刻印と実際の番号は次の通り。

```
　　⑦6　　　　　　　　⑧7
　　⑤4　　　　　　　　⑥5
　　▲12　　8⑨　⑩9　　　 ④3
14◀　▶15　[MODE]●13　2①　③1
　　▼13　◎　　　　◎　　 ②0
　　　　　10        11
```
　ぜんぜん違う…。特に②0、③1の差が2なのが覚えにくい。それ以外は刻印-1なので一目でわかりやすい。

## コンフィグUI

　ゲームパッドのAPI番号だけでは物理配置が不明である。`gamepad.mapping = 'standard'`ならXBoxの配置と同じだが、刻印まで同じとは限らない。そこでそれらを設定してファイル保存できるアプリが欲しい。

* `navigator.userAgent`
* `gamepad.id`
* 物理印字表示
* [GamePad API][]番号
* 論理ID

　よくある刻印には`A`,`B`,`X`,`Y`があるが、`○`,`✕`,`△`,`□`や、`,1`,`2`,`3`,`4`のような番号もある。

* https://u-mid.hateblo.jp/entry/2020/10/14/120232


`RU`|`A`
`RD`|`B`
`RL`|``
`RR`|``



　論理IDは物理配置された位置によって定義された名前にしたい。そうなると


