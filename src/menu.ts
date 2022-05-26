export const updateMenuElement = (isMenuOpen: boolean) => {
	if(isMenuOpen){
		document.querySelector(".side-menu")?.classList.remove("side-menu__hidden");
	} else {
		document.querySelector(".side-menu")?.classList.add("side-menu__hidden");
	}
};

// this function adds event listener to toggle side menu
// also desktop will start on, mobile will start off
const initializeToggleMenuListener = (toggleMenuOpen: () => void) => {
	const toggleMenuElement = document.querySelector(".toggle-menu");
	toggleMenuElement?.addEventListener("click", () => { 
		toggleMenuOpen();
	});
	const isMobile = window.innerWidth < 768;
	if(isMobile) toggleMenuOpen(); 
};
export default initializeToggleMenuListener;