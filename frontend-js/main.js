import Search from "./modules/search";
import Chat from "./modules/chat";
import RegistrationForm from "./modules/registrationForm";
import Spa from "./modules/spa";

if (document.querySelector("#registration-form")) {
  new RegistrationForm();
}

if (document.querySelector("#chat-wrapper")) {
  new Chat();
  Spa();
}

if (document.querySelector(".header-search-icon")) {
  new Search();
}
