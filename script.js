"use strict";

// The model of all features
const features = {
  drinksholder: false,
  led: false,
  propeller: false,
  shield: false,
  solarfan: false,
};

window.addEventListener("DOMContentLoaded", start);

let elementToPaint;

async function start() {
  let response = await fetch("cap1.svg");
  let mySvgData = await response.text();
  document.querySelector("#capOne").innerHTML = mySvgData;
  // register toggles
  document.querySelectorAll(".option").forEach((option) => option.addEventListener("click", toggleOption));
  addUserInteraction();
}

function addUserInteraction() {
  document.querySelectorAll(".colorize").forEach((g) => {
    console.log(g);
    g.addEventListener("click", clicked);
    g.addEventListener("mouseover", mouseover);
    g.addEventListener("mouseout", mouseout);
  });

  document.querySelectorAll(".color-button").forEach((button) => {
    button.addEventListener("click", colorClicked);
  });
}

function clicked() {
  elementToPaint = this;
  console.log(this);
  this.style.fill = "grey";
  this.style.opacity = "0.5";
}

function mouseover() {
  this.style.stroke = "orange";
  this.style.cursor = "pointer";
}

function mouseout() {
  this.style.stroke = "none";
}

function colorClicked() {
  console.log("Clicked", this.getAttribute("fill"));
  if (elementToPaint != undefined) {
    elementToPaint.style.fill = this.getAttribute("fill");
  } else {
    console.log("nothing selected");
  }
}

function toggleOption(event) {
  const target = event.currentTarget;
  const feature = target.dataset.feature;

  // Toggle feature in "model"
  features[feature] = !features[feature];

  if (features[feature]) {
    // feature added
    target.classList.add("chosen");

    document.querySelectorAll(`#product-preview [data-feature='${feature}']`).forEach((preview) => {
      preview.classList.remove("hide");
    });

    // create li add to #selected ul
    const featureElement = createFeatureElement(feature);
    document.querySelector("#selected ul").append(featureElement);

    // 1. Find the starting position
    const start = target.querySelector("img").getBoundingClientRect();

    // 2. Find the ending position
    const end = featureElement.getBoundingClientRect();

    // 3. Move element to beginning
    const xdiff = start.x - end.x;
    const ydiff = start.y - end.y;

    featureElement.style.setProperty("--xdiff", xdiff);
    featureElement.style.setProperty("--ydiff", ydiff);

    // 4. Run the animation
    featureElement.classList.add("animate-feature-in");
    featureElement.addEventListener("animationend", doneAnimatingIn);

    function doneAnimatingIn() {
      featureElement.classList.remove("animate-feature-in");
      featureElement.removeEventListener("animationend", doneAnimatingIn);
    }
  } else {
    // feature removed
    target.classList.remove("chosen");

    document.querySelectorAll(`#product-preview [data-feature='${feature}']`).forEach((preview) => {
      preview.classList.add("hide");
    });

    const featureElement = document.querySelector(`#selected ul [data-feature='${feature}']`);

    const start = featureElement.getBoundingClientRect();

    const end = target.querySelector("img").getBoundingClientRect();

    const xdiff = end.x - start.x;
    const ydiff = end.y - start.y;

    featureElement.style.setProperty("--xdiff", xdiff);
    featureElement.style.setProperty("--ydiff", ydiff);

    featureElement.classList.add("animate-feature-out");
    featureElement.addEventListener("animationend", doneAnimatingOut);

    function doneAnimatingOut() {
      featureElement.classList.remove("animate-feature-out");
      featureElement.removeEventListener("animationend", doneAnimatingOut);
      featureElement.remove();
    }
  }
}

// Create featureElement to be appended to #selected ul - could have used a <template> instead
function createFeatureElement(feature) {
  const li = document.createElement("li");
  li.dataset.feature = feature;

  const img = document.createElement("img");
  img.src = `images/feature_${feature}.png`;
  img.alt = capitalize(feature);

  li.append(img);

  return li;
}

function capitalize(text) {
  return text.substring(0, 1).toUpperCase() + text.substring(1).toLowerCase();
}
