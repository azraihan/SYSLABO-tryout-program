import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  BrowserRouter,
  Navigate,
} from "react-router-dom";

//MUI
import { Box } from "@mui/system";

//components
import Navbar from "./components/NavBar";
import Footer from "./components/Footer";

//icons
import { GrGroup } from "react-icons/gr";
import { IoIosPerson } from "react-icons/io";
import { PiGraphBold } from "react-icons/pi";
import { GoLog } from "react-icons/go";

//pages
import CompanyOrgChart from "./components/CompanyOrgChart";
import DepartmentTable from "./components/DepartmentTable";
import PersonnelTable from "./components/PersonnelTable";
import LogTable from "./components/LogTable";

// import { departmentData } from "./data/departmentData";

const fetchPersonnelData = async () => {
  try {
    const res = await fetch("http://localhost:5000/personnel", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const parseRes = await res.json();
    if (res.ok) {
      return parseRes;
    } else {
    }
  } catch (err) {
    console.error(err.message);
  }
};

const fetchDepartmentData = async () => {
  try {
    const res = await fetch("http://localhost:5000/department", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const parseRes = await res.json();

    if (res.ok) {
    } else {
      console.error("Failed to fetch department data", parseRes);
      return;
    }

    return parseRes; // Return the parsed data regardless of status
  } catch (err) {
    console.error("An error occurred:", err.message);
    return null; // Still return null in case of an exception
  }
};

const fetchLogtData = async () => {
  try {
    const res = await fetch("http://localhost:5000/user/logs", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const parseRes = await res.json();

    if (res.ok) {
    } else {
      console.error("Failed to fetch department data", parseRes);
      return;
    }

    return parseRes; // Return the parsed data regardless of status
  } catch (err) {
    console.error("An error occurred:", err.message);
    return null; // Still return null in case of an exception
  }
};

function App() {
  const [triggerUpdate, setTriggerUpdate] = useState(0);
  const menuItem = [
    {
      path: "./personnel",
      name: "Personnel",
      icon: <IoIosPerson />,
    },
    {
      path: "./departments",
      name: "Departments",
      icon: <GrGroup />,
    },
    {
      path: "./organizationalChart",
      name: "Organizational Chart",
      icon: <PiGraphBold />,
    },
    {
      path: "./logs",
      name: "Logs",
      icon: <GoLog />,
    },
  ];

  const paths = []; //always write the paths in camelcase
  const appBarLogoSrc = "/syslabo_logo.png";
  const defaultPathName = "departments";

  //for footer
  const quickLinks = [
    "Personnel",
    "Departments",
    "Organizational Chart",
    "Logs",
  ];

  const [personnelData, setPersonnelData] = useState([]);
  const [departmentData, setDepartmentData] = useState([]);
  const [logData, setLogData] = useState([]);

  useEffect(() => {
    fetchPersonnelData()
      .then((data) => {
        setPersonnelData(data.filter((d) => d.status !== "department_head"));
      })
      .catch((err) => {
        console.log(err);
      });

    fetchDepartmentData()
      .then((data) => {
        if (data) {
          setDepartmentData(data);
        } else {
          console.log("No department data returned");
        }
      })
      .catch((err) => {
        console.log(err);
      });

    fetchLogtData()
      .then((data) => {
        setLogData(data);
        console.log(data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [triggerUpdate]);

  return (
    <>
      <Navbar
        paths={paths} //array of paths that correspond to the buttons in the appbar
        appBarLogoSrc={appBarLogoSrc} //imag src of the logo
        defaultPathName={defaultPathName} //pathname corresponding to '/'
        appBarBackgroundColor="#faf6c0"
        //buttonTextColor="#000"
        //buttonTextColorOnActive="#fff"
        //buttonBackgroundColor="transparent"
        // buttonBackgroundColorOnActive="#334B71"
        // buttonBorderRadius="30px"
        // activeButtonColorOnHover="#2a3950"
        // inactiveButtonBackgroundColorOnHover="#90D1DB"
        menuItem={menuItem}
      />

      <Box sx={{ pt: 10, backgroundColor: "#f5f5f5", pb: 10 }}>
        {" "}
        {/* pt for padding-top */}
        <Routes>
          <Route path="/" element={<Navigate to="/personnel" replace />} />
          <Route
            path="/personnel"
            element={
              <PersonnelTable
                data={personnelData}
                setTriggerUpdate={setTriggerUpdate}
              />
            }
          />
          <Route
            path="/departments"
            element={
              <DepartmentTable
                data={departmentData}
                setTriggerUpdate={setTriggerUpdate}
              />
            }
          />
          <Route
            path="/organizationalChart"
            element={<CompanyOrgChart departmentData={departmentData} />}
          />
          <Route path="/logs" element={<LogTable data={logData}/>} />
        </Routes>
      </Box>

      <Footer
        quickLinks={quickLinks} //all the names are self-explanatory
        bottomText="Syslabo Organizational Chart Management"
        email="info@syslabo.org"
        phone="0123456789"
        backgroundColor="#000"
        textColor="#fff" //text color is the color of all the texts and icons. You can customize it if you want
      />
    </>
  );
}

export default App;
