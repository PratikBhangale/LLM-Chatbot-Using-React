import { useState } from "react";
import { Chat } from "./components/Chat/chat";
import { Controls } from "./components/controls/Controls";
import styles from "./App.module.css";
import { Assistant } from "./assistants/openai";
import { Loader } from "./components/Loader/Loader";





function App() {

  const assistant = new Assistant();
  const [messages, setMessages] = useState([]);
  const [isloading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);


  function updateLastMessageContent(content) {
    setMessages((prevMessages) =>
      prevMessages.map((message, index) =>
        index === prevMessages.length - 1
          ? { ...message, content: `${message.content}${content}` }
          : message
      )
    );
  }


  function addMessage(message) {
    setMessages((prevMessages) => [...prevMessages, message]);
  }


  function addMessage(message) {
    setMessages((prevMessages) => [...prevMessages, message]);
  }

  async function handleContentSend(content) {
    addMessage({ content, role: "user" });
    setIsLoading(true);
    try {
      const result = await assistant.chatStream(content, messages);
      let isFirstChunk = false;

      for await (const chunk of result) {
        if (!isFirstChunk) {
          isFirstChunk = true;
          addMessage({ content: "", role: "assistant" });
          setIsLoading(false);
          setIsStreaming(true);
        }

        updateLastMessageContent(chunk);
      }

      setIsStreaming(false);
    } catch (error) {
      addMessage({
        content: "Sorry, I couldn't process your request. Please try again!",
        role: "system",
      });
      setIsLoading(false);
      setIsStreaming(false);
    }
  }

  return (
    <div className={styles.App}>
      {isloading && <Loader />}
      <header className={styles.Header}>
        <img className={styles.Logo} src="public\chat-bot.png" />
        <h2 className={styles.Title}>AI Chatbot</h2>
      </header>
      <div className={styles.ChatContainer}>
        <Chat messages={messages} />
      </div>
      <Controls
        isDisabled={isloading || isStreaming}
        onSend={handleContentSend}
      />
    </div>
  );
}


export default App;
