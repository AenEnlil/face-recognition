import axios from "axios";

const getBooks = () => {
  return axios.get(`http://localhost:8000/bookstore/`);
};

const getSingleBook = (bookId) => {
    return axios.get(`http://localhost:8000/bookstore/${bookId}/`);
  };

const BookService = {
    getBooks,
    getSingleBook
};

export default BookService;
