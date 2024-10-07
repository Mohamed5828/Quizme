import { useEffect } from "react";
import postData from "../utils/postData";

const FRAME_POLLING_RATE = 10000;
const JPEG_IMAGE_QUALITY = 0.8;
const useWebCamPolling = (stream: MediaStream | null) => {
  useEffect(() => {
    // if (!stream) {
    //   return;
    // }
    // Create video element and attach it to dom hidden
    const videoElement = document.createElement("video");
    videoElement.srcObject = stream;
    videoElement.style.display = "none";
    document.body.appendChild(videoElement);
    videoElement.play();

    // Canvas for manipulating frames
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    canvas.width = 640;
    canvas.height = 480;
    console.log({ context });
    if (!context) {
      console.error("Failed to get canvas context for webcam polling");
      return;
    }

    // Poll for frames with FRAME_POLLING_RATE
    const interval = setInterval(() => {
      context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
      // Convert canvas to blob then post it to server
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            console.error(
              "Failed to convert canvas to blob for webcam polling"
            );
            return;
          }
          const attempt_id = sessionStorage.getItem("attemptId");
          if (!attempt_id) {
            console.error("Attempt id not found for webcam polling");
            return;
          }
          postData(`/monitor-frame?attempt_id=${attempt_id}`, blob).catch(
            (error) => {
              console.error("Error sending frame:", error);
            }
          );
        },
        "image/jpeg",
        JPEG_IMAGE_QUALITY
      );
    }, FRAME_POLLING_RATE);
    return () => {
      clearInterval(interval);
      videoElement.srcObject = null;
      videoElement.pause();
      document.body.removeChild(videoElement);
    };
  }, [stream]);
};

export default useWebCamPolling;
