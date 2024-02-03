import React, { useState, useRef, useCallback } from "react";
import Webcam from "react-webcam";

const videoConstraints = {
  width: 1920,
  height: 1080,
  facingMode: "user",
};

function Video() {
  const [isCaptureEnable, setCaptureEnable] = useState(false);
  const webcamRef = useRef(null);
  const [url, setUrl] = useState(null);
  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    if (imageSrc) {
      setUrl(imageSrc);
    }
  }, [webcamRef]);

  return (
    <div className="video-container">
      <h1 className="Title">漫画風写真撮影アプリ</h1>
      {isCaptureEnable || (
        <button
          className="camera-button"
          onClick={() => setCaptureEnable(true)}
        >
          開始
        </button>
      )}
      {isCaptureEnable && (
        <div>
          <div>
            <button
              className="camera-button"
              onClick={() => setCaptureEnable(false)}
            >
              終了
            </button>
          </div>
          <div>
            <Webcam
              audio={false}
              width={1920}
              height={1080}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              videoConstraints={videoConstraints}
            />
          </div>
          <button className="camera-button" onClick={capture}>
            キャプチャ
          </button>
        </div>
      )}
      {url && (
        <div>
          <div>
            <button
              className="camera-button"
              onClick={() => {
                setUrl(null);
              }}
            >
              削除
            </button>
          </div>
          <div>
            <img src={url} alt="Screenshot" />
          </div>
        </div>
      )}
    </div>
  );
}

export default Video;
