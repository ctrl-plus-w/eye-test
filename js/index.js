class Renderer {
  constructor(cb, fps, context = undefined) {
    this._fps = fps;
    this.cb = cb;
    this.context = context;

    this.lastFrame = 0;
    this.animationFrame = requestAnimationFrame(this.render.bind(this));
  }

  setFps(value) {
    this._fps = value;
    this.reRender();
  }

  request() {
    this.animationFrame = requestAnimationFrame(this.render.bind(this));
  }

  cancel() {
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
    }
  }

  reRender(cancel = true) {
    cancel && this.cancel();
    this.request();
  }

  render(time) {
    const minTime = (1000 / 60) * (60 / this._fps) - (1000 / 60) * 0.5;

    if (time - this.lastFrame < minTime) {
      return this.request();
    }

    if (this.context) {
      this.cb.call(this.context);
    } else {
      this.cb();
    }

    this.lastFrame = time;
    this.request();
  }
}

class EyeTest {
  constructor(canvas, fpsInput, cellSizeInput, rowCellAmountInput, colCellAmountInput, color1Input, color2Input) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');

    this.cellSize = cellSizeInput.value;
    this.rowCellAmount = rowCellAmountInput.value;
    this.colCellAmount = colCellAmountInput.value;

    this.color1 = color1Input.value;
    this.color2 = color2Input.value;

    this.colorSwitch = false;

    fpsInput.addEventListener('change', this.handleFpsInput.bind(this));

    cellSizeInput.addEventListener('change', this.handleInput('cellSize').bind(this));
    rowCellAmountInput.addEventListener('change', this.handleInput('rowCellAmount').bind(this));
    colCellAmountInput.addEventListener('change', this.handleInput('colCellAmount').bind(this));

    color1Input.addEventListener('change', this.handleInput('color1').bind(this));
    color2Input.addEventListener('change', this.handleInput('color2').bind(this));

    this.updateSize();

    this.render();
    this.renderer = new Renderer(this.render, fpsInput.value, this);
  }

  handleFpsInput(event) {
    this.renderer.setFps(event.currentTarget.value);
  }

  handleInput(property) {
    return function (event) {
      this[property] = event.currentTarget.value;
      this.updateSize();
    };
  }

  updateSize() {
    this.ctx.canvas.width = this.cellSize * this.colCellAmount;
    this.ctx.canvas.height = this.cellSize * this.rowCellAmount;
  }

  drawRect(x, y, width, height, color) {
    this.ctx.fillStyle = color;
    this.ctx.fillRect(x, y, width, height);

    return this;
  }

  drawSquare(x, y, size, color) {
    return this.drawRect(x, y, size, size, color);
  }

  render() {
    const availableColors = this.colorSwitch ? [this.color1, this.color2] : [this.color2, this.color1];

    for (let i = 0; i < this.colCellAmount; i++) {
      for (let j = 0; j < this.rowCellAmount; j++) {
        const color = availableColors[(i % 2 == 0 && j % 2 == 1) || (i % 2 == 1 && j % 2 == 0) ? 0 : 1];

        this.drawSquare(i * this.cellSize, j * this.cellSize, this.cellSize, color);
      }
    }

    this.colorSwitch = !this.colorSwitch;
  }
}

window.addEventListener('load', () => {
  const canvas = document.querySelector('#myCanvas');

  const fpsInput = document.querySelector('#fps');
  const cellSizeInput = document.querySelector('#cellSize');
  const rowCellAmountInput = document.querySelector('#rowCellAmount');
  const colCellAmountInput = document.querySelector('#colCellAmount');
  const color1Input = document.querySelector('#color1');
  const color2Input = document.querySelector('#color2');

  if (!fpsInput) {
    throw new Error('FPS Input not found');
  }

  if (!cellSizeInput) {
    throw new Error('Cell Size Input not found');
  }

  if (!rowCellAmountInput) {
    throw new Error('Row Cell Amount Input not found');
  }

  if (!colCellAmountInput) {
    throw new Error('Col Cell Amount Input not found');
  }

  if (!color1Input) {
    throw new Error('Color1 Input not found');
  }

  if (!color2Input) {
    throw new Error('Color2 Input not found');
  }

  new EyeTest(canvas, fpsInput, cellSizeInput, rowCellAmountInput, colCellAmountInput, color1Input, color2Input);
});
