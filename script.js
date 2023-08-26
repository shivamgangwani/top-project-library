console.log("Script loaded");

const alertBox = document.querySelector("div#alert-box");
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


const Library = (function(){
	let books = [];
	let bookIdxCount = 1;

	bookDisplay = document.querySelector("div#books");
	clearDisplay = () => bookDisplay.innerHTML = "";


	addBook = (book_info) => {
		const newBook = new Book(bookIdxCount, book_info.title, book_info.author, book_info.pages, book_info.read);
		books.push(newBook);
		bookIdxCount++;
		bookDisplay.appendChild(createBookCard(newBook));
		return newBook.idx;
	}

	deleteBook = (book) => {
		books = books.filter((i_book) => (i_book !== book))
		document.querySelector(`.book-card[book-idx="${book.idx}"]`).remove();
		createAlert(`Deleted Book #${book.idx}: ${book.title}`, 'error', 2500);
	}

	toggleBookRead = (book) => {
		book.toggleReadStatus();
		const selector = `.book-card[book-idx="${book.idx}"] .book-toggle-read-btn`;
		document.querySelector(selector).replaceWith(createToggleReadForBook(book));
		if(book.isRead()) createAlert(`Marked as read: Book #${book.idx}: ${book.title}`);
		else createAlert(`Marked as unread: Book #${book.idx}: ${book.title}`);
	}

	createToggleReadForBook = (book) => {
		let cardControlsToggleRead = document.createElement("div");
		cardControlsToggleRead.classList.add("book-toggle-read-btn");
		let tmpClass = book.isRead() ? "book-read" : "book-not-read";
		cardControlsToggleRead.classList.add(tmpClass);

		let cardControlsToggleReadIcon = document.createElement("img");
		let tmpSrc = book.isRead() ? "assets/checkbox-ticked.svg" : "assets/checkbox-blank.svg"
		cardControlsToggleReadIcon.setAttribute("src", tmpSrc);

		cardControlsToggleRead.appendChild(cardControlsToggleReadIcon);
		cardControlsToggleRead.addEventListener("click", () => toggleBookRead(book));
		return cardControlsToggleRead;
	}

	createBookCard = (book) => {
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
		cardControlsDelete.addEventListener("click", () => deleteBook(book));
		cardControls.appendChild(cardControlsDelete);

		let cardControlsToggleRead = createToggleReadForBook(book);
		cardControls.appendChild(cardControlsToggleRead);

		card.appendChild(cardImgContainer);
		card.appendChild(cardInfoContainer);
		card.appendChild(cardControls);
		card.setAttribute("book-idx", book.idx);
		return card;
	}

	renderBooks = () => {
		clearDisplay();
		books.forEach((book) => bookDisplay.appendChild(createBookCard(book)));
	}

	resetLibrary = () => {
		clearDisplay();
		books = [];
	}

	init = () => {
		const addBookDialog = document.querySelector('dialog#add-new-book');
		document.querySelector('button#btn-add-book').addEventListener('click', () => addBookDialog.showModal());
		document.querySelector('button#close-add-book-dialog').addEventListener('click', () => addBookDialog.close(false));
		
		document.querySelector("button#addBookBtn").addEventListener('click', (e) => {
			e.preventDefault();
			const book_info = {
				title: addBookDialog.querySelector("input[name='book-title']").value,
				author: addBookDialog.querySelector("input[name='book-author']").value,
				pages: addBookDialog.querySelector("input[name='book-pages']").value,
				read: addBookDialog.querySelector("input[name='book-read']").checked
			}
		
			if(!(book_info.title && book_info.author && book_info.pages)) return alert("Please fill all the required fields!");
			const nidx = addBook(book_info);
			addBookDialog.close(`Added Book #${nidx}: ${book_info.title} by ${book_info.author}`);
			addBookDialog.querySelector("form").reset();
		});
		
		addBookDialog.addEventListener("close", (e) => {
			const rval = addBookDialog.returnValue;
			if(rval !== "false") createAlert(rval, "success");
		});
		
		document.querySelector("button#btn-reset-library").addEventListener("click", () => resetLibrary());
		renderBooks();
	}
	init();

	return {addBook};
})();

class Book {
	constructor(idx, title, author, pages, read) {
		this.idx = idx;
		this.title = title;
		this.author = author;
		this.pages = pages;
		this.read = read;
	}

	toggleReadStatus() {
		this.read = !this.read;
	}

	isRead() {
		return this.read;
	}
}

Library.addBook({title: "Book1", author:"Author1", pages:200, read:false});
Library.addBook({title: "Book2", author:"Author2", pages:250, read:true});
Library.addBook({title: "Book3", author:"Author3", pages:300, read:false});
Library.addBook({title: "Book4", author:"Author4", pages:180, read:true});