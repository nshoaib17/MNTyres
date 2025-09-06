(() => {
  // View IDs
  const VIEW_HOME_ID = 'view-home';
  const VIEW_STOCK_ID = 'view-stock';
  const VIEW_SALES_ID = 'view-sales';
  const VIEW_SETTINGS_ID = 'view-settings';
  const VIEW_REPORTS_ID = 'view-reports';
  const VIEW_CALENDAR_ID = 'view-calendar';
  
  const STORAGE_KEYS = {
    stock: 'MNTyres.stock',
    sales: 'MNTyres.sales',
    settings: 'MNTyres.settings'
  };

  let currentSalesView = null;

  // View switching
  function switchView(viewId) {
    for (const section of document.querySelectorAll('.view')) {
      section.classList.toggle('active', section.id === viewId);
    }
    
    // Reset sales view when switching away
    if (viewId !== VIEW_SALES_ID) {
      currentSalesView = null;
      hideAllSalesViews();
    }
  }

  // Sales view management
  function showSalesView(viewName) {
    hideAllSalesViews();
    currentSalesView = viewName;
    
    if (viewName === 'create') {
      document.getElementById('create-sale-view').style.display = 'block';
    } else if (viewName === 'service') {
      document.getElementById('create-service-view').style.display = 'block';
    } else if (viewName === 'records') {
      document.getElementById('sales-records-view').style.display = 'block';
      renderSalesTable();
    }
  }

  function hideAllSalesViews() {
    document.querySelectorAll('.sales-view').forEach(view => {
      view.style.display = 'none';
    });
  }

  // Data access
  function loadStock() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.stock) || '[]');
    } catch {
      return [];
    }
  }

  function saveStock(stock) {
    localStorage.setItem(STORAGE_KEYS.stock, JSON.stringify(stock));
  }

  function loadSales() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.sales) || '[]');
    } catch {
      return [];
    }
  }

  function saveSales(sales) {
    localStorage.setItem(STORAGE_KEYS.sales, JSON.stringify(sales));
  }

  function loadSettings() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.settings) || '{}');
    } catch {
      return {};
    }
  }

  function saveSettings(settings) {
    localStorage.setItem(STORAGE_KEYS.settings, JSON.stringify(settings));
  }

  // Brand management
  function loadBrands() {
    try {
      return JSON.parse(localStorage.getItem('MNTyres.brands') || '[]');
    } catch {
      return [];
    }
  }

  function saveBrands(brands) {
    localStorage.setItem('MNTyres.brands', JSON.stringify(brands));
  }

  function addBrand(brandName) {
    const brands = loadBrands();
    const normalizedName = brandName.trim();
    
    // Check if brand already exists
    if (brands.some(brand => brand.toLowerCase() === normalizedName.toLowerCase())) {
      return false; // Brand already exists
    }
    
    brands.push(normalizedName);
    saveBrands(brands);
    return true;
  }

  function populateBrandDropdowns() {
    const brands = loadBrands();
    const stockBrandSelect = document.getElementById('tyre-brand');
    const saleBrandSelect = document.getElementById('sale-brand');
    
    // Clear existing options (keep first option)
    if (stockBrandSelect) {
      stockBrandSelect.innerHTML = '<option value="">Select a brand...</option>';
      brands.forEach(brand => {
        const option = document.createElement('option');
        option.value = brand;
        option.textContent = brand;
        stockBrandSelect.appendChild(option);
      });
    }
    
    // Also update sale brand dropdown if it exists
    if (saleBrandSelect) {
      saleBrandSelect.innerHTML = '<option value="">Select a brand...</option>';
      brands.forEach(brand => {
        const option = document.createElement('option');
        option.value = brand;
        option.textContent = brand;
        saleBrandSelect.appendChild(option);
      });
    }
  }

  function initializeDefaultBrands() {
    const brands = loadBrands();
    if (brands.length === 0) {
      // Add some common tyre brands
      const defaultBrands = [
        'Fronway',
        'Banoze',
        'Farroad',
        'Centara',
        'Saferich',
        'Dynamo',
        'Invovic',
        'Zmax',
        'Admiral',
        'Churchill'
      ].sort((a, b) => a.localeCompare(b));
      
      defaultBrands.forEach(brand => addBrand(brand));
      console.log('Default brands initialized');
    }
  }

  // Sales Person management
  function loadSalesPeople() {
    try {
      return JSON.parse(localStorage.getItem('MNTyres.salesPeople') || '[]');
    } catch {
      return [];
    }
  }

  function saveSalesPeople(salesPeople) {
    localStorage.setItem('MNTyres.salesPeople', JSON.stringify(salesPeople));
  }

  function addSalesPerson(personName) {
    const salesPeople = loadSalesPeople();
    const normalizedName = personName.trim();
    
    // Check if sales person already exists
    if (salesPeople.some(person => person.toLowerCase() === normalizedName.toLowerCase())) {
      return false; // Sales person already exists
    }
    
    salesPeople.push(normalizedName);
    saveSalesPeople(salesPeople);
    return true;
  }

  function populateSalesPersonDropdown() {
    const salesPeople = loadSalesPeople();
    const salesPersonSelect = document.getElementById('sale-person');
    const serviceSalesPersonSelect = document.getElementById('service-sales-person');
    
    // Populate regular sales person dropdown
    if (salesPersonSelect) {
      // Clear existing options (keep first option)
      salesPersonSelect.innerHTML = '<option value="">Select sales person...</option>';
      salesPeople.forEach(person => {
        const option = document.createElement('option');
        option.value = person;
        option.textContent = person;
        salesPersonSelect.appendChild(option);
      });
    }
    
    // Populate service sales person dropdown
    if (serviceSalesPersonSelect) {
      // Clear existing options (keep first option)
      serviceSalesPersonSelect.innerHTML = '<option value="">Select sales person...</option>';
      salesPeople.forEach(person => {
        const option = document.createElement('option');
        option.value = person;
        option.textContent = person;
        serviceSalesPersonSelect.appendChild(option);
      });
    }
  }

  function initializeDefaultSalesPeople() {
    const salesPeople = loadSalesPeople();
    if (salesPeople.length === 0) {
      // Add some default sales people
      const defaultSalesPeople = [
        'Siar Raufi',
        'Wahid Noristany'
      ].sort((a, b) => a.localeCompare(b));
      
      defaultSalesPeople.forEach(person => addSalesPerson(person));
      console.log('Default sales people initialized');
    }
  }

  // Modal management
  function showAddBrandModal() {
    const modal = document.getElementById('add-brand-modal');
    const form = document.getElementById('add-brand-form');
    const input = document.getElementById('new-brand-name');
    
    modal.style.display = 'flex';
    input.focus();
    
    // Clear previous form data
    form.reset();
  }

  function hideAddBrandModal() {
    const modal = document.getElementById('add-brand-modal');
    modal.style.display = 'none';
  }

  function setupBrandModal() {
    const addBrandBtn = document.getElementById('add-brand-btn');
    const modal = document.getElementById('add-brand-modal');
    const closeBtn = document.getElementById('close-brand-modal');
    const cancelBtn = document.getElementById('cancel-add-brand');
    const form = document.getElementById('add-brand-form');
    
    // Open modal
    addBrandBtn.addEventListener('click', showAddBrandModal);
    
    // Close modal
    closeBtn.addEventListener('click', hideAddBrandModal);
    cancelBtn.addEventListener('click', hideAddBrandModal);
    
    // Close modal when clicking outside
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        hideAddBrandModal();
      }
    });
    
    // Handle form submission
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const brandName = document.getElementById('new-brand-name').value.trim();
      
      if (!brandName) {
        alert('Please enter a brand name');
        return;
      }
      
      if (addBrand(brandName)) {
        alert(`Brand "${brandName}" added successfully!`);
        populateBrandDropdowns();
        hideAddBrandModal();
      } else {
        alert(`Brand "${brandName}" already exists!`);
      }
    });
  }

  // Sales Person Modal management
  function showAddSalesPersonModal() {
    const modal = document.getElementById('add-sales-person-modal');
    const form = document.getElementById('add-sales-person-form');
    const input = document.getElementById('new-sales-person-name');
    
    modal.style.display = 'flex';
    input.focus();
    
    // Clear previous form data
    form.reset();
  }

  function hideAddSalesPersonModal() {
    const modal = document.getElementById('add-sales-person-modal');
    modal.style.display = 'none';
  }

  function setupSalesPersonModal() {
    const addSalesPersonBtn = document.getElementById('add-sales-person-btn');
    const addServiceSalesPersonBtn = document.getElementById('add-service-sales-person-btn');
    const modal = document.getElementById('add-sales-person-modal');
    const closeBtn = document.getElementById('close-sales-person-modal');
    const cancelBtn = document.getElementById('cancel-add-sales-person');
    const form = document.getElementById('add-sales-person-form');
    
    // Open modal
    addSalesPersonBtn.addEventListener('click', showAddSalesPersonModal);
    addServiceSalesPersonBtn.addEventListener('click', showAddSalesPersonModal);
    
    // Close modal
    closeBtn.addEventListener('click', hideAddSalesPersonModal);
    cancelBtn.addEventListener('click', hideAddSalesPersonModal);
    
    // Close modal when clicking outside
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        hideAddSalesPersonModal();
      }
    });
    
    // Handle form submission
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const personName = document.getElementById('new-sales-person-name').value.trim();
      
      if (!personName) {
        alert('Please enter a sales person name');
        return;
      }
      
      if (addSalesPerson(personName)) {
        alert(`Sales person "${personName}" added successfully!`);
        populateSalesPersonDropdown();
        hideAddSalesPersonModal();
      } else {
        alert(`Sales person "${personName}" already exists!`);
      }
    });
  }

  // Stock management
  function addStockItem(item) {
    const stock = loadStock();
    stock.push(item);
    saveStock(stock);
  }

  function deleteStockItem(id) {
    const stock = loadStock();
    const itemToDelete = stock.find(item => item.id === id);
    
    if (!itemToDelete) return;
    
    // Show reason selection modal
    const reason = prompt('Please select reason for deletion:\n1. Wrong Size Entered\n2. Return of Stock\n3. Other\n\nEnter number (1-3):');
    
    if (reason === null) return; // User cancelled
    
    let reasonText = '';
    switch(reason) {
      case '1':
        reasonText = 'Wrong Size Entered';
        break;
      case '2':
        reasonText = 'Return of Stock';
        break;
      case '3':
        reasonText = 'Other';
        break;
      default:
        alert('Invalid selection. Please try again.');
        return;
    }

    if (confirm(`Are you sure you want to delete this stock item?\nReason: ${reasonText}`)) {
      // Add to stock history for audit before deletion
      addStockHistoryEntry(
        itemToDelete.size,
        itemToDelete.brand,
        itemToDelete.quantity,
        itemToDelete.netPrice,
        'deletion',
        reasonText
      );
      
      // Remove from stock array
      const updatedStock = stock.filter((row) => row.id !== id);
      saveStock(updatedStock);
    }
  }

  function updateStockQuantity(size, brand, quantityToSubtract) {
    const stock = loadStock();
    const item = stock.find(item => item.size === size && item.brand === brand);
    if (item && item.quantity >= quantityToSubtract) {
      item.quantity -= quantityToSubtract;
      
      // Don't add history entry for sales - they'll be shown from sales records
      
      saveStock(stock);
      return true;
    }
    return false;
  }

  function restoreStockQuantity(size, brand, quantityToRestore) {
    const stock = loadStock();
    const item = stock.find(item => item.size === size && item.brand === brand);
    if (item) {
      item.quantity += quantityToRestore;
      saveStock(stock);
      return true;
    }
    return false;
  }

  // Sales management
  function createSale(saleData) {
    const sales = loadSales();
    const saleNumber = getNextSaleNumber();
    const sale = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      saleNumber: saleNumber,
      ...saleData,
      status: 'completed',
      createdAt: new Date().toISOString(),
      total: (saleData.fittingPrice * saleData.quantity)
    };
    
    sales.push(sale);
    saveSales(sales);
    
    // Update stock
    updateStockQuantity(saleData.size, saleData.brand, saleData.quantity);
    
    // Update reports if we're on the reports view
    if (document.getElementById('view-reports').classList.contains('active')) {
      updateReportsDisplay();
    }
    
    return sale;
  }

  function createService(serviceData) {
    const sales = loadSales();
    const saleNumber = getNextSaleNumber();
    const service = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      saleNumber: saleNumber,
      ...serviceData,
      type: 'service', // Mark as service type
      status: 'completed',
      createdAt: new Date().toISOString(),
      total: serviceData.price
    };
    
    sales.push(service);
    saveSales(sales);
    
    // Update reports if we're on the reports view
    if (document.getElementById('view-reports').classList.contains('active')) {
      updateReportsDisplay();
    }
    
    return service;
  }

  function cancelSale(saleId) {
    const sales = loadSales();
    const saleIndex = sales.findIndex(s => s.id === saleId);
    if (saleIndex !== -1) {
      const sale = sales[saleIndex];
      sale.status = 'cancelled';
      
      // Restore stock
      restoreStockQuantity(sale.size, sale.brand, sale.quantity);
      
      saveSales(sales);
      
      // Update reports if we're on the reports view
      if (document.getElementById('view-reports').classList.contains('active')) {
        updateReportsDisplay();
      }
      
      return true;
    }
    return false;
  }


  // UI rendering
  function formatMoney(value) {
    if (Number.isNaN(value)) return '-';
    return Number(value).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString();
  }

  function formatDateTime(dateString) {
    const date = new Date(dateString);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`;
  }

  // Profit calculation
  function calculateProfit(fittingPrice, netPrice, quantity) {
    // Formula: (Fitting price - cost of tyre in net * 1.2) * quantity
    const costPerTyre = netPrice * 1.2;
    const profitPerTyre = fittingPrice - costPerTyre;
    return profitPerTyre * quantity;
  }

  // Reports functionality
  function calculateDailyReports(dateFilter = 'today', customDate = null, startDate = null, endDate = null) {
    const sales = loadSales();
    const stock = loadStock();
    
    let filteredSales = [];
    
    switch (dateFilter) {
      case 'today':
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        filteredSales = sales.filter(sale => {
          const saleDate = new Date(sale.createdAt);
          saleDate.setHours(0, 0, 0, 0);
          return saleDate.getTime() === today.getTime();
        });
        break;
        
      case 'yesterday':
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        yesterday.setHours(0, 0, 0, 0);
        filteredSales = sales.filter(sale => {
          const saleDate = new Date(sale.createdAt);
          saleDate.setHours(0, 0, 0, 0);
          return saleDate.getTime() === yesterday.getTime();
        });
        break;
        
      case 'this-week':
        const startOfWeek = new Date();
        startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
        startOfWeek.setHours(0, 0, 0, 0);
        filteredSales = sales.filter(sale => {
          const saleDate = new Date(sale.createdAt);
          return saleDate >= startOfWeek;
        });
        break;
        
      case 'last-month':
        const lastMonth = new Date();
        lastMonth.setMonth(lastMonth.getMonth() - 1);
        const startOfLastMonth = new Date(lastMonth.getFullYear(), lastMonth.getMonth(), 1);
        const endOfLastMonth = new Date(lastMonth.getFullYear(), lastMonth.getMonth() + 1, 0);
        endOfLastMonth.setHours(23, 59, 59, 999);
        filteredSales = sales.filter(sale => {
          const saleDate = new Date(sale.createdAt);
          return saleDate >= startOfLastMonth && saleDate <= endOfLastMonth;
        });
        break;
        
      case 'custom':
        if (customDate) {
          const customDateObj = new Date(customDate);
          customDateObj.setHours(0, 0, 0, 0);
          const nextDay = new Date(customDateObj);
          nextDay.setDate(nextDay.getDate() + 1);
          filteredSales = sales.filter(sale => {
            const saleDate = new Date(sale.createdAt);
            return saleDate >= customDateObj && saleDate < nextDay;
          });
        }
        break;
        
      case 'date-range':
        if (startDate && endDate) {
          const start = new Date(startDate);
          start.setHours(0, 0, 0, 0);
          const end = new Date(endDate);
          end.setHours(23, 59, 59, 999);
          filteredSales = sales.filter(sale => {
            const saleDate = new Date(sale.createdAt);
            return saleDate >= start && saleDate <= end;
          });
        }
        break;
        
      default:
        // Default to today
        const defaultToday = new Date();
        defaultToday.setHours(0, 0, 0, 0);
        filteredSales = sales.filter(sale => {
          const saleDate = new Date(sale.createdAt);
          saleDate.setHours(0, 0, 0, 0);
          return saleDate.getTime() === defaultToday.getTime();
        });
    }
    
    let totalProfit = 0;
    let salesCount = 0;
    
    // Calculate profit and count from completed sales only
    filteredSales.forEach(sale => {
      if (sale.status === 'completed') {
        if (sale.type === 'service') {
          // For services, profit is the full price (no cost)
          totalProfit += sale.price;
        } else {
          // For tyre sales, find the stock item to get net price
          const stockItem = stock.find(item => 
            item.size.toLowerCase() === sale.size.toLowerCase() && 
            item.brand.toLowerCase() === sale.brand.toLowerCase()
          );
          
          if (stockItem) {
            const profit = calculateProfit(sale.fittingPrice, stockItem.net, sale.quantity);
            totalProfit += profit;
          }
        }
        
        salesCount++;
      }
    });
    
    const completedSales = filteredSales.filter(sale => sale.status === 'completed');
    const cancelledSales = filteredSales.filter(sale => sale.status === 'cancelled');
    
    return {
      profit: totalProfit,
      salesCount: salesCount,
      completedCount: completedSales.length,
      cancelledCount: cancelledSales.length
    };
  }

  function updateReportsDisplay() {
    const dateFilter = document.getElementById('reports-date-filter').value;
    let customDate = null;
    let startDate = null;
    let endDate = null;
    
    console.log('updateReportsDisplay called with filter:', dateFilter);
    
    // Get current filter values
    switch (dateFilter) {
      case 'custom':
        customDate = document.getElementById('reports-single-date').value;
        console.log('Custom date:', customDate);
        break;
      case 'date-range':
        startDate = document.getElementById('reports-start-date').value;
        endDate = document.getElementById('reports-end-date').value;
        console.log('Date range:', startDate, 'to', endDate);
        break;
    }
    
    const data = calculateDailyReports(dateFilter, customDate, startDate, endDate);
    console.log('Calculated data:', data);
    
    // Update display values
    document.getElementById('profit-value').textContent = formatMoney(data.profit);
    document.getElementById('sales-count-value').textContent = data.salesCount;
    
    // Update period title
    updateReportsPeriodTitle(dateFilter, customDate, startDate, endDate);
  }

  function updateReportsPeriodTitle(dateFilter, customDate = null, startDate = null, endDate = null) {
    const titleElement = document.getElementById('reports-period-title');
    let title = '';
    
    switch (dateFilter) {
      case 'today':
        title = 'TODAY';
        break;
      case 'yesterday':
        title = 'YESTERDAY';
        break;
      case 'this-week':
        title = 'THIS WEEK';
        break;
      case 'last-month':
        title = 'LAST MONTH';
        break;
      case 'custom':
        if (customDate) {
          const date = new Date(customDate);
          title = date.toLocaleDateString('en-GB', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          }).toUpperCase();
        } else {
          title = 'CUSTOM DATE';
        }
        break;
      case 'date-range':
        if (startDate && endDate) {
          const start = new Date(startDate);
          const end = new Date(endDate);
          title = `${start.toLocaleDateString('en-GB')} - ${end.toLocaleDateString('en-GB')}`.toUpperCase();
        } else {
          title = 'DATE RANGE';
        }
        break;
      default:
        title = 'TODAY';
    }
    
    titleElement.textContent = title;
  }

  function setupReportsRefresh() {
    console.log('Setting up reports refresh...');
    const refreshButton = document.getElementById('refresh-reports');
    const dateFilter = document.getElementById('reports-date-filter');
    const customDateDiv = document.getElementById('reports-custom-date');
    const dateRangeDiv = document.getElementById('reports-date-range');
    const singleDateInput = document.getElementById('reports-single-date');
    const startDateInput = document.getElementById('reports-start-date');
    const endDateInput = document.getElementById('reports-end-date');
    const applySingleDateBtn = document.getElementById('apply-single-date');
    const applyDateRangeBtn = document.getElementById('apply-reports-date-range');
    
    console.log('Elements found:', {
      refreshButton: !!refreshButton,
      dateFilter: !!dateFilter,
      customDateDiv: !!customDateDiv,
      dateRangeDiv: !!dateRangeDiv,
      singleDateInput: !!singleDateInput,
      startDateInput: !!startDateInput,
      endDateInput: !!endDateInput,
      applySingleDateBtn: !!applySingleDateBtn,
      applyDateRangeBtn: !!applyDateRangeBtn
    });
    
    // Set default dates
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const lastMonth = new Date(today);
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    
    // Set default values for date inputs
    singleDateInput.value = today.toISOString().split('T')[0];
    startDateInput.value = lastMonth.toISOString().split('T')[0];
    endDateInput.value = today.toISOString().split('T')[0];
    
    // Handle filter dropdown change
    if (dateFilter) {
      dateFilter.addEventListener('change', (e) => {
        const value = e.target.value;
        console.log('Reports filter changed to:', value);
        
        // Hide all custom inputs first
        if (customDateDiv) customDateDiv.style.display = 'none';
        if (dateRangeDiv) dateRangeDiv.style.display = 'none';
        
        // Show relevant inputs
        if (value === 'custom' && customDateDiv) {
          customDateDiv.style.display = 'flex';
          console.log('Showing custom date inputs');
        } else if (value === 'date-range' && dateRangeDiv) {
          dateRangeDiv.style.display = 'flex';
          console.log('Showing date range inputs');
        }
        
        // Update display immediately for preset filters
        if (['today', 'yesterday', 'this-week', 'last-month'].includes(value)) {
          updateReportsDisplay();
        }
      });
    } else {
      console.error('Date filter element not found!');
    }
    
    // Handle single date apply button
    if (applySingleDateBtn) {
      applySingleDateBtn.addEventListener('click', () => {
        if (singleDateInput.value) {
          // Ensure the date filter is set to 'custom' before updating
          if (dateFilter) {
            dateFilter.value = 'custom';
          }
          updateReportsDisplay();
        }
      });
    }
    
    // Handle date range apply button
    if (applyDateRangeBtn) {
      console.log('Adding event listener to date range apply button');
      applyDateRangeBtn.addEventListener('click', (e) => {
        e.preventDefault();
        console.log('Date range apply button clicked!');
        console.log('Start date:', startDateInput ? startDateInput.value : 'N/A');
        console.log('End date:', endDateInput ? endDateInput.value : 'N/A');
        if (startDateInput && endDateInput && startDateInput.value && endDateInput.value) {
          console.log('Dates are valid, updating reports...');
          // Ensure the date filter is set to 'date-range' before updating
          if (dateFilter) {
            dateFilter.value = 'date-range';
            console.log('Set date filter to:', dateFilter.value);
          }
          updateReportsDisplay();
        } else {
          console.log('Dates are invalid, showing alert');
          alert('Please select both start and end dates');
        }
      });
    } else {
      console.error('Date range apply button not found!');
    }
    
    // Handle refresh button
    if (refreshButton) {
      refreshButton.addEventListener('click', () => {
        updateReportsDisplay();
      });
    }
    
    // Handle Enter key on date inputs
    singleDateInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && singleDateInput.value) {
        updateReportsDisplay();
      }
    });
    
    startDateInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && startDateInput.value && endDateInput.value) {
        updateReportsDisplay();
      }
    });
    
    endDateInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && startDateInput.value && endDateInput.value) {
        updateReportsDisplay();
      }
    });
  }

  // Custom sorting function for tyre sizes
  function sortTyreSizes(a, b) {
    const sizeA = a.size;
    const sizeB = b.size;
    
    // Split sizes into components (e.g., "205/65/16C" -> ["205", "65", "16C"])
    const partsA = sizeA.split('/');
    const partsB = sizeB.split('/');
    
    // Compare first part (width - first 3 digits)
    const widthA = parseInt(partsA[0]);
    const widthB = parseInt(partsB[0]);
    if (widthA !== widthB) {
      return widthA - widthB;
    }
    
    // Compare second part (aspect ratio - 2 digits)
    const aspectA = parseInt(partsA[1]);
    const aspectB = parseInt(partsB[1]);
    if (aspectA !== aspectB) {
      return aspectA - aspectB;
    }
    
    // Compare third part (diameter + optional letter)
    const diameterA = partsA[2];
    const diameterB = partsB[2];
    
    // Extract numeric part and letter part
    const diameterNumA = parseInt(diameterA);
    const diameterNumB = parseInt(diameterB);
    
    if (diameterNumA !== diameterNumB) {
      return diameterNumA - diameterNumB;
    }
    
    // If numeric parts are equal, sort by letter (no letter comes before letter)
    const letterA = diameterA.replace(/\d/g, '');
    const letterB = diameterB.replace(/\d/g, '');
    
    if (letterA === '' && letterB !== '') return -1;
    if (letterA !== '' && letterB === '') return 1;
    if (letterA !== '' && letterB !== '') return letterA.localeCompare(letterB);
    
    return 0;
  }

  function renderStockTable(searchFilter = '') {
    const tbody = document.querySelector('#stock-table tbody');
    tbody.innerHTML = '';
    const stock = loadStock();

    if (!stock.length) {
      const tr = document.createElement('tr');
      const td = document.createElement('td');
      td.colSpan = 6;
      td.className = 'empty';
      td.textContent = 'No stock added yet.';
      tr.appendChild(td);
      tbody.appendChild(tr);
      return;
    }

    // Filter stock based on search query
    let filteredStock = stock;
    if (searchFilter.trim()) {
      const searchLower = searchFilter.toLowerCase().trim();
      filteredStock = stock.filter(item => 
        item.size.toLowerCase().includes(searchLower)
      );
    }

    if (!filteredStock.length) {
      const tr = document.createElement('tr');
      const td = document.createElement('td');
      td.colSpan = 6;
      td.className = 'empty';
      td.textContent = 'No stock found matching your search.';
      tr.appendChild(td);
      tbody.appendChild(tr);
      return;
    }

    // Sort the filtered stock by tyre size
    filteredStock.sort(sortTyreSizes);

    filteredStock.forEach(item => {
      const tr = document.createElement('tr');

      const tdSize = document.createElement('td');
      // Extract only the size and load index part (e.g., "225/45ZR17 95V" from "225/45ZR17 95V Fronway")
      let displaySize = item.size;
      if (displaySize) {
        // Split by space and take all parts except the last one (which is the brand)
        const sizeParts = displaySize.split(' ');
        if (sizeParts.length > 1) {
          // Remove the last part (brand) and join the rest
          displaySize = sizeParts.slice(0, -1).join(' ');
        }
      }
      tdSize.textContent = displaySize;
      tr.appendChild(tdSize);

      const tdBrand = document.createElement('td');
      tdBrand.textContent = item.brand;
      tr.appendChild(tdBrand);

      // Quantity cell with inline editing
      const tdQty = document.createElement('td');
      tdQty.className = 'editable-cell quantity-cell';
      tdQty.textContent = String(item.quantity);
      tdQty.title = 'Click to edit quantity';
      tdQty.addEventListener('click', () => editQuantity(item, tdQty));
      tr.appendChild(tdQty);

      // Net price cell with inline editing
      const tdNet = document.createElement('td');
      tdNet.className = 'editable-cell price-cell';
      tdNet.textContent = formatMoney(item.net);
      tdNet.title = 'Click to edit net price';
      tdNet.addEventListener('click', () => editNetPrice(item, tdNet));
      tr.appendChild(tdNet);

      const tdSuggested = document.createElement('td');
      tdSuggested.className = 'suggested-price';
      const suggestedBase = (Number(item.net) * 1.2) * 2;
      const min = Math.max(0, Math.round(suggestedBase - 5));
      const max = Math.max(min, Math.round(suggestedBase + 8));
      tdSuggested.textContent = `${formatMoney(min)} - ${formatMoney(max)}`;
      tr.appendChild(tdSuggested);

      const tdActions = document.createElement('td');
      
      // Stock Audit button
      const auditBtn = document.createElement('button');
      auditBtn.className = 'btn btn-ghost';
      auditBtn.textContent = 'Stock Audit';
      auditBtn.style.marginRight = '8px';
      auditBtn.addEventListener('click', () => {
        showStockAudit(item);
      });
      tdActions.appendChild(auditBtn);
      
      // Delete button
      const delBtn = document.createElement('button');
      delBtn.className = 'btn btn-danger';
      delBtn.textContent = 'Delete';
      delBtn.addEventListener('click', () => {
        const ok = confirm('Delete this stock item?');
        if (!ok) return;
        deleteStockItem(item.id);
        renderStockTable(searchFilter); // Maintain search filter after deletion
      });
      tdActions.appendChild(delBtn);
      tr.appendChild(tdActions);

      tbody.appendChild(tr);
    });
  }

  // Inline quantity editing
  function editQuantity(item, cell) {
    const currentQty = item.quantity;
    const newQty = prompt(
      `Current quantity: ${currentQty}\n\nEnter new quantity:`,
      currentQty
    );
    
    if (newQty === null) return; // User cancelled
    
    const parsedQty = parseInt(newQty, 10);
    if (isNaN(parsedQty) || parsedQty < 0) {
      alert('Please enter a valid quantity (must be 0 or greater)');
      return;
    }
    
    if (parsedQty === currentQty) return; // No change
    
    // Store the adjustment details for the modal
    window.pendingStockAdjustment = {
      item: item,
      currentQty: currentQty,
      newQty: parsedQty,
      cell: cell
    };
    
    // Show adjustment reason modal
    showStockAdjustmentModal();
  }

  function showStockAdjustmentModal() {
    const modal = document.getElementById('stock-adjustment-modal');
    modal.style.display = 'flex';
  }

  function hideStockAdjustmentModal() {
    const modal = document.getElementById('stock-adjustment-modal');
    modal.style.display = 'none';
    window.pendingStockAdjustment = null;
  }

  function processStockAdjustment(reason) {
    if (!window.pendingStockAdjustment) return;
    
    const { item, currentQty, newQty, cell } = window.pendingStockAdjustment;
    const quantityChange = newQty - currentQty;
    
    // Update the stock
    const stock = loadStock();
    const stockItem = stock.find(s => s.id === item.id);
    if (stockItem) {
      stockItem.quantity = newQty;
      stockItem.updatedAt = new Date().toISOString();
      saveStock(stock);
      
      // Add adjustment to stock history
      addStockHistoryEntry(item.size, item.brand, quantityChange, item.net, 'adjustment', reason);
      
      // Get current search filter to maintain it
      const searchInput = document.getElementById('stock-size-search');
      const currentFilter = searchInput ? searchInput.value : '';
      
      // Re-render the table with the same filter to ensure all changes are reflected
      renderStockTable(currentFilter);
      
      // Show confirmation
      const message = newQty > currentQty ? 
        `Quantity increased from ${currentQty} to ${newQty} (${reason})` :
        `Quantity decreased from ${currentQty} to ${newQty} (${reason})`;
      showToast(message, 'success');
    }
    
    hideStockAdjustmentModal();
  }

  // Inline net price editing with confirmation
  function editNetPrice(item, cell) {
    const currentPrice = item.net;
    const newPrice = prompt(
      `Current net price: £${formatMoney(currentPrice)}\n\nEnter new net price:`,
      formatMoney(currentPrice)
    );
    
    if (newPrice === null) return; // User cancelled
    
    const parsedPrice = parseFloat(newPrice);
    if (isNaN(parsedPrice) || parsedPrice < 0) {
      alert('Please enter a valid price (must be 0 or greater)');
      return;
    }
    
    if (parsedPrice === currentPrice) return; // No change
    
    // Show confirmation dialog
    const confirmMessage = `Are you sure you want to change the net price from £${formatMoney(currentPrice)} to £${formatMoney(parsedPrice)}?\n\nThis will also update the suggested fitting price.`;
    
    if (confirm(confirmMessage)) {
      // Update the stock
      const stock = loadStock();
      const stockItem = stock.find(s => s.id === item.id);
      if (stockItem) {
        stockItem.net = parsedPrice;
        stockItem.updatedAt = new Date().toISOString();
        saveStock(stock);
        
        // Update display
        cell.textContent = formatMoney(parsedPrice);
        
        // Update suggested price in the same row
        const suggestedCell = cell.parentElement.querySelector('.suggested-price');
        if (suggestedCell) {
          const suggestedBase = (parsedPrice * 1.2) * 2;
          const min = Math.max(0, Math.round(suggestedBase - 5));
          const max = Math.max(min, Math.round(suggestedBase + 8));
          suggestedCell.textContent = `${formatMoney(min)} - ${formatMoney(max)}`;
        }
        
        // Show confirmation
        showToast(`Net price updated from £${formatMoney(currentPrice)} to £${formatMoney(parsedPrice)}`, 'success');
      }
    }
  }

  // Toast notification system
  function showToast(message, type = 'info') {
    // Remove existing toasts
    const existingToasts = document.querySelectorAll('.toast');
    existingToasts.forEach(toast => toast.remove());
    
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    // Show toast
    setTimeout(() => toast.classList.add('show'), 100);
    
    // Hide toast after 3 seconds
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

  function renderSalesTable() {
    const tbody = document.querySelector('#sales-table tbody');
    tbody.innerHTML = '';
    const sales = loadSales();

    if (!sales.length) {
      const tr = document.createElement('tr');
      const td = document.createElement('td');
      td.colSpan = 11;
      td.className = 'empty';
      td.textContent = 'No sales recorded yet.';
      tr.appendChild(td);
      tbody.appendChild(tr);
      return;
    }

    // Apply date filtering
    const filteredSales = filterSalesByDate(sales);
    
    // Sort by date (newest first)
    filteredSales.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    if (!filteredSales.length) {
      const tr = document.createElement('tr');
      const td = document.createElement('td');
      td.colSpan = 11;
      td.className = 'empty';
      td.textContent = 'No sales found for selected date range.';
      tr.appendChild(td);
      tbody.appendChild(tr);
      return;
    }

    for (const sale of filteredSales) {
      const tr = document.createElement('tr');

      const tdDate = document.createElement('td');
      tdDate.textContent = formatDateTime(sale.createdAt);
      tr.appendChild(tdDate);

                  const tdCustomer = document.createElement('td');
            // Format customer name with line break between first and last name
            const customerName = sale.customerName || 'N/A';
            if (customerName !== 'N/A' && customerName.includes(' ')) {
              const nameParts = customerName.split(' ');
              const firstName = nameParts[0];
              const lastName = nameParts.slice(1).join(' ');
              tdCustomer.innerHTML = `${firstName}<br>${lastName}`;
            } else {
              tdCustomer.textContent = customerName;
            }
            tr.appendChild(tdCustomer);

      const tdSize = document.createElement('td');
      if (sale.type === 'service') {
        tdSize.textContent = sale.serviceType || 'Service';
      } else {
        // Extract just the tyre size part (e.g., "235/65R16" from "235/65R16 102R Farroad")
        let displaySize = sale.size || 'N/A';
        if (displaySize !== 'N/A') {
          // Split by space and take the first part (the actual tyre size)
          const sizeParts = displaySize.split(' ');
          displaySize = sizeParts[0];
        }
        tdSize.textContent = displaySize;
      }
      tr.appendChild(tdSize);

      const tdBrand = document.createElement('td');
      if (sale.type === 'service') {
        tdBrand.textContent = 'Service';
      } else {
        tdBrand.textContent = sale.brand || 'N/A';
      }
      tr.appendChild(tdBrand);

      const tdQty = document.createElement('td');
      if (sale.type === 'service') {
        tdQty.textContent = '1';
      } else {
        tdQty.textContent = String(sale.quantity || 1);
      }
      tr.appendChild(tdQty);

      const tdFitting = document.createElement('td');
      if (sale.type === 'service') {
        tdFitting.textContent = formatMoney(sale.price || 0);
      } else {
        tdFitting.textContent = formatMoney(sale.fittingPrice || 0);
      }
      tr.appendChild(tdFitting);

      const tdTotal = document.createElement('td');
      tdTotal.textContent = formatMoney(sale.total);
      tr.appendChild(tdTotal);

      const tdPayment = document.createElement('td');
      tdPayment.textContent = sale.paymentMethod || 'N/A';
      tr.appendChild(tdPayment);

                  const tdSalesPerson = document.createElement('td');
            // Format sales person name with line break between first and last name
            const salesPersonName = sale.salesPerson || 'N/A';
            if (salesPersonName !== 'N/A' && salesPersonName.includes(' ')) {
              const nameParts = salesPersonName.split(' ');
              const firstName = nameParts[0];
              const lastName = nameParts.slice(1).join(' ');
              tdSalesPerson.innerHTML = `${firstName}<br>${lastName}`;
            } else {
              tdSalesPerson.textContent = salesPersonName;
            }
            tr.appendChild(tdSalesPerson);

      const tdStatus = document.createElement('td');
      const statusBadge = document.createElement('span');
      statusBadge.className = `status-badge status-${sale.status}`;
      statusBadge.textContent = sale.status;
      tdStatus.appendChild(statusBadge);
      tr.appendChild(tdStatus);

      const tdActions = document.createElement('td');
      
      if (sale.status === 'completed') {
        const cancelBtn = document.createElement('button');
        cancelBtn.className = 'btn btn-warning';
        cancelBtn.textContent = 'Cancel';
        cancelBtn.addEventListener('click', () => {
          const ok = confirm('Cancel this sale? This will restore stock.');
          if (!ok) return;
          if (cancelSale(sale.id)) {
            renderSalesTable();
            renderStockTable();
          }
        });
        tdActions.appendChild(cancelBtn);

        const invoiceBtn = document.createElement('button');
        invoiceBtn.className = 'btn btn-success';
        invoiceBtn.textContent = 'Invoice';
        invoiceBtn.addEventListener('click', () => generateInvoice(sale));
        tdActions.appendChild(invoiceBtn);
      } else if (sale.status === 'cancelled') {
        const invoiceBtn = document.createElement('button');
        invoiceBtn.className = 'btn btn-success';
        invoiceBtn.textContent = 'Invoice';
        invoiceBtn.addEventListener('click', () => generateInvoice(sale));
        tdActions.appendChild(invoiceBtn);
      }

      tr.appendChild(tdActions);
      tbody.appendChild(tr);
    }
  }

  // Date filtering functions
  function filterSalesByDate(sales) {
    const filterValue = document.getElementById('date-filter').value;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let filteredSales = [];

    switch (filterValue) {
      case 'today':
        filteredSales = sales.filter(sale => {
          const saleDate = new Date(sale.createdAt);
          saleDate.setHours(0, 0, 0, 0);
          return saleDate.getTime() === today.getTime();
        });
        break;

      case 'yesterday':
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        filteredSales = sales.filter(sale => {
          const saleDate = new Date(sale.createdAt);
          saleDate.setHours(0, 0, 0, 0);
          return saleDate.getTime() === yesterday.getTime();
        });
        break;

      case 'this-week':
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay());
        filteredSales = sales.filter(sale => {
          const saleDate = new Date(sale.createdAt);
          return saleDate >= startOfWeek;
        });
        break;

      case 'this-month':
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        filteredSales = sales.filter(sale => {
          const saleDate = new Date(sale.createdAt);
          return saleDate >= startOfMonth;
        });
        break;

      case 'custom':
        const startDate = document.getElementById('start-date').value;
        const endDate = document.getElementById('end-date').value;
        
        if (startDate && endDate) {
          const start = new Date(startDate);
          const end = new Date(endDate);
          end.setHours(23, 59, 59, 999); // End of day
          
          filteredSales = sales.filter(sale => {
            const saleDate = new Date(sale.createdAt);
            return saleDate >= start && saleDate <= end;
          });
        } else {
          filteredSales = sales; // If no custom dates selected, show all
        }
        break;

      default:
        filteredSales = sales;
    }

    // Apply additional search filters
    return applySearchFilters(filteredSales);
  }

  function applySearchFilters(sales) {
    const customerSearch = document.getElementById('search-customer').value.toLowerCase().trim();
    const sizeSearch = document.getElementById('search-size').value.toLowerCase().trim();
    const brandSearch = document.getElementById('search-brand').value.toLowerCase().trim();
    const paymentSearch = document.getElementById('search-payment').value.toLowerCase().trim();
    const salesPersonSearch = document.getElementById('search-sales-person').value.toLowerCase().trim();

    return sales.filter(sale => {
      // Customer name filter
      if (customerSearch && !sale.customerName.toLowerCase().includes(customerSearch)) {
        return false;
      }

      // Size/Service filter
      if (sizeSearch) {
        if (sale.type === 'service') {
          // For services, search in serviceType
          if (!sale.serviceType.toLowerCase().includes(sizeSearch)) {
            return false;
          }
        } else {
          // For tyre sales, search in size
          if (!sale.size.toLowerCase().includes(sizeSearch)) {
            return false;
          }
        }
      }

      // Brand filter
      if (brandSearch) {
        if (sale.type === 'service') {
          // For services, always match (services don't have brands)
          // Or you could skip this filter for services
        } else {
          // For tyre sales, search in brand
          if (!sale.brand.toLowerCase().includes(brandSearch)) {
            return false;
          }
        }
      }

      // Payment type filter
      if (paymentSearch && sale.paymentMethod.toLowerCase() !== paymentSearch) {
        return false;
      }

      // Sales person filter
      if (salesPersonSearch && !sale.salesPerson.toLowerCase().includes(salesPersonSearch)) {
        return false;
      }

      return true;
    });
  }

  function setupDateFiltering() {
    const dateFilter = document.getElementById('date-filter');
    const customDateRange = document.getElementById('custom-date-range');
    const applyDateRange = document.getElementById('apply-date-range');

    // Handle filter dropdown change
    dateFilter.addEventListener('change', (e) => {
      if (e.target.value === 'custom') {
        customDateRange.style.display = 'block';
        // Set default custom dates (last 30 days)
        const end = new Date();
        const start = new Date();
        start.setDate(start.getDate() - 30);
        
        document.getElementById('start-date').value = start.toISOString().split('T')[0];
        document.getElementById('end-date').value = end.toISOString().split('T')[0];
      } else {
        customDateRange.style.display = 'none';
        renderSalesTable();
      }
    });

    // Handle custom date range apply button
    applyDateRange.addEventListener('click', () => {
      renderSalesTable();
    });

    // Set default filter to "all"
    dateFilter.value = 'all';
  }

  function setupSalesSearchFilters() {
    const searchInputs = [
      'search-customer',
      'search-size', 
      'search-brand',
      'search-payment',
      'search-sales-person'
    ];

    // Add event listeners to all search inputs
    searchInputs.forEach(inputId => {
      const input = document.getElementById(inputId);
      if (input) {
        input.addEventListener('input', () => {
          renderSalesTable();
        });
      }
    });


    // Clear search filters button
    const clearButton = document.getElementById('clear-search-filters');
    if (clearButton) {
      clearButton.addEventListener('click', () => {
        searchInputs.forEach(inputId => {
          const input = document.getElementById(inputId);
          if (input) {
            input.value = '';
          }
        });
        renderSalesTable();
      });
    }
  }

  // Wire up navigation
  function wireNavigation() {
    // Navigation buttons
    document.getElementById('nav-home')?.addEventListener('click', () => {
      switchView(VIEW_HOME_ID);
      updateActiveNav('nav-home');
    });
    
    document.getElementById('nav-stock')?.addEventListener('click', () => {
      switchView(VIEW_STOCK_ID);
      updateActiveNav('nav-stock');
      renderStockTable();
    });
    
    document.getElementById('nav-sales')?.addEventListener('click', () => {
      switchView(VIEW_SALES_ID);
      updateActiveNav('nav-sales');
      renderSalesTable();
    });
    
    document.getElementById('nav-reports')?.addEventListener('click', () => {
      switchView(VIEW_REPORTS_ID);
      updateActiveNav('nav-reports');
      updateReportsDisplay();
    });
    
    document.getElementById('nav-settings')?.addEventListener('click', () => {
      switchView(VIEW_SETTINGS_ID);
      updateActiveNav('nav-settings');
    });
    
    document.getElementById('nav-calendar')?.addEventListener('click', () => {
      switchView(VIEW_CALENDAR_ID);
      updateActiveNav('nav-calendar');
      // Initialize calendar when view is shown
      generateCalendar(currentCalendarDate.getFullYear(), currentCalendarDate.getMonth());
    });
    
    // Sales action listeners and view navigation are handled by event delegation
    document.body.addEventListener('click', (e) => {
      const target = e.target;
      if (target instanceof HTMLElement) {
        // Handle sales actions
        const salesAction = target.dataset.salesAction || target.closest('[data-sales-action]')?.getAttribute('data-sales-action');
        if (salesAction === 'create') showSalesView('create');
        if (salesAction === 'service') showSalesView('service');
        if (salesAction === 'records') showSalesView('records');
        if (salesAction === 'back') showSalesView(null);
        
        // Handle view navigation (including Back to Home buttons)
        const viewAction = target.dataset.view || target.closest('[data-view]')?.getAttribute('data-view');
        if (viewAction === 'home') {
          switchView(VIEW_HOME_ID);
          updateActiveNav('nav-home');
        } else if (viewAction === 'stock') {
          switchView(VIEW_STOCK_ID);
          updateActiveNav('nav-stock');
          renderStockTable();
        } else if (viewAction === 'sales') {
          switchView(VIEW_SALES_ID);
          updateActiveNav('nav-sales');
          renderSalesTable();
        } else if (viewAction === 'settings') {
          switchView(VIEW_SETTINGS_ID);
          updateActiveNav('nav-settings');
        } else if (viewAction === 'reports') {
          switchView(VIEW_REPORTS_ID);
          updateActiveNav('nav-reports');
          updateReportsDisplay();
        } else if (viewAction === 'calendar') {
          switchView(VIEW_CALENDAR_ID);
          updateActiveNav('nav-calendar');
          // Initialize calendar when view is shown
          generateCalendar(currentCalendarDate.getFullYear(), currentCalendarDate.getMonth());
        }
      }
    });
  }

  // Update active navigation button
  function updateActiveNav(activeId) {
    // Remove active class from all nav buttons
    document.querySelectorAll('.nav-btn').forEach(btn => {
      btn.classList.remove('active');
    });
    
    // Add active class to clicked button
    document.getElementById(activeId)?.classList.add('active');
  }

  // Size search suggestions
  function setupSizeSearch() {
    const sizeInput = document.getElementById('sale-size');
    const suggestionsDiv = document.getElementById('size-suggestions');
    const brandSelect = document.getElementById('sale-brand');
    const quantityInput = document.getElementById('sale-quantity');

    sizeInput.addEventListener('input', (e) => {
      const query = e.target.value.trim().toLowerCase();
      
      // Disable brand dropdown when size is being typed/modified
      brandSelect.disabled = true;
      brandSelect.innerHTML = '<option value="">Select a brand...</option>';
      
      if (query.length < 2) {
        suggestionsDiv.style.display = 'none';
        return;
      }

      const stock = loadStock();
      const matches = stock.filter(item => 
        item.size.toLowerCase().includes(query) && item.quantity > 0
      );

      if (matches.length > 0) {
        suggestionsDiv.innerHTML = '';
        matches.forEach(item => {
          const div = document.createElement('div');
          div.className = 'suggestion-item';
          div.textContent = `${item.size} - ${item.brand} (${item.quantity} available)`;
          div.addEventListener('click', () => {
            sizeInput.value = item.size;
            populateBrandDropdown(item.size);
            // Auto-select the brand for this specific item
            brandSelect.value = item.brand;
            // Update quantity validation
            updateQuantityValidation(item.size, item.brand);
            suggestionsDiv.style.display = 'none';
          });
          suggestionsDiv.appendChild(div);
        });
        suggestionsDiv.style.display = 'block';
      } else {
        suggestionsDiv.style.display = 'none';
      }
    });

    // Handle when user focuses on the input
    sizeInput.addEventListener('focus', (e) => {
      const query = e.target.value.trim().toLowerCase();
      if (query.length >= 2) {
        const stock = loadStock();
        const matches = stock.filter(item => 
          item.size.toLowerCase().includes(query) && item.quantity > 0
        );

        if (matches.length > 0) {
          suggestionsDiv.innerHTML = '';
          matches.forEach(item => {
            const div = document.createElement('div');
            div.className = 'suggestion-item';
            div.textContent = `${item.size} - ${item.brand} (${item.quantity} available)`;
            div.addEventListener('click', () => {
              sizeInput.value = item.size;
              populateBrandDropdown(item.size);
              // Auto-select the brand for this specific item
              brandSelect.value = item.brand;
              suggestionsDiv.style.display = 'none';
            });
            suggestionsDiv.appendChild(div);
          });
          suggestionsDiv.style.display = 'block';
        }
      }
    });

    // Handle when user finishes typing (blur event)
    sizeInput.addEventListener('blur', (e) => {
      const query = e.target.value.trim();
      if (query) {
        // Check if the exact size exists in stock
        const stock = loadStock();
        const exactMatch = stock.find(item => 
          item.size.toLowerCase() === query.toLowerCase() && item.quantity > 0
        );
        
        if (exactMatch) {
          populateBrandDropdown(exactMatch.size);
        } else {
          // If no exact match, disable brand dropdown
          brandSelect.disabled = true;
          brandSelect.innerHTML = '<option value="">Select a brand...</option>';
        }
      } else {
        // If size is empty, disable brand dropdown
        brandSelect.disabled = true;
        brandSelect.innerHTML = '<option value="">Select a brand...</option>';
      }
      
      // Hide suggestions after a longer delay to allow clicking
      setTimeout(() => {
        suggestionsDiv.style.display = 'none';
      }, 500);
    });

    // Handle when user presses Enter
    sizeInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const query = e.target.value.trim();
        if (query) {
          const stock = loadStock();
          const exactMatch = stock.find(item => 
            item.size.toLowerCase() === query.toLowerCase() && item.quantity > 0
          );
          
          if (exactMatch) {
            populateBrandDropdown(exactMatch.size);
            suggestionsDiv.style.display = 'none';
          } else {
            // If no exact match, disable brand dropdown
            brandSelect.disabled = true;
            brandSelect.innerHTML = '<option value="">Select a brand...</option>';
          }
        }
      }
    });

    // Hide suggestions when clicking outside
    document.addEventListener('click', (e) => {
      if (!sizeInput.contains(e.target) && !suggestionsDiv.contains(e.target)) {
        suggestionsDiv.style.display = 'none';
      }
    });
  }

  // Populate brand dropdown for selected size
  function populateBrandDropdown(selectedSize) {
    const brandSelect = document.getElementById('sale-brand');
    const stock = loadStock();
    
    // Clear existing options except the first placeholder
    brandSelect.innerHTML = '<option value="">Select a brand...</option>';
    
    // Find all brands available for this size
    const availableBrands = stock.filter(item => 
      item.size === selectedSize && item.quantity > 0
    );
    
    // Add brand options
    availableBrands.forEach(item => {
      const option = document.createElement('option');
      option.value = item.brand;
      option.textContent = `${item.brand} (${item.quantity} available)`;
      brandSelect.appendChild(option);
    });
    
    // Enable the brand select
    brandSelect.disabled = false;
    
    // Add event listener for brand selection
    brandSelect.addEventListener('change', () => {
      if (brandSelect.value) {
        updateQuantityValidation(selectedSize, brandSelect.value);
      }
    });
  }

  // Update quantity validation based on selected size and brand
  function updateQuantityValidation(size, brand) {
    const quantityInput = document.getElementById('sale-quantity');
    if (!quantityInput) return;
    
    const stock = loadStock();
    const stockItem = stock.find(item => item.size === size && item.brand === brand);
    
    if (stockItem) {
      quantityInput.max = stockItem.quantity;
      quantityInput.placeholder = `Max: ${stockItem.quantity}`;
      
      // If current value exceeds max, reset it
      if (parseInt(quantityInput.value) > stockItem.quantity) {
        quantityInput.value = '';
      }
      
      // Add real-time validation
      quantityInput.addEventListener('input', () => {
        const value = parseInt(quantityInput.value);
        if (value > stockItem.quantity) {
          quantityInput.style.borderColor = '#ff4444';
          quantityInput.title = `Maximum available: ${stockItem.quantity}`;
        } else {
          quantityInput.style.borderColor = '';
          quantityInput.title = '';
        }
      });
    } else {
      quantityInput.max = '';
      quantityInput.placeholder = 'Enter quantity';
      quantityInput.style.borderColor = '';
      quantityInput.title = '';
    }
  }

  // Format customer name to proper case
  function formatCustomerName(name) {
    if (!name) return '';
    
    // Limit to 100 characters
    if (name.length > 100) {
      name = name.substring(0, 100);
    }
    
    // Split by spaces and format each word
    return name
      .split(' ')
      .map(word => {
        if (!word) return word; // Handle multiple spaces
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      })
      .join(' ');
  }

  // Setup customer name formatting
  function setupCustomerNameFormatting() {
    const customerNameInputs = [
      'sale-customer-name',
      'service-customer-name',
      'appointment-customer'
    ];
    
    customerNameInputs.forEach(inputId => {
      const input = document.getElementById(inputId);
      if (input) {
        // Format on blur (when user finishes typing)
        input.addEventListener('blur', (e) => {
          const formatted = formatCustomerName(e.target.value);
          e.target.value = formatted;
        });
        
        // Limit to 100 characters as user types
        input.addEventListener('input', (e) => {
          if (e.target.value.length > 100) {
            e.target.value = e.target.value.substring(0, 100);
          }
        });
      }
    });
  }

  // Form handlers
  function handleAddStockSubmit(event) {
    event.preventDefault();
    const form = event.currentTarget;

    const width = form.width.value;
    const aspectRatio = form.aspectRatio.value;
    const construction = form.construction.value;
    const rimSize = form.rimSize.value;
    const loadIndex = form.loadIndex.value.trim();
    const brand = form.brand.value.trim();
    const quantity = Number.parseInt(form.quantity.value, 10);
    const net = Number.parseFloat(form.net.value);

    const errors = [];
    if (!width) errors.push('Width is required');
    if (!aspectRatio) errors.push('Aspect ratio is required');
    if (!construction) errors.push('Construction is required');
    if (!rimSize) errors.push('Rim size is required');
    if (!brand) errors.push('Brand is required');
    if (!Number.isFinite(quantity) || quantity < 1) errors.push('Quantity must be 1 or more');
    if (!Number.isFinite(net) || net < 0) errors.push('Net price must be 0 or more');

    if (errors.length) {
      alert(errors.join('\n'));
      return;
    }

    // Format the tyre size: 225/45ZR17 95V Fronway
    let size = `${width}/${aspectRatio}${construction}${rimSize}`;
    if (loadIndex) {
      size += ` ${loadIndex}`;
    }
    size += ` ${brand}`;

    // Check for existing item with same size and brand
    const stock = loadStock();
    const existingItem = stock.find(item => 
      item.size.toLowerCase() === size.toLowerCase()
    );

    if (existingItem) {
      // Calculate weighted average net price
      // Formula: (existing_quantity × existing_price + new_quantity × new_price) ÷ total_quantity
      const existingTotalCost = existingItem.net * existingItem.quantity;
      const newTotalCost = net * quantity;
      const totalQuantity = existingItem.quantity + quantity;
      const weightedAverageNet = (existingTotalCost + newTotalCost) / totalQuantity;
      
      // Update existing item: add quantity and update to weighted average net price
      existingItem.quantity = totalQuantity;
      existingItem.net = Math.round(weightedAverageNet * 100) / 100; // Round to 2 decimal places
      existingItem.updatedAt = new Date().toISOString();
      
      // Add history entry for the new stock addition
      addStockHistoryEntry(size, brand, quantity, net, 'purchase');
      
      saveStock(stock);
      alert(`Updated existing stock: ${size}\nQuantity increased by ${quantity}\nNet price updated to weighted average: £${formatMoney(existingItem.net)}\nNew total quantity: ${existingItem.quantity}`);
    } else {
      // Create new item
      const item = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        size,
        brand,
        quantity,
        net,
        createdAt: new Date().toISOString(),
      };
      addStockItem(item);
      
      // Add history entry for the new stock
      addStockHistoryEntry(size, brand, quantity, net, 'purchase');
      
      alert(`New stock item added: ${size}`);
    }

    renderStockTable();
    
    // Clear search input and show all stock
    const searchInput = document.getElementById('stock-size-search');
    if (searchInput) {
      searchInput.value = '';
    }
    
    const firstSelect = form.querySelector('select');
    form.reset();
    firstSelect?.focus();
  }

  function handleSaleSubmit(event) {
    event.preventDefault();
    const form = event.currentTarget;

    const size = form.size.value.trim();
    const brand = form.brand.value.trim();
    const quantity = Number.parseInt(form.quantity.value, 10);
    const fittingPrice = Number.parseFloat(form.fittingPrice.value);
    let customerName = form.customerName.value.trim();
    const customerPhone = form.customerPhone.value.trim();
    const paymentMethod = form.paymentMethod.value.trim();
    const salesPerson = form.salesPerson.value.trim();

    // Format customer name to proper case
    customerName = formatCustomerName(customerName);
    // Update the form field to show the formatted value
    form.customerName.value = customerName;

    const errors = [];
    if (!size) errors.push('Tyre size is required');
    if (!brand) errors.push('Brand is required');
    if (!Number.isFinite(quantity) || quantity < 1) errors.push('Quantity must be 1 or more');
    if (!Number.isFinite(fittingPrice) || fittingPrice < 0) errors.push('Fitting price must be 0 or more');
    if (!customerName) errors.push('Customer name is required');
    if (!paymentMethod) errors.push('Payment method is required');
    if (!salesPerson) errors.push('Sales person is required');

    if (errors.length) {
      alert(errors.join('\n'));
      return;
    }

    // Check stock availability - look for exact match in the size field (which now contains the full formatted string)
    const stock = loadStock();
    const stockItem = stock.find(item => item.size === size);
    if (!stockItem) {
      alert(`No stock found for ${size}. Please select from available stock.`);
      return;
    }
    if (stockItem.quantity < quantity) {
      alert(`Insufficient stock available. You have ${stockItem.quantity} units in stock, but trying to sell ${quantity} units.`);
      return;
    }

    const saleData = {
      size,
      brand,
      quantity,
      fittingPrice,
      customerName,
      customerPhone,
      paymentMethod,
      salesPerson
    };

    const sale = createSale(saleData);
    alert(`Sale created successfully! Total: £${formatMoney(sale.total)}`);
    
    form.reset();
    // Reset brand dropdown to initial state
    const brandSelect = document.getElementById('sale-brand');
    brandSelect.innerHTML = '<option value="">Select a brand...</option>';
    brandSelect.disabled = true;
    
    renderStockTable();
    showSalesView('records');
  }

  function handleServiceSubmit(event) {
    event.preventDefault();
    const form = event.currentTarget;

    const serviceType = form.serviceType.value.trim();
    const price = Number.parseFloat(form.price.value);
    let customerName = form.customerName.value.trim();
    const customerPhone = form.customerPhone.value.trim();
    const paymentMethod = form.paymentMethod.value.trim();
    const salesPerson = form.salesPerson.value.trim();

    // Format customer name to proper case
    customerName = formatCustomerName(customerName);
    // Update the form field to show the formatted value
    form.customerName.value = customerName;

    const errors = [];
    if (!serviceType) errors.push('Service type is required');
    if (!Number.isFinite(price) || price < 0) errors.push('Price must be 0 or more');
    if (!customerName) errors.push('Customer name is required');
    if (!paymentMethod) errors.push('Payment method is required');
    if (!salesPerson) errors.push('Sales person is required');

    if (errors.length) {
      alert(errors.join('\n'));
      return;
    }

    const serviceData = {
      serviceType,
      price,
      customerName,
      customerPhone,
      paymentMethod,
      salesPerson
    };

    createService(serviceData);
    showSalesView('records');
  }

  function handleSettingsSubmit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    
    const formData = new FormData(form);
    const currentSettings = loadSettings(); // Load existing settings including logo
    
    const settings = {
      ...currentSettings, // Preserve existing settings (including logo)
      businessName: formData.get('businessName'),
      businessAddress: formData.get('businessAddress'),
      businessPhone: formData.get('businessPhone'),
      companyReg: formData.get('companyReg'),
      vatReg: formData.get('vatReg'),
      businessEmail: formData.get('businessEmail')
    };

    saveSettings(settings);
    alert('Settings saved successfully!');
    
    // Debug: Log what was saved
    console.log('Settings saved:', {
      hasLogo: !!settings.logo,
      logoLength: settings.logo ? settings.logo.length : 0,
      businessName: settings.businessName
    });
  }

  // Logo handling
  function setupLogoUpload() {
    const logoInput = document.getElementById('business-logo');
    const previewDiv = document.getElementById('logo-preview');

    logoInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        // Validate file type
        if (!file.type.startsWith('image/')) {
          alert('Please select an image file (PNG, JPG, GIF, etc.)');
          logoInput.value = ''; // Clear the input
          return;
        }
        
        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          alert('File size must be less than 5MB');
          logoInput.value = ''; // Clear the input
          return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const logoData = e.target.result;
            
            // Validate that we got valid data
            if (!logoData || typeof logoData !== 'string' || !logoData.startsWith('data:image/')) {
              throw new Error('Invalid image data received');
            }
            
            // Show preview
            previewDiv.innerHTML = `<img src="${logoData}" alt="Logo preview" />`;
            
            // Save logo to settings
            const settings = loadSettings();
            settings.logo = logoData;
            saveSettings(settings);
            
            console.log('Logo saved successfully:', {
              length: logoData.length,
              start: logoData.substring(0, 50) + '...',
              type: logoData.substring(0, 30)
            });
            
            alert('Logo uploaded successfully!');
            
          } catch (error) {
            console.error('Error processing logo:', error);
            alert('Error processing logo. Please try again.');
            logoInput.value = ''; // Clear the input
            previewDiv.innerHTML = ''; // Clear preview
          }
        };
        
        reader.onerror = () => {
          console.error('Error reading file');
          alert('Error reading file. Please try again.');
          logoInput.value = ''; // Clear the input
          previewDiv.innerHTML = ''; // Clear preview
        };
        
        reader.readAsDataURL(file);
      }
    });

    // Load existing logo on page load
    const settings = loadSettings();
    if (settings.logo && settings.logo.startsWith('data:image/')) {
      previewDiv.innerHTML = `<img src="${settings.logo}" alt="Logo preview" />`;
      console.log('Existing logo loaded:', {
        length: settings.logo.length,
        start: settings.logo.substring(0, 50) + '...',
        type: settings.logo.substring(0, 30)
      });
    } else if (settings.logo) {
      console.warn('Invalid logo data found:', settings.logo.substring(0, 100));
      // Clear invalid logo data
      delete settings.logo;
      saveSettings(settings);
      previewDiv.innerHTML = '';
    }
  }

  // Settings form population
  function populateSettingsForm() {
    const settings = loadSettings();
    const form = document.getElementById('settings-form');
    
    if (settings.businessName) form.businessName.value = settings.businessName;
    if (settings.businessAddress) form.businessAddress.value = settings.businessAddress;
    if (settings.businessPhone) form.businessPhone.value = settings.businessPhone;
    if (settings.companyReg) form.companyReg.value = settings.companyReg;
    if (settings.vatReg) form.vatReg.value = settings.vatReg;
    if (settings.businessEmail) form.businessEmail.value = settings.businessEmail;
  }

  // Invoice number generation
  function generateInvoiceNumber(businessName, saleNumber) {
    const prefix = businessName ? businessName.substring(0, 3).toUpperCase() : 'INV';
    return `${prefix}-${String(saleNumber).padStart(4, '0')}`;
  }

  // Get next sale number
  function getNextSaleNumber() {
    const sales = loadSales();
    if (sales.length === 0) return 1;
    
    // Find the highest sale number
    let maxNumber = 0;
    sales.forEach(sale => {
      if (sale.saleNumber && sale.saleNumber > maxNumber) {
        maxNumber = sale.saleNumber;
      }
    });
    
    return maxNumber + 1;
  }

  // PDF Invoice generation
  function generateInvoice(sale) {
    const settings = loadSettings();
    
    // Generate invoice number
    const invoiceNumber = generateInvoiceNumber(settings.businessName, sale.saleNumber);
    
    // Calculate tax (20% VAT) - exempt for MOT and Puncture services
    const isVATExempt = sale.type === 'service' && (sale.serviceType === 'MOT' || sale.serviceType === 'Puncture');
    const subtotal = isVATExempt ? sale.total : sale.total / 1.2; // Remove VAT to get subtotal
    const tax = isVATExempt ? 0 : sale.total - subtotal;
    
    // Format address with line breaks
    const formattedAddress = settings.businessAddress ? 
      settings.businessAddress.replace(/\n/g, '<br>') : 'Business Address';
    
    // Debug logo loading
    console.log('Generating invoice with settings:', {
      hasLogo: !!settings.logo,
      logoLength: settings.logo ? settings.logo.length : 0,
      logoStart: settings.logo ? settings.logo.substring(0, 100) : 'none'
    });
    
    // Create invoice content
    const invoiceContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Invoice - ${sale.customerName}</title>
        <style>
          body { font-family: Verdana, sans-serif; margin: 40px; }
          .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 40px; }
          .logo { width: 128px; height: 128px; object-fit: contain; }
          .business-info { text-align: right; display: flex; flex-direction: column; align-items: flex-end; }
          .business-info p { margin: 0.5pt 0; }
          .invoice-details { margin-bottom: 30px; }
          .customer-info { margin-bottom: 30px; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
          th, td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
          th { background-color: #f8f9fa; }
          .total { font-weight: bold; font-size: 18px; }
          h2 { font-weight: normal; font-size: 24px; }
          .totals-table { width: 300px; margin-left: auto; }
          .totals-table td { border: none; padding: 8px 12px; }
          .totals-table .label { text-align: right; }
          .totals-table .amount { text-align: right; font-weight: bold; }
          .final-total { border-top: 2px solid #333; font-size: 20px; }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <h1>${settings.businessName || 'Business Name'}</h1>
          </div>
          <div class="business-info">
            ${settings.logo ? `<img src="${settings.logo}" class="logo" alt="Business Logo" style="display: block; margin-bottom: 10px;">` : ''}
            <p>${formattedAddress}</p>
            <p>Phone: ${settings.businessPhone || 'Phone'}</p>
            <p>Email: ${settings.businessEmail || 'Email'}</p>
            ${settings.companyReg ? `<p>Reg: ${settings.companyReg}</p>` : ''}
            ${settings.vatReg ? `<p>VAT: ${settings.vatReg}</p>` : ''}
          </div>
        </div>
        
        <div class="invoice-details">
          <h2>INVOICE</h2>
          <p><strong>Date:</strong> ${formatDateTime(sale.createdAt)}</p>
          <p><strong>Invoice #:</strong> ${invoiceNumber}</p>
          <p><strong>Payment Method:</strong> ${sale.paymentMethod || 'N/A'}</p>
          <p><strong>Sales Person:</strong> ${sale.salesPerson || 'N/A'}</p>
        </div>
        
        <div class="customer-info">
          <h3>Bill To:</h3>
          <p><strong>${sale.customerName}</strong></p>
          ${sale.customerPhone ? `<p>Phone: ${sale.customerPhone}</p>` : ''}
        </div>
        
        <table>
          <thead>
            <tr>
              <th>Description</th>
              <th>Quantity</th>
              <th>Unit Price</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>${sale.type === 'service' ? sale.serviceType + ' Service' : sale.size + ' - ' + sale.brand + ' Tyre Fitting'}</td>
              <td>${sale.type === 'service' ? '1' : sale.quantity}</td>
              <td>£${formatMoney(sale.type === 'service' ? sale.price : sale.fittingPrice)}</td>
              <td>£${formatMoney(sale.total)}</td>
            </tr>
          </tbody>
        </table>
        
        <table class="totals-table">
          <tr>
            <td class="label">Subtotal:</td>
            <td class="amount">£${formatMoney(subtotal)}</td>
          </tr>
          ${isVATExempt ? '' : `
          <tr>
            <td class="label">VAT (20%):</td>
            <td class="amount">£${formatMoney(tax)}</td>
          </tr>
          `}
          <tr class="final-total">
            <td class="label">Total Amount:</td>
            <td class="amount">£${formatMoney(sale.total)}</td>
          </tr>
        </table>
        
        <div style="margin-top: 50px; text-align: center; color: #666;">
          <p>Thank you for your business!</p>
        </div>
      </body>
      </html>
    `;

    // Create blob and download
    const blob = new Blob([invoiceContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `invoice-${invoiceNumber}-${sale.customerName}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  // Stock search functionality
  function setupStockSearch() {
    const searchInput = document.getElementById('stock-size-search');
    
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        const searchQuery = e.target.value;
        renderStockTable(searchQuery);
      });
      
      // Clear search when switching views or after adding stock
      searchInput.addEventListener('blur', () => {
        if (!searchInput.value.trim()) {
          renderStockTable(); // Show all stock when search is empty
        }
      });
    }
  }

  // Calendar Management Functions
  let currentCalendarDate = new Date();
  let selectedCalendarDate = null;


  // Load appointments from local storage
  function loadAppointments() {
    const appointments = localStorage.getItem('tyreAppointments');
    return appointments ? JSON.parse(appointments) : [];
  }

  // Save appointments to local storage
  function saveAppointments(appointments) {
    localStorage.setItem('tyreAppointments', JSON.stringify(appointments));
  }









  // Generate calendar grid
  function generateCalendar(year, month) {
    // Update week navigation
    const currentWeekElement = document.getElementById('current-week');
    if (currentWeekElement) {
      const startOfWeek = getStartOfWeek(currentCalendarDate);
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(endOfWeek.getDate() + 6);
      
      currentWeekElement.textContent = `${startOfWeek.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })} - ${endOfWeek.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}`;
    }

    // Update day headers with dates
    const startOfWeek = getStartOfWeek(currentCalendarDate);
    const dayNames = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
    
    dayNames.forEach((dayName, index) => {
      const dateElement = document.getElementById(`${dayName}-date`);
      if (dateElement) {
        const date = new Date(startOfWeek);
        date.setDate(startOfWeek.getDate() + index);
        dateElement.textContent = date.getDate();
      }
    });

    // Clear existing appointment blocks
    dayNames.forEach(dayName => {
      const slotsElement = document.getElementById(`${dayName}-slots`);
      if (slotsElement) {
        slotsElement.innerHTML = '';
        
        // Create time slots
        for (let hour = 8; hour <= 19; hour++) {
          const slot = document.createElement('div');
          slot.className = 'day-slot';
          slot.dataset.hour = hour;
          slot.dataset.day = dayName;
          slotsElement.appendChild(slot);
        }
      }
    });

    // Load and display appointments
    loadAppointmentsForWeek(startOfWeek);
  }

  function getStartOfWeek(date) {
    const startOfWeek = new Date(date);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
    startOfWeek.setDate(diff);
    return startOfWeek;
  }

  function loadAppointmentsForWeek(startOfWeek) {
    const appointments = loadAppointments();
    const dayNames = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
    
    dayNames.forEach((dayName, index) => {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + index);
      const dateStr = date.toISOString().split('T')[0];
      
      const dayAppointments = appointments.filter(apt => apt.date === dateStr);
      
      dayAppointments.forEach(appointment => {
        const hour = parseInt(appointment.time.split(':')[0]);
        const slot = document.querySelector(`[data-day="${dayName}"][data-hour="${hour}"]`);
        
        if (slot) {
          const appointmentBlock = document.createElement('div');
          appointmentBlock.className = `appointment-block ${appointment.serviceType.toLowerCase().replace(' ', '-')}`;
          appointmentBlock.textContent = appointment.customerName;
          appointmentBlock.title = `${appointment.customerName} - ${appointment.serviceType} at ${appointment.time}`;
          appointmentBlock.onclick = () => showAppointmentDetails(appointment);
          slot.appendChild(appointmentBlock);
        }
      });
    });
  }

  function showAppointmentDetails(appointment) {
    // Create a simple modal or alert to show appointment details
    const details = `
      Customer: ${appointment.customerName}
      Phone: ${appointment.phone || 'N/A'}
      Service: ${appointment.serviceType}
      Time: ${appointment.time}
      Date: ${new Date(appointment.date).toLocaleDateString('en-GB')}
      Notes: ${appointment.notes || 'None'}
    `;
    
    if (confirm(`${details}\n\nDo you want to edit this appointment?`)) {
      editAppointment(appointment.id);
    }
  }

  // Show appointments for selected date
  function showAppointmentsForDate(date) {
    const appointmentsList = document.getElementById('appointments-list');
    const selectedDateTitle = document.getElementById('selected-date-title');
    
    if (!appointmentsList || !selectedDateTitle) return;

    const dateStr = date.toISOString().split('T')[0];
    const appointments = loadAppointments().filter(apt => apt.date === dateStr);
    
    selectedDateTitle.textContent = date.toLocaleDateString('en-GB', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });

    if (appointments.length === 0) {
      appointmentsList.innerHTML = '<p class="empty">No appointments for this date</p>';
      return;
    }

    appointmentsList.innerHTML = '';
    appointments.sort((a, b) => a.time.localeCompare(b.time));

    appointments.forEach(appointment => {
      const appointmentElement = document.createElement('div');
      appointmentElement.className = 'appointment-item';
      const convertToSaleButton = appointment.serviceType === 'Tyre Fitting' 
        ? `<button class="btn btn-primary" onclick="convertToSale('${appointment.id}')">Convert to Sale</button>`
        : '';
        
      appointmentElement.innerHTML = `
        <div class="appointment-header">
          <span class="appointment-time">${appointment.time}</span>
          <div class="appointment-actions">
            ${convertToSaleButton}
            <button class="btn btn-ghost" onclick="editAppointment('${appointment.id}')">Edit</button>
            <button class="btn btn-danger" onclick="deleteAppointment('${appointment.id}')">Delete</button>
          </div>
        </div>
        <div class="appointment-customer">${appointment.customerName}</div>
        <div class="appointment-service">${appointment.serviceType}</div>
        ${appointment.phone ? `<div class="appointment-phone">${appointment.phone}</div>` : ''}
        ${appointment.notes ? `<div class="appointment-notes">${appointment.notes}</div>` : ''}
      `;
      appointmentsList.appendChild(appointmentElement);
    });
  }

  // Add new appointment
  function addAppointment(appointmentData) {
    const appointments = loadAppointments();
    const newAppointment = {
      id: Date.now().toString(),
      ...appointmentData,
      createdAt: new Date().toISOString()
    };
    appointments.push(newAppointment);
    saveAppointments(appointments);
    
    // Refresh calendar and appointments list
    generateCalendar(currentCalendarDate.getFullYear(), currentCalendarDate.getMonth());
    if (selectedCalendarDate) {
      showAppointmentsForDate(selectedCalendarDate);
    }
    
    showToast('Appointment added successfully', 'success');
  }

  // Delete appointment
  window.deleteAppointment = function(appointmentId) {
    if (!confirm('Are you sure you want to delete this appointment?')) return;
    
    const appointments = loadAppointments();
    const filteredAppointments = appointments.filter(apt => apt.id !== appointmentId);
    saveAppointments(filteredAppointments);
    
    // Refresh calendar and appointments list
    generateCalendar(currentCalendarDate.getFullYear(), currentCalendarDate.getMonth());
    if (selectedCalendarDate) {
      showAppointmentsForDate(selectedCalendarDate);
    }
    
    showToast('Appointment deleted successfully', 'success');
  }

  // Convert appointment to sale
  window.convertToSale = function(appointmentId) {
    const appointments = loadAppointments();
    const appointment = appointments.find(apt => apt.id === appointmentId);
    if (!appointment) return;

    // Pre-fill the sales form with appointment data
    const salesForm = document.getElementById('sale-form');
    if (salesForm) {
      // Fill customer information
      document.getElementById('sale-customer-name').value = appointment.customerName;
      document.getElementById('sale-customer-phone').value = appointment.phone || '';
      
      // Set default fitting price based on service type
      let defaultPrice = 0;
      switch (appointment.serviceType) {
        case 'Tyre Fitting':
          defaultPrice = 15;
          break;
        case 'Tyre Change':
          defaultPrice = 25;
          break;
        case 'Wheel Alignment':
          defaultPrice = 45;
          break;
        case 'Brake Service':
          defaultPrice = 80;
          break;
        case 'MOT':
          defaultPrice = 54.85;
          break;
        default:
          defaultPrice = 20;
      }
      document.getElementById('sale-fitting-price').value = defaultPrice;
      
      // Set quantity to 1 by default
      document.getElementById('sale-quantity').value = 1;
      
      // Navigate to sales view
      showView('sales');
      showSalesView('create');
      
      showToast('Appointment data loaded into sales form', 'success');
    } else {
      showToast('Sales form not found', 'error');
    }
  };

  // Make functions globally accessible
  window.editAppointment = function(appointmentId) {
    const appointments = loadAppointments();
    const appointment = appointments.find(apt => apt.id === appointmentId);
    if (!appointment) return;

    // Pre-fill the form with existing data
    document.getElementById('appointment-date').value = appointment.date;
    document.getElementById('appointment-time').value = appointment.time;
    document.getElementById('appointment-customer').value = appointment.customerName;
    document.getElementById('appointment-phone').value = appointment.phone || '';
    document.getElementById('appointment-service').value = appointment.serviceType;
    document.getElementById('appointment-notes').value = appointment.notes || '';

    // Show modal
    document.getElementById('add-appointment-modal').style.display = 'flex';
    
    // Update form to edit mode
    const form = document.getElementById('add-appointment-form');
    form.dataset.editId = appointmentId;
    form.querySelector('button[type="submit"]').textContent = 'Update Appointment';
  }

  // Setup calendar navigation
  function setupCalendarNavigation() {
    const prevWeekBtn = document.getElementById('prev-week');
    const nextWeekBtn = document.getElementById('next-week');

    if (prevWeekBtn) {
      prevWeekBtn.addEventListener('click', () => {
        currentCalendarDate.setDate(currentCalendarDate.getDate() - 7);
        updateCalendarDisplay();
      });
    }

    if (nextWeekBtn) {
      nextWeekBtn.addEventListener('click', () => {
        currentCalendarDate.setDate(currentCalendarDate.getDate() + 7);
        updateCalendarDisplay();
      });
    }

    function updateCalendarDisplay() {
      generateCalendar(currentCalendarDate.getFullYear(), currentCalendarDate.getMonth());
    }

    // Initialize calendar display
    updateCalendarDisplay();
  }



  // Setup appointment modal
  function setupAppointmentModal() {
    const addAppointmentBtn = document.getElementById('add-appointment-btn');
    const appointmentModal = document.getElementById('add-appointment-modal');
    const closeModalBtn = document.getElementById('close-appointment-modal');
    const cancelBtn = document.getElementById('cancel-add-appointment');
    const appointmentForm = document.getElementById('add-appointment-form');

    if (addAppointmentBtn) {
      addAppointmentBtn.addEventListener('click', () => {
        // Reset form
        appointmentForm.reset();
        appointmentForm.removeAttribute('data-edit-id');
        appointmentForm.querySelector('button[type="submit"]').textContent = 'Add Appointment';
        
        // Set default date to today
        const defaultDate = new Date();
        document.getElementById('appointment-date').value = defaultDate.toISOString().split('T')[0];
        
        appointmentModal.style.display = 'flex';
      });
    }

    if (closeModalBtn) {
      closeModalBtn.addEventListener('click', () => {
        appointmentModal.style.display = 'none';
      });
    }

    if (cancelBtn) {
      cancelBtn.addEventListener('click', () => {
        appointmentModal.style.display = 'none';
      });
    }

    if (appointmentForm) {
      appointmentForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const formData = new FormData(appointmentForm);
        const appointmentData = {
          date: formData.get('date'),
          time: formData.get('time'),
          customerName: formatCustomerName(formData.get('customerName')),
          phone: formData.get('phone'),
          serviceType: formData.get('serviceType'),
          notes: formData.get('notes')
        };

        // Validate required fields
        if (!appointmentData.date || !appointmentData.time || !appointmentData.customerName || !appointmentData.serviceType) {
          showToast('Please fill in all required fields', 'error');
          return;
        }

        // Check if editing existing appointment
        const editId = appointmentForm.dataset.editId;
        if (editId) {
          // Update existing appointment
          const appointments = loadAppointments();
          const appointmentIndex = appointments.findIndex(apt => apt.id === editId);
          if (appointmentIndex !== -1) {
            appointments[appointmentIndex] = { ...appointments[appointmentIndex], ...appointmentData };
            saveAppointments(appointments);
            showToast('Appointment updated successfully', 'success');
          }
        } else {
          // Add new appointment
          addAppointment(appointmentData);
        }

        appointmentModal.style.display = 'none';
      });
    }

    // Close modal when clicking outside
    if (appointmentModal) {
      appointmentModal.addEventListener('click', (e) => {
        if (e.target === appointmentModal) {
          appointmentModal.style.display = 'none';
        }
      });
    }
  }

  // Initialize the app
  function init() {
    wireNavigation();
    
    // Form event listeners
    document.querySelector('#stock-form')?.addEventListener('submit', handleAddStockSubmit);
    document.querySelector('#sale-form')?.addEventListener('submit', handleSaleSubmit);
    document.querySelector('#service-form')?.addEventListener('submit', handleServiceSubmit);
    document.querySelector('#settings-form')?.addEventListener('submit', handleSettingsSubmit);
    
    // Setup special features
    setupSizeSearch();
    setupLogoUpload();
    populateSettingsForm();
    setupStockAuditModal();
    setupStockAdjustmentModal();
    setupCustomerNameFormatting(); // Initialize customer name formatting
    setupDateFiltering(); // Initialize date filtering
    setupSalesSearchFilters(); // Initialize sales search filters
    setupReportsRefresh(); // Initialize reports refresh
    setupBrandModal(); // Initialize brand modal
    setupSalesPersonModal(); // Initialize sales person modal
    setupCalendarNavigation(); // Initialize calendar navigation
    setupAppointmentModal(); // Initialize appointment modal

    setupStockSearch(); // Initialize stock search
    initializeDefaultBrands(); // Initialize default brands first
    initializeDefaultSalesPeople(); // Initialize default sales people
    populateBrandDropdowns(); // Then populate brand dropdowns
    populateSalesPersonDropdown(); // Populate sales person dropdown
    
    
    // Initialize brand select as disabled
    const brandSelect = document.getElementById('sale-brand');
    if (brandSelect) {
      brandSelect.disabled = true;
    }
    
    // Add clear button event listener for sales form
    const saleForm = document.getElementById('sale-form');
    if (saleForm) {
      const clearBtn = saleForm.querySelector('button[type="reset"]');
      if (clearBtn) {
        clearBtn.addEventListener('click', () => {
          // Reset brand dropdown to initial state
          const brandSelect = document.getElementById('sale-brand');
          brandSelect.innerHTML = '<option value="">Select a brand...</option>';
          brandSelect.disabled = true;
          
          // Reset payment method dropdown
          const paymentMethodSelect = document.getElementById('sale-payment-method');
          if (paymentMethodSelect) {
            paymentMethodSelect.value = '';
          }
          
          // Reset sales person dropdown
          const salesPersonSelect = document.getElementById('sale-person');
          if (salesPersonSelect) {
            salesPersonSelect.value = '';
          }
        });
      }
    }
    
    // Initial renders
    renderStockTable();
  }

  // Stock Audit Functions
  function setupStockAuditModal() {
    const modal = document.getElementById('stock-audit-modal');
    const closeBtn = document.getElementById('close-stock-audit-modal');
    const backBtn = document.getElementById('back-to-stock');
    
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
      });
    }
    
    if (backBtn) {
      backBtn.addEventListener('click', () => {
        modal.style.display = 'none';
      });
    }
    
    // Close modal when clicking outside
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          modal.style.display = 'none';
        }
      });
    }
  }

  function setupStockAdjustmentModal() {
    const modal = document.getElementById('stock-adjustment-modal');
    const closeBtn = document.getElementById('close-stock-adjustment-modal');
    const cancelBtn = document.getElementById('cancel-stock-adjustment');
    const reasonButtons = document.querySelectorAll('.adjustment-reason');
    
    if (closeBtn) {
      closeBtn.addEventListener('click', hideStockAdjustmentModal);
    }
    
    if (cancelBtn) {
      cancelBtn.addEventListener('click', hideStockAdjustmentModal);
    }
    
    // Handle reason selection
    reasonButtons.forEach(button => {
      button.addEventListener('click', () => {
        const reason = button.dataset.reason;
        processStockAdjustment(reason);
      });
    });
    
    // Close modal when clicking outside
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          hideStockAdjustmentModal();
        }
      });
    }
  }

  function showStockAudit(stockItem) {
    const modal = document.getElementById('stock-audit-modal');
    const content = document.getElementById('stock-audit-content');
    
    // Store current stock item for filtering
    window.currentAuditStockItem = stockItem;
    
    // Setup filter event listeners
    setupAuditFilters();
    
    // Generate initial audit content
    generateAuditContent(stockItem);
    
    modal.style.display = 'flex';
  }

  function setupAuditFilters() {
    const applyBtn = document.getElementById('apply-audit-filters');
    const clearBtn = document.getElementById('clear-audit-filters');
    
    if (applyBtn) {
      applyBtn.addEventListener('click', () => {
        generateAuditContent(window.currentAuditStockItem);
      });
    }
    
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        // Clear all date inputs
        document.getElementById('audit-sale-date-from').value = '';
        document.getElementById('audit-sale-date-to').value = '';
        document.getElementById('audit-purchase-date-from').value = '';
        document.getElementById('audit-purchase-date-to').value = '';
        
        // Regenerate content without filters
        generateAuditContent(window.currentAuditStockItem);
      });
    }
  }

  function generateAuditContent(stockItem) {
    const content = document.getElementById('stock-audit-content');
    
    // Get filter values
    const saleDateFrom = document.getElementById('audit-sale-date-from').value;
    const saleDateTo = document.getElementById('audit-sale-date-to').value;
    const purchaseDateFrom = document.getElementById('audit-purchase-date-from').value;
    const purchaseDateTo = document.getElementById('audit-purchase-date-to').value;
    
    // Get all sales for this specific tyre size and brand
    const sales = loadSales();
    let stockSales = sales.filter(sale => 
      sale.size === stockItem.size && 
      sale.brand === stockItem.brand && 
      sale.status === 'completed'
    );
    
    // Apply sale date filters
    if (saleDateFrom) {
      stockSales = stockSales.filter(sale => 
        new Date(sale.createdAt) >= new Date(saleDateFrom)
      );
    }
    if (saleDateTo) {
      stockSales = stockSales.filter(sale => 
        new Date(sale.createdAt) <= new Date(saleDateTo + 'T23:59:59')
      );
    }
    
    // Get stock history for this item (purchases, adjustments, and deletions)
    const stockHistory = getStockHistory(stockItem);
    let filteredStockHistory = stockHistory.filter(entry => entry.type === 'purchase' || entry.type === 'adjustment' || entry.type === 'deletion');
    
    // Apply purchase date filters
    if (purchaseDateFrom) {
      filteredStockHistory = filteredStockHistory.filter(entry => 
        new Date(entry.date) >= new Date(purchaseDateFrom)
      );
    }
    if (purchaseDateTo) {
      filteredStockHistory = filteredStockHistory.filter(entry => 
        new Date(entry.date) <= new Date(purchaseDateTo + 'T23:59:59')
      );
    }
    
    // Create audit content
    let auditHTML = `
      <div style="margin-bottom: 20px;">
        <h4>Stock Audit for ${stockItem.size} - ${stockItem.brand}</h4>
        <p><strong>Current Stock:</strong> ${stockItem.quantity} units</p>
        <p><strong>Current Net Price:</strong> £${formatMoney(stockItem.net)}</p>
      </div>
    `;
    
    // Combine and sort all transactions
    const allTransactions = [];
    
    // Add stock purchases, adjustments, and deletions
    filteredStockHistory.forEach(entry => {
      let description = '';
      let quantity = entry.quantity;
      
      if (entry.type === 'adjustment') {
        description = `Stock Adjustment (${entry.reason})`;
      } else if (entry.type === 'deletion') {
        description = `Stock Deleted (${entry.reason})`;
        quantity = -entry.quantity; // Negative for deletions
      } else {
        description = 'Stock Purchase';
      }
      
      allTransactions.push({
        type: entry.type,
        date: entry.date,
        quantity: quantity,
        unitCost: entry.netPrice,
        total: Math.abs(quantity) * entry.netPrice,
        description: description,
        runningQty: entry.runningQty
      });
    });
    
    // Add sales (only actual sales, not stock adjustments)
    stockSales.forEach(sale => {
      const subtotal = sale.total / 1.2; // Remove VAT to get subtotal
      const unitCost = subtotal / sale.quantity; // Calculate unit cost
      
      allTransactions.push({
        type: 'sale',
        date: sale.createdAt,
        quantity: -sale.quantity, // Negative for sales
        unitCost: unitCost,
        total: subtotal,
        description: `Sale to ${sale.customerName}`,
        invoiceNumber: generateInvoiceNumber(loadSettings().businessName, sale.saleNumber),
        runningQty: 0 // Will be calculated
      });
    });
    
    // Sort by date (newest first for display)
    allTransactions.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // Calculate running quantities (need to work backwards from current stock)
    // Use the actual current stock from the stockItem parameter
    let totalStock = stockItem.quantity;
    
    // Now calculate running quantities from newest to oldest
    let runningQty = totalStock;
    allTransactions.forEach(transaction => {
      transaction.runningQty = runningQty;
      // Subtract this transaction to get the running quantity before it
      if (transaction.type === 'purchase') {
        runningQty -= transaction.quantity;
      } else if (transaction.type === 'deletion') {
        runningQty -= transaction.quantity; // Already negative for deletions
      } else {
        runningQty -= transaction.quantity; // Already negative for sales
      }
    });
    
    if (allTransactions.length === 0) {
      auditHTML += '<p>No transactions recorded for this tyre size and brand.</p>';
    } else {
      auditHTML += `
        <div class="table-wrapper">
          <table class="table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Type</th>
                <th>Description</th>
                <th>Invoice Number</th>
                <th>Quantity</th>
                <th>Unit Cost (Pre-VAT)</th>
                <th>Subtotal (Post-VAT)</th>
                <th>Total Value (Inc VAT)</th>
                <th>Running Quantity</th>
              </tr>
            </thead>
            <tbody>
      `;
      
      allTransactions.forEach(transaction => {
        const totalWithVAT = transaction.total * 1.2;
        const quantityDisplay = transaction.quantity > 0 ? `+${transaction.quantity}` : transaction.quantity.toString();
        
        let backgroundColor, textColor, typeText;
        if (transaction.type === 'purchase') {
          backgroundColor = 'rgba(0, 255, 0, 0.1)';
          textColor = 'green';
          typeText = 'PURCHASE';
        } else if (transaction.type === 'adjustment') {
          backgroundColor = 'rgba(128, 128, 128, 0.1)';
          textColor = 'grey';
          typeText = 'ADJUSTMENT';
        } else if (transaction.type === 'deletion') {
          backgroundColor = 'rgba(255, 165, 0, 0.1)';
          textColor = 'orange';
          typeText = 'DELETED';
        } else {
          backgroundColor = 'rgba(255, 0, 0, 0.1)';
          textColor = 'red';
          typeText = 'SALE';
        }
        
        auditHTML += `
          <tr style="background-color: ${backgroundColor};">
            <td>${formatDate(transaction.date)}</td>
            <td style="font-weight: bold; color: ${textColor};">
              ${typeText}
            </td>
            <td>${transaction.description}</td>
            <td>${transaction.invoiceNumber || 'N/A'}</td>
            <td>${quantityDisplay}</td>
            <td>£${formatMoney(transaction.unitCost)}</td>
            <td>£${formatMoney(transaction.total)}</td>
            <td>£${formatMoney(totalWithVAT)}</td>
            <td style="font-weight: bold;">${transaction.runningQty}</td>
          </tr>
        `;
      });
      
      auditHTML += `
            </tbody>
          </table>
        </div>
      `;
    }
    
    content.innerHTML = auditHTML;
  }

  function getStockHistory(stockItem) {
    // Load stock history from localStorage
    const stockHistory = JSON.parse(localStorage.getItem('tyreAppStockHistory') || '[]');
    
    // Filter history for this specific stock item
    return stockHistory.filter(entry => 
      entry.size === stockItem.size && 
      entry.brand === stockItem.brand
    );
  }

  function addStockHistoryEntry(size, brand, quantity, netPrice, type = 'purchase', reason = null) {
    const stockHistory = JSON.parse(localStorage.getItem('tyreAppStockHistory') || '[]');
    
    stockHistory.push({
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      size,
      brand,
      quantity,
      netPrice,
      type,
      reason,
      date: new Date().toISOString(),
      createdAt: new Date().toISOString()
    });
    
    localStorage.setItem('tyreAppStockHistory', JSON.stringify(stockHistory));
  }

  // Boot
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();


