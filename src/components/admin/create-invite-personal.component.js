import React, { Component, createRef } from "react";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import Select from "react-validation/build/select";
import TinyURL from "tinyurl";

const required = (value) => {
  if (!value) {
    return (
      <div className="alert alert-danger" role="alert">
        Campo obrigatório!
      </div>
    );
  }
};

export default class InvitePersonal extends Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.onChangeContract = this.onChangeContract.bind(this);
    this.setUrl = this.setUrl.bind(this);

    this.form = createRef();

    this.state = {
      contractTypes: ["ESTAGIÁRIO", "INTERNO", "EXTERNO", "MODALIDADES"],
      contractIndex: -1,
      currentContract: null,
      url: null
    };
  }

  componentDidMount() {
  }

  onChangeContract(e) {
    const index = e.target.value;
    const contract = this.state.contractTypes[index];
    console.log("onChangeContract");
    console.log(this.props.match.params);
    const url = "https://www.behive.fit/personal-signup/"+this.props.match.params.gymId+"/"+contract;
    this.setState({
      contractIndex: index,
      currentContract: contract
    });
    TinyURL.shorten(url, (res, error) => {
      if(error) {
        console.error("Error creating TinyURL, the full URL was provided.");
        this.setUrl(url);
      }
      else {
        this.setUrl(res);
      }
    })
    this.setState({
      contractIndex: index,
      currentContract: contract
    });
  };

  setUrl = (url) => {
    this.setState({
      url: url
    });
  }

  handleSubmit (e) {
    e.preventDefault();    
    this.props.history.push("/dashboard");
    window.location.reload();
  };

  render() {
    const { contractIndex, contractTypes, url } = this.state;    
    return (
      <>
        <div className="container section-inner">
          <h4>Convidar Personal Trainer</h4>
          <div className="col-md-12">
            <div className="card card-container">
              <Form onSubmit={this.handleSubmit} ref={this.form}>
                <div className="form-group">
                  <label className="dark-label" htmlFor="user">Tipo de Contrato:</label>
                  <Select name='contract'
                    className="form-control"
                    value={contractIndex}
                    onChange={this.onChangeContract}
                    validations={[required]}
                  >                  
                  <option value="">Selecione...</option>
                  {contractTypes.map((contract, index) => (
                    <option value={index}>{contract}</option>
                  ))}
                </Select>    
                </div>
                <div className="form-group">
                  <label className="dark-label">Link do convite:</label>
                  <Input
                    type="textarea"
                    className="form-control"
                    name="location"
                    value={url}
                    disabled={true}
                  />            
                </div>
                <br/>
                <div className="form-group">
                  <button className="button button-primary button-wide-mobile button-block">
                    <span>Fechar</span>
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
