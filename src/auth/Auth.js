import React, { Component } from "react";
import auth0 from "auth0-js";

import auth0Config from './auth/auth0.config.json';
import { AuthProvider } from "../AuthContext";

const auth = new auth0.WebAuth({
    domain: auth0Config.domain,
    clientID: auth0Config.clientId,
    redirectUri: auth0Config.callbackUrl,
    audience: auth0Config.audience,
    responseType: "token id_token"
});

class Auth extends Component {
    state = {
        authenticated: false,
        user: {
            role: "visitor"
        },
        accessToken: ""
    };

    initiateLogin = () => {
        auth.authorize();
    };

    logout = () => {
        this.setState({
            authenticated: false,
            user: {
                role: "visitor"
            },
            accessToken: ""
        });
    };

    handleAuthentication = () => {
        auth.parseHash((error, authResult) => {
            if (error) {
                console.log(error);
                console.log(`Ops! Ocorreu um erro, tente novamente (${error.error})`);
                return;
            }
            this.setSession(authResult.idTokenPayload);
        });
    };

    setSession(data) {
        const user = {
            id: data.sub,
            email: data.email,
            role: data[auth0Config.roleUrl]
        };
        this.setState({
            authenticated: true,
            accessToken: data.accessToken,
            user
        });
    }

    render() {
        const authProviderValue = {
            ...this.state,
            initiateLogin: this.initiateLogin,
            handleAuthentication: this.handleAuthentication,
            logout: this.logout
        };
        return (
            <AuthProvider value={authProviderValue}>
                {this.props.children}
            </AuthProvider>
        );
    }
}

export default Auth;