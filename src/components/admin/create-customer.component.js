import React, { Component, createRef } from "react";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";
import Select from "react-validation/build/select";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFacebook, faInstagram, faLinkedin, faTwitter, faWeebly } from '@fortawesome/free-brands-svg-icons'
import { faImages } from '@fortawesome/free-solid-svg-icons'
import Collapsible from 'react-collapsible';

import AuthService from "../../services/auth.service";
import CustomerService from "../../services/customer.service";
import {zipMask} from "../auth/ZipMask"
import { consultarCep } from 'correios-brasil'; 

const required = (value) => {
  if (!value) {
    return (
      <div className="alert alert-danger" role="alert">
        Campo obrigatório!
      </div>
    );
  }
};

const vzipcode = (value) => {
  value = zipMask(value)
  if (value.length !== 9) {
    return (
      <div className="alert alert-danger" role="alert">
        CEP inválido!
      </div>
    );
  }
};

const vlogo = (value) => {
  const fileType = value.split('.').pop();
  if (fileType !== "jpg" && fileType !== "jpeg" && fileType !== "png" && fileType !== "gif") {
    return (
      <div className="alert alert-danger" role="alert">
        URL precisa terminar em jpg/jpeg/png/gif!
      </div>
    );
  }
};

export default class CreateGym extends Component {
  constructor(props) {
    super(props);
    this.retrieveUsers = this.retrieveUsers.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.onChangeUser = this.onChangeUser.bind(this);
    this.onChangeNumber = this.onChangeNumber.bind(this);
    this.onChangeZipCode = this.onChangeZipCode.bind(this);
    this.onChangeFacebook = this.onChangeFacebook.bind(this);
    this.onChangeInstagram = this.onChangeInstagram.bind(this);
    this.onChangeTwitter = this.onChangeTwitter.bind(this);
    this.onChangeLinkedin = this.onChangeLinkedin.bind(this);
    this.onChangeWebsite = this.onChangeWebsite.bind(this);
    this.onChangeLogo = this.onChangeLogo.bind(this);

    this.form = createRef();
    this.checkBtn = createRef();
    this.inputNumber = createRef();
    this.image = createRef();

    this.state = {
      users: [],
      loading: false,
      message: null,
      successful: false,
      userIndex: null,
      user: null,
      address: {},
      socialMedia: {
        facebook: "https://www.facebook.com/",
        instagram: "https://www.instagram.com/",
        twitter: "https://twitter.com/",
        linkedin: "https://www.linkedin.com/",
        website: "https://www.behive.fit"
      },
      logo: "http://ssl.gstatic.com/accounts/ui/avatar_2x.png"
    };
  }

  componentDidMount() {
    this.retrieveUsers();
  }

  onChangeUser(e) {
    const index = e.target.value;
    const user = this.state.users[index];
    this.setState({
      userIndex: index,
      user: user
    });
  };

  onChangeNumber(e) {
    const number = e.target.value;
    this.setState({
      address: {...this.state.address, number: number}
    });
  };

  onChangeZipCode(e) {
    const zipCode = zipMask(e.target.value);
    this.setState({
      address: {...this.state.address, zipCode: zipCode}
    });
    if(zipCode.length ===9){
      consultarCep(zipCode).then((response) => {
        this.setState({
          address: {
            ...this.state.address, 
            street: response.logradouro,
            neighborhood: response.bairro,
            city: response.localidade,
            state: response.uf
          }
        });
      });
      this.inputNumber.current.focus();
    }
  };

  onChangeFacebook(e) {
    const url = e.target.value;
    this.setState({
      socialMedia: {
        ...this.state.socialMedia, 
        facebook: url
      }
    });
    console.log("Open:"+this.state.socialMedia)
  };

  onChangeInstagram(e) {
    const url = e.target.value;
    this.setState({
      socialMedia: {
        ...this.state.socialMedia, 
        instagram: url
      }
    });
    console.log("Open:"+this.state.socialMedia)
  };

