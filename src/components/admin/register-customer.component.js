import React, { useState, useRef } from "react";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import Select from "react-validation/build/select";
import CheckButton from "react-validation/build/button";
import { isEmail } from "validator";
import Moment from 'moment';

import AuthService from "../../services/auth.service";
import CustomerService from "../../services/customer.service";
import PersonalService from "../../services/personal.service";
import {cpfMask} from "../auth/CpfMask";
import {phoneMask} from "../auth/PhoneMask";
import { cpf } from 'cpf-cnpj-validator'; 

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

const RegisterCustomer = (props) => {
  const form = useRef();
  const checkBtn = useRef();

  const [cpf, setCpf] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userName, setUserName] = useState("");
  const [phone, setPhone] = useState("");
  const [birthday, setBirthday] = useState("");
  const [gender, setGender] = useState("");
  const [successful, setSuccessful] = useState(false);
  const [message, setMessage] = useState("");

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
    console.log("props.match.params");
    console.log(props.match.params);
    const gender = e.target.value;
    setGender(gender);
  };

  const handleRegister = (e) => {
    e.preventDefault();

    setMessage("");
    setSuccessful(false);

    form.current.validateAll();

    if (checkBtn.current.context._errors.length === 0) {
      AuthService.register(cpf, email, password, "CUSTOMER", phone, userName, Moment(birthday).format('DD/MM/YYYY'), gender).then(
        (responseUser) => {
          let brandName = userName;
          let commercialPhone = phone;
          CustomerService.create(responseUser.data.object, null, null, null).then(
            (responseCustomer) => {
              PersonalService.createCustomerContract(responseCustomer.data.object.id, props.match.params.personalId).then(
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

export default RegisterCustomer;