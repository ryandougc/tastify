let i = 1;

async function sendRequest() {
    console.log(i);

    if (++i <= 10) setTimeout(sendRequest, 1000);
}

setTimeout(sendRequest, 10);
