
import './App.css';
//impt
import PropTypes from 'prop-types'
import nlp from 'compromise';
//import Navbar from './components/Navbar';
import React, { useState } from 'react'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from "react-router-dom";
//impr
//import React from 'react'
//imr 
//clg --console.log("")

function TextForm(props) {
  const handleUpClick=()=>{
    let newText=text.toUpperCase();
    setText(newText)
    props.ShowAlert('Coverted to UpperCase!','success');
  }

  const handleworddoclick=()=>{
    let newText1=text.toLowerCase();
    setText(newText1)
    props.ShowAlert('Coverted to LowerCase!','success');
  }

  const handleExtraSpaces=()=>{
    let newText=text.split(/\s+/);
    // + one or more occurences
    // . matches single character
    setText(newText.join(' '));
    props.ShowAlert('Extra Spaces are removed','success');
  }

  const handleClearClick=()=>{
    setText("");
    setResult([]);
    setMessage(" ");
  }

  const handleEmailClick=()=>{
    const emailreg=/[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}/g ;
    const emailmatch=text.match(emailreg);
    if(emailmatch){
      setMessage(`email found: ${emailmatch.join(', ')}`)
      props.ShowAlert('Found Emails','success');
    }
    else{
      setMessage('NO email found')
      props.ShowAlert('Not Found any','warning');
    }
  }

  const handleGrammarClick=()=>{
    let doc=nlp(text);
    let words=text.split(' ');
    let analyzedwords=words.map((word)=>{let worddoc=nlp(word);
      if (worddoc.nouns().length > 0) {
        return `${word}: Noun`; 
      } else if (worddoc.adjectives().length > 0) {
        return `${word}: Adjective`; 
      } else if (worddoc.adverbs().length > 0) {
        return `${word}: Adverb`; 
      } else if (worddoc.verbs().length > 0) {
        return `${word}: Verb`; 
      } else {
        return `${word}: Unknown`; 
      }
    })
    setResult(analyzedwords);
    props.ShowAlert('VocabularyCheck Complete','success');
  }

  const wordCount=(text)=>{
    //non empty strings are considered as words
    return text.split(' ').filter(word=>word!=='').length;
  }

  const charCount=(text)=>{
    return text.replace(/\s+/g, '').length;
  }
  
  const handleOnChange=(event)=>{
    setText(event.target.value)
    
  }
  
  const[text,setText]=useState('');
  const[result,setResult]=useState([]);
  const[message,setMessage]=useState('');
 
 
  return (
    <> 
      <div className="container" style={{color:props.mode==='dark'?'white':'black'}}>
      <h1 className='mb-2'>{props.heading}</h1>
      <div className="mb-3">
        <textarea className="form-control" value={text} onChange={handleOnChange} id="mybox" rows='8' style={{background:props.mode==='dark'?
          '#2d3130':'white',color:props.mode==='dark'?'white':'black'}}></textarea>
      </div>
      <div className='mb-3'>
      <button disabled={text.length===0}  className="btn btn-dark mx-1 my-1"  onClick={handleUpClick}>Convert to UpperCase</button>
      <button disabled={text.length===0} className="btn btn-dark mx-1 my-1"  onClick={handleworddoclick}>Convert to LowerCase</button>
      <button disabled={text.length===0} className="btn btn-dark mx-1 my-1"  onClick={handleClearClick}>Clear text</button>
      <button disabled={text.length===0} className="btn btn-dark mx-1 my-1"  onClick={handleGrammarClick}>Learn word vocabulary</button>
      <button disabled={text.length===0} className="btn btn-dark mx-1 my-1"  onClick={handleEmailClick}>List out Emails</button>
      <p>{message}</p>
      <button disabled={text.length===0} className="btn btn-dark mx-1 my-1"  onClick={handleExtraSpaces}>Remove extra space</button>
      </div>
      {result.length > 0 && (
          <div className="mb-3">
            <h4>Results:</h4>
            <ul>
              {result.map((res, index) => (
                <li key={index}>{res}</li> // Display each word with its type
              ))}
            </ul>
          </div>
        )}
      <div className="container my-3" style={{color:props.mode==='dark'?'white':'black'}}>
        <h1>Your text summary</h1>
        <p>{text===""?0:wordCount(text)} words and {charCount(text)}characters</p>
        <p>{text===""?0*0.008:wordCount(text)*0.008.toFixed(2)} Minutes read</p>
        <h2>preview </h2>
        <p>{text.length>0?text:"No text above to preview it"}</p>
      </div>
      </div>

      </>
  );
}

