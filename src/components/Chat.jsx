import React, { useState, useRef, useEffect } from 'react';
import { FaChartLine, FaMoneyBillWave, FaUniversity, FaPiggyBank } from 'react-icons/fa';


const ChatInterface = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const predefinedQuestions = [
    { text: "What are the latest financial trends in the technology sector?", icon: <FaChartLine className="w-6 h-6" /> },
    { text: "How are tech companies performing in the stock market?", icon: <FaMoneyBillWave className="w-6 h-6" /> },
    { text: "What recent mergers and acquisitions have occurred among tech firms?", icon: <FaUniversity className="w-6 h-6" /> },
    { text: "How is venture capital influencing the growth of tech startups?", icon: <FaPiggyBank className="w-6 h-6" /> }
  ];


  const handleSubmit = async (question) => {
    if (!question.trim()) return;
    
    setMessages(prev => [...prev, { text: question, isUser: true }]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:5000/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          question: question
        })
      });

      const data = await response.json();
      setMessages(prev => [...prev, { text: data.answer, isUser: false }]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, { text: "Sorry, there was an error processing your request.", isUser: false }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b border-gray-800">
        <h1 className="text-2xl font-semibold">KGFinance</h1>
        <button className="px-4 py-2 bg-gray-800 rounded-lg hover:bg-gray-700">
          New Chat
        </button>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto p-4">
        {/* Predefined Questions */}
        {messages.length === 0 && (
          <div className="grid grid-cols-2 gap-4 mb-8">
            {predefinedQuestions.map((q, index) => (
              <button
                key={index}
                className="flex items-center gap-3 p-4 bg-gray-800 rounded-lg hover:bg-gray-700"
                onClick={() => handleSubmit(q.text)}
              >
                {q.icon}
                <span className="text-sm text-left">{q.text}</span>
              </button>
            ))}
          </div>
        )}

        {/* Chat Messages */}
        <div className="space-y-4 mb-8">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[80%] p-3 rounded-lg ${
                message.isUser ? 'bg-blue-600' : 'bg-gray-800'
              }`}>
                {message.text}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="max-w-[80%] p-3 rounded-lg bg-gray-800">
                Loading...!
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-gray-900">
          <div className="max-w-4xl mx-auto">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit(inputValue);
              }}
              className="relative"
            >
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Write your message here..."
                className="w-full p-4 bg-gray-800 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </form>
            <p className="text-gray-400 text-sm mt-2 text-center">
              KGFinance is developed by Rafe Khan
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;