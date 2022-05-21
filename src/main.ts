import OpenAI from "openai-api";

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
const openai = new OpenAI(OPENAI_API_KEY);


const form = document.querySelector(".madlib-form");


//array of user input words
//"HTML", "CSS", "Javascript" are the default inputs for now
let storyWords: string[] = ["HTML", "CSS", "Javascript"];


//updates ul to default
//TODO: reset counter
const regenerateList = () => {
	const wordList = document.querySelector(".list-of-inputs") as HTMLUListElement;
	wordList.innerHTML = "";
	for(const word of storyWords){
		const wordElement = document.createElement("li");
		wordElement.textContent = word;
		wordList?.appendChild(wordElement);
	}
};

//grabs response from api call using specified prompt and displays it in .story-field
const main = async () => {
	const storyField = document.querySelector(".story-field") as HTMLParagraphElement;
	storyField.setAttribute("style", "animation-name: none;");
	storyField.textContent = "loading...";
	regenerateList();

	const gptResponse = await openai.complete({
		engine: "text-davinci-002",
		prompt: "respond with a difficult question to these words:" + storyWords.join(" "),
		temperature: 0.6,
		maxTokens: 150,
		topP: 1,
		frequencyPenalty: 1,
		presencePenalty: 1
	});

	const story: string = gptResponse.data.choices[0].text;
	story.trimStart();
	
	//DOM manipulation makes me feel like a mad scientist
	//*     /(HTML|CSS|JavaScript)/ig
	const storyRegExp = new RegExp(`(${storyWords.join("|")})`, "ig");
	const storyHTML = story.replace(storyRegExp, `<span class="orange">$&</span>`);
	console.log(storyRegExp);
	storyField.innerHTML = storyHTML;
	storyField.setAttribute("style", "animation-name: fade-in;");
};

main();

//submitting form updates prompt
form?.addEventListener("submit", (e) => {
	//so the page doesn't refresh
	e.preventDefault();
	storyWords = [];

	const input = document.querySelector(".madlib-form__input") as HTMLInputElement;
	const newWord = document.createElement("li");
	newWord.textContent = input.value;
	newWord.setAttribute("class", "story-input");

	const listOfInputsWrapper = document.querySelector(".list-of-inputs") as HTMLUListElement;
	listOfInputsWrapper.appendChild(newWord);

	const listOfInputs = document.querySelectorAll(".story-input");
	// const listOfInputsStr = listOfInputs.toString();
	// if(listOfInputsStr.match(input)){
	// 	alert("No duplicates!! Angry face");
	// 	return
	// }

	listOfInputs.forEach(input => {
		const preppedInput: string = input.textContent;
		storyWords.push(preppedInput);
	});

	const counter: Element = document.querySelector(".counter");
	counter.textContent = listOfInputs.length + "/10"
});

//clear
const clear = document.querySelector(".madlib-form__clear");
clear?.addEventListener("click", () => {
	storyWords = ["HTML", "CSS", "Javascript"];
	main();
});

//generate
const generate = document.querySelector(".madlib-form__generate");
generate?.addEventListener("click", () => {
	main();
});




