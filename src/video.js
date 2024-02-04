import React from "react";

function Video() {
  const width = 600;
  let height = 0;

  let streaming = false;

  let video = null;
  let canvas = null;
  let photo = null;
  let startbutton = null;

  function showViewLiveResultButton() {
    if (window.self !== window.top) {
      document.querySelector(".contentarea").remove();
      const button = document.createElement("button");
      button.textContent = "view live result of the example code above";
      document.body.append(button);
      // eslint-disable-next-line
      button.addEventListener("click", () => window.open(location.href));
      return true;
    }
    return false;
  }

  async function startup() {
    if (showViewLiveResultButton()) {
      return;
    }
    video = document.getElementById("video");
    canvas = document.getElementById("canvas");
    photo = document.getElementById("photo");
    startbutton = document.getElementById("startbutton");

    await navigator.mediaDevices
      .getUserMedia({ video: true, audio: false })
      .then((stream) => {
        video.srcObject = stream;
        var playPromise = video.play();

        // video.play(); とするとエラーが出るので以下を参考に修正
        // https://goo.gl/LdLk22
        if (playPromise !== undefined) {
          playPromise.then((_) => {}).catch((error) => {});
        }
      })
      .catch((err) => {
        console.error(`An error occurred: ${err}`);
      });

    video.addEventListener(
      "canplay",
      (ev) => {
        if (!streaming) {
          height = video.videoHeight / (video.videoWidth / width);

          if (isNaN(height)) {
            height = width / (4 / 3);
          }

          video.setAttribute("width", width);
          video.setAttribute("height", height);
          canvas.setAttribute("width", width);
          canvas.setAttribute("height", height);
          streaming = true;
        }
      },
      false
    );

    startbutton.addEventListener(
      "click",
      (ev) => {
        takepicture();
        ev.preventDefault();
      },
      false
    );

    clearphoto();
  }

  function clearphoto() {
    const context = canvas.getContext("2d");
    context.fillStyle = "#AAA";
    context.fillRect(0, 0, canvas.width, canvas.height);

    const data = canvas.toDataURL("image/png");
    photo.setAttribute("src", data);
  }

  function takepicture() {
    let context = canvas.getContext("2d");
    if (width && height) {
      canvas.width = width;
      canvas.height = height;
      context.drawImage(video, 0, 0, width, height);

      // context = imageProcessing(context);
      context = cartoonize(context);
      context = addComicElements(context);

      const data_ = canvas.toDataURL("image/png");
      photo.setAttribute("src", data_);
    } else {
      clearphoto();
    }
  }

  function cartoonize(context) {
    // エッジ検出
    const imageData = context.getImageData(0, 0, width, height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
      const edge = gray < 100 ? 0 : 255;

      data[i] = edge;
      data[i + 1] = edge;
      data[i + 2] = edge;
    }

    context.putImageData(imageData, 0, 0);

    // トーンの調整
    context.fillStyle = "rgba(255, 255, 255, 0.1)";
    context.fillRect(0, 0, width, height);

    return context;
  }

  function addComicElements(context) {
    // テキストを描画
    context.font = "20px Comic Sans MS";

    // 吹き出しを描画
    context.beginPath();
    context.moveTo(50, 50);
    context.lineTo(300, 50);
    context.lineTo(300, 100);
    context.lineTo(100, 100);
    context.lineTo(80, 130);
    context.lineTo(60, 100);
    context.lineTo(50, 100);
    context.closePath();
    context.fillStyle = "white";
    context.fill();
    context.lineWidth = 2;
    context.strokeStyle = "black";
    context.stroke();
    context.fillStyle = "black";
    context.fillText("晩御飯は二回食べます!!!", 70, 80);

    return context;
  }

  window.addEventListener("load", startup, false);

  return (
    <>
      <h1 className="Title">漫画風写真撮影アプリ</h1>
      <div className="contentarea">
        <div className="camera">
          <video id="video">Video stream not available.</video>
          <button id="startbutton">Take photo</button>
        </div>
        <canvas id="canvas"> </canvas>
        <div className="output">
          <img id="photo" alt="The screen capture will appear in this box." />
        </div>
      </div>
    </>
  );
}

export default Video;
