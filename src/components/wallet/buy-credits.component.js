import React, { Component, createRef } from "react";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import WalletService from "../../services/wallet.service";
import AuthService from "../../services/auth.service";
import { v4 as uuidv4 } from 'uuid';

export default class BuyCredits extends Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.form = createRef();
    this.image = createRef();

    this.state = {
      customer: AuthService.getProfile(),
      qrCode: "",
      key: ""
    };
  }

  componentDidMount() {
    this.retrievePix();
  }

  retrievePix() {
    let description = "Static Pix generated for user " + this.state.customer.user.cpf;
    let reference = uuidv4();
    console.log("retrievePix");
    console.log(description);
    console.log(reference);
    WalletService.postPayment(description, reference, this.state.customer.sessionToken).then(
      response => {
        console.log("QR Generated");
        this.setState({
            key: response.data.object.ResponseDetail.Pix.Key,
            qrCode: response.data.object.ResponseDetail.Pix.QrCode
        });
        console.log(response.data.object.ResponseDetail.Pix);
      }
    )
    .catch(e => {
      console.log(e);
    });
  }

  handleSubmit (e) {
    e.preventDefault();    
    this.props.history.push("/dashboard");
    window.location.reload();
  };

  render() {
    const { key, qrCode } = this.state;    
    return (
      <>
        <div className="container section-inner">
          <h4>Comprar Créditos</h4>
          <div className="col-md-12">
            <div className="card card-container">
              <Form onSubmit={this.handleSubmit} ref={this.form}>
                <div className="form-group">
                  <label className="dark-label">Deposite qualquer valor de créditos via Pix, basta escanear a imagem do QR-Code (ou copiar e colar o código abaixo)</label>         
                  <img ref={this.image}
                    src={qrCode}
                    alt="Carregando PIX..."
                  />      
                  <Input
                    type="textarea"
                    className="form-control"
                    name="location"
                    value={key}
                    disabled={true}
                  />            
                </div>
                <br/>
                <div className="form-group">
                  <button className="button button-primary button-wide-mobile button-block">
                    <span>Voltar</span>
                  </button>
                </div>
              </Form>
            </div>
          </div>
        </div>

      </>
    );
  }
}
