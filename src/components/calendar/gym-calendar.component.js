//REACT Popup on Calendar https://stackoverflow.com/a/56287774

import React, { Component, createRef } from "react";

import GymService from "../../services/gym.service";
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import momentPlugin, {toMomentDuration} from '@fullcalendar/moment'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import Moment from "moment"
import Input from "react-validation/build/input";
import Select from "react-validation/build/select";
import Form from "react-validation/build/form";
import Collapsible from 'react-collapsible';
import CheckButton from "react-validation/build/button";

let eventGuid = 0
let todayStr = new Date().toISOString().replace(/T.*$/, '') // YYYY-MM-DD of today

export const INITIAL_EVENTS = [
  {
    id: createEventId(),
    title: '{ "pt": "Magal dos Santos", "customer": "Ana Moreira" }',
    start: todayStr + 'T06:00:00',
    durationEditable: false,
    pt: "1",
    customer: "1"
  },
  {
    id: createEventId(),
    title: '{ "pt": "Eduardo Vilela", "customer": "Carlos Simões" }',
    start: todayStr + 'T11:00:00',
    durationEditable: false,
    pt: "2",
    customer: "2"
  },
  {
    id: createEventId(),
    title: '{ "pt": "Eduardo Vilela", "customer": "João dos Santos" }',
    start: todayStr + 'T12:00:00',
    durationEditable: false,
    pt: "2",
    customer: "3"
  },
  {
    id: createEventId(),
    title: '{ "pt": "Vinícius Arruda", "customer": "José da Silva" }',
    start: todayStr + 'T16:00:00',
    durationEditable: false,
    pt: "3",
    customer: "4"
  },
  {
    id: createEventId(),
    title: '{ "pt": "Vinícius Arruda", "customer": "Beto Carvalho" }',
    start: todayStr + 'T18:00:00',
    durationEditable: false,
    pt: "3",
    customer: "5"
  }
]

export const PERSONAL_TRAINERS = [
  {
    id: "1",
    brandName: "Magal dos Santos",
    price: 6
  },
  {
    id: "2",
    brandName: "Eduardo Vilela",
    price: 10
  },
  {
    id: "3",
    brandName: "Vinícius Arruda",
    price: 8
  }
]

export const CUSTOMERS = [
  {
    id: "1",
    user: { userName: "Ana Moreira", cpf: "058.687.445-82" }
  },
  {
    id: "2",
    user: { userName: "Carlos Simões", cpf: "487.563.699-97" }
  },
  {
    id: "3",
    user: { userName: "João dos Santos", cpf: "655.982.697-23" }
  },
  {
    id: "4",
    user: { userName: "José da Silva", cpf: "665.441.998-25" }
  },
  {
    id: "5",
    user: { userName: "Beto Carvalho", cpf: "452.665.787-22" }
  }
]

export const workHours = [ // specify an array instead
  {
    daysOfWeek: [ 1, 2, 3, 4, 5 ], // Monday to Friday
    startTime: '06:00',
    endTime: '22:00'
  },
  {
    daysOfWeek: [ 6 ], // Saturday
    startTime: '09:00',
    endTime: '18:00'
  }
]           

export const eventsFeed = {
  url: "https://behive-fit.herokuapp.com/calendar/feed",
  method: "POST",
  extraParams: {
    //id: this.state.gym.id,
    type: "GYM"
  },
  failure: function() {
    alert("Ops! Houve um erro ao tentar carregar o calendário, tente novamente.");
  }
}

export function createEventId() {
  return String(eventGuid++)
}

const required = (value) => {
  if (!value) {
    return (
      <div className="alert alert-danger" role="alert">
        Campo obrigatório!
      </div>
    );
  }
};

const vEventHour = (value) => {
  if (value < 0 || value > 23) {
    return (
      <div className="alert alert-danger" role="alert">
        Horário inválido!
      </div>
    );
  }
};

const vRepeatWeeks = (value) => {
  if (value < 1 || value > 30) {
    return (
      <div className="alert alert-danger" role="alert">
        Quantidade de semanas inválida!
      </div>
    );
  }
};

