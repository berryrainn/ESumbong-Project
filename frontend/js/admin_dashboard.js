let mapInstance = null; // To hold the Leaflet map instance

// =======================
// SIDEBAR
// =======================
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebar = document.getElementById('sidebar');
    const icon = sidebarToggle.querySelector('i');

    // Toggle Sidebar visibility
    sidebarToggle.addEventListener('click', (event) => {
      event.stopPropagation();
      sidebar.classList.toggle('-translate-x-full');
      icon.classList.add('fa-bars');
    });

    // Function to switch visible sections
    function showSection(sectionId) {
      const sections = ['sectionAnnouncements', 'sectionCharts', 'sectionReports', 'sectionAuditLog'];
      const buttons = {
        sectionAnnouncements: document.getElementById('btnAnnouncements'),
        sectionCharts: document.getElementById('btnCharts'),
        sectionReports: document.getElementById('btnReports'),
        sectionAuditLog: document.getElementById('btnAuditLog')
      };

      // Show selected section, hide others
      sections.forEach(sec => {
        document.getElementById(sec).style.display = (sec === sectionId) ? 'block' : 'none';
      });

      // Disable active button
      Object.entries(buttons).forEach(([id, btn]) => {
        if (!btn) return; 
        if (id === sectionId) {
          btn.classList.add('bg-green-900', 'cursor-not-allowed', 'opacity-70');
          btn.disabled = true;
        } else {
          btn.classList.remove('bg-green-900', 'cursor-not-allowed', 'opacity-70');
          btn.disabled = false;
        }
      });

      // Hide sidebar after selection
      sidebar.classList.add('-translate-x-full');
      icon.classList.add('fa-bars');
      icon.classList.remove('fa-xmark');
    }

    // Hide sidebar when clicking the arrow icon
    const hideSidebar = document.getElementById('hideSidebar');

    if (hideSidebar) {
      hideSidebar.addEventListener('click', () => {
        sidebar.classList.add('-translate-x-full');
        icon.classList.add('fa-bars');
      });
    }
    
    // Hide sidebar when clicking outside
    document.addEventListener('click', (event) => {
      const isClickInsideSidebar = sidebar.contains(event.target);
      const isClickOnToggle = sidebarToggle.contains(event.target);

      if (!isClickInsideSidebar && !isClickOnToggle) {
        sidebar.classList.add('-translate-x-full');
        icon.classList.add('fa-bars');
        icon.classList.remove('fa-xmark');
      }
    });

    

// Automatically open the saved section (like Announcements) after login
document.addEventListener("DOMContentLoaded", () => {
  const defaultSection = localStorage.getItem("defaultSection");
  if (defaultSection && document.getElementById(defaultSection)) {
    showSection(defaultSection);
    localStorage.removeItem("defaultSection"); // clear it once used
  } else {
    showSection('sectionAnnouncements'); // fallback if none saved
  }

  populateAuditLog(auditLogData);
  fetchReports();
});


  const carousel = document.getElementById('newsCarousel');
  const totalSlides = carousel.children.length;
  const visibleSlides = 3;
  let index = 0;

  const updateCarousel = () => {
    carousel.style.transform = `translateX(-${index * (100 / visibleSlides)}%)`;
  };

  document.getElementById('nextBtn').addEventListener('click', () => {
    if (index < totalSlides - visibleSlides) index++;
    else index = 0;
    updateCarousel();
  });

  document.getElementById('prevBtn').addEventListener('click', () => {
    if (index > 0) index--;
    else index = totalSlides - visibleSlides;
    updateCarousel();
  });

  // Auto-slide every 10 seconds
  setInterval(() => {
    if (index < totalSlides - visibleSlides) index++;
    else index = 0;
    updateCarousel();
  }, 10000);

  
// =======================
// CHART SECTION
// =======================

