const containerTemplate = document.createElement("template");
const PANEL_HEIGHT = 300;
const YELLOW = '#FFDF22';
const DARK_GRAY = '#2D343D';
const GRAY = '#99A6B5';
const WHITE = '#fff';

const DEFAULT_DARK_COLOR = {
  containerBackground: 'rgba(45, 52, 61, .9)',
  panelBackground: DARK_GRAY,
  panelHeaderBorder: GRAY,
  titleColor: GRAY,
  confirmButtonColor: YELLOW,
  cancelButtonColor: GRAY,
  textColor: WHITE
};

containerTemplate.innerHTML = `
  <style>
    :host {
        display: block;
        height: auto;
        width: auto;
    }
    .scroll-picker-trigger {
        display: block;
        height: auto;
        width: auto;
    }
 
  </style>
 
  <div class="scroll-picker-trigger">
    <slot></slot>
  </div>
`;

const styleTemplate = document.createElement("template");
styleTemplate.innerHTML = `
<style>
    .scroll-picker-container {
        z-index: 9999;
        display: block;
        position: fixed;
        height: 100vh;
        width: 100vw;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        visibility: hidden;
    }

    .scroll-picker-show {
        visibility: visible !important;
    }

    .scroll-picker-panel {
        height: ${PANEL_HEIGHT}px;
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        display: flex;
        flex-direction: column;
    }

    .scroll-picker-panel-header {
        z-index: 4;
        display: flex;
        justify-content: space-between;
        height: 40px;
        padding: 0 10px;
        border-bottom: 1px solid ${GRAY}; //
    }

    .scroll-picker-title {
      line-height: 40px;
      font-size: 18px;
    }

    .scroll-picker-title-dark {
      color: ${GRAY};
    }

    .scroll-picker-title-light {
      color: ${GRAY};
    }

    .scroll-picker-btn{
        outline: none;
        font-size: 16px;
        border: none;
        background: transparent;
    }

    .scroll-picker-cancel-btn {
      color: ${GRAY}; //
    }

    .scroll-picker-confirm-btn {
      color: ${YELLOW}; //
    }

    .scroll-picker-panel-content {
        flex: 1;
        display: flex;
        color: rgb(255, 255, 255); //
        background-color: transparent;
        overflow: hidden;
        z-index: 2;
    }

    .scroll-picker-colum {
      flex: 1;
      text-align: center;
      transition: transform .18s ease-out;
    }

    .scroll-picker-row {
      font-size: 15px;
      height: 40px;
      line-height: 40px;
      cursor: pointer;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }

    .scroll-picker-center {
      height: 40px;
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      margin: auto;
      border: 1px solid ${YELLOW};
    }

    .scroll-picker-mask {
      z-index: 3;
      position: absolute;
      top: 0;
      width: 100%;
      height: ${PANEL_HEIGHT}px;
      opacity: .9;
      pointer-events: none;
      background: linear-gradient(rgb(45, 52, 61, .9), rgba(45, 52, 61, 0), rgb(45, 52, 61, .9));
    }
 
  </style>
`;

const pickerTemplate = document.createElement("template");
pickerTemplate.innerHTML = `
  <div class="scroll-picker-container scroll-picker-container-dark">
    <div class="scroll-picker-panel scroll-picker-panel-drak">
        <div class="scroll-picker-panel-header">
            <button class="scroll-picker-btn scroll-picker-cancel-btn">Cancel</button>
            <div class="scroll-picker-title scroll-picker-title-dark"></div>
            <button class="scroll-picker-btn scroll-picker-confirm-btn">Confirm</button>
        </div>
        <div class="scroll-picker-panel-content">

        </div>
        <div class="scroll-picker-center">
        </div>
        <div class="scroll-picker-mask"></div>
    </div>
  </div>
`;

class ScrollPicker extends HTMLElement {
  constructor() {
    super();

    this.onSelected = this.onSelected.bind(this);
    this.touchStart = this.touchStart.bind(this);
    this.touchMove = this.touchMove.bind(this);
    this.touchEnd = this.touchEnd.bind(this);

    this.isOverlayStopCancel = false;
    this.startY = 0;
    this.originalY = 0;
    this.isMoving = false;
    this.curDistance = [];
    this.offsetStep = 40;
    this.value = [];
    this.columData = [];

    this._shadowRoot = this.attachShadow({ mode: "open" });
    this._shadowRoot.appendChild(containerTemplate.content.cloneNode(true));
    this.picker = this.generatePicker();
  }

