import express from "express";
import morgan from "morgan";
import session from "express-session";
import MongoStore from "connect-mongo";
import rootRouter from "./routers/rootRouter";
import userRouter from "./routers/userRouter";
import roomRouter from "./routers/roomRouter";
import flash from "express-flash";
import { localsMiddleware } from "./middlewares";
import { connection } from "mongoose";

const app = express();
// morgan: 로그를 남겨주는 모듈
const logger = morgan("dev");

//pug template engine 사용 프로젝트폴더/src/views 이동경로설정
app.set("view engine", "pug");
app.set("views", process.cwd() + "/src/views");
// header에 express 프레임워크 표시 안하기 위함
app.set("x-powered-by", "false");

// morgan("dev") 사용
app.use(logger);

/* 
- express 프레임 워크가 front 단 form 데이터를 읽기위함
- extended:false는 nodejs에 내장된 querystring 모듈 사용
- .urlencoded()은 x-www-form-urlencoded형태의 데이터를
- .json()은 JSON형태의 데이터를 해석해줍니다.
- express 인코딩은 body-parser를 이용한 것
❗
import bodyParser from "body-parser";
app.use(bodyParser.urlencoed(extended: true)); 와 같음
*/
app.use(express.urlencoded({ extended: true }));

/*  
세션 데이터는 쿠키 자체에 저장되지 않고 세션 ID에만 저장됩니다.
세션 데이터는 서버 측에 저장됩니다.

** resave (변경 사항이 없어도 저장) **
모든 request마다 세션의 변경사항이 있든 없든 세션을 다시 저장한다.
- true: 스토어에서 세션 만료일자를 업데이트 해주는 기능이 따로 없으면 true로 
설정하여 매 request마다 세션을 업데이트 해주게 한다.
- false: 
변경사항이 없음에도 세션을 저장하면 비효율적이므로 동작 효율을 높이기 위해
사용한다. 각각 다른 변경사항을 요구하는 두 가지 request를 동시에 처리할때
세션을 저장하는 과정에서 충돌이 발생할 수 있는데 이를 방지하기위해 사용한다.

** saveUninitialized **
uninitialized 상태인 세션을 저장한다. 여기서 uninitialized 상태인 세션이란
request 때 생성된 이후로 아무런 작업이 가해지지않는 초기상태의 세션을 말한다.
- true: 클라이언트들이 서버에 방문한 총 횟수를 알고자 할때 사용한다.
- false: uninitialized 상태인 세션을 강제로 저장하면 내용도 없는 빈 
세션이 스토리지에 계속 쌓일수 있다. 이를 방지, 저장공간을 아끼기 위해 사용한다.

** secret **
쿠키에 sign 할 때 사용하는 string 

*/
app.use(
  session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      client: connection.client,
    }),
  })
);

app.use(flash());
app.use(localsMiddleware);
app.use("/uploads", express.static("uploads"));
app.use("/imgs", express.static("img"));
app.use("/static", express.static("assets"));
app.use("/", rootRouter);
app.use("/users", userRouter);
app.use("/rooms", roomRouter);

export default app;
