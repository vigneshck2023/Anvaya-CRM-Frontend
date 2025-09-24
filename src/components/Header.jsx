import { NavLink } from "react-router-dom";

export default function Header() {
  return (
    <header>
      <nav className="navbar navbar-expand-lg">
        <div className="container-fluid">
          {/* Logo */}
          <NavLink to="/" className="navbar-brand">
            Anvaya CRM
          </NavLink>

          {/* Toggle button */}
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          {/* Navbar links */}
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <NavLink className="nav-link">
                  Lead
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link">
                  Sales
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link">
                  Agent
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link">
                  Report
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link">
                  Settings
                </NavLink>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
}
