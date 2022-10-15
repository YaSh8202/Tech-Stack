import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export const getResponse = (prompt) => {
  return openai
    .createCompletion({
      model: "text-davinci-002",
      prompt: prompt,
      temperature: 0.7,
      max_tokens: 256,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    })
    .then((res) => res)
    .then((res) => {
      console.log(res.data.choices[0].text);
      return res.data.choices[0].text;
    });
};
