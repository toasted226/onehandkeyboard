import { useState, useRef } from "react";
import useAutosizeTextArea from "./useAutosizeTextArea";
import "./Textbox.css";
import { invoke } from "@tauri-apps/api";

interface Words {
    index: number,
    translated: string[]
}

function Textbox() {
    const [value, setValue] = useState("");
    const [words, setWords] = useState({index: 0, translated: [""]});
    const [selectedWord, setSelectedWord] = useState("");
    const [focusedIndex, setFocusedIndex] = useState(0);

    const textAreaRef = useRef<HTMLTextAreaElement>(null);
    const dropdownRef = useRef(null);

    useAutosizeTextArea(textAreaRef.current, value);

    const handleChange = (evt: React.ChangeEvent<HTMLTextAreaElement>) => {
        const val = evt.target?.value;

        setValue(val);
    };

    const handleInput = async (evt: React.KeyboardEvent<HTMLTextAreaElement>) => {
        const ta = textAreaRef.current!;
        let val = ta.value;

        if (selectedWord === "") {
            setWords(await invoke("on_text_change", { text: val }));
        }

        if (evt.key === " ") { 
            if (val.length > 1) {
                if (selectedWord !== "") {
                    let fi = words.index;
                    if (words.index != 0)
                        fi += 1;
                        
                    ta.value = ta.value.slice(0, fi) + selectedWord + " ";
                    setSelectedWord("");
                }
            }
        }
    };

    const handleButtonClick = (index: number) => {
        setFocusedIndex(index);
        setSelectedWord(words.translated[index]);
        setWords({index: 0, translated: [""]});
    };

    return (
        <>
            <textarea className="textbox"
                onChange={handleChange}
                onKeyDown={handleInput}
                placeholder=""
                ref={textAreaRef}
                rows={1}
                value={value}
                autoFocus={true}
            >
            </textarea>
            <div className="dropdown">
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