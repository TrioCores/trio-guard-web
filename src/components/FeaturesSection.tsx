
import { MessageCircle, Shield, Bell, Ban, List, LayoutDashboard } from 'lucide-react';

const features = [
  {
    title: "Automated Moderation & Spam Protection",
    description: "Powerful auto-moderation tools that prevent spam, filter inappropriate content, and keep your server clean without manual intervention.",
    icon: Shield
  },
  {
    title: "Welcome Messages & Role Assignment",
    description: "Customize welcome messages and automatically assign roles to new members when they join your server.",
    icon: Bell
  },
  {
    title: "Warnings, Mutes & Bans",
    description: "Comprehensive moderation tools to manage user behavior with customizable warning systems, temporary mutes, and ban management.",
    icon: Ban
  },
  {
    title: "Activity Logging",
    description: "Detailed logs of all server activities and moderation actions for complete transparency and accountability.",
    icon: MessageCircle
  },
  {
    title: "Custom Commands",
    description: "Create and customize commands to fit your server's unique needs and improve user experience.",
    icon: List
  },
  {
    title: "Dashboard Management",
    description: "Intuitive dashboard accessible via DM after installation to configure and manage all bot settings with ease.",
    icon: LayoutDashboard
  }
];

const FeaturesSection = () => {
  return (
    <section id="features" className="section bg-trioguard-section">
      <div className="container-custom">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Powerful Features</h2>
          <p className="text-lg text-trioguard-dark/80">
            TrioGuard comes packed with everything you need to manage and protect your Discord community
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="feature-card flex flex-col h-full"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="feature-icon">
                <feature.icon className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-trioguard-dark/80 flex-grow">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
