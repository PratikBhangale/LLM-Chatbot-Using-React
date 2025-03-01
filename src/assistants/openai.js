
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPEN_AI_API_KEY,
  dangerouslyAllowBrowser: true,
});

export class Assistant {
  #model;
  #openai;

  constructor(apiKey, model = "gpt-4-turbo-preview") {
    this.#model = model;
    this.#openai = new OpenAI({
      apiKey: apiKey,
      dangerouslyAllowBrowser: true,
    });
  }

  async chat(content, history) {
    try {
      const result = await openai.chat.completions.create({
        model: this.#model,
        messages: [...history, { content, role: "user" }],
      });

      return result.choices[0].message.content;
    } catch (error) {
      throw error;
    }
  }

  async *chatStream(content, history) {
    try {
      const result = await openai.chat.completions.create({
        model: this.#model,
        messages: [...history, { content, role: "user" }],
        stream: true,
      });

      for await (const chunk of result) {
        yield chunk.choices[0]?.delta?.content || "";
      }
    } catch (error) {
      throw error;
    }
  }
}
