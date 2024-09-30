# リスト

```
+------------+--+
|あいうえお  |▲|
|かきくけこ  |■|
|さしすせそ  |▼|
+------------+--+
◀1/5▶  ▲1/50▼
  page     index
```

次元数|1,2
方向(文字)|direction, writingMode, textOrientation
方向(要素配置)|gridAutoFlow
方向(HID入力)|Keyboard:Arrow[Up/Down/Left/Right], GamePad:十字キー
画面内表示数|1〜N, [row, col]

```javascript
const list = new List({
    kbd: {
        prevIndex: (e)=>'ArrowUp'===e.key,
        nextIndex: (e)=>'ArrowDown'===e.key,
        prevPage: (e)=>'ArrowLeft'===e.key,
        nextPage: (e)=>'ArrowRight'===e.key,
    },
})
```

```javascript
const list = new Grid({
    kbd: {
        prevY: (e)=>'ArrowUp'===e.key,
        nextY: (e)=>'ArrowDown'===e.key,
        prevX: (e)=>'ArrowLeft'===e.key,
        nextX: (e)=>'ArrowRight'===e.key,
        prevPage: (e)=>'PgDn'===e.key,
        nextPage: (e)=>'PgUp'===e.key,
    },
})
```

* カーソル進行方向は書字方向と合わせる（変更可。`block`/`inline`）
* `grid-auto-flow`は書字方向と合わせる（変更可。`block`/`inline`）

　リスト内

* リスト内端超過時
    * ページ内ストップ
    * ページ内ループ
    * ページ外遷移（スクロール）
    * リスト外フォーカス遷移（表示項目中末尾項目超過時）
    * リスト外フォーカス遷移（全項目中最終項目超過時）

overMethod|概要
----------|----
`stop`|ページ内ストップ（端で停止（カーソル・ページ・フォーカス移動なし））
`loop`|ページ内ループ（反対の端へカーソル移動する）
`page`|ページ外遷移（スクロール）
`focusR`|リスト外フォーカス遷移（表示項目中先頭/末尾項目超過時）
`focusA`|リスト外フォーカス遷移（全項目中先頭/末尾項目超過時）

curosr-dir|`block`/`inline`

```javascript
type: 'list', // list/grid
direction: `ltr`, // 
writingMode: `horizontal-tb`, // 
curosrDir: `block`, // block/inline
```
```
+------------+--+
|あいうえお  |▲|
|かきくけこ  |■|
|さしすせそ  |▼|
+------------+--+
◀1/5▶  ▲1/50▼
  page     index
```

```javascript
type: 'list', // list/grid
direction: `ltr`, // 
writingMode: `horizontal-tb`, // 
curosrDir: `inline`, // block/inline
```
```
+--+----------+----------+----------+--+
|◀|あいうえお|かきくけこ|さしすせそ|▶|
+--+----------+----------+----------+--+
▲1/5▼  ◀1/50▶
  page     index
```


```javascript
type: 'list', // list/grid
direction: `ltr`, // 
writingMode: `vertical-rl`, // 
curosrDir: `block`, // block/inline
```
```
+----+------+
|◀▲|さかあ|
|1 1 |しきい|
|/ / |すくう|
|5 5 |せけえ|
|0 p |そこお|
|i   |      |
|▶▼|      |
+----+------+
```
```
+------+
|さかあ|
|しきい|
|すくう|
|せけえ|
|そこお|
+------+
|▲1/5p▼|
|◀1/50i▶|
+------+
```


```javascript
type: 'list', // list/grid
direction: `ltr`, // 
writingMode: `vertical-rl`, // 
curosrDir: `inline`, // block/inline
```
```
+--+--+
|▶|あ|
|1 |い|
|/ |う|
|5 |え|
|p |お|
|◀+--+
|  |か|
|  |き|
|  |く|
|  |け|
|  |こ|
|▲+--+
|1 |さ|
|/ |し|
|50|す|
|p |せ|
|▼|そ|
++++--+
|◀1/5p▶|
|▲1/50i▼|
+--+
```



```
+--+
|▲|
+--+
|あ|
|い|
|う|
|え|
|お|
+--+
|か|
|き|
|く|
|け|
|こ|
+--+
|さ|
|し|
|す|
|せ|
|そ|
+--+
|▼|
+--+
```
```
+--+
|あ|
|い|
|う|
|え|
|お|
+--+
|か|
|き|
|く|
|け|
|こ|
+--+
|さ|
|し|
|す|
|せ|
|そ|
+--+
|◀1/5p▶|
|▲1/50i▼|
+--+
```








prev-curosr|InlineBefore
next-cursor|InlineAfter
prev-page|BlockBefore
next-page|BlockAfter
prev-focus|Shift + Tab
next-focus|        Tab

* 1次元
    * カーソル移動-1
    * カーソル移動+1


## 画面内表示数



## 


# 長体・平体

名前|縦|横
----|--|--
正体|100%|100%
長体|100%| 80%
平体| 80%|100%

Long
Wide

20%|1/5
25%|1/4
50%|1/2
75%|3/4

L5|W5|20%
L4|W4|25%
L2|W2|50%


漢字を除く「英数カナひら記号」のみ対象にしたい。
画数の多さを基準にしたい。

* https://www.ejworks.com/solution/detail.html?article_id=150
* https://github.com/superdaisi/choootype?tab=readme-ov-file
* https://codepen.io/superdaisi/pen/jOLOJpx

