import React, { Component } from "react";

import GymService from "../../services/gym.service";
import { Link } from "react-router-dom";

export default class BoardAdmin extends Component {
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

        <div className="container">
          <p>
            <strong>. </strong> 
          </p>
        </div>
        <div className="container">
          <p>
            <strong>. </strong> 
          </p>
        </div>


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
                  className="btn btn-outline-secondary"
                  type="button"
                  onClick={this.searchGym}
                >
                  Procurar
                </button>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <h4>Academias</h4>

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
                    {gym.brandName}
                  </li>
                ))}
            </ul>
          </div>
          <div className="col-md-6">
            {currentGym ? (
              <div>
                <h4>Detalhes</h4>
                <div>
                  <label>
                    <strong>Academia:</strong>
                  </label>{" "}
                  {currentGym.brandName}
                </div>
                <div>
                  <label>
                    <strong>CNPJ:</strong>
                  </label>{" "}
                  {currentGym.cnpj}
                </div>
                <div>
                  <label>
                    <strong>Representante:</strong>
                  </label>{" "}
                  {currentGym.cnpj}
                </div>

                <Link
                  to={"/gyms/" + currentGym.id}
                  className="badge badge-warning"
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

      </>
    );
  }
}
