/* ==========================================
   1. CONFIGURATION & STATE
   ========================================== */
const firebaseConfig = {
    apiKey: "AIzaSyBp4MhCmcq5091W0WOkYKv0UehiDgyeJkw",
    authDomain: "fashion-store-1d981.firebaseapp.com",
    projectId: "fashion-store-1d981",
    storageBucket: "fashion-store-1d981.firebasestorage.app",
    messagingSenderId: "686134430796",
    appId: "1:686134430796:web:499c5692828ba0768bb8e9"
};

if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
const googleProvider = new firebase.auth.GoogleAuthProvider();

let cart = JSON.parse(localStorage.getItem('vogue_cart')) || [];
let selectedProduct = null;
let currentDetailQty = 1;
let currentActiveGroup = 'essentials'; 
let editingProductId = null;

// NEW ADMIN EMAIL
const ADMIN_EMAIL = "pparu97622@gmail.com";

/* ==========================================
   2. THE PRODUCT DATABASE (48 ITEMS)
   ========================================== */
const PRODUCTS = {
    essentials: [
        { id: 'e1', name: 'Signature Trench', price: 2100, cat: 'women', stock: 5, img: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800' },
        { id: 'e2', name: 'Wool Overcoat', price: 1850, cat: 'men', stock: 3, img: 'https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=800' },
        { id: 'e3', name: 'Poplin Shirt', price: 350, cat: 'men', stock: 12, img: 'https://images.unsplash.com/photo-1598033129183-c4f50c7176c8?w=800' },
        { id: 'e4', name: 'Black Trouser', price: 650, cat: 'women', stock: 8, img: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800' },
        { id: 'e5', name: 'Merino Knit', price: 420, cat: 'women', stock: 15, img: 'https://images.unsplash.com/photo-1556905505-8751f153f221?w=800' },
        { id: 'e6', name: 'Chelsea Boot', price: 890, cat: 'men', stock: 6, img: 'https://images.unsplash.com/photo-1638247025967-b4e38f787b76?w=800' },
        { id: 'e7', name: 'Silk Blouse', price: 550, cat: 'women', stock: 10, img: 'https://images.unsplash.com/photo-1624227233472-35e6c703e2c3?w=800' },
        { id: 'e8', name: 'Oxford Shoes', price: 950, cat: 'men', stock: 4, img: 'https://images.unsplash.com/photo-1614252329473-48810206c9bc?w=800' },
        { id: 'e9', name: 'Dinner Jacket', price: 2900, cat: 'men', stock: 2, img: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800' },
        { id: 'e10', name: 'Cable Sweater', price: 780, cat: 'women', stock: 9, img: 'https://images.unsplash.com/photo-1574201635302-388dd92a4c3f?w=800' },
        { id: 'e11', name: 'Fitted Blazer', price: 1400, cat: 'women', stock: 7, img: 'https://images.unsplash.com/photo-1548142813-c348350df52b?w=800' },
        { id: 'e12', name: 'Linen Shirt', price: 320, cat: 'men', stock: 20, img: 'https://images.unsplash.com/photo-1596755094514-f87034a26cc1?w=800' }
    ],
    silk: [
        { id: 's1', name: 'Satin Dress', price: 980, cat: 'women', stock: 4, img: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800' },
        { id: 's2', name: 'Palazzo Pant', price: 1100, cat: 'women', stock: 6, img: 'https://images.unsplash.com/photo-1502716119720-b23a93e5fe1b?w=800' },
        { id: 's3', name: 'Silk Men Shirt', price: 650, cat: 'men', stock: 10, img: 'https://images.unsplash.com/photo-1593032465175-481ac7f401a0?w=800' },
        { id: 's4', name: 'Pashmina Wrap', price: 1400, cat: 'women', stock: 15, img: 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=800' },
        { id: 's5', name: 'Silk Scarf', price: 420, cat: 'unisex', stock: 30, img: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800' },
        { id: 's6', name: 'Silk Cami', price: 350, cat: 'women', stock: 12, img: 'https://images.unsplash.com/photo-1551163943-3f6a855d1153?w=800' },
        { id: 's7', name: 'Kimono Robe', price: 1250, cat: 'women', stock: 3, img: 'https://images.unsplash.com/photo-1566206091558-7f218b696731?w=800' },
        { id: 's8', name: 'Silk Trousers', price: 890, cat: 'men', stock: 8, img: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800' },
        { id: 's9', name: 'Emerald Slip', price: 1100, cat: 'women', stock: 5, img: 'https://images.unsplash.com/photo-1568252542512-9fe8fe9c87bb?w=800' },
        { id: 's10', name: 'Silk Tie', price: 195, cat: 'men', stock: 50, img: 'https://images.unsplash.com/photo-1589756823851-41e53b3c4265?w=800' },
        { id: 's11', name: 'Floral Silk Gown', price: 3200, cat: 'women', stock: 2, img: 'https://images.unsplash.com/photo-1518049362265-d5b2a6467637?w=800' },
        { id: 's12', name: 'Raw Silk Vest', price: 450, cat: 'men', stock: 10, img: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?w=800' }
    ],
    accessories: [
        { id: 'a1', name: 'Gold Bracelet', price: 4200, cat: 'women', stock: 2, img: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800' },
        { id: 'a2', name: 'Leather Tote', price: 2850, cat: 'women', stock: 5, img: 'https://images.unsplash.com/photo-1584917033904-493bb3c3d0b2?w=800' },
        { id: 'a3', name: 'Aviator Lens', price: 450, cat: 'unisex', stock: 15, img: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800' },
        { id: 'a4', name: 'Gold Hoops', price: 1200, cat: 'women', stock: 20, img: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800' },
        { id: 'a5', name: 'Chronograph', price: 12400, cat: 'men', stock: 3, img: 'https://images.unsplash.com/photo-1524592091214-8c6ca0ad061a?w=800' },
        { id: 'a6', name: 'Leather Belt', price: 380, cat: 'men', stock: 10, img: 'https://images.unsplash.com/photo-1624222247344-550fb8ec5522?w=800' },
        { id: 'a7', name: 'Clutch Bag', price: 1600, cat: 'women', stock: 4, img: 'https://images.unsplash.com/photo-1566150905458-1bf1fd113f0d?w=800' },
        { id: 'a8', name: 'Silk Pocket Square', price: 85, cat: 'men', stock: 40, img: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=800' },
        { id: 'a9', name: 'Diamond Studs', price: 8500, cat: 'women', stock: 1, img: 'https://images.unsplash.com/photo-1588444837495-c6cfaf50c8a9?w=800' },
        { id: 'a10', name: 'Cufflinks', price: 450, cat: 'men', stock: 15, img: 'https://images.unsplash.com/photo-1615655096345-64a0ce7c78ba?w=800' },
        { id: 'a11', name: 'Straw Hat', price: 290, cat: 'unisex', stock: 25, img: 'https://images.unsplash.com/photo-1521369909029-2afed882baee?w=800' },
        { id: 'a12', name: 'Leather Gloves', price: 350, cat: 'unisex', stock: 12, img: 'https://images.unsplash.com/photo-1543330657-3510309d7380?w=800' }
    ],
    seasonal: [
        { id: 'se1', name: 'Alpine Parka', price: 3400, cat: 'men', stock: 3, img: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800' },
        { id: 'se2', name: 'Shearling Coat', price: 4200, cat: 'women', stock: 2, img: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=800' },
        { id: 'se3', name: 'Cashmere Beanie', price: 180, cat: 'unisex', stock: 50, img: 'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=800' },
        { id: 'se4', name: 'Ski Goggles', price: 450, cat: 'unisex', stock: 10, img: 'https://images.unsplash.com/photo-1551698618-1fed5d978044?w=800' },
        { id: 'se5', name: 'Snow Boots', price: 890, cat: 'unisex', stock: 8, img: 'https://images.unsplash.com/photo-1511556820780-d912e42b4980?w=800' },
        { id: 'se6', name: 'Velvet Blazer', price: 1200, cat: 'men', stock: 5, img: 'https://images.unsplash.com/photo-1594932224828-b4b059bdbf6f?w=800' },
        { id: 'se7', name: 'Linen Shorts', price: 190, cat: 'men', stock: 30, img: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=800' },
        { id: 'se8', name: 'Swimsuit', price: 350, cat: 'women', stock: 20, img: 'https://images.unsplash.com/photo-1502323777036-f29e3972d82f?w=800' },
        { id: 'se9', name: 'Sun Hat', price: 150, cat: 'women', stock: 15, img: 'https://images.unsplash.com/photo-1572307480813-ceb0e59d8325?w=800' },
        { id: 'se10', name: 'Beach Towel', price: 95, cat: 'unisex', stock: 100, img: 'https://images.unsplash.com/photo-1621274220348-4122bc08375e?w=800' },
        { id: 'se11', name: 'Holiday Kaftan', price: 650, cat: 'women', stock: 10, img: 'https://images.unsplash.com/photo-1589156229687-496a31ad1d1f?w=800' },
        { id: 'se12', name: 'Tropical Shirt', price: 280, cat: 'men', stock: 25, img: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800' }
    ]
};

const getFlatProducts = () => Object.values(PRODUCTS).flat();

/* ==========================================
   3. NAVIGATION & UI LOGIC
   ========================================== */
function showLanding() {
    document.getElementById('landing-page').classList.remove('hidden');
    document.getElementById('main-app').classList.add('hidden');
    document.getElementById('admin-dashboard').classList.add('hidden');
    document.getElementById('user-dashboard').classList.add('hidden');
    window.scrollTo(0,0);
}

function showDashboard(group) {
    currentActiveGroup = group;
    document.getElementById('landing-page').classList.add('hidden');
    document.getElementById('admin-dashboard').classList.add('hidden');
    document.getElementById('user-dashboard').classList.add('hidden');
    document.getElementById('main-app').classList.remove('hidden');
    document.getElementById('category-title').innerText = group.toUpperCase();
    loadProductsByGroup(group);
    window.scrollTo(0,0);
}

function openFullDashboard() {
    document.getElementById('landing-page').classList.add('hidden');
    document.getElementById('main-app').classList.add('hidden');
    document.getElementById('admin-dashboard').classList.add('hidden');
    document.getElementById('user-dashboard').classList.remove('hidden');
}

function openAdminBackstage() {
    document.getElementById('landing-page').classList.add('hidden');
    document.getElementById('main-app').classList.add('hidden');
    document.getElementById('user-dashboard').classList.add('hidden');
    document.getElementById('admin-dashboard').classList.remove('hidden');
    syncAdminInventory();
}

async function loadProductsByGroup(group, filter = 'all') {
    const grid = document.getElementById('product-grid');
    grid.innerHTML = '<p class="loading-text">REFINING COLLECTION...</p>';

    let firebaseItems = [];
    try {
        const snapshot = await db.collection("products").where("group", "==", group).get();
        snapshot.forEach(doc => firebaseItems.push({ ...doc.data(), id: doc.id }));
    } catch (e) { console.error("Firebase fetch failed", e); }

    let list = [...(PRODUCTS[group] || []), ...firebaseItems];
    if (filter !== 'all') list = list.filter(p => p.cat === filter);

    grid.innerHTML = list.map(p => `
        <div class="product-card" onclick="openProductDetail('${p.id}')">
            <div class="img-wrapper">
                <img src="${p.img}" alt="${p.name}" loading="lazy" onerror="this.src='https://via.placeholder.com/400x500'">
            </div>
            <h4>${p.name}</h4>
            <p>$${p.price.toLocaleString()}</p>
        </div>
    `).join('');
}

/* ==========================================
   4. PRODUCT MODAL
   ========================================== */
async function openProductDetail(id) {
    selectedProduct = getFlatProducts().find(p => p.id === id);
    if (!selectedProduct) {
        const doc = await db.collection("products").doc(id).get();
        if(doc.exists) selectedProduct = doc.data();
    }
    if (!selectedProduct) return;

    currentDetailQty = 1;
    document.getElementById('detail-name').innerText = selectedProduct.name;
    document.getElementById('detail-price').innerText = `$${selectedProduct.price.toLocaleString()}`;
    document.getElementById('detail-img-src').src = selectedProduct.img;
    document.getElementById('detail-qty').innerText = currentDetailQty;
    
    const sizes = ['XS', 'S', 'M', 'L', 'XL'];
    document.getElementById('detail-size').innerHTML = sizes.map(s => `<option value="${s}">${s}</option>`).join('');
    document.getElementById('product-modal').classList.remove('hidden');
}

function closeProductDetail() { document.getElementById('product-modal').classList.add('hidden'); }
function updateDetailQty(change) {
    currentDetailQty = Math.max(1, currentDetailQty + change);
    document.getElementById('detail-qty').innerText = currentDetailQty;
}

/* ==========================================
   5. CART SYSTEM
   ========================================== */
function addCurrentToBag() {
    if (!auth.currentUser) { toggleAuthModal(); return; }
    const size = document.getElementById('detail-size').value;
    const existing = cart.find(item => item.id === selectedProduct.id && item.size === size);
    
    if (existing) existing.qty += currentDetailQty;
    else cart.push({ ...selectedProduct, qty: currentDetailQty, size: size });

    updateCartUI();
    closeProductDetail();
    showToast(`${selectedProduct.name} ADDED TO BAG`);
}

function updateCartUI() {
    localStorage.setItem('vogue_cart', JSON.stringify(cart));
    const count = cart.reduce((total, item) => total + item.qty, 0);
    document.getElementById('cart-count').innerText = count;
    renderCartDrawer();
}

function renderCartDrawer() {
    const list = document.getElementById('cart-items-list');
    let total = 0;
    if (cart.length === 0) {
        list.innerHTML = '<p class="empty-cart-msg">YOUR BAG IS CURRENTLY EMPTY.</p>';
    } else {
        list.innerHTML = cart.map((item, index) => {
            total += (item.price * item.qty);
            return `
                <div class="cart-item-row">
                    <img src="${item.img}" class="cart-thumb">
                    <div class="cart-item-details">
                        <span class="item-name">${item.name}</span>
                        <span class="item-meta">Size: ${item.size} | Qty: ${item.qty}</span>
                        <span class="item-price">$${(item.price * item.qty).toLocaleString()}</span>
                    </div>
                    <button class="remove-btn" onclick="removeFromCart(${index})">✕</button>
                </div>`;
        }).join('');
    }
    document.getElementById('cart-total').innerText = `$${total.toLocaleString()}`;
}

function removeFromCart(index) { cart.splice(index, 1); updateCartUI(); }
function toggleCart() { document.getElementById('cart-drawer').classList.toggle('active'); }

/* ==========================================
   6. ADMIN BACKEND
   ========================================== */
function openAddModal() {
    editingProductId = null;
    document.getElementById('admin-modal').classList.remove('hidden');
}

function closeAdminModal() { document.getElementById('admin-modal').classList.add('hidden'); }

async function saveProduct() {
    const name = document.getElementById('admin-p-name').value;
    const price = parseInt(document.getElementById('admin-p-price').value);
    const img = document.getElementById('admin-p-img').value;
    const group = document.getElementById('admin-p-group').value;

    if (!name || !price || !img) { alert("Missing fields"); return; }
    const id = editingProductId || 'v-' + Date.now();

    try {
        await db.collection("products").doc(id).set({ id, name, price, img, group, cat: 'unisex', stock: 10 });
        showToast("COLLECTION UPDATED");
        closeAdminModal();
        loadProductsByGroup(group);
        syncAdminInventory();
    } catch (e) { showToast("SAVE ERROR"); }
}

async function syncAdminInventory() {
    const body = document.getElementById('inventory-body');
    if(!body) return;
    const snapshot = await db.collection("products").get();
    body.innerHTML = snapshot.docs.map(doc => {
        const p = doc.data();
        return `<tr>
            <td><img src="${p.img}" width="30"></td>
            <td>${p.name}</td>
            <td>$${p.price}</td>
            <td>${p.stock}</td>
            <td><button onclick="adminDeleteProduct('${doc.id}')">✕</button></td>
        </tr>`;
    }).join('');
}

async function adminDeleteProduct(id) {
    if(confirm("Remove?")) { await db.collection("products").doc(id).delete(); syncAdminInventory(); }
}

/* ==========================================
    7. AUTH & STARTUP (UPDATED)
   ========================================== */

// 1. Switch between Login and Register tabs in the modal
function switchAuthTab(tab) {
    const loginForm = document.getElementById('login-form-container');
    const regForm = document.getElementById('register-form-container');
    const tabL = document.getElementById('tab-login');
    const tabR = document.getElementById('tab-register');

    if (tab === 'login') {
        loginForm.classList.remove('hidden');
        regForm.classList.add('hidden');
        tabL.classList.add('active');
        tabR.classList.remove('active');
    } else {
        loginForm.classList.add('hidden');
        regForm.classList.remove('hidden');
        tabL.classList.remove('active');
        tabR.classList.add('active');
    }
}

// 2. Handle Email/Password Registration
async function handleEmailRegister() {
    const email = document.getElementById('reg-email').value;
    const password = document.getElementById('reg-password').value;
    const name = document.getElementById('reg-name').value;

    if (!email || !password || !name) {
        showToast("PLEASE FILL ALL FIELDS");
        return;
    }

    try {
        const userCredential = await auth.createUserWithEmailAndPassword(email, password);
        // Set the user's name
        await userCredential.user.updateProfile({ displayName: name });
        toggleAuthModal();
        showToast(`WELCOME, ${name.toUpperCase()}`);
    } catch (e) {
        alert(e.error || e.message);
    }
}

// 3. Handle Email/Password Login
async function handleEmailLogin() {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    try {
        await auth.signInWithEmailAndPassword(email, password);
        toggleAuthModal();
        showToast("SUCCESSFULLY SIGNED IN");
    } catch (e) {
        alert("INVALID EMAIL OR PASSWORD");
    }
}

// 4. Google Sign-In (Existing)
async function handleGoogleSignIn() {
    try {
        await auth.signInWithPopup(googleProvider);
        toggleAuthModal();
        showToast("SIGNED IN WITH GOOGLE");
    } catch (e) {
        alert(e.message);
    }
}

// 5. Logout Function
async function handleLogout() {
    try {
        await auth.signOut();
        showToast("SIGNED OUT");
        setTimeout(() => location.reload(), 1000); // Reload to clear session
    } catch (e) {
        console.error("Logout Error", e);
    }
}

function toggleAuthModal() { 
    document.getElementById('auth-modal').classList.toggle('hidden'); 
}

// 6. Auth State Listener (Modified to handle Email & Google)
auth.onAuthStateChanged(user => {
    const adminL = document.getElementById('nav-admin-link');
    const userL = document.getElementById('nav-user-link');
    const loginT = document.getElementById('login-trigger');

    if (user) {
        if(userL) userL.classList.remove('hidden');
        if(loginT) loginT.classList.add('hidden');
        
        // Display user name (fallback to email if name is missing)
        const nameDisplay = user.displayName || user.email.split('@')[0];
        document.getElementById('user-name-display').innerText = nameDisplay;
        
        if (user.email === ADMIN_EMAIL) {
            if(adminL) adminL.classList.remove('hidden');
        }
    } else {
        if(adminL) adminL.classList.add('hidden');
        if(userL) userL.classList.add('hidden');
        if(loginT) loginT.classList.remove('hidden');
    }
});

function showToast(msg) {
    const t = document.getElementById('toast');
    if (!t) return;
    t.innerText = msg;
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 3000);
}

document.addEventListener('DOMContentLoaded', () => {
    updateCartUI();
    loadProductsByGroup('essentials');
});