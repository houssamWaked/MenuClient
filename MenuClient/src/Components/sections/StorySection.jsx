import { useSiteData } from '../../context/site-data-context.js';
import './StorySection.css';

export function StorySection() {
  const { siteContent } = useSiteData();
  const story = siteContent?.story ?? {};

  return (
    <section
      className="story-section"
      id="story"
      style={{ '--story-image': `url(${story.backgroundImage ?? ''})` }}
    >
      <div className="story-section__overlay" />
      <div className="container story-section__content">
        <div className="story-copy" data-reveal="left">
          <h2>
            <span>{story.titleTop ?? ''}</span>
            <span>{story.titleBottom ?? ''}</span>
          </h2>
          <p>{story.description ?? ''}</p>
        </div>
        <div className="story-video-frame" data-reveal="right">
          <video
            className="story-video"
            controls
            preload="metadata"
            playsInline
            poster={story.backgroundImage ?? ''}
          >
            <source src={story.videoUrl ?? ''} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      </div>
    </section>
  );
}
