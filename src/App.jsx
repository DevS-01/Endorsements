import { useState,  useEffect} from 'react'
import freddie from './assets/freddie.png'

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const appSetting ={
  databaseURL: "https://endorsements-9c06f-default-rtdb.asia-southeast1.firebasedatabase.app/"
}

const app = initializeApp(appSetting)
const database = getDatabase(app)
const endorsements = ref(database, "Endorsements")

function App() {

  const [endor, setEndor] = useState('')
  const [list, setList] = useState([])

  function handlechange(e){
    setEndor(e.target.value)
  }

  function addhandle(){
    const value = endor ? endor : null
    push(endorsements, value)
    clear()
  }

  function removehandle(itemId){
    let deleteItem = ref(database, `Endorsements/${itemId}`)
    remove(deleteItem)
  }

  function clear(){
    setEndor('')
  }

  function addEndorsements(item){
    return (
      <div key={item[0]} className='endor' 
      onClick={() => removehandle(item[0])}>

        <p key={item[0]} className='endor-para'>{item[1]}</p>
      </div>
    )
  }

  useEffect(() => {
    onValue(endorsements, function(snapshot){
      if(snapshot.exists()){
        setList([])
        let items = Object.entries(snapshot.val())
        setList(items)
      }

      else{
        setList([])
      }
    })
  }, [])

  return (
    <div className='main'>   
      <div className="container">
        <img src={freddie} alt='freddie' className='fred'/>
        <h1 className='header'>We are the champions</h1>

        <textarea 
        placeholder='Write your endorsement here'
        value={endor}
        onChange={(e) => handlechange(e)}/>

        <button className='btn' onClick={() => addhandle()}>Publish</button>
        <h3>- Endorsements -</h3>

      </div>
      
      <div className='reverse'>
        {list.map(items => addEndorsements(items))}
      </div>

      {list.length ? null : <p className='display-msg'>No endorsements to diplay here.</p>}
    </div>
  )
}

export default App
