
// Mobile menu toggle
/*
const menuBtn = document.getElementById('menu-btn');
const mobileNav = document.getElementById('mobile-nav');

if (menuBtn && mobileNav) {
  menuBtn.addEventListener('click', () => {
    mobileNav.classList.toggle('hidden');
  });
}
  */


  //Sample Data
  const reports = [
  {
    id: 1,
    trackingId: "TR-001",
    name: "Juan Dela Cruz",
    photo: "Images/sampleId.jpg",
    category: "Garbage",
    description: "Uncollected garbage near basketball court.",
    areaPhoto: "Images/garbage.jpg",
    status: "In Progress",
    date: "2025-10-15",
    priority: "High"
  },
  {
    id: 2,
    trackingId: "TR-002",
    name: null,
    photo: null,
    category: "Streetlight",
    description: "Broken streetlight in Purok 4.",
    areaPhoto: "Images/streetlight.jpg",
    status: "Resolved",
    date: "2025-10-10",
    priority: "Medium"
  },
  {
    id: 3,
    trackingId: "TR-003",
    name: "Pedro Reyes",
    photo: "Images/sampleId.jpg",
    category: "Road",
    description: "Potholes along main road.",
    areaPhoto: "Images/pothole.jpg",
    status: "Pending",
    date: "2025-10-18",
    priority: "Low"
  }
];

const priorityColors = {
  "High": "bg-red-500 text-white",
  "Medium": "bg-yellow-400 text-black",
  "Low": "bg-green-500 text-white"
};

document.getElementById("trackBtn").addEventListener("click", () => {
  const trackingId = document.getElementById("trackingId").value.trim().toUpperCase();
  const result = reports.find(r => r.trackingId === trackingId);
  const container = document.getElementById("resultContainer");
  const details = document.getElementById("reportDetails");

  if (result) {
    container.classList.remove("hidden");
    details.innerHTML = `
      <p><strong>Name:</strong> ${result.name ? result.name : "Anonymous"}</p>
      <p><strong>Barangay ID:</strong><br>
        ${result.photo 
          ? `<img src="${result.photo}" class="w-32 h-32 object-cover rounded mx-auto" />` 
          : "-"}
      </p>
      <p><strong>Category:</strong> ${result.category}</p>
      <p><strong>Description:</strong> ${result.description}</p>
      <p><strong>Upload Evidence:</strong><br>
        ${result.areaPhoto 
          ? `<img src="${result.areaPhoto}" class="w-48 h-32 object-cover rounded mx-auto" />` 
          : "-"}
      </p>
      <p><strong>Status:</strong> ${result.status}</p>
      <p><strong>Date Reported:</strong> ${result.date}</p>
      <p><strong>Priority:</strong> 
        <span class="px-3 py-1 rounded-full ${priorityColors[result.priority]}">
          ${result.priority}
        </span>
      </p>
    `;
  } else {
    container.classList.remove("hidden");
    details.innerHTML = `
      <p class="text-red-600 font-semibold">
        No report found for Tracking ID: ${trackingId}
      </p>
    `;
  }
});
