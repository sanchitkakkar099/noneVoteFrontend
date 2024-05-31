import Login from "./components/auth/LoginSingup";
import "bootstrap/dist/css/bootstrap.min.css";
import "./style.css";
import pageContent from "./layouts/pageContent"; 


export default function App({children}) {
  return(
    <pageContent children={children}/>

  );
}
