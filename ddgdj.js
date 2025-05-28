<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap');
  * {
    box-sizing: border-box;
    font-family: 'Inter', sans-serif;
    margin: 0;
    padding: 0;
  }
  .invoice {
    width: 100%;
    max-width: 21cm;
    min-height: 29.7cm;
    padding: 1.5cm;
    margin: 0 auto;
    background: #fff;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
  }
  .header {
    text-align: center;
    margin-bottom: 1.5rem;
  }
  .header h1 {
    font-size: 2.2rem;
    color: #2e3a59;
    font-weight: 600;
  }
  .section {
    margin-bottom: 1.5rem;
  }
  .section label {
    display: block;
    font-weight: 600;
    color: #333;
    margin-bottom: 0.5rem;
  }
  .section input,
  .section textarea {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #ccc;
    border-radius: 6px;
    margin-bottom: 1rem;
    transition: border 0.3s;
  }
  .section input:focus,
  .section textarea:focus {
    border-color: #4f46e5;
    outline: none;
  }
  .item-table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 1.5rem;
  }
  .item-table th,
  .item-table td {
    border: 1px solid #e5e7eb;
    padding: 0.75rem;
    text-align: left;
    font-size: 0.95rem;
  }
  .item-table th {
    background: #f9fafb;
    color: #111827;
  }
  .totals {
    text-align: right;
    font-weight: 600;
    color: #1f2937;
    margin-top: 1rem;
  }
  .btn {
    padding: 0.75rem 1.5rem;
    background: linear-gradient(to right, #6366f1, #4f46e5);
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-size: 1rem;
    font-weight: 600;
    transition: background 0.3s, transform 0.2s;
  }
  .btn:hover {
    background: linear-gradient(to right, #4f46e5, #4338ca);
    transform: translateY(-2px);
  }
  .btn:active {
    transform: translateY(0);
  }
  .footer {
    text-align: center;
    font-size: 0.9rem;
    color: #6b7280;
    margin-top: 2rem;
  }
  @media print {
    body * {
      visibility: hidden;
    }
    .invoice, .invoice * {
      visibility: visible;
    }
    .invoice {
      position: absolute;
      left: 0;
      top: 0;
      width: 100% !important;
      max-width: 100% !important;
      margin: 0 !important;
      padding: 0 !important;
      box-shadow: none;
      border-radius: 0;
    }
  }
</style>

<div class="invoice">
  <div class="header">
    <h1>Invoice Maker Pro</h1>
  </div>

  <div class="section">
    <label for="invoice-to">Invoice To</label>
    <input type="text" id="invoice-to" placeholder="Nama atau perusahaan">
  </div>

  <div class="section">
    <label for="description">Deskripsi</label>
    <textarea id="description" rows="3" placeholder="Deskripsi layanan atau produk"></textarea>
  </div>

  <div class="section">
    <label for="items">Item</label>
    <table class="item-table">
      <thead>
        <tr>
          <th>Nama Item</th>
          <th>Jumlah</th>
          <th>Harga</th>
          <th>Total</th>
        </tr>
      </thead>
      <tbody id="item-body">
        <tr>
          <td><input type="text" placeholder="Contoh: Jersey Custom"></td>
          <td><input type="number" placeholder="1"></td>
          <td><input type="number" placeholder="50000"></td>
          <td>0</td>
        </tr>
      </tbody>
    </table>
    <button class="btn" onclick="addItem()">Tambah Item</button>
  </div>

  <div class="totals">
    <p>Total: Rp <span id="total-amount">0</span></p>
  </div>

  <div style="text-align:center; margin-top: 2rem;">
    <button class="btn" onclick="downloadPDF()">Download PDF</button>
  </div>

  <div class="footer">
    Dibuat oleh MRH | www.mrhgraphix.com
  </div>
</div>

<script>
  function addItem() {
    const table = document.getElementById('item-body');
    const row = document.createElement('tr');
    row.innerHTML = `
      <td><input type="text" placeholder="Nama item"></td>
      <td><input type="number" placeholder="1"></td>
      <td><input type="number" placeholder="50000"></td>
      <td>0</td>
    `;
    table.appendChild(row);
    updateTotal();
    saveData();
  }

  function updateTotal() {
    let total = 0;
    const rows = document.querySelectorAll('#item-body tr');
    rows.forEach(row => {
      const qty = row.cells[1].querySelector('input').value;
      const price = row.cells[2].querySelector('input').value;
      const totalCell = row.cells[3];
      const subtotal = (parseFloat(qty) || 0) * (parseFloat(price) || 0);
      totalCell.textContent = subtotal.toLocaleString();
      total += subtotal;
    });
    document.getElementById('total-amount').textContent = total.toLocaleString();
  }

  function saveData() {
    const data = {
      invoiceTo: document.getElementById('invoice-to').value,
      description: document.getElementById('description').value,
      items: Array.from(document.querySelectorAll('#item-body tr')).map(row => {
        return {
          name: row.cells[0].querySelector('input').value,
          qty: row.cells[1].querySelector('input').value,
          price: row.cells[2].querySelector('input').value
        };
      })
    };
    localStorage.setItem('invoiceData', JSON.stringify(data));
  }

  function loadData() {
    const data = JSON.parse(localStorage.getItem('invoiceData'));
    if (!data) return;
    document.getElementById('invoice-to').value = data.invoiceTo || '';
    document.getElementById('description').value = data.description || '';
    const tableBody = document.getElementById('item-body');
    tableBody.innerHTML = '';
    data.items.forEach(item => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td><input type="text" value="${item.name || ''}"></td>
        <td><input type="number" value="${item.qty || 0}"></td>
        <td><input type="number" value="${item.price || 0}"></td>
        <td>0</td>
      `;
      tableBody.appendChild(row);
    });
    updateTotal();
  }

  document.addEventListener('input', () => {
    updateTotal();
    saveData();
  });

  window.onload = () => {
    loadData();
    updateTotal();
  };

  function downloadPDF() {
    window.print();
  }
</script>
