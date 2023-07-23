import "./Textbox.css";

function Textbox() {
    

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