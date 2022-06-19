import React from "react";
import {
  SummaryContainer,
  Intro,
  Title,
  Service,
  Location,
  Manicure,
  Booking,
  SubTotal,
  Technician,
  Day,
  Total,
  Button,
} from "./bookingSummaryStyle";

import { VscLocation } from "react-icons/vsc";
import { IoIosCheckmarkCircle } from "react-icons/io";
import { AiOutlineClockCircle } from "react-icons/ai";
import avatar from "../../../../images/avatar1.png";
import { useNavigate, useLocation } from "react-router-dom";
import { Toast } from "../../../toast/index";
import moment from "moment";

function BookingSummary({ location, service, selectedTech, selectedTime }) {
  const route = useLocation();
  var link = route.pathname.split("/");
  // alert(link[3]);
  console.log(">>>>route>>", route);
  console.log(">>>>>location>>>>>", location);
  const navigation = useNavigate();
  return (
    <SummaryContainer>
      <Title>
        <h2>Booking Summary</h2>
        <p>{service?.descriptions ?? ""}</p>
      </Title>

      <div>
        <Intro>
          <Location>
            <div>
              <span>
                <VscLocation />
              </span>
              <p>
                The Nail Boutique - {location?.location_address ?? ""}, Lagos,
                Nigeria.
              </p>
            </div>
          </Location>
        </Intro>

        <Service>
          <Manicure>
            <div>
              <h6>{service?.descriptions ?? ""}:</h6>
              <p> N{service?.amount ?? ""}</p>
            </div>
            <div>
              {/* <h6>HAIR RELAXING:</h6>
              <p> N8,000.00</p> */}
            </div>
          </Manicure>
          <SubTotal>
            <div>
              <h6>SUB TOTAL:</h6>
              <p> N{service?.amount ?? ""}</p>
            </div>
            <div>
              <h6>VAT</h6>
              <p>N{service?.amount ?? ""}</p>
            </div>
          </SubTotal>
        </Service>
        <Booking>
          <Technician>
            {selectedTech ? (
              <>
                <p> Technician Selected</p>
                <div>
                  <IoIosCheckmarkCircle className="icon" />
                  <img src={avatar} alt="avatar" />

                  <span className="name">
                    <h6>
                      {" "}
                      {selectedTech?.first_name} {selectedTech?.last_name}{" "}
                    </h6>
                    <p> Hair Stylist - 26Yrs</p>
                  </span>
                </div>
              </>
            ) : (
              ""
            )}
          </Technician>
          <Day>
            <AiOutlineClockCircle className="icon" />

            {selectedTime ? (
              <h6>{`${moment(selectedTime).format(
                "MMMM Do YYYY, h:mm:ss a"
              )}`}</h6>
            ) : (
              ""
            )}
          </Day>
        </Booking>
      </div>

      <Total>
        <div>
          <h6>BOOKING TOTAL:</h6>
          <p> N{service?.amount ?? ""}</p>
        </div>
        <Button
          onClick={
            link[3] === "schedule"
              ? selectedTime == ""
                ? () => Toast("error", "Please select a preferred time")
                : () => {
                    localStorage.setItem("time", selectedTime);
                    navigation(`/my-appointments/group-booking/enter-details`);
                  }
              : () => {
                  Toast("error", "Please click continue to proceed");
                }
          }
        >
          CONFIRM
        </Button>
      </Total>
    </SummaryContainer>
  );
}

export default BookingSummary;
