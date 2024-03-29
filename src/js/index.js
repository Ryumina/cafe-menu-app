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

import { $ } from "./utils/dom.js";
import store from "./store/index.js";
import MenuApi from "./api/index.js";

function App() {
    this.menu = {
      espresso: [],
      frappuccino: [],
      blended: [],
      teavana: [],
      desert: []
    };

    this.currentCategory = "espresso";

    this.init = async () => {
      await render();
      initEventListeners();
    };

    const render = async () => {
      this.menu[this.currentCategory] = await MenuApi.getAllMenuByCategory(this.currentCategory);

      const template = this.menu[this.currentCategory]
        .map((item) => {
          return `<li data-menu-id="${item.id}" class="${item.isSoldOut ? "sold-out" : ""} menu-list-item d-flex items-center py-2">
                      <span class="w-100 pl-2 menu-name">${item.name}</span>
                      <button
                          type="button"
                          class="bg-gray-50 text-gray-500 text-sm mr-1 menu-sold-out-button"
                      >
                          품절
                      </button>
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
        })
        .join("");

      $("#menu-list").innerHTML = template;

      updateMenuCount();
    }
    
    // 메뉴 수 업데이트
    const updateMenuCount = () => {
      const menuCnt = this.menu[this.currentCategory].length;
      $(".menu-count").innerText = `총 ${menuCnt} 개`;
    };

    // 메뉴 추가
    const addMenuName = async (menuName) => {
      const duplicatedMenu = this.menu[this.currentCategory].find(menuItem => menuItem.name == menuName);

      if(duplicatedMenu) {
        alert("이미 등록된 메뉴입니다. 다시 입력해 주세요.");
        $("#menu-name").value = "";
        return;
      } else {
        await MenuApi.createMenu(this.currentCategory, menuName);
        $("#menu-name").value = "";
        render();
      }
    };

    // 메뉴 수정
    const updateMenuName = async (e) => {
      const $menuName = e.target.closest("li").querySelector(".menu-name");
      const updateMenuId = e.target.closest("li").dataset.menuId;

      const updatedMenuName = prompt("메뉴명을 수정하세요", $menuName.innerText);

      if (updatedMenuName) {
        await MenuApi.updateMenu(this.currentCategory, updatedMenuName, updateMenuId);
        render();
      }
    }

    // 메뉴 삭제
    const removeMenuName = async (e) => {
      const $menuName = e.target.closest("li").querySelector(".menu-name");
      const deleteMenuId = e.target.closest("li").dataset.menuId;

      if (confirm($menuName.innerText + "를 삭제하시겠습니까?")) {
        await MenuApi.deleteMenu(this.currentCategory, deleteMenuId);
        render();
      }
    }

    // 메뉴 품절 상태 관리
    const soldOutMenu = async (e) => {
      const soldOutMenuId = e.target.closest("li").dataset.menuId;

      await MenuApi.toggleSoldOutMenu(this.currentCategory, soldOutMenuId);
      render();
    }

    const changeCategory = (e) => {
      const isCategoryButton =
          e.target.classList.contains("cafe-category-name");
      if (isCategoryButton) {
        const categoryName = e.target.dataset.categoryName;
        // console.log(categoryName);

        this.currentCategory = categoryName;
        $("#categoryTitle").innerText = `${e.target.innerText} 메뉴 관리`;

        render();
      }
    }

    const initEventListeners = () => {
      
      // 메뉴 수정, 삭제, 품절
      $("#menu-list").addEventListener("click", (e) => {
        // 수정
        if (e.target.classList.contains("menu-edit-button")) {
          updateMenuName(e);
          return;
        }

        // 삭제
        if (e.target.classList.contains("menu-remove-button")) {
          removeMenuName(e);
          return;
        }

        // 품절
        if (e.target.classList.contains("menu-sold-out-button")) {
          soldOutMenu(e);
          return;
        }
      });

      // form 태그가 자동으로 전송되는 것을 막아준다.
      $("#menu-form").addEventListener("submit", (e) => {
        e.preventDefault();
      });

      // 확인 버튼 클릭시
      $("#menu-submit-button").addEventListener("click", (e) => {
        let menuName = $("#menu-name").value;

        if (!menuName && menuName == "") {
          alert("값을 입력해 주세요.");
          return;
        } else {
          addMenuName(menuName);
        }
      });

      // 메뉴 이름을 입력했을 때
      $("#menu-name").addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
          const menuName = $("#menu-name").value;

          if (!menuName && menuName == "") {
            alert("값을 입력해 주세요.");
            return;
          } else {
            addMenuName(menuName);
          }
        }
      });

      // 메뉴 카테고리 클릭시
      $("nav").addEventListener("click", changeCategory);

    }
}

const app = new App();
app.init();
