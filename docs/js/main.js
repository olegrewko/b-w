// ============================================================
// ОСНОВНОЙ КОД (выполняется после загрузки DOM)
// ============================================================
document.addEventListener('DOMContentLoaded', function () {

  // ==================== ВКЛАДКИ: ОТКРЫТЬ ПО УМОЛЧАНИЮ ====================
  if (!window.location.pathname.includes('cart.html')) {
    var defaultTab = document.getElementById('defaultOpen');
    if (defaultTab) {
      defaultTab.click();
    }
  }

  // ==================== ПЛАВНАЯ ПРОКРУТКА ====================
  document.querySelectorAll('.menu a, .totop').forEach(function (link) {
    link.addEventListener('click', function (e) {
      var href = this.getAttribute('href');
      if (href && href.startsWith('#')) {
        e.preventDefault();
        var target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  });

  // ==================== Slick SLIDER ====================
  var slickSlider = document.querySelector('.slider-blog__inner');
  if (slickSlider && typeof $ !== 'undefined' && $.fn.slick) {
    $(slickSlider).slick({
      arrows: false,
      dots: true,
      autoplay: true,
      autoplaySpeed: 3000,
      fade: true,
      adaptiveHeight: false,
      responsive: [{
        breakpoint: 768,
        settings: {
          arrows: false,
          adaptiveHeight: false
        }
      }]
    });
  }

  // ==================== МОБИЛЬНОЕ МЕНЮ ====================
  var menuBtn = document.querySelector('.menu__btn');
  var menuList = document.querySelector('.menu__list');

  if (menuBtn && menuList) {
    menuBtn.addEventListener('click', function () {
      menuList.classList.toggle('menu__list--active');
    });

    document.querySelectorAll('.menu a').forEach(function (link) {
      link.addEventListener('click', function () {
        if (window.innerWidth <= 768) {
          menuList.classList.remove('menu__list--active');
        }
      });
    });
  }

  // ==================== КНОПКА "НАВЕРХ" ====================
  var toTopBtn = document.getElementById('toTop');
  if (toTopBtn) {
    window.addEventListener('scroll', function () {
      toTopBtn.style.display = window.scrollY > 300 ? 'block' : 'none';
    });

    toTopBtn.addEventListener('click', function (e) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ==================== EMAILJS: ИНИЦИАЛИЗАЦИЯ ====================
  var subscribeForm = document.getElementById('subscribeForm');
  var contactForm = document.querySelector('.contacts__form');

  if (subscribeForm || contactForm) {
    if (typeof emailjs !== 'undefined') {
      emailjs.init('QtQs0hpE6RP4L7imF');
    }
  }

  // ==================== EMAILJS: ПОДПИСКА ====================
  if (subscribeForm) {
    subscribeForm.addEventListener('submit', function (e) {
      e.preventDefault();

      var emailInput = this.querySelector('input[type="email"]');
      var email = emailInput ? emailInput.value : '';

      if (!email) {
        alert('Пожалуйста, введите email адрес.');
        return;
      }

      var submitBtn = this.querySelector('.subscribe-form-btn');
      var originalText = submitBtn.textContent;
      submitBtn.textContent = 'Отправка...';
      submitBtn.disabled = true;

      if (typeof emailjs !== 'undefined') {
        emailjs.send('service_zd0rflv', 'template_ojddyqj', {
          user_email: email,
          subscribe_time: new Date().toLocaleString('ru-RU', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          }),
          title: 'Новая подписка на сайте'
        })
          .then(function () {
            alert('Спасибо за подписку! На указанный email ' + email + ' отправлено подтверждение.');
            emailInput.value = '';
          })
          .catch(function () {
            alert('Произошла ошибка. Пожалуйста, попробуйте позже.');
          })
          .finally(function () {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
          });
      } else {
        alert('EmailJS не подключен.');
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      }
    });
  }

  // ==================== EMAILJS: КОНТАКТЫ ====================
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      var submitBtn = this.querySelector('.contacts__submit');
      var originalText = submitBtn.value;

      var nameInput = this.querySelector('input[name="firstname"]');
      var emailInput = this.querySelector('input[name="firstemail"]');
      var messageInput = this.querySelector('textarea[name="subject"]');

      if (!nameInput || !emailInput || !messageInput) {
        alert('Ошибка: не все поля формы найдены.');
        return;
      }

      var templateParams = {
        name: nameInput.value || '',
        email: emailInput.value || '',
        message: messageInput.value || '',
        time: new Date().toLocaleString('ru-RU', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })
      };

      if (!templateParams.name || !templateParams.email || !templateParams.message) {
        alert('Пожалуйста, заполните все поля формы.');
        return;
      }

      submitBtn.value = 'Отправка...';
      submitBtn.disabled = true;

      if (typeof emailjs !== 'undefined') {
        emailjs.send('service_zd0rflv', 'template_kvbjjar', templateParams)
          .then(function () {
            alert('Спасибо! Ваше сообщение отправлено.');
            contactForm.reset();
          })
          .catch(function () {
            alert('Ошибка отправки. Позвоните нам: 8-999-852-58-21');
          })
          .finally(function () {
            submitBtn.value = originalText;
            submitBtn.disabled = false;
          });
      } else {
        alert('EmailJS не подключен.');
        submitBtn.value = originalText;
        submitBtn.disabled = false;
      }
    });
  }

  // ==================== АВТОЗАМЕНА НА WEBP ====================
  function supportsWebP() {
    var canvas = document.createElement('canvas');
    return canvas.toDataURL('image/webp').indexOf('image/webp') === 0;
  }

  if (supportsWebP()) {
    document.querySelectorAll('img[src$=".jpg"], img[src$=".jpeg"], img[src$=".png"]').forEach(function (img) {
      var webpSrc = img.src.replace(/\.(jpg|jpeg|png)$/, '.webp');
      fetch(webpSrc, { method: 'HEAD' })
        .then(function (res) {
          if (res.ok) img.src = webpSrc;
        })
        .catch(function () { });
    });
  }

  // ============================================================
  // ==================== ПОЛУЧЕНИЕ ИЗОБРАЖЕНИЯ ТОВАРА (ОДНА ВЕРСИЯ!) =====
  // ============================================================
  function getProductImage(productId) {
    var images = {
      // Напольные колонки
      '604-s2': 'img/s970.png',
      '702-s2': 'img/212.970.png',
      // Полочные мониторы
      '805-d4': 'img/m01.jpg',
      '706-s3': 'img/m01.jpg',
      '707-s3': 'img/m01.jpg',
      '705-s3': 'img/m01.jpg',
      '804-d4': 'img/m01.jpg',
      '803-d4': 'img/m01.jpg',
      // Formation DUO
      'formation-duo': 'img/kw02.jpg',
      // Zeppelin
      'zeppelin': 'img/zeppelin.jpeg',
      // Formation +
      'formation-duo2': 'img/kw.jpg',
      'formation-wedge': 'img/flex.jpg',
      'formation-bar': 'img/ct8.jpg',
      'formation-bass': 'img/fbass.jpg',
      'formation-audio': 'img/vse.jpg',
      'formation-flex': 'img/sb_802.jpg',
      'flex-wall': 'img/flex.jpg',
      'db1d': 'img/s01.jpg',
      'cda-2hd': 'img/u01.jpg',
      // Наушники
      'px7': 'img/n02.jpg',
      'px7-s2': 'img/n03.jpg',
      'pi7': 'img/n03.jpg'
    };
    return images[productId] || 'img/placeholder.png';
  }

  // ============================================================
  // ==================== КОРЗИНА ================================
  // ============================================================

  var cart = JSON.parse(localStorage.getItem('cart')) || [];

  // -------- ОБНОВЛЕНИЕ СЧЕТЧИКА --------
  function updateCartCount() {
    var count = 0;
    cart.forEach(function (item) {
      count += item.quantity;
    });
    var cartCountElement = document.getElementById('cart-count');
    if (cartCountElement) {
      cartCountElement.textContent = count;
    }
    var cartLink = document.querySelector('.menu__list-item a[href*="cart"]');
    if (cartLink) {
      cartLink.textContent = 'Корзина(' + count + ')';
    }
  }

  // -------- ИЗМЕНЕНИЕ КОЛИЧЕСТВА В СТЕППЕРЕ --------
  window.changeQuantity = function (btn, delta) {
    var stepper = btn.closest('.stepper');
    if (!stepper) return;
    var input = stepper.querySelector('.stepper__input');
    if (!input) return;
    var value = parseInt(input.value) || 1;
    value += delta;
    if (value < 1) value = 1;
    if (value > 99) value = 99;
    input.value = value;
  };

  // -------- ОБНОВЛЕНИЕ ИТОГОВОЙ СУММЫ --------
  function updateCartTotal(subtotal) {
    var subtotalElement = document.getElementById('subtotal');
    var totalElement = document.getElementById('total');
    var cartTotalElement = document.getElementById('cart-total');

    var formatted = subtotal.toLocaleString() + ' ₽';
    if (subtotalElement) subtotalElement.textContent = formatted;
    if (totalElement) totalElement.textContent = formatted;
    if (cartTotalElement) cartTotalElement.textContent = formatted;
  }

  // -------- ПОКАЗ УВЕДОМЛЕНИЯ --------
  function showNotification(message) {
    var oldNotifications = document.querySelectorAll('.custom-notification');
    oldNotifications.forEach(function (el) { el.remove(); });

    var notification = document.createElement('div');
    notification.className = 'custom-notification';
    notification.style.cssText =
      'position: fixed; top: 80px; right: 20px; z-index: 1060; background: #1a1a1a; color: #ffffff; padding: 1rem 4rem; border-radius: 4px; box-shadow: 0 4px 6px rgba(0,0,0,0.3); font-family: "Jost", sans-serif; font-size: 1rem; max-width: 600px; animation: slideInRight 0.3s ease; border-left: 0px solid #4CAF50;';
    notification.textContent = message;

    var style = document.createElement('style');
    style.textContent =
      '@keyframes slideInRight { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }';
    document.head.appendChild(style);

    document.body.appendChild(notification);

    setTimeout(function () {
      if (notification.parentNode) {
        notification.style.opacity = '0';
        notification.style.transition = 'opacity 0.3s';
        setTimeout(function () {
          if (notification.parentNode) {
            notification.remove();
          }
        }, 300);
      }
    }, 3000);
  }

  // -------- ОТОБРАЖЕНИЕ КОРЗИНЫ --------
  window.updateCartDisplay = function () {
    var container = document.getElementById('cart-items');
    var summary = document.getElementById('cart-summary');

    if (!container) {
      console.warn('Элемент #cart-items не найден');
      return;
    }

    if (cart.length === 0) {
      container.innerHTML =
        '<div class="empty-cart">' +
        '<svg fill="currentColor" viewBox="0 0 24 24" width="64" height="64">' +
        '<path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>' +
        '</svg>' +
        '<h5>Ваша корзина пуста</h5>' +
        '<p>Добавьте товары, чтобы начать</p>' +
        '</div>';
      if (summary) summary.style.display = 'none';
      updateCartTotal(0);
      return;
    }

    var subtotal = 0;
    var html = '';
    cart.forEach(function (item, index) {
      var itemTotal = item.price * item.quantity;
      subtotal += itemTotal;
      html +=
        '<div class="cart-item">' +
        '<img src="' + item.image + '" alt="' + item.name + '" class="cart-item-image" onerror="this.src=\'img/placeholder.png\'">' +
        '<div class="cart-item-details">' +
        '<h6 class="cart-item-name">' + item.name + '</h6>' +
        '<div class="cart-item-meta">' +
        '<span>Цвет: ' + item.color + '</span>' +
        '<span>Цена: ' + item.price.toLocaleString() + ' ₽</span>' +
        '</div>' +
        '<div class="cart-item-controls">' +
        '<button class="quantity-btn" onclick="updateQuantity(' + index + ', ' + (item.quantity - 1) + ')">−</button>' +
        '<input type="number" class="quantity-input" value="' + item.quantity + '" min="1" onchange="updateQuantity(' + index + ', this.value)">' +
        '<button class="quantity-btn" onclick="updateQuantity(' + index + ', ' + (item.quantity + 1) + ')">+</button>' +
        '<button class="remove-btn" onclick="removeFromCart(' + index + ')">' +
        '<svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">' +
        '<path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>' +
        '</svg>' +
        '</button>' +
        '</div>' +
        '</div>' +
        '<div class="cart-item-price">' + itemTotal.toLocaleString() + ' ₽</div>' +
        '</div>';
    });
    container.innerHTML = html;

    updateCartTotal(subtotal);
    if (summary) summary.style.display = 'block';
  };

  // -------- ДОБАВЛЕНИЕ В КОРЗИНУ --------
  window.addToCart = function (productId, productName, price, productGroup) {
    var colorInput = document.querySelector('#' + productGroup + '-colors input[type="radio"]:checked');

    if (!colorInput) {
      showNotification('Пожалуйста, выберите цвет');
      return;
    }

    var qtyInput = document.getElementById(productGroup + '-qty');
    var quantity = qtyInput ? parseInt(qtyInput.value) || 1 : 1;

    var product = {
      id: productId,
      name: productName,
      color: colorInput.value,
      price: price,
      quantity: quantity,
      image: getProductImage(productId)
    };

    var existingItem = null;
    cart.forEach(function (item) {
      if (item.id === product.id && item.color === product.color) {
        existingItem = item;
      }
    });

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.push(product);
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();

    if (window.location.pathname.includes('cart.html')) {
      updateCartDisplay();
    }

    showNotification(productName + ' добавлен в корзину (' + quantity + ' шт.)');
  };

  // -------- ОБНОВЛЕНИЕ КОЛИЧЕСТВА ТОВАРА --------
  window.updateQuantity = function (index, newQuantity) {
    if (newQuantity < 1) {
      removeFromCart(index);
      return;
    }
    cart[index].quantity = parseInt(newQuantity);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    updateCartDisplay();
  };

  // -------- УДАЛЕНИЕ ТОВАРА --------
  window.removeFromCart = function (index) {
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    updateCartDisplay();
  };

  // -------- ОФОРМЛЕНИЕ ЗАКАЗА --------
  window.checkout = function () {
    if (cart.length === 0) {
      showNotification('Корзина пуста');
      return;
    }
    showNotification('Переход к оформлению заказа...');
  };

  // -------- ОЧИСТКА КОРЗИНЫ --------
  window.clearCart = function () {
    cart = [];
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    updateCartDisplay();
    showNotification('Корзина очищена');
  };
  // ============================================================
  // ==================== КАРТОЧКИ: РАСКРЫТИЕ ТЕКСТА ============
  // ============================================================

  // document.addEventListener('DOMContentLoaded', function () {
  //   document.querySelectorAll('.card-arrow').forEach(function (arrow) {
  //     arrow.addEventListener('click', function () {
  //       var card = this.closest('.card');
  //       if (!card) return;

  //       var text = card.querySelector('.card-text');
  //       if (!text) return;

  //       text.classList.toggle('expanded');
  //       this.classList.toggle('rotated');
  //     });
  //   });
  // });
  // ============================================================
  // ==================== КАРТОЧКИ: РАСКРЫТИЕ ТЕКСТА ============
  // ============================================================

  // Вариант с делегированием (самый надёжный)
  document.addEventListener('click', function (e) {
    var arrow = e.target.closest('.card-arrow');
    if (!arrow) return;

    var card = arrow.closest('.card');
    if (!card) return;

    var text = card.querySelector('.card-text');
    if (!text) return;

    text.classList.toggle('expanded');
    arrow.classList.toggle('rotated');
  });

  // console.log('✅ Карточки: обработчик клика добавлен!');
  // ============================================================
  // ==================== ИНИЦИАЛИЗАЦИЯ ==========================
  // ============================================================

  updateCartCount();

  if (window.location.pathname.includes('cart.html')) {
    setTimeout(function () {
      updateCartDisplay();
    }, 100);
  }

  window.addEventListener('pageshow', function (event) {
    if (event.persisted) {
      cart = JSON.parse(localStorage.getItem('cart')) || [];
      updateCartCount();
      if (window.location.pathname.includes('cart.html')) {
        updateCartDisplay();
      }
    }
  });

  window.addEventListener('storage', function (e) {
    if (e.key === 'cart') {
      cart = JSON.parse(e.newValue) || [];
      updateCartCount();
      if (window.location.pathname.includes('cart.html')) {
        updateCartDisplay();
      }
    }
  });

}); // КОНЕЦ DOMContentLoaded
// ============================================================
// ==================== БЛОГ: ПАГИНАЦИЯ ========================
// ============================================================

