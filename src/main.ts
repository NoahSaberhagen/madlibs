import OpenAI from "openai-api";

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
const openai = new OpenAI(OPENAI_API_KEY);

const main = async () => {
	const storyField: Element = document.querySelector(".story-field");
	storyField.setAttribute("style", "animation-name: none;");
	storyField.textContent = "loading...";

	const gptResponse = await openai.complete({
		engine: "text-davinci-002",
		prompt: "tell me a funny story using these words: ",
		temperature: 0.6,
		maxTokens: 150,
		topP: 1,
		frequencyPenalty: 1,
		presencePenalty: 1
	});

	storyField.textContent = gptResponse.data.choices[0].text;
	storyField.setAttribute("style", "animation-name: fade-in;");
};

main();



const form = document.querySelector(".madlib-form");

const wordsForStory: string[] = [];


form?.addEventListener("submit", (e) => {
	e.preventDefault();

	const newWord = document.createElement("li");
	
	const input: string = document.querySelector(".madlib-form__input").value;
	const listOfWords: Element = document.querySelector(".list-of-words");


	newWord.textContent = input;
	newWord.setAttribute("class", "word-for-story");
	listOfWords.appendChild(newWord);

	const x = document.querySelectorAll(".word-for-story");
	for(let i = 0; i < x.length; i++){
		const y = x[i].textContent;
		console.log(y);
	}

	main();
});







