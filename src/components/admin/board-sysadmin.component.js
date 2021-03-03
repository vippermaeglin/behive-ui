import React, { Component } from "react";

import GymService from "../../services/gym.service";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFacebook, faInstagram, faTwitter, faWeebly } from '@fortawesome/free-brands-svg-icons'

export default class BoardSysAdmin extends Component {
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
              <h4>Bem vindo Sys Admin!</h4>
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
                      {gym.brandName} ({gym.cnpj})
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
                      <strong>Representante:</strong>
                    </label>
                    <label>
                      {" "+currentGym.user.userName}
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
                  <div>
                    <label>
                      <strong>Funcionamento:</strong>
                    </label>  
                      <table>
                        <tr>
                          <th>DIA</th>
                          <th>ABERTURA</th>
                          <th>ENCERRAMENTO</th>
                        </tr>
                        <tr>
                          <th>
                            {currentGym.workHours[1].day}
                          </th>
                          <th>
                            {currentGym.workHours[1].startTime}
                          </th>
                          <th>
                            {currentGym.workHours[1].endTime}
                          </th>
                        </tr>
                        <tr>
                          <th>
                            {currentGym.workHours[2].day}
                          </th>
                          <th>
                            {currentGym.workHours[2].startTime}
                          </th>
                          <th>
                            {currentGym.workHours[2].endTime}
                          </th>
                        </tr>
                        <tr>
                          <th>
                            {currentGym.workHours[3].day}
                          </th>
                          <th>
                            {currentGym.workHours[3].startTime}
                          </th>
                          <th>
                            {currentGym.workHours[3].endTime}
                          </th>
                        </tr>
                        <tr>
                          <th>
                            {currentGym.workHours[4].day}
                          </th>
                          <th>
                            {currentGym.workHours[4].startTime}
                          </th>
                          <th>
                            {currentGym.workHours[4].endTime}
                          </th>
                        </tr>
                        <tr>
                          <th>
                            {currentGym.workHours[5].day}
                          </th>
                          <th>
                            {currentGym.workHours[5].startTime}
                          </th>
                          <th>
                            {currentGym.workHours[5].endTime}
                          </th>
                        </tr>
                        <tr>
                          <th>
                            {currentGym.workHours[6].day}
                          </th>
                          <th>
                            {currentGym.workHours[6].startTime}
                          </th>
                          <th>
                            {currentGym.workHours[6].endTime}
                          </th>
                        </tr>
                        <tr>
                          <th>
                            {currentGym.workHours[0].day}
                          </th>
                          <th>
                            {currentGym.workHours[0].startTime}
                          </th>
                          <th>
                            {currentGym.workHours[0].endTime}
                          </th>
                        </tr>
                      </table>
                  </div>
                  <div className="form-group-horizontal">
                    <label>
                      <strong>Endereço:</strong>
                    </label>
                    <label>
                      {" "+currentGym.address.street+", "+currentGym.address.number+" - "+currentGym.address.neighborhood+", "+currentGym.address.city+" - "+currentGym.address.state+", CEP "+currentGym.address.zipCode}
                    </label>
                  </div>
                  <div>
                    <label>
                      <strong>Mídias Sociais:</strong>
                    </label>
                    <ul className="list-group">
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
                  <br/>
                  <Link
                    to={"/gyms/" + currentGym.id}
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
        </div>

      </>
    );
  }
}
