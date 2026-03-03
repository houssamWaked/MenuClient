import { mediaLibrary, siteCopy } from '../../constants/string.js';
import './StorySection.css';

export function StorySection() {
  return (
    <section
      className="story-section"
      id="story"
      style={{ '--story-image': `url(${mediaLibrary.storyBackground})` }}
    >
      <div className="story-section__overlay" />
      <div className="container story-section__content">
        <div className="story-copy" data-reveal="left">
          <h2>
            <span>{siteCopy.storyTitleTop}</span>
            <span>{siteCopy.storyTitleBottom}</span>
          </h2>
          <p>{siteCopy.storyDescription}</p>
        </div>
        <div className="story-video-frame" data-reveal="right">
          <video
            className="story-video"
            controls
            preload="metadata"
            playsInline
            poster={mediaLibrary.storyBackground}
          >
            <source src={mediaLibrary.storyVideoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      </div>
    </section>
  );
}
