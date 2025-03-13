document.getElementById('submit').addEventListener('click', function() {
    const prayer = document.getElementById('prayer').value;
    const name = document.getElementById('name').value || '';
    const email = document.getElementById('email').value || '';
    const church = document.getElementById('church').value || '';
    const dateTime = new Date().toLocaleDateString();

    if (prayer) {
        fetch('http://localhost:3000/prayers', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ prayer, name, email, church, dateTime })
        })
        .then(response => response.json())
        .then(data => {
            updatePrayerList();
            document.getElementById('prayer').value = '';
            document.getElementById('name').value = '';
            document.getElementById('email').value = '';
            document.getElementById('church').value = '';
        })
        .catch(error => console.error('Error:', error));
    }
});

function updatePrayerList() {
    fetch('http://localhost:3000/prayers')
        .then(response => response.json())
        .then(prayers => {
            const prayerList = document.getElementById('prayerList');
            prayerList.innerHTML = '';

            prayers.forEach(prayer => {
                const li = document.createElement('li');
                li.innerHTML = `
                    <div class="prayer-text">${prayer.prayer}</div>
                    <div class="prayer-details">
                        ${prayer.name ? `<span class="prayer-name">${prayer.name}</span>` : ''}
                        ${prayer.email ? `<span class="prayer-email">${prayer.email}</span>` : ''}
                        ${prayer.church ? `<span class="prayer-church">${prayer.church}</span>` : ''}
                        <span class="prayer-date">${prayer.dateTime}</span>
                    </div>
                    <div class="prayer-actions">
                        <button class="prayer-action" data-id="${prayer.id}">
                            <i class="fa-solid fa-hands-praying"></i> I Prayed for This
                        </button>
                        <span class="prayedCounter">${prayer.prayedCounter || 0} prayers</span>
                    </div>
                `;

                const button = li.querySelector('.prayer-action');
                const counter = li.querySelector('.prayedCounter');

                // Check if user has already prayed (store in localStorage)
                if (localStorage.getItem(`prayed_${prayer.id}`)) {
                    button.textContent = "THANKS FOR PRAYING";
                    button.disabled = true;
                    button.classList.add("prayer-action-disabled"); // Optional if you want an additional class
                    button.style.backgroundColor = "#28a745"; // Green success color
                    button.style.color = "white"; 
                    button.style.cursor = "default"; 
                    button.style.pointerEvents = "none"; // Prevents any further interaction
                }

                button.addEventListener('click', () => {
                    const id = button.getAttribute('data-id');
                    let currentCount = parseInt(counter.textContent) || 0;
                    let newCount = currentCount + 1;

                    // Send update request to backend
                    fetch(`http://localhost:3000/prayers/${id}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ prayedCounter: newCount })
                    })
                    .then(response => response.json())
                    .then(updatedPrayer => {
                        counter.textContent = `${updatedPrayer.prayedCounter} prayers`;
                        counter.style.color = "#28a745"; // Highlight updated counter
                        
                        // Change button text and disable it
                        button.textContent = "THANKS FOR PRAYING";
                        button.disabled = true;
                        button.style.backgroundColor = "#28a745"; // Green color for success

                        // Store in localStorage to prevent multiple clicks
                        localStorage.setItem(`prayed_${prayer.id}`, true);
                    })
                    .catch(error => console.error('Error:', error));
                });

                prayerList.insertBefore(li, prayerList.firstChild);
            });
        })
        .catch(error => console.error('Error:', error));
}

// Initialize the prayer list on page load
document.addEventListener('DOMContentLoaded', updatePrayerList);

// Initialize the prayer list on page load
document.addEventListener('DOMContentLoaded', updatePrayerList);