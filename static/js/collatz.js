document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('collatzForm');
    const input = document.getElementById('numberInput');
    const submitBtn = document.getElementById('submitBtn');
    const loading = document.getElementById('loading');
    const results = document.getElementById('results');
    const stoppingTimeEl = document.getElementById('stoppingTime');
    const peakValueEl = document.getElementById('peakValue');
    
    let collatzChart = null; // Store chart instance
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const num = parseInt(input.value);
        if (isNaN(num) || num <= 0) return;
        
        // UI Update state
        submitBtn.disabled = true;
        loading.classList.remove('hidden');
        results.classList.add('hidden');
        
        try {
            const response = await fetch('/api/collatz', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ number: num })
            });
            
            const data = await response.json();
            
            if (response.ok) {
                // Tampilkan hasil teks
                stoppingTimeEl.textContent = data.stopping_time;
                peakValueEl.textContent = data.peak;
                results.classList.remove('hidden');
                
                // Render Grafik
                renderChart(data.sequence);
            } else {
                alert(data.error || 'Terjadi kesalahan saat menghitung.');
            }
        } catch (error) {
            console.error('Error fetching Collatz:', error);
            alert('Gagal menghubungi server.');
        } finally {
            submitBtn.disabled = false;
            loading.classList.add('hidden');
        }
    });
    
    function renderChart(sequence) {
        const ctx = document.getElementById('collatzChart').getContext('2d');
        
        // Hancurkan chart lama jika ada
        if (collatzChart) {
            collatzChart.destroy();
        }
        
        const labels = sequence.map((_, index) => index);
        
        collatzChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Nilai Barisan',
                    data: sequence,
                    borderColor: '#F4B400', // Warna Emas UM
                    backgroundColor: 'rgba(244, 180, 0, 0.1)',
                    borderWidth: 2,
                    pointBackgroundColor: '#002B5B', // Biru UM
                    pointBorderColor: '#F4B400',
                    pointRadius: sequence.length > 50 ? 0 : 3, // Sembunyikan titik jika data terlalu banyak
                    fill: true,
                    tension: 0.1 // Sedikit kurva
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        callbacks: {
                            title: (ctx) => `Langkah: ${ctx[0].label}`,
                            label: (ctx) => `Nilai: ${ctx.raw}`
                        }
                    }
                },
                scales: {
                    x: {
                        title: { display: true, text: 'Langkah', color: '#94A3B8' },
                        ticks: { color: '#94A3B8' },
                        grid: { color: '#334155' }
                    },
                    y: {
                        title: { display: true, text: 'Nilai', color: '#94A3B8' },
                        ticks: { color: '#94A3B8' },
                        grid: { color: '#334155' }
                    }
                }
            }
        });
    }
});
