let products = [];

// Load products on page load
window.onload = function() {
  fetch('../products.json')
    .then(response => response.json())
    .then(data => {
      products = data;
      populateDatalist();
    })
    .catch(err => console.error('Error loading products:', err));
};

function populateDatalist() {
  const datalist = document.getElementById('item-list');
  datalist.innerHTML = '';
  products.forEach(p => {
    const option = document.createElement('option');
    option.value = p.name;
    datalist.appendChild(option);
  });
}

function searchItem() {
  const searchTerm = document.getElementById('search-item').value.trim().toLowerCase();
  
  // If empty search term, clear the display
  if (!searchTerm) {
    document.getElementById('item-details').style.display = 'none';
    return;
  }

  // Find items that match (case insensitive partial match)
  const matchedItems = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm)
  );

  // If exactly one match found, show it
  if (matchedItems.length === 1) {
    const item = matchedItems[0];
    showItemDetails(item);
  } 
  // If multiple matches, let user select
  else if (matchedItems.length > 1) {
    showSearchResults(matchedItems);
  } 
  // No matches found
  else {
    document.getElementById('item-details').style.display = 'none';
    document.getElementById('search-results').innerHTML = `
      <div class="error">Item not found. Please check spelling.</div>
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
    <div class="search-result" onclick="selectSearchResult('${item.name}')">
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
  searchItem(); // This will now find the exact match
}

function updateStock() {
  const itemName = document.getElementById('search-item').value.trim();
  const addAmount = parseInt(document.getElementById('add-stock').value) || 0;
  
  if (addAmount <= 0) {
    alert('Please enter a valid amount');
    return;
  }
  
  const itemIndex = products.findIndex(p => p.name.toLowerCase() === itemName.toLowerCase());
  
  if (itemIndex !== -1) {
    // Update in memory
    products[itemIndex].stock = (products[itemIndex].stock || 0) + addAmount;
    
    // Update display
    document.getElementById('current-stock').textContent = products[itemIndex].stock;
    
    // TODO: Save back to products.json (we'll implement this next)
    alert(`Added ${addAmount} to stock. New stock: ${products[itemIndex].stock}`);
  }
}
