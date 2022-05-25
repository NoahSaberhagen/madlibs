// BUGS
// story-display doesnt highlight story words if they are followed by a period

import OpenAI from "openai-api";

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

const openai = new OpenAI(OPENAI_API_KEY);

//global variables-----------------------------------------------------------------------------------------
const counterDisplay = document.querySelector(".counter") as HTMLParagraphElement;
const form = document.querySelector(".madlib-form");
const inputField = document.querySelector(".madlib-form__input") as HTMLInputElement;
const storyDisplay = document.querySelector(".story-display") as HTMLParagraphElement;
const storyWordsDisplay = document.querySelector(".story-words-display") as HTMLUListElement;
const storyGenre: string =  document.querySelector(".genre-select").value;
const storyStyle: string = document.querySelector(".style-select").value;
let storyWords: string[] = [];

// loads UX-----------------------------------------------------------------------------------------------
inputField.focus();
storyDisplay.style.color = "#6A9955";

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
const updateCounterDisplay = () => {
	counterDisplay.textContent = storyWords.length + "/3";
};

// user-facing functions--------------------------------------------------------------------------------
const updateStoryDisplay = async () => {
	// Phase 1. displays "loading..." while retreives OpenAI response using .prompt-------------
	storyDisplay.setAttribute("style", "animation-name: none;");
	storyDisplay.style.color = "#6A9955";
	storyDisplay.textContent = "//loading...";
	
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
	storyDisplay.style.color = "#D4D4D4";
	storyDisplay.style.fontSize = "2rem";

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
	storyDisplay.innerHTML = storyHTML;
};

form?.addEventListener("submit", (e) => {
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

	storyWordsDisplay.appendChild(newWrapper);

	//story word
	const newWord = document.createElement("p");
	newWord.setAttribute("class", "story-word");
	newWord.textContent = input.value;

	newWrapper.appendChild(newWord);

	//remove button
	const newRemoveButton = document.createElement("button");
	newRemoveButton.setAttribute("class", "remove-button yellow");
	newRemoveButton.textContent = "remove()";

	newRemoveButton.style.fontSize = "1rem";

	newWrapper.appendChild(newRemoveButton);

	//remove button functionality
	newRemoveButton.addEventListener("click", () => {
		const idx = storyWords.indexOf(newWord.textContent as string);
		storyWords.splice(idx, 1);
		console.log(storyWords);

		newRemoveButton.parentElement?.remove();
		newWord.remove();
		newRemoveButton.remove();

		updateCounterDisplay();
	});
	
	//refreshes input field
	inputField.value = "";
	inputField.focus();

	addWordToStoryWords();

	updateCounterDisplay();

	console.log(storyWords);
});

const generateStory = document.querySelector(".madlib-form__generate-story");
generateStory?.addEventListener("click", () => {
	storyWords = removeDuplicates(storyWords);
	updateStoryDisplay();
	inputField.focus();
});

const clearStoryWords = document.querySelector(".madlib-form__clear-story-words");
clearStoryWords?.addEventListener("click", () => {
	storyWords = [];
	
	storyWordsDisplay.innerHTML = "";

	storyDisplay.style.color = "#6A9955";
	storyDisplay.innerHTML = `//add some words using the input field over there --><br>
	//then, click generateStory()`;

	updateCounterDisplay();
	
	inputField.value = "";
	inputField.focus();
});







