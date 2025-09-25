import Navbar from './components/navbar';
import Hero from './components/hero';
import Features from './components/features';
import Plans from './components/plans';
import OurClients from './components/ourclients';
import ContactUs from './components/contactus';
import Footer from './components/footer';

export default function MainPage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <Features />
      <Plans />
      <OurClients />
      <ContactUs />
      <Footer />
    </main>
  );
}