import React from "react";
import { useToken } from "../context";
import { APIUSER } from "../API";

const Header = () => {
  const { user, removeToken, token, setIsLoading } = useToken();

  const logout = async () => {
    setIsLoading(true);
    try {
      await APIUSER.post("/auth/logout", {
        headers: { Authorization: `Bearer ${token}` },
      });
      removeToken();
    } catch (error) {
      console.error("Logout failed", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <nav className="main-header navbar navbar-expand navbar-white navbar-light">
        <ul className="navbar-nav">
          <li className="nav-item">
            <a
              className="nav-link"
              data-widget="pushmenu"
              href="#"
              role="button"
            >
              <i className="fas fa-bars"></i>
            </a>
          </li>
        </ul>

        <ul className="navbar-nav ml-auto">
          <li className="nav-item">
            <a
              className="nav-link"
              data-widget="fullscreen"
              href="#"
              role="button"
            >
              <i className="fas fa-expand-arrows-alt"></i>
            </a>
          </li>
          <li className="nav-item dropdown">
            <a
              className="nav-link dropdown-toggle"
              href="#"
              id="navbarDropdown2"
              role="button"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            >
              <i className="fas fa-user mr-1"></i>{" "}
              {user && user.name ? user.name : "loading..."}
            </a>
            <div className="dropdown-menu" aria-labelledby="navbarDropdown2">
              {/* <div className="dropdown-divider"></div> */}
              <button onClick={logout} className="dropdown-item">
                Logout
              </button>
            </div>
          </li>
        </ul>
      </nav>
    </>
  );
};

export default Header;
