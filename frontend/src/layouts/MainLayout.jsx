import { Outlet, Link } from "react-router-dom";

function MainLayout() {
  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <nav style={{ width: '250px', background: '#f0f0f0', padding: '20px' }}>
        <h3>Menu</h3>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/menu">Menu</Link></li>
        </ul>
      </nav>
      <main style={{ flex: 1, padding: '20px' }}>
        <Outlet />
      </main>
    </div>
  );
}

export default MainLayout;
