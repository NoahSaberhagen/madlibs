import OpenAI from "openai-api";

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
const openai = new OpenAI(OPENAI_API_KEY);


const form = document.querySelector(".madlib-form");

const goingToPrompt: string[] = ["HTML", "CSS", "Javascript"];


//grabs response from api call using specified prompt and displays it in .story-field
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

	let story: string = gptResponse.data.choices[0].text;

	//DOM manipulation makes me feel like a mad scientist
	//*for some reason, story[0,2] are always blank spaces. Deduced using console.log. 
	const storyStartIndex: number = 2;

	for(let i = 0; i < goingToPrompt.length; i++){
		const regexp = new RegExp(goingToPrompt[i], "ig");
		if(story.match(regexp)){
			const openSpanIndex: number = story.search(regexp) - storyStartIndex;
			const storySlice = story.slice(openSpanIndex + storyStartIndex);
			console.log(storySlice);
			story = story.slice(0, openSpanIndex + 1) + " <span>" + storySlice
		}
	}



	storyField.textContent = story;
	storyField.setAttribute("style", "animation-name: fade-in;");
};

main();

//submitting form updates prompt
form?.addEventListener("submit", (e) => {
	//so the page doesn't refresh
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

//refreshes the .story-field
const generateStoryButton = document.querySelector(".generate-story");
generateStoryButton?.addEventListener("click", () => {
	main();
});






