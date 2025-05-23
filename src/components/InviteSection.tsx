
import { ArrowRight, ShieldCheck, MessageCircle } from "lucide-react";
import Logo from "./Logo";

const InviteSection = () => {
  // Use the actual bot invite link for consistency
  const botInviteLink = "https://discord.com/oauth2/authorize?client_id=1372175162807418951&permissions=8&integration_type=0&scope=bot+applications.commands";

  return (
    <section
      id="invite"
      className="section bg-gradient-to-br from-trioguard to-trioguard-dark text-white"
    >
      <div className="container-custom">
        <div className="text-center max-w-3xl mx-auto">
          <div className="mb-6 flex justify-center">
            <Logo variant="white" size="lg" />
          </div>

          <h2 className="text-3xl md:text-4xl font-bold mb-6 animate-fade-in-up">
            Ready to secure your Discord server?
          </h2>
          <p
            className="text-lg mb-8 text-white/90 animate-fade-in-up"
            style={{ animationDelay: "0.1s" }}
          >
            Join thousands of server owners who trust TrioGuard to keep their
            communities safe and engaged
          </p>

          <div
            className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up"
            style={{ animationDelay: "0.2s" }}
          >
            <a
              href={botInviteLink}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-trioguard hover:bg-white/90 font-medium px-8 py-4 rounded-lg transition-all shadow-lg hover:shadow-xl flex items-center justify-center hover:scale-105 duration-300"
            >
              <span>Add to Discord</span>
              <ArrowRight size={20} className="ml-2" />
            </a>
            <a
              href="/dashboard"
              className="bg-white/10 hover:bg-white/20 border border-white/20 font-medium px-8 py-4 rounded-lg transition-all shadow-md hover:shadow-lg flex items-center justify-center hover:scale-105 duration-300"
            >
              <MessageCircle size={20} className="mr-2" />
              <span>Access Dashboard</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InviteSection;
