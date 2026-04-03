import "./Home.css";

function Home() {
  return (
    <div className="home">
      <div className="banner">
        <div className="overlay">
          <h1>Welcome to Billy Billing App</h1>
          <p>
            Manage your customers, items, and invoices efficiently with a
            simple and powerful billing system.
          </p>
          <button>Get Started</button>
        </div>
      </div>
    </div>
  );
}

export default Home;