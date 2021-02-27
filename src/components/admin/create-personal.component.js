import React, { Component, createRef } from "react";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";
import Select from "react-validation/build/select";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFacebook, faInstagram, faTwitter, faLinkedin, faWeebly } from '@fortawesome/free-brands-svg-icons'
import { faImages } from '@fortawesome/free-solid-svg-icons'
import Collapsible from 'react-collapsible';
import Moment from 'moment';

import AuthService from "../../services/auth.service";
import PersonalService from "../../services/personal.service";
import {cnpjMask} from "../auth/CnpjMask"
import {phoneMask} from "../auth/PhoneMask"
import {crefMask} from "../auth/CrefMask"
import {zipMask} from "../auth/ZipMask"
import { cnpj } from 'cpf-cnpj-validator'; 
import { consultarCep } from 'correios-brasil'; 
import { Button } from "reactstrap";

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
  if(value === null || value === "") return;
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
  if(value === null || value === "") return;
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
  if(value === null || value === "") return;
  if (value < 100) {
    return (
      <div className="alert alert-danger" role="alert">
        Valor com ACRÉSCIMO precisa ser igual ou maior que 100%!
      </div>
    );
  }
};

const vlowprice = (value) => {
  if(value === null || value === "") return;
  if (value > 100) {
    return (
      <div className="alert alert-danger" role="alert">
        Valor com DESCONTO precisa ser menor ou igual a 100%!
      </div>
    );
  }
};

const vlogo = (value) => {
  if(value === null || value === "") return;
  const fileType = value.split('.').pop();
  if (fileType !== "jpg" && fileType !== "jpeg" && fileType !== "png" && fileType !== "gif") {
    return (
      <div className="alert alert-danger" role="alert">
        URL precisa terminar em jpg/jpeg/png/gif!
      </div>
    );
  }
};

const vcref = (value) => {
  value = crefMask(value)
  if (value.length < 11) {
    return (
      <div className="alert alert-danger" role="alert">
        CREF inválido!
      </div>
    );
  }
};

