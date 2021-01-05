import axios from "axios";
import authHeader from "./auth-header";

const API_URL = "https://behive-fit.herokuapp.com/api/calendar" || "http://localhost:8080/api/calendar";

class CalendarService {
  getGymFeed = (id, start, end) => {
    return axios.get(API_URL+"/gym?id="+id+"&start="+start+"&end="+end, { headers: authHeader() });
  };
  createEvent(calendarEvent) {
    return axios.post(API_URL+"/event", calendarEvent, { headers: authHeader() })
    .then((response) => {
      return response;
    });
  };
}

export default new CalendarService();