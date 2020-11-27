import React, { Component } from "react";

import CustomerService from "../../services/customer.service";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFacebook, faInstagram, faTwitter, faWeebly } from '@fortawesome/free-brands-svg-icons'

export default class AdminCustomer extends Component {
  constructor(props) {
    super(props);

    this.onChangeSearchCustomer = this.onChangeSearchCustomer.bind(this);
    this.retrieveCustomers = this.retrieveCustomers.bind(this);
    this.refreshList = this.refreshList.bind(this);
    this.setActiveCustomer = this.setActiveCustomer.bind(this);
    this.searchCustomer = this.searchCustomer.bind(this);

    this.state = {
      customers: [],
      currentCustomer: null,
      currentIndex: -1,
      searchCustomer: ""
    };
  }

  componentDidMount() {
    this.retrieveCustomers();
  }

  onChangeSearchCustomer(e) {
    const searchCustomer = e.target.value;

    this.setState({
      searchTitle: searchCustomer
    });
  }

  retrieveCustomers() {
    CustomerService.getAllCustomers().then(
      response => {
        this.setState({
          customers: response.data
        });
        console.log(response.data);
      }
    )
    .catch(e => {
      console.log(e);
    });
  }

  refreshList() {
    this.retrieveCustomers();
    this.setState({
      currentCustomer: null,
      currentIndex: -1
    });
  }

  setActiveCustomer(customer, index) {
    this.setState({
      currentCustomer: customer,
      currentIndex: index
    });
  }

  searchCustomer() {
    CustomerService.search(this.state.searchTitle)
      .then(response => {
        this.setState({
          customers: response.data
        });
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  }

  render() {
    const { searchCustomer, customers, currentCustomer, currentIndex } = this.state;
    return (
      <>
        <div className="container section-inner">
              <h4>Alunos</h4>
          <div className="list row">
            <div className="col-md-8">
              <div className="input-group mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Buscar aluno"
                  value={searchCustomer}
                  onChange={this.onChangeSearchTitle}
                />
                <div className="input-group-append">
                  <button
                    className="button button-primary button-wide-mobile button-block"
                    type="button"
                    onClick={this.searchCustomer}
                  >
                    Procurar
                  </button>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <ul className="list-group">
                {customers &&
                  customers.map((customer, index) => (
                    <li
                      className={
                        "list-group-item " +
                        (index === currentIndex ? "active" : "")
                      }
                      onClick={() => this.setActiveCustomer(customer, index)}
                      key={index}
                    >
                      {customer.user.userName} ({customer.user.cpf})
                    </li>
                  ))}
              </ul>
            </div>
            <div className="col-md-6">
              {currentCustomer ? (
                <div>
                  <h4>Detalhes</h4>
                  <div>
                    <img  className="logo-tile-small"
                      src={currentCustomer.logo}
                      alt="profile-img"
                    />
                  </div>
                  <div className="form-group-horizontal">
                    <label>
                      <strong>Nome:</strong>
                    </label>
                    <label>
                      {" "+currentCustomer.user.userName}
                    </label>
                  </div>
                  <div className="form-group-horizontal">
                    <label>
                      <strong>Celular:</strong>
                    </label>
                    <label>
                      {" "+currentCustomer.user.phone}
                    </label>
                  </div>
                  <div className="form-group-horizontal">
                    <label>
                      <strong>CPF:</strong>
                    </label>
                    <label>
                      {" "+currentCustomer.user.cpf}
                    </label>
                  </div>
                  <div className="form-group-horizontal">
                    <label>
                      <strong>Email:</strong>
                    </label>
                    <label>
                      {" "+currentCustomer.user.email}
                    </label>
                  </div>
                  <div className="form-group-horizontal">
                    <label>
                      <strong>Aniversário:</strong>
                    </label>
                    <label>
                      {" "+currentCustomer.user.birthday}
                    </label>
                  </div>
                  <div className="form-group-horizontal">
                    <label>
                      <strong>Sexo:</strong>
                    </label>
                    <label>
                      {" "+currentCustomer.user.gender}
                    </label>
                  </div>
                  <div className="form-group-horizontal">
                    <label>
                      <strong>Endereço:</strong>
                    </label>
                    <label>
                      {" "+currentCustomer.address.street+", "+currentCustomer.address.number+" - "+currentCustomer.address.neighborhood+", "+currentCustomer.address.city+" - "+currentCustomer.address.state+", CEP "+currentCustomer.address.zipCode}
                    </label>
                  </div>
                  <div>
                    <label>
                      <strong>Mídias Sociais:</strong>
                    </label>
                    <ul className="list-group">
                      <li>
                        <FontAwesomeIcon icon={faInstagram} />
                        <a href={currentCustomer.socialMedia.instagram}>{" "}Instagram</a>
                      </li>
                      <li>
                        <FontAwesomeIcon icon={faFacebook} />
                        <a href={currentCustomer.socialMedia.instagram}>{" "}Faceboook</a>
                      </li>
                      <li>
                        <FontAwesomeIcon icon={faTwitter} />
                        <a href={currentCustomer.socialMedia.instagram}>{" "}Twitter</a>
                      </li>
                      <li>
                        <FontAwesomeIcon icon={faWeebly} />
                        <a href={currentCustomer.socialMedia.instagram}>{" "}Website</a>
                      </li>
                    </ul>
                  </div>
                  <br/>
                  <Link
                    to={"/customer/" + currentCustomer.id}
                    className="button button-primary button-wide-mobile"
                  >
                    Editar
                  </Link>
                </div>
              ) : (
                <div>
                  <br />
                  <p>Selecione um aluno para detalhes...</p>
                </div>
              )}
            </div>
          </div>
        </div>

      </>
    );
  }
}
