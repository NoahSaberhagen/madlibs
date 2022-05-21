import OpenAI from "openai-api";

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
const openai = new OpenAI(OPENAI_API_KEY);


const form = document.querySelector(".madlib-form");


//array of user input words
//"HTML", "CSS", "Javascript" are the default inputs for now
let goingToPrompt: string[] = ["HTML", "CSS", "Javascript"];


//grabs response from api call using specified prompt and displays it in .story-field
const main = async () => {
	const storyField: Element = document.querySelector(".story-field");
	storyField.setAttribute("style", "animation-name: none;");
	storyField.textContent = "loading...";

	const gptResponse = await openai.complete({
		engine: "text-davinci-002",
		prompt: "write a funny story using the word(s): " + goingToPrompt.join(" "),
		temperature: 0.6,
		maxTokens: 150,
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
			story = story.slice(0, openSpanIndex + 1) + " <span>" + storySlice
		}
	}

	for(let i = 0; i < goingToPrompt.length; i++){
		const regexp = new RegExp(goingToPrompt[i], "ig");
		if(story.match(regexp)){
			const closeSpanIndex: number = story.search(regexp) + goingToPrompt[i].length - 1;
			const storySlice = story.slice(closeSpanIndex + storyStartIndex);
			story = story.slice(0, closeSpanIndex + 1) + "</span>" + storySlice
		}
	}

	storyField.innerHTML = story;
	storyField.setAttribute("style", "animation-name: fade-in;");
};

main();

//submitting form updates prompt
form?.addEventListener("submit", (e) => {
	//so the page doesn't refresh
	e.preventDefault(); 
	const input: string = document.querySelector(".madlib-form__input").value;
		
	main();
});

//reset
const reset = document.querySelector(".madlib-form__reset");
reset?.addEventListener("click", () => {
	goingToPrompt = ["HTML", "CSS", "Javascript"];
	main();
})






