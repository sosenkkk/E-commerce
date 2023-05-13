const butt = document.getElementsByClassName("deleteButton");


if(butt){
  for(i=0; i< butt.length; i++){
    const button = butt[i];
    console.log(button)
    button.addEventListener('click', ()=>{
      deleteProduct(button)
    })
  }
}

const deleteProduct = (btn) => {
  const prodId = btn.parentNode.querySelector("[name=productId]").value;
  const csrf = btn.parentNode.querySelector("[name=_csrf]").value;
  const productElement = btn.closest("article");
  fetch("/admin/product/" + prodId, {
    method: "DELETE",
    headers: {
      "csrf-token": csrf,
    },
  })
    .then((result) => {
      return result.json();
    })
    .then((data) => {
      productElement.parentNode.removeChild(productElement);
      console.log(data);
    })
    .catch((err) => {
      console.log(err);
    });
};