const vPrice = (value) => {
  if (value < 0) {
    return (
      <div className="alert alert-danger" role="alert">
        Preço inválido!
      </div>
    );
  }
};

const vPT = (value) => {
  if (value < 0) {
    return (
      <div className="alert alert-danger" role="alert">
        Selecione um Personal Trainer!
      </div>
    );
  }
};

const vCustomer = (value) => {
  if (value < 0) {
    return (
      <div className="alert alert-danger" role="alert">
        Selecione um Aluno!
      </div>
    );
  }
};

export default class GymCalendar extends Component {
  constructor(props) {
    super(props);
    this.retrieveGymCalendar = this.retrieveGymCalendar.bind(this);
    this.toggle = this.toggle.bind(this);
    this.onChangePT = this.onChangePT.bind(this);
    this.onChangeCustomer = this.onChangeCustomer.bind(this);
    this.onChangeEventHour = this.onChangeEventHour.bind(this);
    this.onChangeRepeatSun = this.onChangeRepeatSun.bind(this);
    this.onChangeRepeatMon = this.onChangeRepeatMon.bind(this);
    this.onChangeRepeatTue = this.onChangeRepeatTue.bind(this);
    this.onChangeRepeatWed = this.onChangeRepeatWed.bind(this);
    this.onChangeRepeatThu = this.onChangeRepeatThu.bind(this);
    this.onChangeRepeatFri = this.onChangeRepeatFri.bind(this);
    this.onChangeRepeatSat = this.onChangeRepeatSat.bind(this);
    this.onChangeRepeatWeeks = this.onChangeRepeatWeeks.bind(this);
    this.onChangePrice = this.onChangePrice.bind(this);
    this.getGymAddress = this.getGymAddress.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.form = createRef();
    this.checkBtn = createRef();

    this.state = {
      currentEvent: null,
      loading: false,
      message: null,
      selectInfo: null,
      modal: false,
      isCreate: false,
      ptIndex: -1,
      currentPT: null,
      customerIndex: -1,
      currentCustomer: null,
      eventHour: null,
      repeatSun: null,
      repeatMon: null,
      repeatTue: null,
      repeatWed: null,
      repeatThu: null,
      repeatFri: null,
      repeatSat: null,
      repeatWeeks: null,
      price: null,
      location: null
    };
  }

  componentDidMount() {
    this.retrieveGymCalendar();
  }

  toggle(eventClickInfo) {
    this.setState(prevState => ({
      modal: !prevState.modal
    }));
  }

  getGymAddress() {
    let address = this.props.currentGym.address
    return address.street+", "+address.number+" - "+address.neighborhood
  }

  onChangePT(e) {
    const index = e.target.value;
    const trainer = PERSONAL_TRAINERS[index];
    this.setState({
      ptIndex: index,
      currentPT: trainer,
      price: trainer.price,
      location: this.getGymAddress()
    });
  }

  onChangeCustomer(e) {
    const index = e.target.value;
    const c = CUSTOMERS[index];
    this.setState({
      customerIndex: index,
      currentCustomer: c
    });
  }

  onChangeEventHour(e) {
    this.setState({
      eventHour: e.target.value
    });
  }

  onChangeRepeatSun(e) {
    this.setState({
      repeatSun: e.target.value
    });
  }

  onChangeRepeatMon(e) {
    this.setState({
      repeatMon: e.target.value
    });
  }

  onChangeRepeatTue(e) {
    this.setState({
      repeatTue: e.target.value
    });
  }

  onChangeRepeatWed(e) {
    this.setState({
      repeatWed: e.target.value
    });
  }

  onChangeRepeatThu(e) {
    this.setState({
      repeatThu: e.target.value
    });
  }

  onChangeRepeatFri(e) {
    this.setState({
      repeatFri: e.target.value
    });
  }

  onChangeRepeatSat(e) {
    this.setState({
      repeatSat: e.target.value
    });
  }

  onChangeRepeatWeeks(e) {
    this.setState({
      repeatWeeks: e.target.value
    });
  }

