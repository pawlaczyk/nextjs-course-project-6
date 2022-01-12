import { useState, useRef } from "react";
import { signIn } from "next-auth/client";
// https://next-auth.js.org/getting-started/client
// import { signIn } from "next-auth/react";

import classes from "./auth-form.module.css";

// funckja rejestracji - można do innego pliku wrzucić
async function createUser(email, password) {
  const response = await fetch("/api/auth/signup", {
    method: "POST",
    body: JSON.stringify({ email, password }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await response.json(); // też zwraca Promise
  if (!response.ok) {
    throw new Error(data.message || "Somethin wen wrong");
  }
}

function AuthForm() {
  const emailInputRef = useRef();
  const passwordInputRef = useRef();
  const [isLogin, setIsLogin] = useState(true);

  // przełączanie zaloguj / zarejestruj
  function switchAuthModeHandler() {
    setIsLogin((prevState) => !prevState);
  }

  async function submitHandler(event) {
    event.preventDefault();

    const enteredEmail = emailInputRef.current.value;
    const enteredPassword = passwordInputRef.current.value;

    // dodać walidacje na froncie, zeby user od razu coś widział, ale jej nie ufać bo po stronie klienta

    if (isLogin) {
      //  logowanie tu NIE WSYLAM requesta do api I NIE POWINNAM tego robić
      // pierwszy argument to provider - bo mozemy mieć kilka providerów w tej samej aplikacji

      // {redirect: false}
      // drugi argument to obiekt konfiguracji - false bo już mamy swoją stronę rejestracji linia [...nextauth].js- throw ne Error('No user found')
      //  bez tego by default when authentication failed enxtjs will redirect us to another page to an error page it is something we
      // could utilize we can the set up such an error page ans then we can configure that error page [dokumentacj providers https://next-auth.js.org/]
      // ale zwyczajowo pozostawia się usra na stronie na której jest i na tej samej stronie pokazuje się error message BEZ przekierowań
      //kolejny atrybut obiektu konfiguracji to credentails data które chcemy wysłać do backendu, ten obiekt jest w [NextAuth.authorize(credentiasl) funckji] jako argument

      //zwraca promisa zawsze nawet jak mamy błąd na backendzie w kodzie autentykacji, obiekt będzie mieć informacje o błedzie
      // jak nie ma błedu to result jest dalej obiektem tylko bez infomacji o błedzie, więc nigdy nie zwróci błedu tylko content obiektu będzie inny
      const result = await signIn("credentials", {
        redirect: false,
        email: enteredEmail,
        password: enteredPassword,
      });

      console.log(result);
    } else {
      // rejestracja tu trzeba do api wsysyłać requesta
      try {
        const result = await createUser(enteredEmail, enteredPassword);
        // user was created  - notifkacja
        console.log(result);
      } catch (error) {
        // jakiś błąd przy rejestracji - notifkacja
        console.log(error);
      }
    }
  }

  return (
    <section className={classes.auth}>
      <h1>{isLogin ? "Login" : "Sign Up"}</h1>
      <form onSubmit={submitHandler}>
        <div className={classes.control}>
          <label htmlFor="email">Your Email</label>
          <input type="email" id="email" required ref={emailInputRef} />
        </div>
        <div className={classes.control}>
          <label htmlFor="password">Your Password</label>
          <input
            type="password"
            id="password"
            required
            ref={passwordInputRef}
          />
        </div>
        <div className={classes.actions}>
          <button>{isLogin ? "Login" : "Create Account"}</button>
          <button
            type="button"
            className={classes.toggle}
            onClick={switchAuthModeHandler}
          >
            {isLogin ? "Create new account" : "Login with existing account"}
          </button>
        </div>
      </form>
    </section>
  );
}

export default AuthForm;
