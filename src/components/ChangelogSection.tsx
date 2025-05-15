
const releases = [
  {
    version: "v1.2.0",
    date: "May 10, 2025",
    changes: [
      "Added advanced anti-raid protection system",
      "Improved welcome message customization options",
      "Added support for custom reaction roles",
      "Fixed issue with logging system in large servers"
    ]
  },
  {
    version: "v1.1.5",
    date: "April 5, 2025",
    changes: [
      "Enhanced auto-moderation filters",
      "Added temporary mute feature",
      "Improved dashboard interface and usability",
      "Fixed bug with role assignment for new members"
    ]
  },
  {
    version: "v1.1.0",
    date: "March 2, 2025",
    changes: [
      "Introduced custom command creation system",
      "Added advanced logging options",
      "Improved performance for larger servers",
      "Updated Discord API integration"
    ]
  },
  {
    version: "v1.0.0",
    date: "February 1, 2025",
    changes: [
      "Initial release of TrioGuard",
      "Basic moderation features implemented",
      "Welcome messages and role assignment",
      "Simple command system"
    ]
  }
];

const ChangelogSection = () => {
  return (
    <section id="changelog" className="section">
      <div className="container-custom">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Changelog</h2>
          <p className="text-lg text-trioguard-dark/80">
            Stay updated with the latest TrioGuard features and improvements
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          {releases.map((release, index) => (
            <div 
              key={index} 
              className="mb-10 relative pl-8 before:content-[''] before:absolute before:left-0 before:top-0 before:h-full before:w-0.5 before:bg-trioguard/30"
            >
              <div className="absolute left-0 top-0 w-4 h-4 rounded-full bg-trioguard -translate-x-1/2"></div>
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-trioguard">{release.version}</h3>
                <span className="text-sm text-trioguard-dark/60">{release.date}</span>
              </div>
              
              <ul className="space-y-2">
                {release.changes.map((change, changeIndex) => (
                  <li key={changeIndex} className="flex items-start">
                    <span className="text-trioguard mr-2">•</span>
                    <span>{change}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ChangelogSection;
