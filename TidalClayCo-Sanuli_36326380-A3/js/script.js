(() => {
	// Configuration
	const CONFIG = {
		BREAKPOINTS: {
			MOBILE: 1023.5,
		},
		SELECTORS: {
			body: "body",
			navigation: "#cs-navigation",
			hamburger: "#cs-navigation .cs-toggle",
			menuWrapper: "#cs-ul-wrapper",
		},
		CLASSES: {
			active: "cs-active",
			menuOpen: "cs-open",
		},
	};

	// DOM Elements
	const elements = {
		body: document.querySelector(CONFIG.SELECTORS.body),
		navigation: document.querySelector(CONFIG.SELECTORS.navigation),
		hamburger: document.querySelector(CONFIG.SELECTORS.hamburger),
		menuWrapper: document.querySelector(CONFIG.SELECTORS.menuWrapper),
	};

	// Utilities
	const isMobile = () => window.matchMedia(`(max-width: ${CONFIG.BREAKPOINTS.MOBILE}px)`).matches;

	const toggleAttribute = (element, attribute, value1 = "true", value2 = "false") => {
		if (!element) return;
		const current = element.getAttribute(attribute);
		element.setAttribute(attribute, current === value1 ? value2 : value1);
	};

	const toggleInert = (element) => element && (element.inert = !element.inert);

	// Menu Management
	const menuManager = {
		toggle() {
			if (!elements.hamburger || !elements.navigation) return;

			[elements.hamburger, elements.navigation].forEach((el) => el.classList.toggle(CONFIG.CLASSES.active));
			elements.body.classList.toggle(CONFIG.CLASSES.menuOpen);
			toggleAttribute(elements.hamburger, "aria-expanded");

			// Only manage inert state on mobile devices
			if (elements.menuWrapper && isMobile()) {
				toggleInert(elements.menuWrapper);
			}
		},
	};

	// Keyboard Management
	const keyboardManager = {
		handleEscape() {
			if (!elements.navigation || !elements.hamburger) return;

			// Close hamburger menu if open
			if (elements.hamburger.classList.contains(CONFIG.CLASSES.active)) {
				menuManager.toggle();
				elements.hamburger.focus();
			}
		},
	};

	// Event Management
	const eventManager = {
		handleMobileFocus(event) {
			if (!isMobile() || !elements.navigation.classList.contains(CONFIG.CLASSES.active)) return;
			if (elements.menuWrapper.contains(event.target) || elements.hamburger.contains(event.target)) return;

			menuManager.toggle();
		},
	};

	// Initialization & Setup
	const init = {
		inertState() {
			if (!elements.menuWrapper) return;

			// On mobile, menu starts closed, so set inert=true
			// On desktop, menu is always visible, so set inert=false
			elements.menuWrapper.inert = isMobile();
		},

		eventListeners() {
			if (!elements.hamburger || !elements.navigation) return;

			// Hamburger menu
			elements.hamburger.addEventListener("click", menuManager.toggle);
			elements.navigation.addEventListener("click", (e) => {
				if (e.target === elements.navigation && elements.navigation.classList.contains(CONFIG.CLASSES.active)) {
					menuManager.toggle();
				}
			});

			// Global events
			document.addEventListener("keydown", (e) => e.key === "Escape" && keyboardManager.handleEscape());
			document.addEventListener("focusin", eventManager.handleMobileFocus);

			// Resize handling
			window.addEventListener("resize", () => {
				this.inertState();
				if (!isMobile() && elements.navigation.classList.contains(CONFIG.CLASSES.active)) {
					menuManager.toggle();
				}
			});
		},
	};

	// Initialize navigation system
	init.inertState();
	init.eventListeners();
})();
document.addEventListener("DOMContentLoaded", function () {

    // Get the contact form
    const form = document.querySelector("#contact-form");

    // Get the message area
    const message = document.querySelector("#form-message");

    // Check that the form exists
    if (form) {

        // Run this code when the user submits the form
        form.addEventListener("submit", function (event) {

            // Stop the page from refreshing
            event.preventDefault();

            // Get the values entered by the user
            const name = document.querySelector("#name").value;
            const email = document.querySelector("#email").value;
            const userMessage = document.querySelector("#message").value;

            // Check if any field is empty
            if (name === "" || email === "" || userMessage === "") {

                // Tell the user to complete all fields
                message.textContent = "Please complete all fields.";

                return;
            }

            // Check if the email contains an @ symbol
            if (!email.includes("@")) {

                // Tell the user to enter a valid email
                message.textContent = "Please enter a valid email address.";

                return;
            }

            // Show a successful message
            message.textContent = "Thank you, " + name + "! Your message has been sent.";

            // Clear the form
            form.reset();
        });

        // Clear the message when the user starts typing again
        form.addEventListener("input", function () {

            message.textContent = "";
        });
    }
});