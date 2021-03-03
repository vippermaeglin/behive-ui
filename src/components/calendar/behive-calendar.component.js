//REACT Popup on Calendar https://stackoverflow.com/a/56287774

import React, { Component, createRef } from "react";

import GymService from "../../services/gym.service";
import PersonalService from "../../services/personal.service";
import CustomerService from "../../services/customer.service";
import CalendarService from "../../services/calendar.service";
import AuthService from "../../services/auth.service";
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import momentPlugin, {toMomentDuration} from '@fullcalendar/moment'
import { Button, Modal, ModalHeader, ModalBody } from "reactstrap";
import Moment from "moment-timezone"
import Input from "react-validation/build/input";
import Select from "react-validation/build/select";
import Form from "react-validation/build/form";
import Collapsible from 'react-collapsible';
import CheckButton from "react-validation/build/button";

let eventGuid = 0

/* export const PERSONAL_TRAINERS = [
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
] */

//TODO NOW: apply from entity work hours
/* export const workHours = [ // specify an array instead
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

export function createEventId() {
  return String(eventGuid++)
} */

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

const vRepeatEvents = (value) => {
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

const vGym = (value) => {
  if (value < 0) {
    return (
      <div className="alert alert-danger" role="alert">
        Selecione uma Academia!
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

export default class BehiveCalendar extends Component {
  constructor(props) {
    super(props);
    console.log("constructor props")
    console.log(this.props.currentEntity)
    console.log(this.props.role)
    this.toggle = this.toggle.bind(this);
    this.onChangeGym = this.onChangeGym.bind(this);
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
    this.onChangeRepeatEvents = this.onChangeRepeatEvents.bind(this);
    this.onChangePrice = this.onChangePrice.bind(this);
    this.getGymAddress = this.getGymAddress.bind(this);
    this.handleFormEvent = this.handleFormEvent.bind(this);
    this.saveEvent = this.saveEvent.bind(this);
    this.getNextDate = this.getNextDate.bind(this);
    this.eventsFeed = this.eventsFeed.bind(this);
    this.retrievePersonalTrainers = this.retrievePersonalTrainers.bind(this);
    this.retrievePersonalTrainersByCustomer = this.retrievePersonalTrainersByCustomer.bind(this);
    this.retrieveCustomers = this.retrieveCustomers.bind(this);
    this.retrieveGyms = this.retrieveGyms.bind(this);
    this.renderEventContent = this.renderEventContent.bind(this);

    this.form = createRef();
    this.fullCalendar = createRef();
    this.checkBtn = createRef();

    this.state = {
      currentEvent: null,
      gyms: (this.props.role === "GYM") ? [this.props.currentEntity] : [],
      personalTrainers: (this.props.role === "PERSONAL") ? [this.props.currentEntity] : [],
      customers: (this.props.role === "CUSTOMER") ? [this.props.currentEntity] : [],
      loading: false,
      message: null,
      selectInfo: null,
      modal: false,
      isCreate: false,
      gymIndex: (this.props.role === "GYM") ? 0 : -1,
      currentGym: (this.props.role === "GYM") ? this.props.currentEntity : null,
      ptIndex: (this.props.role === "PERSONAL") ? 0 : -1,
      currentPT: (this.props.role === "PERSONAL") ? this.props.currentEntity : null,
      customerIndex: (this.props.role === "CUSTOMER") ? 0 : -1,
      currentCustomer: (this.props.role === "CUSTOMER") ? this.props.currentEntity : null,
      eventHour: null,
      repeatSun: null,
      repeatMon: null,
      repeatTue: null,
      repeatWed: null,
      repeatThu: null,
      repeatFri: null,
      repeatSat: null,
      repeatEvents: 1,
      price: null,
      location: null
    };
  }

  /* INITIAL_EVENTS = [
    {
      id: createEventId(),
      customerId: "bfd17523-ff17-4d97-9dab-03ff388f216c",
      durationEditable: false,
      gymSlot: {
        startSlot: todayStr + 'T06:00:00.000Z',
        endSlot: todayStr + 'T07:00:00.000Z',
        parentId: this.props.currentGym.id,
        price: this.props.currentGym.price
      },
      location: "Rua Alfeneiros, 11 - Bairro Camargos",
      ptSlot: {
        startSlot: todayStr + 'T06:00:00.000Z',
        endSlot: todayStr + 'T07:00:00.000Z',
        parentId: "1b8ab757-de47-43e4-948c-5d86400f2151",
        price: 6
      },
      start: todayStr + 'T06:00:00.000Z',
      end: todayStr + 'T07:00:00.000Z',
      title: "Magal - Ana"
    }
  ] */

  componentDidMount() {
    console.log("componentDidMount props currentEntity")
    console.log(this.props.currentEntity)
    console.log("componentDidMount props role")
    console.log(this.props.role)
    console.log("componentDidMount props editable")
    console.log(this.props.editable)

    if(this.props.role === "GYM") {
      this.setState({
        currentGym: this.props.currentEntity,
        gyms: [this.props.currentEntity],
        gymIndex: 0
      });
      console.log("currentGym:")
      console.log(this.props.currentEntity);
      this.retrievePersonalTrainers(this.props.currentEntity.id);
    }
    else if(this.props.role === "PERSONAL") {
      this.setState({
        currentPersonal: this.props.currentEntity,
        personalTrainers: [this.props.currentEntity],
        ptIndex: 0
      });
      console.log("currentPersonal:")
      console.log(this.props.currentEntity);
      this.retrieveGyms(this.props.currentEntity.id);
    }
    else if(this.props.role === "CUSTOMER") {
      this.setState({
        currentCustomer: this.props.currentEntity,
        customers: [this.props.currentEntity],
        customerIndex: 0
      });
      console.log("currentCustomer:")
      console.log(this.props.currentEntity);
      this.retrievePersonalTrainersByCustomer(this.props.currentEntity.id);
    }
  }

  componentDidUpdate(prevProps) {
    if(this.props.currentEntity !== prevProps.currentEntity) {
      //CalendarApi reference: 
      //https://github.com/fullcalendar/fullcalendar/blob/master/packages/common/src/CalendarApi.tsx
      let calendarApi = this.fullCalendar.current.getApi();
      calendarApi.removeAllEvents();
      calendarApi.refetchEvents();
      console.log("componentDidUpdate props");
      console.log(this.props.currentEntity);

      if(this.props.role === "GYM") {
        this.setState({
          currentGym: this.props.currentEntity,
          gyms: [this.props.currentEntity],
          gymIndex: 0
        });
        console.log("currentGym:")
        console.log(this.props.currentEntity);
        this.retrievePersonalTrainers(this.props.currentEntity.id);
      }
      else if(this.props.role === "PERSONAL") {
        this.setState({
          currentPersonal: this.props.currentEntity,
          personalTrainers: [this.props.currentEntity],
          ptIndex: 0
        });
        console.log("currentPersonal:")
        console.log(this.props.currentEntity);
        //TODO NOW: create this
        this.retrieveGyms(this.props.currentEntity.id);
      }
      else if(this.props.role === "CUSTOMER") {
        this.setState({
          currentCustomer: this.props.currentEntity,
          customers: [this.props.currentEntity],
          customerIndex: 0
        });
        console.log("currentCustomer:")
        console.log(this.props.currentEntity);
        //TODO NOW: retrieve PT by CustomerId
        this.retrievePersonalTrainers(this.props.currentEntity.id);
      }
    }
  }

  toggle(eventClickInfo) {
    this.setState(prevState => ({
      modal: !prevState.modal
    }));
  }

  getGymAddress() {
    let address = this.state.currentGym.address
    return address.street+", "+address.number+" - "+address.neighborhood
  }

  onChangeGym(e) {
    console.log("onChangeGym c");
    const index = e.target.value;
    const c = this.state.gyms[index];
    console.log(c);
    this.setState({
      gymIndex: index,
      currentGym: c
    });
  }

  onChangePT(e) {
    const index = e.target.value;
    const trainer = this.state.personalTrainers[index];
    if(trainer === undefined)
      return;
    this.setState({
      ptIndex: index,
      currentPT: trainer,
      price: trainer.price,
      location: this.getGymAddress()
    });
    this.retrieveCustomers(trainer.id);
  }

  onChangeCustomer(e) {
    const index = e.target.value;
    const c = this.state.customers[index];
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

  onChangeRepeatEvents(e) {
    this.setState({
      repeatEvents: e.target.value
    });
  }

  onChangePrice(e) {
    this.setState({
      price: e.target.value
    });
  }

  deleteEvent(event) {
    //evaluate if event can be canceled
    if(event.start < Moment()) {
      alert("Não é mais possível deletar esta aula!");
      return;
    }
    // eslint-disable-next-line no-restricted-globals
    if (confirm('Tem certeza que deseja remover esta aula?')) {
      CalendarService.deleteEvent(event.id).then(
        //eslint-disable-next-line no-loop-func
        response => {     
          event.remove();
          console.log("Delete event:");
          console.log(event);
        }
      )
      .catch(e => {
        console.log(e);
        alert("Ops! Houve um erro ao tentar excluir a aula, tente novamente.");
      });
    }
  }

  handleFormEvent(e) {
    e.preventDefault();
    this.form.current.validateAll();
    if (this.checkBtn.current.context._errors.length === 0) {
        let eventDate = this.state.isCreate? this.state.start : this.state.currentEvent.start;
        let title = this.state.currentPT.brandName.split(" ")[0] + " - " + this.state.currentCustomer.user.userName.split(" ")[0];
        //Gym slots are optional
        let gymSlot = this.state.currentGym ? {
          startSlot: eventDate,
          endSlot: Moment(eventDate).add(1, "h"),
          parentId: this.state.currentGym.id,
          price: this.state.currentGym.price
        } : null;
        let ptSlot = {
          startSlot: eventDate,
          endSlot: Moment(eventDate).add(1, "h"),
          parentId: this.state.currentPT.id,
          price: this.state.price
        };
        let customerId = this.state.currentCustomer.id
      this.saveEvent(eventDate, gymSlot, ptSlot, customerId, title);
      this.toggle();
    } else {
      this.setState({
        loading: false
      });
    }
  }

  saveEvent (eventDate, gymSlot, ptSlot, customerId, title) {
    
    console.log("saveEvent");
    
    this.setState({
      message: "",
      loading: true
    });

    let calendarApi = this.state.view.calendar;

    let repeatCount = this.state.repeatEvents;

    if(!this.state.isCreate) {
      repeatCount = 1;
      console.log(this.state);
    }

    console.log("eventDate:"+eventDate);
    console.log("repeat:"+repeatCount);

    for(let i = 0; i < repeatCount; i++) {
      let event = {
        id: this.state.isCreate? null:this.state.currentEvent.id,
        customerId: customerId,
        durationEditable: false,
        gymSlot: gymSlot,
        ptSlot: ptSlot,
        location: this.state.location,
        title: title,
        start: eventDate,
        end: Moment(eventDate).add(1, "h")
      }
      CalendarService.saveEvent(event).then(
        // eslint-disable-next-line no-loop-func
        response => {        
          if(!this.state.isCreate) {
            this.state.currentEvent.remove();
          }
          console.log("Old event:");
          console.log(event);
          console.log("New event:");
          console.log(response.data.object);
          event = response.data.object;
          event.start  = eventDate;
          event.end = Moment(eventDate).add(1, "h");
          calendarApi.addEvent(event);
          eventDate = this.getNextDate(eventDate);
        }
      )
      .catch(e => {
        console.log(e);
        alert("Ops! Houve um erro ao tentar salvar a aula, tente novamente.");
      });

    }

    calendarApi.unselect() // clear date selection

    this.setState({
      loading: false
    });
  };

  getNextDate(eventDate) {
    var offset = 1;
    let nextWeekDay = eventDate.getDay() + offset;
    if(nextWeekDay>6) {
      nextWeekDay = 0;
    }
    for(let i = 0; i<7; i++) {
      if((nextWeekDay === 0 && this.state.repeatSun) ||
        (nextWeekDay === 1 && this.state.repeatMon) ||
        (nextWeekDay === 2 && this.state.repeatTue) ||
        (nextWeekDay === 3 && this.state.repeatWed) ||
        (nextWeekDay === 4 && this.state.repeatThu) ||
        (nextWeekDay === 5 && this.state.repeatFri) ||
        (nextWeekDay === 6 && this.state.repeatSat)
        ) {
        return Moment(eventDate).add(offset, "d").toDate();
      }
      else {
        offset++;
        nextWeekDay++;
        if(nextWeekDay>6) {
          nextWeekDay = 0;
        }
      }
    }
  }           

  eventsFeed (info, successCallback, failureCallback) {
    CalendarService.getCalendarFeed(this.props.currentEntity.id, Moment(info.start).format("YYYY-MM-DD"), Moment(info.end).format("YYYY-MM-DD"), this.props.role).then(
      response => {        
        console.log("eventsFeed id="+this.props.currentEntity.id)
        console.log(response.data);
        //Remove old events avoid duplicates :(
        //https://github.com/fullcalendar/fullcalendar/blob/master/packages/common/src/CalendarApi.tsx
        let calendarApi = this.fullCalendar.current.getApi();
        calendarApi.removeAllEvents();
        successCallback(response.data);
      }
    )
    .catch(e => {
      console.log(e);
      alert("Ops! Houve um erro ao tentar carregar o calendário, tente novamente.");
    });
  }

  retrieveGyms(ptId) {
    PersonalService.getGyms(ptId).then(
      response => {
        console.log("retrieveGyms");
        const gyms = response.data.map(result =>
          ({
             id: result.gym.id,
             brandName: result.gym.brandName,
             price: result.gym.price,
             address: result.gym.address
          })
        );
        this.setState({
          gyms: gyms
        });
        if(!this.state.isCreate && this.state.currentEvent != null) {
          for (let i = 0; i < gyms.length; i++) {
            if(gyms[i].id === this.state.currentEvent.extendedProps.gymSlot.parentId) {
              this.setState({"gymIndex": i, "currentGym": gyms[i]});
              break;
            }
          }
        }
        console.log(gyms);
      }
    )
    .catch(e => {
      console.log(e);
    });
  }

  retrievePersonalTrainers(gymId) {
    GymService.getPersonalTrainers(gymId).then(
      response => {
        console.log("retrievePersonalTrainers");
        const personalTrainers = response.data.map(result =>
          ({
             id: result.personalTrainer.id,
             brandName: result.personalTrainer.brandName,
             price: result.personalTrainer.price
          })
        );
        this.setState({
          personalTrainers: personalTrainers
        });
        console.log(personalTrainers);
      }
    )
    .catch(e => {
      console.log(e);
    });
  }

  retrievePersonalTrainersByCustomer(customerId) {
    CustomerService.getPersonalTrainers(customerId).then(
      response => {
        console.log("retrievePersonalTrainersByCustomer");
        const personalTrainers = response.data.map(result =>
          ({
             id: result.personalTrainer.id,
             brandName: result.personalTrainer.brandName,
             price: result.personalTrainer.price
          })
        );
        this.setState({
          personalTrainers: personalTrainers
        });
        console.log(personalTrainers);
      }
    )
    .catch(e => {
      console.log(e);
    });
  }

  retrieveCustomers(ptId) {
    PersonalService.getCustomers(ptId).then(
      response => {
        console.log("retrieveCustomers");
        const customers = response.data.map(result =>
          ({
             id: result.customer.id,
             user: result.customer.user
          })
        );
        this.setState({
          customers: customers
        });
        if(!this.state.isCreate) {
          for (let i = 0; i < customers.length; i++) {
            if(customers[i].id === this.state.currentEvent.extendedProps.customerId) {
              this.setState({"customerIndex": i, "currentCustomer": customers[i]});
              break;
            }
          }
        }
        console.log(customers);
      }
    )
    .catch(e => {
      console.log(e);
    });
  }

  render() {
    return (
        <div className="container section-inner" key={this.props.currentEntity}>
          <div className='demo-app-main'>
            <FullCalendar
              ref={this.fullCalendar}
              key={this.props.currentEntity}
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, momentPlugin]}
              headerToolbar={{
                left: 'prev,next,today',
                /* center: 'title', */
                right: 'timeGridDay,timeGridWeek,dayGridMonth'
              }}
              initialView='timeGridWeek'
              //eventColor="#e1af0b"
              //eventBorderColor="#ffffff"
              timeZone={"UTC"}
              editable={this.props.editable}
              selectable={this.props.editable}
              selectMirror={true}
              dayMaxEvents={true}
              eventOverlap={true}
              weekends={true}
              nowIndicator={true}
              allDaySlot={false}
              displayEventTime={false}
              selectConstraint={this.props.currentEntity.workHours}
              eventConstraint={this.props.currentEntity.workHours}
              businessHours={this.props.currentEntity.workHours}
              slotDuration={"01:00:00"}
              selectAllow={this.selectFixedAllow}
              eventResizableFromStart={"false"}
              eventDurationEditable={"false"}
              firstHour={new Date().getUTCHours()}
              initialEvents={this.INITIAL_EVENTS} // alternatively, use the `events` setting to fetch from a feed
              events={this.eventsFeed}
              eventContent={this.renderEventContent} // custom render function
              eventsSet={this.handleEvents} // called after events are initialized/added/changed/removed
              select={this.handleDateSelect}
              eventClick={this.handleEventClick}
              eventChange={this.handleEventChange}
              /*you can update a remote database when these fire:
              eventAdd={function(){}}
              eventChange={function(){}}
              eventRemove={function(){}}
              */
            />           
            {this.props.role === "GYM" && ( <div>{this.state.currentGym.brandName}</div> )}  
            {this.props.role === "PERSONAL" && ( <div>{this.state.currentPT.brandName}</div> )}   
            {this.props.role === "CUSTOMER" && ( <div>{this.state.currentCustomer.user.userName}</div> )}           
            <Modal
              isOpen={this.state.modal}
              toggle={this.toggle}
              className={this.props.className}
            >
              {this.state.modal && (
                <>
                  <ModalHeader toggle={this.toggle}>
                    { this.state.isCreate && ("Agendar Aula")}
                    { !this.state.isCreate && ("Aula "+Moment(this.state.currentEvent.start).tz("UTC").format("HH:mm - DD/MM/YYYY", "UTC"))}
                  </ModalHeader>
                  <ModalBody>
                      <div>
                        <Form onSubmit={this.handleFormEvent} ref={this.form}>
                          <div className="form-group">
                            <label className="dark-label" htmlFor="gym">Academia</label>
                            <Select name='gym'
                              className="form-control"
                              value={this.state.gymIndex}
                              onChange={this.onChangeGym}
                              validations={[required, vGym]}
                              disabled={!this.props.editable}
                            >
                              <option value="">Selecione...</option>
                              {this.state.gyms.map((gym, index) => (
                                <option value={index}>{gym.brandName+" (Aluguel R$"+gym.price+")"}</option>
                              ))}
                            </Select>
                          </div>       
                          <div className="form-group">
                            <label className="dark-label" htmlFor="personal-trainer">Personal Trainer</label>
                            <Select name='personal-trainer'
                              className="form-control"
                              value={this.state.ptIndex}
                              onChange={this.onChangePT}
                              validations={[required, vPT]}
                              disabled={!this.props.editable}
                            >
                              <option value="">Selecione...</option>
                              {this.state.personalTrainers.map((pt, index) => (
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
                              disabled={!this.props.editable}
                            >
                              <option value="">Selecione...</option>
                              {this.state.customers.map((customer, index) => (
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
                              disabled={this.state.isCreate || !this.props.editable}
                              onChange={this.onChangeEventHour}
                              validations={[required, vEventHour]} 
                            />         
                          </div>
                          {this.state.isCreate && (
                            <>
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
                                  <label className="dark-label">Qtde de Aulas:</label>
                                  <Input
                                    type="number"
                                    className="form-control"
                                    name="repeatEvents"
                                    value={this.state.repeatEvents}
                                    onChange={this.onChangeRepeatEvents}
                                    validations={[required, vRepeatEvents]}                
                                  />         
                                </div>
                              </div>
                            </Collapsible>
                            <br/>
                            </>
                          )}
                          <div className="form-group">
                            <label className="dark-label" htmlFor="price">Preço da Aula R$</label>
                            <Input
                              type="number"
                              className="form-control"
                              name="price"
                              value={this.state.price}
                              onChange={this.onChangePrice}
                              validations={[required, vPrice]}
                              placeHolder="Sugestão de mercado: R$6"
                              disabled={!this.props.editable}
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
                              disabled={!this.props.editable}
                            />            
                          </div>
                          <div className="form-group">
                            <br/>
                            {this.props.editable && (
                              <Button className="button button-primary button-wide-mobile button-block" disabled={this.state.loading}>
                                {this.state.loading && (
                                  <span className="spinner-border spinner-border-sm"></span>
                                )}
                                <span>Salvar</span>
                              </Button>
                            )}
                            { this.state.isCreate && (
                              <>
                              <br/>
                              <Button color="danger" onClick={this.toggle}>
                                Cancelar
                              </Button>
                              </>
                            )}
                            { !this.state.isCreate && (
                              <>
                              <br/>
                              {this.props.editable && (
                                <Button color="danger" onClick={() => {this.deleteEvent(this.state.currentEvent); this.toggle()}}>
                                  Remover
                                </Button>
                              )}
                              {!this.props.editable && (
                                <Button color="primary" onClick={this.toggle}>
                                  Fechar
                                </Button>
                              )}
                              </>
                            )}
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
                  </ModalBody>
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

  handleDateSelect = (selectInfo) => {
    console.log("handleDateSelect selectInfo");
    console.log(selectInfo);
    let day = selectInfo.start.getDay()
    console.log(day)
    this.setState({ isCreate: true, 
                    view: selectInfo.view,
                    start: selectInfo.start, 
                    eventHour: selectInfo.start.getUTCHours(),
                    repeatEvents: 1,
                    repeatSun: day === 0? true : false,
                    repeatMon: day === 1? true : false,
                    repeatTue: day === 2? true : false,
                    repeatWed: day === 3? true : false,
                    repeatThu: day === 4? true : false,
                    repeatFri: day === 5? true : false,
                    repeatSat: day === 6? true : false,
                    gymIndex: -1,
                    customerIndex: -1
                   });
    this.toggle(); 
  }

  handleEventClick = (clickInfo) => {
    if(this.props.role === "GYM") {
      let ptId = clickInfo.event.extendedProps.ptSlot.parentId;
      for (let i = 0; i < this.state.personalTrainers.length; i++) {
        if(this.state.personalTrainers[i].id === ptId) {
          this.setState({"ptIndex": i, "currentPT": this.state.personalTrainers[i]});
          this.retrieveCustomers(ptId);
          break;
        }
      }
    }
    else if(this.props.role === "PERSONAL") {
      let gymId = clickInfo.event.extendedProps.gymSlot.parentId;
      let ptId = clickInfo.event.extendedProps.ptSlot.parentId;
      for (let i = 0; i < this.state.gyms.length; i++) {
        if(this.state.gyms[i].id === gymId) {
          this.setState({"gymIndex": i, "currentGym": this.state.gyms[i]});
          break;
        }
      }
      this.retrieveCustomers(ptId);
    }
    else if(this.props.role === "CUSTOMER") {
      let ptId = clickInfo.event.extendedProps.ptSlot.parentId;
      for (let i = 0; i < this.state.personalTrainers.length; i++) {
        if(this.state.personalTrainers[i].id === ptId) {
          this.setState({"ptIndex": i, "currentPT": this.state.personalTrainers[i]});
          this.retrieveGyms(ptId);
          break;
        }
      }
      this.retrieveGyms(ptId);
    }
    this.setState({ "currentEvent": clickInfo.event,
                    "isCreate": false,
                    "view": clickInfo.view,
                    "start": clickInfo.event.start, 
                    "eventHour": clickInfo.event.start.getUTCHours(),
                    "price": clickInfo.event.extendedProps.ptSlot.price,
                    "location": clickInfo.event.extendedProps.location});
    this.toggle();
  }


  handleEventChange = (eventArgs) => {
    console.log("handleEventChange eventArgs");
    console.log(eventArgs);
    let day = eventArgs.event.start.getDay()
    this.setState({
      isCreate: false, 
      start: eventArgs.event.start,
      view: eventArgs.event._context.viewApi,
      eventHour: eventArgs.event.start.getUTCHours(), 
      currentEvent: eventArgs.event,
      repeatEvents: 1,
      repeatSun: day === 0? true : false,
      repeatMon: day === 1? true : false,
      repeatTue: day === 2? true : false,
      repeatWed: day === 3? true : false,
      repeatThu: day === 4? true : false,
      repeatFri: day === 5? true : false,
      repeatSat: day === 6? true : false, 
      price: eventArgs.event.extendedProps.ptSlot.price
    });
    let eventDate = eventArgs.event.start;
    let title = eventArgs.event.title;
    //Gym slots are optional
    let gymSlot = eventArgs.event.extendedProps.gymSlot ? {
      startSlot: eventDate,
      endSlot: Moment(eventDate).add(1, "h"),
      parentId: eventArgs.event.extendedProps.gymSlot.parentId,
      price: eventArgs.event.extendedProps.gymSlot.price
    } : null;
    let ptSlot = {
      startSlot: eventDate,
      endSlot: Moment(eventDate).add(1, "h"),
      parentId: eventArgs.event.extendedProps.ptSlot.parentId,
      price: eventArgs.event.extendedProps.ptSlot.price
    };
    let customerId = eventArgs.event.customerId
    this.saveEvent(eventDate, gymSlot, ptSlot, customerId, title);
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

  renderEventContent(eventInfo) {
    console.log("renderEventContent(eventInfo)")
    console.log(eventInfo.event.extendedProps.ptSlot)
    console.log(this.props.currentEntity.id)
    return (
      <>
        {AuthService.getCurrentRole()==="PERSONAL" && AuthService.getProfile().id !== eventInfo.event.extendedProps.ptSlot?.parentId ?
        (<i>PRIVADO</i>) : (<i>{eventInfo.event.title}</i>)}
      </>
    )
  }
}
