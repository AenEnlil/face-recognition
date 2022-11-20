import React from "react";

import "./footer.scss";

function Footer() {
  return (
      <footer className="footer-dark">
        <div className="container">
          <div className="row">
            <div className="col-md-6 item text">
              <h3>Face Recognizer</h3>
              <p>
                Praesent sed lobortis mi. Suspendisse vel placerat ligula.
                Vivamus ac sem lacus. Ut vehicula rhoncus elementum. Etiam quis
                tristique lectus. Aliquam in arcu eget velit pulvinar dictum vel
                in justo.
              </p>
            </div>
            <div className="col item social">
              <a href="https://twitter.com/">
                <i className="icon ion-social-twitter"></i>
              </a>
              <a href="https://www.instagram.com/">
                <i className="icon ion-social-instagram"></i>
              </a>
            </div>
          </div>
          <p className="copyright">Face Recognizer © 2022</p>
        </div>
      </footer>
  );
}

export default Footer;
