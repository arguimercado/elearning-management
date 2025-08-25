
const VideoPreview = ({ previewUrl } : {previewUrl?: string | null | undefined}) => {
  return (
    <div>
      <iframe src={previewUrl ?? ""} title="YouTube video player" 
        frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen className="w-full h-[500px]"></iframe>
    </div>
  )
}
export default VideoPreview