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

    const handleInput = async (evt: React.ChangeEvent<HTMLTextAreaElement>) => {
        const val: string = evt.target?.value;

        if (val[val.length - 1] === ' ' && val.length > 1) {
            const word = await invoke("on_text_change");
            evt.target.value += word;
        }
    };

    return (
        <>
            <textarea 
                className="textbox"
                onChange={handleChange}
                onInput={handleInput}
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
