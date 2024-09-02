import PropTypes from 'prop-types'
import './Home.css'

function Home(props){
    return(
    //     <div className="container">
    // </div>
        <div className="quiz-box">
            <h1>Quizzical</h1>
            <p>{`Let's test your knowledge...`} </p>
            <button 
                className="start-button"
                onClick={props.redirect}
            >
                Start quiz
            </button>
        </div>

    )
}

Home.propTypes = {
    redirect: PropTypes.func, 
};


export default Home