import { store } from "../utils/redux";

export default class FaceDraw {
  images: { IMG: HTMLImageElement; faces: Image[] }[];
  imageData: { key: string; faces: Image[] }[];
  updatedState: boolean;
  number: number;
  current: { IMG: HTMLImageElement; faces: Image[] };
  timer: any;
  active: boolean;
  width: number;
  height: number;
  emotionColors: { [k in EmotionText]: string };
  constructor() {
    this.images = [];
    this.number = 5;
    this.loadImages();
    store.subscribe(() => {
      if (this.images.length < 1) {
        this.loadImages();
      }
    });
  }
  loadImages() {
    const all = store.getState().images;
    console.log(all[0]);
    this.emotionColors = store
      .getState()
      .state.visual.emotions.reduce(
        (a, b) => ({ ...a, [b.name]: b.color }),
        {}
      );

    this.imageData = all.slice(0, this.number).map(x => ({
      key: x.source_key,
      faces: all.filter(y => y.source_key === x.source_key)
    }));

    this.imageData.forEach((data, i) => {
      const img = new Image();
      img.src = `https://s3.eu-west-2.amazonaws.com/slsfaces/${data.key}`;
      img.onload = () => {
        this.images = [...this.images, { IMG: img, faces: data.faces }];
        this.timer = setTimeout(() => {
          if (this.active) {
            this.current = { IMG: img, faces: data.faces };
          }
        }, i * 3000);
      };
    });
  }
  stop() {
    clearTimeout(this.timer);
    this.active = false;
  }
  setup(ctx, { width, height }) {
    this.width = width;
    this.height = height;
    this.active = true;
    ctx.translate(10, 0);
  }
  draw(ctx) {
    const img = this.current;
    ctx.rect(0, 0, this.width, this.height);
    ctx.fillStyle = "white";
    ctx.fill();
    ctx.closePath();

    if (img) {
      // this.images.forEach((img, i) => {
      const ratio = img.IMG.height / img.IMG.width;
      const imgWidth = window.innerWidth / 3;
      ctx.drawImage(img.IMG, 0, 0, imgWidth, imgWidth * ratio);

      const scaleX = imgWidth / img.IMG.width;
      const scaleY = (imgWidth * ratio) / img.IMG.height;

      img.faces.forEach((face, i1) => {
        ctx.beginPath();
        const { left, top, width, height } = face.azure_data.faceRectangle;
        ctx.rect(left * scaleX, top * scaleY, width * scaleX, height * scaleY);
        ctx.strokeStyle = "green";
        ctx.lineWidth = 3;
        ctx.stroke();
        ctx.closePath();

        const emotion = face.azure_data.faceAttributes.emotion;

        Object.keys(emotion).forEach((key, i2) => {
          const down = imgWidth * ratio + 30 + i2 * 26 + i1 * 130;

          ctx.beginPath();
          ctx.rect(0, down + 4, 150, 20);
          ctx.fillStyle = this.emotionColors[key];
          ctx.fill();
          ctx.closePath();

          ctx.beginPath();

          if (key === "contempt" || key === "anger") {
            ctx.fillStyle = "#ffffff";
          } else {
            ctx.fillStyle = "black";
          }
          ctx.font = "16px Poppins";
          ctx.fillText(key, 10, down + 20);
          ctx.fillText(Math.ceil(emotion[key] * 100) + "%", 110, down + 20);
          ctx.fill();
          ctx.closePath();
        });
      });

      // });
    }
  }
}