  onChangeTwitter(e) {
    const url = e.target.value;
    this.setState({
      socialMedia: {
        ...this.state.socialMedia, 
        twitter: url
      }
    });
    console.log("Open:"+this.state.socialMedia)
  };

  onChangeLinkedin(e) {
    const url = e.target.value;
    this.setState({
      socialMedia: {
        ...this.state.socialMedia, 
        linkedin: url
      }
    });
    console.log("Open:"+this.state.socialMedia)
  };

  onChangeWebsite(e) {
    const url = e.target.value;
    this.setState({
      socialMedia: {
        ...this.state.socialMedia, 
        website: url
      }
    });
    console.log("Open:"+this.state.socialMedia)
  };

  onChangeLogo(e) {
    const logo = e.target.value;
    this.setState({
      logo: logo
    });
  };

  retrieveUsers(e) {
    AuthService.getAll().then(
      response => {
        this.setState({
          users: response.data
        });
      }
    )
    .catch(e => {
      console.log(e);
    });
  }

  handleSubmit (e) {
    e.preventDefault();
    
    this.setState({
      message: "",
      successful: false,
      loading: true
    });

    this.form.current.validateAll();

    if (this.checkBtn.current.context._errors.length === 0) {
      const {user, address, socialMedia, logo} = this.state;
      CustomerService.create(user, address, socialMedia, logo).then(
        (response) => {
          this.setState({
            message: response.data.message,
            successful: true,
            loading: false
          });
        },
        (error) => {
          const resMessage =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();

            this.setState({
              message: resMessage,
              successful: false,
              loading: false
            });
        }
      );
    } else {
      this.setState({
        successful: false,
        loading: false
    });
    }
  };

