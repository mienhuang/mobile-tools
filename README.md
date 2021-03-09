<h1 align="center" >Scroll Picker</h1>
<p align="center">
  <a href="https://github.com/mienhuang/scrollpicker/blob/master/LICENSE" title="LICENSE">
    <img src="https://img.shields.io/npm/l/express.svg" alt="MIT License">
  </a>
  <a href="" title="downloads">
    <img src="https://img.shields.io/badge/downloads-209-green.svg" alt="downloads">
  </a>
  <a href="" title="dependencies">
    <img src="https://img.shields.io/badge/dependencies-none-orange.svg" alt="dependencies">
  </a>
</p>

## What is Scroll-Picker

Scroll-Picker is a tool for WEB mobile application, will provide a wheel-like picker, user can scroll the items and pick the target item.

Build in Web Component, No dependency!

[【查看中文文档】](https://github.com/mienhuang/scrollpicker/blob/master/docs/README-CN.md)

## Features

- A mobile select tool, build with native js without any third-party dependency.

- Web Component, easy to use in any projects.

- No colums limitation, you can use it in your case.

- Theme and cusumize color config support.

## Preview

![Image text](https://github.com/mienhuang/scrollpicker/blob/main/docs/imgs/date.png?raw=true)

![Image text](https://github.com/mienhuang/scrollpicker/blob/main/docs/imgs/day.png?raw=true)

## Installation

#### Method1 tag import：

```html
<script src="/path/to/scroll-picker.min.js" type="text/javascript"></script>
```

#### Method2 npm install：

```
npm i @mobiletools/scrollpicker -S
```

After install from NPM but you still need import scroll-picker.js file to your project.

## Getting Started

#### Single colum demo

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

#### Mutil-colum scroll picker

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

## How does it works

After you add scroll-picker to the dom, it will listen on the click event,
once user click the scroll-picker or the inner stuff, it will trigger the show function to show the picker.

And this logic is handled inside the component, user don't need pay attention.

## Settings

| Name              | Default                              | Type    | Description                                                                        |
| ----------------- | ------------------------------------ | ------- | ---------------------------------------------------------------------------------- |
| title             | No default value                     | String  | The title of the scroll picker                                                     |
| colums            | Required parameter. No default value | Array   | The data displayed on the wheel                                                    |
| stopoverlaycancel | false                                | Boolean | The flag control the scroll picker over close the current scroll picker or not     |
| options           | No default value                     | Object  | The options to help setup the scroll picker, can configure title, colums and style |
| theme             | dark                                 | String  | The settings for the scroll picker theme, can choose light or dark                 |
| cancelText        | Cancel                               | String  | The text display on the cancel button                                              |
| confirmText       | Confirm                              | String  | The text display on the confirm button                                             |

## Options

| Name                     | Default                                                       | Type   | Description                                                        |
| ------------------------ | ------------------------------------------------------------- | ------ | ------------------------------------------------------------------ |
| title                    | No default value                                              | String | The title of the scroll picker                                     |
| colums                   | Required parameter. No default value                          | Array  | The data displayed on the wheel                                    |
| theme                    | dark                                                          | String | The settings for the scroll picker theme, can choose light or dark |
| containerBackgroundColor | dark:'rgba(45, 52, 61, .9)', light: 'rgba(210, 210, 210, .9)' | String | color for scroll picker container                                  |
| panelBackground          | dark: '#2D343D', light: '#99A6B5'                             | String | color for panel background                                         |
| panelHeaderBorderColor   | dark:'#99A6B5', light: '#2D343D'                              | String | color for panel header border                                      |
| titleColor               | dark:'#99A6B5', light: '#2D343D'                              | String | color for the scroll picker title                                  |
| confirmButtonColor       | '#FFDF22'                                                     | String | color for the confirm button text                                  |
| cancelButtonColor        | dark: '#99A6B5', light: '#2D343D'                             | String | color for the cancel button text                                   |
| focusBorderColor         | '#FFDF22'                                                     | String | color for the center focus rectangle                               |
| maskBackgroundColor      | dark: 'rgb(45, 52, 61, .9)', light: 'rgb(200, 200, 200, .9)'  | String | color for the mask background color                                |
| cancelText               | Cancel                                                        | String | The text display on the cancel button                              |
| confirmText              | Confirm                                                       | String | The text display on the confirm button                             |

### Tips

> For some of the options you can set the value on the tag, eg:

```html
<scroll-picker id="test2" title="select date"></scroll-picker>
```

> also you can set the value to the attribute, eg:

```javascript
const ele = document.querySelector("#test2");

setTimeout(() => {
  ele.title = "date picker";
}, 2000);
```

> and you can set it in the options, eg:

```javascript
const ele = document.querySelector("#test2");

setTimeout(() => {
  ele.options = {
    title: "date picker",
  };
}, 2000);
```

> All the configration can be setted by the options, Or by setting on the attribute.

> Only title, stopoverlaycancel can set on the tag

### Functions

- show(): trigger show the picker. In real use case the show function should only be called by scroll-picker itself

- hide(): trigger hide the picker. In real use case this hide function should only be called by scroll-pciker itself.

- destory(): this function is for user remove the scroll-picker from dom after it's not needed.

## License

[MIT LICENSE](https://github.com/mienhuang/scrollpicker/blob/main/LICENSE)

Copyright (c) 2021-present, Mien
