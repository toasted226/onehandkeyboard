import { useState, useRef } from "react";
import useAutosizeTextArea from "./useAutosizeTextArea";
import "./Textbox.css";
import { invoke } from "@tauri-apps/api";

function Textbox() {
    const [textAreaValue, setTextAreaValue] = useState("");
    const [words, setWords] = useState({index: 0, translated: [""]});
    const [selectedWord, setSelectedWord] = useState("");
    const [focusedIndex, setFocusedIndex] = useState(0);

    const textAreaRef = useRef<HTMLTextAreaElement>(null);

    useAutosizeTextArea(textAreaRef.current, textAreaValue);

    const handleTextAreaChange = (evt: React.ChangeEvent<HTMLTextAreaElement>) => {
        const val = evt.target?.value;

        setTextAreaValue(val);
    };

    const handleInput = async (evt: React.KeyboardEvent<HTMLTextAreaElement>) => {
        const ta = textAreaRef.current!;
        let val = ta.value;
 
        if (evt.key === " ") { 
            if (val.length > 1) {
                if (selectedWord === "") {
                    setWords(await invoke("on_text_change", { text: textAreaValue }));
                }
                else if (selectedWord !== "") {
                    let fi = words.index;
                    if (words.index != 0)
                        fi += 1;
                        
                    ta.value = ta.value.slice(0, fi) + selectedWord + " ";
                    setTextAreaValue(ta.value);
                    setSelectedWord("");
                }
            }
        }
    };

    const handleButtonClick = (index: number) => {
        setFocusedIndex(index);
        setSelectedWord(words.translated[index]);
        
        let fi = words.index;
        if (words.index != 0)
            fi += 1;
            
        let value = textAreaValue.slice(0, fi) + selectedWord + " ";
        setTextAreaValue(value);

        setWords({index: 0, translated: [""]});
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
        switch (event.key) {
            case "Tab":
                event.preventDefault();
                const nextIndex = focusedIndex + 1;
                setFocusedIndex(nextIndex >= words.translated.length ? 0 : nextIndex);
                break;
            case " ":
                console.log("Selected option: ", words.translated[focusedIndex]);
                break;
        }
    };

    return (
        <>
            <textarea className="textbox"
                onChange={handleTextAreaChange}
                onKeyDown={handleInput}
                placeholder=""
                ref={textAreaRef}
                rows={1}
                value={textAreaValue}
                autoFocus={true}
            >
            </textarea>
            <div className="dropdown"
                onKeyDown={handleKeyDown}>
                {words.translated.map((word, index) => (
                    <button
                        key={index}
                        onClick={() => handleButtonClick(index)}
                        style={{background: focusedIndex === index ? "blue" : "#1f1f1f"}}
                    >
                        {word}
                    </button>
                ))}
            </div>
        </>
    );
}

export default Textbox;
