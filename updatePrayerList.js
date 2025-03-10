document.getElementById('submit').addEventListener('click', function() {
    const prayer = document.getElementById('prayer').value;
    const name = document.getElementById('name').value || '';
    const email = document.getElementById('email').value || '';
    const church = document.getElementById('church').value || '';
    const dateTime = new Date().toLocaleDateString(); // Get date without time

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
                `;
                prayerList.insertBefore(li, prayerList.firstChild); // Insert at the beginning
            });
        })
        .catch(error => console.error('Error:', error));
}

// Initialize the prayer list on page load
document.addEventListener('DOMContentLoaded', updatePrayerList);