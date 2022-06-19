const roomContainer = document.getElementById("roomContainer");
const form = document.getElementById("reviewForm");

const addReview = (text, id) => {
  const roomReviews = document.querySelector(".detail_room_reviews ul");
  const newReview = document.createElement("li");
  newReview.className = "detail_room_review";
  newReview.dataset.id = id;
  const icon = document.createElement("i");
  icon.className = "fas fa-comment";
  const span = document.createElement("span");
  span.innerText = ` ${text}`;
  const deletespan = document.createElement("span");
  deletespan.innerText = ` ❌`;
  newReview.appendChild(icon);
  newReview.appendChild(span);
  newReview.appendChild(deletespan);
  roomReviews.prepend(newReview);
};

const handleSubmit = async (event) => {
  event.preventDefault();
  const textarea = form.querySelector("textarea");
  const text = textarea.value;
  const roomId = roomContainer.dataset.id;
  if (text === "") {
    return;
  }
  const response = await fetch(`/api/rooms/${roomId}/review`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text }),
  });
  if (response.status === 201) {
    textarea.value = "";
    const { newReviewId } = await response.json();
    addReview(text, newReviewId);
  }
};

if (form) {
  form.addEventListener("submit", handleSubmit);
}
