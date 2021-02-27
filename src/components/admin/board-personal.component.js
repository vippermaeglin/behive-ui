import React, { Component } from "react";
import SectionHeader from '../landing/sections/partials/SectionHeader';
import BehiveCalendar from "../calendar/behive-calendar.component";
import PersonalService from "../../services/personal.service";
import AuthService from "../../services/auth.service";
import { Link } from "react-router-dom";
import Image from '../landing/elements/Image';
import classNames from 'classnames';
import authService from "../../services/auth.service";
 
export default class BoardGym extends Component {

  constructor(props) {
    super(props);
    console.log("constructor props")
    console.log(this.props.currentUser)

    this.state = {
      personalTrainer: null
    }
  }

  componentDidMount() {
    this.retrievePersonalTrainer();
  }
  
  sectionHeader = {
    title: 'Seja bem-vindo!',
    paragraph: this.props.currentUser.userName
  }

  tilesClasses = classNames(
    'tiles-wrap center-content',
    'push-left'
  );

  retrievePersonalTrainer() {
    PersonalService.getPersonalByUserId(this.props.currentUser.id).then(
      response => {
        console.log("retrievePersonalTrainer");
        if(response.data.length>0) {
          AuthService.setProfile(response.data[0]);
          this.setState({
            personalTrainer: response.data[0]
          });
          console.log(this.state.personalTrainer);
        }
      }
    )
    .catch(e => {
      console.log(e);
    });
  }

  render() {

    return (
      <>
        <div className="container section-inner">
          <div>
            <SectionHeader data={this.sectionHeader} className="center-content" />
            <div className="form-group">
              {this.state.personalTrainer ? (
                <BehiveCalendar  currentEntity={this.state.personalTrainer} role={"PERSONAL"} editable={true}/>
              ) : ("")}
            </div>
          </div>
          <div className={this.tilesClasses}>
            <div className="tiles-item reveal-from-bottom" data-reveal-delay="200">
                <div className="tiles-item-inner">
                  <div className="features-tiles-item-header">
                    <div className="features-tiles-item-image mb-16">
                      <Link to= {"/customer-invite/"+(this.state.personalTrainer!==null?this.state.personalTrainer.id:"")}>
                        <Image
                          src={require('../../assets/images/feature-tile-icon-02.svg')}
                          alt="Features tile icon 05"
                          width={64}
                          height={64} />
                          </Link>
                    </div>
                  </div>
                  <div className="features-tiles-item-content">
                    <h4 className="mt-0 mb-8">
                      Cadastrar Novo Aluno
                      </h4>
                      <div style={{ display: 'none'}}>
                    <p className="m-0 text-sm">
                    Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat..
                      </p>
                      </div>
                  </div>
                </div>
              </div>

              <div className="tiles-item reveal-from-bottom">
                <div className="tiles-item-inner">
                  <div className="features-tiles-item-header">
                    <div className="features-tiles-item-image mb-16">
                      <Link to= "/admin-gym">
                        <Image
                          src={require('../../assets/images/feature-tile-icon-02.svg')}
                          alt="Features tile icon 01"
                          width={64}
                          height={64} />
                        </Link>
                    </div>
                  </div>
                  <div className="features-tiles-item-content">
                    <h4 className="mt-0 mb-8">
                      Ver Todas as Academias
                      </h4>
                      <div style={{ display: 'none'}}>
                    <p className="m-0 text-sm">
                      Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat.
                      </p>
                      </div>
                  </div>
                </div>
              </div>

              <div className="tiles-item reveal-from-bottom" data-reveal-delay="200">
                <div className="tiles-item-inner">
                  <div className="features-tiles-item-header">
                    <div className="features-tiles-item-image mb-16">
                      <Link to= {"/personal/"+(this.state.personalTrainer!==null?this.state.personalTrainer.id:"")}>
                        <Image
                          src={require('../../assets/images/feature-tile-icon-02.svg')}
                          alt="Features tile icon 02"
                          width={64}
                          height={64} />
                        </Link>
                    </div>
                  </div>
                  <div className="features-tiles-item-content">
                    <h4 className="mt-0 mb-8">
                      Editar Perfil
                      </h4>
                      <div style={{ display: 'none'}}>
                    <p className="m-0 text-sm">
                      Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat.
                      </p>
                      </div>
                  </div>
                </div>
              </div>
            </div>
        </div>
      </>
    );
  }
}


