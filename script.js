let products = [];

// Load products on page load
window.onload = function() {
  fetch('../products.json')
    .then(response => response.json())
    .then(data => {
      products = data;
      populateDatalist();
    })
    .catch(err => {
      console.error('Error loading products:', err);
      alert('Failed to load products. Please check console for details.');
    });
};

function populateDatalist() {
  const datalist = document.getElementById('item-list');
  datalist.innerHTML = '';
  
  const uniqueNames = [...new Set(products.map(p => p.name))];
  
  uniqueNames.forEach(name => {
    const option = document.createElement('option');
    option.value = name;
    datalist.appendChild(option);
  });
}

function searchItem() {
  const searchTerm = document.getElementById('search-item').value.trim().toLowerCase();
  
  if (!searchTerm) {
    document.getElementById('item-details').style.display = 'none';
    document.getElementById('search-results').innerHTML = '';
    return;
  }

  const matchedItems = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm)
  );

  if (matchedItems.length === 1) {
    showItemDetails(matchedItems[0]);
  } 
  else if (matchedItems.length > 1) {
    showSearchResults(matchedItems);
  } 
  else {
    document.getElementById('item-details').style.display = 'none';
    document.getElementById('search-results').innerHTML = `
      <div class="error">Item not found. Please check spelling or try a different term.</div>
    `;
  }
}

function showItemDetails(item) {
  document.getElementById('item-name').textContent = item.name;
  document.getElementById('current-stock').textContent = item.stock || 0;
  document.getElementById('item-details').style.display = 'block';
  document.getElementById('search-results').innerHTML = '';
}

function showSearchResults(items) {
  const resultsHTML = items.map(item => `
    <div class="search-result" onclick="selectSearchResult('${item.name.replace(/'/g, "\\'")}')">
      ${item.name} (Stock: ${item.stock || 0})
    </div>
  `).join('');

  document.getElementById('search-results').innerHTML = `
    <h3>Multiple matches found:</h3>
    ${resultsHTML}
  `;
}

function selectSearchResult(itemName) {
  document.getElementById('search-item').value = itemName;
  searchItem();
}

function updateStock() {
  const itemName = document.getElementById('search-item').value.trim();
  const addAmount = parseInt(document.getElementById('add-stock').value) || 0;
  
  if (addAmount <= 0) {
    alert('Please enter a valid amount (1 or more)');
    return;
  }
  
  const itemIndex = products.findIndex(p => p.name.toLowerCase() === itemName.toLowerCase());
  
  if (itemIndex !== -1) {
    products[itemIndex].stock = (products[itemIndex].stock || 0) + addAmount;
    document.getElementById('current-stock').textContent = products[itemIndex].stock;
    alert(`Added ${addAmount} to stock. New stock: ${products[itemIndex].stock}`);
  } else {
    alert('Item not found. Please search again.');
  }
}

// Add event listener for Enter key
document.getElementById('search-item').addEventListener('keypress', function(e) {
  if (e.key === 'Enter') {
    searchItem();
  }
});
