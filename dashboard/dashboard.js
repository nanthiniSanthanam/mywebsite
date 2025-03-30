// Global state variables
let timeRange = "month";
let activeTab = "sales";
let loading = true;
let error = "";
let data = {}; // will hold { sales: [...], visitors: [...] }
let salesTotal = 0;
let visitorTotal = 0;
let conversionRate = 0;

// Generate fake data based on type and time range
function generateFakeData(type, range) {
  let result = [];
  let labels = [];
  const maxValue = type === "sales" ? 5000 : 10000;
  const minValue = type === "sales" ? 1000 : 3000;
  
  if (range === "week") {
    labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  } else if (range === "month") {
    labels = Array.from({ length: 30 }, (_, i) => (i + 1).toString());
  } else if (range === "year") {
    labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  } else {
    labels = Array.from({ length: 30 }, (_, i) => (i + 1).toString());
  }
  
  labels.forEach((label) => {
    result.push({
      label,
      value: Math.floor(Math.random() * (maxValue - minValue) + minValue)
    });
  });
  
  return result;
}

// Render a simple bar chart on a given canvas element
function renderSimpleBarChart(canvasId, chartData) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  
  const ctx = canvas.getContext("2d");
  const width = canvas.width;
  const height = canvas.height;
  const barWidth = width / chartData.length - 2;
  
  // Clear canvas
  ctx.clearRect(0, 0, width, height);
  
  // Determine scaling factor based on maximum value
  const maxValue = Math.max(...chartData.map(item => item.value));
  
  chartData.forEach((item, index) => {
    const barHeight = (item.value / maxValue) * (height - 40);
    const x = index * (barWidth + 2) + 10;
    const y = height - barHeight - 25;
    
    // Choose bar color based on canvas id
    ctx.fillStyle = (canvasId === "salesChart") ? "#3498db" : "#2ecc71";
    ctx.fillRect(x, y, barWidth, barHeight);
    
    // Draw label and value
    ctx.fillStyle = "#333";
    ctx.font = "8px Arial";
    ctx.textAlign = "center";
    ctx.fillText(item.label, x + barWidth / 2, height - 10);
    ctx.fillText(item.value, x + barWidth / 2, y - 5);
  });
}

// Initialize charts for both sales and visitors
function initializeCharts(salesData, visitorData) {
  renderSimpleBarChart("salesChart", salesData);
  renderSimpleBarChart("visitorChart", visitorData);
}

// Fetch and process dashboard data (simulated with setTimeout)
function fetchDashboardData() {
  loading = true;
  updateDashboardContent();
  
  setTimeout(() => {
    try {
      const salesData = generateFakeData("sales", timeRange);
      const visitorData = generateFakeData("visitors", timeRange);
      
      data = {
        sales: salesData,
        visitors: visitorData
      };
      
      salesTotal = salesData.reduce((sum, item) => sum + item.value, 0);
      visitorTotal = visitorData.reduce((sum, item) => sum + item.value, 0);
      conversionRate = ((salesTotal / visitorTotal) * 100).toFixed(2);
      
      loading = false;
      error = "";
      updateDashboardContent();
      
      // If the active tab is sales or visitors, render the chart(s)
      if (activeTab === "sales") {
        renderSimpleBarChart("salesChart", salesData);
      } else if (activeTab === "visitors") {
        renderSimpleBarChart("visitorChart", visitorData);
      }
    } catch (e) {
      error = "Failed to load dashboard data. Please try again later.";
      loading = false;
      updateDashboardContent();
    }
  }, 1500);
}

