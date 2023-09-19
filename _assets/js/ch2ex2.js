let textarea = document.querySelector('#css-code-wrapper textarea');
let style = document.querySelector('#example-css');
textarea.innerHTML = style.textContent;
textarea.addEventListener('change', function(){
    style.textContent = textarea.value;
});