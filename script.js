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
  const cartCard = document.getElementById("cartCard");
  const cartCount = document.getElementById("cartCount");
  const cartIcon = document.getElementById("cartIcon");
  const cartModal = document.getElementById("cartModal");
  const cartItems = document.getElementById("cartItems");
  const whatsappBtn = document.getElementById("whatsappBtn");
  const closeCart = document.getElementById("closeCart");

  // تحديث العدد
  function updateCartCount() {
    let totalQty = 0;
    cart.forEach((item) => (totalQty += item.quantity));
    cartCount.innerText = totalQty;
  }

  updateCartCount();

  // إضافة للسلة
  document.querySelectorAll(".add-cart").forEach((btn) => {
    btn.addEventListener("click", () => {
      const name = btn.dataset.name;
      const price = Number(btn.dataset.price);

      if (!name || !price) return;

      const existing = cart.find((i) => i.name === name);

      if (existing) {
        existing.quantity++;
      } else {
        cart.push({ name, price, quantity: 1 });
      }

      localStorage.setItem("cart", JSON.stringify(cart));
      updateCartCount();
    });
  });

  // فتح السلة
  cartIcon.addEventListener("click", () => {
    cartItems.innerHTML = "";
    let totalPrice = 0;

    cart.forEach((item) => {
      totalPrice += item.price * item.quantity;
      cartItems.innerHTML += `<p>${item.name} × ${item.quantity} — $${item.price}</p>`;
    });

    cartItems.innerHTML += `<hr /><p><strong>Total: $${totalPrice}</strong></p>`;
    cartModal.style.display = "flex";
  });

  // إغلاق ×
  closeCart.addEventListener("click", () => {
    cartModal.style.display = "none";
  });

  // إغلاق بالكبسة برا المودال
  cartModal.addEventListener("click", (e) => {
    if (e.target === cartModal) {
      cartModal.style.display = "none";
    }
  });

  // منع الإغلاق عند الضغط داخل الكرت
  cartCard.addEventListener("click", (e) => {
    e.stopPropagation();
  });

  // إرسال واتساب + تفريغ السلة
  whatsappBtn.addEventListener("click", () => {
    let message = "New Order:%0A";
    let totalPrice = 0;

    cart.forEach((item) => {
      totalPrice += item.price * item.quantity;
      message += `- ${item.name} × ${item.quantity} ($${item.price})%0A`;
    });

    message += `%0ATotal: $${totalPrice}`;
    window.open("https://wa.me/96171049583?text=" + message, "_blank");

    cart = [];
    localStorage.removeItem("cart");
    updateCartCount();
    cartModal.style.display = "none";
  });
});
