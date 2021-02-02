import React, { Component, createRef } from "react";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import TinyURL from "tinyurl";

export default class InviteCustomer extends Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.setUrl = this.setUrl.bind(this);

    this.form = createRef();

    this.state = {
      url: null
    };
  }

  componentDidMount() {
    const url = "https://www.behive.fit/customer-signup/"+this.props.match.params.personalId;
    TinyURL.shorten(url, (res, error) => {
      if(error) {
        console.error("Error creating TinyURL, the full URL was provided.");
        this.setUrl(url);
      }
      else {
        this.setUrl(res);
      }
    })
  }

  setUrl = (url) => {
    this.setState({
      url: url
    });
  }

  handleSubmit (e) {
    e.preventDefault();    
    window.location.href = "/dashboard";
  };

  render() {
    const { url } = this.state;    
    return (
      <>
        <div className="container section-inner">
          <h4>Convidar Aluno</h4>
          <div className="col-md-12">
            <div className="card card-container">
              <Form onSubmit={this.handleSubmit} ref={this.form}>
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
