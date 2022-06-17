import React, { useState, useEffect } from "react";
import locationData from "./selectLocationData";
import Map from "../../../../images/map.png";
import { MdChevronLeft } from "react-icons/md";
import {
  Content,
  LocationText,
  MapImg,
  Location,
  RightContent,
} from "./selectLocationStyle";
import { ContentContainer } from "../../../../reuseableComponents/containerStyle";
import Sidebar from "../../../sidebar";
import {
  Button,
  ButtonContainer,
} from "../../../../reuseableComponents/buttonStyle";
import {
  HeadingStyle,
  Back,
} from "../../../../reuseableComponents/headingStyle";
import CheckBox from "../../../../reuseableComponents/Checkbox";
import { axiosCalls } from "../../../../_api";
import { Toast } from "../../../toast/index";
import { useNavigate } from "react-router-dom";
import { hideLoader, showLoader } from "../../../loader/loader";

function SelectLocation() {
  const navigation = useNavigate();
  const [locations, setLocations] = useState([]);
  useEffect(() => {
    getLocations();
  }, []);

  const getLocations = async () => {
    showLoader();
    const res = await axiosCalls("locations", "GET");
    if (res) {
      hideLoader();
      if (res.data) {
        console.log(res);
        return setLocations(res.data);
      }
      Toast("error", "Server Error");
    }
  };

  const [selectedLocation, setSelectedLocation] = useState("");
  const [fullLocation, setFullLocation] = useState("");
  return (
    <ContentContainer>
      <Sidebar />
      <RightContent>
        <Location>
          <HeadingStyle mPdTop="0">
            <h2>Select Location</h2>
            <Back to="/my-appointments">
              <MdChevronLeft />
              Go back
            </Back>
          </HeadingStyle>

          {locations.map((data) => (
            <Content
              key={data?.id}
              onClick={() => {
                setSelectedLocation(data?.location_code);
              }}
            >
              <LocationText>
                <h4>The Nail Boutique - {data?.location_state}</h4>
                <p>{data?.location_address}</p>
              </LocationText>
              <CheckBox
                onCheck={(chk) => {
                  setFullLocation(data);
                  setSelectedLocation(
                    data?.location_code == selectedLocation
                      ? ""
                      : data?.location_code
                  );
                }}
                value={data?.location_code == selectedLocation ? true : false}
                name="location"
              />
            </Content>
          ))}

          <ButtonContainer>
            <Button
              onClick={
                selectedLocation
                  ? () => {
                      console.log("fullLocation???", fullLocation);
                      localStorage.setItem(
                        "location",
                        JSON.stringify(fullLocation)
                      );
                      navigation(
                        `/my-appointments/group-booking/select-services/${selectedLocation}`
                      );
                    }
                  : () => Toast("error", "Please select a location")
              }
            >
              CONTINUE
            </Button>
          </ButtonContainer>
        </Location>

        <MapImg>
          <img src={Map} alt="location" />
        </MapImg>
      </RightContent>
    </ContentContainer>
  );
}

export default SelectLocation;
