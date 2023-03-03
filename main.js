


function drawLine(ctx, startX, startY, endX, endY, color) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.beginPath();
  ctx.moveTo(startX, startY);
  ctx.lineTo(endX, endY);
  ctx.stroke();
  ctx.restore();
}
function drawBar(ctx, upperLeftCornerX, upperLeftCornerY, width, height, color) {
  ctx.save();
  ctx.fillStyle = color;
  ctx.fillRect(upperLeftCornerX, upperLeftCornerY, width, height);
  ctx.stroke();
  ctx.restore();
}
class Histogram {
  constructor(options) {
    this.options = options;
    this.canvas = options.canvas;
    this.ctx = this.canvas.getContext("2d");
    this.color = options.color;
    this.titleOptions = options.titleOptions;
    this.maxValue = Math.max(...this.options.data);

    this.gridScale = Math.ceil((this.maxValue / this.options.data.length) / 10) * 10;
    this.gridXScale = 10; // Assuming the X-Distribution 
  }

  drawGridLines() {
    let canvasActualHeight = this.canvas.height - this.options.padding * 2;
    let gridValue = 0;
    while (gridValue <= this.maxValue) {
      let gridY = canvasActualHeight * (1 - gridValue / this.maxValue) + this.options.padding;

      drawLine(this.ctx, 0, gridY, this.canvas.width, gridY, this.options.gridColor);
      // Writing grid markers 
      this.ctx.save();
      this.ctx.fillStyle = this.options.gridColor;
      this.ctx.textBaseline = "bottom";
      this.ctx.font = "bold 10px Arial";
      this.ctx.fillText(gridValue, 20, gridY - 1);
      this.ctx.restore();
      gridValue += this.gridScale;

    }


  }

  drawGridYLines() {
    let gridXValue = 0;
    let xValue = 25;
    let canvasActualWidth = this.canvas.width - this.options.padding * 2;
    let xWidth = canvasActualWidth / this.options.data.length;
    let numberOfBars = this.options.data.length;
    let ind = 0;

    //Draw the starting y-Line 
    drawLine(this.ctx, 40, this.options.padding / 2, 40, this.canvas.width - this.options.padding / 2, this.options.gridColor);

    while (ind <= numberOfBars) {
      // Writing grid markers 
      this.ctx.save();
      this.ctx.fillStyle = this.options.gridColor;
      this.ctx.textBaseline = "bottom";
      this.ctx.font = "bold 10px Arial";
      this.ctx.fillText(`${gridXValue}`, xValue, this.canvas.width - this.options.padding / 2);
      this.ctx.restore();
      gridXValue += this.gridXScale;
      xValue += xWidth;
      ind += 1;
    }
  }
  drawBars() {
    let canvasActualHeight = this.canvas.height - this.options.padding * 2;
    let canvasActualWidth = this.canvas.width - this.options.padding * 2;
    let barIndex = 0;
    let numberOfBars = this.options.data.length;
    let barSize = canvasActualWidth / numberOfBars;

    let values = this.options.data;
    for (let val of values) {
      let barHeight = Math.round((canvasActualHeight * val) / this.maxValue);

      drawBar(this.ctx, this.options.padding + barIndex * barSize, this.canvas.height - barHeight - this.options.padding, barSize, barHeight, this.color);
      barIndex++;
    }
  }
  drawLabel() {
    this.ctx.save();
    this.ctx.font = `${this.titleOptions.font.weight} ${this.titleOptions.font.size} ${this.titleOptions.font.family}`;
    let xPos = this.canvas.width / 2;

    this.ctx.fillText(this.options.seriesName, xPos, this.canvas.height);

    this.ctx.restore();
  }
  drawYLabel() {
    this.ctx.save();
    this.ctx.font = `${this.titleOptions.font.weight} ${this.titleOptions.font.size} ${this.titleOptions.font.family}`;

    let text = this.options.seriesYName;

    let font = this.options.titleOptions.font.fontValue;
    let metrics = this.ctx.measureText(text);
    //Setting the text coordinates
    let x = font / 2;
    let y = metrics.width / 2;
    ctx.textBaseline = "ideographic";
    ctx.textAlign = "right"
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText(text, -470, 2);
    this.ctx.restore();

  }

  draw() {
    this.drawGridLines();
    this.drawGridYLines();
    this.drawBars();
    this.drawLabel();
    this.drawYLabel();

  }

  clearDrawing() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.beginPath();
  }
  redraw(data) {
    this.options.data = data;
    this.maxValue = Math.max(...this.options.data);
    this.gridScale = Math.ceil((this.maxValue / this.options.data.length) / 10) * 10;

    this.clearDrawing();
    this.draw();
  }

}


// Creating an instance including random test data
let myCanvas = document.getElementById("myCanvas");
let ctx = myCanvas.getContext("2d");
let myHistogram = new Histogram({
  canvas: myCanvas,
  seriesName: "x-axis",
  seriesYName: "y-axis",
  padding: 40,
  gridColor: "black",
  data: [16, 100, 180, 32, 32, 32],
  color: "#eb9743",
  titleOptions: {
    font: {
      weight: "bold",
      size: "18px",
      family: "Lato",
      fontValue: 20
    }
  }
});
myHistogram.draw();


let errorMessage = document.getElementById('errorMessage');
let drawBtn = document.getElementById('drawBtn');
drawBtn.addEventListener("click", getBtnData);

let ydata = document.getElementById('yData');



function getBtnData($event) {
  $event.preventDefault();
  let yValue = convertToArray(ydata.value);
  if (!validateData(yValue)) {
    errorMessage.textContent = "Kindly enter comma seperated value and value must be a number";
    clearDataInput();
  }
  else {
    myHistogram.redraw(yValue);
    errorMessage.textContent = "";
  }
}

function convertToArray(val) {
  return val.trim().split(",");
}

function validateData(data) {
  for (let i = 0; i < data.length; i++) {
    if (isNaN(parseInt(data[i]))) {
      return false;
    }
  }
  return true;
}

function clearDataInput() {
  ydata.value = '';
}