  onChangePrice(e) {
    this.setState({
      price: e.target.value
    });
  }

  retrieveGymCalendar() {
    GymService.getAllGyms().then(
      response => {
        this.setState({
          //todo
        });
      }
    )
    .catch(e => {
      console.log(e);
    });
  }

  handleSubmit (e) {
    e.preventDefault();
    console.log("handleSubmit");
    console.log(JSON.stringify(this.state));
    
    this.setState({
      message: "",
      loading: true
    });

    this.form.current.validateAll();

    if (this.checkBtn.current.context._errors.length === 0) {
      let calendarApi = this.state.selectInfo.view.calendar;

      calendarApi.unselect() // clear date selection

      let titleObj = {
        pt: this.state.currentPT.brandName,
        customer: this.state.currentCustomer.user.userName
      }
      let title = JSON.stringify(titleObj);

      //for(let i = 0; i < this.state.repeatWeeks; i++) {
        calendarApi.addEvent({
          id: createEventId(),
          title: title,
          start: this.state.selectInfo.startStr,
          end: this.state.selectInfo.endStr,
          allDay: this.state.selectInfo.allDay})
        //}

      this.setState({
        loading: false
      });

      this.toggle();

      /*GymService.create(address, brandName, cnpj, commercialPhone, companyName, highPricePct,
        lowPricePct, price, socialMedia, user, workHours, logo).then(
        () => {
          this.setState({
            loading: false
          });
          window.location.href = "/admin-gym";
        },
        (error) => {
          const resMessage =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();

            this.setState({
              message: resMessage,
              loading: false
            });
        }
      );*/
    } else {
      this.setState({
        loading: false
    });
    }
  };

