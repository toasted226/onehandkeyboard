import { useState, useRef } from "react";
import useAutosizeTextArea from "./useAutosizeTextArea";
import "./Textbox.css";

function Textbox() {
    const [value, setValue] = useState("");
    const textAreaRef = useRef<HTMLTextAreaElement>(null);

    useAutosizeTextArea(textAreaRef.current, value);

    const handleChange = (evt: React.ChangeEvent<HTMLTextAreaElement>) => {
        const val = evt.target?.value;

        setValue(val);
    };

    return (
        <>
            <textarea 
                className="textbox"
                onChange={handleChange}
                placeholder=""
                ref={textAreaRef}
                rows={50}
                value={value}>

                </textarea>
        </>
    );
}

export default Textbox;