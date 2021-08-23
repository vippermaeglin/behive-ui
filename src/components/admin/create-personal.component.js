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
    this.onChangeBankCode = this.onChangeBankCode.bind(this);
    this.onChangeBankAgency = this.onChangeBankAgency.bind(this);
    this.onChangeBankAgencyDigit = this.onChangeBankAgencyDigit.bind(this);
    this.onChangeBankAccount = this.onChangeBankAccount.bind(this);
    this.onChangeBankAccountDigit = this.onChangeBankAccountDigit.bind(this);
    this.onChangeBankAccountType = this.onChangeBankAccountType.bind(this);

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
      logo: "http://ssl.gstatic.com/accounts/ui/avatar_2x.png",
      cref: null,
      crefExpiration: null,
      certificates: [],
      graduation: [],
      bankCode: null,
      bankAgency: null,
      bankAgencyDigit: null,
      bankAccount: null,
      bankAccountDigit: null,
      bankAccountType: null
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

  onChangeBankCode(e) {
    const code = e.target.value;
    this.setState({
      bankCode: code
    });
  };

  onChangeBankAgency(e) {
    const value = e.target.value;
    this.setState({
      bankAgency: value
    });
  };

  onChangeBankAgencyDigit(e) {
    const value = e.target.value;
    this.setState({
      bankAgencyDigit: value
    });
  };

  onChangeBankAccount(e) {
    const value = e.target.value;
    this.setState({
      bankAccount: value
    });
  };

  onChangeBankAccountDigit(e) {
    const value = e.target.value;
    this.setState({
      bankAccountDigit: value
    });
  };

  onChangeBankAccountType(e) {
    const value = e.target.value;
    this.setState({
      bankAccountType: value
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
      price, highPricePct, lowPricePct, workHours, socialMedia, logo, cref, crefExpiration, /*certificates, graduation*/
      bankCode, bankAgency, bankAgencyDigit, bankAccount, bankAccountDigit, bankAccountType } = this.state;    
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
                    <option value="">Selecione...</option>
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
                  <label htmlFor="bankCode">Banco</label>
                  <Select name='bankCode'
                    className="form-control"
                    value={bankCode}
                    onChange={this.onChangeBankCode}
                    validations={[required]}
                  >
                    <option value=''>Escolha um banco para receber</option>
                    <option value="001">Banco do Brasil</option>
                    <option value="104">Caixa Econômica Federal</option>
                    <option value="341">Banco Itaú Unibanco</option>
                    <option value="184">Banco Itaú BBA</option>
                    <option value="237">Bradesco</option>
                    <option value="33">Banco Santander Brasil</option>
                    <option value="077">Banco Inter</option>
                    <option value="260">NuBank Pagamentos</option>
                    <option value="399">HSBC</option>
                    <option value="389">Banco Mercantil do Brasil</option>
                    <option value="394">Banco Mercantil de Crédito</option>
                    <option value="007">BNDES</option>
                    <option value="422">Banco Safra S.A.</option>
                    <option value="074">Banco J. Safra</option>
                    <option value="409">Unibanco</option>
                    <option value="318">Banco BMG</option>
                    <option value="477">Citibank</option>
                    <option value="479">Itaubank (antigo Bank Boston)</option>
                    <option value="151">Nossa Caixa</option>
                    <option value="204">American Express Bank</option>
                    <option value="208">Banco Pactual</option>
                    <option value="073">Banco Popular</option>
                    <option value="003">Banco da Amazônia</option>
                    <option value="004">Banco do Nordeste</option>
                    <option value="021">Banestes</option>
                    <option value="025">Banco Alfa</option>
                    <option value="027">Besc</option>
                    <option value="029">Banerj</option>
                    <option value="031">Banco Beg</option>
                    <option value="033">Banco Santander Banespa</option>
                    <option value="036">Banco Bem</option>
                    <option value="037">Banpará</option>
                    <option value="038">Banestado</option>
                    <option value="039">BEP</option>
                    <option value="040">Banco Cargill</option>
                    <option value="041">Banrisul</option>
                    <option value="044">BVA</option>
                    <option value="045">Banco Opportunity</option>
                    <option value="047">Banese</option>
                    <option value="062">Hipercard</option>
                    <option value="063">Ibibank</option>
                    <option value="065">Lemon Bank</option>
                    <option value="066">Banco Morgan Stanley Dean Witter</option>
                    <option value="069">BPN Brasil</option>
                    <option value="070">Banco de Brasília – BRB</option>
                    <option value="075">Banco CR2</option>
                    <option value="076">Banco KDB</option>
                    <option value="096">Banco BMF</option>
                    <option value="107">Banco BBM</option>
                    <option value="116">Banco Único</option>
                    <option value="175">Banco Finasa</option>
                    <option value="212">Banco Matone</option>
                    <option value="213">Banco Arbi</option>
                    <option value="214">Banco Dibens</option>
                    <option value="217">Banco Joh Deere</option>
                    <option value="218">Banco Bonsucesso</option>
                    <option value="222">Banco Calyon Brasil</option>
                    <option value="224">Banco Fibra</option>
                    <option value="225">Banco Brascan</option>
                    <option value="229">Banco Cruzeiro</option>
                    <option value="230">Unicard</option>
                    <option value="233">Banco GE Capital</option>
                    <option value="241">Banco Clássico</option>
                    <option value="243">Banco Stock Máxima</option>
                    <option value="246">Banco ABC Brasil</option>
                    <option value="248">Banco Boavista Interatlântico</option>
                    <option value="249">Investcred Unibanco</option>
                    <option value="250">Banco Schahin</option>
                    <option value="252">Fininvest</option>
                    <option value="254">Paraná Banco</option>
                    <option value="263">Banco Cacique</option>
                    <option value="265">Banco Fator</option>
                    <option value="266">Banco Cédula</option>
                    <option value="300">Banco de la Nación Argentina</option>
                    <option value="320">Banco Industrial e Comercial</option>
                    <option value="356">ABN Amro Real</option>
                    <option value="347">Sudameris</option>
                    <option value="366">Banco Societe Generale Brasil</option>
                    <option value="370">Banco WestLB</option>
                    <option value="376">JP Morgan</option>
                    <option value="412">Banco Capital</option>
                    <option value="456">Banco Tokyo Mitsubishi UFJ</option>
                    <option value="464">Banco Sumitomo Mitsui Brasileiro</option>
                    <option value="487">Deutsche Bank</option>
                    <option value="488">Banco Morgan Guaranty</option>
                    <option value="492">Banco NMB Postbank</option>
                    <option value="494">Banco la República Oriental del Uruguay</option>
                    <option value="495">Banco La Provincia de Buenos Aires</option>
                    <option value="505">Banco Credit Suisse</option>
                    <option value="600">Banco Luso Brasileiro</option>
                    <option value="604">Banco Industrial</option>
                    <option value="610">Banco VR</option>
                    <option value="611">Banco Paulista</option>
                    <option value="612">Banco Guanabara</option>
                    <option value="613">Banco Pecunia</option>
                    <option value="623">Banco Panamericano</option>
                    <option value="626">Banco Ficsa</option>
                    <option value="630">Banco Intercap</option>
                    <option value="633">Banco Rendimento</option>
                    <option value="634">Banco Triângulo</option>
                    <option value="637">Banco Sofisa</option>
                    <option value="638">Banco Prosper</option>
                    <option value="643">Banco Pine</option>
                    <option value="652">Itaú Holding Financeira</option>
                    <option value="653">Banco Indusval</option>
                    <option value="654">Banco A.J. Renner</option>
                    <option value="655">Banco Votorantim</option>
                    <option value="707">Banco Daycoval</option>
                    <option value="719">Banif</option>
                    <option value="721">Banco Credibel</option>
                    <option value="734">Banco Gerdau</option>
                    <option value="735">Banco Pottencial</option>
                    <option value="738">Banco Morada</option>
                    <option value="739">Banco Galvão de Negócios</option>
                    <option value="740">Banco Barclays</option>
                    <option value="741">BRP</option>
                    <option value="743">Banco Semear</option>
                    <option value="745">Banco Citibank</option>
                    <option value="746">Banco Modal</option>
                    <option value="747">Banco Rabobank International</option>
                    <option value="748">Banco Cooperativo Sicredi</option>
                    <option value="749">Banco Simples</option>
                    <option value="751">Dresdner Bank</option>
                    <option value="752">BNP Paribas</option>
                    <option value="753">Banco Comercial Uruguai</option>
                    <option value="755">Banco Merrill Lynch</option>
                    <option value="756">Banco Cooperativo do Brasil</option>
                    <option value="757">KEB</option>
                  </Select>
                </div>
                <div className="form-group">
                  <label className="dark-label" htmlFor="bankAgency">Agência</label>
                  <Input
                    type="text"
                    className="form-control"
                    name="bankAgency"
                    value={bankAgency}
                    onChange={this.onChangeBankAgency}
                    validations={[required]}
                  />            
                </div>
                <div className="form-group">
                  <label className="dark-label" htmlFor="bankAgencyDigit">Dígito Agência</label>
                  <Input
                    type="text"
                    className="form-control"
                    name="bankAgencyDigit"
                    value={bankAgencyDigit}
                    onChange={this.onChangeBankAgencyDigit}
                  />            
                </div>
                <div className="form-group">
                  <label className="dark-label" htmlFor="bankAccount">Conta</label>
                  <Input
                    type="text"
                    className="form-control"
                    name="bankAccount"
                    value={bankAccount}
                    onChange={this.onChangeBankAccount}
                    validations={[required]}
                  />            
                </div>
                <div className="form-group">
                  <label className="dark-label" htmlFor="bankAccountDigit">Dígito Conta</label>
                  <Input
                    type="text"
                    className="form-control"
                    name="bankAccountDigit"
                    value={bankAccountDigit}
                    onChange={this.onChangeBankAccountDigit}
                    validations={[required]}
                  />            
                </div>
                <div className="form-group">
                  <label htmlFor="bankAccountType">Tipo de Conta</label>
                  <Select name='bankAccountType'
                    className="form-control"
                    value={bankAccountType}
                    onChange={this.onChangeBankAccountType}
                    validations={[required]}
                  >
                    <option value=''>Escolha o tipo da conta</option>
                    <option value="cc">Conta Corrente</option>
                    <option value="pp">Poupança</option>
                  </Select>
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
