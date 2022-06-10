import Room from "../models/Room";
import User from "../models/User";
/*
callback: 에러를 바로 볼 수 있지만 기다리는 기능이 없어서 DB에서 불러오는
시간이 있어서 순서가 꼬인다
await, async : DB에게 결과 값을 받을 때까지 js가 기다리고 매우 직관적이다.
***async function***
async function 선언은 AsyncFunction객체를 반환하는 하나의 비동기 함수를 정의합니다.
비동기 함수는 이벤트 루프를 통해 비동기적으로 작동하는 함수로, 암시적으로 Promise를
사용하여 결과를 반환합니다. 그러나 비동기 함수를 사용하는 코드의 구문과 구조는,
표준 동기 함수를 사용하는것과 많이 비슷합니다.
*/
const HTTP_FORBIDDEN = 403;
const HTTP_PAGE_NOT_FOUND = 404;

// globalRouter
export const home = async (req, res) => {
  const rooms = await Room.find({}).sort({ createdAt: "desc" });
  return res.render("rooms/home", { pageTitle: "Home", rooms });
};

/*
라우터로 지정한 :id -> req.params
pug파일에서 input으로 받은 내용 -> req.body(form이 POST일 때)
pug파일에서 input으로 받은 url내용 -> req.query (form이 GET일 때)
*/
export const search = async (req, res) => {
  const { keyword } = req.query;
  let rooms = [];
  // RegExp을 이용하여 정규표현식으로 검색기능 구현
  // "i" 대소문자를 구별하지 않고 검색
  if (keyword) {
    rooms = await Room.find({
      title: {
        $regex: new RegExp(`${keyword}$`, "i"),
      },
    });
  }
  return res.render("rooms/search", { pageTitle: "Search", rooms });
};

// roomRouter
export const detail = async (req, res) => {
  const { id } = req.params;
  const room = await Room.findById(id).populate("host");
  if (!room) {
    return res
      .status(HTTP_PAGE_NOT_FOUND)
      .render("404", { pageTitle: "Room not found." });
  }
  return res.render("rooms/detail", { pageTitle: room.title, room });
};

export const getEdit = async (req, res) => {
  const { id } = req.params;
  const {
    user: { _id },
  } = req.session;
  const room = await Room.findById(id);
  if (!room) {
    return res
      .status(HTTP_PAGE_NOT_FOUND)
      .render("404", { pageTitle: "Room not found." });
  }
  if (String(room.host) !== req.session.user._id) {
    return res.status(HTTP_FORBIDDEN).redirect("/");
  }
  return res.render("rooms/editRoom", {
    pageTitle: `Edit : ${room.title}`,
    room,
  });
};

export const postEdit = async (req, res) => {
  const {
    user: { _id },
  } = req.session;
  const { id } = req.params;
  const { title, description, city, price, amenities } = req.body;
  const room = await Room.findById(id);
  if (!room) {
    return res
      .status(HTTP_PAGE_NOT_FOUND)
      .render("404", { pageTitle: "Room not found." });
  }
  console.log(String(room.host));
  if (String(room.host) !== req.session.user._id) {
    return res.status(HTTP_FORBIDDEN).redirect("/");
  }
  await Room.findByIdAndUpdate(id, {
    title,
    description,
    city,
    price,
    amenities: Room.formatAmenities(amenities),
  });
  return res.redirect(`/rooms/${id}`);
};

export const getUpload = (req, res) => {
  return res.render("rooms/upload", { pageTitle: "Upload Room" });
};

export const postUpload = async (req, res) => {
  // here we will add a room to the rooms array.
  const {
    user: { _id },
  } = req.session;
  const { path: fileUrl } = req.file;
  const { title, description, city, price, amenities } = req.body;
  try {
    const newRoom = await Room.create({
      title,
      description,
      city,
      price,
      amenities: Room.formatAmenities(amenities),
      fileUrl,
      host: _id,
    });
    const user = await User.findById(_id);
    user.rooms.push(newRoom._id);
    user.save();
    return res.redirect("/");
  } catch (error) {
    console.log("error : ", error);
    return res.render("rooms/upload", {
      pageTitle: "Upload Room",
      errorMessage: error._message,
    });
  }
};

export const deleteRoom = async (req, res) => {
  const { id } = req.params;
  const {
    user: { _id },
  } = req.session;
  const room = await Room.findById(id);
  const user = await Room.findById(_id);
  if (!room) {
    return res
      .status(HTTP_PAGE_NOT_FOUND)
      .render("404", { pageTitle: "Room not found." });
  }
  if (String(room.host) !== String(_id)) {
    return res.status(HTTP_FORBIDDEN).redirect("/");
  }
  // findByIdAndDelete(id) (=findOneAndDelete({_id:id}))
  await Room.findByIdAndDelete(id);
  user.rooms.splice(user.rooms.indexOf(id), 1);
  user.save();
  return res.redirect("/");
};
