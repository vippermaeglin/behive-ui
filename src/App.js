import React, {useRef, useEffect } from 'react';
import { useLocation, Switch } from 'react-router-dom';
import AppRoute from './utils/AppRoute';
import ScrollReveal from './utils/ScrollReveal';
import ReactGA from 'react-ga';
import "bootstrap/dist/css/bootstrap.min.css";

// Layouts
import LayoutDefault from './layouts/LayoutDefault';
import LayoutAuth from './layouts/LayoutAuth';

// Views & Components 
import Home from './views/Home';
import Dashboard from './views/Dashboard';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import Profile from './components/auth/Profile';
import AdminGym from "./components/admin/admin-gym.component";
import AdminPersonal from "./components/admin/admin-personal.component";
import AdminCustomer from "./components/admin/admin-customer.component";
import CreateGym from "./components/admin/create-gym.component";
import CreatePersonal from "./components/admin/create-personal.component";
import InvitePersonal from "./components/admin/create-invite-personal.component";
import RegisterPersonal from "./components/admin/register-personal.component";
import CreateCustomer from "./components/admin/create-customer.component";
import InviteCustomer from "./components/admin/create-invite-customer.component";

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
    
  return (
    <ScrollReveal
      ref={childRef}
      children={() => (
          <Switch>
            <AppRoute exact path="/" component={Home} layout={LayoutDefault} />
            <AppRoute exact path="/register" component={Register} layout={LayoutAuth} />
            <AppRoute exact path="/login" component={Login} layout={LayoutAuth}/>
            <AppRoute exact path="/profile" component={Profile} layout={LayoutAuth}/>
            <AppRoute path="/dashboard" component={Dashboard} layout={LayoutDefault}/>
            <AppRoute path="/admin-gym" component={AdminGym} layout={LayoutDefault}/>
            <AppRoute path="/admin-personal" component={AdminPersonal} layout={LayoutDefault}/>
            <AppRoute path="/admin-customer" component={AdminCustomer} layout={LayoutDefault}/>
            <AppRoute path="/gym/:id" component={CreateGym} layout={LayoutDefault}/>
            <AppRoute path="/personal/:id" component={CreatePersonal} layout={LayoutDefault}/>
            <AppRoute path="/personal-invite/:gymId" component={InvitePersonal} layout={LayoutDefault}/>
            <AppRoute path="/personal-signup/:gymId/:contract" component={RegisterPersonal} layout={LayoutDefault}/>
            <AppRoute path="/customer/:id" component={CreateCustomer} layout={LayoutDefault}/>
            <AppRoute path="/customer-invite/:personalId" component={InviteCustomer} layout={LayoutDefault}/>
          </Switch>
      )} />
  );
}

export default App;