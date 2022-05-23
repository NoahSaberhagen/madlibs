import OpenAI from "openai-api";

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

const openai = new OpenAI(OPENAI_API_KEY);

//global variables

const counterDisplay = document.querySelector(".counter") as HTMLParagraphElement;
const form = document.querySelector(".madlib-form");
const inputField = document.querySelector(".madlib-form__input") as HTMLInputElement;
const storyField = document.querySelector(".story-field") as HTMLParagraphElement;
const wordList = document.querySelector(".list-of-story-words") as HTMLUListElement;

let storyWords: string[] = [];
const counter = storyWords.length;

//justUXthings
inputField.focus();
storyField.style.color = "#6A9955";


//mini functions
const populateStoryWords = () => {
	const list = document.getElementsByClassName("story-input");
	for(let i = 0; i < list.length; i++){
		storyWords[i] = list[i].textContent;
	}
};
const removeStringDuplicates = (arr: string[]) => {
	return arr.filter((item, index) => arr.indexOf(item) === index);
};
const updateCounterDisplay = () => {
	counterDisplay.textContent = storyWords.length + "/5";
};

//bigger functions
//grabs response from api call using specified prompt and displays it in .story-field
const main = async () => {
	storyField.setAttribute("style", "animation-name: none;");
	storyField.style.color = "#6A9955";
	storyField.textContent = "//loading...";
	
	const gptResponse = await openai.complete({
		engine: "text-davinci-002",
		prompt: "tell me a funny story including each of the following words:" + storyWords.join(" "),
		temperature: 0.6,
		maxTokens: 150,
		topP: 1,
		frequencyPenalty: 1,
		presencePenalty: 1
	});

	const story: string = gptResponse.data.choices[0].text;
	story.trimStart();

	storyField.style.color = "#D4D4D4";

	//DOM manipulation makes me feel like a mad scientist
	const storyRegExp = new RegExp(`(${storyWords.join("|")})`, "ig");
	
	const storyHTML = story.replace(storyRegExp, "<span class=\"orange placeholder-class\">$&</span>");

	storyField.style.fontSize = "2rem";
	storyField.innerHTML = storyHTML;
	//this is in case I change my mind and want to restyle the animations:
	//storyField.setAttribute("style", "animation-name: fade-in;");
};

//submitting the form updates the prompt going to OpenAI
form?.addEventListener("submit", (e) => {
	//so the page doesn't refresh
	e.preventDefault();

	if(storyWords.length >= 5){
		alert("you have reached maximum words");
		return;
	}

	const input = document.querySelector(".madlib-form__input") as HTMLInputElement;
	
	//populates html with an li wrapper element for story word and button
	const newWrapper = document.createElement("li");
	newWrapper.style.display = "flex";
	newWrapper.style.justifyContent = "space-evenly";

	wordList.appendChild(newWrapper);

	//populates html with story words
	const newWord = document.createElement("p");
	newWord.textContent = input.value;
	newWord.setAttribute("class", "story-input");
	
	newWrapper.appendChild(newWord);

	//populates html with remove buttons for each story word
	const newRemoveButton = document.createElement("button");
	newRemoveButton.setAttribute("class", "yellow");
	newRemoveButton.style.fontSize = "1rem";
	newRemoveButton.textContent = "remove()";

	newWrapper.appendChild(newRemoveButton);
	
	inputField.value = "";
	inputField.focus();

	populateStoryWords();
	removeStringDuplicates(storyWords);
	updateCounterDisplay();
});

//generate
const generate = document.querySelector(".madlib-form__generate");
generate?.addEventListener("click", () => {
	main();

	inputField.focus();
});

//clear
const clear = document.querySelector(".madlib-form__clear");
clear?.addEventListener("click", () => {
	storyWords = [];
	
	wordList.innerHTML = "";

	storyField.style.color = "#6A9955";
	storyField.innerHTML = `//add some words using the input field over there --><br>
	//then, click generate()`;

	updateCounterDisplay();
	
	inputField.focus();
});






