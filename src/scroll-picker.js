const containerTemplate = document.createElement("template");
const PANEL_HEIGHT = 300;
const YELLOW = '#FFDF22';
const DARK_GRAY = '#2D343D';
const GRAY = '#99A6B5';
const WHITE = '#fff';
const BLACK = '#000';

const DEFAULT_DARK_COLOR = {
  containerBackgroundColor: 'rgba(45, 52, 61, .9)',
  panelBackground: DARK_GRAY,
  panelHeaderBorderColor: GRAY,
  titleColor: GRAY,
  confirmButtonColor: YELLOW,
  cancelButtonColor: GRAY,
  textColor: WHITE,
  focusBorderColor: YELLOW,
  maskBackgroundColor: 'rgb(45, 52, 61, .9)'

};

const DEFAULT_LIGHT_COLOR = {
  containerBackgroundColor: 'rgba(210, 210, 210, .9)',
  panelBackground: GRAY,
  panelHeaderBorderColor: DARK_GRAY,
  titleColor: DARK_GRAY,
  confirmButtonColor: YELLOW,
  cancelButtonColor: DARK_GRAY,
  textColor: BLACK,
  focusBorderColor: YELLOW,
  maskBackgroundColor: 'rgb(200, 200, 200, .9)'
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
    }

    .scroll-picker-title {
      line-height: 40px;
      font-size: 18px;
    }

    .scroll-picker-btn{
        outline: none;
        font-size: 16px;
        border: none;
        background: transparent;
    }

    .scroll-picker-panel-content {
        flex: 1;
        display: flex;
        color: rgb(255, 255, 255);
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
    }

    .scroll-picker-mask {
      z-index: 3;
      position: absolute;
      top: 0;
      width: 100%;
      height: ${PANEL_HEIGHT}px;
      opacity: .9;
      pointer-events: none;
    }
 
  </style>`;

const pickerTemplate = document.createElement("template");
pickerTemplate.innerHTML = `
  <div class="scroll-picker-container">
    <div class="scroll-picker-panel">
        <div class="scroll-picker-panel-header">
            <button class="scroll-picker-btn scroll-picker-cancel-btn">Cancel</button>
            <div class="scroll-picker-title"></div>
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
    this.onMouseUp = this.onMouseUp.bind(this);
    this._stopPropagation = this._stopPropagation.bind(this);
    this.hide = this.hide.bind(this);
    this.show = this.show.bind(this);
    this._onOverlayClick = this._onOverlayClick.bind(this);

    this.isOverlayStopCancel = false;
    this.startY = 0;
    this.originalY = 0;
    this.isMoving = false;
    this.curDistance = [];
    this.offsetStep = 40;
    this.value = [];
    this.columData = [];
    this._options = {};
    this._cancelText = 'Cancel';
    this._confirmText = 'Confirm';

    this._shadowRoot = this.attachShadow({ mode: "open" });
    this._shadowRoot.appendChild(containerTemplate.content.cloneNode(true));
    this.picker = this.generatePicker();
  }

  connectedCallback() {
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
    value.title && this.setTitle(value.title);
    value.colum && this.render(value.colum);
    value.cancelText && this.updateCancelText(value.cancelText);
    value.confirmText && this.updateConfirmText(value.confirmText);
    this._options = value;
    this.applyTheme(value);
  }

  get colums() {
    return this.columData;
  }

  set colums(value) {
    this.columData = value;
    this.render(value);
  }

  get confirmText() {
    return this._confirmText;
  }

  set confirmText(value) {
    this._confirmText = value;
    this.updateConfirmText(value);
  }

  get cancelText() {
    return this._cancelText;
  }

  set cancelText(value) {
    this._cancelText = value;
    this.updateCancelText(value);
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
        const value = JSON.parse(newVal);
        this.setTitle(value.title);
        value.colum && this.render(value.colum);
        value.cancelText && this.updateCancelText(value.cancelText);
        value.confirmText && this.updateConfirmText(value.confirmText);
        this._options = value;
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

  updateCancelText(text) {
    this._pickerRoot.querySelector('.scroll-picker-cancel-btn').innerHTML = text;
  }

  updateConfirmText(text) {
    this._pickerRoot.querySelector('.scroll-picker-confirm-btn').innerHTML = text;
  }

  render(colums) {
    this.columData = colums;
    const container = this._pickerRoot.querySelector(
      ".scroll-picker-panel-content"
    );

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

      this.attachEvents2Colum(columRoot, index);

      container.appendChild(columRoot);
      this.movePosition(columRoot, 90);
    });
  }

  attachEvents2Colum(colum, index) {
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

    colum.addEventListener("mousedown", this.touchStart, false);
    colum.addEventListener(
      "mouseup",
      (event) => {
        this.touchEnd(event, index, colum);
      },
      false
    );
    colum.addEventListener(
      "mousemove",
      (event) => {
        this.touchMove(event, index, colum);
      },
      false
    );

    document.addEventListener('mouseup', this.onMouseUp, false)
  }

  onMouseUp() {
    this.isMoving = false;
  }

  touchStart(event) {
    this.isMoving = true;
    this.startY = parseInt(event.touches && event.touches[0] ? event.touches[0].clientY : event.clientY);
    this.originalY = this.startY;
  }

  touchMove(event, index, colum) {
    if (!this.isMoving) return;

    event.preventDefault();
    this.moveY = parseInt(event.touches && event.touches[0] ? event.touches[0].clientY : event.clientY);
    this.offset = this.moveY - this.originalY;

    this.curDistance[index] = this.getCurrentDistance(colum) + this.offset;
    this.movePosition(colum, this.curDistance[index]);
    this.originalY = this.moveY;
  }

  touchEnd(event, index, colum) {
    this.isMoving = false;
    this.moveEndY = parseInt(event.touches && event.touches[0] ? event.touches[0].clientY : event.clientY || this.startY);
    this.offsetSum = this.moveEndY - this.startY;
    this.calculateMoveDistance(event, index, colum);
  }

  calculateMoveDistance(event, index, colum) {
    // treat move distance less than 10 as click
    if (Math.abs(this.offsetSum) <= 10) {
      const offset = event.target.targetOffset;
      const _index = event.target.index;
      const columIndex = event.target.columIndex;

      if (!Boolean(offset) || !Boolean(_index > -1) || !Boolean(columIndex > -1)) return;

      this.movePosition(colum, offset);
      this.value[columIndex] = {
        index: _index,
        value: this.columData[columIndex][_index].value,
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

    this.movePosition(colum, 90 - closeIndex * 40);
    this.value[index] = {
      index: closeIndex,
      value: this.columData[index][closeIndex].value,
    };
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
      .addEventListener("click", this._stopPropagation);

    this._pickerRoot
      .querySelector(".scroll-picker-cancel-btn")
      .addEventListener("click", this.hide);

    this._pickerRoot
      .querySelector(".scroll-picker-confirm-btn")
      .addEventListener("click", this.onSelected);

    this._shadowRoot
      .querySelector(".scroll-picker-trigger")
      .addEventListener("click", this.show);

    this.picker.addEventListener("click", this._onOverlayClick);
  }

  unbindEvents() {
    this._pickerRoot
      .querySelector(".scroll-picker-panel")
      .removeEventListener("click", this._stopPropagation);

    this._pickerRoot
      .querySelector(".scroll-picker-cancel-btn")
      .removeEventListener("click", this.hide);

    this._pickerRoot
      .querySelector(".scroll-picker-confirm-btn")
      .removeEventListener("click", this.onSelected);

    this._shadowRoot
      .querySelector(".scroll-picker-trigger")
      .removeEventListener("click", this.show);

    this.picker.removeEventListener("click", this._onOverlayClick);
  }

  _onOverlayClick() {
    if (this.isOverlayStopCancel) return;

    this.hide();
  }

  _stopPropagation(event) {
    event.stopPropagation();
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
    this.applyTheme(this._options);
  }

  applyTheme(options) {
    const theme = document.querySelector("#scroll-picker-theme-container");
    if (Boolean(theme)) {
      theme.remove();
    }

    const defaultStyle = options.theme === 'dark' ? DEFAULT_DARK_COLOR : DEFAULT_LIGHT_COLOR;

    const styleRoot = document.createElement("div");
    styleRoot.id = "scroll-picker-theme-container";
    styleRoot.innerHTML = `
    <style>
    .scroll-picker-container {
      background-color: ${options.containerBackgroundColor ? options.containerBackgroundColor : defaultStyle.containerBackgroundColor}
    }


    .scroll-picker-panel {
      background-color: ${options.panelBackground ? options.panelBackground : defaultStyle.panelBackground}
    }

    .scroll-picker-panel-header {
      border-bottom: 1px solid ${options.panelHeaderBorderColor ? options.panelHeaderBorderColor : defaultStyle.panelHeaderBorderColor};
    }

    .scroll-picker-title {
      color: ${options.titleColor ? options.titleColor : defaultStyle.titleColor}
    }

    .scroll-picker-cancel-btn {
      color: ${options.cancelButtonColor ? options.cancelButtonColor : defaultStyle.cancelButtonColor};
    }

    .scroll-picker-confirm-btn {
      color: ${options.confirmButtonColor ? options.confirmButtonColor : defaultStyle.confirmButtonColor};
    }

    .scroll-picker-panel-content {
        color: ${options.textColor ? options.textColor : defaultStyle.textColor};
    }

    .scroll-picker-center {
      border: 1px solid ${options.focusBorderColor ? options.focusBorderColor : defaultStyle.focusBorderColor};
    }

    .scroll-picker-mask {
      background: linear-gradient(${options.maskBackgroundColor ? options.maskBackgroundColor : defaultStyle.maskBackgroundColor}, rgba(45, 52, 61, 0), ${options.maskBackgroundColor ? options.maskBackgroundColor : defaultStyle.maskBackgroundColor});
    }
 
  </style>`;

    document.querySelector("body").appendChild(styleRoot);
  }

  destory() {
    this.unbindEvents();
    this._pickerRoot.remove();
  }
}

window.customElements.define("scroll-picker", ScrollPicker);
