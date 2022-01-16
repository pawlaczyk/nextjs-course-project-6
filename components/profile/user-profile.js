// chroniony komponent przed niezalowanymi użytkownikami
import {getSession } from "next-auth/client";
import { useEffect, useState } from "react";

import ProfileForm from "./profile-form";
import classes from "./user-profile.module.css";

function UserProfile() {
  // getSession zachowuje się inaczej wysyła new request and gets the latest session data and the we can react to the answer, to the response for that request
  // that allows us to manage our own loading state przez dostanie sesji i nasze odpowiednie działania w zwiazku z daną
  // implementacja wymaga użycia useState, na początku true bo się ładują dane
  const [isLoading, setIsLoading] = useState(true);
  const [loadedSession, setLoadedSession] = useState(); // na początku undefined

  // żeby dostać sesję gdy ten komponent jest wyrenderowany
  useEffect(() => {
    // Promise, session moze być null jak jej nie mamy
    getSession().then((session) => {
      // interesuje nas tylko fakt czy sesja nie jest nullem
      setLoadedSession(session);
      setIsLoading(false);
    });
  }, []);

  // Redirect away if NOT auth
  // UWAGA loading nie mzienia swojego stanu na true dopóki user nie jest zalogowany
  // const [session, loading] = useSession(); //od razu dostajemy te dwa parametry i moga sie one zmienić if session data was fetched
  // if we don't have a session because we are log out to [session] sie nie zmieni i [loading] tez sie nigdy nie zmieni
  // useSession nie używamy bo nei działa tak jak powinna - wieczny Loading gdy nie ma sesji

  if (loading) {
    // spinner jak ładują  się dane
    return <p className={classes.profile}>Loading ...</p>;
  }

  return (
    <section className={classes.profile}>
      <h1>Your User Profile</h1>
      <ProfileForm />
    </section>
  );
}

export default UserProfile;
