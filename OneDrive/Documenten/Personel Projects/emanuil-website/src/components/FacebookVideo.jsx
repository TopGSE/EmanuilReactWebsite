import { useState, useEffect } from "react";
import "../styles/FacebookVideo.css";

function FacebookVideo({ videoUrl }) {
  const [isLoading, setIsLoading] = useState(true);

  // Extract Facebook video ID from URL if needed
  const getEmbedUrl = (url) => {
    // If it's already an embed URL, return it
    if (url.includes("embed")) return url;

    // If it's a standard Facebook video URL, convert it
    // Format: https://www.facebook.com/ChurchName/videos/123456789/
    if (url.includes("/videos/")) {
      const videoId = url.split("/videos/")[1].split("/")[0];
      return `https://www.facebook.com/plugins/video.php?href=https%3A%2F%2Fwww.facebook.com%2Fvideo.php%3Fv%3D${videoId}&show_text=false`;
    }

    // If it's a post with video
    return `https://www.facebook.com/plugins/post.php?href=${encodeURIComponent(
      url
    )}&show_text=false`;
  };

  const embedUrl = getEmbedUrl(videoUrl);

  return (
    <div className="facebook-video-container">
      {isLoading && <div className="video-loader">Loading...</div>}
      <iframe
        src={embedUrl}
        width="100%"
        height="400"
        style={{ border: "none", overflow: "hidden" }}
        scrolling="no"
        frameBorder="0"
        allowFullScreen={true}
        allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
        onLoad={() => setIsLoading(false)}
      ></iframe>
    </div>
  );
}

export default FacebookVideo;
