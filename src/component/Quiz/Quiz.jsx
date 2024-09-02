import './Quiz.css'
import Confetti from 'react-confetti'
import { useEffect, useState } from 'react'
import { nanoid } from 'nanoid'
import { decode } from 'he'

function Quiz() {
    const [quiz, setQuiz] = useState([]);
    const [score, setScore] = useState(0);
    const [allMarked, setAllMarked] = useState(false);
    const [loading, setLoading] = useState(true);
    const [showScore, setShowScore] = useState(false); // To manage score display
    const [buttonText, setButtonText] = useState('Check answers'); // To manage button
    const [restart, setRestart] = useState(0)
    const url = 'https://opentdb.com/api.php?amount=5&category=9&difficulty=easy&type=multiple';
    
    // This will load the questions into our state object
    useEffect(() => {
        const fetchData = async () => {
            try {
                // const startTime = Date.now(); // Record the start time

                const response = await fetch(url);
                const data = await response.json();

                const quizData = data.results.map(question => ({
                    id: nanoid(),
                    question: decode(question.question),
                    correctAnswer: decode(question.correct_answer),
                    incorrectAnswers: [...question.incorrect_answers.map(decode)],
                    allAnswers: shuffleArray([
                        ...question.incorrect_answers.map(decode),
                        decode(question.correct_answer),
                    ]),
                    selectedAnswer: '',
                    isCorrect: false, // To determine if the answer is correct
                }));

                // const elapsedTime = Date.now() - startTime;
                // const delay = Math.max(0, 5000 - elapsedTime);

                // setTimeout(() => {
                    setQuiz(quizData)
                    setLoading(false);
                // }, delay);
            } catch (error) {
                console.error('Error fetching quiz data:', error);
                setLoading(false);
            }
        };
        fetchData();
    }, [restart]);

    useEffect(() => {
        function checkAllMarked() {
            const totalQuestions = quiz.length;
            const markedCount = quiz.reduce((count, question) => count + (question.selectedAnswer ? 1 : 0), 0);
            setAllMarked(markedCount === totalQuestions);
        }

        checkAllMarked();
    }, [quiz]);

    // Shuffle the array
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1)); // Random index from 0 to i
            [array[i], array[j]] = [array[j], array[i]]; // Swap elements
        }
        return array;
    }

    // This will update the quiz object and set save the selected option into selectedAnswer
    function selectChoice(questionIndex, choiceIndex) {
        setQuiz((prevQuiz) =>
            prevQuiz.map((question, quesIndex) => {
                if (quesIndex === questionIndex) {
                    return {
                        ...question,
                        selectedAnswer: question.allAnswers[choiceIndex],
                    };
                }
                return question;
            })
        );
    }


    function showResult(){
        if(!allMarked){
            alert("Please answer all the questions!!!")
            return;
        }
        setQuiz((prevQuiz) => prevQuiz.map((question) =>(
            question.correctAnswer === question.selectedAnswer ? {...question, isCorrect :true} : {...question}
        )));
        

        // Counting the correct answer
        const correctCount = quiz.reduce((count, question) =>{ 
            if(question.selectedAnswer === question.correctAnswer){
                return count + 1;
            }
            return count;
        },0);

        // Updating state in sate object 
        setScore(correctCount);
        setShowScore(true);
        setButtonText('Play again');
        // alert(`You scored ${score} out of ${quiz.length}`);
    }

    // Restart the quiz
    function restartQuiz(){
        setRestart(prevValue => prevValue + 1);
        setScore(0);
        setAllMarked(false);
        setLoading(true);
        setShowScore(false);
        setButtonText('Check answers');

        // window.location.reload(); // Reloads the page
    }

    // This element will get rendered in quiz
    const questionPaper = quiz.map((question, index) => {
        const choices = question.allAnswers;

        return (
            <div key={question.id}>
                <h1 className='question-box'>{question.question}</h1>
                <ul className='choice-box'>
                    {choices.map((choice, choiceIndex) => {
                        const isSelectd = question.selectedAnswer;
                        const isCorrectAnswer = choice === question.correctAnswer;
                        const isWrongAnswer = isSelectd && !isCorrectAnswer;
                        
                        if(showScore && (choice === question.selectedAnswer || choice === question.correctAnswer)){
                            const  choiceClass = isCorrectAnswer
                            ? 'correct'
                            : isWrongAnswer
                            ? 'wrong'
                            : isSelectd
                            ? 'selected'
                            : 'untouchedOption';
                            return(
                            <li
                                onClick={() => selectChoice(index, choiceIndex)}
                                key={choiceIndex}
                                className={`choice ${choiceClass}`}
                                style={{ pointerEvents: showScore ? 'none' : 'auto'}}
                            >
                                {choice}
                            </li>
                            );
                        } 
                        
                        else if(score){

                            const choiceClass = 'untouchedOption'
                            return(
                                <li
                                    onClick={() => selectChoice(index, choiceIndex)}
                                    key={choiceIndex}
                                    className={`choice ${choiceClass}`}
                                    style={{ pointerEvents: showScore ? 'none' : 'auto'}}
                                >
                                    {choice}
                                </li>
                                );
                        }
                        
                        else{
                            return(
                                <li
                                onClick={() => selectChoice(index, choiceIndex)}
                                key={choiceIndex}
                                className={`choice ${question.selectedAnswer === choice ?  'selected' : '' }`}
                                style={{ pointerEvents: showScore ? 'none' : 'auto'}}
                            >
                                {choice}
                            </li>
                            )
                        }


                        
                    })}
                </ul>
                <hr />
            </div>
        );
    });

    if (loading) {
        return (
            <div className='loader-container'>
                <div className="spinner"></div>
            </div>
        );
    }

    return (
        <div className='quiz-page'>

            { (score === (quiz.length)) &&  <Confetti/>}
            { (score === (quiz.length -1)) &&  <Confetti/>}
            
            {questionPaper}
            <div className='quiz-footer'>

                {showScore && <h3>You scored {score} out of {quiz.length}</h3>}
                <button
                    onClick={ showScore ? restartQuiz : showResult} 
                    className='quiz-button'
                    >
                        {buttonText}
                </button>

            </div>
        </div>
    );
}

export default Quiz;
