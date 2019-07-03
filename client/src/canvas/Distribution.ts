import { interpolateColor } from "../utils/colors";
import {
  transform,
  circlePoint,
  interpolateVector,
  randomDistributeVector,
  distance
} from "../utils/vectors";
import { store } from "../utils/redux";

interface V2 {
  x: number;
  y: number;
}

class Distribution {
  width: number;
  height: number;
  active: boolean;
  images: Image[];
  state: AppState["visual"];
  distributedAnchors: { name: EmotionText; color: string; position: V2 }[];
  dataPoints: { position: V2; color: string }[];
  currentPoints: { position: V2; color: string }[];
  constructor() {
    this.updateState();
    this.active = true;

    store.subscribe(() => {
      if (this.active) {
        this.updateState();
        this.calculatePoints();
      }
    });
  }
  updateState() {
    const state = store.getState();
    this.images = state.images.map(x => x.azure_data.faceAttributes.emotion);
    this.state = state.state.visual;
  }
  calculatePoints() {
    const radius = this.width / 2 - 30;
    // Emotions in Outer Ring

    const anchors: EmotionText[] = [
      "contempt",
      "surprise",
      "happiness",
      "sadness",
      "disgust",
      "anger",
      "fear"
    ];

    // Get positions for anchor points
    this.distributedAnchors = anchors
      .map((p, i) => ({
        name: p,
        color: this.state.emotions.filter(x => x.name === p)[0].color,
        position: transform(circlePoint(i / anchors.length, radius), {
          x: this.width / 2,
          y: this.height / 3
        })
      }))
      .concat([
        {
          name: "neutral",
          color: this.state.emotions.filter(x => x.name === "neutral")[0].color,
          position: { x: this.width / 2, y: this.height / 3 }
        }
      ]);

    // Get positions for data points
    this.dataPoints = this.images.map(emot => ({
      ...this.distributedAnchors
        .filter(anch => emot[anch.name] > 0)
        .reduce(
          (res, anch) => {
            return {
              color: interpolateColor(res.color, anch.color, emot[anch.name]),
              position: randomDistributeVector(
                // Add a random distribution to point
                interpolateVector(
                  // Get location of vector
                  res.position,
                  { x: anch.position.x, y: anch.position.y },
                  emot[anch.name]
                ),
                this.width / 10
              )
            };
          },
          {
            position: { x: this.width * 0.6, y: this.height * 0.4 },
            color: "#ffffff"
          }
        )
    }));
    if (!this.currentPoints || this.currentPoints.length <= 0) {
      this.currentPoints = this.dataPoints;
    }
  }
  calculateMovement() {
    this.currentPoints = this.currentPoints.map((point, i) => {
      const xDistance = point.position.x - this.dataPoints[i].position.x;
      const yDistance = point.position.y - this.dataPoints[i].position.y;
      const distance = Math.sqrt(xDistance * xDistance + yDistance * yDistance);

      const easingAmount = 0.002;

      if (distance <= 5) return point;

      return {
        ...point,
        position: {
          x: point.position.x - xDistance * easingAmount,
          y: point.position.y - yDistance * easingAmount
        }
      };

      // const dx = point.position.x - this.dataPoints[i].position.x;
      // const dy = point.position.y - this.dataPoints[i].position.y;
      // const angle = Math.atan(dy, dx);
      // const magnitude = 1.0;
      // const velX = Math.cos(angle) * magnitude;
      // const velY = Math.sin(angle) * magnitude;

      // return {
      //   ...point,
      //   position: { x: point.position.x + velX, y: point.position.y + velY }
      // };
    });
  }
  stop() {
    this.active = false;
  }
  setup(ctx, { width, height }) {
    this.width = width;
    this.height = height;
    this.active = true;
    this.calculatePoints();

    ctx.translate(0, 100);
  }
  draw(ctx, { width, height }) {
    if (!this.dataPoints || !this.distributedAnchors) return null;
    this.calculateMovement();
    ctx.clearRect(0, 0, width, height);

    // Data points loop
    this.currentPoints.forEach(dp1 => {
      // Draw lines between points
      // this.dataPoints.forEach(dp2 => {
      //   if (distance(dp1.position, dp2.position) < 100) {
      //     ctx.moveTo(dp1.position.x, dp1.position.y);
      //     ctx.lineTo(dp2.position.x, dp2.position.y);
      //     ctx.closePath();

      //     ctx.lineWidth = 0.01;
      //     ctx.strokeStyle = dp1.color;
      //     // color.interpolate(dp1.color, dp2.color, 0.5);
      //     ctx.stroke();
      //   }
      // });

      // Draw data point
      ctx.fillStyle = dp1.color;

      const dist = distance(dp1.position, {
        x: this.width / 2,
        y: this.width / 2
      });

      const pos = { x: 5 + dist * 0.3, y: 5 + dist * 0.3 };
      ctx.fillRect(
        dp1.position.x - pos.x / 2,
        dp1.position.y - pos.y / 2,
        pos.x,
        pos.y
      );
    });

    // Draw anchors
    this.distributedAnchors.forEach(anch => {
      ctx.fillStyle = "white";
      ctx.fillRect(anch.position.x - 30, anch.position.y, 50, 15);
      ctx.fillStyle = "black";
      ctx.fillText(
        anch.name.toUpperCase(),
        anch.position.x - 30,
        anch.position.y + 10
      );
    });
  }
}

export default Distribution;
