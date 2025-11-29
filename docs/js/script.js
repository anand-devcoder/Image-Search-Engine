let input = document.querySelector(".search-box input");
let btn = document.querySelector(".btn button");
let images = document.querySelector(".pre-images");
let load = document.querySelector("#load");

let page = 1;
let keyword = "";

async function getResponse() {
    keyword = input.value.trim();
    if (!keyword) return;

    let start = (page - 1) * 10 + 1;

    // Backend proxy call (API key hidden)
    // let url = `http://localhost:3000/search?q=${encodeURIComponent(keyword)}&start=${start}`;
    let url = `https://image-search-engine-6d5i.onrender.com/search?q=${encodeURIComponent(keyword)}&start=${start}`;
    
    try {
        let response = await fetch(url);
        if (!response.ok) throw new Error("Network response was not ok");

        let data = await response.json();
        let results = data.items || [];

        if (page === 1) images.innerHTML = "";
        load.style.display = "block";

        for (let result of results) {
            const li = document.createElement("li");
            li.classList.add("image");

            const img = document.createElement("img");
            const cleanUrl = result.link.replace(/^https?:\/\//, "");
            img.src = `https://images.weserv.nl/?url=${cleanUrl}`;
            img.alt = "img";
            img.classList.add("photo");
            img.onerror = () => li.remove();

            const details = document.createElement("div");
            details.classList.add("details");
            details.innerHTML = `
                <div class="user">
                    <img src="images/camera.svg" alt="img">
                    <span>${keyword}</span>
                </div>
                <div class="download">
                    <img src="images/download.svg" alt="img">
                </div>
            `;

            // 🔹 Download button → use backend proxy to avoid CORS
            const downloadBtn = details.querySelector(".download");
            //downloadBtn.addEventListener("click", () => {
            //    const proxyUrl = `http://localhost:3000/download?url=${encodeURIComponent(result.link)}`;
            //    download(proxyUrl);
            //});
            downloadBtn.addEventListener("click", () => {
                const proxyUrl = `https://image-search-engine-6d5i.onrender.com/download?url=${encodeURIComponent(result.link)}`;
                download(proxyUrl);
            });
 

            
            li.appendChild(img);
            li.appendChild(details);
            images.appendChild(li);
        }
    } catch (err) {
        console.error("Fetch error:", err);
    }
}

// 🔹 Event Listeners
input.addEventListener("keyup", (e) => {
    page = 1;
    if (e.key === "Enter") getResponse();
});

btn.addEventListener("click", () => {
    page = 1;
    getResponse();
});

load.addEventListener("click", () => {
    page++;
    getResponse();
});

// 🔽 Download function (works via backend proxy)
async function download(url) {
    try {
        const response = await fetch(url);
        const blob = await response.blob();

        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);

        let filename = url.split("/").pop().split("?")[0] || "image.jpg";
        a.download = filename;

        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    } catch (error) {
        console.error("Download failed:", error);
    }
}
