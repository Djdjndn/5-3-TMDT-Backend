import React, { useEffect, useRef, useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, View } from 'react-native';
import { chatApi } from '../api/chatApi';
import { getErrorMessage } from '../api/client';
import { colors } from '../config';
import { Button, EmptyState, Input, Screen, Title } from '../components/ui';
import { useAuth } from '../context/AuthContext';

type Message = {
  id?: number;
  content: string;
  senderType?: string;
  senderName?: string;
  createdAt?: string;
};

export const ChatScreen = () => {
  const { user } = useAuth();
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const started = useRef(false);

  const startSession = async () => {
    if (!user || started.current) return;
    started.current = true;
    try {
      const session = await chatApi.createSession(user.id, user.fullName || user.username);
      setSessionId(session.id);
      const list = await chatApi.messages(session.id);
      setMessages(list);
    } catch (error) {
      Alert.alert('Không tạo được chat', getErrorMessage(error));
    }
  };

  useEffect(() => {
    startSession();
  }, [user?.id]);

  const send = async () => {
    if (!user || !sessionId || !input.trim()) return;
    setLoading(true);
    try {
      const message = await chatApi.sendMessage(sessionId, user.id, input.trim());
      setMessages((current) => [...current, message]);
      setInput('');
    } catch (error) {
      Alert.alert('Không gửi được tin nhắn', getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen padded={false}>
      <FlatList
        data={messages}
        keyExtractor={(item, index) => String(item.id || index)}
        contentContainerStyle={{ padding: 16, flexGrow: 1 }}
        ListHeaderComponent={<Title subtitle="Kênh hỗ trợ đơn giản qua API chat hiện có.">Chat hỗ trợ</Title>}
        ListEmptyComponent={<EmptyState title="Chưa có tin nhắn" description="Gửi câu hỏi đầu tiên cho bộ phận hỗ trợ." />}
        renderItem={({ item }) => {
          const mine = item.senderType === 'USER';
          return (
            <View style={[styles.bubble, mine ? styles.mine : styles.theirs]}>
              <Text style={[styles.message, mine && { color: '#fff' }]}>{item.content}</Text>
            </View>
          );
        }}
        ListFooterComponent={
          <View style={styles.composer}>
            <Input value={input} onChangeText={setInput} placeholder="Nhập tin nhắn..." />
            <Button title="Gửi" onPress={send} loading={loading} disabled={!sessionId || !input.trim()} />
          </View>
        }
      />
    </Screen>
  );
};

const styles = StyleSheet.create({
  bubble: { maxWidth: '82%', borderRadius: 14, padding: 12, marginBottom: 10 },
  mine: { backgroundColor: colors.primary, alignSelf: 'flex-end' },
  theirs: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, alignSelf: 'flex-start' },
  message: { color: colors.text, lineHeight: 20 },
  composer: { marginTop: 8, backgroundColor: colors.surface, borderRadius: 14, padding: 12, borderWidth: 1, borderColor: colors.border },
});
