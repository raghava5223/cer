import React, { useState } from 'react';
import ChatBot from 'react-chatbotify';

const API_BASE = 'http://localhost:5000/api';

const MyChatBot = () => {
  const [messages, setMessages] = useState([]);

  const helpOptions = [
    'What events are available?',
    'How do I register for an event?',
    'Are there any free events?',
    'What is the latest event?'
  ];

  const handleMessage = async (params) => {
    // Determine the user's message text
    let userMsg = typeof params === 'string' ? params : params.userInput;
    if (!userMsg) return;

    // Filter out temporary loading messages for history
    const cleanHistory = messages.filter(m => !m.content.includes('⏳'));

    // Update local state to include user message
    const currentMessages = [...cleanHistory, { role: 'user', content: userMsg }];
    setMessages(currentMessages);

    try {
      // Set a timer to show a friendly "busy" message if it takes more than 3 seconds
      const timeoutId = setTimeout(() => {
        setMessages(prev => [...prev.filter(m => !m.content.includes('⏳')), { role: 'assistant', content: '⏳ Generating response, please hold on...' }]);
      }, 3000);

      const response = await fetch(`${API_BASE}/ai/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg, history: cleanHistory }), // send history before this user msg
      });
      
      clearTimeout(timeoutId);
      const data = await response.json();
      
      if (!response.ok) {
        const errorMsg = data.message || `HTTP error! status: ${response.status}`;
        setMessages(prev => {
           const filtered = prev.filter(m => !m.content.includes('⏳'));
           return [...filtered, { role: 'assistant', content: errorMsg }];
        });
        return errorMsg;
      }
      
      const reply = data.reply || data.message || 'Sorry, I could not understand that.';
      
      setMessages(prev => {
        const filtered = prev.filter(m => !m.content.includes('⏳'));
        return [...filtered, { role: 'assistant', content: reply }];
      });
      return reply;
      
    } catch (err) {
      console.error('Chat error:', err);
      const fallbackMsg = '❌ No connection to the server. Please check if the backend is running.';
      setMessages(prev => {
        const filtered = prev.filter(m => !m.content.includes('⏳'));
        return [...filtered, { role: 'assistant', content: fallbackMsg }];
      });
      return fallbackMsg;
    }
  };

  const flow = {
    start: {
      message: "👋 Welcome to **CerSafe AI**! I'm here to provide you with all the details about our upcoming college events. What would you like to know?",
      options: helpOptions,
      path: 'processInput'
    },
    processInput: {
      message: async (params) => await handleMessage(params),
      path: 'processInput'
    }
  };

  return (
    <ChatBot 
       flow={flow}
       settings={{
         general: {
           primaryColor: '#4f46e5',
           secondaryColor: '#6366f1',
           fontFamily: 'Inter, system-ui, sans-serif',
           showFooter: true,
           showChatButton: true,
           embedded: false
         },
         header: {
           title: 'CerSafe AI Bot',
           showAvatar: true,
           avatar: '/bot_logo.png'
         },
          chatButton: {
            icon: '/bot_logo.png',
            bgColor: "transparent", // Remove white/blue background
          },
          tooltip: {
             mode: "START",
             text: "Hi! Ask me about events 📅"
          }
        }}
        styles={{
          headerStyle: {
            background: "rgba(30, 27, 75, 0.95)", // Professional dark blurred background
            backdropFilter: "blur(10px)",
            color: "#ffffff",
            borderBottom: "1px solid rgba(255,255,255,0.1)",
            padding: "15px",
            fontSize: "1.1rem"
          },
          chatWindowStyle: {
            borderRadius: "24px",
            boxShadow: "0 20px 40px rgba(0,0,0,0.4)",
            border: "1px solid rgba(255,255,255,0.1)",
            backgroundColor: "#ffffff",
            overflow: "hidden"
          },
          chatButtonStyle: {
             padding: "0", // Zero padding to let the circular logo breathe
             background: "none",
             boxShadow: "none", // Remove the heavy blue shadow
             filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.2))", // Use light drop shadow instead
             border: "none"
          }
        }}
    />
  );
};

export default MyChatBot;
