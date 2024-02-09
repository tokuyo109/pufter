//HTML要素を取得
const inputNum = document.querySelector("#inputNum");
const submitButton = document.querySelector("#submit");
const result = document.querySelector("#result");

(async () => {
  
  //========グルーコード(開始)========
  //WebAssemblyのインスタンス化
  const myObj = await WebAssembly.instantiateStreaming(
    fetch("./../static/wasm/add100.wasm")
    );

  //WebAssemblyの関数取得
  const { add100 } = myObj.instance.exports;
  //========グルーコード(終了)========

  //計算ボタンのクリックイベント処理
  submitButton.addEventListener("click", () => {
    const x = parseInt(inputNum.value, 10);
    if (isNaN(x)) {
      result.innerText = "数字を入力してください";
    }else{
      const ret = add100(x);
      result.innerText = ret.toString();
    }
  });
})();
