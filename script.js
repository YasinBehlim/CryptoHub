let allCoins=[];

// Fetch top 100 coins for search / tracker
fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&per_page=100')
.then(r=>r.json())
.then(data=>allCoins=data);

// Coin price search function (for Home & Live Tracker)
function checkPrice(inputId, outputId){
  const q=document.getElementById(inputId).value.toLowerCase();
  const coin=allCoins.find(c=>c.id.toLowerCase()===q || c.symbol.toLowerCase()===q);
  document.getElementById(outputId).innerHTML=coin?`${coin.name}: $${coin.current_price}`:'Coin not found';
}

// Top Gainers / Losers function
function sortCoins(desc=true){
  if(!allCoins.length) return [];
  return allCoins.slice().sort((a,b)=>desc?(b.price_change_percentage_24h-a.price_change_percentage_24h):(a.price_change_percentage_24h-b.price_change_percentage_24h));
}

// Helper for color formatting
function colorText(value){
  return value>=0?`<span style="color:#238636">${value.toFixed(2)}%</span>`:`<span style="color:#e5534b">${value.toFixed(2)}%</span>`;
}
