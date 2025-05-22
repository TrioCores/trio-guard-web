import { ArrowRight } from "lucide-react";
import Logo from "./Logo";

const HeroSection = () => {
  return (
    <section className="pt-32 pb-16 md:pt-40 md:pb-20 bg-gradient-to-b from-trioguard-bg to-white">
      <div className="container-custom">
        <div className="flex flex-col md:flex-row items-center">
          <div className="w-full md:w-1/2 animate-fade-in-up">
            <div className="mb-6 flex items-center">
              <Logo size="lg" />
              <span className="ml-4 inline-block px-3 py-1 bg-trioguard/10 text-trioguard text-sm rounded-full animate-pulse-soft">
                Discord Protection Bot
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Advanced <span className="text-trioguard">Protection</span> for
              Your Discord Server
            </h1>
            <p className="text-lg md:text-xl mb-8 text-trioguard-dark/80">
              TrioGuard helps admins create a safe and secure Discord community
              with automated moderation, welcome messages, and powerful
              commands.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="#invite"
                className="btn-primary flex items-center justify-center hover:scale-105 transition-transform duration-300"
              >
                <span>Invite TrioGuard</span>
                <ArrowRight size={20} className="ml-2" />
              </a>
              <a
                href="#features"
                className="btn-secondary hover:scale-105 transition-transform duration-300"
              >
                Explore Features
              </a>
            </div>
          </div>
          <div className="w-full md:w-1/2 mt-12 md:mt-0 flex justify-center md:justify-end">
            <div
              className="relative w-full max-w-lg animate-fade-in-up"
              style={{ animationDelay: "0.3s" }}
            >
              <div className="absolute -inset-0.5 bg-gradient-to-r from-trioguard to-trioguard-light rounded-2xl blur opacity-30 animate-pulse-soft"></div>
              <div className="bg-white relative rounded-2xl shadow-xl overflow-hidden p-6 border border-trioguard/10 hover:shadow-2xl transition-shadow duration-300">
                <div className="flex items-center mb-4">
                  <div className="w-3 h-3 bg-red-400 rounded-full mr-2"></div>
                  <div className="w-3 h-3 bg-yellow-400 rounded-full mr-2"></div>
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  <div className="ml-4 text-xs text-trioguard-dark/60">
                    Discord Server
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="bg-trioguard/10 p-3 rounded-lg transform transition-transform hover:translate-x-1 hover:translate-y-0.5 duration-300">
                    <p className="text-sm font-medium">
                      <span className="text-trioguard">/setup</span> - Configure
                      TrioGuard for your server
                    </p>
                  </div>
                  <div
                    className="bg-gray-100 p-3 rounded-lg transform transition-transform hover:translate-x-1 hover:translate-y-0.5 duration-300"
                    style={{ transitionDelay: "0.1s" }}
                  >
                    <p className="text-sm">Setting up welcome messages...</p>
                  </div>
                  <div
                    className="bg-trioguard/5 p-3 rounded-lg transform transition-transform hover:translate-x-1 hover:translate-y-0.5 duration-300"
                    style={{ transitionDelay: "0.2s" }}
                  >
                    <p className="text-sm font-medium text-trioguard">
                      ✓ Welcome channel configured successfully!
                    </p>
                  </div>
                  <div
                    className="bg-trioguard-bg p-3 rounded-lg transform transition-transform hover:translate-x-1 hover:translate-y-0.5 duration-300"
                    style={{ transitionDelay: "0.3s" }}
                  >
                    <p className="text-sm">
                      <span className="font-medium">TrioGuard:</span>{" "}
                      Auto-moderation is now active.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
