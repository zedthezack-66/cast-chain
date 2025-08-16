import Navbar from '@/components/Navbar';
import Banner from '@/components/Banner';
import PollsList from '@/components/PollsList';
import CreatePollModal from '@/components/modals/CreatePollModal';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Banner />
      
      <main className="container mx-auto px-4 py-12">
        <section id="polls">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Active Polls</h2>
            <p className="text-xl text-muted-foreground">
              Participate in decentralized voting and make your voice heard
            </p>
          </div>
          
          <PollsList />
        </section>
      </main>

      <CreatePollModal />
      <Footer />
    </div>
  );
};

export default Index;
