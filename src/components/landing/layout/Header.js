import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import Logo from './partials/Logo';
import AuthService from "../../../services/auth.service";

const propTypes = {
  navPosition: PropTypes.string,
  hideNav: PropTypes.bool,
  hideSignin: PropTypes.bool,
  bottomOuterDivider: PropTypes.bool,
  bottomDivider: PropTypes.bool
}

const defaultProps = {
  navPosition: '',
  hideNav: false,
  hideSignin: false,
  bottomOuterDivider: false,
  bottomDivider: false
}

const Header = ({
  className,
  navPosition,
  hideNav,
  hideSignin,
  bottomOuterDivider,
  bottomDivider,
  ...props
}) => {

  const [isActive, setIsactive] = useState(false);

  const nav = useRef(null);
  const hamburger = useRef(null);

  const [isVisitor, setIsVisitor] = useState(true);
  // eslint-disable-next-line no-unused-vars
  const [showAdminBoard, setShowAdminBoard] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [currentUser, setCurrentUser] = useState(undefined);

  useEffect(() => {

    const keyPress = (e) => {
      isActive && e.keyCode === 27 && closeMenu();
    }
  
    const clickOutside = (e) => {
      if (!nav.current) return
      if (!isActive || nav.current.contains(e.target) || e.target === hamburger.current) return;
      closeMenu();
    }  
  
    isActive && openMenu();
    document.addEventListener('keydown', keyPress);
    document.addEventListener('click', clickOutside);
    const user = AuthService.getCurrentUser();
    if (user) {
      setIsVisitor(false);
      setCurrentUser(user);
      setShowAdminBoard(user.role === "B_ADMIN" || user.role === "SYS_ADMIN");
    }
    else {
      setIsVisitor(true);
      setShowAdminBoard(false);
    }
    return () => {
      document.removeEventListener('keydown', keyPress);
      document.addEventListener('click', clickOutside);
      closeMenu();
    };
  }, [isActive]);  

  const openMenu = () => {
    document.body.classList.add('off-nav-is-active');
    nav.current.style.maxHeight = nav.current.scrollHeight + 'px';
    setIsactive(true);
  }

  const closeMenu = () => {
    document.body.classList.remove('off-nav-is-active');
    nav.current && (nav.current.style.maxHeight = null);
    setIsactive(false);
  }

  const classes = classNames(
    'site-header',
    bottomOuterDivider && 'has-bottom-divider',
    className
  );

  const logOut = () => {
    AuthService.logout();
    window.location.href = "/";
  };

  return (
    <header
      {...props}
      className={classes}
    >
      <div className="container">
        <div className={
          classNames(
            'site-header-inner',
            bottomDivider && 'has-bottom-divider'
          )}>
          <Logo />
          {!hideNav &&
            <>
              <button
                ref={hamburger}
                className="header-nav-toggle"
                onClick={isActive ? closeMenu : openMenu}
              >
                <span className="screen-reader">Menu</span>
                <span className="hamburger">
                  <span className="hamburger-inner"></span>
                </span>
              </button>
              <nav
                ref={nav}
                className={
                  classNames(
                    'header-nav',
                    isActive && 'is-active'
                  )}>
                <div className="header-nav-inner">
                  <ul className={
                    classNames(
                      'list-reset text-xs',
                      navPosition && `header-nav-${navPosition}`
                    )}>
                    {isVisitor && (
                      <>
                      <li>
                        <a href="/#featuresTiles" onClick={closeMenu}>Vantagens</a>
                      </li>
                      <li>
                        <a href="/#sectionProduct" onClick={closeMenu}>Produto</a>
                      </li>
                      <li>
                        <a href="/#sectionContact" onClick={closeMenu}>Contato</a>
                      </li>
                      </>
                    )}
                  </ul>
                  <ul className={
                    classNames(
                      'list-reset text-xs',
                      navPosition && `header-nav-${navPosition}`
                    )}>
                    {showAdminBoard && (
                      <>
                      <li>                      
                        <Link to="/dashboard" onClick={closeMenu}>Início</Link>
                      </li>
                      <li>
                          <Link to="/admin-gym" onClick={closeMenu}>Academias</Link>
                      </li>
                      <li>
                          <Link to="/admin-personal" onClick={closeMenu}>Personal</Link>
                      </li>
                      <li>
                          <Link to="/admin-customer" onClick={closeMenu}>Alunos</Link>
                      </li>
                      </>
                    )}
                  </ul>
                  {!hideSignin &&
                    <ul
                      className="list-reset header-nav-right"
                    >
                      <li>
                        {isVisitor && (
                          <Link to="/login" className="button button-primary button-wide-mobile button-sm" onClick={closeMenu}>Entrar</Link>
                        )}
                        {!isVisitor && (
                          <Link to="/" className="button button-primary button-wide-mobile button-sm" onClick={logOut}>Sair</Link>
                        )}
                      </li>
                    </ul>}
                </div>
              </nav>
            </>}
        </div>
      </div>
    </header>
  );
}

Header.propTypes = propTypes;
Header.defaultProps = defaultProps;

export default Header;