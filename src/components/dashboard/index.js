import React from "react";
import {
  ContentContainer,
  RightContent,
} from "../../reuseableComponents/containerStyle";
import Sidebar from "../sidebar";
import { BookingStyle, Book } from "./dashboardStyle";
import { ButtonS } from "../../reuseableComponents/buttonStyle";
import data from "./dashboardData";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigation = useNavigate();

  return (
    <ContentContainer>
      <Sidebar />
      <RightContent display="block">
        <BookingStyle>
          {data.map((book) => {
            return (
              <Book key={book.id}>
                <div>
                  <img src={book.icon} alt="icon" />
                  <h4>{book.title}</h4>

                  <ButtonS
                    onClick={() => {
                      localStorage.setItem("bookingType", book.type);
                      navigation(book.link);
                    }}
                  >
                    CREATE BOOKING
                  </ButtonS>
                </div>
              </Book>
            );
          })}
        </BookingStyle>
      </RightContent>
    </ContentContainer>
  );
}

export default Dashboard;
