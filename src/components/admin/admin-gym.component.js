import React, { Component } from "react";

import GymService from "../../services/gym.service";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFacebook, faInstagram, faTwitter, faWeebly } from '@fortawesome/free-brands-svg-icons'
import Collapsible from 'react-collapsible';
import Moment from 'moment';
import GymCalendar from "../calendar/gym-calendar.component";

export default class AdminGym extends Component {
  constructor(props) {
    super(props);

    this.onChangeSearchGym = this.onChangeSearchGym.bind(this);
    this.retrieveGyms = this.retrieveGyms.bind(this);
    this.refreshList = this.refreshList.bind(this);
    this.setActiveGym = this.setActiveGym.bind(this);
    this.searchGym = this.searchGym.bind(this);

    this.state = {
      gyms: [],
      currentGym: null,
      currentIndex: -1,
      searchGym: ""
    };
  }

  componentDidMount() {
    this.retrieveGyms();
  }

  onChangeSearchGym(e) {
    const searchGym = e.target.value;

    this.setState({
      searchTitle: searchGym
    });
  }

  retrieveGyms() {
    GymService.getAllGyms().then(
      response => {
        this.setState({
          gyms: response.data
        });
        console.log(response.data);
      }
    )
    .catch(e => {
      console.log(e);
    });
  }

  refreshList() {
    this.retrieveGyms();
    this.setState({
      currentGym: null,
      currentIndex: -1
    });
  }

  setActiveGym(gym, index) {
    this.setState({
      currentGym: gym,
      currentIndex: index
    });
  }

