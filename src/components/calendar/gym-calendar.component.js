import React, { Component } from "react";

import GymService from "../../services/gym.service";
import FullCalendar, { formatDate } from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import momentPlugin, {toMomentDuration} from '@fullcalendar/moment'

let eventGuid = 0
let todayStr = new Date().toISOString().replace(/T.*$/, '') // YYYY-MM-DD of today

export const INITIAL_EVENTS = [
  {
    id: createEventId(),
    title: 'Magal: Ana',
    start: todayStr + 'T06:00:00'
  },
  {
    id: createEventId(),
    title: 'Eduardo: Carlos',
    start: todayStr + 'T11:00:00'
  },
  {
    id: createEventId(),
    title: 'Eduardo: João',
    start: todayStr + 'T12:00:00'
  },
  {
    id: createEventId(),
    title: 'Vinícius: José',
    start: todayStr + 'T16:00:00'
  },
  {
    id: createEventId(),
    title: 'Vinícius: Beto',
    start: todayStr + 'T18:00:00'
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

export function createEventId() {
  return String(eventGuid++)
}

export default class GymCalendar extends Component {
  constructor(props, currentGym) {
    super(props);
    this.retrieveGymCalendar = this.retrieveGymCalendar.bind(this);

    this.state = {
      gym: currentGym,
      currentEvents: []
    };
  }

  componentDidMount() {
    this.retrieveGymCalendar();
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
      <>
        <div className="container section-inner">
            {/* {this.renderSidebar()} */}
            <div className='demo-app-main'>
            <FullCalendar
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, momentPlugin]}
                headerToolbar={{
                left: 'prev,next today',
                /* center: 'title', */
                right: 'timeGridDay,timeGridWeek,dayGridMonth'
                }}
                initialView='timeGridWeek'
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
            </div>
        </div>
      </>
    );
  }

  renderSidebar() {
    return (
      <div className='demo-app-sidebar'>
        <div className='demo-app-sidebar-section'>
          <h2>Instructions</h2>
          <ul>
            <li>Select dates and you will be prompted to create a new event</li>
            <li>Drag, drop, and resize events</li>
            <li>Click an event to delete it</li>
          </ul>
        </div>
        <div className='demo-app-sidebar-section'>
          <label>
            <input
              type='checkbox'
              checked={this.state.weekendsVisible}
              onChange={this.handleWeekendsToggle}
            ></input>
            toggle weekends
          </label>
        </div>
        <div className='demo-app-sidebar-section'>
          <h2>All Events ({this.state.currentEvents.length})</h2>
          <ul>
            {this.state.currentEvents.map(renderSidebarEvent)}
          </ul>
        </div>
      </div>
    )
  }

  handleWeekendsToggle = () => {
    this.setState({
      weekendsVisible: !this.state.weekendsVisible
    })
  }

  handleDateSelect = (selectInfo) => {
    let title = prompt('Please enter a new title for your event')
    let calendarApi = selectInfo.view.calendar

    calendarApi.unselect() // clear date selection

    if (title) {
      calendarApi.addEvent({
        id: createEventId(),
        title,
        start: selectInfo.startStr,
        end: selectInfo.endStr,
        allDay: selectInfo.allDay
      })
    }
  }

  handleEventClick = (clickInfo) => {
    // eslint-disable-next-line no-restricted-globals
    if (confirm(`Are you sure you want to delete the event '${clickInfo.event.title}'`)) {
      clickInfo.event.remove()
    }
  }

  handleEvents = (events) => {
    this.setState({
      currentEvents: events
    })
  }

  selectFixedAllow = (selectInfo) => {
    var duration = toMomentDuration(selectInfo.end-selectInfo.start);
    return duration.asHours() <= 1;
  }

}

function renderEventContent(eventInfo) {
    return (
      <>
        <b>{eventInfo.timeText}</b>
        <i>{eventInfo.event.title}</i>
      </>
    )
  }

  function renderSidebarEvent(event) {
    return (
      <li key={event.id}>
        <b>{formatDate(event.start, {year: 'numeric', month: 'short', day: 'numeric'})}</b>
        <i>{event.title}</i>
      </li>
    )
  }