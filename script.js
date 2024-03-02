

document.getElementById("downloadBtn").addEventListener("click", function () {
  var url = document.getElementById("urlInput").value;
  if (url.trim() === "") {
    alert("Please enter a valid YouTube video URL.");
    return;
  }

  // Send request to server
  fetch("/download", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ url: url }),
  })
    .then((response) => response.json())
    .then((data) => {
      // Display video thumbnail and title
      var videoInfoDiv = document.getElementById("videoInfo");
      videoInfoDiv.innerHTML = `
            <div class="video-item">
                <img src="${data.thumbnail}" alt="Video Thumbnail">
                <p><strong>Title:</strong> ${data.title}</p>
            </div>
        `;

      // Display download buttons for each format
      var formatsDiv = document.createElement("div");
      formatsDiv.classList.add("formats");
      data.formats.forEach((format) => {
        var formatBtn = document.createElement("button");
        formatBtn.classList.add("formatBtn");
        formatBtn.innerText = `${format.qualityLabel} (${format.container})`;
        formatBtn.onclick = function () {
          downloadVideo(format.url);
        };
        formatsDiv.appendChild(formatBtn);
      });
      videoInfoDiv.appendChild(formatsDiv);
    })
    .catch((error) => {
      console.error("Error fetching video info:", error);
      alert("Failed to fetch video info. Please try again later.");
    });
});

function downloadVideo(url) {
  var anchor = document.createElement("a");
  anchor.href = url;
  anchor.target = "_blank"; // Open in new tab
  anchor.download = "video.mp4";
  anchor.click();
//   console.log("download success");
}
