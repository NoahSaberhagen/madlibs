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

//behind-the-scenes functions
const addWordToStoryWords = () => {
	const list = document.getElementsByClassName("story-word");
	for(let i = 0; i < list.length; i++){
		storyWords[i] = list[i].textContent;
	}
};
const removeDuplicates = (arr: string[]) => {
	return arr.filter((item, index) => arr.indexOf(item) === index);
};
const updateCounterDisplay = () => {
	counterDisplay.textContent = storyWords.length + "/5";
};

//user-facing functions
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

//
form?.addEventListener("submit", (e) => {
	//prevents page refresh
	e.preventDefault();

	//prevents user from exceeding word limit
	if(storyWords.length >= 5){
		alert("you have reached maximum words");
		return;
	}

	//Provides UI
	const input = document.querySelector(".madlib-form__input") as HTMLInputElement;

	//populates an li wrapping story word and button
	const newWrapper = document.createElement("li");

	newWrapper.style.display = "flex";
	newWrapper.style.justifyContent = "space-between";
	newWrapper.style.margin = "0";

	wordList.appendChild(newWrapper);

	//populates story word
	const newWord = document.createElement("p");
	newWord.setAttribute("class", "story-word");
	newWord.textContent = input.value;

	newWrapper.appendChild(newWord);

	//populates remove button
	const newRemoveButton = document.createElement("button");
	newRemoveButton.setAttribute("class", "remove-button yellow");
	newRemoveButton.textContent = "remove()";

	newRemoveButton.style.fontSize = "1rem";

	newWrapper.appendChild(newRemoveButton);

	//remove button functionality
	newRemoveButton.addEventListener("click", () => {
		const num = storyWords.indexOf(newWord.textContent)
		storyWords.splice(num, 1);
		console.log(storyWords);

		newRemoveButton.parentElement?.remove();
		newWord.remove();
		newRemoveButton.remove();

		updateCounterDisplay();
	});
	
	//refreshes input field
	inputField.value = "";
	inputField.focus();

	//updates storyWords
	addWordToStoryWords();
	removeDuplicates(storyWords);

	//updates counter
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







