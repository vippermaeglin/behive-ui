import React, {useRef, useEffect } from 'react';
import { useLocation, Switch } from 'react-router-dom';
import AppRoute from './utils/AppRoute';
import ScrollReveal from './utils/ScrollReveal';
import ReactGA from 'react-ga';
import "bootstrap/dist/css/bootstrap.min.css";

// Layouts
import LayoutDefault from './layouts/LayoutDefault';
import LayoutAuth from './layouts/LayoutAuth';

// Views 
import Home from './views/Home';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import Profile from './components/auth/Profile';
import BoardAdmin from "./components/admin/board-admin.component";
import AdminGym from "./components/admin/admin-gym.component";
import AdminPersonal from "./components/admin/admin-personal.component";
import AdminCustomer from "./components/admin/admin-customer.component";

// Services
//import AuthService from "./services/auth.service";

// Initialize Google Analytics
ReactGA.initialize(process.env.REACT_APP_GA_CODE);

const trackPage = page => {
  ReactGA.set({ page });
  ReactGA.pageview(page);
};

const App = () => {

  const childRef = useRef();
  let location = useLocation();

  useEffect(() => {
    const page = location.pathname;
    document.body.classList.add('is-loaded')
    childRef.current.init();
    trackPage(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  /**
  const PrivateRoute = ({ component: Component, ...rest }) => (
    <AppRoute
      {...rest}
      render={props =>
        AuthService.getCurrentUser ? (
        <Component {...props} />
        ) : (
        <Redirect
        to={{
        pathname: "/"
        }}
        />
        )
      }
      />
    )**/
    
  return (
    <ScrollReveal
      ref={childRef}
      children={() => (
          <Switch>
            <AppRoute exact path="/" component={Home} layout={LayoutDefault} />
            <AppRoute exact path="/register" component={Register} layout={LayoutAuth} />
            <AppRoute exact path="/login" component={Login} layout={LayoutAuth}/>
            <AppRoute exact path="/profile" component={Profile} layout={LayoutAuth}/>
            <AppRoute path="/admin" component={BoardAdmin} layout={LayoutDefault}/>
            <AppRoute path="/admin-gym" component={AdminGym} layout={LayoutDefault}/>
            <AppRoute path="/admin-personal" component={AdminPersonal} layout={LayoutDefault}/>
            <AppRoute path="/admin-customer" component={AdminCustomer} layout={LayoutDefault}/>
          </Switch>
      )} />
  );
}

export default App;