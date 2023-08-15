console.log("Script loaded");

let myLibrary = [];
let bookIdxCount = 0;
const bookDisplay = document.querySelector("div#books");
const alertBox = document.querySelector("div#alert-box");

function Book(title, author, pages, read) {
	this.idx = bookIdxCount;
	this.title = title;
	this.author = author;
	this.pages = pages;
	this.read = read;
	bookIdxCount++;
}

function getBookArrayIdx(idx) {
	// For a given book ID, find the corresponding array index in myLibrary
	for(let i=0; i<myLibrary.length; i++) {
		if(myLibrary[i].idx == idx) return i;
	}
}


myLibrary.push(
	new Book("Book1", "Author1", 200, false),
	new Book("Book2", "Author1", 250, true),
	new Book("Book3", "Author1", 300, false),
	new Book("Book4", "Author1", 180, false),
);

function addBookToLibrary(book_info) {
	const newBook = new Book(book_info.title, book_info.author, book_info.pages, book_info.read);
	myLibrary.push(newBook);
	bookDisplay.appendChild(createBookCard(newBook));
	return newBook.idx;
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
	cardControlsDelete.addEventListener("click", () => deleteBook(book.idx));
	cardControls.appendChild(cardControlsDelete);

	let cardControlsToggleRead = createToggleReadForBook(book);
	cardControls.appendChild(cardControlsToggleRead);

	card.appendChild(cardImgContainer);
	card.appendChild(cardInfoContainer);
	card.appendChild(cardControls);
	card.setAttribute("book-idx", book.idx);
	return card;
}

function deleteBook(book_idx) {
	let deleted_idx = getBookArrayIdx(book_idx);
	let deleted = myLibrary.splice(deleted_idx, 1)[0];
	const selector = `.book-card[book-idx="${book_idx}"]`;
	document.querySelector(selector).remove();
	createAlert(`Deleted Book #${book_idx}: ${deleted.title}`, 'error', 2500);
}

function toggleBookRead(book_idx) {
	const tar_idx = getBookArrayIdx(book_idx);
	const book = myLibrary[tar_idx];
	myLibrary[tar_idx].read = !book.read;
	const selector = `.book-card[book-idx="${book_idx}"] .book-toggle-read-btn`;
	document.querySelector(selector).replaceWith(createToggleReadForBook(book));
	if(book.read) createAlert(`Marked as read: Book #${tar_idx}: ${book.title}`);
	else createAlert(`Marked as unread: Book #${tar_idx}: ${book.title}`);
}

function createToggleReadForBook(book) {
	let cardControlsToggleRead = document.createElement("div");
	cardControlsToggleRead.classList.add("book-toggle-read-btn");
	let tmpClass = book.read ? "book-read" : "book-not-read";
	cardControlsToggleRead.classList.add(tmpClass);

	let cardControlsToggleReadIcon = document.createElement("img");
	let tmpSrc = book.read ? "assets/checkbox-ticked.svg" : "assets/checkbox-blank.svg"
	cardControlsToggleReadIcon.setAttribute("src", tmpSrc);

	cardControlsToggleRead.appendChild(cardControlsToggleReadIcon);
	cardControlsToggleRead.addEventListener("click", () => toggleBookRead(book.idx));
	return cardControlsToggleRead;
}

function createAlert(message, type='info', time=3000) {
	let alertCard = document.createElement("div");
	alertCard.classList.add('alert', `alert-${type}`);
	let alertCardIcon = document.createElement("div");
	alertCardIcon.classList.add("alert-icon");
	let alertCardIconImg = document.createElement("img");
	alertCardIconImg.setAttribute("src", "assets/alert.svg");
	alertCardIcon.appendChild(alertCardIconImg);
	let alertCardMessage = document.createElement("div");
	alertCardMessage.classList.add("alert-message");
	alertCardMessage.textContent = message;
	alertCard.appendChild(alertCardIcon);
	alertCard.appendChild(alertCardMessage);
	alertBox.appendChild(alertCard);
	setTimeout(() => alertCard.classList.add('hidden'), time - 500);
	setTimeout(() => alertCard.remove(), time);
	alertBox.scrollTop = alertBox.scrollHeight;
}


const addBookDialog = document.querySelector('dialog#add-new-book');
document.querySelector('button#btn-add-book').addEventListener('click', () => addBookDialog.showModal());
document.querySelector('button#close-add-book-dialog').addEventListener('click', () => addBookDialog.close(false));

document.querySelector("button#addBookBtn").addEventListener('click', (e) => {
	e.preventDefault();
	info = {
		title: addBookDialog.querySelector("input[name='book-title']").value,
		author: addBookDialog.querySelector("input[name='book-author']").value,
		pages: addBookDialog.querySelector("input[name='book-pages']").value,
		read: addBookDialog.querySelector("input[name='book-read']").checked
	}

	if(!(info.title && info.author && info.pages)) return alert("Please fill all the required fields!");
	const nidx = addBookToLibrary(book_info=info);
	addBookDialog.close(`Added Book #${nidx}: ${info.title} by ${info.author}`);
	addBookDialog.querySelector("form").reset();
});

addBookDialog.addEventListener("close", (e) => {
	const rval = addBookDialog.returnValue;
	if(rval !== "false") createAlert(rval, "success");
});

function renderBooks() {
	bookDisplay.innerHTML = "";
	for(let idx = 0; idx < myLibrary.length; idx++) {
		let book = myLibrary[idx];
		bookDisplay.appendChild(createBookCard(book));
	}
}

function resetLibrary() {
	bookDisplay.innerHTML = "";
	myLibrary = [];
}

document.querySelector("button#btn-reset-library").addEventListener("click", () => resetLibrary());

renderBooks();