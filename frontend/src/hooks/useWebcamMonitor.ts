import { useEffect, useState } from "react"

// interface VideoConstraints {
//   width?: number;
//   height?: number;
//   frameRate?: number;
// }

// const defaultVideoConstraints: VideoConstraints = {
//   width: 480,
//   height: 270,
//   frameRate: 5,
// }

const useWebcamMonitor = ( ) => {
  const [ stream, setStream ] = useState<MediaStream | null>(null)
  const [ error, setError ] = useState<Error | null>(null)
  useEffect(() => {   
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: false })
      .then((newStream) => {
        setStream(newStream);
        setError(null);
      })
      .catch((error) => {
        setStream(null);
        setError(error);
      });

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => {
          track.stop()
        })
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return { stream, error }
}

export default useWebcamMonitor;
