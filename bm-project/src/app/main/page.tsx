import Navbar from './components/navbar';
import Hero from './components/hero';
import Features from './components/features';
import Footer from './components/footer';

export const metadata = { title: 'قوام' };

export default function MainPage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <Features />
      <Footer />
    </main>
  );
}