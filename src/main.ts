import OpenAI from "openai-api";

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
const openai = new OpenAI(OPENAI_API_KEY);

const main = async () => {
	const gptResponse = await openai.complete({
		engine: "text-davinci-002",
		prompt: "tell me a happy story",
		temperature: 0.6,
		max_tokens: 150,
		top_p: 1,
		frequency_penalty: 1,
		presence_penalty: 1
	});

	const paragraph = document.querySelector(".test");
	paragraph.textContent = gptResponse.data.choices[0].text;
	console.log(gptResponse.data.choices[0].text);
};

main();