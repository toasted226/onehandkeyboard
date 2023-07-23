import { useState, useRef } from React;
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
                placeholder="What did you like or dislike?"
                ref={textAreaRef}
                rows={1}
                value={value}>

                </textarea>
        </>
    );
}

export default Textbox;