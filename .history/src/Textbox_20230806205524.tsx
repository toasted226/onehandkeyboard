import { useState, useRef } from "react";
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
                    replaceWord(focusedIndex, false);
                }
            }
        } else if (evt.key === "Backspace") {
            setWords({index: -1, translated: [""]});
        } else if (evt.key === "Tab") {
            if (!evt.shiftKey) {
                nextIndex();
                dropdownRef.current?.focus();
            } else {
                callBackspace();
            }
        }
        
        if (evt.altKey && /^[a-zA-Z',.;]$/.test(evt.key)) {
            // TODO: Call rust code that will convert the character to corresponding punctuation
            const symbol = await invoke("letter_to_symbol", { letter: evt.key });
            if (symbol !== null) {
                setTextAreaValue(textAreaValue + symbol);
            }
        }
    };

    const handleButtonClick = (index: number) => {
        replaceWord(index, true);
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
        event.currentTarget.focus();
        event.preventDefault();
        switch (event.key) {
            case "Tab":
                if (!event.shiftKey) {
                    event.currentTarget.focus();
                    nextIndex();
                } else {
                    callBackspace();
                }
                break;
            case " ":
                event.currentTarget.focus();
                replaceWord(focusedIndex, true);
                break;
        }
    };

    const callBackspace = () => {
        setTextAreaValue(textAreaValue.slice(0, -1));
        setWords({index: -1, translated: [""]});
    };

    const nextIndex = () => {
        const nextIndex = focusedIndex + 1;
        setFocusedIndex(nextIndex >= words.translated.length ? 0 : nextIndex);
    };

    const replaceWord = (index: number, withSpace: boolean) => {
        let fi = words.index;
        if (words.index != 0)
            fi += 1;
        
        let value = "";
        
        if (withSpace)
            value = textAreaValue.slice(0, fi) + words.translated[index] + " ";
        else
            value = textAreaValue.slice(0, fi) + words.translated[index];
        setTextAreaValue(value);

        setWords({index: -1, translated: [""]});
        textAreaRef.current?.focus();
        setFocusedIndex(0);
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
                        style={{background: focusedIndex === index ? "#EFE84A" : "#1f1f1f",
                                color: focusedIndex === index ? "black" : "white"}}
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
