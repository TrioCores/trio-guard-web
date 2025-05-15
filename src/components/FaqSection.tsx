
import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const faqs = [
  {
    question: "How do I add TrioGuard to my Discord server?",
    answer: "Click the 'Invite Bot' button at the top of this page. You'll be redirected to Discord's authorization page where you can select your server and grant the necessary permissions."
  },
  {
    question: "Is TrioGuard free to use?",
    answer: "Yes, TrioGuard's core features are completely free. We may offer premium features in the future, but the essential moderation and protection tools will always remain free."
  },
  {
    question: "What permissions does TrioGuard need?",
    answer: "TrioGuard requires permissions related to moderation actions, such as managing messages, kicking/banning members, and managing roles. These permissions are necessary for the bot to function properly."
  },
  {
    question: "How do I configure welcome messages?",
    answer: "After adding TrioGuard to your server, use the command '-welcome setup' in your chosen welcome channel. Follow the prompts to customize your welcome message and role assignments."
  },
  {
    question: "Can I customize the prefix for commands?",
    answer: "Yes, you can change the default prefix ('-') by using the command '-prefix [new prefix]'. For example, '-prefix !' would change your prefix to '!'."
  },
  {
    question: "How do I contact support if I need help?",
    answer: "Join our support Discord server by clicking the 'Support' button in the navigation menu. Our team and community are there to help with any questions or issues."
  }
];

const FaqSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="section bg-trioguard-section">
      <div className="container-custom">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
          <p className="text-lg text-trioguard-dark/80">
            Find answers to common questions about TrioGuard
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          {faqs.map((faq, index) => (
            <div 
              key={index}
              className="bg-white rounded-lg mb-4 overflow-hidden shadow-sm transition-all duration-200"
            >
              <button
                className="w-full text-left p-6 flex justify-between items-center"
                onClick={() => toggleFaq(index)}
              >
                <h3 className="text-lg font-medium">{faq.question}</h3>
                {openIndex === index ? (
                  <ChevronUp className="text-trioguard flex-shrink-0" />
                ) : (
                  <ChevronDown className="text-trioguard-dark flex-shrink-0" />
                )}
              </button>
              <div 
                className={`px-6 transition-all duration-300 ease-in-out overflow-hidden ${
                  openIndex === index ? "max-h-96 pb-6" : "max-h-0 opacity-0"
                }`}
              >
                <p className="text-trioguard-dark/80">{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FaqSection;
