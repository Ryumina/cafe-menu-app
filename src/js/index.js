// step1 요구사항 구현을 위한 전략


// TODO 메뉴 추가
// OK 메뉴의 이름을 입력 받고 엔터키 입력으로 추가한다.
// OK 메뉴의 이름을 입력 받고 확인 버튼을 클릭하면 메뉴를 추가한다.
// OK 추가되는 메뉴의 아래 마크업은 <ul id="espresso-menu-list" class="mt-3 pl-0"></ul> 안에 삽입해야 한다.
// OK 총 메뉴 갯수를 count하여 상단에 보여준다.
// OK 메뉴가 추가되고 나면, input은 빈 값으로 초기화한다.
// OK 사용자 입력값이 빈 값이라면 추가되지 않는다.


// TODO 메뉴 수정
// 메뉴의 수정 버튼 클릭 이벤트를 받고, 메뉴를 수정할 수 있는 모달창이 뜬다. -- 추후 팝업으로 바꾸자
// 모달창에서 신규 메뉴명을 받고, 확인 버튼을 누르면 메뉴명이 수정된다.


// TODO 메뉴 삭제
// 메뉴 삭제 버튼 클릭 이벤트를 받고, confirm 창을 띄운다.
// 확인 버튼을 클릭하면 메뉴가 삭제된다.

// html의 엘리먼트를 가져올 때 $ 를 사용한다.
// 약간 제이쿼리같은 느낌?
const $ = (selector) => document.querySelector(selector);

function App() {
    // form 태그가 자동으로 전송되는 것을 막아준다.
    $("#espresso-menu-form")
        .addEventListener("submit", (e) => {
            e.preventDefault();
        });
    
    // 메뉴 이름을 입력받아 메뉴를 추가한다.
    const addMenuName = (menuName) => {
      const menuItemTemplate = (menuName) => {
        return `<li class="menu-list-item d-flex items-center py-2">
                    <span class="w-100 pl-2 menu-name">${menuName}</span>
                    <button
                        type="button"
                        class="bg-gray-50 text-gray-500 text-sm mr-1 menu-edit-button"
                    >
                        수정
                    </button>
                    <button
                        type="button"
                        class="bg-gray-50 text-gray-500 text-sm menu-remove-button"
                    >
                        삭제
                    </button>
                </li>`;
      };

      $("#espresso-menu-list").insertAdjacentHTML(
        "beforeend",
        menuItemTemplate(menuName)
      );

      let menuCnt = $("#espresso-menu-list").querySelectorAll("li").length;
      $(".menu-count").innerText = `총 ${menuCnt} 개`;

      $("#espresso-menu-name").value = "";
    };

    // 확인 버튼 클릭시
    $("#espresso-menu-submit-button").addEventListener("click", (e) => {
        let menuName = $("#espresso-menu-name").value;

        if (!menuName && menuName == "") {
            alert("값을 입력해 주세요.");
            return;
        } else {
            addMenuName(menuName);
        }
    });

    // 메뉴 이름을 입력했을 때
    $("#espresso-menu-name").addEventListener("keypress", (e) => {

        if(e.key === "Enter") {
            const menuName = $("#espresso-menu-name").value;

            if (!menuName && menuName == "") {
                alert("값을 입력해 주세요.");
                return;
            } else {
                addMenuName(menuName);
            }
        }
    });
}

App();

