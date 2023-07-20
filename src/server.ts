import 'dotenv/config'

import App from "./lib/app";

const app = new App().express;
const port = process.env.PORT || 4000;

app.listen(port, (err) => {
    if (err) return console.log(err);

    return console.log(`Server is listening on port ${port}`);
});