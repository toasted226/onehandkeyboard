import { useState, useRef, useEffect } from "react";
import useAutosizeTextArea from "./useAutosizeTextArea";
import "./Textbox.css";
import { invoke } from "@tauri-apps/api";

function Textbox() {
    const [textAreaValue, setTextAreaValue] = useState("");
    const [words, setWords] = useState({index: -1, translated: [""]});
    const [focusedIndex, setFocusedIndex] = useState(0);

    const textAreaRef = useRef<HTMLTextAreaElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

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
                if (words.index === -1) {
                    setWords(await invoke("on_text_change", { text: textAreaValue }));
                } else {
                    let fi = words.index;
                    if (words.index != 0)
                        fi += 1;
                        
                    let value = textAreaValue.slice(0, fi) + words.translated[focusedIndex];
                    setTextAreaValue(value);

                    setWords({index: -1, translated: [""]});
                    textAreaRef.current?.focus();
                    setFocusedIndex(0);
                }
            }
        }

        if (evt.key === "Backspace") {
            setWords({index: -1, translated: [""]});
        }

        if (evt.key === "Tab") {
            const nextIndex = focusedIndex + 1;
            setFocusedIndex(nextIndex >= words.translated.length ? 0 : nextIndex);
            dropdownRef.current?.focus();
        }
    };

    const handleButtonClick = (index: number) => {
        setFocusedIndex(index);

        let fi = words.index;
        if (words.index != 0)
            fi += 1;
            
        let value = textAreaValue.slice(0, fi) + words.translated[index] + " ";
        setTextAreaValue(value);

        setWords({index: -1, translated: [""]});
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
        event.currentTarget.focus();
        event.preventDefault();
        switch (event.key) {
            case "Tab":
                event.currentTarget.focus();
                const nextIndex = focusedIndex + 1;
                setFocusedIndex(nextIndex >= words.translated.length ? 0 : nextIndex);
                break;
            case " ":
                event.currentTarget.focus();
                let fi = words.index;
                if (words.index != 0)
                    fi += 1;
                    
                let value = textAreaValue.slice(0, fi) + words.translated[focusedIndex] + " ";
                setTextAreaValue(value);

                setWords({index: -1, translated: [""]});
                textAreaRef.current?.focus();
                setFocusedIndex(0);
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
            {words.index !== -1 ? (
            <div className="dropdown"
                onKeyDown={handleKeyDown}
                ref={dropdownRef}>
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
            ) : (<></>)}
        </>
    );
}

export default Textbox;
