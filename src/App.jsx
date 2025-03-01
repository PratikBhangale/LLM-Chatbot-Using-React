import { useState } from "react";
import { Chat } from "./components/Chat/chat";
import { Controls } from "./components/controls/Controls";
import styles from "./App.module.css";
import { Assistant } from "./assistants/openai";
import { Loader } from "./components/Loader/Loader";

function App() {
  const [messages, setMessages] = useState([]);
  const [isloading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('openai_api_key'));
  const [showSettings, setShowSettings] = useState(!apiKey);

  // Initialize assistant with API key
  const assistant = new Assistant(apiKey || '');

  async function validateApiKey(key) {
    try {
      const response = await fetch('https://api.openai.com/v1/models', {
        headers: {
          'Authorization': `Bearer ${key}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error('Invalid API key');
      }
      
      return true;
    } catch (error) {
      console.error('API Key validation error:', error);
      return false;
    }
  }

  async function handleApiKeySubmit(e) {
    e.preventDefault();
    const key = e.target.apiKey.value.trim();
    
    if (!key.startsWith('sk-')) {
      alert('Please enter a valid OpenAI API key (starts with sk-)');
      return;
    }

    setIsLoading(true);
    const isValid = await validateApiKey(key);
    setIsLoading(false);

    if (!isValid) {
      alert('Invalid API key. Please check your key and try again.');
      return;
    }

    localStorage.setItem('openai_api_key', key);
    setApiKey(key);
    setShowSettings(false);
  }

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
      console.error('Chat Error:', error);
      addMessage({
        content: `Error: ${error.message || 'Something went wrong. Please try again!'}`,
        role: "system",
      });
      setIsLoading(false);
      setIsStreaming(false);
    }
  }

  return (
    <div className={styles.App}>
      {showSettings ? (
        <div className={styles.Settings}>
          <h2>OpenAI API Settings</h2>
          <form onSubmit={handleApiKeySubmit}>
            <input 
              type="password" 
              name="apiKey"
              placeholder="Enter OpenAI API Key"
              required
            />
            <button type="submit">Save Key</button>
          </form>
        </div>
      ) : (
        <>
          {isloading && <Loader />}
          <header className={styles.Header}>
            <img className={styles.Logo} src="chat-bot.png" alt="Chatbot Logo" />
            <h2 className={styles.Title}>AI Chatbot</h2>
            <button 
              onClick={() => setShowSettings(true)}
              className={styles.SettingsButton}
            >
              ⚙️ Settings
            </button>
          </header>
          <div className={styles.ChatContainer}>
            <Chat messages={messages} />
          </div>
          <Controls
            isDisabled={isloading || isStreaming}
            onSend={handleContentSend}
          />
        </>
      )}
    </div>
  );
}

export default App;
