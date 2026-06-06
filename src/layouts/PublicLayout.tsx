import { Outlet } from 'react-router-dom';
import { Navbar } from '../components';
import PageTransition from '../components/routing/PageTransition';
import ToastContainer from '../components/ui/Toast';

export default function PublicLayout() {
  return (
    <>
      <Navbar />
      <main>
        <PageTransition />
      </main>
      <ToastContainer />
    </>
  );
}
