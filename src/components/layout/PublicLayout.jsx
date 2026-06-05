import { Outlet } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';

export default function PublicLayout() {
  return (
    <>
      <Navbar />
      <main style={{ paddingTop: '80px', minHeight: 'calc(100vh - 400px)' }}>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
