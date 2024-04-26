import React, { useState } from 'react';

function App() {
    const [currentPage, setCurrentPage] = useState('login');
    const [questions, setQuestions] = useState({
        maths: [],
        english: []
    });
    const [currentSubject, setCurrentSubject] = useState('maths');  // Default subject

    // Login handler
    const login = (username, password) => {
        if (username === "teacher" && password === "pass") {
            setCurrentPage('teacher');
        } else if (username === "student" && password === "pass") {
            setCurrentPage('student');
        } else {
            alert("Invalid credentials");
        }
    };

    // Save question handler for both subjects
    const saveQuestion = (question, answer) => {
        if (currentSubject === 'maths' && questions.maths.length >= 5) {
            alert("Maximum of 5 maths questions reached.");
            return;
        }
        if (currentSubject === 'maths') {
            try {
                const evalAnswer = eval(question);  // Evaluates the math expression
                setQuestions(prev => ({
                    ...prev,
                    maths: [...prev.maths, { question, answer: String(evalAnswer) }]
                }));
            } catch (error) {
                alert("Failed to evaluate the math expression. Please check the syntax.");
            }
        } else {
            // For English, directly use the provided answer
            setQuestions(prev => ({
                ...prev,
                english: [...prev.english, { question, answer }]
            }));
        }
        alert(`Question added! Total ${currentSubject} questions: ${questions[currentSubject].length + 1}`);
    };

    const logout = () => {
        setCurrentPage('login');
    };

    return (
        <div className="App">
            {currentPage === 'login' && <LoginPage onLogin={login} />}
            {currentPage === 'teacher' && <TeacherPage onSaveQuestion={saveQuestion} setCurrentSubject={setCurrentSubject} logout={logout} />}
            {currentPage === 'student' && <StudentPage questions={questions[currentSubject]} currentSubject={currentSubject} logout={logout} />}
        </div>
    );
}

function LoginPage({ onLogin }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    return (
        <div>
            <h1>Login Page</h1>
            <input type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} />
            <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
            <button onClick={() => onLogin(username, password)}>Login</button>
        </div>
    );
}

function TeacherPage({ onSaveQuestion, setCurrentSubject, logout }) {
    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState('');  // Answer input for English

    return (
        <div>
            <h1>Teacher Dashboard</h1>
            <select onChange={(e) => setCurrentSubject(e.target.value)}>
                <option value="maths">Maths</option>
                <option value="english">English</option>
            </select>
            <input type="text" placeholder="Enter Question" value={question} onChange={e => setQuestion(e.target.value)} />
            <input type="text" placeholder="Enter Answer (English only)" value={answer} onChange={e => setAnswer(e.target.value)} />
            <button onClick={() => onSaveQuestion(question, answer)}>Submit Question</button>
            <button onClick={logout}>Logout</button>
        </div>
    );
}

function StudentPage({ questions, currentSubject, logout }) {
    const [answers, setAnswers] = useState({});
    const [submitted, setSubmitted] = useState(false);
    const [score, setScore] = useState(0);

    const handleChange = (index, value) => {
        setAnswers(prev => ({ ...prev, [index]: value }));
    };

    const submitAnswers = () => {
        let newScore = 0;
        questions.forEach((question, index) => {
            if (question.answer === answers[index]?.trim()) {
                newScore += 1;
            }
        });
        setScore(newScore);
        setSubmitted(true);
    };

    return (
        <div>
            <h1>Student Dashboard - {currentSubject}</h1>
            {questions.map((question, index) => (
                <div key={index}>
                    <div>{question.question}</div>
                    <input type="text" placeholder="Your Answer" value={answers[index] || ''} onChange={e => handleChange(index, e.target.value)} />
                </div>
            ))}
            <button onClick={submitAnswers}>Submit Answers</button>
            {submitted && <div>Marks: {score} out of {questions.length}</div>}
            <button onClick={logout}>Logout</button>
        </div>
    );
}

export default App;
