import OpenAI from "openai-api";

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
const openai = new OpenAI(OPENAI_API_KEY);

const main = async () => {
	// const words: string[] = [];
	// const word = document.querySelector(".madlib-form__input");
	// const submit = document.querySelector(".madlib-form__submit-button");
	// submit?.addEventListener("click", () => {
	// 	words.push(word);
	// });    animation-name: test;

	const gptResponse = await openai.complete({
		engine: "text-davinci-002",
		prompt: "tell me a crazy story about dinosaurs",
		temperature: 0.6,
		maxTokens: 150,
		topP: 1,
		frequencyPenalty: 1,
		presencePenalty: 1
	});

	const paragraph = document.querySelector(".test");
	paragraph.textContent = gptResponse.data.choices[0].text;
  paragraph?.setAttribute("style", "animation-name: test;");
	console.log(gptResponse.data.choices[0].text);
};

main();


