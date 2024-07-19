console.log("hello");

// JavaScriptでフォームのplaceholderを消す
const searchInput = document.getElementById('searchInput');

// ページが読み込まれたらフォームにフォーカスを当てる
window.addEventListener('DOMContentLoaded', (event) => {
    searchInput.focus();
});

// フォームにフォーカスが当たった時
searchInput.addEventListener('focus', function() {
    this.placeholder = '';
});

// フォームからフォーカスが外れた時
searchInput.addEventListener('blur', function() {
    if (this.value === '') {
        this.placeholder = '検索';
    }
});

// フォームに入力があった時
searchInput.addEventListener('input', function() {
    if (this.value !== '') {
        this.placeholder = '';
    }
});