  connectedCallback() {
    console.log("connected");
    this.bindEvents();
    this.attachStyle();
  }

  generatePicker() {
    this._pickerRoot = document.createElement("div");
    this._pickerRoot.appendChild(pickerTemplate.content.cloneNode(true));
    document.querySelector("body").appendChild(this._pickerRoot);

    return this._pickerRoot.querySelector(".scroll-picker-container");
  }

  show() {
    this.picker.classList.add("scroll-picker-show");
  }

  hide() {
    this.picker.classList.remove("scroll-picker-show");
  }

  static get observedAttributes() {
    return ["title", "colums", "options", "stopoverlaycancel"];
  }

  set title(value) {
    this.setTitle(value);
  }

  set stopoverlaycancel(value) {
    this.isOverlayStopCancel = Boolean(value);
  }

  set options(value) {
    this.setTitle(value.title);
    thhis.render(value.colum);
  }

  get colums() {
    return this.columData;
  }

  set colums(value) {
    this.columData = value;
    this.render(value);
  }

  attributeChangedCallback(name, oldVal, newVal) {
    switch (name) {
      case "title":
        this.setTitle(newVal);
        break;

      case "colums":
        this.columData = JSON.parse(newVal);
        this.render(this.columData);
        break;

      case "options":
        const { colum, title } = JSON.parse(newVal);
        this.columData = colum;
        this.setTitle(title);
        thhis.render(colum);
        break;
      case "stopoverlaycancel":
        this.isOverlayStopCancel = Boolean(JSON.parse(newVal));
        break;

      default:
        break;
    }
  }

  setTitle(title) {
    this._pickerRoot.querySelector(".scroll-picker-title").innerHTML = title;
  }

  render(colums) {
    const container = this._pickerRoot.querySelector(
      ".scroll-picker-panel-content"
    );

    console.log(colums, "cccccccccccc");

    colums.forEach((colum, index) => {
      const columRoot = document.createElement("div");
      columRoot.className = "scroll-picker-colum";
      const len = colum.length;

      columRoot.minOffset = 90 - (len - 1) * this.offsetStep;
      columRoot.maxOffset = 90;
      columRoot.offset = 90;
      columRoot.items = len;

      colum.forEach((item, i) => {
        const row = document.createElement("div");
        row.className = "scroll-picker-row";
        row.targetOffset = 90 - i * this.offsetStep;
        row.columIndex = index;
        row.index = i;
        row.innerHTML = item.value;
        columRoot.appendChild(row);
      });

      this.value[index] = { index: 0, value: colum[0].value || null };

      this.attachEvents(columRoot, index);

      container.appendChild(columRoot);
      this.movePosition(columRoot, 90);
    });
  }

  attachEvents(colum, index) {
    colum.addEventListener("touchstart", this.touchStart, false);
    colum.addEventListener(
      "touchend",
      (event) => {
        this.touchEnd(event, index, colum);
      },
      false
    );
    colum.addEventListener(
      "touchmove",
      (event) => {
        this.touchMove(event, index, colum);
      },
      false
    );

    // if (this.isPC) {
    //   //如果是PC端则再增加拖拽监听 方便调试
    //   theWheel.addEventListener(
    //     "mousedown",
    //     function () {
    //       this.dragClick(event, this.firstChild, index);
    //     },
    //     false
    //   );
    //   theWheel.addEventListener(
    //     "mousemove",
    //     function () {
    //       this.dragClick(event, this.firstChild, index);
    //     },
    //     false
    //   );
    //   theWheel.addEventListener(
    //     "mouseup",
    //     function () {
    //       this.dragClick(event, this.firstChild, index);
    //     },
    //     true
    //   );
    // }
  }

  touchStart(event, index) {
    this.isMoving = true;
    this.startY = parseInt(event.touches[0].clientY);
    this.originalY = this.startY;
  }

  touchMove(event, index, colum) {
    if (!this.isMoving) return;

    event.preventDefault();
    this.moveY = event.touches[0].clientY;
    this.offset = this.moveY - this.originalY;

    this.curDistance[index] = this.getCurrentDistance(colum) + this.offset;
    this.movePosition(colum, this.curDistance[index]);
    this.originalY = this.moveY;
  }

