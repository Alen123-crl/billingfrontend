import { Link } from "react-router-dom";
import "./Header.css";

function Header() {
  return (
    <header className="header">
      <div className="logo">Billy App</div>

      <nav className="nav">
        <Link to="/">Home</Link>
        <Link to="/items">Items</Link>
        <Link to="/customers">Customers</Link>
        <Link to="/invoices">Invoices</Link>
      </nav>
    </header>
  );
}

export default Header;