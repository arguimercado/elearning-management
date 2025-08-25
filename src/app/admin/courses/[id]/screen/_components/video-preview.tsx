
const VideoPreview = ({ previewUrl } : {previewUrl?: string | null | undefined}) => {
  return (
    <div>
      <iframe src={previewUrl ?? ""} title="YouTube video player" 
         allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"  className="w-full h-[500px]"></iframe>
    </div>
  )
}
export default VideoPreview