let allCoins = [];

// Fetch top 100 coins for search / tracker
fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&per_page=100')
.then(r => r.json())
.then(data => {
    allCoins = data;
    // Enable search buttons after coins load
    document.querySelectorAll('button[data-coin-btn]').forEach(btn => btn.disabled = false);

    // Auto populate Top Gainers / Losers if their tables exist
    if(document.getElementById('topGainers') || document.getElementById('topLosers')){
        renderGainersLosers();
    }

    // Auto populate Live Table if exists
    if(document.getElementById('coinsTable')){
        renderTopCoins('coinsTable');
    }
});

// -------------------
// Live Coin Price Search
// -------------------
function checkPrice(inputId, outputId){
    if(!allCoins.length){
        alert("Coins still loading, please wait a moment.");
        return;
    }
    const q = document.getElementById(inputId).value.toLowerCase();
    const coin = allCoins.find(c => c.id.toLowerCase() === q || c.symbol.toLowerCase() === q);
    document.getElementById(outputId).innerHTML = coin 
        ? `${coin.name}: $${coin.current_price.toLocaleString()}`
        : 'Coin not found';
}

// -------------------
// Top Gainers / Losers Table
// -------------------
function sortCoins(desc=true){
    if(!allCoins.length) return [];
    return allCoins.slice().sort((a,b)=> desc 
        ? b.price_change_percentage_24h - a.price_change_percentage_24h
        : a.price_change_percentage_24h - b.price_change_percentage_24h);
}

function renderTopCoins(tableId, limit=50){
    if(!allCoins.length) return;

    const table = document.getElementById(tableId);
    if(!table) return;

    table.innerHTML = `
        <tr>
            <th>#</th>
            <th>Coin</th>
            <th>Price (USD)</th>
            <th>24h Change</th>
        </tr>
    `;

    allCoins.slice(0, limit).forEach((coin, i) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${i+1}</td>
            <td>${coin.name} (${coin.symbol.toUpperCase()})</td>
            <td>$${coin.current_price.toLocaleString()}</td>
            <td>${colorText(coin.price_change_percentage_24h)}</td>
        `;
        table.appendChild(row);
    });
}

// -------------------
// Render Gainers / Losers
// -------------------
function renderGainersLosers(){
    if(!allCoins.length) return;
    const gainers = sortCoins(true).slice(0,10);
    const losers = sortCoins(false).slice(0,10);

    const gTable = document.getElementById('topGainers')?.querySelector('tbody');
    if(gTable){
        gTable.innerHTML = '';
        gainers.forEach(c=>{
            const tr = document.createElement('tr');
            tr.innerHTML = `<td>${c.name} (${c.symbol.toUpperCase()})</td>
            <td>$${c.current_price.toLocaleString()}</td>
            <td>${colorText(c.price_change_percentage_24h)}</td>`;
            gTable.appendChild(tr);
        });
    }

    const lTable = document.getElementById('topLosers')?.querySelector('tbody');
    if(lTable){
        lTable.innerHTML = '';
        losers.forEach(c=>{
            const tr = document.createElement('tr');
            tr.innerHTML = `<td>${c.name} (${c.symbol.toUpperCase()})</td>
            <td>$${c.current_price.toLocaleString()}</td>
            <td>${colorText(c.price_change_percentage_24h)}</td>`;
            lTable.appendChild(tr);
        });
    }
}

// -------------------
// Helper: Color text for positive/negative
// -------------------
function colorText(value){
    return value >= 0 
        ? `<span style="color:#4ade80">${value.toFixed(2)}%</span>` 
        : `<span style="color:#f87171">${value.toFixed(2)}%</span>`;
}

// -------------------
// ROI Calculator (Staking / Mining)
function calculateROI(){
    const p=+document.getElementById('coinPrice')?.value;
    const amt=+document.getElementById('amount')?.value;
    const r=+document.getElementById('stakingReward')?.value;
    const t=+document.getElementById('period')?.value;

    if(!p||!amt||!r||!t){ 
        document.getElementById('roiResult').innerText='Please fill all fields'; 
        return; 
    }
    const roi = amt*p*((r/100)*t);
    document.getElementById('roiResult').innerHTML = `Estimated ROI: <strong style="color:#4ade80">$${roi.toFixed(2)}</strong>`;
}

// -------------------
// Auto refresh prices every 60 seconds
setInterval(()=>{
    if(allCoins.length){
        document.querySelectorAll('input[data-live-input]').forEach(input=>{
            const outputId = input.dataset.output;
            checkPrice(input.id, outputId);
        });
        renderGainersLosers();
        renderTopCoins('coinsTable');
    }
}, 60000);
