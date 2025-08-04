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
  const item = products.find(p => p.name.toLowerCase() === searchTerm);
  
  if (item) {
    document.getElementById('item-name').textContent = item.name;
    document.getElementById('current-stock').textContent = item.stock || 0;
    document.getElementById('item-details').style.display = 'block';
  } else {
    alert('Item not found');
  }
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