  render() {
    const { users, loading, message, successful, userIndex, address, socialMedia, logo } = this.state;    
    return (
      <>
        <div className="container section-inner">
          <h4>Cadastrar Aluno</h4>
          <div className="col-md-12">
            <div className="card card-container">
              <Form onSubmit={this.handleSubmit} ref={this.form}>
                {!successful && (
                  <div>
                  <div className="form-group-horizontal">
                    <label className="dark-label" htmlFor="user">Logo URL:</label>
                    <Input
                      type="text"
                      className="form-control"
                      name="logo"
                      value={logo}
                      onChange={this.onChangeLogo}
                      validations={[required, vlogo]}
                    />  
                    {"___"}
                    <a href="https://imgur.com/upload" target="_blank" rel="noopener noreferrer">
                      <FontAwesomeIcon icon={faImages} size="2x" color="red"/>
                    </a>
                  </div>  
                  <br/>                
                  <img ref={this.image}
                    src={logo}
                    alt="profile-img"
                    className="profile-img-card"
                  />      
                  <div className="form-group">
                    <label className="dark-label" htmlFor="user">Usuário</label>
                    {users &&(
                      <Select name='user'
                        className="form-control"
                        value={userIndex}
                        onChange={this.onChangeUser}
                        validations={[required]}
                      >
                        {users.map((user, index) => (
                          <option value={index}>{user.userName+" ("+user.cpf+")"}</option>
                        ))}
                    </Select>    
                    )}
                  </div>
                  <div className="form-group">
                    <label className="dark-label" htmlFor="zipCode">CEP</label>
                    <Input
                      type="text"
                      className="form-control"
                      name="zipCode"
                      value={address.zipCode}
                      onChange={this.onChangeZipCode}
                      validations={[required, vzipcode]}
                      maxLength="9"
                    />        
                  </div>
                  <div className="form-group">
                    <label className="dark-label" htmlFor="street">Rua</label>
                    <Input
                      type="text"
                      className="form-control"
                      name="street"
                      value={address.street}
                      validations={[required]}
                      maxLength="255"
                      disabled
                    />        
                  </div>
                  <div className="form-group">
                    <label className="dark-label" htmlFor="number">N°/Complemento</label>
                    <input
                      ref={this.inputNumber}
                      type="text"
                      className="form-control"
                      name="number"
                      value={address.number}
                      onChange={this.onChangeNumber}
                      validations={[required]}
                      maxLength="255"
                    />            
                  </div>
                  <div className="form-group">
                    <label className="dark-label" htmlFor="neighborhood">Bairro</label>
                    <Input
                      type="text"
                      className="form-control"
                      name="neighborhood"
                      value={address.neighborhood}
                      validations={[required]}
                      maxLength="255"
                      disabled
                    />        
                  </div>
                  <div className="form-group">
                    <label className="dark-label" htmlFor="city">Cidade</label>
                    <Input
                      type="text"
                      className="form-control"
                      name="city"
                      value={address.city}
                      validations={[required]}
                      maxLength="255"
                      disabled
                    />        
                  </div>
                  <div className="form-group">
                    <label className="dark-label" htmlFor="state">Estado</label>
                    <Input
                      type="text"
                      className="form-control"
                      name="state"
                      value={address.state}
                      validations={[required]}
                      maxLength="255"
                      disabled
                    />        
                  </div>
                <br/>
                <Collapsible trigger="Mídias Sociais">
                  <div className="border-panel">
                    <div className="form-group">                  
                      <table className="dark-label">
                        <tr>
                          <th>     
                            <FontAwesomeIcon icon={faFacebook} />
                            {" "} Facebook
                          </th>
                          <th>
                            <Input
                              type="text"
                              className="form-control"
                              name="facebook"
                              value={socialMedia.facebook}
                              onChange={this.onChangeFacebook}
                              validations={[required]}        
                            />            
                          </th>
                        </tr>
                        <tr>
                          <th>  
                            <FontAwesomeIcon icon={faInstagram} />
                            {" "} Instagram
                          </th>
                          <th>
                            <Input
                              type="text"
                              className="form-control"
                              name="instagram"
                              value={socialMedia.instagram}
                              onChange={this.onChangeInstagram}
                              validations={[required]}        
                            />            
                          </th>
                        </tr>
                        <tr>
                          <th>  
                            <FontAwesomeIcon icon={faTwitter} />
                            {" "} Twitter
                          </th>
                          <th>
                            <Input
                              type="text"
                              className="form-control"
                              name="twitter"
                              value={socialMedia.twitter}
                              onChange={this.onChangeTwitter}
                              validations={[required]}        
                            />            
                          </th>
                        </tr>
                        <tr>
                          <th>   
                            <FontAwesomeIcon icon={faLinkedin} />
                            {" "} Linkedin
                          </th>
                          <th>
                            <Input
                              type="text"
                              className="form-control"
                              name="linkedin"
                              value={socialMedia.linkedin}
                              onChange={this.onChangeLinkedin}
                              validations={[required]}        
                            />            
                          </th>
                        </tr>
                        <tr>
                          <th>   
                            <FontAwesomeIcon icon={faWeebly} />
                            {" "} Website
                          </th>
                          <th>
                            <Input
                              type="text"
                              className="form-control"
                              name="website"
                              value={socialMedia.website}
                              onChange={this.onChangeWebsite}
                              validations={[required]}        
                            />            
                          </th>
                        </tr>
                      </table>
                    </div>
                  </div>
                </Collapsible>
                <br/>
                  <div className="form-group">
                    <button className="button button-primary button-wide-mobile button-block" disabled={loading}>
                      {loading && (
                        <span className="spinner-border spinner-border-sm"></span>
                      )}
                      <span>Cadastrar</span>
                    </button>
                  </div>
                  </div>
                )}

                  {message && (
                    <div className="form-group">
                      <div
                        className={ successful ? "alert alert-success" : "alert alert-danger" }
                        role="alert"
                      >
                        {message}
                      </div>
                    </div>
                  )}
                  <CheckButton style={{ display: "none" }} ref={this.checkBtn} />
              </Form>
            </div>
          </div>
        </div>

      </>
    );
  }
}
