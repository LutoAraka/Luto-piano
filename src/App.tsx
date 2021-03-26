import {
  FunctionComponent,
  MouseEventHandler,
  useEffect,
  useState,
} from "react";
import * as Tone from "tone";
import classnames from "classnames";
import "./App.css";
import { useNotePressed } from "./NotePressedContext";
import openFace from "./highNoteFace.png";
import closedFace from "./mouthClosed.png";

const notes = {
  C4: "q",
  D4: "w",
  E4: "e",
  F4: "r",
  G4: "t",
  A4: "y",
  B4: "u",
  C5: ["i", "c"],
  D5: "v",
  E5: "b",
  F5: "n",
  G5: "m",
  A5: ",",
  B5: ".",
  C6: "/",
};

const blackNotes = {
  "C#4": "2",
  "D#4": "3",
  "F#4": "5",
  "G#4": "6",
  "A#4": "7",
  "C#5": "f",
  "D#5": "g",
  "F#5": "j",
  "G#5": "k",
  "A#5": "l",
};

const sampler = new Tone.Sampler({
  urls: {
    C4: "1_C4.mp3",
    D4: "2_D4.mp3",
    E4: "3_E4.mp3",
    F4: "4_F4.mp3",
    G4: "5_G4.mp3",
    A4: "6_A4.mp3",
    B4: "7_B4.mp3",
    C5: "8_C5.mp3",
    D5: "9_D5.mp3",
    E5: "10_E5.mp3",
    F5: "11_F5.mp3",
    G5: "12_G5.mp3",
    A5: "13_A5.mp3",
    B5: "14_B5.mp3",
    C6: "15_C6.mp3",
  },
  baseUrl: "/samples/",
}).toDestination();

type NoteProps = {
  note: string;
  keyboard: string | string[];
  white?: boolean;
};

const Note: FunctionComponent<NoteProps> = ({ note, keyboard, white }) => {
  const [pressed, setPressed] = useState(false);
  const [_, setGlobalPressed] = useNotePressed();

  useEffect(() => {
    if (pressed) {
      sampler.triggerAttack(note);
    } else {
      sampler.triggerRelease(note);
    }
  }, [pressed, note]);

  const pressNote = () => {
    setPressed(true);
    setGlobalPressed(true);
  };

  const releaseNote = () => {
    setPressed(false);
    setGlobalPressed(false);
  };

  const handleMouseEnter: MouseEventHandler = (e) => {
    if (e.buttons) {
      pressNote();
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", (e) => {
      if (keyboard.includes(e.key)) {
        pressNote();
      }
    });

    document.addEventListener("keyup", (e) => {
      if (keyboard.includes(e.key)) {
        releaseNote();
      }
    });
  }, [keyboard]);

  const className = classnames(
    white ? "whiteNote" : "blackNote",
    pressed && "pressed"
  );

  return (
    <button
      className={className}
      onMouseDown={pressNote}
      onMouseUp={releaseNote}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={releaseNote}
    >
      <div className="keyboardLabel">
        {Array.isArray(keyboard) ? keyboard.join("/") : keyboard}
      </div>
    </button>
  );
};

const Image: FunctionComponent = () => {
  const [pressed] = useNotePressed();

  return <img className="image" src={pressed ? openFace : closedFace} />;
};

function App() {
  return (
    <div className="app">
      <Image />
      <div className="piano-wrapper">
        <div className="piano">
          <div className="whiteRow">
            {Object.entries(notes).map(([note, key]) => (
              <Note key={note} note={note} keyboard={key} white />
            ))}
          </div>
          <div className="blackRow">
            {Object.entries(blackNotes).map(([note, key]) => (
              <Note key={note} note={note} keyboard={key} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
