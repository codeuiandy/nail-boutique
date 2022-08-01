import React, { useEffect, useState } from "react";
import {
  ContentContainer,
  RightContent,
  RightContentCol1,
  RightContentCol2,
} from "../../../../reuseableComponents/containerStyle";
import {
  Search,
  Row2,
  Row3,
  Orientation,
  Grid,
  List,
  Card,
  Technician,
  Select,
  Top,
} from "./selectTechnicianStyle";
import {
  HeadingStyle,
  Back,
} from "../../../../reuseableComponents/headingStyle";
import technicianData from "./selectTechnicianData";
import { MdChevronLeft, MdStar } from "react-icons/md";
import { HiOutlineSearch, HiUserGroup, HiDotsHorizontal } from "react-icons/hi";
import { IoGrid } from "react-icons/io5";
import { FaThList } from "react-icons/fa";
import {
  Button,
  ButtonContainer,
} from "../../../../reuseableComponents/buttonStyle";
import BookingSummary from "../../../../components/myAppointments/myAppointmentsGroup/bookingSummary/index.js";
import Sidebar from "../../../sidebar";
import { axiosCalls } from "../../../../_api";
import { Toast } from "../../../toast/index";
import { useNavigate, useParams } from "react-router-dom";
import { hideLoader, showLoader } from "../../../loader/loader";
import moment from "moment";

function SelectTechnician() {
  const navigation = useNavigate();
  const params = useParams();
  const [technicians, setTechnicians] = useState([]);
  const [location, setlocation] = React.useState({});
  const [servicessTA, setservicessTA] = useState({});
  useEffect(() => {
    getTechnicians();
  }, []);

  const getTechnicians = async () => {
    showLoader();
    let getTime = localStorage.getItem("time");
    let getLocation = localStorage.getItem("location");
    let getDate = localStorage.getItem("date");
    if (getLocation) {
      getLocation = JSON.parse(getLocation);
      console.log("location>>>>>>>d", getLocation);
      setlocation(getLocation);
    }
    // const res = await axiosCalls(`technicians?location=${params.info}`, "GET");

    const res = await axiosCalls(
      `/technicians/available?location=${
        getLocation.location_code
      }&date=${moment(getDate).format("YYYY-MM-DD")}&time=${moment(
        getTime
      ).format("HH:mm")}`,
      "GET"
    );
    if (res) {
      let locationSt = localStorage.getItem("location");
      let servicesSt = localStorage.getItem("services");

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
      hideLoader();
      if (res.data) {
        console.log(res);
        return setTechnicians(res.data);
      }
      Toast("error", "Server Error");
    }
  };

  const [selectedTech, setselectedTech] = useState("");
  return (
    <ContentContainer>
      <Sidebar />
      <RightContent>
        <RightContentCol1>
          <Top>
            <HeadingStyle PdBottom="0">
              <h2>Select Technician</h2>
              <Back to="/my-appointments/personal-booking/select-servicestwo">
                <MdChevronLeft />
                Go back
              </Back>
            </HeadingStyle>
            <Row2>
              <Search>
                <input
                  type="text"
                  name="search"
                  id="search"
                  placeholder="Search Stylist"
                />
                <HiOutlineSearch className="search-icon" />
              </Search>
              <Orientation>
                <Grid>
                  <IoGrid className="grid" />
                </Grid>
                <List>
                  <FaThList className="grid" />
                </List>
              </Orientation>
            </Row2>
          </Top>
          <div>
            <Row3>
              {technicians.map((item) => (
                <Card key={item.id} onClick={() => setselectedTech(item)}>
                  <div className="top">
                    {selectedTech.technician_id === item.technician_id ? (
                      <img
                        src={require("../../../../images/tick.png")}
                        alt="tick"
                      />
                    ) : (
                      <div></div>
                    )}

                    <HiDotsHorizontal className="dots" />
                  </div>
                  <Technician>
                    <img
                      src={
                        item.avatar
                          ? item.avatar
                          : require("../../../../images/avatar1.png")
                      }
                      alt="avatar"
                    />
                    <h4>{item?.first_name}</h4>
                    <p>{`${item.role} - ${item.age}Yrs`}</p>
                    <div>
                      <span>
                        <HiUserGroup className="icon" />
                        <p>{item.clients} clients</p>
                      </span>
                      <span>
                        <MdStar className="icon star" />
                        <p>{item.rating} ratings</p>
                      </span>
                    </div>
                    <Select>SELECT</Select>
                  </Technician>
                </Card>
              ))}
            </Row3>
          </div>
          <ButtonContainer>
            <Button
              onClick={
                selectedTech == ""
                  ? () => Toast("error", "Please select a technician")
                  : () => {
                      localStorage.setItem(
                        "technician",
                        JSON.stringify(selectedTech)
                      );
                      navigation(
                        `/my-appointments/group-booking/enter-details`
                      );
                    }
              }
            >
              CONTINUE
            </Button>
          </ButtonContainer>
        </RightContentCol1>
        <RightContentCol2>
          <BookingSummary
            location={location}
            service={servicessTA}
            selectedTech={selectedTech}
          />
        </RightContentCol2>
      </RightContent>
    </ContentContainer>
  );
}

export default SelectTechnician;