  render() {
    return (
        <div className="container section-inner" key={this.props.currentGym}>
          <div className='demo-app-main'>
            <FullCalendar
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, momentPlugin]}
              headerToolbar={{
              left: 'prev,next today',
              /* center: 'title', */
              right: 'timeGridDay,timeGridWeek,dayGridMonth'
              }}
              initialView='timeGridWeek'
              //eventColor="#e1af0b"
              //eventBorderColor="#ffffff"
              timeZone={"local"}
              editable={true}
              selectable={true}
              selectMirror={true}
              dayMaxEvents={true}
              weekends={true}
              nowIndicator={true}
              allDaySlot={false}
              displayEventTime={false}
              selectConstraint={workHours}
              eventConstraint={workHours}
              businessHours={workHours}
              slotDuration={"01:00:00"}
              selectAllow={this.selectFixedAllow}
              eventResizableFromStart={"false"}
              eventDurationEditable={"false"}
              firstHour={new Date().getUTCHours()}
              initialEvents={INITIAL_EVENTS} // alternatively, use the `events` setting to fetch from a feed
              //events={eventsFeed}
              eventContent={renderEventContent} // custom render function
              eventsSet={this.handleEvents} // called after events are initialized/added/changed/removed
              select={this.handleDateSelect}
              eventClick={this.handleEventClick}
              /*you can update a remote database when these fire:
              eventAdd={function(){}}
              eventChange={function(){}}
              eventRemove={function(){}}
              */
            />
            <Modal
              isOpen={this.state.modal}
              toggle={this.toggle}
              className={this.props.className}
            >
              {this.state.modal && (
                <>
                  <ModalHeader toggle={this.toggle}>
                    { this.state.isCreate && ("Agendar Aula - "+this.props.currentGym.brandName)}
                    { !this.state.isCreate && ("Aula "+Moment(this.state.currentEvent.start).format("HH:mm - DD/MM/YYYY"))}
                  </ModalHeader>
                  <ModalBody>
                    { this.state.isCreate && (
                      <div>
                        <Form onSubmit={this.handleSubmit} ref={this.form}>
                          <div className="form-group">
                            <label className="dark-label" htmlFor="personal-trainer">Personal Trainer</label>
                            <Select name='personal-trainer'
                              className="form-control"
                              value={this.state.ptIndex}
                              onChange={this.onChangePT}
                              validations={[required, vPT]}
                            >
                              <option value={-1} disabled>Selecione</option>
                              {PERSONAL_TRAINERS.map((pt, index) => (
                                <option value={index}>{pt.brandName}</option>
                              ))}
                            </Select>
                          </div>
                          <div className="form-group">
                            <label className="dark-label" htmlFor="customer">Aluno</label>
                            <Select name='customer'
                              className="form-control"
                              value={this.state.customerIndex}
                              onChange={this.onChangeCustomer}
                              validations={[required, vCustomer]}
                            >
                              <option value={-1} disabled>Selecione</option>
                              {CUSTOMERS.map((customer, index) => (
                                <option value={index}>{customer.user.userName+" ("+customer.user.cpf+")"}</option>
                              ))}
                            </Select>
                          </div>
                          <div className="form-group">
                            <label className="dark-label" htmlFor="eventHour">Horário</label>
                            <Input
                              type="number"
                              className="form-control"
                              name="eventHour"
                              value={this.state.eventHour}
                              onChange={this.onChangeEventHour}
                              validations={[required, vEventHour]}                
                            />         
                          </div>
                          <Collapsible trigger="Repetir">
                            <div className="border-panel">
                              <div className="form-group-horizontal">
                                <label className="dark-label">
                                  Dom                              
                                  <input
                                    name="repeatSun"
                                    type="checkbox"
                                    checked={this.state.repeatSun}
                                    onChange={this.onChangeRepeatSun} />
                                </label>
                                <label className="dark-label">
                                  2ª                                
                                  <input
                                    name="repeatMon"
                                    type="checkbox"
                                    checked={this.state.repeatMon}
                                    onChange={this.onChangeRepeatMon} />
                                </label>
                                <label className="dark-label">
                                  3ª                                  
                                  <input
                                    name="repeatTue"
                                    type="checkbox"
                                    checked={this.state.repeatTue}
                                    onChange={this.onChangeRepeatTue} />
                                </label>
                                <label className="dark-label">
                                  4ª                                  
                                  <input
                                    name="repeatWed"
                                    type="checkbox"
                                    checked={this.state.repeatWed}
                                    onChange={this.onChangeRepeatWed} />
                                </label>
                                <label className="dark-label">
                                  5ª                                    
                                  <input
                                    name="repeatThu"
                                    type="checkbox"
                                    checked={this.state.repeatThu}
                                    onChange={this.onChangeRepeatThu} />
                                </label>
                                <label className="dark-label">
                                  6ª                                    
                                  <input
                                    name="repeatFri"
                                    type="checkbox"
                                    checked={this.state.repeatFri}
                                    onChange={this.onChangeRepeatFri} />
                                </label>
                                <label className="dark-label">
                                  Sáb                                
                                  <input
                                    name="repeatSat"
                                    type="checkbox"
                                    checked={this.state.repeatSat}
                                    onChange={this.onChangeRepeatSat} />
                                </label>
                              </div>
                              <div className="form-group-horizontal">
                                <label className="dark-label">Qtde de Semanas:</label>
                                <Input
                                  type="number"
                                  className="form-control"
                                  name="repeatWeeks"
                                  value={this.state.repeatWeeks}
                                  onChange={this.onChangeRepeatWeeks}
                                  validations={[required, vRepeatWeeks]}                
                                />         
                              </div>
                            </div>
                          </Collapsible>
                          <br/>
                          <div className="form-group">
                            <label className="dark-label" htmlFor="price">Preço R$</label>
                            <Input
                              type="number"
                              className="form-control"
                              name="price"
                              value={this.state.price}
                              onChange={this.onChangePrice}
                              validations={[required, vPrice]}
                              placeHolder="Sugestão de mercado: R$6"
                            />            
                          </div>
                          <div className="form-group">
                            <label className="dark-label">Local</label>
                            <Input
                              type="textarea"
                              className="form-control"
                              name="location"
                              value={this.state.location}
                              onChange={this.onChangeLocation}
                              validations={[required]}
                            />            
                          </div>
                          <div className="form-group">
                            <button className="button button-primary button-wide-mobile button-block" disabled={this.state.loading}>
                              {this.state.loading && (
                                <span className="spinner-border spinner-border-sm"></span>
                              )}
                              <span>Salvar</span>
                            </button>
                          </div>

                          {this.state.message && (
                            <div className="form-group">
                              <div className="alert alert-danger" role="alert">
                                {this.state.message}
                              </div>
                            </div>
                          )}
                          <CheckButton style={{ display: "none" }} ref={this.checkBtn} />
                        </Form> 
                      </div>
                    )}
                    { !this.state.isCreate && (
                      <div>
                        <p className="p-dark">{"Academia: " + this.props.currentGym.brandName}</p>
                        <p className="p-dark">{"Personal Trainer: " + JSON.parse(this.state.currentEvent.title).pt}</p>
                        <p className="p-dark">{"Aluno: " + JSON.parse(this.state.currentEvent.title).customer}</p>
                      </div>
                    )}
                  </ModalBody>
                  { this.state.isCreate && (
                    <ModalFooter>
                      <Button color="secundary" onClick={this.toggle}>
                        Cancelar
                      </Button>
                    </ModalFooter>
                  )}
                  { !this.state.isCreate && (
                    <ModalFooter>
                      <Button color="primary" onClick={this.toggle}>
                        Fechar
                      </Button>
                      <Button color="danger" onClick={() => {this.deleteEvent(this.state.currentEvent); this.toggle()}}>
                        Remover
                      </Button>
                    </ModalFooter>
                  )}
                </>
              )}
            </Modal>
          </div>
        </div>
    );
  }

  handleWeekendsToggle = () => {
    this.setState({
      weekendsVisible: !this.state.weekendsVisible
    })
  }

  deleteEvent(event) {
    // eslint-disable-next-line no-restricted-globals
    if (confirm('Tem certeza que deseja remover esta aula?')) {
      event.remove()
    }
  }

  handleDateSelect = (selectInfo) => {

    console.log("handleDateSelect")
    console.log(selectInfo)
    let day = selectInfo.start.getDay()
    console.log(day)
    this.setState({ isCreate: true, 
                    selectInfo: selectInfo,
                    eventHour: selectInfo.start.getHours(), 
                    repeatWeeks: 1,
                    repeatSun: day === 0? true : false,
                    repeatMon: day === 1? true : false,
                    repeatTue: day === 2? true : false,
                    repeatWed: day === 3? true : false,
                    repeatThu: day === 4? true : false,
                    repeatFri: day === 5? true : false,
                    repeatSat: day === 6? true : false,
                   });
    this.toggle(); 
    
    /* let title = prompt('Please enter a new title for your event')
    let calendarApi = selectInfo.view.calendar

    calendarApi.unselect() // clear date selection

    if (title) {
      calendarApi.addEvent({
        id: createEventId(),
        title: title,
        start: selectInfo.startStr,
        end: selectInfo.endStr,
        allDay: selectInfo.allDay
      })
    }*/
  }

  handleEventClick = (clickInfo) => {
    console.log("handleEventClick")
    console.log(clickInfo)
    console.log("extendedProps")
    console.log(clickInfo.event.extendedProps)
    this.setState({ "currentEvent": clickInfo.event, "isCreate": false });
    this.toggle();
    console.log(JSON.parse(this.state.currentEvent.title));
  }

  handleEvents = (events) => {
    this.setState({
      events: events
    })
  }

  selectFixedAllow = (selectInfo) => {
    var duration = toMomentDuration(selectInfo.end-selectInfo.start);
    return duration.asHours() <= 1;
  }

  getCurrentPT = () => {
    var obj = JSON.parse(this.state.currentEvent.title)
    return obj.pt
  }

}

function renderEventContent(eventInfo) {
  if(eventInfo.event.title === "") {
    return;
  }
  var obj = JSON.parse(eventInfo.event.title)
  return (
    <>
      <b>{eventInfo.timeText}</b>
      <i>{obj.pt.split(" ")[0] + " - " + obj.customer.split(" ")[0]}</i>
    </>
  )
}