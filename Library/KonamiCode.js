var hiddenFrame = document.createElement("iframe");
hiddenFrame.style.display = "none";
document.body.appendChild(hiddenFrame);

var konamiScript = document.createElement("script");
konamiScript.src = "https://cdn.rawgit.com/snaptortoise/konami-js/e872fc2cfeb202e5843ab5558f4a67f91e264785/konami.js";
document.body.appendChild(konamiScript);

konamiScript.onload = function () {
  var nyanCat = new Konami(function () {
    hiddenFrame.src = "https://www.youtube.com/embed/QH2-TGUlwu4?autoplay=1";
  });
};
