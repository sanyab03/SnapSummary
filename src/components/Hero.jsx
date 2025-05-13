import '../index.css';

const Hero = () => {
  return (
    <header className="hero-section w-full px-8">
      <nav className="flex justify-between items-center w-full max-w-6xl mx-auto mb-10">
        <div className="brand">
          SnapSummary
        </div>

      </nav>

      <h1 className="hero-title">
        Summarize Lengthy Articles with
        <span>SUMMARIQ</span>
      </h1>
      <p className="hero-subtext">
        <span className="highlight">Smart</span> Summaries. <span className="highlight">Less</span> Scroll. <span className="highlight">More</span> Clarity.
      </p>

    </header>
  );
};

export default Hero;