import { useEffect, useState, useRef } from "react";
import styles from "./Controls.module.css";
import TextAreaAutosize from 'react-textarea-autosize'

export function Controls({ isDisabled=false, onSend}) {

    const textareaRef = useRef(null);

    useEffect(()=>{
        if(!isDisabled){
            textareaRef.current.focus();
        }
    })

    const [content, setContent] = useState("")


    function handleContentChange(event){
        setContent(event.target.value);
    }

    function handleContentSend(){
        if (content.length>0){
            onSend(content)
            setContent("")
        }
    }

    function handleEnterPress(event){
        if (event.key==="Enter" && !event.shiftKey){
            event.preventDefault()
            handleContentSend()
        }
    }


    return (
        <div className={styles.Controls}>
        <div className={styles.TextAreaContainer}>
            <TextAreaAutosize
            ref={textareaRef}
            disabled={isDisabled}
            minRows={2}
            maxRows={7}
            value={content}
            className={styles.TextArea}
            placeholder="Message AI Chatbot"
            onChange={handleContentChange}
            onKeyDown={handleEnterPress}
            />
        </div>
        <button className={styles.Button} disabled={isDisabled} onClick={handleContentSend}>
            <SendIcon />
        </button>
        </div>
    );
}

function SendIcon() {
    return (
        <svg
        xmlns="http://www.w3.org/2000/svg"
        height="24px"
        viewBox="0 -960 960 960"
        width="24px"
        fill="#5f6368"
        >
        <path d="M120-160v-240l320-80-320-80v-240l760 320-760 320Z" />
        </svg>
    );
}