  searchGym() {
    GymService.search(this.state.searchTitle)
      .then(response => {
        this.setState({
          gyms: response.data
        });
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  }

  render() {
    const { searchGym, gyms, currentGym, currentIndex } = this.state;
    return (
      <>
        <div className="container section-inner">
              <h4>Academias</h4>
          <div className="list row">
            <div className="col-md-8">
              <div className="input-group mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Buscar academia"
                  value={searchGym}
                  onChange={this.onChangeSearchTitle}
                />
                <div className="input-group-append">
                  <button
                    className="button button-primary button-wide-mobile button-block"
                    type="button"
                    onClick={this.searchGym}
                  >
                    Procurar
                  </button>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <ul className="list-group">
                {gyms &&
                  gyms.map((gym, index) => (
                    <li
                      className={
                        "list-group-item " +
                        (index === currentIndex ? "active" : "")
                      }
                      onClick={() => this.setActiveGym(gym, index)}
                      key={index}
                    >
                      {gym.brandName} (CNPJ {gym.cnpj})
                    </li>
                  ))}
              </ul>
            </div>
            <div className="col-md-6">
              {currentGym ? (
                <div>
                  <h4>Detalhes</h4>
                  <div>
                    <img  className="logo-tile-small"
                      src={currentGym.logo}
                      alt="profile-img"
                    />
                  </div>
                  <div className="form-group-horizontal">
                    <label>
                      <strong>Academia:</strong>
                    </label>
                    <label>
                      {" "+currentGym.brandName}
                    </label>
                  </div>
                  <div className="form-group-horizontal">
                    <label>
                      <strong>Telefone:</strong>
                    </label>
                    <label>
                      {" "+currentGym.commercialPhone}
                    </label>
                  </div>
                  <div className="form-group">
                    <label>
                      <strong>Representante:</strong>
                    </label>
                    <Collapsible trigger={currentGym.user.userName}>
                      <div className="border-panel">
                        <div className="form-group-horizontal">
                          <label>
                            <strong>Celular:</strong>
                          </label>
                          <label>
                            {" "+currentGym.user.phone}
                          </label>
                        </div>
                        <div className="form-group-horizontal">
                          <label>
                            <strong>Email:</strong>
                          </label>
                          <label>
                            {" "+currentGym.user.email}
                          </label>
                        </div>
                        <div className="form-group-horizontal">
                          <label>
                            <strong>CPF:</strong>
                          </label>
                          <label>
                            {" "+currentGym.user.cpf}
                          </label>
                        </div>
                        <div className="form-group-horizontal">
                          <label>
                            <strong>Aniversário:</strong>
                          </label>
                          <label>
                            {" "+Moment(currentGym.user.bithday).format('DD/MM/YYYY')}
                          </label>
                        </div>
                        <div className="form-group-horizontal">
                          <label>
                            <strong>Sexo:</strong>
                          </label>
                          <label>
                            {" "+currentGym.user.gender}
                          </label>
                        </div>
                      </div>
                    </Collapsible>
                  </div>
                  <div className="form-group-horizontal">
                    <label>
                      <strong>CNPJ:</strong>
                    </label>
                    <label>
                      {" "+currentGym.cnpj}
                    </label>
                  </div>
                  <div className="form-group-horizontal">
                    <label>
                      <strong>Razão Social:</strong>
                    </label>
                    <label>
                      {" "+currentGym.companyName}
                    </label>
                  </div>
                  <div className="form-group-horizontal">
                    <label>
                      <strong>Preço hora/aula:</strong>
                    </label>
                    <label>
                      {" R$"+currentGym.price+" ("+currentGym.lowPricePct+"-"+currentGym.highPricePct+"%)"}
                    </label>
                  </div>
                  <div className="form-group-horizontal">
                    <label>
                      <strong>Endereço:</strong>
                    </label>
                    <label>
                      {" "+currentGym.address.street+", "+currentGym.address.number+" - "+currentGym.address.neighborhood+", "+currentGym.address.city+" - "+currentGym.address.state+", CEP "+currentGym.address.zipCode}
                    </label>
                  </div>
                  <div className="form-group">
                    <Collapsible trigger={"Funcionamento"}>
                      <div className="border-panel">
                        <table>
                          <tr>
                            <th>DIA</th>
                            <th>ABERTURA</th>
                            <th>ENCERRAMENTO</th>
                          </tr>
                          <tr>
                            <th>
                              {currentGym.workHours.monday.day}
                            </th>
                            <th>
                              {currentGym.workHours.monday.open}
                            </th>
                            <th>
                              {currentGym.workHours.monday.close}
                            </th>
                          </tr>
                          <tr>
                            <th>
                              {currentGym.workHours.tuesday.day}
                            </th>
                            <th>
                              {currentGym.workHours.tuesday.open}
                            </th>
                            <th>
                              {currentGym.workHours.tuesday.close}
                            </th>
                          </tr>
                          <tr>
                            <th>
                              {currentGym.workHours.wednesday.day}
                            </th>
                            <th>
                              {currentGym.workHours.wednesday.open}
                            </th>
                            <th>
                              {currentGym.workHours.wednesday.close}
                            </th>
                          </tr>
                          <tr>
                            <th>
                              {currentGym.workHours.thursday.day}
                            </th>
                            <th>
                              {currentGym.workHours.thursday.open}
                            </th>
                            <th>
                              {currentGym.workHours.thursday.close}
                            </th>
                          </tr>
                          <tr>
                            <th>
                              {currentGym.workHours.friday.day}
                            </th>
                            <th>
                              {currentGym.workHours.friday.open}
                            </th>
                            <th>
                              {currentGym.workHours.friday.close}
                            </th>
                          </tr>
                          <tr>
                            <th>
                              {currentGym.workHours.saturday.day}
                            </th>
                            <th>
                              {currentGym.workHours.saturday.open}
                            </th>
                            <th>
                              {currentGym.workHours.saturday.close}
                            </th>
                          </tr>
                          <tr>
                            <th>
                              {currentGym.workHours.sunday.day}
                            </th>
                            <th>
                              {currentGym.workHours.sunday.open}
                            </th>
                            <th>
                              {currentGym.workHours.sunday.close}
                            </th>
                          </tr>
                        </table>
                      </div>
                    </Collapsible>
                  </div>
                  <div className="form-group">
                    <Collapsible trigger={"Mídias Sociais"}>
                      <div className="border-panel">
                        <ul>
                          <li>
                            <FontAwesomeIcon icon={faInstagram} />
                            <a href={currentGym.socialMedia.instagram} class="fa fa-facebook">{" "}Instagram</a>
                          </li>
                          <li>
                            <FontAwesomeIcon icon={faFacebook} />
                            <a href={currentGym.socialMedia.instagram} class="fa fa-facebook">{" "}Faceboook</a>
                          </li>
                          <li>
                            <FontAwesomeIcon icon={faTwitter} />
                            <a href={currentGym.socialMedia.instagram} class="fa fa-facebook">{" "}Twitter</a>
                          </li>
                          <li>
                            <FontAwesomeIcon icon={faWeebly} />
                            <a href={currentGym.socialMedia.instagram} class="fa fa-facebook">{" "}Website</a>
                          </li>
                        </ul>
                      </div>
                    </Collapsible>
                  </div>
                  <br/>
                  <Link
                    to={"/gym/" + currentGym.id}
                    className="button button-primary button-wide-mobile"
                  >
                    Editar
                  </Link>
                </div>
              ) : (
                <div>
                  <br />
                  <p>Selecione uma academia para detalhes...</p>
                </div>
              )}
            </div>
          </div>
          <div className="form-group">
            {currentGym ? (
              <GymCalendar key={this.state.currentGym} currentGym={this.state.currentGym}/>
            ) : ("")}
          </div>
        </div>

      </>
    );
  }
}
