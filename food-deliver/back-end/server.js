import exxpress from 'express';
import cors from 'cors';

//app config
const app = exxpress();
const port = 3000;

//middlewares
app.use(exxpress.json());
app.use(cors());

app.get('/', (req, res) => {
    res.send("API Working");
});

app.listen(port, () => {
    console.log(`Server is running on port http://localhost:${port}`);
});