import OpenAI from "openai";

export class Assistant {
  #model;
  #openai;

  constructor(apiKey, model = "gpt-4o-mini") {
    this.#model = model;
    this.#openai = new OpenAI({
      apiKey: apiKey,
      dangerouslyAllowBrowser: true,
      baseURL: 'https://api.openai.com/v1',
      defaultHeaders: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      defaultQuery: undefined,
    });
  }

  async chat(content, history) {
    try {
      const result = await this.#openai.chat.completions.create({
        model: this.#model,
        messages: [...history, { content, role: "user" }],
      });

      return result.choices[0].message.content;
    } catch (error) {
      console.error('OpenAI API Error:', error);
      throw error;
    }
  }

  async *chatStream(content, history) {
    try {
      const result = await this.#openai.chat.completions.create({
        model: this.#model,
        messages: [...history, { content, role: "user" }],
        stream: true,
      });

      for await (const chunk of result) {
        yield chunk.choices[0]?.delta?.content || "";
      }
    } catch (error) {
      console.error('OpenAI API Error:', error);
      throw error;
    }
  }
}