document.addEventListener('DOMContentLoaded', function () {
  var carousel = document.getElementById('blogCarousel');
  var loadMoreBtn = document.getElementById('loadMoreBtn');
  var loadMoreLabel = document.querySelector('.load-more-label');
  var loadMoreArrow = document.querySelector('.load-more-arrow');

  if (!carousel || !loadMoreBtn) return;

  var currentPage = 1;
  var cardsPerPage = 5;
  var totalCards = carousel.children.length;
  var totalPages = Math.ceil(totalCards / cardsPerPage);
  var isAtEnd = false;

  // Если всего 1 страница — скрываем кнопку
  if (totalPages <= 1) {
    loadMoreBtn.style.display = 'none';
    return;
  }

  function getCardWidth() {
    var firstCard = carousel.querySelector('.card');
    if (!firstCard) return 200;
    return firstCard.offsetWidth + 20;
  }

  function slideToPage(page, animate) {
    if (page < 1 || page > totalPages) return;

    var cardWidth = getCardWidth();
    var offset = (page - 1) * cardsPerPage * cardWidth;

    carousel.style.transition = animate !== false ? 'transform 0.5s ease' : 'transform 0.3s ease';
    carousel.style.transform = 'translateX(-' + offset + 'px)';
    currentPage = page;

    // ⭐ Меняем состояние кнопки
    if (currentPage >= totalPages) {
      // Достигли конца → показываем "Назад"
      isAtEnd = true;
      loadMoreLabel.textContent = 'Вернуться';
      loadMoreArrow.classList.remove('down');
      loadMoreArrow.classList.add('up');
    } else {
      isAtEnd = false;
      loadMoreLabel.textContent = 'Load more';
      loadMoreArrow.classList.remove('up');
      loadMoreArrow.classList.add('down');
    }
  }

  // Обработчик клика по кнопке
  loadMoreBtn.addEventListener('click', function (e) {
    e.preventDefault();

    if (isAtEnd) {
      // Если в конце → возвращаемся в начало
      slideToPage(1);
    } else {
      // Иначе → следующая страница
      if (currentPage < totalPages) {
        currentPage++;
        slideToPage(currentPage);
      }
    }
  });

  // Обновление при ресайзе
  var resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      slideToPage(currentPage, false);
    }, 200);
  });

  // Инициализация
  slideToPage(1);

  console.log('✅ Блог: пагинация инициализирована. Страниц:', totalPages);
});
