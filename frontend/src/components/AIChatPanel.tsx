import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import {
  Box,
  Paper,
  Typography,
  TextField,
  IconButton,
  List,
  ListItem,
  ListItemText,
  styled,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import axios from 'axios';

const ChatCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(2),
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius * 2,
  backgroundColor: `${theme.palette.background.paper}80`,
  backdropFilter: 'blur(5px)',
  minHeight: 400,
  display: 'flex',
  flexDirection: 'column',
}));

const ChatContainer = styled(Box)({
  flex: 1,
  overflowY: 'auto',
  marginBottom: 16,
});

const MessageBubble = styled(ListItem)<{ isUser?: boolean }>(({ theme, isUser }) => ({
  flexDirection: 'column',
  alignItems: isUser ? 'flex-end' : 'flex-start',
  padding: theme.spacing(1),
  '& .MuiListItemText-root': {
    maxWidth: '70%',
    backgroundColor: isUser ? `${theme.palette.primary.main}20` : `${theme.palette.grey[200]}80`,
    borderRadius: 16,
    padding: theme.spacing(1.5),
    marginBottom: theme.spacing(1),
    '& code': {
      backgroundColor: `${theme.palette.grey[100]}`,
      padding: '2px 4px',
      borderRadius: 4,
    },
    '& pre': {
      backgroundColor: `${theme.palette.grey[100]}`,
      padding: theme.spacing(1),
      borderRadius: 4,
      overflow: 'auto',
    },
  },
}));

const InputContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(1),
  padding: theme.spacing(2),
  borderTop: `1px solid ${theme.palette.divider}`,
}));

interface Message {
  text: string;
  isUser: boolean;
}

const AIChatPanel = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');

  const handleSend = async () => {
    if (input.trim()) {
      // Add user message
      setMessages(prev => [...prev, { text: input, isUser: true }]);
      setInput('');

      try {
        // Create a new message for the AI response
        setMessages(prev => [...prev, { text: '', isUser: false }]);

        const response = await axios.post('/api/llm/ai/chat', {
          messages: messages.concat({ text: input, isUser: true }).map(msg => ({
            role: msg.isUser ? 'user' : 'assistant',
            content: msg.text
          }))
        }, {
          responseType: 'stream',
          onDownloadProgress: (progressEvent) => {
            const chunk = progressEvent.event.target.response;
            const lines = chunk.split('\n');
            let accumulatedText = '';

            for (const line of lines) {
              if (line.trim()) {
                try {
                  const data = JSON.parse(line);
                  if (data.message?.content && !data.done) {
                    // Ensure we're preserving newlines and markdown formatting
                    const newContent = data.message.content.replace(/\\n/g, '\n');
                    accumulatedText += newContent;
                    setMessages(prev => {
                      const newMessages = [...prev];
                      const lastMessage = newMessages[newMessages.length - 1];
                      if (!lastMessage.isUser) {
                        lastMessage.text = accumulatedText;
                      }
                      return newMessages;
                    });
                  }
                } catch (e) {
                  console.error('Error parsing JSON:', e);
                }
              }
            }
          }
        });

      } catch (error) {
        console.error('Error:', error);
        setMessages(prev => [...prev, {
          text: "Sorry, there was an error processing your request.",
          isUser: false
        }]);
      }
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  return (
    <ChatCard>
      <Typography variant="h6" gutterBottom>
        My Portfolio Helper
      </Typography>
      <ChatContainer>
        <List>
          {messages.map((message, index) => (
            <MessageBubble key={index} isUser={message.isUser}>
              <ListItemText
                primary={
                  message.isUser ? (
                    message.text
                  ) : (
                    <ReactMarkdown>{message.text}</ReactMarkdown>
                  )
                }
                primaryTypographyProps={{
                  style: { whiteSpace: 'pre-wrap', wordBreak: 'break-word' },
                  component: 'div',
                }}
              />
              <Typography variant="caption" color="textSecondary">
                {message.isUser ? 'You' : 'AI Assistant'}
              </Typography>
            </MessageBubble>
          ))}
        </List>
      </ChatContainer>
      <InputContainer>
        <TextField
          fullWidth
          multiline
          maxRows={4}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ask a question..."
          variant="outlined"
          size="small"
        />
        <IconButton
          color="primary"
          onClick={handleSend}
          disabled={!input.trim()}
        >
          <SendIcon />
        </IconButton>
      </InputContainer>
    </ChatCard>
  );
};

export default AIChatPanel;