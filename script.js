// Render coin detail page
function renderCoinDetails(coinId){
  fetch(`https://api.coingecko.com/api/v3/coins/${coinId}?localization=false&market_data=true`)
    .then(r=>r.json())
    .then(data=>{
      document.getElementById('coinName').innerHTML = `<img src="${data.image.small}" style="height:25px;vertical-align:middle;margin-right:5px;"> ${data.name}`;
      document.getElementById('coinSymbol').innerText = `Symbol: ${data.symbol.toUpperCase()}`;
      document.getElementById('coinPrice').innerText = `$${data.market_data.current_price.usd.toLocaleString()}`;
      document.getElementById('coinMarketCap').innerText = `$${data.market_data.market_cap.usd.toLocaleString()}`;
      document.getElementById('coinVolume').innerText = `$${data.market_data.total_volume.usd.toLocaleString()}`;
      document.getElementById('coinSupply').innerText = `${data.market_data.circulating_supply.toLocaleString()}`;
      const change = data.market_data.price_change_percentage_24h;
      document.getElementById('coinChange').innerHTML = change>=0 
        ? `<span style="color:#238636">${change.toFixed(2)}%</span>`
        : `<span style="color:#e5534b">${change.toFixed(2)}%</span>`;

      // 7-day sparkline
      if(data.market_data.sparkline_7d && data.market_data.sparkline_7d.price){
        const sparkline = data.market_data.sparkline_7d.price.join(',');
        document.getElementById('coinSparkline').src = `https://quickchart.io/chart?c={type:'sparkline',data:{datasets:[{data:[${sparkline}]}]}}`;
      }

      // Description (HTML safe)
      document.getElementById('coinDesc').innerHTML = data.description.en ? data.description.en.split('. ').slice(0,3).join('. ') + '.' : '';
    })
    .catch(e=>{
      console.error(e);
      document.getElementById('coinName').innerText = "Failed to load coin data.";
    });
}
