import { useState } from 'react';
import './App.css';
import axios from 'axios';
import { motion } from 'framer-motion';

function App() {
  const [question, setquestion] = useState('');
  const [answer, setanswer] = useState('');

  async function generateAnswer() {
    setanswer('Loading...');
    const response = await axios({
      url: "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyCJNnZBorwdHKh5MO8lzCJGPpzHGnGSKdI",
      method: "POST",
      data: {
        "contents": [{
          "parts": [{ "text": question }],
        }]
      },
    });
    const generatedAnswer = response['data']['candidates'][0]['content']['parts'][0]['text'];

    // Check if the answer contains code (simple heuristic: check for backticks)
    if (generatedAnswer.includes('```')) {
      const formattedCode = generatedAnswer
        .replace(/```(.*?)\n([\s\S]*?)```/g, '<pre><code class="code-block">$2</code></pre>'); // Format code blocks
      setanswer(formattedCode);
    } else {
      setanswer(generatedAnswer);
    }
  }

  return (
    <div className="app-container">
      <motion.h1 
        className="title"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Abinash GPT
      </motion.h1>
      <motion.textarea
        className="input-box"
        value={question}
        onChange={(e) => setquestion(e.target.value)}
        cols="30"
        rows="10"
        placeholder="Type your question here..."
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      />
      <motion.button
        className="generate-button"
        onClick={generateAnswer}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        Generate Answer
      </motion.button>
      <motion.div
        className="answer-box"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        dangerouslySetInnerHTML={{ __html: answer }} // Render HTML for formatted code
      />
    </div>
  );
}

export default App;
