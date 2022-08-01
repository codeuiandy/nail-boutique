import React, { useEffect, useState } from "react";
import BookingSummary from "../bookingSummary";
import {
  Button,
  ButtonContainer,
} from "../../../../reuseableComponents/buttonStyle";
import { MdChevronLeft } from "react-icons/md";
import {
  ContentContainer,
  RightContent,
  RightContentCol1,
  RightContentCol2,
} from "../../../../reuseableComponents/containerStyle";
import Sidebar from "../../../sidebar";
import {
  Option,
  ScheduleContainer,
  SelectAvailableTime,
  Time,
  Dots,
  Waitlist,
} from "./scheduleStyle";
import {
  HeadingStyle,
  Back,
} from "../../../../reuseableComponents/headingStyle";
import Calendar from "react-calendar";
import "./calendar.css";
import { CalendarContainer } from "react-datepicker";
import timeData from "./scheduleData";
import CheckBox from "../../../../reuseableComponents/Checkbox";
import { hideLoader, showLoader } from "../../../loader/loader";
import { axiosCalls } from "../../../../_api";
import { useParams } from "react-router-dom";
import { Toast } from "../../../toast/index";
import moment from "moment";
import { useNavigate } from "react-router-dom";

function Schedule() {
  const navigation = useNavigate();
  const [date, Setdate] = React.useState(new Date());
  const [location, setlocation] = React.useState({});
  const [servicessTA, setservicessTA] = useState({});
  const [selectedTech, setselectedTech] = useState({});
  const [selectedDate, setselectedDate] = useState({});
  const params = useParams();
  const [Schedule, setSchedule] = useState([]);
  useEffect(() => {
    let locationSt = localStorage.getItem("location");
    let servicesSt = localStorage.getItem("services");
    let techSt = localStorage.getItem("technician");

    if (locationSt) {
      locationSt = JSON.parse(locationSt);
      console.log("location>>>>>>>", locationSt);
      setlocation(locationSt);
    }

    if (servicesSt) {
      servicesSt = JSON.parse(servicesSt);
      console.log("services>>>>>>>", servicesSt);
      setservicessTA(servicesSt);
    }

    if (techSt) {
      techSt = JSON.parse(techSt);
      console.log("tech>>>>>>>", techSt);
      setselectedTech(techSt);
    }

    getSchedule();
  }, [date]);

  useEffect(() => {
    localStorage.setItem("date", new Date());
  }, []);

  const getSchedule = async () => {
    showLoader();
    const data = {
      date: date,
      email: params.info,
    };
    const res = await axiosCalls(`bookings/timeslots`, "POST", data);
    if (res) {
      hideLoader();
      if (res.AvailableSlots) {
        console.log(res.AvailableSlots);
        return setSchedule(res.AvailableSlots);
      }
      Toast("error", "Server Error");
    }
  };

  const [selectedTime, setselectedTime] = useState("");

  return (
    <div>
      <ContentContainer>
        <Sidebar />
        <RightContent>
          <RightContentCol1>
            <HeadingStyle>
              <h2>Schedule</h2>
              <Back to="/my-appointments/group-booking/expected-clients">
                <MdChevronLeft />
                Go back
              </Back>
            </HeadingStyle>
            <ScheduleContainer>
              <CalendarContainer>
                <Calendar
                  calendarType="US"
                  onChange={(d) => {
                    Setdate(d);
                    localStorage.setItem("date", d);
                  }}
                  value={date}
                  minDate={moment().toDate()}
                />
              </CalendarContainer>
              <Dots>
                <div>
                  <span className="available"></span>
                  <p>Available</p>
                </div>
                <div>
                  <span className="unavailable"></span>
                  <p>Unavailable</p>
                </div>
              </Dots>
              <Time>
                <h1>Available Time</h1>

                <SelectAvailableTime>
                  {Schedule.map((time) => {
                    return (
                      <Option key={time}>
                        <CheckBox
                          label={moment(time).format("MMMM Do YYYY, h:mm:ss a")}
                          name={time}
                          onCheck={(t) => {
                            console.log(time);
                            setselectedTime(time);
                          }}
                          value={selectedTime === time ? true : false}
                        />
                      </Option>
                    );
                  })}
                </SelectAvailableTime>
              </Time>
            </ScheduleContainer>
            <Waitlist to="/waitlist">Join our waitlist</Waitlist>
            <ButtonContainer>
              <Button
                onClick={
                  selectedTime == ""
                    ? () => Toast("error", "Please select a preferred time")
                    : () => {
                        localStorage.setItem("time", selectedTime);
                        navigation(
                          // `/my-appointments/group-booking/enter-details`
                          `/my-appointments/personal-booking/select-technician`
                        );
                      }
                }
              >
                Continue
              </Button>
            </ButtonContainer>
          </RightContentCol1>
          <RightContentCol2>
            <BookingSummary
              location={location}
              service={servicessTA}
              selectedTech={selectedTech}
              selectedTime={selectedTime}
            />
          </RightContentCol2>
        </RightContent>
      </ContentContainer>
    </div>
  );
}

export default Schedule;
