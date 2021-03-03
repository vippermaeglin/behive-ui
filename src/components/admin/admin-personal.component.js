import React, { Component } from "react";

import PersonalService from "../../services/personal.service";
import { Link } from "react-router-dom";
import Collapsible from 'react-collapsible';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFacebook, faInstagram, faTwitter, faWeebly } from '@fortawesome/free-brands-svg-icons'
import BehiveCalendar from "../calendar/behive-calendar.component";

export default class AdminPersonal extends Component {
  constructor(props) {
    super(props);

    this.onChangeSearchPersonal = this.onChangeSearchPersonal.bind(this);
    this.retrievePersonal = this.retrievePersonal.bind(this);
    this.refreshList = this.refreshList.bind(this);
    this.setActivePersonal = this.setActivePersonal.bind(this);
    this.searchPersonal = this.searchPersonal.bind(this);

    this.state = {
      personals: [],
      currentPersonal: null,
      currentIndex: -1,
      searchPersonal: ""
    };
  }

  componentDidMount() {
    this.retrievePersonal();
  }

  onChangeSearchPersonal(e) {
    const searchPersonal = e.target.value;

    this.setState({
      searchTitle: searchPersonal
    });
  }

  retrievePersonal() {
    PersonalService.getAllPersonal().then(
      response => {
        this.setState({
          personals: response.data
        });
        console.log(response.data);
      }
    )
    .catch(e => {
      console.log(e);
    });
  }

  refreshList() {
    this.retrievePersonal();
    this.setState({
      currentPersonal: null,
      currentIndex: -1
    });
  }

  setActivePersonal(personal, index) {
    this.setState({
      currentPersonal: personal,
      currentIndex: index
    });
  }

