const express = require("express");
const app = express();

app.set('port', process.env.NODE_ENV || 3001);

app.use(express.json());
app.use(express.urlencoded({extended: false}));

const indexRouter = require("./routes/index");

// /react/api 로 들어오는 요청에 대한 라우터
app.use('/react/api', indexRouter);

app.listen(app.get('port'), () => {
    console.info('Started on port', app.get('port'));
});