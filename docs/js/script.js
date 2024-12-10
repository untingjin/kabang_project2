console.clear();

function logoShowAndHide() {
  $(window).scroll(function () {
    let $this = $(this);
    let sTop = $this.scrollTop(); // 스크롤의 위치

    if (sTop > 0) {
      // 스크롤에 위치가 0보다 크면
      // logo 에 active 클래스를 붙여준다.
      $(".logo").addClass("active");
    } else {
      // 그게 아니면 active 클래스를 제거
      $(".logo").removeClass("active");
    }
  });
}

logoShowAndHide();

// 1차 메뉴에 마우스 올리면 drop-down-btn에 active 클래스 제거
$(".top-bar__menu-1 > ul > li").mouseenter(function () {
  $(".drop-down-btn").removeClass("active");
});

// 드롭다운 이벤트 구현
function dropDownEvent() {
  const dropDownBtn = document.querySelector(".drop-down-btn");

  dropDownBtn.addEventListener("click", function () {
    dropDownBtn.classList.toggle("active");
  });
}

dropDownEvent();

function checkcardSwiper() {
  const swiper = new Swiper(".checkcard-swiper", {
    loop: true, // 슬라이드 반복 여부
    slidesPerView: 3, // 한 화면의 슬라이드를 몇 개 표현할 것인지
    centeredSlides: true, // actvie 붙은 슬라이드가 가운데 배치되도록
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
  });
}

checkcardSwiper();

/* 발견되면 활성화시키는 라이브러리 시작 */
function ActiveOnVisible__init() {
  $(".active-on-visible").each(function (index, node) {
    let $node = $(node);

    let onFuncName = $node.attr("data-active-on-visible-on-func-name");
    let offFuncName = $node.attr("data-active-on-visible-off-func-name");

    $node.data("data-active-on-visible-on-func-name", onFuncName);
    $node.data("data-active-on-visible-off-func-name", offFuncName);
  });

  $(window).resize(_.debounce(ActiveOnVisible__initOffset, 500));
  ActiveOnVisible__initOffset();

  $(window).scroll(_.debounce(ActiveOnVisible__checkAndActive, 50));
  ActiveOnVisible__checkAndActive();
}

function ActiveOnVisible__initOffset() {
  var windowHeight = $(window).height();

  $(".active-on-visible:not(.actived)").each(function (index, node) {
    let $node = $(node);

    let offsetTop = $node.offset().top;

    let matrix = $node
      .css("transform")
      .replace(/[^0-9\-.,]/g, "")
      .split(",");
    let translateX = matrix[12] || matrix[4];
    let translateY = matrix[13] || matrix[5];

    if (translateY) {
      offsetTop -= translateY;
    }

    $node.attr("data-active-on-visible-offsetTop", offsetTop);
    $node.data("data-active-on-visible-offsetTop", offsetTop);

    if (!$node.attr("data-active-on-visible-diff-y")) {
      $node.attr("data-active-on-visible-diff-y", "0");
    }

    if (!$node.attr("data-active-on-visible-delay")) {
      $node.attr("data-active-on-visible-delay", "0");
    }

    let diffY = $node.attr("data-active-on-visible-diff-y");
    let delay = $node.attr("data-active-on-visible-delay");

    if (diffY.substr(-2, 2) == "vh") {
      diffY = parseInt(diffY);

      diffY = windowHeight * (diffY / 100);
    } else if (diffY.substr(-1, 1) == "%") {
      diffY = parseInt(diffY);

      diffY = $node.height() * (diffY / 100);
    } else {
      diffY = parseInt(diffY);
    }

    $node.attr("data-active-on-visible-diff-y-real", diffY);
    $node.data("data-active-on-visible-diff-y", diffY);
    $node.data("data-active-on-visible-delay", delay);
  });

  ActiveOnVisible__checkAndActive();
}

function ActiveOnVisible__checkAndActive() {
  $(".active-on-visible:not(.actived)").each(function (index, node) {
    let $node = $(node);

    let offsetTop = $node.data("data-active-on-visible-offsetTop") * 1;
    let diffY = parseInt($node.data("data-active-on-visible-diff-y"));
    let delay = parseInt($node.data("data-active-on-visible-delay"));

    let onFuncName = $node.data("data-active-on-visible-on-func-name");
    let offFuncName = $node.data("data-active-on-visible-off-func-name");

    let scrollTop = $(window).scrollTop();
    let windowHeight = $(window).height();
    let nodeHeight = $node.height();

    if (scrollTop + windowHeight + diffY > offsetTop) {
      setTimeout(function () {
        if ($node.hasClass("active") == false) {
          $node.addClass("active");

          if ($node.hasClass("can-active-once")) {
            $node.addClass("actived");
          }

          if (window[onFuncName]) {
            window[onFuncName]($node);
          }
        }
      }, delay);
    } else {
      if ($node.hasClass("active")) {
        $node.removeClass("active");

        if (window[offFuncName]) {
          window[offFuncName]($node);
        }
      }
    }
  });
}

$(function () {
  ActiveOnVisible__init();
});
/* 발견되면 활성화시키는 라이브러리 끝 */
