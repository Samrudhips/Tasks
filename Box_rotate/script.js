let rotation = 0;

document.getElementById("rotateButton").addEventListener("click", function () {
    rotation += 90; // Increment rotation by 90 degrees

    // Rotate the parent box
    document.querySelector(".parent-box").style.transform = `rotate(${rotation}deg)`;

    // Rotate child boxes in opposite direction to keep them upright
    document.querySelectorAll(".child-box").forEach(box => {
        box.style.transform = `rotate(${-rotation}deg)`;
    });
});
