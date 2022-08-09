const BASE_URL = "http://localhost:3000/api";

const MenuApi = {
    async getAllMenuByCategory(category) {
        const response =  await fetch(`${BASE_URL}/category/${category}/menu`);
        return response.json();
    },
    async createMenu(category, name) {
        const response = await fetch(`${BASE_URL}/category/${category}/menu`, {
            method: "POST",
            headers: {
                "Content-Type" : "application/json"
            },
            body: JSON.stringify({name})
        });
        if(!response.ok) {
            console.error("메뉴 생성이 실패하였습니다.");
        }
    },
    async updateMenu(category, name, menuId) {
        const response = await fetch(`${BASE_URL}/category/${category}/menu/${menuId}`, {
            method: "PUT",
            headers: {
                "Content-Type" : "application/json"
            },
            body: JSON.stringify({name})
        });
        if(!response.ok) {
            console.error("메뉴 수정이 실패하였습니다.");
        }
        return response.json();
    },
    async toggleSoldOutMenu(category, menuId) {
        const response = await fetch(`${BASE_URL}/category/${category}/menu/${menuId}/soldout`, {
            method: "PUT"
        });
        if(!response.ok) {
            console.error("메뉴 품절 처리가 실패하였습니다.");
        }
    },
    async deleteMenu(category, menuId) {
        const response = await fetch(`${BASE_URL}/category/${category}/menu/${menuId}`, {
            method: "DELETE"
        });
        if(!response.ok) {
            console.error("메뉴 삭제가 실패하였습니다.");
        }
    }
}

export default MenuApi;