window.addEventListener('DOMContentLoaded', () => {

  // Sample data
  const reportStats = {
    categories: ['Garbage', 'Road repair', 'Street Light', 'Water Drainage', 'Other'],
    reported: [50, 90, 40, 60, 50],
    solved: [45, 85, 35, 55, 40],
    colors: ['#72C93B','#28A745','#F2C94C','#3498DB','#A0522D']
  };
  

  // Calculate totals
  const totalReported = reportStats.reported.reduce((a,b) => a+b, 0);
  const totalSolved = reportStats.solved.reduce((a,b) => a+b, 0);

  // Update displayed totals
  document.getElementById('reportedTotal').textContent = totalReported;
  document.getElementById('solvedTotal').textContent = totalSolved;

  // Calculate resolved percentage
  const resolvedPercent = totalReported > 0 ? ((totalSolved / totalReported) * 100).toFixed(1) : 0;
  document.getElementById('resolvedPercent').textContent = resolvedPercent + '%';

  // Bar Chart: Reported vs Solved
  new Chart(document.getElementById('barChart'), {
    type: 'bar',
    data: {
      labels: reportStats.categories,
      datasets: [
        {
          label: 'Reported Issues',
          data: reportStats.reported,
          backgroundColor: 'red',
          borderRadius: 4
        },
        {
          label: 'Solved Reports',
          data: reportStats.solved,
          backgroundColor: 'green',
          borderRadius: 4
        }
      ]
    },
    options: {
      responsive: true,
      scales: {
        y: { beginAtZero: true, ticks: { stepSize: 10 } },
        x: { stacked: false }
      },
      plugins: { 
        legend: { position: 'top' },
        tooltip: {
          callbacks: {
            label: function(context) {
            const label = context.label || '';
            const value = context.raw;
            return `${label}: ${value}%`;
            }
          }
        }
       }
    }
  });

  // Pie Chart: Types of Reported Issues
  new Chart(document.getElementById('pieChart'), {
    type: 'pie',
    data: {
      labels: reportStats.categories,
      datasets: [{
        data: reportStats.reported,
        backgroundColor: reportStats.colors
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: { 
      legend: { display: true }, 
      tooltip: {
      callbacks: {
        label: function(context) {
          const label = context.label || '';
          const value = context.raw;
          return `${label}: ${value}%`;
          }
         }
        }
      }
    }
});

  // Pie chart legend
  const legendList = document.getElementById('legendList');
  reportStats.categories.forEach((label, i) => {
    const li = document.createElement('li');
    li.className = 'flex items-center gap-2';
    li.innerHTML = `
      <span style="background:${reportStats.colors[i]};width:14px;height:14px;border-radius:4px;"></span>
      <span class="text-sm text-gray-700">${label}</span>
    `;
    legendList.appendChild(li);
  });
});


// =======================
// ANNOUNCEMENT SECTION
// =======================
const addAnnouncementBtn = document.getElementById('addAnnouncementBtn');
const announcementForm = document.getElementById('announcementForm');
const uploadAnnouncementBtn = document.getElementById('uploadAnnouncementBtn');
const announcementTitle = document.getElementById('announcementTitle');
const announcementDescription = document.getElementById('announcementDescription');
const announcementsGrid = document.getElementById('announcementsGrid');

let editingCard = null; // Track the card being edited

// Show/hide announcement form
addAnnouncementBtn.addEventListener('click', () => {
  announcementForm.classList.toggle('hidden');
  if (!announcementForm.classList.contains('hidden')) {
    announcementTitle.focus();
    uploadAnnouncementBtn.textContent = 'Upload Announcement';
    editingCard = null;
  }
});

// Format date 
function getFormattedDate() {
  const today = new Date();
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return today.toLocaleDateString('en-US', options);
}

// Create announcement card
function createAnnouncementCard(title, description, date) {
  const card = document.createElement('div');
  card.className = 'bg-white shadow-md rounded-xl p-6 hover:shadow-xl transition flex flex-col justify-between h-full';
  card.innerHTML = `
    <h4 class="text-xl font-semibold text-green-800 mb-2">${title}</h4>
    <p class="text-gray-600 mb-4 flex-grow">${description}</p>
    <div class="flex justify-between items-center border-t pt-2 bg-gray-50 mt-auto">
      <p class="text-sm text-gray-500">Posted: ${date}</p>
      <div class="space-x-2">
        <button class="editBtn bg-green-500 text-white px-3 py-1 rounded hover:bg-yellow-500 transition text-sm">Edit</button>
        <button class="deleteBtn bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition text-sm">Delete</button>
      </div>
    </div>
  `;

  // Edit button
  card.querySelector('.editBtn').addEventListener('click', () => {
    editingCard = card;
    announcementTitle.value = title;
    announcementDescription.value = description;
    announcementForm.classList.remove('hidden');
    uploadAnnouncementBtn.textContent = 'Save Changes';
    announcementTitle.focus();
  });

  // Delete button
  card.querySelector('.deleteBtn').addEventListener('click', () => {
    if (confirm('Are you sure you want to delete this announcement?')) {
      card.remove();
    }
  });

  return card;
}

// Upload or save announcement
uploadAnnouncementBtn.addEventListener('click', () => {
  const title = announcementTitle.value.trim();
  const description = announcementDescription.value.trim();

  if (!title || !description) {
    alert('Please enter both title and description.');
    return;
  }

  const date = getFormattedDate();

  if (editingCard) {
    // Save changes
    editingCard.querySelector('h4').textContent = title;
    editingCard.querySelector('p').textContent = description;
    editingCard.querySelector('.text-gray-500').textContent = `Posted: ${date}`;
    editingCard = null;
    uploadAnnouncementBtn.textContent = 'Upload Announcement';
  } else {
    // Add new card
    const card = createAnnouncementCard(title, description, date);
    announcementsGrid.prepend(card);
  }

  // Clear form
  announcementTitle.value = '';
  announcementDescription.value = '';
  announcementForm.classList.add('hidden');
});

// Edit and Delete for Existing Announcements
function activateExistingAnnouncementButtons() {
  document.querySelectorAll("#announcementsGrid .editBtn").forEach(btn => {
    btn.addEventListener("click", () => {
      const card = btn.closest(".bg-white");
      const titleE1 = card.querySelector("h4");
      const descE1 = card.querySelector(".text-gray-600");

      editingCard = card;
      announcementTitle.value = titleE1.textContent;
      announcementDescription.value = descE1.textContent;

      announcementForm.classList.remove("hidden");
      uploadAnnouncementBtn.textContent = "Save Changes"
      announcementTitle.focus();
    });
  });

  document.querySelectorAll("#announcementsGrid .deleteBtn").forEach(btn => {
    btn.addEventListener("click", () => {
      const card = btn.closest(".bg-white");
      if (confirm("Are you sure you want to delete this announcement?")) {
        card.remove();
      }
    });
  });
}

activateExistingAnnouncementButtons();

// =======================
// NEWS SECTION
// =======================
// Select all existing news cards
document.querySelectorAll('.newsCard').forEach(card => {
  const editBtn = card.querySelector('.editNewsBtn');
  const deleteBtn = card.querySelector('.deleteNewsBtn');

  editBtn.addEventListener('click', e => {
    e.preventDefault(); // Prevent navigation
    const innerDiv = card.querySelector('div');
    editingNews = card;
    newsTitle.value = innerDiv.querySelector('h3').textContent;
    newsDescription.value = innerDiv.querySelector('p').textContent;
    newsImage.value = innerDiv.querySelector('img').src;
    newsLink.value = card.href !== '#' ? card.href : '';
    newsForm.classList.remove('hidden');
    uploadNewsBtn.textContent = 'Save Changes';
    newsTitle.focus();
  });

  deleteBtn.addEventListener('click', e => {
    e.preventDefault(); // Prevent navigation
    if (confirm('Are you sure you want to delete this news item?')) {
      card.remove();
    }
  });
});

const addNewsBtn = document.getElementById('addNewsBtn');
const newsForm = document.getElementById('newsForm');
const uploadNewsBtn = document.getElementById('uploadNewsBtn');
const newsTitle = document.getElementById('newsTitle');
const newsDescription = document.getElementById('newsDescription');
const newsLink = document.getElementById('newsLink');
const newsImage = document.getElementById('newsImage');
const newsCarousel = document.getElementById('newsCarousel');

let editingNews = null;

// Show/hide news form
addNewsBtn.addEventListener('click', () => {
  newsForm.classList.toggle('hidden');
  if (!newsForm.classList.contains('hidden')) {
    newsTitle.focus();
    uploadNewsBtn.textContent = 'Upload News';
    editingNews = null;
  }
});

// Create news card
function createNewsCard(title, description, image, link, date) {
  const card = document.createElement('a');
  card.href = link || '#';
  card.target = '_blank';
  card.className = 'flex-shrink-0 w-full md:w-1/3 p-3';

  card.innerHTML = `
    <div class="bg-white shadow-md rounded-xl overflow-hidden flex flex-col h-full hover:shadow-lg transition relative">
      <img src="${image}" alt="${title}" class="w-full h-48 object-cover">
      <div class="p-5 flex flex-col flex-grow">
        <h3 class="text-lg font-semibold text-green-800 mb-2">${title}</h3>
        <p class="text-gray-600 text-sm mb-4 flex-grow">${description}</p>
      </div>
      <div class="border-t px-5 py-3 bg-gray-50 flex justify-between items-center">
        <p class="text-sm text-gray-500">Posted: ${date}</p>
        <div class="space-x-2">
          <button class="editNewsBtn bg-green-500 text-white px-2 py-1 rounded hover:bg-yellow-500 transition text-xs">Edit</button>
          <button class="deleteNewsBtn bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition text-xs">Delete</button>
        </div>
      </div>
    </div>
  `;

  // Edit
  card.querySelector('.editNewsBtn').addEventListener('click', (e) => {
    e.preventDefault();
    editingNews = card;
    newsTitle.value = title;
    newsDescription.value = description;
    newsImage.value = image;
    newsLink.value = link;
    newsForm.classList.remove('hidden');
    uploadNewsBtn.textContent = 'Save Changes';
    newsTitle.focus();
  });

  // Delete
  card.querySelector('.deleteNewsBtn').addEventListener('click', (e) => {
    e.preventDefault();
    if (confirm('Are you sure you want to delete this news?')) {
      card.remove();
    }
  });

  return card;
}

// Upload or save news
uploadNewsBtn.addEventListener('click', () => {
  const title = newsTitle.value.trim();
  const description = newsDescription.value.trim();
  const image = newsImage.value.trim();
  const link = newsLink.value.trim();
  const date = getFormattedDate();

  if (!title || !description || !image) {
    alert('Please enter title, description, and image URL.');
    return;
  }

  if (editingNews) {
    // Save changes
    const innerDiv = editingNews.querySelector('div');
    innerDiv.querySelector('h3').textContent = title;
    innerDiv.querySelector('p').textContent = description;
    innerDiv.querySelector('img').src = image;
    editingNews.href = link || '#';
    innerDiv.querySelector('.text-gray-500').textContent = `Posted: ${date}`;
    editingNews = null;
    uploadNewsBtn.textContent = 'Upload News';
  } else {
    // Add new news card
    const card = createNewsCard(title, description, image, link, date);
    newsCarousel.prepend(card);
  }

  // Clear form
  newsTitle.value = '';
  newsDescription.value = '';
  newsImage.value = '';
  newsLink.value = '';
  newsForm.classList.add('hidden');
});


// =======================
// REPORTS TABLE SECTION
// =======================
let allReports = []; // This will hold the data from the database
const tableBody = document.getElementById("reportTableBody");

// NEW FUNCTION: Fetch reports from the server
async function fetchReports() {
    try {
        const response = await fetch('/api/reports');
        const data = await response.json();

        if (data.success) {
            allReports = data.reports; // Store the fetched reports
            populateTable(allReports); // Populate the table
        } else {
            console.error('Failed to load reports:', data.message);
        }
    } catch (error) {
        console.error('Network error fetching reports:', error);
    }
}

function populateTable(data) {
    if (!tableBody) return;
    tableBody.innerHTML = ""; // Clear existing table

    // --- (The rest of your populateTable function is the same) ---
    // (This dynamically creates the image modal)
    let imageModal = document.body.querySelector("#imageModal");
    if (!imageModal) {
        imageModal = document.createElement("div");
        imageModal.id = "imageModal";
        imageModal.className = "fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center hidden z-50";
        imageModal.innerHTML = `
          <div class="relative">
            <img id="modalImage" class="max-w-full max-h-[80vh] rounded shadow-lg" />
            <button onclick="this.closest('#imageModal').classList.add('hidden')" 
                    class="absolute top-0 right-0 m-2 text-white text-2xl font-bold bg-black bg-opacity-50 rounded-full w-8 h-8 flex items-center justify-center">&times;</button>
          </div>
        `;
        imageModal.onclick = e => { if (e.target === imageModal) imageModal.classList.add("hidden"); };
        document.body.appendChild(imageModal);
    }
    const modalImage = imageModal.querySelector("#modalImage");

    data.forEach((report, i) => {
        const tr = document.createElement("tr");
        tr.className = "hover:bg-gray-50 transition";
        
        // Helper for image cells
        const imgCell = (paths) => {
            if (!paths) return "-";
            // Handle multiple images (split by comma)
            const firstPath = paths.split(',')[0];
            return `
            <img src="${firstPath}"
            title="Click to view the photo"
            class="cursor-pointer w-24 h-16 object-cover rounded shadow-sm hover:shadow-md transition"
            data-img="${firstPath}"
            />
            `;
        };

        tr.innerHTML = `
            <td class="px-4 py-2 border font-mono">${report.trackingId}</td>
            <td class="px-4 py-2 border">${report.name || "Anonymous"}</td>
            <td class="px-4 py-2 border text-center">${imgCell(report.photo)}</td>
            <td class="px-4 py-2 border">${report.category}</td>

            <td class="px-4 py-2 border text-center">
                <button class="view-desc-btn bg-green-700 text-white px-3 py-1 rounded-md hover:bg-green-800 transition">
                    View
                </button>
            </td>

            <td class="px-4 py-2 border text-center">
                <button class="view-address-btn bg-green-700 text-white px-3 py-1 rounded-md hover:bg-green-800 transition"
                        data-address="${report.address}"
                        data-lat="${report.latitude}"
                        data-lng="${report.longitude}">
                    View
                </button>
            </td>

            <td class="px-4 py-2 border text-center">${imgCell(report.areaPhoto)}</td>
            <td class="px-4 py-2 border whitespace-nowrap">${report.date}</td>
            <td class="px-4 py-2 border">
                <select class="border rounded px-2 py-1" data-id="${report.trackingId}" data-type="status">
                    <option value="Pending" ${report.status==="Pending"?"selected":""}>Pending</option>
                    <option value="In Progress" ${report.status==="In Progress"?"selected":""}>In Progress</option>
                    <option value="Resolved" ${report.status==="Resolved"?"selected":""}>Resolved</option>
                </select>
            </td>
            <td class="px-4 py-2 border">
                <span class="w-24 inline-block text-center py-1 rounded-full font-semibold text-white 
                ${report.priority==='Emergency'?'bg-red-600':
                  report.priority==='High'?'bg-yellow-500':
                  'bg-green-600'}">
                  ${report.priority}
                </span>
            </td>
        `;
        tableBody.appendChild(tr);
    });

    // --- NEW: Status Update Logic (with API call) ---
    tableBody.querySelectorAll("select").forEach(select => {
        // This disables the dropdown if status is "Resolved"
        if (select.value === "Resolved") {
            select.disabled = true;
            select.classList.add("opacity-60", "cursor-not-allowed");
        }
        
        select.addEventListener("change", async (e) => {
            const trackingId = e.target.dataset.id;
            const newStatus = e.target.value;
            // Find the original status from our data array
            const oldValue = allReports.find(r => r.trackingId === trackingId).status;

            // 1. Show confirmation box
            const confirmed = confirm(`Are you sure you want to change status for ${trackingId} to "${newStatus}"?`);
            
            if (confirmed) {
                try {
                    // 2. Call the API
                    const response = await fetch(`/api/reports/${trackingId}/status`, {
                        method: 'PATCH',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ newStatus: newStatus })
                    });

                    const result = await response.json();

                    if (result.success) {
                        // 3. Success: Disable dropdown if "Resolved"
                        alert('Status updated successfully!');
                        if (newStatus === "Resolved") {
                            e.target.disabled = true;
                            e.target.classList.add("opacity-60", "cursor-not-allowed");
                        }
                        // Update the data in our local 'allReports' array
                        allReports.find(r => r.trackingId === trackingId).status = newStatus;
                    } else {
                        // 4. API Error: Revert the change
                        alert('Failed to update status: ' + result.message);
                        e.target.value = oldValue; // Revert
                    }

                } catch (error) {
                    // 5. Network Error: Revert the change
                    console.error('Network error:', error);
                    alert('A network error occurred. Please try again.');
                    e.target.value = oldValue; // Revert
                }
            } else {
                // 6. User clicked "Cancel": Revert the change
                e.target.value = oldValue; 
            }
        });
    });

    // Image modal Click
    tableBody.querySelectorAll("img[data-img]").forEach(img => img.onclick = e => { modalImage.src = e.target.dataset.img; imageModal.classList.remove("hidden"); });

    // --- Address Modal Click  ---
    const addressModal = document.getElementById('addressModal');
    const modalAddressText = document.getElementById('modalAddressText');

    tableBody.querySelectorAll('.view-address-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const address = btn.dataset.address;
            const lat = btn.dataset.lat;
            const lng = btn.dataset.lng;

            modalAddressText.textContent = address;

            addressModal.classList.remove('hidden');

            if (!mapInstance) {
                mapInstance = L.map('modalMap').setView([lat, lng], 16);
                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution: '© OpenStreetMap'
                }).addTo(mapInstance);
            } else {

                mapInstance.setView([lat, lng], 16);
            }

            L.marker([lat, lng]).addTo(mapInstance);

            setTimeout(() => {
                mapInstance.invalidateSize();
            }, 100);
        });
    });

    // Add close button logic
    document.getElementById('closeAddressModal').addEventListener('click', () => {
        addressModal.classList.add('hidden');
    });

    // --- Description Modal Click ---
        const descriptionModal = document.getElementById('descriptionModal');
        const modalDescriptionText = document.getElementById('modalDescriptionText');
        
        tableBody.querySelectorAll('.view-desc-btn').forEach((btn, index) => {
            btn.addEventListener('click', () => {
                const description = data[index].description;

                modalDescriptionText.textContent = description;
                
                descriptionModal.classList.remove('hidden');
            });
        });

        document.getElementById('closeDescriptionModal').addEventListener('click', () => {
            descriptionModal.classList.add('hidden');
        });
}



