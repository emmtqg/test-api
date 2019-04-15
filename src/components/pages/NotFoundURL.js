import React from 'react';

import amazing from '../../assets/amazed-paddle.jpg';
import '../styles/NotFoundURL.scss';
import '../styles/SideBySideComponents.scss';

const NotFoundURL = () => (
  <main id="page404" className="main error-page-wrapper background-color background-image">
    <div className="flexGrid">
      <div className="col">
        <div className="content-container">
          <div className="head-line">
            404
          </div>
          <div className="subheader">
            Oops, the page you&#39;re <br />
            looking for does not exist.
          </div>
          <div className="clearfix" />
          <div className="context">
            <p>
              Check your URL if you self navigated!
            </p>
          </div>
          <div className="buttons-container">
            <a className="border-button" href="http://localhost:3000/splash">Transport home!</a>
          </div>
        </div>
      </div>
      <div className="col">
        <img className="center" src={amazing} alt="Amazing 404 error page." />
      </div>
    </div>
  </main>
);

export default NotFoundURL;
