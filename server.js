
const express = require("express");

const app = express();

app.use(express.json());

const PORT = 3000;

// In-memory array
let books = [];
let nextId = 1;

// POST - Add a new book
app.post("/api/books", (req, res) => {
    const { title, author, year } = req.body;

    // Check missing data
    if (!title || !author || year === undefined || year === null) {
        return res.status(400).json({
            message: "All fields are required"
        });
    }

    // Check duplicate title
    const existingBook = books.find(
        book => book.title.toLowerCase() === title.trim().toLowerCase()
    );

    if (existingBook) {
        return res.status(409).json({
            message: "Book already exists"
        });
    }

    // Create book
    const newBook = {
        id: nextId++,
        title: title.trim(),
        author: author.trim(),
        year: Number(year)
    };

    books.push(newBook);

    res.status(201).json({
        message: "Book added successfully",
        book: newBook
    });
});


// GET - Get all books (with author filter)
app.get("/api/books", (req, res) => {
    const { author } = req.query;

    let result = books;

    // Filter by author
    if (author) {
        result = books.filter(
            book => book.author.toLowerCase() === author.toLowerCase()
        );
    }

    res.status(200).json(result);
});


// GET - Get book by ID
app.get("/api/books/:id", (req, res) => {
    const id = Number(req.params.id);

    const book = books.find(b => b.id === id);

    if (!book) {
        return res.status(404).json({
            message: "Book not found"
        });
    }

    res.status(200).json(book);
});


// PUT - Update book by ID
app.put("/api/books/:id", (req, res) => {
    const id = Number(req.params.id);

    const book = books.find(b => b.id === id);

    if (!book) {
        return res.status(404).json({
            message: "Book not found"
        });
    }

    const { title, author, year } = req.body;

    // Check missing data
    if (!title || !author || year === undefined || year === null) {
        return res.status(400).json({
            message: "All fields are required"
        });
    }

    // Check duplicate title (excluding current book)
    const duplicate = books.find(
        b => b.id !== id &&
        b.title.toLowerCase() === title.trim().toLowerCase()
    );

    if (duplicate) {
        return res.status(409).json({
            message: "Book title already exists"
        });
    }

    // Update book
    book.title = title.trim();
    book.author = author.trim();
    book.year = Number(year);

    res.status(200).json({
        message: "Book updated successfully",
        book: book
    });
});


// DELETE - Delete book by ID
app.delete("/api/books/:id", (req, res) => {
    const id = Number(req.params.id);

    const index = books.findIndex(b => b.id === id);

    if (index === -1) {
        return res.status(404).json({
            message: "Book not found"
        });
    }

    books.splice(index, 1);

    res.status(200).json({
        message: "Book deleted successfully"
    });
});


// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
