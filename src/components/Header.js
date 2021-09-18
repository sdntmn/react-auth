import React from "react";
import { Link } from "react-router-dom";
import logoPath from "../images/Vector.svg";
import { Route, Switch, Redirect, useHistory } from "react-router-dom";

// Заголовок сайта =========================================================
function Header({ email, pathLink, btnLink, onEndSession }) {
  console.log(email);

  return (
    <Switch>
      <Route exact path="/">
        <header className="header page__cover">
          <img className="logo" src={logoPath} alt="Логотип сайта" />
          <div className="header__auth">
            <p className="header__email header__email_is-visibility">{email}</p>
            <Link to={pathLink} className="header__link" onClick={onEndSession}>
              {btnLink}
            </Link>
          </div>
        </header>
      </Route>
      <Route path="/sign-up">
        <header className="header page__cover">
          <img className="logo" src={logoPath} alt="Логотип сайта" />
          <div className="header__auth">
            <Link to={pathLink} className="header__link" onClick={onEndSession}>
              {btnLink}
            </Link>
          </div>
        </header>
      </Route>
      <Route path="/sign-in">
        <header className="header page__cover">
          <img className="logo" src={logoPath} alt="Логотип сайта" />
          <div className="header__auth">
            <Link to={pathLink} className="header__link" onClick={onEndSession}>
              {btnLink}
            </Link>
          </div>
        </header>
      </Route>
    </Switch>
  );
}

export default Header;

/*
  return (
    <header className="header page__cover">
      <img className="logo" src={logoPath} alt="Логотип сайта" />
      <div className="header__auth">
        <Route exact path="/">
          <p className="header__email header__email_is-visibility">{email}</p>
          <Link className="header__link">Выйти</Link>
        </Route>
        <Route path="/sign-up">
          
          <Link to="/sign-in" className="header__link">
            Войти
          </Link>
        </Route>
        <Route path="/sign-in">
          
          <Link to="/sign-up" className="header__link">
            Регистрация
          </Link>
        </Route>
      </div>
    </header>
  );
  */
