import React, { Component } from "react";
import SectionHeader from '../landing/sections/partials/SectionHeader';
import BehiveCalendar from "../calendar/behive-calendar.component";
import CustomerService from "../../services/customer.service";
import AuthService from "../../services/auth.service";
import WalletService from "../../services/wallet.service";
import { Link } from "react-router-dom";
import Image from '../landing/elements/Image';
import classNames from 'classnames';
import CurrencyFormat from 'react-currency-format';
 
export default class BoardCustomer extends Component {

  constructor(props) {
    super(props);
    console.log("constructor props")
    console.log(this.props.currentUser)

    this.state = {
      customer: null,
      balance: null
    }
  }

  componentDidMount() {
    this.retrieveCustomer();
  }
  
  sectionHeader = {
    title: 'Seja bem-vindo!',
    paragraph: this.props.currentUser.userName
  }

  tilesClasses = classNames(
    'tiles-wrap center-content',
    'push-left'
  );

  retrieveCustomer() {
    CustomerService.getCustomerByUserId(this.props.currentUser.id).then(
      response => {
        console.log("retrieveCustomer");
        if(response.data.length>0) {
          AuthService.setProfile(response.data[0]);
          this.setState({
            customer: response.data[0]
          });
          this.retrieveBalance();
          console.log(this.state.customer);
        }
      }
    )
    .catch(e => {
      console.log(e);
    });
  }

  retrieveBalance() {
    WalletService.getBalance(this.state.customer.sessionToken).then(
      response => {
        console.log("retrieveBalance");
        this.setState({
          balance: response.data.object.ResponseDetail.AmountPreviewTotal
        });
        console.log(this.state.balance);
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
            {this.state.balance ? (<CurrencyFormat className="lbl-green" value={this.state.balance} displayType={'text'} fixedDecimalScale={true} decimalScale={2} thousandSeparator={true} prefix={'Créditos: R$ '} />): ("Créditos:")}
          </div>
          <SectionHeader data={this.sectionHeader} className="center-content" />
          <div className={this.tilesClasses}>
            <div className="tiles-item reveal-from-bottom" data-reveal-delay="200">
                <div className="tiles-item-inner">
                  <div className="features-tiles-item-header">
                    <div className="features-tiles-item-image mb-16">
                      <Link to= "/pix">
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
                      Comprar Créditos
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
                      <Link to= "/dashboard">
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
                      Buscar Academias e Profissionais
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
                      <Link to={"/customer/" + (this.state.customer!==null?this.state.customer.id:"")}>
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
            <div className="form-group">
              {this.state.customer ? (
                <BehiveCalendar  currentEntity={this.state.customer} role={"CUSTOMER"} editable={false}/>
              ) : ("")}
            </div>
        </div>
      </>
    );
  }
}


