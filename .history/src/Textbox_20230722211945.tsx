import { useState, useRef } from "react";
import useAutosizeTextArea from "./useAutosizeTextArea";
import "./Textbox.css";
import { invoke } from "@tauri-apps/api";

function Textbox() {
    const [value, setValue] = useState("");
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
            console.log("yeet");
            if (val.length > 1) {
                const word: {index: number, word: string} = await invoke("on_text_change", { text: val });

                let fi = word.index;
                if (word.index != 0)
                    fi += 1;
                    
                ta.value = ta.value.slice(0, fi) + word.word + " ";
            }
        }
    };

    return (
        <>
            <textarea 
                className="textbox"
                onChange={handleChange}
                onKeyDown={handleInput}
                placeholder=""
                ref={textAreaRef}
                rows={1}
                value={value}
                autoFocus={true}>
                </textarea>
        </>
    );
}

export default Textbox;
