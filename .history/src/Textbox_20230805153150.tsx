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

    const textAreaRef = useRef<HTMLTextAreaElement>(null);

    useAutosizeTextArea(textAreaRef.current, value);

    const handleChange = (evt: React.ChangeEvent<HTMLTextAreaElement>) => {
        const val = evt.target?.value;

        setValue(val);
    };

    const handleInput = async (evt: React.KeyboardEvent<HTMLTextAreaElement>) => {
        const ta = textAreaRef.current!;
        let val = ta.value;

        if (evt.key === " ") { 
            if (val.length > 1) {
                if (selectedWord == "") {
                    setWords(await invoke("on_text_change", { text: val }));
                }
                else {
                    let fi = words.index;
                    if (words.index != 0)
                        fi += 1;
                        
                    ta.value = ta.value.slice(0, fi) + selectedWord + " ";
                } 
            }
        }
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
                autoFocus={true}>
            </textarea>
            <div className="dropdown">
                {words.translated.map((word, index) => {
                    return
                    <button>
                        {}
                    </button>
                })}
            </div>
        </>
    );
}

export default Textbox;
