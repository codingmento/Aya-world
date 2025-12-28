const hamburger = document.getElementById("hamburger");
const navLinks = document.getElementById("navLinks");

hamburger.addEventListener("click", (e) => {
  e.stopPropagation();
  navLinks.classList.toggle("active");
  hamburger.classList.toggle("active");
});

navLinks.addEventListener("click", (e) => {
  e.stopPropagation();
});

document.addEventListener("click", () => {
  navLinks.classList.remove("active");
  hamburger.classList.remove("active");
});
const cards = document.querySelectorAll(".product-card");

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
      }
    });
  },
  { threshold: 0.2 }
);

cards.forEach((card) => observer.observe(card));
document.querySelectorAll(".product-card").forEach((card) => {
  const images = card.querySelectorAll(".product-img");
  const nextBtn = card.querySelector(".next-img");
  let index = 0;

  nextBtn.addEventListener("click", () => {
    images[index].classList.remove("active");
    index = (index + 1) % images.length;
    images[index].classList.add("active");
  });
});
document.addEventListener("DOMContentLoaded", () => {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  const cartCount = document.getElementById("cartCount");
  const cartIcon = document.getElementById("cartIcon");
  const cartModal = document.getElementById("cartModal");
  const cartCard = document.getElementById("cartCard");
  const cartItems = document.getElementById("cartItems");
  const whatsappBtn = document.getElementById("whatsappBtn");
  const closeCart = document.getElementById("closeCart");

  // تحديث عدد العناصر في أيقونة السلة
  function updateCartCount() {
    cartCount.innerText = cart.length;
  }

  // عرض عناصر السلة
  function renderCartItems() {
    cartItems.innerHTML = "";
    let totalPrice = 0;

    if (cart.length === 0) {
      cartItems.innerHTML = "<p>السلة فارغة</p>";
      return;
    }

    cart.forEach((item, index) => {
      totalPrice += item.price * item.quantity;
      cartItems.innerHTML += `
        <div class="cart-item">
          <img src="${item.img}" alt="${item.name}" class="cart-item-img">
          <div class="cart-item-info">
            <p class="cart-item-name">${item.name}</p>
            <p class="cart-item-price">$${item.price}</p>
          </div>
          <button class="delete-item" data-index="${index}">×</button>
        </div>
      `;
    });

    cartItems.innerHTML += `<hr /><p class="cart-total"><strong>Total: $${totalPrice}</strong></p>`;

    // حذف عنصر عند الضغط على ❌
    document.querySelectorAll(".delete-item").forEach((btn) => {
      btn.addEventListener("click", () => {
        const i = Number(btn.dataset.index);
        cart.splice(i, 1);
        localStorage.setItem("cart", JSON.stringify(cart));
        updateCartCount();
        renderCartItems();
      });
    });
  }

  updateCartCount();
  renderCartItems();

  // إضافة عنصر للسلة
  document.querySelectorAll(".add-cart").forEach((btn) => {
    btn.addEventListener("click", () => {
      const name = btn.dataset.name;
      const price = Number(btn.dataset.price);
      const img = btn.dataset.img;

      // كل إضافة كسطر مستقل
      cart.push({ name, price, img, quantity: 1 });

      localStorage.setItem("cart", JSON.stringify(cart));
      updateCartCount();
      renderCartItems();
    });
  });

  // فتح السلة عند الضغط على أيقونة السلة
  cartIcon.addEventListener("click", () => {
    renderCartItems();
    cartModal.style.display = "flex";
  });

  // إغلاق السلة عند الضغط على ×
  closeCart.addEventListener("click", () => {
    cartModal.style.display = "none";
  });

  // إغلاق عند الضغط خارج الكرت
  cartModal.addEventListener("click", (e) => {
    if (e.target === cartModal) cartModal.style.display = "none";
  });

  // منع إغلاق عند الضغط داخل الكرت
  cartCard.addEventListener("click", (e) => e.stopPropagation());

  // إرسال الطلب عبر واتساب وتفريغ السلة
  whatsappBtn.addEventListener("click", () => {
    if (cart.length === 0) return;

    let message = "New Order:%0A";
    let totalPrice = 0;

    cart.forEach((item) => {
      totalPrice += item.price * item.quantity;
      message += `- ${item.name} ($${item.price})%0A`;
    });

    message += `%0ATotal: $${totalPrice}`;
    window.open("https://wa.me/96171049583?text=" + message, "_blank");

    cart = [];
    localStorage.removeItem("cart");
    updateCartCount();
    renderCartItems();
    cartModal.style.display = "none";
  });
});
