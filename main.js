const books = [];
const RENDER_EVENT = "render-book";

document.addEventListener("DOMContentLoaded", function () {
    const inputBook = document.getElementById("inputBook");
    inputBook.addEventListener("submit", function (event) {
        event.preventDefault();
        addBook();

    });

    if(isStorageExist()) {
        loadDataFromStorage();
    };
});

function addBook() {
    const bookTitle = document.getElementById("inputBookTitle").value;
    const bookAuthor = document.getElementById("inputBookAuthor").value;
    const bookYear = document.getElementById("inputBookYear").value;
    const bookStatus = document.getElementById("inputBookIsComplete").checked;

    const generateID = generateId();
    const bookObject = generateBookObject(generateID, bookTitle, bookAuthor, bookYear, bookStatus);
    books.push(bookObject);

    document.dispatchEvent(new Event(RENDER_EVENT));

    saveData();
};

function generateId() {
    return +new Date();
};

function generateBookObject(id, title, author, year, isComplete) {
    return {
        id,
        title,
        author,
        year,
        isComplete
    };
};

document.addEventListener(RENDER_EVENT, function () {
    const uncompletedBookList = document.getElementById("incompleteBookshelfList");
    uncompletedBookList.innerHTML = "";

    const completedBookList = document.getElementById("completeBookshelfList");
    completedBookList.innerHTML = "";

    for (const bookItem of books) {
        const bookElement = makeBook(bookItem);
        if (!bookItem.isComplete) {
            uncompletedBookList.append(bookElement);
        } else {
            completedBookList.append(bookElement);
        }
    };
});

function makeBook(bookObject) {
    const textTitle = document.createElement("h3");
    textTitle.innerText = bookObject.title;

    const textAuthor = document.createElement("p");
    textAuthor.innerText = bookObject.author;

    const textYear = document.createElement("p");
    textYear.innerText = bookObject.year;

    const buttonIsComplete = document.createElement("button");
    buttonIsComplete.classList.add("green");
    buttonIsComplete.innerText = "Selesai dibaca";

    const buttonDelete = document.createElement("button");
    buttonDelete.classList.add("red");
    buttonDelete.innerText = "Hapus buku";

    const buttonEdit = document.createElement("button");
    buttonEdit.classList.add("blue");
    buttonEdit.innerText = "Edit buku";

    buttonDelete.addEventListener("click", function () {
        // removeBookFromCompleted(bookObject.id);
        const dialogDelete = document.getElementById("dialogDelete");
        dialogDelete.style.display = "flex";

        const dialogDeleteExit = document.getElementById("deteleBookFalse");
        dialogDeleteExit.addEventListener("click", function() {
            dialogDelete.style.display = "none";
        });

        const dialogDeleteButton = document.getElementById("deleteBookTrue");
        dialogDeleteButton.addEventListener("click", function() {
            removeBookFromCompleted(bookObject.id);
            dialogDelete.style.display = "none";
        });
    });

    buttonEdit.addEventListener("click", function() {
        const dialogEdit = document.getElementById("dialogEdit");
        dialogEdit.style.display = "flex";

        const dialogEditExit = document.getElementById("editBookFalse");
        dialogEditExit.addEventListener("click", function() {
            dialogEdit.style.display = "none";
        });

        const dialogEditButton = document.getElementById("editBookTrue");
        const editBookTitleInput = document.getElementById("editBookTitle");
        const editBookAuthorInput = document.getElementById("editBookAuthor");
        const editBookYearInput = document.getElementById("editBookYear");

        editBookTitleInput.setAttribute("value", bookObject.title);
        editBookAuthorInput.setAttribute("value", bookObject.author);
        editBookYearInput.setAttribute("value", bookObject.year);
        
        dialogEditButton.addEventListener("click", function() {
            dialogEdit.style.display = "none";

            const bookTarget = findBook(bookObject.id);

            if (bookTarget == null) return;

            bookTarget.title = editBookTitleInput.value;
            bookTarget.author = editBookAuthorInput.value;
            bookTarget.year = editBookYearInput.value;
            
            document.dispatchEvent(new Event(RENDER_EVENT));

            saveData();
        });
    });

    buttonEdit.addEventListener("click", function() {
        editBook(bookObject.id);
    });

    const buttonContainer = document.createElement("div");
    buttonContainer.classList.add("action");
    buttonContainer.append(buttonIsComplete, buttonDelete, buttonEdit);

    const article = document.createElement("article");
    article.classList.add("book_item");
    article.append(textTitle, textAuthor, textYear, buttonContainer);

    if (bookObject.isComplete) {
        buttonIsComplete.innerText = "Belum selesai dibaca";

        buttonIsComplete.addEventListener("click", function () {
            undoBookFromCompleted(bookObject.id);
        });
    } else {
        buttonIsComplete.addEventListener("click", function () {
            addBookToCompleted(bookObject.id);
        });
    };

    return article;
}

function addBookToCompleted (bookId) {
    const bookTarget = findBook(bookId);

    if (bookTarget == null) return;

    bookTarget.isComplete = true;
    document.dispatchEvent(new Event(RENDER_EVENT));

    saveData();
};

function findBook(bookId) {
    for (const bookItem of books) {
        if (bookItem.id === bookId) {
            return bookItem;
        }
    }
    return null;
};

function removeBookFromCompleted(bookId) {
    const bookTarget = findBookIndex(bookId);

    if (bookTarget === -1) return;
    
    books.splice(bookTarget, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));

    saveData();
};

function undoBookFromCompleted(bookId) {
    const bookTarget = findBook(bookId);

    if (bookTarget == null) return;

    bookTarget.isComplete = false;
    document.dispatchEvent(new Event(RENDER_EVENT));

    saveData();
};

function findBookIndex(bookId) {
    for (const index in books) {
        if (books[index].id === bookId) {
            return index;
        };
    };

    return -1;
};

function saveData() {
    if (isStorageExist()) {
        const parsed = JSON.stringify(books);
        localStorage.setItem(STORAGE_KEY, parsed);
        document.dispatchEvent(new Event(SAVED_EVENT));
    };
};

const SAVED_EVENT = "saved-book";
const STORAGE_KEY = "BOOK_SHELF";

function isStorageExist() {
    if (typeof(Storage) === undefined) {
        alert("Browser anda tidak mendukung local storage");
        return false;
    };
    return true;
};

document.addEventListener(SAVED_EVENT, function() {
    console.log(localStorage.getItem(STORAGE_KEY));
});

function loadDataFromStorage() {
    const serializedData = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serializedData);

    if (data !== null) {
        for (const book of data) {
            books.push(book);
        };
    };

    document.dispatchEvent(new Event(RENDER_EVENT));
};

function editBook(bookId) {
    const bookTarget = findBook(bookId);

    if(bookTarget == null) return;
}