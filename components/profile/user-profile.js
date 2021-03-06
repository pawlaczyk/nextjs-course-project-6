// chroniony komponent przed niezalowanymi użytkownikami
// import { getSession } from "next-auth/client"; //tej funckje mozna uzywać po stronie klient ajak i serwera
// teraz renderuje się tylko dla zalogowanych użytkowników
import { useEffect, useState } from "react";

import ProfileForm from "./profile-form";
import classes from "./user-profile.module.css";

function UserProfile() {
  // getSession zachowuje się inaczej wysyła new request and gets the latest session data and the we can react to the answer, to the response for that request
  // that allows us to manage our own loading state przez dostanie sesji i nasze odpowiednie działania w zwiazku z daną
  // implementacja wymaga użycia useState, na początku true bo się ładują dane
  const [isLoading, setIsLoading] = useState(true);

  //jeśli nie potrzebujemy sesji do niczego wiecej niż nawigacji to można usunac
  // const [loadedSession, setLoadedSession] = useState(); // na początku undefined

  /* NIE trzeba teraz po stronie kleinta bo sesja przekazana jako props z /profile.js z metody getServerSideProps
  // żeby dostać sesję gdy ten komponent jest wyrenderowany - rozwiazanie zamiast useSession hooka z "next-auth/client";
  useEffect(() => { // NIGDY NIE ROBIĆ async - już wtedy zrobić wewnątrz fucnkję i ją wtey async żeby wewnątrz czekać await na promisy
    // Promise, session moze być null jak jej nie mamy
    getSession().then((session) => {
      // interesuje nas tylko fakt czy sesja nie jest nullem
      if (!session) {
        // przekierowanie gdy nei ma sesji
        window.location.href = "/auth"; // ochrona URLI
      } else {
        // jeśli mam sejse a dane sie ładują to tutaj robię ładowanie danych - inaczej w ogóle ten url nie powinien byc widziany przez NIEzalogowanych użytkowników
        setIsLoading(false); //koniec ąłdowania danych - teraz wiem że tylko nie mma sesji
      }
      // a jak sesja jest to wyrenderuje resztę strony
      // setLoadedSession(session); //niepotrzeba bo tylko nas interesuje czy sesja istnieje do nawigacji
    });
  }, []);
  */

  // Redirect away if NOT auth
  // UWAGA loading nie mzienia swojego stanu na true dopóki user nie jest zalogowany
  // const [session, loading] = useSession(); //od razu dostajemy te dwa parametry i moga sie one zmienić if session data was fetched
  // if we don't have a session because we are log out to [session] sie nie zmieni i [loading] tez sie nigdy nie zmieni
  // useSession nie używamy bo nei działa tak jak powinna - wieczny Loading gdy nie ma sesji

  // if (isLoading) {
  //   // spinner jak ładują  się dane
  //   return <p className={classes.profile}>Loading ...</p>;
  // }


  // funckja która wymaga danych od komponentu dziecka
  async function changePasswordHandler(passwordData) {
    // http request
    const response = await fetch('/api/user/change-password', {
      method: 'PATCH',
      body: JSON.stringify(passwordData),
      headers: {
        'Content-Type': 'application/json'
      }
    })

    const data = await response.json();
    // UI - dać userowi odpowiedź jakąs
    console.log(data);

  }
  return (
    <section className={classes.profile}>
      <h1>Your User Profile</h1>
      <ProfileForm onChangePassword={changePasswordHandler}/>
    </section>
  );
}

export default UserProfile;
