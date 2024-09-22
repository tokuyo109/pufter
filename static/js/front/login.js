

window.onload = function () {
    Particles.init({
        selector: '.background'
    });
};

var particles = Particles.init({
    selector: '.background',
    sizeVariations: 10,
    color: ['#00bbdd', '#404B69', '#DBEDF3'],
    connectParticles: true
});