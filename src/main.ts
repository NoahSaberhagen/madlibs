import OpenAI from "openai-api";

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

const openai = new OpenAI(OPENAI_API_KEY);



//global variables
const counter = document.querySelector(".counter") as HTMLParagraphElement;
const form = document.querySelector(".madlib-form");
const inputField = document.querySelector(".madlib-form__input") as HTMLInputElement;
const storyField = document.querySelector(".story-field") as HTMLParagraphElement;
let storyWords: string[] = [];
const wordList = document.querySelector(".list-of-story-words") as HTMLUListElement;

//important functions
inputField.focus();


//populates storyWords[]
//this is wrong
const populateStoryWords = () => {
	const list = document.getElementsByClassName("story-input");
	for(let i = 0; i < list.length; i++){
		storyWords[i] = list[i].textContent;
	}
};

//self-explanatory
const removeStringDuplicates = (arr: string[]) => {
	return arr.filter((item, index) => arr.indexOf(item) === index);
}; 

//grabs response from api call using specified prompt and displays it in .story-field
const main = async () => {
	storyField.setAttribute("style", "animation-name: none;");
	storyField.textContent = "loading...";
	
	const gptResponse = await openai.complete({
		engine: "text-davinci-002",
		prompt: "tell me a funny story including these words:" + storyWords.join(" "),
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
	
	const storyHTML = story.replace(storyRegExp, "<span class=\"orange\">$&</span>");

	storyField.innerHTML = storyHTML;
	storyField.setAttribute("style", "animation-name: fade-in;");
};

//submitting form updates prompt
form?.addEventListener("submit", (e) => {
	//so the page doesn't refresh
	e.preventDefault();

	const input = document.querySelector(".madlib-form__input") as HTMLInputElement;
	
	const newWord = document.createElement("li");
	newWord.textContent = input.value;
	newWord.setAttribute("class", "story-input");
	
	wordList.appendChild(newWord);
	
	inputField.value = "";
	inputField.focus();
	
	populateStoryWords();
	console.log(storyWords);
});

//clear
const clear = document.querySelector(".madlib-form__clear");
clear?.addEventListener("click", () => {
	storyWords = [];
	
	wordList.innerHTML = "";
	
	storyField.textContent = "enter words ---->";
	
	inputField.focus();
});

//generate
const generate = document.querySelector(".madlib-form__generate");
generate?.addEventListener("click", () => {
	main();

	inputField.focus();
});




