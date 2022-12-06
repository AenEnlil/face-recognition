import { React, useState, useEffect } from "react";
import { NavLink } from "react-router-dom";

import BookService from "../../services/BookService";

import "./bookstore.scss";

function Bookstore() {
  const [books, setBooks] = useState();

  useEffect(() => {
    if (!books) {
      BookService.getBooks().then((result) => {
        if (result) {
          setBooks(result?.data);
        }
      });
    }
  }, [books]);

  return (
    <>
      <section className="books">
        <ul>
          {books &&
            books?.map((item) => (
              <li key={item?.id}>
                <NavLink className="bookItem" to="">
                  <img
                    className="bookCover"
                    src={item?.cover}
                  />
                  <div className="bookInfo">
                    <p className="bookTitle">{item?.title}</p>
                    <p className="bookPrice">{item?.price} Euro</p>
                    <p className="bookAuthor">{item?.authors}</p>
                  </div>
                </NavLink>
              </li>
            ))}
        </ul>
      </section>
    </>
  );
}

export default Bookstore;
