<h1 align="center" >Scroll Picker</h1>
<p align="center">
  <a href="https://github.com/onlyhom/mobileSelect.js/blob/master/LICENSE" title="LICENSE">
    <img src="https://img.shields.io/npm/l/express.svg" alt="MIT License">
  </a>
  <a href="" title="downloads">
    <img src="https://img.shields.io/badge/downloads-192-green.svg" alt="downloads">
  </a>
  <a href="" title="dependencies">
    <img src="https://img.shields.io/badge/dependencies-none-orange.svg" alt="dependencies">
  </a>
</p>

## 是什么

Scroll-Picker 是一个类 IPhone 滚动选择器， 用户可以通过滚动来调整当前选择项，来获取自己想要的选择。

Scroll Picker 基于 Web Component 理念开发，可以被轻易的用到任意项目中，无论是 Angular，React,还是 Vue. 纯天然，无依赖。

[【English】](https://github.com/mienhuang/scrollpicker/blob/master/README.md)

## 功能

- 原生开发，没有任何依赖。

- 基于 Web Component 理念设计, 轻松引入任何项目.

- 没有数目限制，按需加载数据.

- 支持主题颜色和用户自定义颜色修改.

## 预览

![Image text](https://github.com/mienhuang/scrollpicker/blob/main/docs/imgs/date.png?raw=true)

![Image text](https://github.com/mienhuang/scrollpicker/blob/main/docs/imgs/day.png?raw=true)

## 安装

#### 标签文件引入

```html
<script src="/path/to/scroll-picker.min.js" type="text/javascript"></script>
```

#### NPM 安装

```
npm i @mobiletools/scrollpicker -S
```

很抱歉，即使你通过 NPM 安装到项目下，依然需要在项目中引入 scroll-picker 的 JS 文件，只有这样才能使用 scroll-picker 标签。

## 开始

#### 单列示例

```html
<scroll-picker id="test1" title="Day">
  <button>day picker</button>
</scroll-picker>

<script>
  const ele1 = document.querySelector("#test1");

  setTimeout(() => {
    ele1.colums = [
      [
        { id: "1", value: "Sunday" },
        { id: "2", value: "Monday" },
        { id: "3", value: "Tuesday" },
        { id: "4", value: "Wensday" },
        { id: "5", value: "Thursday" },
        { id: "6", value: "Friday" },
        { id: "7", value: "Saturday" },
      ],
    ];
  }, 2000);
</script>
```

#### 多列示例

```html
<scroll-picker id="test2" title="选择日期" stopoverlaycancel="true">
  <button>date picker</button>
</scroll-picker>

<script>
  const ele = document.querySelector("#test2");

  setTimeout(() => {
    ele.colums = [
      [
        { id: "1", value: "2019" },
        { id: "2", value: "2020" },
        { id: "3", value: "2021" },
      ],
      [
        ...new Array(12)
          .fill(1)
          .map((v, i) => ({ id: `${i + 4}`, value: i + 1 })),
      ],
      [
        ...new Array(30)
          .fill(1)
          .map((v, i) => ({ id: `${i + 16}`, value: i + 1 })),
      ],
    ];
    ele.options = {
      theme: "dark",
      confirmText: "Confirm",
      cancelText: "Cancel",
    };
  }, 2000);
</script>
```

## Scroll Picker 是如何工作的

Scroll Picker 只要被加入到 html 文件之后，就会响应点击事件，一点 picker 本身被点击，就会展示 picker 的选择面板。

点击事件的响应是组件内部负责，用户不需要做任何设置。

## 设置

| Name              | Default            | Type   | Description                                |
| ----------------- | ------------------ | ------ | ------------------------------------------ |
| title             | 无                 | 字符串 | 标题                                       |
| colums            | 必要选择. 无默认值 | 数组   | 选择面板展示数据                           |
| stopoverlaycancel | false              | 布尔   | 是否禁止点击背景关闭组件                   |
| options           | 无默认值           | 对象   | 组件的配置选项，包括：所有可以被设置的内容 |
| theme             | dark               | 字符串 | 当前主题                                   |
| cancelText        | Cancel             | 字符串 | 取消按钮上的字符                           |
| confirmText       | Confirm            | 字符串 | 确认按钮上的字符                           |

## Options

| Name                     | Default                                                       | Type   | Description        |
| ------------------------ | ------------------------------------------------------------- | ------ | ------------------ |
| title                    | 无默认值                                                      | 字符串 | 标题               |
| colums                   | 必要选择. 无默认值                                            | 数组   | 选择面板展示数据   |
| theme                    | dark                                                          | 字符串 | 主题               |
| containerBackgroundColor | dark:'rgba(45, 52, 61, .9)', light: 'rgba(210, 210, 210, .9)' | 字符串 | 中心区域背景颜色   |
| panelHeaderBorderColor   | dark:'#99A6B5', light: '#2D343D'                              | 字符串 | 面板头部边框颜色   |
| titleColor               | dark:'#99A6B5', light: '#2D343D'                              | 字符串 | 标题颜色           |
| confirmButtonColor       | '#FFDF22'                                                     | 字符串 | 确认按钮字体颜色   |
| cancelButtonColor        | dark: '#99A6B5', light: '#2D343D'                             | 字符串 | 取消按钮字体颜色   |
| focusBorderColor         | '#FFDF22'                                                     | 字符串 | 中心选择框边框颜色 |
| maskBackgroundColor      | dark: 'rgb(45, 52, 61, .9)', light: 'rgb(200, 200, 200, .9)'  | 字符串 | 遮盖层背景颜色     |
| cancelText               | Cancel                                                        | 字符串 | 取消按钮上的字符   |
| confirmText              | Confirm                                                       | 字符串 | 确认按钮上的字符   |



### 技巧

> 你可以在标签上赋值, 比如:

```html
<scroll-picker id="test2" title="select date"></scroll-picker>
```

> 你也可以在元素的属性上赋值，比如:

```javascript
const ele = document.querySelector("#test2");

setTimeout(() => {
  ele.title = "date picker";
}, 2000);
```

> 你还可以通过 **options** 来赋值:

```javascript
const ele = document.querySelector("#test2");

setTimeout(() => {
  ele.options = {
    title: "date picker",
  };
}, 2000);
```

> 所有的设置属性都可以通过 **dom** 引用属性或者 **options** 来进行赋值。

> 只有 **title, stopoverlaycancel** 可以在标签上赋值

### Functions

- show(): 显示选择面板. 该方法数据内部方法，理论上由组件本身来调用。特殊情况也可以调用该方法。

- hide(): 隐藏选择面板。该方法数据内部方法，理论上由组件本身来调用。特殊情况也可以调用该方法。

- destory(): 销毁picker DOM 元素，在不需要的时候可以调用该方法来释放元素.

## License

[MIT LICENSE](https://github.com/mienhuang/scrollpicker/blob/main/LICENSE)

Copyright (c) 2021-present, Mien
