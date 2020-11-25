import React, { Component, createRef } from "react";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";
import Select from "react-validation/build/select";

import AuthService from "../../services/auth.service";
import {cnpjMask} from "../auth/CnpjMask"
import {phoneMask} from "../auth/PhoneMask"
import {zipMask} from "../auth/ZipMask"
import { cnpj } from 'cpf-cnpj-validator'; 
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

const vcnpj = (value) => {
  value = cnpjMask(value)
  if (!cnpj.isValid(value)) {
    return (
      <div className="alert alert-danger" role="alert">
        CNPJ inválido!
      </div>
    );
  }
};

const vphone = (value) => {
  value = phoneMask(value)
  if (!(value.length === 14 || value.length === 15)) {
    return (
      <div className="alert alert-danger" role="alert">
        Telefone inválido!
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

const vhighprice = (value) => {
  if (value < 100) {
    return (
      <div className="alert alert-danger" role="alert">
        Valor com ACRÉSCIMO precisa ser igual ou maior que 100%!
      </div>
    );
  }
};

const vlowprice = (value) => {
  if (value > 100) {
    return (
      <div className="alert alert-danger" role="alert">
        Valor com desconto precisa ser menor ou igual a 100%!
      </div>
    );
  }
};

export default class CreateGym extends Component {
  constructor(props) {
    super(props);
    this.retrieveUsers = this.retrieveUsers.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.onChangeCnpj = this.onChangeCnpj.bind(this);
    this.onChangeUser = this.onChangeUser.bind(this);
    this.onChangeBrandName = this.onChangeBrandName.bind(this);
    this.onChangeCompanyName = this.onChangeCompanyName.bind(this);
    this.onChangePhone = this.onChangePhone.bind(this);
    this.onChangeNumber = this.onChangeNumber.bind(this);
    this.onChangeZipCode = this.onChangeZipCode.bind(this);
    this.onChangePrice = this.onChangePrice.bind(this);
    this.onChangeHighPricePct = this.onChangeHighPricePct.bind(this);
    this.onChangeLowPricePct = this.onChangeLowPricePct.bind(this);

    this.form = createRef();
    this.checkBtn = createRef();
    this.inputNumber = createRef();

    this.state = {
      users: [],
      loading: false,
      message: null,
      userIndex: null,
      user: null,
      cnpj: null,
      phone: null,
      address: {},
      price: null,
      highPricePct: null,
      lowPricePct: null,
      workHours: {
        monday: {
          day: "Segunda",
          open: "06:00",
          close: "22:00"
        },
        tuesday: {
          day: "Terça",
          open: "06:00",
          close: "22:00"
        },
        wednesday: {
          day: "Quarta",
          open: "06:00",
          close: "22:00"
        },
        thursday: {
          day: "Quinta",
          open: "06:00",
          close: "22:00"
        },
        friday: {
          day: "Sexta",
          open: "06:00",
          close: "22:00"
        },
        saturday: {
          day: "Sábado",
          open: "06:00",
          close: "22:00"
        },
        sunday: {
          day: "Domingo",
          open: "06:00",
          close: "22:00"
        }
      }
    };
  }

  componentDidMount() {
    this.retrieveUsers();
  }

  onChangeCnpj(e) {
    const cnpj = cnpjMask(e.target.value);
    this.setState({
      cnpj: cnpj
    });
  };

  onChangeUser(e) {
    const index = e.target.value;
    const user = this.state.users[index];
    this.setState({
      userIndex: index,
      user: user
    });
  };

  onChangeBrandName(e) {
    const brandName = e.target.value;
    this.setState({
      brandName: brandName
    });
  };

  onChangeCompanyName(e) {
    const companyName = e.target.value;
    this.setState({
      companyName: companyName
    });
  };

  onChangePhone(e) {
    const phone = phoneMask(e.target.value);
    this.setState({
      phone: phone
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

  onChangePrice(e) {
    const price = e.target.value;
    this.setState({
      price: price
    });
  };

  onChangeHighPricePct(e) {
    const highPricePct = e.target.value;
    this.setState({
      highPricePct: highPricePct
    });
  };

  onChangeLowPricePct(e) {
    const lowPricePct = e.target.value;
    this.setState({
      lowPricePct: lowPricePct
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
      loading: true
    });

    this.form.current.validateAll();

    if (this.checkBtn.current.context._errors.length === 0) {
      this.GymService.create(cnpj).then(
        () => {
          this.setState({
            message: "Sucesso na falha!",
            loading: false
          });
          //props.history.push("/");
          //window.location.reload();
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
              loading: false
            });
        }
      );
    } else {
      this.setState({
        loading: false
    });
    }
  };

  render() {
    const { users, loading, message, userIndex, cnpj, brandName, companyName, phone, address, 
      price, highPricePct, lowPricePct, workHours } = this.state;    
    return (
      <>
        <div className="container section-inner">
          <h4>Cadastrar Academia</h4>
          <div className="col-md-12">
            <div className="card card-container">
                <img
                src="//ssl.gstatic.com/accounts/ui/avatar_2x.png"
                alt="profile-img"
                className="profile-img-card"
              />
              <Form onSubmit={this.handleSubmit} ref={this.form}>
                <div className="form-group">
                  <label className="dark-label" htmlFor="user">Representante:</label>
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
                  <label className="dark-label" htmlFor="cnpj">CNPJ</label>
                  <Input
                    type="text"
                    className="form-control"
                    name="cnpj"
                    value={cnpj}
                    onChange={this.onChangeCnpj}
                    validations={[required, vcnpj]}
                    maxLength="18"
                  />            
                </div>
                <div className="form-group">
                  <label className="dark-label" htmlFor="brandname">Nome Fantasia:</label>
                  <Input
                    type="text"
                    className="form-control"
                    name="brandName"
                    value={brandName}
                    onChange={this.onChangeBrandName}
                    validations={[required]}
                    maxLength="255"
                  />            
                </div>
                <div className="form-group">
                  <label className="dark-label" htmlFor="companyName">Razão Social:</label>
                  <Input
                    type="text"
                    className="form-control"
                    name="companyName"
                    value={companyName}
                    onChange={this.onChangeCompanyName}
                    validations={[required]}
                    maxLength="255"
                  />            
                </div>
                <div className="form-group">
                  <label className="dark-label" htmlFor="phone">Telefone:</label>
                  <Input
                    type="text"
                    className="form-control"
                    name="phone"
                    value={phone}
                    onChange={this.onChangePhone}
                    validations={[required, vphone]}
                    maxLength="15"
                    placeHolder="(XX) XXXX-XXXX"
                  />            
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
                <div className="form-group">
                  <label className="dark-label" htmlFor="price">Preço base da hora/aula:</label>
                  R$
                  <Input
                    type="number"
                    className="form-control"
                    name="price"
                    value={price}
                    onChange={this.onChangePrice}
                    validations={[required]}
                    placeHolder="Sugestão de mercado: R$6"
                  />            
                </div>
                <div className="form-group">
                  <label className="dark-label" htmlFor="highPricePct">Preço com acréscimo:</label>
                  %
                  <Input
                    type="number"
                    className="form-control"
                    name="highPricePct"
                    value={highPricePct}
                    onChange={this.onChangeHighPricePct}
                    validations={[required, vhighprice]}
                    placeHolder="Sugestão de mercado: 120%"                  
                  />            
                </div>
                <div className="form-group">
                  <label className="dark-label" htmlFor="lowPricePct">Preço com acréscimo:</label>
                  %
                  <Input
                    type="number"
                    className="form-control"
                    name="lowPricePct"
                    value={lowPricePct}
                    onChange={this.onChangeLowPricePct}
                    validations={[required, vlowprice]}
                    placeHolder="Sugestão de mercado: 80%"                  
                  />            
                </div>
                <div className="form-group">
                  <label className="dark-label" htmlFor="username">Funcionamento</label>
                   
                  <table className="dark-label">
                      <tr>
                        <th>DIA</th>
                        <th>ABERTURA</th>
                        <th>ENCERRAMENTO</th>
                      </tr>
                      <tr>
                        <th>     
                          {workHours.monday.day}
                        </th>
                        <th>
                          <Input
                            type="time"
                            className="form-control"
                            name="mondayOpen"
                            value={workHours.monday.open}
                            onChange={this.onChangeMondayOpen}
                            validations={[required]}        
                          />            
                        </th>
                        <th>
                          <Input
                            type="time"
                            className="form-control"
                            name="mondayClose"
                            value={workHours.monday.close}
                            onChange={this.onChangeMondayClose}
                            validations={[required]}        
                          />     
                        </th>
                      </tr>
                      <tr>
                        <th>
                          {workHours.tuesday.day}
                        </th>
                        <th>
                          <Input
                            type="time"
                            className="form-control"
                            name="tuesdayOpen"
                            value={workHours.tuesday.open}
                            onChange={this.onChangeTuesdayOpen}
                            validations={[required]}        
                          />            
                        </th>
                        <th>
                          <Input
                            type="time"
                            className="form-control"
                            name="tuesdayClose"
                            value={workHours.tuesday.close}
                            onChange={this.onChangeTuesdayClose}
                            validations={[required]}        
                          />     
                        </th>
                      </tr>
                      <tr>
                        <th>
                          {workHours.wednesday.day}
                        </th>
                        <th>
                          <Input
                            type="time"
                            className="form-control"
                            name="wednesdayOpen"
                            value={workHours.wednesday.open}
                            onChange={this.onChangeWednesdayOpen}
                            validations={[required]}        
                          />            
                        </th>
                        <th>
                          <Input
                            type="time"
                            className="form-control"
                            name="wednesdayClose"
                            value={workHours.wednesday.close}
                            onChange={this.onChangeWednesdayClose}
                            validations={[required]}        
                          />     
                        </th>
                      </tr>
                      <tr>
                        <th>
                          {workHours.thursday.day}
                        </th>
                        <th>
                          <Input
                            type="time"
                            className="form-control"
                            name="thursdayOpen"
                            value={workHours.thursday.open}
                            onChange={this.onChangeThursdayOpen}
                            validations={[required]}        
                          />            
                        </th>
                        <th>
                          <Input
                            type="time"
                            className="form-control"
                            name="thursdayClose"
                            value={workHours.thursday.close}
                            onChange={this.onChangeThursdayClose}
                            validations={[required]}        
                          />     
                        </th>
                      </tr>
                      <tr>
                        <th>
                          {workHours.friday.day}
                        </th>
                        <th>
                          <Input
                            type="time"
                            className="form-control"
                            name="fridayOpen"
                            value={workHours.friday.open}
                            onChange={this.onChangeFridayOpen}
                            validations={[required]}        
                          />            
                        </th>
                        <th>
                          <Input
                            type="time"
                            className="form-control"
                            name="fridayClose"
                            value={workHours.friday.close}
                            onChange={this.onChangefridayClose}
                            validations={[required]}        
                          />     
                        </th>
                      </tr>
                      <tr>
                        <th>
                          {workHours.saturday.day}
                        </th>
                        <th>
                          <Input
                            type="time"
                            className="form-control"
                            name="saturdayOpen"
                            value={workHours.saturday.open}
                            onChange={this.onChangeSaturdayOpen}
                            validations={[required]}        
                          />            
                        </th>
                        <th>
                          <Input
                            type="time"
                            className="form-control"
                            name="saturdayClose"
                            value={workHours.saturday.close}
                            onChange={this.onChangeSaturdayClose}
                            validations={[required]}        
                          />     
                        </th>
                      </tr>
                      <tr>
                        <th>
                          {workHours.sunday.day}
                        </th>
                        <th>
                          <Input
                            type="time"
                            className="form-control"
                            name="sundayOpen"
                            value={workHours.sunday.open}
                            onChange={this.onChangeSundayOpen}
                            validations={[required]}        
                          />            
                        </th>
                        <th>
                          <Input
                            type="time"
                            className="form-control"
                            name="sundayClose"
                            value={workHours.sunday.close}
                            onChange={this.onChangeSundayClose}
                            validations={[required]}        
                          />     
                        </th>
                      </tr>
                    </table> 
                </div>
                <div className="form-group">
                  <label className="dark-label" htmlFor="username">Mídias Sociais</label>
                  <Input
                    type="text"
                    className="form-control"
                    name="cnpj"
                    value={cnpj}
                    onChange={this.onChangeCnpj}
                    validations={[required, vcnpj]}
                  />            
                </div>
                <br/>
                <div className="form-group">
                  <button className="button button-primary button-wide-mobile button-block" disabled={loading}>
                    {loading && (
                      <span className="spinner-border spinner-border-sm"></span>
                    )}
                    <span>Cadastrar</span>
                  </button>
                </div>

                {message && (
                  <div className="form-group">
                    <div className="alert alert-danger" role="alert">
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
