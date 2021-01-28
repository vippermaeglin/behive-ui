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

const required = (value) => {
  if (!value) {
    return (
      <div className="alert alert-danger" role="alert">
        Campo obrigatório!
      </div>
    );
  }
};

export default class InvitePersonal extends Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.onChangeContract = this.onChangeContract.bind(this);

    this.form = createRef();
    this.checkBtn = createRef();

    this.state = {
      contractTypes: ["ESTAGIÁRIO", "INTERNO", "EXTERNO", "MODALIDADES"],
      contractIndex: -1,
      currentContract: null,
      url: null,
      loading: false,
      message: null
    };
  }

  componentDidMount() {
  }

  onChangeContract(e) {
    const index = e.target.value;
    const contract = this.state.contractTypes[index];
    //TODO NOW: get gym id
    const url = "https://www.behive.fit/personal-signup?gym="+this.props.match.params.gymId+"&contract="+contract;
    this.setState({
      contractIndex: index,
      currentContract: contract,
      url: url
    });
  };

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
          window.location.href = "/admin-personal";
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
    const { contractIndex, contractTypes, currentContract, url, loading, message } = this.state;    
    return (
      <>
        <div className="container section-inner">
          <h4>Convidar Personal Trainer</h4>
          <div className="col-md-12">
            <div className="card card-container">
              <Form onSubmit={this.handleSubmit} ref={this.form}>
                <div className="form-group">
                  <label className="dark-label" htmlFor="user">Tipo de Contrato:</label>
                  <Select name='contract'
                    className="form-control"
                    value={contractIndex}
                    onChange={this.onChangeContract}
                    validations={[required]}
                  >
                  <option value={-1} disabled>Selecione</option>
                  {contractTypes.map((contract, index) => (
                    <option value={index}>{contract}</option>
                  ))}
                </Select>    
                </div>
                <div className="form-group">
                  <label className="dark-label">Link do convite:</label>
                  <Input
                    type="textarea"
                    className="form-control"
                    name="location"
                    value={url}
                    disabled={true}
                  />            
                </div>
                <br/>
                <div className="form-group">
                  <button className="button button-primary button-wide-mobile button-block" disabled={loading}>
                    {loading && (
                      <span className="spinner-border spinner-border-sm"></span>
                    )}
                    <span>Fechar</span>
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