// --- Search and Filter  ---
const searchInput = document.getElementById("searchInput");
const dateRangeFilter = document.getElementById("dateRangeFilter");

// Helper function to get a date as a "YYYY-MM-DD" string
function getLocalISOString(date) {
    const year = date.getFullYear();
    // getMonth() is 0-indexed (0=Jan), so add 1
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
}

function applyFilters() {
    const searchTerm = searchInput.value.toLowerCase();
    const filterValue = dateRangeFilter.value;

    let filtered = allReports;

    if (searchTerm) {
        filtered = filtered.filter(r =>
            (r.name ? r.name.toLowerCase() : "anonymous").includes(searchTerm) ||
            r.category.toLowerCase().includes(searchTerm) ||
            r.trackingId.toLowerCase().includes(searchTerm) ||
            r.status.toLowerCase().includes(searchTerm) ||
            r.priority.toLowerCase().includes(searchTerm)
        );
    }

    if (filterValue !== "all-time") {
        const today = new Date();
        today.setHours(0, 0, 0, 0); 
        
        let startDate;

        if (filterValue === "today") {

            const todayString = getLocalISOString(today);
            filtered = filtered.filter(r => r.date === todayString);
        } else {
            switch (filterValue) {
                case "past-week":
                    startDate = new Date(today);
                    startDate.setDate(today.getDate() - 7);
                    break;
                case "past-month":
                    startDate = new Date(today);
                    startDate.setMonth(today.getMonth() - 1);
                    break;
                case "past-year":
                    startDate = new Date(today);
                    startDate.setFullYear(today.getFullYear() - 1);
                    break;
            }
            
            const startDateString = getLocalISOString(startDate);
            
            filtered = filtered.filter(r => r.date >= startDateString);
        }
    }

    populateTable(filtered);
}

