import * as path from "path";
import * as dotenv from "dotenv";

import App from "./lib/app";

dotenv.config({ path: path.join(__dirname, "../../.env") });

const app = new App().express;
const port = process.env.PORT || 4000;

app.listen(port, (err) => {
    if (err) return console.log(err);

    return console.log(`Server is listening on port ${port}`);
});
