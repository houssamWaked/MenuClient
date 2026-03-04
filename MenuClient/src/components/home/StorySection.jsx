import { Reveal } from '../common/Reveal.jsx';
import './StorySection.css';

export function StorySection({ story }) {
  if (!story) {
    return null;
  }

  return (
    <section
      className="story-section section-space"
      style={story.backgroundImage ? { '--story-bg': `url(${story.backgroundImage})` } : undefined}
    >
      <div className="story-section__backdrop" />
      <div className="story-section__inner container">
        <Reveal className="story-section__heading">
          <h2>
            <span>{story.titleTop}</span>
            <span>{story.titleBottom}</span>
          </h2>
          <p>{story.description}</p>
        </Reveal>

        <Reveal className="story-section__video-shell" delay={120}>
          <video autoPlay controls loop muted playsInline src={story.videoUrl} />
        </Reveal>
      </div>
    </section>
  );
}
