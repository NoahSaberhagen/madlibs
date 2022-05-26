// BUGS:
// 1. story-display doesnt highlight story words if they are followed by . or -

import OpenAI from "openai-api";
import initializeToggleMenuListener, { updateMenuElement } from "./menu";

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

const openai = new OpenAI(OPENAI_API_KEY);

// global variables-----------------------------------------------------------------------------------------
const counterDisplayHTML = document.querySelector(".story-words-counter") as HTMLParagraphElement;
const formHTML = document.querySelector(".madlib-form");
const inputFieldHTML = document.querySelector(".madlib-form__input") as HTMLInputElement;
const storyDisplayHTML = document.querySelector(".story-display") as HTMLParagraphElement;
const storyWordsListHTML = document.querySelector(".story-words-list") as HTMLUListElement;


// application state---------------------------------------------------------------------------------------
let isMenuOpen = true;
let storyWords: string[] = [];

// state reducers------------------------------------------------------------------------------------------
const toggleMenuOpen = () => {
	isMenuOpen = !isMenuOpen;
	updateMenuElement(isMenuOpen);
};

// loads UX-----------------------------------------------------------------------------------------------
inputFieldHTML.focus();
storyDisplayHTML.style.color = "#6A9955";
initializeToggleMenuListener(toggleMenuOpen);

// behind-the-scenes functions----------------------------------------------------------------------------
const addWordToStoryWords = () => {
	const storyWordElements = document.getElementsByClassName("story-word");
	for(let i = 0; i < storyWordElements.length; i++){
		storyWords[i] = storyWordElements[i].textContent as string;
	}
};
const removeDuplicates = (arr: string[]) => {
	return Array.from(new Set(arr));
};
const updateCounterDisplayHTML = () => {
	counterDisplayHTML.textContent = storyWords.length + "/3";
};


// user-facing functions--------------------------------------------------------------------------------
const updateStoryDisplayHTML = async () => {
	// Phase 1. displays "loading..." while retreives OpenAI response using .prompt-------------
	storyDisplayHTML.setAttribute("style", "animation-name: none;");
	storyDisplayHTML.style.color = "#6A9955";
	storyDisplayHTML.textContent = "//loading...";
	
	const gptResponse = await openai.complete({
		engine: "text-davinci-002",
		prompt: "write a story using these words:" + storyWords.join(" "),
		temperature: 0.6,
		maxTokens: 200,
		topP: 1,
		frequencyPenalty: 1,
		presencePenalty: 1
	});

	const story: string = gptResponse.data.choices[0].text;
	story.trimStart();

	// Phase 2: displays story in white text with orange highlighted story words-------------
	storyDisplayHTML.style.color = "#D4D4D4";
	storyDisplayHTML.style.fontSize = "1.8rem";

	// simplifies story words to singular in case the user inputs a plural word
	// creates a single RegExp for all story words
	const storyWordsRegExpArr = storyWords.map((storyWord) => {
		let newStoryWord = storyWord;
		if(storyWord[storyWord.length - 1].toLowerCase() === "s"){
			newStoryWord = storyWord.slice(0, -1);
		}
		return `( ${newStoryWord}( |'s|s))\\W*`;
	});

	const storyRegExp = new RegExp(`(${storyWordsRegExpArr.join("|")})`, "ig");

	const storyHTML = story.replace(storyRegExp, "<span class=\"orange fade-in-slowly\">$&</span>");
	storyDisplayHTML.innerHTML = storyHTML;
};

formHTML?.addEventListener("submit", (e) => {
	e.preventDefault();

	//prevents user from exceeding word limit
	if(storyWords.length >= 3){
		alert("you have reached maximum words");
		return;
	}

	const input = document.querySelector(".madlib-form__input") as HTMLInputElement;
	
	//populates an li wrapper for story word and button
	const newWrapper = document.createElement("li");

	newWrapper.style.display = "flex";
	newWrapper.style.justifyContent = "space-between";
	newWrapper.style.margin = "0";

	storyWordsListHTML.appendChild(newWrapper);

	//story word
	const newWord = document.createElement("p");
	newWord.setAttribute("class", "story-word");
	newWord.textContent = input.value;

	newWrapper.appendChild(newWord);

	//remove button
	const newRemoveButton = document.createElement("button");
	newRemoveButton.setAttribute("class", "remove-button blue");
	newRemoveButton.innerHTML = "remove<span class=\"white\">()</span>";

	newRemoveButton.style.fontSize = "1rem";

	newWrapper.appendChild(newRemoveButton);

	//remove button functionality
	newRemoveButton.addEventListener("click", () => {
		const idx = storyWords.indexOf(newWord.textContent as string);
		storyWords.splice(idx, 1);

		newRemoveButton.parentElement?.remove();
		newWord.remove();
		newRemoveButton.remove();

		updateCounterDisplayHTML();
	});
	
	//refreshes input field
	inputFieldHTML.value = "";
	inputFieldHTML.focus();

	addWordToStoryWords();
	updateCounterDisplayHTML();
});

const generateStory = document.querySelector(".madlib-form__generate-story");
generateStory?.addEventListener("click", () => {
	storyWords = removeDuplicates(storyWords);
	updateStoryDisplayHTML();

});

const clearStoryWords = document.querySelector(".madlib-form__clear-story-words");
clearStoryWords?.addEventListener("click", () => {
	storyWords = [];
	
	storyWordsListHTML.innerHTML = "";

	storyDisplayHTML.style.color = "#6A9955";
	storyDisplayHTML.innerHTML = `//add some words using the input field over there --><br>
	//then, click generateStory()`;

	updateCounterDisplayHTML();
	
	inputFieldHTML.value = "";
});









