import React from "react";

//MUI
import { AppBar as MuiAppBar, Toolbar, Button, Box } from "@mui/material";

//routing stuff
import { NavLink, useResolvedPath, useMatch } from "react-router-dom";

//components
import Sidebar from "./SideBar";
// import NotificationButton from "./NotificationButton";

function NavLinkButton({
  path, //path that the button corresponds to. always keep these in camelcase
  label, //label of the button
  buttonTextColor,
  buttonTextColorOnActive,
  buttonBackgroundColor,
  buttonBackgroundColorOnActive,
  buttonBorderRadius,
  activeButtonColorOnHover,
  inactiveButtonBackgroundColorOnHover,
}) {
  //the other names are self-explanatory

  // Using hooks directly in a custom button component
  const resolved = useResolvedPath(path); //useResolvedPath is a React Router hook that resolves the given path relative to the current location. It returns a location object that can be used to match against the current URL.
  const match = useMatch({ path: resolved.pathname, end: path === "/" }); //useMatch is another React Router hook used here to determine if the current URL matches the resolved path. It checks if the pathname of the resolved path matches the current route's pathname. The end option specifies that it should be an exact match only if the path is the root path ('/').

  const isActive = !!match; //This line converts the match object to a boolean value to indicate if the current route is active. The double negation (!!) is used to ensure that isActive is a true boolean value

  // Define active and inactive styles directly here
  const style = {
    color: isActive ? buttonTextColorOnActive : buttonTextColor,
    backgroundColor: isActive
      ? buttonBackgroundColorOnActive
      : buttonBackgroundColor, // Active or transparent background
    borderRadius: buttonBorderRadius,
    "&:hover": {
      backgroundColor: isActive
        ? activeButtonColorOnHover
        : inactiveButtonBackgroundColorOnHover, // Darker blue on hover if active, otherwise light blue
    },
  };

  return (
    <Button
      color="inherit"
      component={NavLink}
      to={path}
      exact={path === "/"}
      sx={style}
    >
      {label}
    </Button>
  );
}

//og color:#faf6c0

function Navbar({
  paths, //array of paths that correspond to the buttons in the appbar. Always keep these in camelcase
  defaultPathName, //pathname corresponding to '/'.
  appBarBackgroundColor,
  appBarLogoSrc, //imag src of the logo
  buttonTextColor,
  buttonTextColorOnActive,
  buttonBackgroundColor,
  buttonBackgroundColorOnActive,
  buttonBorderRadius,
  activeButtonColorOnHover,
  inactiveButtonBackgroundColorOnHover,
  menuItem,
}) {
  //the other names are self-explanatory

  //to get the title of the buttons in the appbar from the paths.
  const camelCaseToTitle = (camelCase) => {
    // Step 1: Insert a space before each uppercase letter.
    const withSpaces = camelCase.replace(/([A-Z])/g, " $1");

    // Step 2: Capitalize the first letter of the sentence.
    const capitalized =
      withSpaces.charAt(0).toUpperCase() + withSpaces.slice(1);

    // Step 3: Trim any leading space that might have been added if the original camel case started with an uppercase letter.
    return capitalized.trim();
  };

  return (
    <MuiAppBar
      position="fixed"
      sx={{
        backgroundColor: appBarBackgroundColor,
        //boxShadow: 'none',
        //borderBottom: '1px solid #ccc',
        zIndex: 1000,
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between", alignItems: "center" }}>
        {/* Group Sidebar and Logo together */}
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Sidebar menuItem={menuItem} />
          <img
            src={appBarLogoSrc}
            alt="Logo"
            style={{ marginRight: 8, width: 70, marginTop: 5, marginBottom: 5 }}
          />
        </Box>

        <Box sx={{ display: "flex", gap: 1 }}>
          {paths.map((path, index) => (
            <NavLinkButton
              key={index}
              path={path}
              label={
                path === "/" ? defaultPathName : camelCaseToTitle(path.slice(1))
              }
              buttonTextColor={buttonTextColor}
              buttonTextColorOnActive={buttonTextColorOnActive}
              buttonBackgroundColor={buttonBackgroundColor}
              buttonBackgroundColorOnActive={buttonBackgroundColorOnActive}
              buttonBorderRadius={buttonBorderRadius}
              activeButtonColorOnHover={activeButtonColorOnHover}
              inactiveButtonBackgroundColorOnHover={
                inactiveButtonBackgroundColorOnHover
              }
            />
          ))}

          {/* <NotificationButton />  * Notifications button component */}

        </Box>
      </Toolbar>
    </MuiAppBar>
  );
}

export default Navbar;
