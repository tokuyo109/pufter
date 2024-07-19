console.log("profEdit.js load");

document.addEventListener('DOMContentLoaded', function () {
    var iconPreview = document.getElementById('icon-preview');
    var iconInput = document.getElementById('icon-file-input');

    iconInput.addEventListener('change', function (event) {
        console.log("File selected!");
        var reader = new FileReader();
        reader.onload = function () {
            var dataURL = reader.result;
            iconPreview.src = dataURL;
        };
        reader.readAsDataURL(event.target.files[0]);
    });

    var textarea = document.querySelector('.inputtextbox2');
    var maxLength = 60;  // 最大文字数
    var maxLines = 3;  // 最大行数

    textarea.addEventListener('input', function() {
        if (textarea.value.length > maxLength) {
            textarea.value = textarea.value.substring(0, maxLength);
        }
        
        var lines = textarea.value.split('\n');
        if (lines.length > maxLines) {
            textarea.value = lines.slice(0, maxLines).join('\n');
        }
    });

    textarea.addEventListener('keydown', function(event) {
        var lines = textarea.value.split('\n');
        if (event.key === 'Enter' && lines.length >= maxLines) {
            event.preventDefault();
        }
    });
});
