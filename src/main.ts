import OpenAI from "openai-api";

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

const openai = new OpenAI(OPENAI_API_KEY);

//global variables
const counterDisplay = document.querySelector(".counter") as HTMLParagraphElement;
const form = document.querySelector(".madlib-form");
const inputField = document.querySelector(".madlib-form__input") as HTMLInputElement;
const storyField = document.querySelector(".story-field") as HTMLParagraphElement;
const storyWordsField = document.querySelector(".list-of-story-words") as HTMLUListElement;

let storyWords: string[] = [];

//behind-the-scenes functions
const addWordToStoryWords = () => {
	const words = document.getElementsByClassName("story-word");
	for(let i = 0; i < words.length; i++){
		storyWords[i] = words[i].textContent as string;
	}
};
const removeDuplicates = (arr: string[]) => {
	return arr.filter((item, index) => arr.indexOf(item) === index);
};
const updateCounterDisplay = () => {
	counterDisplay.textContent = storyWords.length + "/5";
};

//loads UX
inputField.focus();
storyField.style.color = "#6A9955";

//user-facing functions
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
	removeDuplicates(storyWords);
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
	
	storyWordsField.innerHTML = "";

	storyField.style.color = "#6A9955";
	storyField.innerHTML = `//add some words using the input field over there --><br>
	//then, click generate()`;

	updateCounterDisplay();
	
	inputField.value = "";
	inputField.focus();
});







