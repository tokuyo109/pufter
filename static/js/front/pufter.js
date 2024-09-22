console.log("hello");


document.addEventListener("DOMContentLoaded", function () {
    const userIcon = document.getElementById("user-icon");
    const dropdownMenu = document.getElementById("dropdown-menu");

    userIcon.addEventListener("click", function () {
        if (dropdownMenu.style.display == "none" || dropdownMenu.style.display === "") {
            dropdownMenu.style.display = "block";
        }
    });

    // アイコンやメニュー以外をクリックするとメニューを閉じる
    document.addEventListener("click", function (event) {
        if (!userIcon.contains(event.target) && !dropdownMenu.contains(event.target)) {
            dropdownMenu.style.display = "none";
        }
    });
});

