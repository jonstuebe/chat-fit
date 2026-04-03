import { useCallback, useEffect, useRef, useState } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { WorkoutCard } from '@/components/workout-card';
import { useConversations } from '@/store/conversations';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';
import type { ChatMessage } from '@/types/workout';

function MessageBubble({
  message,
  tint,
  onStartWorkout,
}: {
  message: ChatMessage;
  tint: string;
  onStartWorkout: (message: ChatMessage) => void;
}) {
  const isUser = message.role === 'user';
  const colorScheme = useColorScheme() ?? 'light';

  return (
    <View
      style={[
        styles.bubbleContainer,
        isUser ? styles.bubbleRight : styles.bubbleLeft,
      ]}>
      <View
        style={[
          styles.bubble,
          isUser
            ? [styles.userBubble, { backgroundColor: tint }]
            : [
                styles.assistantBubble,
                {
                  backgroundColor:
                    colorScheme === 'dark' ? '#2C2C2E' : '#E9E9EB',
                },
              ],
        ]}>
        <ThemedText
          style={[
            styles.bubbleText,
            isUser && styles.userBubbleText,
          ]}>
          {message.content}
        </ThemedText>
      </View>
      {message.workout && (
        <WorkoutCard
          workout={message.workout}
          onStart={() => onStartWorkout(message)}
        />
      )}
    </View>
  );
}

export default function ChatScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const {
    sendMessage,
    setActiveWorkout,
    deleteConversation,
    conversations,
  } = useConversations();
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const tint = Colors[colorScheme].tint;
  const [text, setText] = useState('');
  const flatListRef = useRef<FlatList>(null);

  const conversation = conversations.find((c) => c.id === id);

  const handleSend = useCallback(() => {
    const trimmed = text.trim();
    if (!trimmed || !id) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    sendMessage(id, trimmed);
    setText('');
  }, [text, id, sendMessage]);

  const handleStartWorkout = useCallback(
    (message: ChatMessage) => {
      if (message.workout) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        setActiveWorkout(message.workout, id);
        router.navigate('/(tabs)/workout');
      }
    },
    [setActiveWorkout, id, router]
  );

  useEffect(() => {
    if (conversation?.messages.length) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [conversation?.messages.length]);

  if (!conversation) {
    return (
      <ThemedView style={styles.container}>
        <Stack.Screen options={{ title: 'Chat' }} />
        <View style={styles.empty}>
          <ThemedText>Conversation not found</ThemedText>
        </View>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen
        options={{
          title: conversation.title === 'New Chat' ? 'New Chat' : conversation.title,
        }}
      />

      <Stack.Toolbar placement="right">
        <Stack.Toolbar.Menu icon="ellipsis.circle">
          <Stack.Toolbar.MenuAction
            icon="trash"
            destructive
            onPress={() => {
              deleteConversation(id);
              router.back();
            }}>
            Delete Chat
          </Stack.Toolbar.MenuAction>
        </Stack.Toolbar.Menu>
      </Stack.Toolbar>

      <KeyboardAvoidingView
        style={styles.keyboardAvoid}
        behavior="padding"
        keyboardVerticalOffset={100}>
        {conversation.messages.length === 0 ? (
          <View style={styles.welcomeContainer}>
            <View style={[styles.welcomeIcon, { backgroundColor: tint + '15' }]}>
              <IconSymbol name="figure.run" size={40} color={tint} />
            </View>
            <ThemedText style={styles.welcomeTitle}>{"What's your workout today?"}</ThemedText>
            <ThemedText style={styles.welcomeSubtitle}>
              {"Describe the kind of workout you want and I'll build a plan for you"}
            </ThemedText>
            <View style={styles.suggestions}>
              {[
                '20 min HIIT cardio burn',
                'Upper body strength',
                'Quick core workout',
                'Yoga stretch & relax',
              ].map((suggestion) => (
                <TouchableOpacity
                  key={suggestion}
                  style={[styles.suggestionChip, { borderColor: tint + '40' }]}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    sendMessage(id, suggestion);
                  }}
                  activeOpacity={0.7}>
                  <ThemedText style={[styles.suggestionText, { color: tint }]}>
                    {suggestion}
                  </ThemedText>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ) : (
          <FlatList
            ref={flatListRef}
            data={conversation.messages}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <MessageBubble
                message={item}
                tint={tint}
                onStartWorkout={handleStartWorkout}
              />
            )}
            contentContainerStyle={styles.messageList}
            showsVerticalScrollIndicator={false}
          />
        )}

        <View
          style={[
            styles.inputContainer,
            {
              borderTopColor: Colors[colorScheme].icon + '30',
              backgroundColor: Colors[colorScheme].background,
            },
          ]}>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: colorScheme === 'dark' ? '#2C2C2E' : '#F2F2F7',
                color: Colors[colorScheme].text,
              },
            ]}
            placeholder="Describe your workout..."
            placeholderTextColor={Colors[colorScheme].icon}
            value={text}
            onChangeText={setText}
            multiline
            maxLength={500}
            returnKeyType="send"
            onSubmitEditing={handleSend}
            blurOnSubmit
          />
          <TouchableOpacity
            style={[
              styles.sendButton,
              {
                backgroundColor: text.trim() ? tint : tint + '40',
              },
            ]}
            onPress={handleSend}
            disabled={!text.trim()}
            activeOpacity={0.7}>
            <IconSymbol name="arrow.up" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardAvoid: {
    flex: 1,
  },
  messageList: {
    padding: 16,
    paddingBottom: 8,
  },
  bubbleContainer: {
    marginBottom: 12,
    maxWidth: '82%',
  },
  bubbleRight: {
    alignSelf: 'flex-end',
  },
  bubbleLeft: {
    alignSelf: 'flex-start',
  },
  bubble: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 18,
  },
  userBubble: {
    borderBottomRightRadius: 4,
  },
  assistantBubble: {
    borderBottomLeftRadius: 4,
  },
  bubbleText: {
    fontSize: 16,
    lineHeight: 22,
  },
  userBubbleText: {
    color: '#fff',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
    gap: 8,
  },
  input: {
    flex: 1,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 16,
    maxHeight: 120,
    minHeight: 40,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 2,
  },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  welcomeIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  welcomeTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  welcomeSubtitle: {
    fontSize: 15,
    opacity: 0.6,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  suggestions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
  },
  suggestionChip: {
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  suggestionText: {
    fontSize: 14,
    fontWeight: '500',
  },
});
