import { createContext, FunctionComponent, useContext, useState } from "react";

const NotePressedContext = createContext<
  [boolean, (newValue: boolean) => void]
>([false, () => null]);

const NotePressedContextProvider: FunctionComponent = (props) => {
  const pressedState = useState(false);
  return <NotePressedContext.Provider value={pressedState} {...props} />;
};

const useNotePressed = () => useContext(NotePressedContext);

export { NotePressedContextProvider, useNotePressed };
