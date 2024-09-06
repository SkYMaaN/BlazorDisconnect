const OnOverlayClickMessage = "There is a connection problem, we are still trying to reconnect.";

let toasts;
function createToast(title, message, dismissTime) {
    toasts.push({
        title: title,
        content: message,
        dismissAfter: dismissTime
    });
}

function hideToasts() {
    for (let i = 0; i < toasts.stack.length; i++) {
        toasts.closeToast(toasts.stack[i]);
    }

    var toastsInDocument = document.getElementsByClassName('toast-notification');
    while (toastsInDocument[0]) {
        toastsInDocument[0].parentElement.removeChild(toastsInDocument[0]);
    }
}

function hideOverlay() {
    var overlay = document.getElementById('overlayDiv');
    overlay.style.display = 'none';
}

function showOverlay() {
    var overlay = document.getElementById('overlayDiv');
    overlay.style.display = 'block';
}

function handleOverlayClick() {
    createToast('Wait!', OnOverlayClickMessage);
    console.log("Overlay clicked!");
}

window.addEventListener('load', () => {
    toasts = new Toasts({
        offsetX: 20, // 20px
        offsetY: 20, // 20px
        gap: 20, // The gap size in pixels between toasts
        width: 300, // 300px
        timing: 'ease', // See list of available CSS transition timings
        duration: '.5s', // Transition duration
        dimOld: true, // Dim old notifications while the newest notification stays highlighted
        position: 'top-left' // top-left | top-center | top-right | bottom-left | bottom-center | bottom-right
    });
});