// Priority colors
const priorityColors = {
    "High": "bg-yellow-500 text-black", 
    "Emergency": "bg-red-600 text-white", 
    "Low": "bg-green-600 text-white",
};

// Main track button event listener
document.getElementById("trackBtn").addEventListener("click", async () => {
    const trackingIdInput = document.getElementById("trackingId");
    const trackingId = trackingIdInput.value.trim(); 
    const container = document.getElementById("resultContainer");
    const details = document.getElementById("reportDetails");

    if (!trackingId) {
        alert("Please enter a tracking ID.");
        return;
    }

    try {
        container.classList.remove("hidden");
        details.innerHTML = `<p class="text-gray-700">Searching...</p>`;

        const response = await fetch(`/api/reports/${trackingId}`);
        const result = await response.json();

        if (result.success) {
            const report = result.report;
            // Display the report details
            details.innerHTML = `
                <p><strong>Name:</strong> ${report.name || "Anonymous"}</p>
                <p class="mt-2"><strong>Barangay ID / Proof:</strong><br>
                    ${report.photo ? `<img src="${report.photo.split(',')[0]}" class="w-32 h-32 object-cover rounded mx-auto border" />` : "-"}
                </p>
                <p class="mt-2"><strong>Category:</strong> ${report.category}</p>
                <p class="mt-2"><strong>Description:</strong> ${report.description}</p>
                <p class="mt-2"><strong>Upload Evidence:</strong><br>
                    ${report.areaPhoto ? `<img src="${report.areaPhoto.split(',')[0]}" class="w-48 h-32 object-cover rounded mx-auto border" />` : "-"}
                </p>
                <p class="mt-2"><strong>Status:</strong> ${report.status}</p>
                <p class="mt-2"><strong>Date Reported:</strong> ${report.date}</p>
                <p class="mt-2"><strong>Priority:</strong> 
                    <span class="px-3 py-1 rounded-full ${priorityColors[report.priority] || 'bg-gray-400'}">
                    ${report.priority}
                    </span>
                </p>
            `;
        } else {
            details.innerHTML = `
                <p class="text-red-600 font-semibold">
                    ${result.message} (for ID: ${trackingId})
                </p>
            `;
        }
    } catch (error) {
        console.error("Tracking error:", error);
        details.innerHTML = `
            <p class="text-red-600 font-semibold">
                A network error occurred. Please try again.
            </p>
        `;
    }
});