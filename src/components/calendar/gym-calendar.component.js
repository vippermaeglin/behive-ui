//REACT Popup on Calendar https://stackoverflow.com/a/56287774

import React, { Component } from "react";

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

let eventGuid = 0
let todayStr = new Date().toISOString().replace(/T.*$/, '') // YYYY-MM-DD of today

export const INITIAL_EVENTS = [
  {
    id: createEventId(),
    title: '{ "pt": "Magal dos Santos", "customer": "Ana Moreira" }',
    start: todayStr + 'T06:00:00',
    durationEditable: false
  },
  {
    id: createEventId(),
    title: '{ "pt": "Eduardo Vilela", "customer": "Carlos Simões" }',
    start: todayStr + 'T11:00:00',
    durationEditable: false
  },
  {
    id: createEventId(),
    title: '{ "pt": "Eduardo Vilela", "customer": "João dos Santos" }',
    start: todayStr + 'T12:00:00',
    durationEditable: false
  },
  {
    id: createEventId(),
    title: '{ "pt": "Vinícius Arruda", "customer": "José da Silva" }',
    start: todayStr + 'T16:00:00',
    durationEditable: false
  },
  {
    id: createEventId(),
    title: '{ "pt": "Vinícius Arruda", "customer": "Beto Carvalho" }',
    start: todayStr + 'T18:00:00',
    durationEditable: false
  }
]

export const PERSONAL_TRAINERS = [
  {
    brandName: "Magal dos Santos"
  },
  {
    brandName: "Eduardo Vilela"
  },
  {
    brandName: "Vinícius Arruda"
  }
]

export const CUSTOMERS = [
  {
    user: { userName: "Ana Moreira", cpf: "058.687.445-82" }
  },
  {
    user: { userName: "Carlos Simões", cpf: "487.563.699-97" }
  },
  {
    user: { userName: "João dos Santos", cpf: "655.982.697-23" }
  },
  {
    user: { userName: "José da Silva", cpf: "665.441.998-25" }
  },
  {
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

export default class GymCalendar extends Component {
  constructor(props) {
    super(props);
    this.retrieveGymCalendar = this.retrieveGymCalendar.bind(this);
    this.toggle = this.toggle.bind(this);
    this.getCurrentPT = this.getCurrentPT.bind(this);

    console.log("Props CurrentGym:")
    console.log(this.props.currentGym)

    this.state = {
      currentEvent: {
        title: "",
        start: new Date(),
        gym: "Teste Gym",
        pt: "Carlos Bennet",
        customer: "José Silva"
      },
      modal: false,
      isCreate: false,
      events: [],
      ptIndex: 0,
      customerIndex: 0
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

  retrieveGymCalendar() {
    GymService.getAllGyms().then(
      response => {
        this.setState({
          //todo
        });
        console.log(response.data);
      }
    )
    .catch(e => {
      console.log(e);
    });
  }

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
                    {/* { this.state.isCreate && ("Agendar Aula")} */}
                    { !this.state.isCreate && ("Aula "+Moment(this.state.currentEvent.start).format("HH:mm - DD/MM/YYYY"))}
                  </ModalHeader>
                  <ModalBody>
                    {/* { this.state.isCreate && (
                      <div>
                        <div className="form-group">
                          <label className="dark-label" htmlFor="personal-trainer">Personal Trainer</label>
                          <Select name='personal-trainer'
                            className="form-control"
                            value={this.state.ptIndex}
                            onChange={this.onChangePT}
                            validations={[required]}
                          >
                            {PERSONAL_TRAINERS.map((pt, index) => (
                              <option value={index}>{pt.user.userName+" ("+pt.user.cpf+")"}</option>
                            ))}
                          </Select>    
                        </div> 
                      </div>
                    )} */}
                    { !this.state.isCreate && (
                      <div>
                        <p className="p-dark">{"Academia: " + this.props.currentGym.brandName}</p>
                        <p className="p-dark">{"Personal Trainer: " + JSON.parse(this.state.currentEvent.title).pt}</p>
                        <p className="p-dark">{"Aluno: " + JSON.parse(this.state.currentEvent.title).customer}</p>
                      </div>
                    )}
                  </ModalBody>
                  <ModalFooter>
                    <Button color="primary" onClick={this.toggle}>
                      Fechar
                    </Button>
                    <Button color="danger" onClick={() => {this.deleteEvent(this.state.currentEvent); this.toggle()}}>
                      Remover
                    </Button>
                  </ModalFooter>
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

    /* console.log(selectInfo)
    this.setState({ "isCreate": true });
    this.toggle(); */
    
    let title = prompt('Please enter a new title for your event')
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
    }
  }

  handleEventClick = (clickInfo) => {
    console.log(clickInfo)
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
    console.log(eventInfo)
    var obj = JSON.parse(eventInfo.event.title)
    return (
      <>
        <b>{eventInfo.timeText}</b>
        <i>{obj.pt.split(" ")[0] + " - " + obj.customer.split(" ")[0]}</i>
      </>
    )
  }