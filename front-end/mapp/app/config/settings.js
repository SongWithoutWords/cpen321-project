let LOCAL_SERVER_URL = "http://localhost:3000";
// let REMOTE_SERVER_URL = "https://agis-mapp.xyz";
let REMOTE_SERVER_URL = "http://agis-mapp.xyz";

//RESTful APIs
let DOCTOR_RES = "/doctors";
// create a doctor user
// request info about a doctor

let PATIENT_RES = "/patients";
// create a patient user

let REQUESTS_RES = "/requests";
// create a relationship
// add a request from patient to doctor
// confirm the patient's request

let RELAITON_RES = "/relations";
// accept a pending request

let LOGIN_RES = "/logins";
// post email and password to login

let PRESCRIPTION_RES = "/prescriptions";

let DOSES_RES = "/doses-taken";
//Changed Theme Color
//let THEME_COLOR = "#694fad";
let THEME_COLOR = "#009CC6";
let THEME_COLOR_LIGHT = "#9a7cdf";
let INACTIVE_COLOR = "#3e2465";
let ACTIVE_COLOR = "#f0edf6";

let POLLING_RATE = 2000; // in miliseconds

export const settings = {
  LOCAL_SERVER_URL,
  REMOTE_SERVER_URL,
  DOCTOR_RES,
  PATIENT_RES,
  REQUESTS_RES,
  RELAITON_RES,
  PRESCRIPTION_RES,
  THEME_COLOR,
  THEME_COLOR_LIGHT,
  INACTIVE_COLOR,
  ACTIVE_COLOR,
  LOGIN_RES,
  DOSES_RES,
  POLLING_RATE
};

export default settings;
