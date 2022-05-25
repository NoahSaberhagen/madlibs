import OpenAI from "openai-api";

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

const openai = new OpenAI(OPENAI_API_KEY);

//global variables-----------------------------------------------------------------------------------------
const counterDisplay = document.querySelector(".counter") as HTMLParagraphElement;
const form = document.querySelector(".madlib-form");
const inputField = document.querySelector(".madlib-form__input") as HTMLInputElement;
const storyField = document.querySelector(".story-field") as HTMLParagraphElement;
const storyWordsField = document.querySelector(".list-of-story-words") as HTMLUListElement;
const storyGenre: string = 
	document.querySelector(".genre-select") === null ? "" : document.querySelector(".genre-select").value
let storyWords: string[] = [];

// loads UX-----------------------------------------------------------------------------------------------
inputField.focus();
storyField.style.color = "#6A9955";

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
	counterDisplay.textContent = storyWords.length + "/5";
};

// user-facing functions--------------------------------------------------------------------------------
// TODO rename main
const main = async () => {
	storyField.setAttribute("style", "animation-name: none;");
	storyField.style.color = "#6A9955";
	storyField.textContent = "//loading...";
	
	const gptResponse = await openai.complete({
		engine: "text-davinci-002",
		prompt: "tell me a" + storyGenre + " story using all of these words:" + storyWords.join(" "),
		temperature: 0.6,
		maxTokens: 150,
		topP: 1,
		frequencyPenalty: 1,
		presencePenalty: 1
	});

	const story: string = gptResponse.data.choices[0].text;
	story.trimStart();

	// UI
	storyField.style.color = "#D4D4D4";

	const storyWordsRegExp = storyWords.map((storyWord) => {
		let newStoryWord = storyWord;
		if(storyWord[storyWord.length - 1].toLowerCase() === "s"){
			newStoryWord = storyWord.slice(0, -1);
		}
		return `( ${newStoryWord}( |'s|s))\\W*`;
	});
	console.log(storyWords);

	const storyRegExp = new RegExp(`(${storyWordsRegExp.join("|")})`, "ig");

	console.log(storyRegExp);

	const storyHTML = story.replace(storyRegExp, "<span class=\"orange fade-in-slowly\">$&</span>");

	storyField.style.fontSize = "2rem";
	storyField.innerHTML = storyHTML;
};

form?.addEventListener("submit", (e) => {
	//prevents page refresh
	e.preventDefault();

	//prevents user from exceeding word limit
	if(storyWords.length >= 5){
		alert("you have reached maximum words");
		return;
	}

	const input = document.querySelector(".madlib-form__input") as HTMLInputElement;
	
	//populates an li wrapper for story word and button
	const newWrapper = document.createElement("li");

	newWrapper.style.display = "flex";
	newWrapper.style.justifyContent = "space-between";
	newWrapper.style.margin = "0";

	storyWordsField.appendChild(newWrapper);

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

const generate = document.querySelector(".madlib-form__generate");
generate?.addEventListener("click", () => {
	storyWords = removeDuplicates(storyWords);
	main();
	inputField.focus();
});

const clear = document.querySelector(".madlib-form__clear");
clear?.addEventListener("click", () => {
	storyWords = [];
	
	storyWordsField.innerHTML = "";

	storyField.style.color = "#6A9955";
	storyField.innerHTML = `//add some words using the input field over there --><br>
	//then, click generate()`;

	updateCounterDisplay();
	
	inputField.value = "";
	inputField.focus();
});