// Update the dashboard content based on current state
function updateDashboardContent() {
  const container = document.getElementById("dashboard-content");
  
  if (loading) {
    container.innerHTML = `
      <div class="loading-container">
        <div class="loading-spinner"></div>
        <p>Loading dashboard data...</p>
      </div>
    `;
    return;
  }
  
  if (error) {
    container.innerHTML = `<div class="error-message">${error}</div>`;
    return;
  }
  
  // Metrics Overview Section
  const metricsHTML = `
    <div class="metrics-overview">
      <div class="metric-card">
        <h3>Total Sales</h3>
        <div class="metric-value">$${salesTotal.toLocaleString()}</div>
        <div class="metric-trend positive">+12.5% from previous period</div>
      </div>
      <div class="metric-card">
        <h3>Total Visitors</h3>
        <div class="metric-value">${visitorTotal.toLocaleString()}</div>
        <div class="metric-trend positive">+8.3% from previous period</div>
      </div>
      <div class="metric-card">
        <h3>Conversion Rate</h3>
        <div class="metric-value">${conversionRate}%</div>
        <div class="metric-trend negative">-2.1% from previous period</div>
      </div>
    </div>
  `;
  
  // Tab Buttons (Sales, Visitors, Products)
  const tabButtonsHTML = `
    <div class="tab-buttons">
      <button onclick="setActiveTab('sales')" class="${activeTab === 'sales' ? 'active' : ''}">Sales</button>
      <button onclick="setActiveTab('visitors')" class="${activeTab === 'visitors' ? 'active' : ''}">Visitors</button>
      <button onclick="setActiveTab('products')" class="${activeTab === 'products' ? 'active' : ''}">Products</button>
    </div>
  `;
  
  // Tab Content (changes based on activeTab)
  let tabContentHTML = "";
  
  if (activeTab === "sales") {
    tabContentHTML = `
      <div class="chart-container">
        <h3>Sales Overview</h3>
        <canvas id="salesChart" width="600" height="300"></canvas>
        <div class="data-table">
          <h4>Top Sales Channels</h4>
          <table>
            <thead>
              <tr>
                <th>Channel</th>
                <th>Revenue</th>
                <th>Growth</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Website Direct</td>
                <td>$24,500</td>
                <td class="positive">+15.3%</td>
              </tr>
              <tr>
                <td>Mobile App</td>
                <td>$18,200</td>
                <td class="positive">+22.7%</td>
              </tr>
              <tr>
                <td>Social Media</td>
                <td>$12,800</td>
                <td class="negative">-5.1%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    `;
  } else if (activeTab === "visitors") {
    tabContentHTML = `
      <div class="chart-container">
        <h3>Visitor Traffic</h3>
        <canvas id="visitorChart" width="600" height="300"></canvas>
        <div class="data-table">
          <h4>Traffic Sources</h4>
          <table>
            <thead>
              <tr>
                <th>Source</th>
                <th>Visitors</th>
                <th>Conversion</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Organic Search</td>
                <td>45,230</td>
                <td>3.2%</td>
              </tr>
              <tr>
                <td>Social Media</td>
                <td>32,110</td>
                <td>2.7%</td>
              </tr>
              <tr>
                <td>Direct Traffic</td>
                <td>18,640</td>
                <td>4.5%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    `;
  } else if (activeTab === "products") {
    tabContentHTML = `
      <div class="data-table">
        <h3>Top Products</h3>
        <table>
          <thead>
            <tr>
              <th>Product Name</th>
              <th>Category</th>
              <th>Sales</th>
              <th>Revenue</th>
              <th>Stock</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Premium Widget Pro</td>
              <td>Electronics</td>
              <td>235</td>
              <td>$11,750</td>
              <td class="high">In Stock</td>
            </tr>
            <tr>
              <td>Super Gadget XL</td>
              <td>Electronics</td>
              <td>187</td>
              <td>$9,350</td>
              <td class="medium">Low Stock</td>
            </tr>
            <tr>
              <td>Deluxe Service Package</td>
              <td>Services</td>
              <td>162</td>
              <td>$8,100</td>
              <td class="high">Available</td>
            </tr>
            <tr>
              <td>Basic Widget</td>
              <td>Electronics</td>
              <td>145</td>
              <td>$3,625</td>
              <td class="low">Out of Stock</td>
            </tr>
            <tr>
              <td>Premium Support Plan</td>
              <td>Services</td>
              <td>112</td>
              <td>$5,600</td>
              <td class="high">Available</td>
            </tr>
          </tbody>
        </table>
      </div>
    `;
  }
  
  // Export Section (static buttons)
  const exportHTML = `
    <div class="export-section">
      <h3>Export Data</h3>
      <div class="export-options">
        <button class="export-button">Export as CSV</button>
        <button class="export-button">Export as PDF</button>
        <button class="export-button">Print Report</button>
      </div>
    </div>
  `;
  
  // Combine all sections into one HTML string
  container.innerHTML = metricsHTML + 
                        `<div class="dashboard-tabs">` +
                          tabButtonsHTML +
                          `<div class="tab-content">${tabContentHTML}</div>` +
                        `</div>` +
                        exportHTML;
}

// Function to change the active tab and update the view
function setActiveTab(tab) {
  activeTab = tab;
  updateDashboardContent();
  // If switching to sales or visitors, re-render the chart on the corresponding canvas
  if (activeTab === "sales") {
    renderSimpleBarChart("salesChart", data.sales);
  } else if (activeTab === "visitors") {
    renderSimpleBarChart("visitorChart", data.visitors);
  }
}

// Set up event listeners once the DOM is ready
document.addEventListener("DOMContentLoaded", function () {
  // Time range buttons
  document.getElementById("btn-week").addEventListener("click", function () {
    timeRange = "week";
    fetchDashboardData();
  });
  document.getElementById("btn-month").addEventListener("click", function () {
    timeRange = "month";
    fetchDashboardData();
  });
  document.getElementById("btn-year").addEventListener("click", function () {
    timeRange = "year";
    fetchDashboardData();
  });
  
  // Initially fetch the dashboard data
  fetchDashboardData();
});
