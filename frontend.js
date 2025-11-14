const API_URL = 'http://localhost:5000/api';
let token = localStorage.getItem('token');

async function signup(){
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const res = await fetch(`${API_URL}/auth/signup`,{
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify({name,email,password})
  });
  const data = await res.json();
  if(data.token){ localStorage.setItem('token',data.token); window.location.href='dashboard.html'; }
}

async function login(){
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const res = await fetch(`${API_URL}/auth/login`,{
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify({email,password})
  });
  const data = await res.json();
  if(data.token){ localStorage.setItem('token',data.token); window.location.href='dashboard.html'; }
}

function logout(){ localStorage.removeItem('token'); window.location.href='login.html'; }

// Dashboard
async function loadDashboard(){
  if(!token) return window.location.href='login.html';
  const headers = {'Authorization':token};

  const clients = await (await fetch(`${API_URL}/clients`,{headers})).json();
  const invoices = await (await fetch(`${API_URL}/invoices`,{headers})).json();
  const expenses = await (await fetch(`${API_URL}/expenses`,{headers})).json();

  document.getElementById('clientCount').innerText = clients.length;
  document.getElementById('invoiceCount').innerText = invoices.length;
  const totalIncome = invoices.reduce((a,b)=>a+b.amount,0);
  document.getElementById('totalIncome').innerText = `R${totalIncome}`;
  const totalExpenses = expenses.reduce((a,b)=>a+b.amount,0);
  document.getElementById('totalExpenses').innerText = `R${totalExpenses}`;

  // Recent Activity
  const recent = [...invoices,...expenses].sort((a,b)=>new Date(b.created_at)-new Date(a.created_at)).slice(0,5);
  const activity = document.getElementById('recentActivity');
  recent.forEach(item=>{
    const li = document.createElement('li');
    li.innerText = item.title || item.name;
    activity.appendChild(li);
  });

  // Chart
  const ctx = document.getElementById('incomeChart').getContext('2d');
  new Chart(ctx,{
    type:'bar',
    data:{
      labels:['Income','Expenses'],
      datasets:[{
        label:'Rands',
        data:[totalIncome,totalExpenses],
        backgroundColor:['#27ae60','#e74c3c']
      }]
    }
  });
}
if(document.getElementById('incomeChart')) loadDashboard();

// AI Widget
function toggleAI(){
  const box = document.getElementById('aiBox');
  box.style.display = box.style.display==='none'?'block':'none';
}
async function askAI(){
  const input = document.getElementById('aiInput');
  const question = input.value;
  const res = await fetch(`${API_URL}/ai`,{
    method:'POST',
    headers:{'Content-Type':'application/json','Authorization':token},
    body:JSON.stringify({question})
  });
  const data = await res.json();
  const messages = document.getElementById('aiMessages');
  const div = document.createElement('div');
  div.innerText = `Q: ${question}\nA: ${data.answer}`;
  messages.appendChild(div);
  input.value='';
}

async function loadInvoices(){
  if(!token) return;
  const headers = {'Authorization': token};
  const invoices = await (await fetch(`${API_URL}/invoices`, {headers})).json();
  const invoiceList = document.getElementById('invoiceList');
  invoiceList.innerHTML='';
  invoices.forEach(inv => {
    const li = document.createElement('li');
    li.innerHTML = `
      ${inv.title} - R${inv.amount} - ${inv.status}
      <button onclick="sendInvoice(${inv.id})">Send</button>
      <button onclick="payInvoice(${inv.id})">Pay</button>
    `;
    invoiceList.appendChild(li);
  });
}

async function sendInvoice(invoiceId){
  alert(`Invoice ${invoiceId} sent via Email/WhatsApp (simulated).`);
  // Here you can call backend email sender util
  // fetch(`${API_URL}/send-invoice/${invoiceId}`,{method:'POST',headers:{'Authorization':token}});
}

async function payInvoice(invoiceId){
  // Fetch payment links
  const res = await fetch(`${API_URL}/payments`, {headers:{'Authorization':token}});
  const links = await res.json();
  const options = `Choose payment: \n1. PayFast\n2. Yoco\n3. SnapScan`;
  const choice = prompt(options);
  if(choice==='1') window.open(links.payfast, '_blank');
  if(choice==='2') window.open(links.yoco, '_blank');
  if(choice==='3') window.open(links.snapscan, '_blank');
}

async function previewInvoice(id){
  // refresh token (in case it changed)
  token = localStorage.getItem('token');
  const headers = {'Authorization': token};
  const res = await fetch(`${API_URL}/invoices`, {headers});
  if(!res.ok) { alert('Failed to load invoices'); return; }
  const invoices = await res.json();
  const inv = invoices.find(i => i.id === id);
  if(!inv){ alert('Invoice not found'); return; }

  const template = document.getElementById('invoice-template');
  template.innerHTML = `
  <h2>Invoice: ${inv.title}</h2>
  <p>Client: ${inv.client_id}</p>
  <p>Amount: ${inv.amount}</p>
  <p>Status: ${inv.status}</p>
  <p>Date: ${new Date(inv.created_at).toLocaleDateString()}</p>
  `;
  template.style.display = 'block';
}

function postBlog(){
  const title = document.getElementById('blogTitle').value;
  const content = document.getElementById('blogContent').value;
  alert(`Blog "${title}" posted! (Simulated)`);
  loadBlog();
}

function loadBlog(){
  const list = document.getElementById('blogList');
  list.innerHTML='';
  // Simulated posts
  const posts = [
    {title:'Funding Guide','content':'How SMEs can get funding...'},
    {title:'Marketing Tips','content':'Grow your business with AI...'}
  ];
  posts.forEach(p=>{
    const li=document.createElement('li');
    li.innerHTML=`<strong>${p.title}</strong>: ${p.content}`;
    list.appendChild(li);
  });
}
loadBlog();
