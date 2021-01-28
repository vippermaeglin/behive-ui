import axios from "axios";
import authHeader from "./auth-header";

const API_URL = "https://behive-fit.herokuapp.com/api/calendar" || "http://localhost:8080/api/calendar";

class CalendarService {
  getCalendarFeed = (id, start, end, role) => {
    return axios.get(API_URL+"/feed?id="+id+"&start="+start+"&end="+end+"&role="+role, { headers: authHeader() });
  };
  saveEvent(calendarEvent) {
    return axios.post(API_URL+"/event", calendarEvent, { headers: authHeader() })
    .then((response) => {
      return response;
    });
  };
  deleteEvent = (id) => {
    return axios.delete(API_URL+"/event?id="+id, { headers: authHeader() })
    .then((response) => {
      return response;
    });
  };
}

export default new CalendarService();