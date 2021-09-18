import { useEffect, useState } from "react";
import { Route, Switch, Redirect, useHistory } from "react-router-dom";
// Popup-ы =================================================================
import AddPlacePopup from "./AddPlacePopup";
import EditProfilePopup from "./EditProfilePopup";
import EditAvatarPopup from "./EditAvatarPopup";
import ImagePopup from "./ImagePopup";
import PopupWithForm from "./PopupWithForm";

import InfoTooltip from "./InfoTooltip";
// Основные компоненты =====================================================
import Header from "./Header";
import Main from "./Main";
import Footer from "./Footer";
// Отдельные страницы ======================================================
import Login from "./Login";
import Register from "./Register";
// Класс Api ===============================================================
import api from "../utils/api";
// Контекст (передаем в него данные пользователя) ==========================
import { CurrentUserContext } from "../contexts/CurrentUserContext";
// Компонент высшего порядка - НОС. Защита маршрутов =======================
import ProtectedRoute from "./ProtectedRoute";
// Импорт всех констант из файла auth.js ===================================
import * as auth from "../utils/auth";

function App() {
  // Первоначальное состояние попапа Profile (False - закрыт)===============
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);

  // Обработчик состояние попапа Profile (Меняем на True)===================
  const onEditProfile = () => {
    setIsEditProfilePopupOpen(true);
  };

  // Первоначальное состояние попапа Place (False - закрыт)=================
  const [isAddPlacePopupOpen, setPlacePopupOpen] = useState(false);

  // Обработчик состояние попапа Place (Меняем на True)=====================
  const onAddPlace = () => {
    setPlacePopupOpen(true);
  };
  // Первоначальное состояние попапа Avatar (False - закрыт)================
  const [isEditAvatarPopupOpen, setAvatarPopupOpen] = useState(false);

  // Обработчик состояние попапа Avatar (Меняем на True)====================
  const onEditAvatar = () => {
    setAvatarPopupOpen(true);
  };

  // Первоначальное состояние попапа Foto (Null)============================
  const [selectedCard, setSelectedCard] = useState(null);

  // Обработчик состояние попапа Foto (Меняем на полученный props)==========
  const onCardClick = (card) => {
    setSelectedCard(card);
  };

  //Синхронный вывод данных User и Card ====================================
  const [cards, setCards] = useState([]);
  const [currentUser, setCurrentUser] = useState({});

  useEffect(() => {
    api
      .renderFirstData()
      .then(([currentUser, cards]) => {
        setCards(cards);
        setCurrentUser(currentUser);
      })
      .catch((error) => {
        console.log(`Ошибка получения данных ${error}`);
      });
  }, []);

  // Закрытие попапа (смена состояния на - False или Null)==================
  function closeAllPopups() {
    setIsEditProfilePopupOpen(false);
    setPlacePopupOpen(false);
    setAvatarPopupOpen(false);
    setSelectedCard(null);
    setInfoTool(false);
  }
  // Исправление(смена) данных пользователя=================================
  function handleUpdateUser(data) {
    api
      .changeDataUser(data)
      .then((currentUser) => {
        setCurrentUser(currentUser);
        closeAllPopups();
      })
      .catch((error) => {
        console.log(`Ошибка получения данных ${error}`);
      });
  }

  // Смена аватара пользователя=============================================
  function handleUpdateAvatar(data) {
    api
      .changeAvatarUser(data)
      .then((currentUser) => {
        setCurrentUser(currentUser);
        closeAllPopups();
      })
      .catch((error) => {
        console.log(`Ошибка данных ${error}`);
      });
  }

  // Лайк карточки =========================================================
  function handleCardLike(card) {
    // Снова проверяем, есть ли уже лайк на этой карточке
    const isLiked = card.likes.some((i) => i._id === currentUser._id);

    // Отправляем запрос в API и получаем обновлённые данные карточки
    api
      .changeLikeCardStatus(card._id, isLiked)
      .then((newCard) => {
        setCards((state) =>
          state.map((item) => (item._id === card._id ? newCard : item))
        );
      })
      .catch((error) => {
        console.log(`Ошибка данных лайков ${error}`);
      });
  }

  // Удаление карточки =====================================================
  function handleCardDelete(card) {
    api
      .deleteCardUser(card._id)
      .then(() => {
        setCards(cards.filter((c) => c._id !== card._id));
      })
      .catch((error) => {
        console.log(`Ошибка удаления карточки ${error}`);
      });
  }

  // Добавление карточки ===================================================
  function handleAddPlaceSubmit(userCard) {
    api
      .setCardUser(userCard)
      .then((newArrCard) => {
        setCards([newArrCard, ...cards]);
        closeAllPopups();
      })
      .catch((error) => {
        console.log(`Ошибка данных карточки ${error}`);
      });
  }

  const history = useHistory();

  // Состояние пользователя — авторизован или нет. Изначально - нет (False)
  const [loggedIn, setLoggedIn] = useState(false);
  const [email, setEmail] = useState({});

  // Первоначальное состояние InfoToolTip ==================================
  const [infoTool, setInfoTool] = useState(false);

  const authToken = async (jwt) => {
    return auth.getToken(jwt).then((res) => {
      if (res) {
        setLoggedIn(true);
        setEmail(res.data.email);
        history.push("/");
      }
    });
  };

  useEffect(() => {
    const jwt = localStorage.getItem("jwt");
    if (jwt) {
      authToken(jwt); //функция авторизации
    }
  });

  const [message, setMessage] = useState("");
  const [image, setImage] = useState(false);

  // Регистрация нового пользователя =======================================
  function onRegister({ email, password }) {
    return auth
      .register({ email, password })
      .then((res) => {
        setMessage("Вы успешно зарегистрировались");
        setImage(true);
        setInfoTool(true);

        setTimeout(function () {
          closeAllPopups();
        }, 2000);

        history.push("/sign-in");

        return res;
      })
      .catch((error) => {
        setMessage("Что-то пошло не так! Попробуйте ещё раз.");
        setImage(false);
        setInfoTool(true);

        if (error.status === 400) {
          return console.log("не передано одно из полей");
        }
      });
  }

  // Вход пользователя =======================================
  function onLogin({ email, password }) {
    auth
      .authorize(email, password)
      .then((res) => {
        if (res.token) {
          setLoggedIn(true);
          setEmail(email);

          localStorage.setItem("jwt", res.token);
          history.push("/");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  // Выход пользователя
  function onSignOut() {
    localStorage.removeItem("jwt");
    setLoggedIn(false);
  }

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="page">
        <Route exact path="/">
          <Header
            email={email}
            btnLink="Выйти"
            pathLink="/sign-in"
            onEndSession={onSignOut}
          />
        </Route>
        <Switch>
          <ProtectedRoute
            exact
            path="/"
            loggedIn={loggedIn}
            component={Main}
            cards={cards}
            setCards={setCards}
            handleEditProfileClick={onEditProfile}
            handleAddPlaceClick={onAddPlace}
            handleEditAvatarClick={onEditAvatar}
            handleCardClick={onCardClick}
            onCardLike={handleCardLike}
            onCardDelete={handleCardDelete}
          />

          <Route path="/sign-in">
            <Login onLogin={onLogin} />
          </Route>
          <Route path="/sign-up">
            <Register onRegister={onRegister} />
          </Route>
          <Route>
            {loggedIn ? <Redirect to="/" /> : <Redirect to="/sign-in" />}
          </Route>
        </Switch>
        <Footer />

        <ImagePopup card={selectedCard} onClose={closeAllPopups} />
        <EditProfilePopup
          isOpen={isEditProfilePopupOpen}
          onClose={closeAllPopups}
          onUpdateUser={handleUpdateUser}
        ></EditProfilePopup>
        <AddPlacePopup
          isOpen={isAddPlacePopupOpen}
          onClose={closeAllPopups}
          onUpdateCard={handleAddPlaceSubmit}
        ></AddPlacePopup>
        <EditAvatarPopup
          isOpen={isEditAvatarPopupOpen}
          onClose={closeAllPopups}
          onUpdateAvatar={handleUpdateAvatar}
        ></EditAvatarPopup>
        <PopupWithForm
          onClose={closeAllPopups}
          name="delete_card"
          title="Вы уверены?"
          btnName="Да"
        ></PopupWithForm>
        <InfoTooltip
          isOpen={infoTool}
          message={message}
          onClose={closeAllPopups}
          image={image}
        ></InfoTooltip>
      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;
