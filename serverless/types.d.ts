type EmotionText =
  | "happiness"
  | "surprise"
  | "fear"
  | "sadness"
  | "disgust"
  | "contempt"
  | "anger"
  | "neutral";

interface AppState {
  cameras: { running: boolean; delay: number };
  visual: {
    emotions: {
      name: EmotionText;
      color: string;
      messages: { text: string; id: string }[];
    }[];
    messages: { text: string; id: string }[];
  };
}

interface Image {
  imagekey: string;
  created_at: number;
  source_key: string;
  azure_data: {
    faceRectangle: {
      width: number;
      top: number;
      left: number;
      height: number;
    };
    faceAttributes: {
      glasses: string;
      makeup: {
        lipMakeup: boolean;
        eyeMakeup: boolean;
      };
      facialHair: {
        beard: number;
        sideburns: number;
        moustache: number;
      };
      emotion: {
        contempt: number;
        surprise: number;
        happiness: number;
        neutral: number;
        sadness: number;
        disgust: number;
        anger: number;
        fear: number;
      };
      gender: string;
      accessories: string[];
      age: number;
      smile: number;
    };
    faceId: string;
  };
}
