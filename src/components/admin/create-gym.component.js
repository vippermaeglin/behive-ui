import React, { Component, createRef } from "react";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";
import Select from "react-validation/build/select";
import Collapsible from 'react-collapsible';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFacebook, faInstagram, faTwitter, faLinkedin, faWeebly } from '@fortawesome/free-brands-svg-icons'
import { faImages } from '@fortawesome/free-solid-svg-icons'

import AuthService from "../../services/auth.service";
import GymService from "../../services/gym.service";
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
        Valor com DESCONTO precisa ser menor ou igual a 100%!
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
    this.retrieveGym = this.retrieveGym.bind(this);
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
    this.onChangeMondayOpen = this.onChangeMondayOpen.bind(this);
    this.onChangeMondayClose = this.onChangeMondayClose.bind(this);
    this.onChangeTuesdayOpen = this.onChangeTuesdayOpen.bind(this);
    this.onChangeTuesdayClose = this.onChangeTuesdayClose.bind(this);
    this.onChangeWednesdayOpen = this.onChangeWednesdayOpen.bind(this);
    this.onChangeWednesdayClose = this.onChangeWednesdayClose.bind(this);
    this.onChangeThursdayOpen = this.onChangeThursdayOpen.bind(this);
    this.onChangeThursdayClose = this.onChangeThursdayClose.bind(this);
    this.onChangeFridayOpen = this.onChangeFridayOpen.bind(this);
    this.onChangeFridayClose = this.onChangeFridayClose.bind(this);
    this.onChangeSaturdayOpen = this.onChangeSaturdayOpen.bind(this);
    this.onChangeSaturdayClose = this.onChangeSaturdayClose.bind(this);
    this.onChangeSundayOpen = this.onChangeSundayOpen.bind(this);
    this.onChangeSundayClose = this.onChangeSundayClose.bind(this);
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
      isNew: true,
      users: [],
      loading: false,
      message: null,
      userIndex: "",
      user: null,
      cnpj: null,
      companyName: null,
      brandName: null,
      commercialPhone: null,
      address: {},
      price: 6,
      highPricePct: 120,
      lowPricePct: 80,
      workHours: [
        {
          daysOfWeek: [
            0
          ],
          day: "Domingo",
          startTime: "06:00",
          endTime: "22:00"
        },
        {
          daysOfWeek: [
            1
          ],
          day: "Segunda",
          startTime: "06:00",
          endTime: "22:00"
        },
        {
          daysOfWeek: [
            2
          ],
          day: "Terça",
          startTime: "06:00",
          endTime: "22:00"
        },
        {
          daysOfWeek: [
            3
          ],
          day: "Quarta",
          startTime: "06:00",
          endTime: "22:00"
        },
        {
          daysOfWeek: [
            4
          ],
          day: "Quinta",
          startTime: "06:00",
          endTime: "22:00"
        },
        {
          daysOfWeek: [
            5
          ],
          day: "Sexta",
          startTime: "06:00",
          endTime: "22:00"
        },
        {
          daysOfWeek: [
            6
          ],
          day: "Sábado",
          startTime: "06:00",
          endTime: "22:00"
        }
      ],
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
    if(this.props.match.params.id !== "new"){
      this.retrieveGym(this.props.match.params.id);
      this.setState({
        isNew: false
      });
    }
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
    console.log("onChangeUser");
    console.log(user);
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
      commercialPhone: phone
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

  onChangeMondayOpen(e) {
    const open = e.target.value;
    console.log("Monday open: "+open);
    this.setState(({workHours}) => ({
      workHours: [
          ...workHours.slice(0,1),
          {
              ...workHours[1],
              startTime: open
          },
          ...workHours.slice(2,7)
      ]
    }));
    console.log(this.state.workHours)
  };

  onChangeMondayClose(e) {
    const close = e.target.value;
    this.setState(({workHours}) => ({
      workHours: [
          ...workHours.slice(0,1),
          {
              ...workHours[1],
              endTime: close
          },
          ...workHours.slice(2,7)
      ]
    }));
    console.log(this.state.workHours)
  };

  onChangeTuesdayOpen(e) {
    const open = e.target.value;
    this.setState(({workHours}) => ({
      workHours: [
          ...workHours.slice(0,2),
          {
              ...workHours[2],
              startTime: open
          },
          ...workHours.slice(3,7)
      ]
    }));
  };

  onChangeTuesdayClose(e) {
    const close = e.target.value;
    this.setState(({workHours}) => ({
      workHours: [
          ...workHours.slice(0,2),
          {
              ...workHours[2],
              endTime: close
          },
          ...workHours.slice(3,7)
      ]
    }));
  };

  onChangeWednesdayOpen(e) {
    const open = e.target.value;
    this.setState(({workHours}) => ({
      workHours: [
          ...workHours.slice(0,3),
          {
              ...workHours[3],
              startTime: open
          },
          ...workHours.slice(4,7)
      ]
    }));
  };

  onChangeWednesdayClose(e) {
    const close = e.target.value;
    this.setState(({workHours}) => ({
      workHours: [
          ...workHours.slice(0,3),
          {
              ...workHours[3],
              endTime: close
          },
          ...workHours.slice(4,7)
      ]
    }));
  };

  onChangeThursdayOpen(e) {
    const open = e.target.value;
    this.setState(({workHours}) => ({
      workHours: [
          ...workHours.slice(0,4),
          {
              ...workHours[4],
              startTime: open
          },
          ...workHours.slice(5,7)
      ]
    }));
  };

  onChangeThursdayClose(e) {
    const close = e.target.value;
    this.setState(({workHours}) => ({
      workHours: [
          ...workHours.slice(0,4),
          {
              ...workHours[4],
              endTime: close
          },
          ...workHours.slice(5,7)
      ]
    }));
  };

  onChangeFridayOpen(e) {
    const open = e.target.value;
    this.setState(({workHours}) => ({
      workHours: [
          ...workHours.slice(0,5),
          {
              ...workHours[5],
              startTime: open
          },
          ...workHours.slice(6,7)
      ]
    }));
  };

  onChangeFridayClose(e) {
    const close = e.target.value;
    this.setState(({workHours}) => ({
      workHours: [
          ...workHours.slice(0,5),
          {
              ...workHours[5],
              endTime: close
          },
          ...workHours.slice(6,7)
      ]
    }));
  };

  onChangeSaturdayOpen(e) {
    const open = e.target.value;
    this.setState(({workHours}) => ({
      workHours: [
          ...workHours.slice(0,6),
          {
              ...workHours[6],
              startTime: open
          }
      ]
    }));
  };

  onChangeSaturdayClose(e) {
    const close = e.target.value;
    this.setState(({workHours}) => ({
      workHours: [
          ...workHours.slice(0,6),
          {
              ...workHours[6],
              endTime: close
          }
      ]
    }));
  };

  onChangeSundayOpen(e) {
    const open = e.target.value;
    this.setState(({workHours}) => ({
      workHours: [
          {
              ...workHours[0],
              startTime: open
          },
          ...workHours.slice(1,7)
      ]
    }));
  };

  onChangeSundayClose(e) {
    const close = e.target.value;
    this.setState(({workHours}) => ({
      workHours: [
          {
              ...workHours[0],
              endTime: close
          },
          ...workHours.slice(1,7)
      ]
    }));
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

  retrieveGym(id) {
    GymService.getGymById(id).then(
      response => {
        let g = response.data[0]
        this.setState({
          isNew: false,
          users: [g.user],
          userIndex: 1,
          user: g.user,
          cnpj: g.cnpj,
          brandName: g.brandName,
          companyName: g.companyName,
          commercialPhone: g.commercialPhone,
          address: g.address,
          price: g.price,
          highPricePct: g.highPricePct,
          lowPricePct: g.lowPricePct,
          workHours: g.workHours,
          socialMedia: g.socialMedia,
          logo: g.logo
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
      const {user, cnpj, brandName, companyName, commercialPhone, address, 
        price, highPricePct, lowPricePct, workHours, socialMedia, logo} = this.state;
      GymService.create(address, brandName, cnpj, commercialPhone, companyName, highPricePct,
        lowPricePct, price, socialMedia, user, workHours, logo).then(
        () => {
          this.setState({
            loading: false
          });
          this.props.history.push("/");
          window.location.reload();
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
    const { isNew, users, loading, message, userIndex, user, cnpj, brandName, companyName, commercialPhone, address, 
      price, highPricePct, lowPricePct, workHours, socialMedia, logo } = this.state;    
    return (
      <>
        <div className="container section-inner">
          <h4>Cadastrar Academia</h4>
          <div className="col-md-12">
            <div className="card card-container">
              <Form onSubmit={this.handleSubmit} ref={this.form}>
                <div className="form-group">
                  <label className="dark-label" htmlFor="user">
                    Logo URL ---
                    <a href="https://imgur.com/upload" target="_blank" rel="noopener noreferrer">
                      <FontAwesomeIcon icon={faImages} size="2x" color="red"/>
                    </a>
                  </label>
                  <Input
                    type="text"
                    className="form-control"
                    name="logo"
                    value={logo}
                    onChange={this.onChangeLogo}
                    validations={[required, vlogo]}
                  />  
                </div>  
                <br/>                
                <img ref={this.image}
                  src={logo}
                  alt="profile-img"
                  className="profile-img-card"
                />      
                <div className="form-group">
                  <label className="dark-label" htmlFor="user">Representante</label>
                  {users &&(
                    <Select name='user'
                      className="form-control"
                      value={userIndex}
                      onChange={this.onChangeUser}
                      validations={[required]}
                    >
                      <option value="">Selecione...</option>
                      {isNew && users.map((u, index) => (
                        <option value={index} key={index}>{u.userName+" ("+u.cpf+")"}</option>
                      ))}
                      {!isNew && user && (
                        <option value={1}>{user.userName+" ("+user.cpf+")"}</option>
                      )}
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
                  <label className="dark-label" htmlFor="brandname">Nome Fantasia</label>
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
                  <label className="dark-label" htmlFor="companyName">Razão Social</label>
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
                  <label className="dark-label" htmlFor="commercialPhone">Telefone</label>
                  <Input
                    type="text"
                    className="form-control"
                    name="commercialPhone"
                    value={commercialPhone}
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
                <br/>
                <Collapsible trigger="Precificação">
                  <div className="border-panel">
                    <div className="form-group">
                      <label className="dark-label" htmlFor="price">Preço base da hora/aula</label>
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
                      <label className="dark-label" htmlFor="lowPricePct">Preço com desconto</label>
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
                      <label className="dark-label" htmlFor="highPricePct">Preço com acréscimo</label>
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
                  </div>
                </Collapsible>
                <br/>
                <Collapsible trigger="Atendimento">
                  <div className="border-panel">
                    <div className="form-group">                
                      <table className="dark-label">
                          <tr>
                            <th>DIA</th>
                            <th>INÍCIO</th>
                            <th>FIM</th>
                          </tr>
                          <tr>
                            <th>     
                              {workHours[1].day}
                            </th>
                            <th>
                              <Input
                                type="time"
                                className="form-control"
                                name="mondayOpen"
                                value={workHours[1].startTime}
                                onChange={this.onChangeMondayOpen}
                                validations={[required]}        
                              />            
                            </th>
                            <th>
                              <Input
                                type="time"
                                className="form-control"
                                name="mondayClose"
                                value={workHours[1].endTime}
                                onChange={this.onChangeMondayClose}
                                validations={[required]}        
                              />     
                            </th>
                          </tr>
                          <tr>
                            <th>
                              {workHours[2].day}
                            </th>
                            <th>
                              <Input
                                type="time"
                                className="form-control"
                                name="tuesdayOpen"
                                value={workHours[2].startTime}
                                onChange={this.onChangeTuesdayOpen}
                                validations={[required]}        
                              />            
                            </th>
                            <th>
                              <Input
                                type="time"
                                className="form-control"
                                name="tuesdayClose"
                                value={workHours[2].endTime}
                                onChange={this.onChangeTuesdayClose}
                                validations={[required]}        
                              />     
                            </th>
                          </tr>
                          <tr>
                            <th>
                              {workHours[3].day}
                            </th>
                            <th>
                              <Input
                                type="time"
                                className="form-control"
                                name="wednesdayOpen"
                                value={workHours[3].startTime}
                                onChange={this.onChangeWednesdayOpen}
                                validations={[required]}        
                              />            
                            </th>
                            <th>
                              <Input
                                type="time"
                                className="form-control"
                                name="wednesdayClose"
                                value={workHours[3].endTime}
                                onChange={this.onChangeWednesdayClose}
                                validations={[required]}        
                              />     
                            </th>
                          </tr>
                          <tr>
                            <th>
                              {workHours[4].day}
                            </th>
                            <th>
                              <Input
                                type="time"
                                className="form-control"
                                name="thursdayOpen"
                                value={workHours[4].startTime}
                                onChange={this.onChangeThursdayOpen}
                                validations={[required]}        
                              />            
                            </th>
                            <th>
                              <Input
                                type="time"
                                className="form-control"
                                name="thursdayClose"
                                value={workHours[4].endTime}
                                onChange={this.onChangeThursdayClose}
                                validations={[required]}        
                              />     
                            </th>
                          </tr>
                          <tr>
                            <th>
                              {workHours[5].day}
                            </th>
                            <th>
                              <Input
                                type="time"
                                className="form-control"
                                name="fridayOpen"
                                value={workHours[5].startTime}
                                onChange={this.onChangeFridayOpen}
                                validations={[required]}        
                              />            
                            </th>
                            <th>
                              <Input
                                type="time"
                                className="form-control"
                                name="fridayClose"
                                value={workHours[5].endTime}
                                onChange={this.onChangeFridayClose}
                                validations={[required]}        
                              />     
                            </th>
                          </tr>
                          <tr>
                            <th>
                              {workHours[6].day}
                            </th>
                            <th>
                              <Input
                                type="time"
                                className="form-control"
                                name="saturdayOpen"
                                value={workHours[6].startTime}
                                onChange={this.onChangeSaturdayOpen}
                                validations={[required]}        
                              />            
                            </th>
                            <th>
                              <Input
                                type="time"
                                className="form-control"
                                name="saturdayClose"
                                value={workHours[6].endTime}
                                onChange={this.onChangeSaturdayClose}
                                validations={[required]}        
                              />     
                            </th>
                          </tr>
                          <tr>
                            <th>
                              {workHours[0].day}
                            </th>
                            <th>
                              <Input
                                type="time"
                                className="form-control"
                                name="sundayOpen"
                                value={workHours[0].startTime}
                                onChange={this.onChangeSundayOpen}
                                validations={[required]}        
                              />            
                            </th>
                            <th>
                              <Input
                                type="time"
                                className="form-control"
                                name="sundayClose"
                                value={workHours[0].endTime}
                                onChange={this.onChangeSundayClose}
                                validations={[required]}        
                              />     
                            </th>
                          </tr>
                        </table> 
                    </div>
                  </div>
                </Collapsible>
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
