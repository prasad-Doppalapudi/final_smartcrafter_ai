from moviepy.editor import VideoFileClip

def detach_audio(video_path, audio_path):
    video = VideoFileClip(video_path)
    video.audio.write_audiofile(audio_path)
    return audio_path
