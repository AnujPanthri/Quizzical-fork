import Home from "./component/Home/Home"
import Quiz from "./component/Quiz/Quiz"
import {useState} from 'react'
import "./App.css"
function App(){

  const [page, setPage] = useState(false);
  
  function changePage(){
    setPage(prevPage => !prevPage);
  }


  return( page ? <Quiz/> : <Home redirect ={()=> changePage()}/> );
}


export default App