

export const printContent = (el) => {
  var table = document.querySelector(el).innerHTML;
  document.body.innerHTML = table;
  window.print();
  window.location.reload();
};