function App() {
  const [mode,setMode]=useState('light');
  const [alert,SetAlert]=useState(null);

  const ShowAlert=(message,type)=>{
    //after setalert brackets because we are returning  or setting object
    SetAlert({
      message:message,
      type:type
    })
    setTimeout(()=>{
      SetAlert(null);
    },1500)

  }
  const toggleMode= ()=>{
    if(mode==='light'){
       setMode('dark');
       document.body.style.backgroundColor='grey';
       ShowAlert('Dark mode has been enabled','success');
       //document.title='TextTinker-Dark mode';
    }
    else{
      setMode('light');
      document.body.style.backgroundColor='white';
      ShowAlert('Light mode has been enabled','success');
      //document.title='TextTinker-Light mode';
    }
  }
  return (
   <>
   <Router >
    <Navbar title="TextTinker" mode={mode} toggleMode={toggleMode} />
    <Alert alert={alert}/>
    <div className='container mb-3'>
    <Routes>
    <Route exact path="/about" element={<About mode={mode} />} />
    <Route exact path="/" element={<TextForm heading=" Try TextTinker-word/character counter, Remove extra spaces" mode={mode} ShowAlert={ShowAlert}/>}/>
    </Routes>
    </div>
    </Router>
   </>
);
}

function Alert(props){
  const capitalize=(word)=>{
    const lowerword=word.toLowerCase();
    return lowerword.charAt(0).toUpperCase()+lowerword.slice(1);
  }
  return(
    //to avoid cummilative layout shift we set the height 
    <div style={{height:'50px'}}>
     {props.alert && <div className={`alert alert-${props.alert.type} alert-dismissible fade show`} role="alert">
     <strong>{capitalize(props.alert.type)}</strong>: {props.alert.message} 
  </div>}
  </div>
  )
}
 function Navbar(props) {
  return (
    <nav className={`navbar navbar-expand-lg navbar-${props.mode} bg-${props.mode}`} > 
    <div className="container-fluid" >
        <Link className="navbar-brand " to="/">{props.title}</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                <li className="nav-item">
                    <Link className="nav-link active " aria-current="page" to="/">Home</Link>
                </li>
                <li className="nav-item">
                    <Link className="nav-link " to="/about">{props.aboutText}</Link>
                </li>
            </ul>
            <div className={`form-check form-switch text-${props.mode==='light'?'dark':'light'}`}>
                <input className="form-check-input" onClick={props.toggleMode} type="checkbox" id="flexSwitchCheckDefault"/>
                <label className="form-check-label" htmlFor="flexSwitchCheckDefault">Enable DarkMode</label>
            </div>
        </div>
    </div>
</nav>
  )
}

function About(props) {
  /*
  const [myStyle,setMyStyle]=useState({
    color:'black',
    background:'white'
  })
  
  const [btntext,setBtnText]=useState('Enable dark mode')

  const toggleStyle=()=>{
       if(myStyle.color==='black'){
        setMyStyle({
          color:'white',
          background:'grey'
        })
        setBtnText('Enable Light mode')
       }
       else{
        setMyStyle({
          color:'black',
          background:'white',
          border:'2px solid white'
        })
        setBtnText('Enable Dark mode')
       }
  }
 */
let myStyle={
  color:props.mode==='dark'?'white':'black',
  backgroundColor: props.mode ==='dark'?'rgb(45, 49, 48)':'white', 
  border:'2-px solid'
  
}
  return (
    <div className="container" >
      <h1 className="my-3" style={{color: props.mode ==='dark'?'white':'black'}}>About Us</h1>
    <div className="accordion" id="accordionExample" >
  <div className="accordion-item">
    <h2 className="accordion-header">
      <button className="accordion-button"  style={myStyle} type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
      <strong>Analyze Your text </strong>
      </button>
    </h2>
    <div id="collapseOne" className="accordion-collapse collapse show" data-bs-parent="#accordionExample">
      <div className="accordion-body" style={myStyle}>
         TextTinker gives you a way to analyze your text quickly and efficiently. Be it word count, character count or 
      </div>
    </div>
  </div>
  <div className="accordion-item">
    <h2 className="accordion-header">
      <button className="accordion-button collapsed" style={myStyle} type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
      <strong>Free to use </strong>
      </button>
    </h2>
    <div id="collapseTwo" className="accordion-collapse collapse" data-bs-parent="#accordionExample">
      <div className="accordion-body" style={myStyle}>
        TextTinker is a free character counter tool that provides instant character count & word count statistics for a given text. TextUtils reports the number of words and characters. Thus it is suitable for writing text with word/ character limit. 
      </div>
    </div>
  </div>
  <div className="accordion-item">
    <h2 className="accordion-header">
      <button className="accordion-button collapsed" style={myStyle} type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
      <strong>Browser Compatible  </strong>
      </button>
    </h2>
    <div id="collapseThree" className="accordion-collapse collapse" data-bs-parent="#accordionExample">
      <div className="accordion-body" style={myStyle}>
        This word counter software works in any web browsers such as Chrome, Firefox, Internet Explorer, Safari, Opera. It suits to count characters in facebook, blog, books, excel document, pdf document, essays, etc.
      </div>
    </div>
  </div>
</div>
{/*
<div className="container my-3">
      <button onClick={toggleStyle} className="btn btn-primary" style={{background:props.mode==='dark'?'#343a40':'black'}} >{btntext}</button>
    </div>
  */}
</div>

  )
}
export default App;


Navbar.propTypes={
  title:PropTypes.string.isRequired,
  aboutText:PropTypes.string
}

Navbar.defaultProps={
  title:'set title here',
  aboutText:'About'
};



