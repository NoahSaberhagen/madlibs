import OpenAI from "openai-api";

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
const openai = new OpenAI(OPENAI_API_KEY);


const form = document.querySelector(".madlib-form");
let goingToPrompt: string[] = ["HTML, CSS, Javascript"];



const main = async () => {
	const storyField: Element = document.querySelector(".story-field");
	storyField.setAttribute("style", "animation-name: none;");
	storyField.textContent = "loading...";

	const gptResponse = await openai.complete({
		engine: "text-davinci-002",
		prompt: "write a funny story using the word(s): " + goingToPrompt.join(" "),
		temperature: 0.6,
		maxTokens: 100,
		topP: 1,
		frequencyPenalty: 1,
		presencePenalty: 1
	});

	storyField.textContent = gptResponse.data.choices[0].text;
	storyField.setAttribute("style", "animation-name: fade-in;");
};

main();

form?.addEventListener("submit", (e) => {
	e.preventDefault();

	const input: string = document.querySelector(".madlib-form__input").value;
	const listOfInputs: Element = document.querySelector(".list-of-inputs");

	const newWord = document.createElement("li");

	newWord.textContent = input;
	newWord.setAttribute("class", "word-for-prompt");
	listOfInputs.appendChild(newWord);

	const wordsForPrompt = document.querySelectorAll(".word-for-prompt");
	for(let i = 0; i < wordsForPrompt.length; i++){
		const wordForPrompt: string = wordsForPrompt[i].textContent;
		goingToPrompt[i] = wordForPrompt;
	}
});


const generateStoryButton = document.querySelector(".generate-story");
generateStoryButton?.addEventListener("click", () => {
	main();
});


const clearButton = document.querySelector(".clear-list-of-inputs");
clearButton?.addEventListener("click", () => {
	const listOfInputs: Element = document.querySelector(".list-of-inputs");
	listOfInputs.textContent = undefined;
	goingToPrompt = ["HTML, CSS, Javascript"];
	main();
})