if (searchInput) {
    searchInput.addEventListener("input", applyFilters);
}
if (dateRangeFilter) {
    dateRangeFilter.addEventListener("change", applyFilters);
}


// =======================
// DOWNLOAD MENU
// =======================
const downloadMenuBtn = document.getElementById('downloadMenuBtn');
const downloadMenu = document.getElementById('downloadMenu');

if (downloadMenuBtn) {
    downloadMenuBtn.addEventListener('click', () => {
        downloadMenu.classList.toggle('hidden');
    });

    // Optional: Hide menu when clicking outside
    document.addEventListener('click', (event) => {
        if (!downloadMenuBtn.contains(event.target) && !downloadMenu.contains(event.target)) {
            downloadMenu.classList.add('hidden');
        }
    });
}

// --- Helper function to get the date as YYYY-MM-DD ---
function getFormattedDate() {
    const today = new Date();
    // Use our local-aware function
    return getLocalISOString(today); 
}

// --- CSV Download ---
function downloadCSV() {
    const dateStr = getFormattedDate();
    const systemName = "E-Sumbong kay Kap! Barangay Pulong Buhangin";
    
    let csv = `${systemName}\n`;
    csv += `Submitted Reports as of ${dateStr}\n\n`;
    
    // Add the table headers
    csv += 'Tracking ID,Name,Category,Description,Address,Date Submitted,Status,Priority\n';
    
    // ** USE 'allReports' INSTEAD OF 'reports' **
    allReports.forEach(r => {
        // Make sure description is "CSV-safe" (in quotes)
        const description = `"${r.description.replace(/"/g, '""')}"`;
        const address = `"${r.address.replace(/"/g, '""')}"`;
        
        csv += `${r.trackingId},${r.name || 'Anonymous'},${r.category},${description},${address},${r.date},${r.status},${r.priority}\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `Barangay_Reports_${dateStr}.csv`;
    link.click();
    downloadMenu.classList.add('hidden');
}

// --- Excel Download ---
function downloadExcel() {
    const dateStr = getFormattedDate();
    const systemName = "E-Sumbong kay Kap! Barangay Pulong Buhangin";

    const wb = XLSX.utils.book_new();
    
    const wsData = [
        [systemName], 
        [`Submitted Reports as of ${dateStr}`], 
        [], 
        // Updated headers to include Address
        ["Tracking ID","Name","Category","Description","Address","Date Submitted","Status","Priority"] 
    ];
    
    // ** USE 'allReports' INSTEAD OF 'reports' **
    allReports.forEach(r => {
        wsData.push([r.trackingId, r.name || 'Anonymous', r.category, r.description, r.address, r.date, r.status, r.priority]);
    });

    const ws = XLSX.utils.aoa_to_sheet(wsData);
    
    // Column Widths
    ws['!cols'] = [
        { wch: 12 }, // Tracking ID
        { wch: 20 }, // Name
        { wch: 15 }, // Category
        { wch: 50 }, // Description
        { wch: 74 }, // Address 
        { wch: 15 }, // Date Submitted
        { wch: 12 }, // Status
        { wch: 10 }  // Priority
    ];

    // Merge header cells
    ws['!merges'] = [
        { s: { r: 0, c: 0 }, e: { r: 0, c: 7 } }, // Title (spans 8 cols)
        { s: { r: 1, c: 0 }, e: { r: 1, c: 7 } }  // Subtitle (spans 8 cols)
    ];

    XLSX.utils.book_append_sheet(wb, ws, "Reports");
    XLSX.writeFile(wb, `Barangay_Reports_${dateStr}.xlsx`);
    downloadMenu.classList.add('hidden');
}

// --- PDF Download ---
function downloadPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ orientation: 'landscape' }); // Use landscape for more columns
    const dateStr = getFormattedDate();
    const systemName = "E-Sumbong kay Kap! Barangay Pulong Buhangin";
    const systemColor = [34, 139, 34]; 

    // Add Logo (logoBase64 is from your logo_data.js)
    if (typeof logoBase64 !== 'undefined' && logoBase64) {
        doc.addImage(logoBase64, 'PNG', 14, 12, 24, 24); 
    }

    // Add Header Text
    doc.setFontSize(18);
    doc.setTextColor(systemColor[0], systemColor[1], systemColor[2]); 
    doc.text(systemName, 42, 20);
    doc.setFontSize(12);
    doc.setTextColor(100); 
    doc.text(`Submitted Reports as of ${dateStr}`, 42, 28); 

    // Updated headers
    const head = [["Tracking ID","Name","Category","Description","Address","Date Submitted","Status","Priority"]];
    
    // ** USE 'allReports' INSTEAD OF 'reports' **
    const body = allReports.map(r => [
        r.trackingId,
        r.name || 'Anonymous',
        r.category,
        r.description,
        r.address,
        r.date,
        r.status,
        r.priority
    ]);

    doc.autoTable({
        head,
        body,
        startY: 40, 
        headStyles: {
            fillColor: systemColor,
            textColor: 255,
            fontStyle: 'bold'
        },
        // Fit more content
        styles: { fontSize: 8 },
        columnStyles: {
            3: { cellWidth: 50 }, // Description
            4: { cellWidth: 50 }  // Address
        }
    });

    doc.save(`Barangay_Reports_${dateStr}.pdf`);
    downloadMenu.classList.add('hidden');
}

// =======================
// AUDIT LOG SECTION
// =======================
const auditLogData = [
  {
    timestamp: "2025-11-11 15:30:01",
    user: "admin",
    actionType: "LOGIN_SUCCESS",
    description: "Admin 'admin' successfully logged in."
  },
  {
    timestamp: "2025-11-11 15:31:05",
    user: "admin",
    actionType: "ANNOUNCEMENT_CREATE",
    description: "Created new announcement: 'Clean-up Drive this Weekend'"
  },
  {
    timestamp: "2025-11-11 15:32:14",
    user: "admin",
    actionType: "REPORT_STATUS_UPDATE",
    description: "Changed status of report TR-001 from 'Pending' to 'In Progress'"
  },
  {
    timestamp: "2025-11-11 15:35:20",
    user: "admin",
    actionType: "LOGIN_FAIL",
    description: "Failed login attempt for user 'guest'"
  }
];

const auditLogTableBody = document.getElementById('auditLogTableBody');
const auditLogSearchInput = document.getElementById('auditLogSearchInput');

// Fill the table with data
function populateAuditLog(data) {
  if (!auditLogTableBody) return; 

  auditLogTableBody.innerHTML = ""; 

  if (data.length === 0) {
    auditLogTableBody.innerHTML = `<tr><td colspan="4" class="text-center p-4">No log entries found.</td></tr>`;
    return;
  }

  data.forEach(log => {
    const tr = document.createElement('tr');
    tr.className = "hover:bg-gray-50 transition text-sm";
    tr.innerHTML = `
      <td class="px-4 py-2 border">${log.timestamp}</td>
      <td class="px-4 py-2 border">${log.user}</td>
      <td class="px-4 py-2 border font-mono">${log.actionType}</td>
      <td class="px-4 py-2 border">${log.description}</td>
    `;
    auditLogTableBody.appendChild(tr);
  });
}

// Search filter
if (auditLogSearchInput) {
  auditLogSearchInput.addEventListener("input", e => {
    const term = e.target.value.toLowerCase();
    const filtered = auditLogData.filter(log =>
        log.user.toLowerCase().includes(term) ||
        log.actionType.toLowerCase().includes(term) ||
        log.description.toLowerCase().includes(term)
    );
    populateAuditLog(filtered);
  });
}

