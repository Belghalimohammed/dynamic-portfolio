import React, { useState, useEffect } from 'react';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { useToast } from '../../hooks/use-toast';
import { adminAPI } from '../../services/api';
import { Mail, Calendar, User, MessageSquare, Loader2 } from 'lucide-react';

const MessagesManager = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await adminAPI.getContactMessages();
      setMessages(response.data);
    } catch (error) {
      toast({
        title: "Error loading messages",
        description: "Failed to fetch contact messages",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-light text-black">Contact Messages</h1>
        <Badge variant="secondary" className="text-lg px-4 py-2">
          {messages.length} {messages.length === 1 ? 'Message' : 'Messages'}
        </Badge>
      </div>

      {messages.length === 0 ? (
        <Card className="p-12 text-center">
          <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-600 mb-2">No Messages Yet</h2>
          <p className="text-gray-500">Contact form submissions will appear here</p>
        </Card>
      ) : (
        <div className="grid gap-6">
          {messages
            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
            .map((message) => (
              <Card key={message.id} className="p-6 hover:shadow-lg transition-shadow duration-200">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-gray-100 rounded-lg">
                      <Mail className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-black">{message.subject}</h3>
                      <div className="flex items-center space-x-4 text-gray-600 text-sm">
                        <div className="flex items-center space-x-1">
                          <User className="w-4 h-4" />
                          <span>{message.name}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Mail className="w-4 h-4" />
                          <a 
                            href={`mailto:${message.email}`}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            {message.email}
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-500 text-sm">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(message.created_at)}</span>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {message.message}
                  </p>
                </div>

                <div className="mt-4 flex justify-between items-center">
                  <div className="text-sm text-gray-500">
                    Message ID: {message.id}
                  </div>
                  <a
                    href={`mailto:${message.email}?subject=Re: ${message.subject}&body=Hi ${message.name},%0D%0A%0D%0AThank you for your message.%0D%0A%0D%0A`}
                    className="inline-flex items-center px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors duration-200"
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    Reply
                  </a>
                </div>
              </Card>
            ))}
        </div>
      )}
    </div>
  );
};

export default MessagesManager;