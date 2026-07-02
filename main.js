/*=============== SHOW MENU ===============*/
const showMenu = (toggleId, navId) =>{
   const toggle = document.getElementById(toggleId),
         nav = document.getElementById(navId)

   toggle.addEventListener('click', () =>{
       // Add show-menu class to nav menu
       nav.classList.toggle('show-menu')

       // Add show-icon to show and hide the menu icon
       toggle.classList.toggle('show-icon')
   })
}

// for the images in the slide
showMenu('nav-toggle','nav-menu')

const slides = document.querySelectorAll(".slide");
let currentIndex = 0;

function showNextSlide() {
   slides[currentIndex].classList.remove("active");

   currentIndex = (currentIndex + 1) % slides.length;

   slides[currentIndex].classList.add("active");
}

// change slide every 2 seconds
setInterval(showNextSlide, 2000);



// game met section

 function imageZoom(imgID, resultID) {
  var img, lens, result, cx, cy;
  img = document.getElementById(imgID);
  result = document.getElementById(resultID);
  /* Create lens: */
  lens = document.createElement("DIV");
  lens.setAttribute("class", "img-zoom-lens");
  /* Insert lens: */
  img.parentElement.insertBefore(lens, img);
  /* Calculate the ratio between result DIV and lens: */
  cx = result.offsetWidth / lens.offsetWidth;
  cy = result.offsetHeight / lens.offsetHeight;
  /* Set background properties for the result DIV */
  result.style.backgroundImage = "url('" + img.src + "')";
  result.style.backgroundSize = (img.width * cx) + "px " + (img.height * cy) + "px";
  /* Execute a function when someone moves the cursor over the image, or the lens: */
  lens.addEventListener("mousemove", moveLens);
  img.addEventListener("mousemove", moveLens);
  /* And also for touch screens: */
  lens.addEventListener("touchmove", moveLens);
  img.addEventListener("touchmove", moveLens);
  function moveLens(e) {
    var pos, x, y;
    /* Prevent any other actions that may occur when moving over the image */
    e.preventDefault();
    /* Get the cursor's x and y positions: */
    pos = getCursorPos(e);
    /* Calculate the position of the lens: */
    x = pos.x - (lens.offsetWidth / 2);
    y = pos.y - (lens.offsetHeight / 2);
    /* Prevent the lens from being positioned outside the image: */
    if (x > img.width - lens.offsetWidth) {x = img.width - lens.offsetWidth;}
    if (x < 0) {x = 0;}
    if (y > img.height - lens.offsetHeight) {y = img.height - lens.offsetHeight;}
    if (y < 0) {y = 0;}
    /* Set the position of the lens: */
    lens.style.left = x + "px";
    lens.style.top = y + "px";
    /* Display what the lens "sees": */
    result.style.backgroundPosition = "-" + (x * cx) + "px -" + (y * cy) + "px";
  }
  function getCursorPos(e) {
    var a, x = 0, y = 0;
    e = e || window.event;
    /* Get the x and y positions of the image: */
    a = img.getBoundingClientRect();
    /* Calculate the cursor's x and y coordinates, relative to the image: */
    x = e.pageX - a.left;
    y = e.pageY - a.top;
    /* Consider any page scrolling: */
    x = x - window.pageXOffset;
    y = y - window.pageYOffset;
    return {x : x, y : y};
  }
}

window.addEventListener('load', function() {
  imageZoom('myimage', 'myresult');
  initFloatingCardDrag();
});

function initFloatingCardDrag() {
  const container = document.querySelector('.map-stage');
  if (!container) return;

  const cards = container.querySelectorAll('.floating-card');
  let activeCard = null;
  let startX = 0;
  let startY = 0;
  let cardStartLeft = 0;
  let cardStartTop = 0;

  cards.forEach(card => {
    card.addEventListener('pointerdown', pointerDown);
    card.addEventListener('touchstart', event => event.preventDefault(), { passive: false });
  });

  function pointerDown(e) {
    activeCard = e.currentTarget;
    activeCard.setPointerCapture(e.pointerId);

    const cardRect = activeCard.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();

    if (!activeCard.style.left || activeCard.style.left === '') {
      const computed = window.getComputedStyle(activeCard);
      if (computed.left && computed.left !== 'auto') {
        activeCard.style.left = computed.left;
      } else if (computed.right && computed.right !== 'auto') {
        const left = cardRect.left - containerRect.left;
        activeCard.style.left = `${left}px`;
        activeCard.style.right = 'auto';
      }
    }
    if (!activeCard.style.top || activeCard.style.top === '') {
      const computed = window.getComputedStyle(activeCard);
      if (computed.top && computed.top !== 'auto') {
        activeCard.style.top = computed.top;
      } else if (computed.bottom && computed.bottom !== 'auto') {
        const top = cardRect.top - containerRect.top;
        activeCard.style.top = `${top}px`;
        activeCard.style.bottom = 'auto';
      }
    }

    startX = e.clientX;
    startY = e.clientY;
    cardStartLeft = parseFloat(activeCard.style.left) || 0;
    cardStartTop = parseFloat(activeCard.style.top) || 0;

    activeCard.style.animation = 'none';
    activeCard.style.cursor = 'grabbing';

    window.addEventListener('pointermove', pointerMove);
    window.addEventListener('pointerup', pointerUp);
  }

  function pointerMove(e) {
    if (!activeCard) return;
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;
    const containerRect = container.getBoundingClientRect();
    const cardRect = activeCard.getBoundingClientRect();

    let nextLeft = cardStartLeft + dx;
    let nextTop = cardStartTop + dy;

    // keep within container bounds
    const minLeft = -cardRect.width * 0.5;
    const maxLeft = containerRect.width - cardRect.width * 0.5;
    const minTop = -cardRect.height * 0.5;
    const maxTop = containerRect.height - cardRect.height * 0.5;

    nextLeft = Math.min(Math.max(nextLeft, minLeft), maxLeft);
    nextTop = Math.min(Math.max(nextTop, minTop), maxTop);

    activeCard.style.left = `${nextLeft}px`;
    activeCard.style.top = `${nextTop}px`;
  }

  function pointerUp(e) {
    if (!activeCard) return;
    activeCard.style.animation = '';
    activeCard.style.cursor = 'grab';

    activeCard.releasePointerCapture(e.pointerId);
    activeCard = null;
    window.removeEventListener('pointermove', pointerMove);
    window.removeEventListener('pointerup', pointerUp);
  }
}
