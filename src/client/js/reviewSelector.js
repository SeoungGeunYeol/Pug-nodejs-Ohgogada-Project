const detail_room_reviews = document.getElementById("detail_room_reviews");
const form = document.getElementById("reviewForm");

const handleSubmit = async (event) => {
  event.preventDefault();
  const textarea = form.querySelector("textarea");
  const text = textarea.value;
  const roomId = detail_room_reviews.dataset.id;
  if (text === "") {
    return;
  }
  await fetch(`/api/rooms/${roomId}/review`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text }),
  });
  textarea.value = "";
};
if (form) {
  form.addEventListener("submit", handleSubmit);
}
