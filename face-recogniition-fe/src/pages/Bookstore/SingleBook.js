import { React, useState, useEffect } from "react";
import { useParams } from "react-router";

import BookService from "../../services/BookService";

import "./bookstore.scss";

function SingleBook() {
  const params = useParams();
  const [book, setBook] = useState();

  useEffect(() => {
    if (!book) {
      BookService.getSingleBook(params?.bookId).then((result) => {
        setBook(result?.data);
      });
    }
  }, [book]);

  return (
    <>
      <section className="book">
        <div className="topBlock">
          <img
            className="bookCover"
            alt="book-cover"
            src={book?.cover}
          />
          <div className="infoBlock">
            <p className="bookTitle">{book?.title}</p>
            <p className="bookAuthor">Authors: {book?.authors}</p>
            <p>Year: {book?.authors}</p>
            <p className="bookPrice">{book?.price} Euro</p>
          </div>
        </div>
        <div className="botBlock">
            <p>Feedbacks:</p>
            <ul>
                <li>
                    <p>John</p>
                    <p>I love this book! Good plot! 10/10</p>
                </li>
                <li>
                    <p>Maty</p>
                    <p>This in okey 7/10</p>
                </li>
                <li>
                    <p>Mary</p>
                    <p>Magnificebt 12/10</p>
                </li>
            </ul>
        </div>
      </section>
    </>
  );
}

export default SingleBook;
