import Player from "next-video/player"
import Video from "next-video"

const VideoPreview = ({ previewUrl } : {previewUrl?: string}) => {
  return (
    <div>
      <iframe src={previewUrl} title="YouTube video player" 
        frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen className="w-full h-[500px]"></iframe>
    </div>
  )
}
export default VideoPreview