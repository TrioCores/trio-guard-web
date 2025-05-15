
import { ArrowRight, ShieldCheck, MessageCircle } from 'lucide-react';

const InviteSection = () => {
  return (
    <section id="invite" className="section bg-gradient-to-br from-trioguard to-trioguard-dark text-white">
      <div className="container-custom">
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center justify-center p-2 bg-white/10 rounded-full mb-8">
            <ShieldCheck className="w-6 h-6 mr-2" />
            <span className="font-medium">Trusted by 10,000+ Discord servers</span>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to secure your Discord server?</h2>
          <p className="text-lg mb-8 text-white/90">
            Join thousands of server owners who trust TrioGuard to keep their communities safe and engaged
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://discord.com/api/oauth2/authorize?client_id=123456789&permissions=8&scope=bot"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-trioguard hover:bg-white/90 font-medium px-8 py-4 rounded-lg transition-all shadow-lg hover:shadow-xl flex items-center justify-center"
            >
              <span>Add to Discord</span>
              <ArrowRight size={20} className="ml-2" />
            </a>
            <a
              href="https://discord.gg/trioguard"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white/10 hover:bg-white/20 border border-white/20 font-medium px-8 py-4 rounded-lg transition-all shadow-md hover:shadow-lg flex items-center justify-center"
            >
              <MessageCircle size={20} className="mr-2" />
              <span>Join Support Server</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InviteSection;
