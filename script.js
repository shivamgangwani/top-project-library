console.log("Script loaded");

let myLibrary = [];

function Book(title, author, pages, read) {
	this.title = title;
	this.author = author;
	this.pages = pages;
	this.read = read;
}

myLibrary.push(
	new Book("Book1", "Author1", 200, false),
	new Book("Book2", "Author1", 250, true),
	new Book("Book3", "Author1", 300, false),
	new Book("Book4", "Author1", 180, false),
);

function addBookToLibrary() {
	// do stuff here
}

function createBookCard(book) {
	let card = document.createElement("div");
	card.classList.add("book-card");

	let cardImgContainer = document.createElement("div");
	cardImgContainer.classList.add("book-card-image");
	let cardImg = document.createElement("img");
	cardImg.setAttribute("src", "assets/book.svg");
	cardImgContainer.appendChild(cardImg);

	let cardInfoContainer = document.createElement("div");
	cardInfoContainer.classList.add("book-card-info");
	let cardInfoTitle = document.createElement("h1");
	cardInfoTitle.textContent = `${book.title}`;

	let cardInfoAuthor = document.createElement("p");
	cardInfoAuthor.classList.add("book-card-info-author");
	cardInfoAuthor.textContent = `by ${book.author}`;

	let cardInfoPages = document.createElement("p");
	cardInfoPages.classList.add("book-card-info-pages");
	cardInfoPages.textContent = `${book.pages} pages`;
	cardInfoContainer.appendChild(cardInfoTitle);
	cardInfoContainer.appendChild(cardInfoAuthor);
	cardInfoContainer.appendChild(cardInfoPages);


	let cardControls = document.createElement("div");
	cardControls.classList.add("book-card-controls");
	
	let cardControlsDelete = document.createElement("div");
	cardControlsDelete.classList.add("book-delete-btn");
	let cardControlsDeleteIcon = document.createElement("img");
	cardControlsDeleteIcon.setAttribute("src", "assets/delete.svg");
	cardControlsDelete.appendChild(cardControlsDeleteIcon);
	cardControls.appendChild(cardControlsDelete);

	let cardControlsToggleRead = document.createElement("div");
	cardControlsToggleRead.classList.add("book-toggle-read-btn");
	let cardControlsToggleReadIcon = document.createElement("img");
	let tmpSrc = book.read ? "assets/checkbox-ticked.svg" : "assets/checkbox-blank.svg"
	let tmpClass = book.read ? "book-read" : "book-not-read";
	cardControlsToggleRead.classList.add(tmpClass);
	cardControlsToggleReadIcon.setAttribute("src", tmpSrc);
	cardControlsToggleRead.appendChild(cardControlsToggleReadIcon);
	cardControls.appendChild(cardControlsToggleRead);

	card.appendChild(cardImgContainer);
	card.appendChild(cardInfoContainer);
	card.appendChild(cardControls);
	return card;
}

const bookDisplay = document.querySelector("div#books");
myLibrary.forEach((book) => bookDisplay.appendChild(createBookCard(book)));