  touchEnd(event, index, colum) {
    this.isMoving = false;
    this.moveEndY = parseInt(event.changedTouches[0].clientY);
    this.offsetSum = this.moveEndY - this.startY;

    if (this.offsetSum == 0) {
      const offset = event.target.targetOffset;
      const index = event.target.index;
      const columIndex = event.target.columIndex;
      if (!Boolean(offset) || !Boolean(index > -1) || !Boolean(columIndex)) return;

      this.movePosition(colum, offset);
      this.value[columIndex] = {
        index,
        value: this.columData[columIndex][index].value,
      };

      return;
    }

    const currentPostion = this.curDistance[index];
    const { maxOffset, minOffset, items } = colum;

    if (currentPostion > maxOffset) {
      this.movePosition(colum, 90);
      this.value[index] = {
        index: 0,
        value: this.columData[index][0].value,
      };

      return;
    }

    if (currentPostion < minOffset) {
      this.movePosition(colum, minOffset);
      this.value[index] = {
        index: items - 1,
        value: this.columData[index][items - 1].value,
      };

      return;
    }

    const closeIndex = Math.round((90 - currentPostion) / 40);
    console.log(closeIndex, 'closeIndex', this.columData[index])

    this.movePosition(colum, 90 - closeIndex * 40);
    this.value[index] = {
      index: closeIndex,
      value: this.columData[index][closeIndex].value,
    };

    console.log(this.value, "this.valuethis.value");
  }

  movePosition(colum, distance) {
    const value = `translateY(${distance}px)`;

    colum.style.webkitTransform = value;
    colum.style.transform = value;
    colum.offset = distance;
  }

  getCurrentDistance(colum) {
    return Number(colum.offset || 90);
  }

  bindEvents() {
    this._pickerRoot
      .querySelector(".scroll-picker-panel")
      .addEventListener("click", (event) => {
        event.stopPropagation();
      });

    this._pickerRoot
      .querySelector(".scroll-picker-cancel-btn")
      .addEventListener("click", () => {
        this.hide();
      });

    this._pickerRoot
      .querySelector(".scroll-picker-confirm-btn")
      .addEventListener("click", this.onSelected);

    this._shadowRoot
      .querySelector(".scroll-picker-trigger")
      .addEventListener("click", () => {
        this.show();
      });

    this.picker.addEventListener("click", () => {
      if (this.isOverlayStopCancel) return;

      this.hide();
    });
  }

  onSelected() {
    this.dispatchEvent(
      new CustomEvent("change", {
        detail: this.value,
      })
    );
    this.hide();
  }

  attachStyle() {
    const style = document.querySelector("#scroll-picker-style-container");
    if (!Boolean(style)) {
      const styleRoot = document.createElement("div");
      styleRoot.id = "scroll-picker-style-container";
      styleRoot.appendChild(styleTemplate.content.cloneNode(true));
      document.querySelector("body").appendChild(styleRoot);
    }
  }

  aoolyTheme(options) {
    const theme = document.querySelector("#scroll-picker-theme-container");
    if (Boolean(theme)) {
      theme.remove();
    }

    const styleRoot = document.createElement("div");
    styleRoot.id = "scroll-picker-theme-container";
    styleRoot.innerHTML = `
    <style>
    .scroll-picker-container {
      background-color: 
    }


    .scroll-picker-panel {
      background-color: 
    }

    .scroll-picker-panel-header {
      border-bottom: 1px solid ${GRAY}; //
    }

    .scroll-picker-title {
      color: 
    }

    .scroll-picker-cancel-btn {
      color: ${GRAY}; //
    }

    .scroll-picker-confirm-btn {
      color: ${YELLOW}; //
    }

    .scroll-picker-panel-content {
        color: rgb(255, 255, 255);
    }

    .scroll-picker-center {
      border: 1px solid ${YELLOW};
    }

    .scroll-picker-mask {
      background: linear-gradient(rgb(45, 52, 61, .9), rgba(45, 52, 61, 0), rgb(45, 52, 61, .9));
    }
 
  </style>
    `;
    document.querySelector("body").appendChild(styleRoot);
  }

  destory() {
    this._pickerRoot.remove();
  }
}

window.customElements.define("scroll-picker", ScrollPicker);
