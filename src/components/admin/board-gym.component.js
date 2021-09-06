import React, { Component } from "react";
import SectionHeader from '../landing/sections/partials/SectionHeader';
import BehiveCalendar from "../calendar/behive-calendar.component";
import GymService from "../../services/gym.service";
import AuthService from "../../services/auth.service";
import { Link } from "react-router-dom";
import Image from '../landing/elements/Image';
import classNames from 'classnames';
 
export default class BoardGym extends Component {

  constructor(props) {
    super(props);
    console.log("constructor props")
    console.log(this.props.currentUser)

    this.state = {
      gym: null
    }
  }

  componentDidMount() {
    this.retrieveGym();
  }
  
  sectionHeader = {
    title: 'Seja bem-vindo!',
    paragraph: this.props.currentUser.userName
  }

  tilesClasses = classNames(
    'tiles-wrap center-content',
    'push-left'
  );

  retrieveGym() {
    GymService.getGymByUserId(this.props.currentUser.id).then(
      response => {
        console.log("retrieveGym");
        if(response.data.length>0) {
          AuthService.setProfile(response.data[0]);
          this.setState({
            gym: response.data[0]
          });
          console.log(this.state.gym);
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
              {this.state.gym ? (
                <BehiveCalendar  currentEntity={this.state.gym} role={"GYM"} editable={false}/>
              ) : ("")}
            </div>
          </div>
          <div className={this.tilesClasses}>
            <div className="tiles-item reveal-from-bottom" data-reveal-delay="200">
                <div className="tiles-item-inner">
                  <div className="features-tiles-item-header">
                    <div className="features-tiles-item-image mb-16">
                      <Link to= {"/personal-invite/"+(this.state.gym!==null?this.state.gym.id:"")}>
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
                      Cadastrar Novo Personal Trainer
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
                      <Link to= "/personal/new">
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
                      Registrar Personal Trainer Existente
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
                      <Link to={"/gym/" + (this.state.gym!==null?this.state.gym.id:"")}>
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
                      Atualizar Cadastro
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


