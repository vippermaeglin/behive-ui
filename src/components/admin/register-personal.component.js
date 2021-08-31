import React, { useState, useRef } from "react";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import Select from "react-validation/build/select";
import CheckButton from "react-validation/build/button";
import { isEmail } from "validator";
import Moment from 'moment';

import AuthService from "../../services/auth.service";
import PersonalService from "../../services/personal.service";
import GymService from "../../services/gym.service";
import {cpfMask} from "../auth/CpfMask";
import {crefMask} from "../auth/CrefMask"
import {phoneMask} from "../auth/PhoneMask";
import { cpf } from 'cpf-cnpj-validator'; 
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

const validEmail = (value) => {
  if (!isEmail(value)) {
    return (
      <div className="alert alert-danger" role="alert">
        Email inválido.
      </div>
    );
  }
};

const validPhone = (value) => {
  if (value.length !== 15) {
    return (
      <div className="alert alert-danger" role="alert">
        Celular inválido.
      </div>
    );
  }
};

const vcpf = (value) => {
  value = cpfMask(value)
  if (!cpf.isValid(value)) {
    return (
      <div className="alert alert-danger" role="alert">
        CPF inválido.
      </div>
    );
  }
};

const vpassword = (value) => {
  if (value.length < 6 || value.length > 40) {
    return (
      <div className="alert alert-danger" role="alert">
        Senha precisa ter entre 6 e 40 caracteres.
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

const vzipcode = (value) => {
  if(value === null || value === "") return;
  value = zipMask(value);
  if (value.length !== 9) {
    return (
      <div className="alert alert-danger" role="alert">
        CEP inválido!
      </div>
    );
  }
};

const RegisterPersonal = (props) => {
  const form = useRef();
  const checkBtn = useRef();
  const inputAddressNumber = useRef();

  const [cpf, setCpf] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userName, setUserName] = useState("");
  const [phone, setPhone] = useState("");
  const [birthday, setBirthday] = useState("");
  const [gender, setGender] = useState("");
  const [successful, setSuccessful] = useState(false);
  const [message, setMessage] = useState("");
  const [cref, setCref] = useState();
  const [crefExpiration, setCrefExpiration] = useState();
  const [bankCode, setBankCode] = useState("");
  const [bankAgency, setBankAgency] = useState("");
  const [bankAgencyDigit, setBankAgencyDigit] = useState("");
  const [bankAccount, setBankAccount] = useState("");
  const [bankAccountDigit, setBankAccountDigit] = useState("");
  const [bankAccountType, setBankAccountType] = useState("");
  const [address, setAddress] = useState();

  const onChangeCpf = (e) => {
    const cpf = cpfMask(e.target.value);
    setCpf(cpf);
  };

  const onChangeEmail = (e) => {
    const email = e.target.value;
    setEmail(email);
  };

  const onChangePassword = (e) => {
    const password = e.target.value;
    setPassword(password);
  };

  const onChangePhone = (e) => {
    const phone = phoneMask(e.target.value);
    setPhone(phone);
  };

  const onChangeUserName = (e) => {
    const userName = e.target.value;
    setUserName(userName);
  };

  const onChangeBirthday = (e) => {
    const birthday = e.target.value;
    setBirthday(birthday);
  };

  const onChangeGender = (e) => {
    const gender = e.target.value;
    setGender(gender);
  };

  const onChangeCref = (e) => {
    const cref = crefMask(e.target.value);
    setCref(cref);
  };

  const onChangeCrefExpiration = (e) => {
    const crefExpiration = e.target.value;
    setCrefExpiration(crefExpiration);
  };

  const onChangeBankCode = (e) => {
    const code = e.target.value;
    setBankCode(code);
  };

  const onChangeBankAgency = (e) => {
    const value = e.target.value;
    setBankAgency(value);
  };

  const onChangeBankAgencyDigit = (e) => {
    const value = e.target.value;
    setBankAgencyDigit(value);
  };

  const onChangeBankAccount = (e) => {
    const value = e.target.value;
    setBankAccount(value);
  };

  const onChangeBankAccountDigit = (e) => {
    const value = e.target.value;
    setBankAccountDigit(value);
  };

  const onChangeBankAccountType = (e) => {
    const value = e.target.value;
    setBankAccountType(value);
  };

  const onChangeZipCode = (e) => {
    const zipCode = zipMask(e.target.value);
    if(zipCode.length ===9){
      consultarCep(zipCode).then((response) => {
        setAddress({
          ...address,
          zipCode: zipCode,
          street: response.logradouro,
          neighborhood: response.bairro,
          city: response.localidade,
          state: response.uf
        });
        inputAddressNumber.current.focus();
      });
    }
  };

  const onChangeAddressNumber = (e) => {
    const number = e.target.value;
    setAddress({
      ...address,
      number: number
    });
  };

  const handleRegister = (e) => {
    e.preventDefault();

    setMessage("");
    setSuccessful(false);

    form.current.validateAll();

    if (checkBtn.current.context._errors.length === 0) {
      AuthService.register(cpf, email, password, "PERSONAL", phone, userName, Moment(birthday).format('DD/MM/YYYY'), gender).then(
        (responseUser) => {
          let brandName = userName;
          let commercialPhone = phone;
          let bankData = {
            accountType: { code: bankAccountType },
            bank: { code: bankCode },
            bankAccount: bankAccount,
            bankAccountDigit: bankAccountDigit,
            bankAgency: bankAgency,
            bankAgencyDigit: bankAgencyDigit
          }
          PersonalService.create(address, brandName, "", commercialPhone, "", 120,
            80, 45, null, responseUser.data.object, null, null, cref, Moment(crefExpiration).format('DD/MM/yyyy'), null, null, bankData).then(
            (responsePersonal) => {
              GymService.createPersonalContract(props.match.params.contract, props.match.params.gymId, responsePersonal.data.object.id).then(
                (responseContract) => {
                  setMessage(responseContract.data.message);
                  setSuccessful(true);
                },
                (error) => {
                  const resMessage =
                    (error.response &&
                      error.response.data &&
                      error.response.data.message) ||
                    error.message ||
                    error.toString();
                  setMessage(resMessage);
                  setSuccessful(false);
                }
              )
            },
            (error) => {
              const resMessage =
                (error.response &&
                  error.response.data &&
                  error.response.data.message) ||
                error.message ||
                error.toString();   
                setMessage(resMessage);
                setSuccessful(false);
            }
          );
        },
        (error) => {
          const resMessage =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();
          setMessage(resMessage);
          setSuccessful(false);
        }
      );
    }
  };

  return (
    <div className="col-md-12">
      <div className="card card-container">
        <img className="img-center"
          src={require('./../../assets/images/behive_logo_transparent.png')}
          alt="profile-img"
          width="350"
        />              

        <Form onSubmit={handleRegister} ref={form}>
          {!successful && (
            <div>

              <div className="form-group">
                <label htmlFor="cpf">CPF</label>
                <Input
                  type="text"
                  className="form-control"
                  name="cpf"
                  value={cpf}
                  onChange={onChangeCpf}
                  validations={[required, vcpf]}
                  maxLength="14"
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email</label>
                <Input
                  type="text"
                  className="form-control"
                  name="email"
                  value={email}
                  onChange={onChangeEmail}
                  validations={[required, validEmail]}
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">Senha</label>
                <Input
                  type="password"
                  className="form-control"
                  name="password"
                  value={password}
                  onChange={onChangePassword}
                  validations={[required, vpassword]}
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone">Celular</label>
                <Input
                  type="text"
                  className="form-control"
                  name="phone"
                  value={phone}
                  onChange={onChangePhone}
                  validations={[required, validPhone]}
                  maxLength="15"
                />
              </div>

              <div className="form-group">
                <label htmlFor="userName">Nome</label>
                <Input
                  type="text"
                  className="form-control"
                  name="userName"
                  value={userName}
                  onChange={onChangeUserName}
                  validations={[required]}
                />
              </div>

              <div className="form-group">
                <label htmlFor="birthday">Nascimento</label>
                <br/>
                <Input
                  type="date"
                  className="form-control"
                  name="birthday"
                  value={birthday}
                  onChange={onChangeBirthday}
                  validations={[required]}
                />
              </div>

              <div className="form-group">
                <label htmlFor="gender">Sexo</label>
                <Select name='gender'
                  className="form-control"
                  value={gender}
                  onChange={onChangeGender}
                  validations={[required]}
                >
                  <option value=''>Escolha um sexo</option>
                  <option value='FEMININO'>Feminino</option>
                  <option value='MASCULINO'>Masculino</option>
                  <option value='OUTRO'>Outro</option>
                </Select>
              </div>
              <div className="form-group">
                <label className="dark-label" htmlFor="cref">CREF</label>
                <Input
                  type="text"
                  className="form-control"
                  name="cref"
                  value={cref}
                  onChange={onChangeCref}
                  validations={[required, vcref]}
                  maxLength="11"
                  placeHolder="123456-G/UF"
                />            
              </div>
              <div className="form-group">
                <label className="dark-label" htmlFor="crefExpiration">Validade CREF</label>
                <Input
                  type="date"
                  className="form-control"
                  name="crefExpiration"
                  value={crefExpiration}
                  onChange={onChangeCrefExpiration}
                  validations={[required]}
                />            
              </div>
              <div className="form-group">
                <label htmlFor="bankCode">Banco</label>
                <Select name='bankCode'
                  className="form-control"
                  value={bankCode}
                  onChange={onChangeBankCode}
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
                  onChange={onChangeBankAgency}
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
                  onChange={onChangeBankAgencyDigit}
                />            
              </div>
              <div className="form-group">
                <label className="dark-label" htmlFor="bankAccount">Conta</label>
                <Input
                  type="text"
                  className="form-control"
                  name="bankAccount"
                  value={bankAccount}
                  onChange={onChangeBankAccount}
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
                  onChange={onChangeBankAccountDigit}
                  validations={[required]}
                />            
              </div>
              <div className="form-group">
                <label htmlFor="bankAccountType">Tipo de Conta</label>
                <Select name='bankAccountType'
                  className="form-control"
                  value={bankAccountType}
                  onChange={onChangeBankAccountType}
                  validations={[required]}
                >
                  <option value=''>Escolha o tipo da conta</option>
                  <option value="cc">Conta Corrente</option>
                  <option value="pp">Poupança</option>
                </Select>
              </div>
              <div className="form-group">
                  <label className="dark-label" htmlFor="zipCode">CEP</label>
                  <input
                    type="text"
                    className="form-control"
                    name="zipCode"
                    value={address?.zipCode}
                    onChange={onChangeZipCode}
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
                  <label className="dark-label" htmlFor="addressNumber">N°/Complemento</label>
                  <input
                    ref = {inputAddressNumber}
                    type="text"
                    className="form-control"
                    name="addressNumber"
                    value={address?.number}
                    onChange={onChangeAddressNumber}
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
              <div className="form-group">
                <button className="button button-primary button-wide-mobile button-block">Cadastrar</button>
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
          <CheckButton style={{ display: "none" }} ref={checkBtn} />
        </Form>
      </div>
    </div>
  );
};

export default RegisterPersonal;