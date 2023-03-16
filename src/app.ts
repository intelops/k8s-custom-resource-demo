import express, {Application, Request, Response, Router} from 'express';
import "dotenv/config";
import bodyParser from 'body-parser';
import helmet from "helmet";
import config from "./util/constants";
import employeesRouter from "./routes/employees";
import {initializeKubeClient} from "./store/kube-client";
import "@kubernetes/client-node"

export const client = initializeKubeClient()

const app: Application = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(helmet())

// Enabled Access-Control-Allow-Origin", "*" in the header to by-pass the CORS error.
app.use((req: Request, res: Response, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    //Needed for PUT requests
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, X-User-Name");
    res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
    next();
});


app.get('/', (req: Request, res: Response) => {
    res.send('TS App is Running')
})

const routes = Router();
routes.use('/employees', employeesRouter)
app.use(routes)

app.get("*", (req, res) => {
    return res.status(200).json("you have reached default route");
});

app.listen(parseInt(<string>config.server_port), "0.0.0.0", () => {
    console.log(`server is running on PORT 0.0.0.0:${config.server_port}`)
})