(() => {
    const ReconnectionMessage = "We are having problems connecting...  Click here to reload."
    const ReconnectedMessage = "Interactivity enabled.";
    const maximumRetryCount = 8;
    const retryIntervalMilliseconds = 5000;
    //const reconnectModal = document.getElementById('reconnect-modal');

    const startReconnectionProcess = () => {
        console.log('Started reconnection process!');
        //reconnectModal.style.display = 'block';

        let isCanceled = false;

        (async () => {
            for (let i = 0; i < maximumRetryCount; i++) {
                //reconnectModal.innerText = `Attempting to reconnect: ${i + 1} of ${maximumRetryCount}`;
                console.log(`Attempting to reconnect: ${i + 1} of ${maximumRetryCount}`);

                await new Promise(resolve => setTimeout(resolve, retryIntervalMilliseconds));

                if (isCanceled) {
                    return;
                }

                try {
                    const result = await Blazor.reconnect();
                    if (!result) {
                        console.log('The server was reached, but the connection was rejected;');
                        //location.reload();
                        return;
                    }

                    console.log('Successfully reconnected to the server.');
                    return;
                } catch {
                    console.log('Did not reach the server; trying again...');
                }
            }

            console.log('Retried too many times; reloading the page...');
            location.reload();
        })();

        return {
            cancel: () => {
                isCanceled = true;
                //reconnectModal.style.display = 'none';
            },
        };
    };

    let currentReconnectionProcess = null;

    Blazor.start({
        circuit: {
            reconnectionHandler: {
                onConnectionDown: () => {
                    console.log('Connection down!');
                    createToast('Connection failed!', ReconnectionMessage);
                    showOverlay();
                    document.getElementById('reloadButton').style.display = 'block';
                    currentReconnectionProcess ??= startReconnectionProcess();
                },
                onConnectionUp: () => {
                    console.log('Connection up!');
                    currentReconnectionProcess?.cancel();
                    currentReconnectionProcess = null

                    hideToasts();
                    hideOverlay();
                    createToast("Connection restored!", ReconnectedMessage, '3s');
                    document.getElementById('reloadButton').style.display = 'none';
                }
            }
        }
    });

    console.log('Blazor started!');
})();