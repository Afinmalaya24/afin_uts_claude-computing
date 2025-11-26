// Data Storage
let bookingData = [];
let deferredPrompt;

// Load Data
function loadData() {
    const saved = localStorage.getItem('vincare_bookings');
    if (saved) {
        bookingData = JSON.parse(saved);
        displayRiwayat();
    }
}

// Save Data
function saveData() {
    localStorage.setItem('vincare_bookings', JSON.stringify(bookingData));
}

// Show Loading
function showLoading() {
    document.getElementById('loading').classList.add('active');
}
function hideLoading() {
    document.getElementById('loading').classList.remove('active');
}

// Toast Notification
function showToast(message, type = 'success') {
    const toastHtml = `
        <div class="toast align-items-center text-white bg-${type} border-0" role="alert">
            <div class="d-flex">
                <div class="toast-body">
                    <i class="bi bi-check-circle"></i> ${message}
                </div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
            </div>
        </div>
    `;
    const container = document.querySelector('.toast-container');
    container.innerHTML = toastHtml;
    const toastEl = container.querySelector('.toast');
    const toast = new bootstrap.Toast(toastEl);
    toast.show();
}

// Tab Navigation
function showTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(tab => tab.style.display = 'none');
    document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));

    document.getElementById(tabName).style.display = 'block';
    document.querySelector(`a[href="#${tabName}"]`).classList.add('active');
}

// Handle Booking Submit
document.getElementById('bookingForm').addEventListener('submit', function(e) {
    e.preventDefault();
    showLoading();

    setTimeout(() => {
        const booking = {
            id: Date.now(),
            nama: document.getElementById('nama').value,
            telp: document.getElementById('telp').value,
            jenisHp: document.getElementById('jenisHp').value,
            jenisService: document.getElementById('jenisService').value,
            pembayaran: document.getElementById('pembayaran').value,
            catatan: document.getElementById('catatan').value,
            tanggal: new Date().toLocaleDateString('id-ID'),
            status: 'Menunggu',
            rating: 0
        };

        bookingData.push(booking);
        saveData();
        displayRiwayat();
        this.reset();

        hideLoading();
        showToast('Booking berhasil disimpan!');
        showTab('riwayat');
    }, 800);
});

// Display Riwayat
function displayRiwayat() {
    const container = document.getElementById('riwayatList');

    if (bookingData.length === 0) {
        container.innerHTML = `
            <div class="text-center text-muted py-5">
                <i class="bi bi-inbox" style="font-size: 3rem;"></i>
                <p class="mt-3">Belum ada riwayat booking</p>
            </div>
        `;
        return;
    }

    container.innerHTML = bookingData.map(item => `
        <div class="service-item">
            <div class="row align-items-center">
                <div class="col-md-8">
                    <h5><i class="bi bi-person"></i> ${item.nama}</h5>
                    <p class="mb-1"><strong>${item.jenisHp}</strong> - ${item.jenisService}</p>
                    <p class="text-muted mb-1"><i class="bi bi-calendar"></i> ${item.tanggal}</p>
                    <p class="mb-1"><i class="bi bi-credit-card"></i> ${item.pembayaran}</p>
                    <span class="badge bg-warning">${item.status}</span>
                </div>
                <div class="col-md-4 text-end">
                    <button class="btn btn-sm btn-primary" onclick="rateService(${item.id})">
                        <i class="bi bi-star"></i> Beri Rating
                    </button>
                    <div class="rating mt-2" id="rating-${item.id}">
                        ${item.rating > 0 ? '⭐'.repeat(item.rating) : 'Belum diberi rating'}
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

// Rating
function rateService(id) {
    const rating = prompt('Berikan rating (1-5):');
    if (rating >= 1 && rating <= 5) {
        const item = bookingData.find(b => b.id === id);
        if (item) {
            item.rating = parseInt(rating);
            item.status = 'Selesai';
            saveData();
            displayRiwayat();
            showToast('Terima kasih atas rating Anda!');
        }
    }
}

// PWA Install
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
});

function showInstallPrompt() {
    if (deferredPrompt) {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then((res) => {
            if (res.outcome === 'accepted') showToast('Aplikasi berhasil diinstall!');
            deferredPrompt = null;
        });
    } else {
        showToast('Aplikasi sudah terinstall atau browser tidak mendukung', 'info');
    }
}

// Register Service Worker (data URL)
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('data:text/javascript;base64,c2VsZi5hZGRFdmVudExpc3RlbmVyKCdpbnN0YWxsJywgZnVuY3Rpb24oZXZlbnQpIHsKICBldmVudC53YWl0VW50aWwoCiAgICBjYWNoZXMub3BlbigndmluY2FyZS12MScpLnRoZW4oZnVuY3Rpb24oY2FjaGUpIHsKICAgICAgcmV0dXJuIGNhY2hlLmFkZEFsbChbJy8nXSk7CiAgICB9KQogICk7Cn0pOwoKc2VsZi5hZGRFdmVudExpc3RlbmVyKCdmZXRjaCcsIGZ1bmN0aW9uKGV2ZW50KSB7CiAgZXZlbnQucmVzcG9uZFdpdGgoCiAgICBjYWNoZXMubWF0Y2goZXZlbnQucmVxdWVzdCkudGhlbihmdW5jdGlvbihyZXNwb25zZSkgewogICAgICByZXR1cm4gcmVzcG9uc2UgfHwgZmV0Y2goZXZlbnQucmVxdWVzdCk7CiAgICB9KQogICk7Cn0pOw==');
}

// Init
loadData();