  searchPersonal() {
    PersonalService.search(this.state.searchTitle)
      .then(response => {
        this.setState({
          personals: response.data
        });
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  }

  render() {
    const { searchPersonal, personals, currentPersonal, currentIndex } = this.state;
    return (
      <>
        <div className="container section-inner">
              <h4>Personal Trainers</h4>
          <div className="list row">
            <div className="col-md-8">
              <div className="hidden" /* "input-group mb-3" */ >
                <input
                  type="text"
                  className="form-control"
                  placeholder="Buscar personal trainer"
                  value={searchPersonal}
                  onChange={this.onChangeSearchTitle}
                />
                <div className="input-group-append">
                  <button
                    className="button button-primary button-wide-mobile button-block"
                    type="button"
                    onClick={this.searchPersonal}
                  >
                    Procurar
                  </button>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <ul className="list-group">
                {personals &&
                  personals.map((personal, index) => (
                    <li
                      className={
                        "list-group-item " +
                        (index === currentIndex ? "active" : "")
                      }
                      onClick={() => this.setActivePersonal(personal, index)}
                      key={index}
                    >
                      {personal.brandName} (CPF {personal.user.cpf})
                    </li>
                  ))}
              </ul>
            </div>
            <div className="col-md-6">
              {currentPersonal ? (
                <div>
                  <h4>Detalhes</h4>
                  <div>
                    <img  className="logo-tile-small"
                      src={currentPersonal.logo}
                      alt="profile-img"
                    />
                  </div>
                  <div className="form-group-horizontal">
                    <label>
                      <strong>Personal Trainer:</strong>
                    </label>
                    <label>
                      {" "+currentPersonal.brandName}
                    </label>
                  </div>
                  <div className="form-group-horizontal">
                    <label>
                      <strong>Telefone:</strong>
                    </label>
                    <label>
                      {" "+currentPersonal.commercialPhone}
                    </label>
                  </div>
                  <div className="form-group-horizontal">
                    <label>
                      <strong>CREF:</strong>
                    </label>
                    <label>
                      {" "+currentPersonal.cref}
                    </label>
                  </div>
                  <div className="form-group-horizontal">
                    <label>
                      <strong>Validade CREF:</strong>
                    </label>
                    <label>
                      {" "+currentPersonal.crefExpiration}
                    </label>
                  </div>
                  <div className="form-group-horizontal">
                    <label>
                      <strong>CNPJ:</strong>
                    </label>
                    <label>
                      {" "+currentPersonal.cnpj}
                    </label>
                  </div>
                  <div className="form-group-horizontal">
                    <label>
                      <strong>Razão Social:</strong>
                    </label>
                    <label>
                      {" "+currentPersonal.companyName}
                    </label>
                  </div>
                  <div className="form-group">
                    <label>
                      <strong>Representante:</strong>
                    </label>
                    <Collapsible trigger={currentPersonal.user.userName}>
                      <div className="border-panel">
                        <div className="form-group-horizontal">
                          <label>
                            <strong>Celular:</strong>
                          </label>
                          <label>
                            {" "+currentPersonal.user.phone}
                          </label>
                        </div>
                        <div className="form-group-horizontal">
                          <label>
                            <strong>Email:</strong>
                          </label>
                          <label>
                            {" "+currentPersonal.user.email}
                          </label>
                        </div>
                        <div className="form-group-horizontal">
                          <label>
                            <strong>CPF:</strong>
                          </label>
                          <label>
                            {" "+currentPersonal.user.cpf}
                          </label>
                        </div>
                        <div className="form-group-horizontal">
                          <label>
                            <strong>Aniversário:</strong>
                          </label>
                          <label>
                            {" "+currentPersonal.user.birthday}
                          </label>
                        </div>
                        <div className="form-group-horizontal">
                          <label>
                            <strong>Sexo:</strong>
                          </label>
                          <label>
                            {" "+currentPersonal.user.gender}
                          </label>
                        </div>
                      </div>
                    </Collapsible>
                  </div>
                  <div className="form-group-horizontal">
                    <label>
                      <strong>Preço hora/aula:</strong>
                    </label>
                    <label>
                      {" R$"+currentPersonal.price+" ("+currentPersonal.lowPricePct+"-"+currentPersonal.highPricePct+"%)"}
                    </label>
                  </div>
                  {currentPersonal.workHours && (
                    <div>
                      <label>
                        <strong>Atendimento:</strong>
                      </label>  
                      <table>
                        <tr>
                          <th>DIA</th>
                          <th>ABERTURA</th>
                          <th>ENCERRAMENTO</th>
                        </tr>
                        <tr>
                          <th>
                            {currentPersonal.workHours[1].day}
                          </th>
                          <th>
                            {currentPersonal.workHours[1].startTime}
                          </th>
                          <th>
                            {currentPersonal.workHours[1].endTime}
                          </th>
                        </tr>
                        <tr>
                          <th>
                            {currentPersonal.workHours[2].day}
                          </th>
                          <th>
                            {currentPersonal.workHours[2].startTime}
                          </th>
                          <th>
                            {currentPersonal.workHours[2].endTime}
                          </th>
                        </tr>
                        <tr>
                          <th>
                            {currentPersonal.workHours[3].day}
                          </th>
                          <th>
                            {currentPersonal.workHours[3].startTime}
                          </th>
                          <th>
                            {currentPersonal.workHours[3].endTime}
                          </th>
                        </tr>
                        <tr>
                          <th>
                            {currentPersonal.workHours[4].day}
                          </th>
                          <th>
                            {currentPersonal.workHours[4].startTime}
                          </th>
                          <th>
                            {currentPersonal.workHours[4].endTime}
                          </th>
                        </tr>
                        <tr>
                          <th>
                            {currentPersonal.workHours[5].day}
                          </th>
                          <th>
                            {currentPersonal.workHours[5].startTime}
                          </th>
                          <th>
                            {currentPersonal.workHours[5].endTime}
                          </th>
                        </tr>
                        <tr>
                          <th>
                            {currentPersonal.workHours[6].day}
                          </th>
                          <th>
                            {currentPersonal.workHours[6].startTime}
                          </th>
                          <th>
                            {currentPersonal.workHours[6].endTime}
                          </th>
                        </tr>
                        <tr>
                          <th>
                            {currentPersonal.workHours[0].day}
                          </th>
                          <th>
                            {currentPersonal.workHours[0].startTime}
                          </th>
                          <th>
                            {currentPersonal.workHours[0].endTime}
                          </th>
                        </tr>
                      </table>
                    </div>
                  )}
                  {currentPersonal.address && (
                    <div className="form-group-horizontal">
                      <label>
                        <strong>Endereço:</strong>
                      </label>
                      <label>
                        {" "+currentPersonal.address.street+", "+currentPersonal.address.number+" - "+currentPersonal.address.neighborhood+", "+currentPersonal.address.city+" - "+currentPersonal.address.state+", CEP "+currentPersonal.address.zipCode}
                      </label>
                    </div>
                  )}
                  {currentPersonal.socialMedia && (
                    <div>
                      <label>
                        <strong>Mídias Sociais:</strong>
                      </label>
                      <ul className="list-group">
                        <li>
                          <FontAwesomeIcon icon={faInstagram} />
                          <a href={currentPersonal.socialMedia.instagram} class="fa fa-facebook">{" "}Instagram</a>
                        </li>
                        <li>
                          <FontAwesomeIcon icon={faFacebook} />
                          <a href={currentPersonal.socialMedia.instagram} class="fa fa-facebook">{" "}Faceboook</a>
                        </li>
                        <li>
                          <FontAwesomeIcon icon={faTwitter} />
                          <a href={currentPersonal.socialMedia.instagram} class="fa fa-facebook">{" "}Twitter</a>
                        </li>
                        <li>
                          <FontAwesomeIcon icon={faWeebly} />
                          <a href={currentPersonal.socialMedia.instagram} class="fa fa-facebook">{" "}Website</a>
                        </li>
                      </ul>
                    </div>
                  )}
                  <div className="form-group-horizontal">
                    <label>
                      <strong>Certificates:</strong>
                    </label>
                    <label>
                      {" "}
                    </label>
                  </div>
                  <div className="form-group-horizontal">
                    <label>
                      <strong>Graduation:</strong>
                    </label>
                    <label>
                      {" "}
                    </label>
                  </div>
                  <br/>
                  <Link
                    to={"/personal/" + currentPersonal.id}
                    className="button button-primary button-wide-mobile"
                  >
                    Editar
                  </Link>
                </div>
              ) : (
                <div>
                  <br />
                  <p>Selecione uma personal trainer para detalhes...</p>
                </div>
              )}
            </div>
          </div>
          <div className="form-group">
            {currentPersonal ? (
              <BehiveCalendar currentEntity={this.state.currentPersonal} role={"PERSONAL"} editable={true}/>
            ) : ("")}
          </div>
        </div>
      </>
    );
  }
}
