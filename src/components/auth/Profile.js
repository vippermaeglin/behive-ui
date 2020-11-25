import React from "react";
import AuthService from "../../services/auth.service";

const Profile = () => {
  const currentUser = AuthService.getCurrentUser();

  return (
    <div className="container">
      <header className="jumbotron">
        <h3>
          <strong>{currentUser.userName}</strong> Profile
        </h3>
      </header>
      <p>
        <strong>CPF:</strong> {currentUser.cpf}
      </p>
      <p>
        <strong>Token:</strong> {currentUser.token.substring(0, 20)} ...{" "}
        {currentUser.token.substr(currentUser.token.length - 20)}
      </p>
      <p>
        <strong>Id:</strong> {currentUser.id}
      </p>
      <p>
        <strong>Email:</strong> {currentUser.email}
      </p>
      <p>
        <strong>CPF:</strong> {currentUser.cpf}
      </p>
      <p>
        <strong>Role:</strong> {currentUser.role}
      </p>
    </div>
  );
};

export default Profile;