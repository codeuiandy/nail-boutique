import React, { useEffect, useState } from "react";
import {
  ContentContainer,
  RightContent,
  RightContentCol1,
  RightContentCol2,
} from "../../../../reuseableComponents/containerStyle";
import Sidebar from "../../../sidebar";
import {
  Button,
  ButtonContainer,
} from "../../../../reuseableComponents/buttonStyle";
import {
  ServiceContainer,
  Services,
  ServiceType,
  FormContainer,
  InputContainer,
} from "./selectServiceStyle";
import { FaAngleDown, FaAngleRight } from "react-icons/fa";
import { MdChevronLeft } from "react-icons/md";
import serviceData from "./selectServiceData";
import BookingSummary from "../bookingSummary";
import {
  HeadingStyle,
  Back,
} from "../../../../reuseableComponents/headingStyle";
import CheckBox from "../../../../reuseableComponents/Checkbox";
import { axiosCalls } from "../../../../_api";
import { Toast } from "../../../toast/index";
import { useNavigate, useParams } from "react-router-dom";
import { hideLoader, showLoader } from "../../../loader/loader";

function SelectServices() {
  const params = useParams();
  const [onClick, setOnClick] = React.useState({});
  const [location, setlocation] = React.useState({});
  const [bookingType, setBookingType] = React.useState("");
  const [allAmount, setAllAmount] = useState([{ id: "", count: "" }]);
  const handleClick = (index) => () => {
    setOnClick((state) => ({
      ...state,
      [index]: !state[index],
    }));
  };

  const navigation = useNavigate();
  const [services, setServices] = useState([]);
  useEffect(() => {
    let locationSt = localStorage.getItem("location");
    if (locationSt) {
      locationSt = JSON.parse(locationSt);
      console.log("location>>>>>>>", locationSt);
      setlocation(locationSt);
    }

    let bookingTypeg = localStorage.getItem("bookingType");
    if (bookingTypeg) {
      console.log("Booking Type>>>>>>>", bookingTypeg);
      setBookingType(bookingTypeg);
    }
    getServices();
  }, []);

  const getServices = async () => {
    showLoader();
    const res = await axiosCalls(`services?location=${params.id}`, "GET");
    if (res) {
      hideLoader();
      if (res.data) {
        console.log(res);
        return setServices(res.data);
      }
      Toast("error", "Server Error");
    }
  };

  const [selectedService, setselectedService] = useState("");
  console.log(params);

  const updateFieldChanged = (index) => (e) => {
    const newArr = allAmount.map((item, i) => {
      if (index === i) {
        return { ...item, [e.target.name]: e.target.value };
      } else {
        console.log("allAmount>>>>>>>>>>>>>", allAmount);
        return item;
      }
    });
    console.log("allAmount>>>>>>>>>>>>>", allAmount);
    setAllAmount(newArr);
  };
  return (
    <ContentContainer>
      <Sidebar />
      <RightContent>
        <RightContentCol1>
          <HeadingStyle>
            <h2>Select Services </h2>
            <Back to="/my-appointments/personal-booking/select-location">
              <MdChevronLeft />
              Go back
            </Back>
          </HeadingStyle>
          <ServiceContainer>
            {services.map((items, index) => {
              return (
                <Services key={items.id}>
                  <ServiceType>
                    <div>
                      <h3>{items.title}</h3>
                      <p>{items.text}</p>
                    </div>
                    <span onClick={handleClick(index)}>
                      {onClick[index] ? <FaAngleRight /> : <FaAngleDown />}
                    </span>
                  </ServiceType>
                  {onClick[index] && (
                    <FormContainer>
                      <InputContainer
                        onClick={() => {
                          setselectedService(items);

                          console.log(allAmount);
                          let v = {
                            count: index,
                            id: items.service_id,
                          };
                          allAmount[index] = v;
                          setAllAmount(allAmount);
                        }}
                      >
                        <CheckBox
                          value={onClick[index].amount}
                          name={items.name}
                        />
                        <label htmlFor={onClick[index].amount}>
                          <h5>{items.descriptions}</h5>
                          <p>{items.amount}</p>
                        </label>
                      </InputContainer>
                      {bookingType == "group" ? (
                        <input
                          type="number"
                          onChange={(e) => {
                            console.log(allAmount);
                            let all = allAmount;
                            let v = {
                              count: (all[index] = e.target.value),
                              id: items.service_id,
                            };
                            allAmount[index] = v;
                            setAllAmount(allAmount);
                          }}
                        />
                      ) : null}

                      {/* <InputContainer>
                        <CheckBox value={items.value2} name={items.name} />
                        <label htmlFor={items.value2}>
                          <h5>{items.labelA}</h5>
                          <p>{items.labelB}</p>
                        </label>
                      </InputContainer> */}

                      {/* <InputContainer>
                        <CheckBox value={items.value3} name={items.name} />
                        <label htmlFor={items.value3}>
                          <h5>{items.labelA}</h5>
                          <p>{items.labelB}</p>
                        </label>
                      </InputContainer> */}
                    </FormContainer>
                  )}
                </Services>
              );
            })}
          </ServiceContainer>
          <ButtonContainer paddingm="0.5rem 0">
            <Button
              onClick={
                selectedService == ""
                  ? () => Toast("error", "Please select a service")
                  : () => {
                      localStorage.setItem(
                        "services",
                        JSON.stringify(selectedService)
                      );
                      if (bookingType == "group") {
                        localStorage.setItem(
                          "allAmount",
                          JSON.stringify(allAmount)
                        );
                        navigation(
                          `/my-appointments/group-booking/schedule/${params.id}`
                          // `/my-appointments/personal-booking/expected-clients/${params.id}`
                        );
                        return;
                      }
                      navigation(
                        `/my-appointments/group-booking/schedule/${params.id}`
                      );
                    }
                // navigation("/my-appointments/group-booking/schedule")
              }
            >
              CONTINUE
            </Button>
          </ButtonContainer>
        </RightContentCol1>
        <RightContentCol2>
          <BookingSummary location={location} service={selectedService} />
        </RightContentCol2>
      </RightContent>
    </ContentContainer>
  );
}

export default SelectServices;