export default class CreateGym extends Component {
  constructor(props) {
    super(props);
    this.retrieveUsers = this.retrieveUsers.bind(this);
    this.retrievePersonal = this.retrievePersonal.bind(this);
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
    this.onChangeCref = this.onChangeCref.bind(this);
    this.onChangeCrefExpiration = this.onChangeCrefExpiration.bind(this);
    this.onChangeCertificates = this.onChangeCertificates.bind(this);
    this.onChangeGraduation = this.onChangeGraduation.bind(this);

    this.form = createRef();
    this.checkBtn = createRef();
    this.inputNumber = createRef();
    this.image = createRef();

    this.state = {
      isNew: true,
      users: [],
      loading: false,
      message: null,
      userIndex: null,
      user: null,
      cnpj: null,
      commercialPhone: null,
      address: {},
      price: 6,
      highPricePct: 120,
      lowPricePct: 80,
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
      },
      socialMedia: {
        facebook: "https://www.facebook.com/",
        instagram: "https://www.instagram.com/",
        twitter: "https://twitter.com/",
        linkedin: "https://www.linkedin.com/",
        website: "https://www.behive.fit"
      },
      logo: "http://ssl.gstatic.com/accounts/ui/avatar_2x.png",
      cref: null,
      crefExpiration: null,
      certificates: [],
      graduation: []
    };
  }

  componentDidMount() {
    this.retrieveUsers();
    if(this.props.match.params.id !== "new"){
      this.retrievePersonal(this.props.match.params.id);
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
    this.setState({
      workHours: {
        ...this.state.workHours, 
        monday: {
          ...this.state.workHours.monday,
          open: open  
        }      
      }
    });
    console.log("Open:"+this.state.workHours)
  };

  onChangeMondayClose(e) {
    const close = e.target.value;
    this.setState({
      workHours: {
        ...this.state.workHours, 
        monday: {
          ...this.state.workHours.monday,
          close: close  
        }      
      }
    });
    console.log("Close:"+this.state.workHours)
  };

  onChangeTuesdayOpen(e) {
    const open = e.target.value;
    this.setState({
      workHours: {
        ...this.state.workHours, 
        tuesday: {
          ...this.state.workHours.tuesday,
          open: open  
        }      
      }
    });
    console.log("Open:"+this.state.workHours)
  };

  onChangeTuesdayClose(e) {
    const close = e.target.value;
    this.setState({
      workHours: {
        ...this.state.workHours, 
        tuesday: {
          ...this.state.workHours.tuesday,
          close: close  
        }      
      }
    });
    console.log("Close:"+this.state.workHours)
  };

  onChangeWednesdayOpen(e) {
    const open = e.target.value;
    this.setState({
      workHours: {
        ...this.state.workHours, 
        wednesday: {
          ...this.state.workHours.wednesday,
          open: open  
        }      
      }
    });
    console.log("Open:"+this.state.workHours)
  };

  onChangeWednesdayClose(e) {
    const close = e.target.value;
    this.setState({
      workHours: {
        ...this.state.workHours, 
        wednesday: {
          ...this.state.workHours.wednesday,
          close: close  
        }      
      }
    });
    console.log("Close:"+this.state.workHours)
  };

  onChangeThursdayOpen(e) {
    const open = e.target.value;
    this.setState({
      workHours: {
        ...this.state.workHours, 
        thursday: {
          ...this.state.workHours.thursday,
          open: open  
        }      
      }
    });
    console.log("Open:"+this.state.workHours)
  };

  onChangeThursdayClose(e) {
    const close = e.target.value;
    this.setState({
      workHours: {
        ...this.state.workHours, 
        thursday: {
          ...this.state.workHours.thursday,
          close: close  
        }      
      }
    });
    console.log("Close:"+this.state.workHours)
  };

  onChangeFridayOpen(e) {
    const open = e.target.value;
    this.setState({
      workHours: {
        ...this.state.workHours, 
        friday: {
          ...this.state.workHours.friday,
          open: open  
        }      
      }
    });
    console.log("Open:"+this.state.workHours)
  };

  onChangeFridayClose(e) {
    const close = e.target.value;
    this.setState({
      workHours: {
        ...this.state.workHours, 
        friday: {
          ...this.state.workHours.friday,
          close: close  
        }      
      }
    });
    console.log("Close:"+this.state.workHours)
  };

  onChangeSaturdayOpen(e) {
    const open = e.target.value;
    this.setState({
      workHours: {
        ...this.state.workHours, 
        saturday: {
          ...this.state.workHours.saturday,
          open: open  
        }      
      }
    });
    console.log("Open:"+this.state.workHours)
  };

  onChangeSaturdayClose(e) {
    const close = e.target.value;
    this.setState({
      workHours: {
        ...this.state.workHours, 
        saturday: {
          ...this.state.workHours.saturday,
          close: close  
        }      
      }
    });
    console.log("Close:"+this.state.workHours)
  };

  onChangeSundayOpen(e) {
    const open = e.target.value;
    this.setState({
      workHours: {
        ...this.state.workHours, 
        sunday: {
          ...this.state.workHours.sunday,
          open: open  
        }      
      }
    });
    console.log("Open:"+this.state.workHours)
  };

  onChangeSundayClose(e) {
    const close = e.target.value;
    this.setState({
      workHours: {
        ...this.state.workHours, 
        sunday: {
          ...this.state.workHours.sunday,
          close: close  
        }      
      }
    });
    console.log("Close:"+this.state.workHours)
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

  onChangeCref(e) {
    const cref = crefMask(e.target.value);
    this.setState({
      cref: cref
    });
  };

  onChangeCrefExpiration(e) {
    const crefExpiration = e.target.value;
    this.setState({
      crefExpiration: crefExpiration
    });
  };

  onChangeCertificates(e) {
    const certificates = e.target.value;
    this.setState({
      certificates: certificates
    });
  };

  onChangeGraduation(e) {
    const graduation = e.target.value;
    this.setState({
      graduation: graduation
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

  retrievePersonal(id) {
    console.log("Retrieving personal "+id)
    PersonalService.getPersonalById(id).then(
      response => {
        console.log("Retrieving personal Success!")
        console.log(response.data)
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
          logo: g.logo,
          cref: g.cref,
          crefExpiration: Moment(g.crefExpiration, "DD/MM/YYYY").format("YYYY-MM-DD"),
          certificates: g.certificates,
          graduation: g.graduation
        });
      }
    )
    .catch(e => {
      console.log("Retrieving Gym Error!")
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
      const {user, cnpj, brandName, companyName, commercialPhone, address, price, highPricePct, 
        lowPricePct, workHours, socialMedia, logo, cref, crefExpiration, certificates, graduation} = this.state;
      PersonalService.create(address, brandName, cnpj, commercialPhone, companyName, highPricePct,
        lowPricePct, price, socialMedia, user, workHours, logo, cref, Moment(crefExpiration).format('DD/MM/yyyy'), certificates, graduation).then(
        () => {
          this.setState({
            loading: false
          });
          this.props.history.push("/dashboard");
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
      price, highPricePct, lowPricePct, workHours, socialMedia, logo, cref, crefExpiration, /*certificates, graduation*/ } = this.state;    
    return (
      <>
        <div className="container section-inner">
          <h4>Cadastrar Personal Trainer</h4>
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
                    validations={[vlogo]}
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
                    {isNew && users.map((u, index) => (
                      <option value={index}>{u.userName+" ("+u.cpf+")"}</option>
                    ))}
                    {!isNew && user && (
                      <option value={1}>{user.userName+" ("+user.cpf+")"}</option>
                    )}
                  </Select>    
                  )}
                </div>
                <div className="form-group">
                  <label className="dark-label" htmlFor="cnpj">CREF</label>
                  <Input
                    type="text"
                    className="form-control"
                    name="cref"
                    value={cref}
                    onChange={this.onChangeCref}
                    validations={[required, vcref]}
                    maxLength="11"
                    placeHolder="123456-G/UF"
                  />            
                </div>
                <div className="form-group">
                  <label className="dark-label" htmlFor="cnpj">Validade CREF</label>
                  <Input
                    type="date"
                    className="form-control"
                    name="crefExpiration"
                    value={crefExpiration}
                    onChange={this.onChangeCrefExpiration}
                    validations={[required]}
                  />            
                </div>
                <div className="form-group">
                  <label className="dark-label" htmlFor="cnpj">CNPJ</label>
                  <Input
                    type="text"
                    className="form-control"
                    name="cnpj"
                    value={cnpj}
                    onChange={this.onChangeCnpj}
                    validations={[vcnpj]}
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
                    value={address?.zipCode}
                    onChange={this.onChangeZipCode}
                    validations={[vzipcode]}
                    maxLength="9"
                  />        
                </div>
                <div className="form-group">
                  <label className="dark-label" htmlFor="street">Rua</label>
                  <Input
                    type="text"
                    className="form-control"
                    name="street"
                    value={address?.street}
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
                    value={address?.number}
                    onChange={this.onChangeNumber}
                    maxLength="255"
                  />            
                </div>
                <div className="form-group">
                  <label className="dark-label" htmlFor="neighborhood">Bairro</label>
                  <Input
                    type="text"
                    className="form-control"
                    name="neighborhood"
                    value={address?.neighborhood}
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
                    value={address?.city}
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
                    value={address?.state}
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
                        validations={[vlowprice]}
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
                        validations={[vhighprice]}
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
                              {workHours?.monday.day}
                            </th>
                            <th>
                              <Input
                                type="time"
                                className="form-control"
                                name="mondayOpen"
                                value={workHours?.monday.open}
                                onChange={this.onChangeMondayOpen}
                              />            
                            </th>
                            <th>
                              <Input
                                type="time"
                                className="form-control"
                                name="mondayClose"
                                value={workHours?.monday.close}
                                onChange={this.onChangeMondayClose}
                              />     
                            </th>
                          </tr>
                          <tr>
                            <th>
                              {workHours?.tuesday.day}
                            </th>
                            <th>
                              <Input
                                type="time"
                                className="form-control"
                                name="tuesdayOpen"
                                value={workHours?.tuesday.open}
                                onChange={this.onChangeTuesdayOpen}
                              />            
                            </th>
                            <th>
                              <Input
                                type="time"
                                className="form-control"
                                name="tuesdayClose"
                                value={workHours?.tuesday.close}
                                onChange={this.onChangeTuesdayClose}
                              />     
                            </th>
                          </tr>
                          <tr>
                            <th>
                              {workHours?.wednesday.day}
                            </th>
                            <th>
                              <Input
                                type="time"
                                className="form-control"
                                name="wednesdayOpen"
                                value={workHours?.wednesday.open}
                                onChange={this.onChangeWednesdayOpen}
                              />            
                            </th>
                            <th>
                              <Input
                                type="time"
                                className="form-control"
                                name="wednesdayClose"
                                value={workHours?.wednesday.close}
                                onChange={this.onChangeWednesdayClose}
                              />     
                            </th>
                          </tr>
                          <tr>
                            <th>
                              {workHours?.thursday.day}
                            </th>
                            <th>
                              <Input
                                type="time"
                                className="form-control"
                                name="thursdayOpen"
                                value={workHours?.thursday.open}
                                onChange={this.onChangeThursdayOpen}
                              />            
                            </th>
                            <th>
                              <Input
                                type="time"
                                className="form-control"
                                name="thursdayClose"
                                value={workHours?.thursday.close}
                                onChange={this.onChangeThursdayClose}
                              />     
                            </th>
                          </tr>
                          <tr>
                            <th>
                              {workHours?.friday.day}
                            </th>
                            <th>
                              <Input
                                type="time"
                                className="form-control"
                                name="fridayOpen"
                                value={workHours?.friday.open}
                                onChange={this.onChangeFridayOpen}
                              />            
                            </th>
                            <th>
                              <Input
                                type="time"
                                className="form-control"
                                name="fridayClose"
                                value={workHours?.friday.close}
                                onChange={this.onChangefridayClose}
                              />     
                            </th>
                          </tr>
                          <tr>
                            <th>
                              {workHours?.saturday.day}
                            </th>
                            <th>
                              <Input
                                type="time"
                                className="form-control"
                                name="saturdayOpen"
                                value={workHours?.saturday.open}
                                onChange={this.onChangeSaturdayOpen}
                              />            
                            </th>
                            <th>
                              <Input
                                type="time"
                                className="form-control"
                                name="saturdayClose"
                                value={workHours?.saturday.close}
                                onChange={this.onChangeSaturdayClose}
                              />     
                            </th>
                          </tr>
                          <tr>
                            <th>
                              {workHours?.sunday.day}
                            </th>
                            <th>
                              <Input
                                type="time"
                                className="form-control"
                                name="sundayOpen"
                                value={workHours?.sunday.open}
                                onChange={this.onChangeSundayOpen}
                              />            
                            </th>
                            <th>
                              <Input
                                type="time"
                                className="form-control"
                                name="sundayClose"
                                value={workHours?.sunday.close}
                                onChange={this.onChangeSundayClose}
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
                              value={socialMedia?.facebook}
                              onChange={this.onChangeFacebook}
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
                              value={socialMedia?.instagram}
                              onChange={this.onChangeInstagram}
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
                              value={socialMedia?.twitter}
                              onChange={this.onChangeTwitter}
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
                              value={socialMedia?.linkedin}
                              onChange={this.onChangeLinkedin}
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
                              value={socialMedia?.website}
                              onChange={this.onChangeWebsite}
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
                    <span>Salvar</span>
                  </button>
                  <br/>
                  <Button color="danger" onClick={() => window.location.href = "/dashboard"}>
                    Cancelar
                  </Button>
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
