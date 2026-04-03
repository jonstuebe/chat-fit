import { useCallback } from 'react';
import {
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useConversations } from '@/store/conversations';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';
import type { Conversation } from '@/types/workout';

function formatRelativeTime(timestamp: number): string {
  const diff = Date.now() - timestamp;
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function ConversationRow({ item, onPress }: { item: Conversation; onPress: () => void }) {
  const colorScheme = useColorScheme() ?? 'light';
  const lastMessage = item.messages[item.messages.length - 1];

  return (
    <TouchableOpacity
      style={[
        styles.row,
        { backgroundColor: Colors[colorScheme].background },
      ]}
      activeOpacity={0.6}
      onPress={onPress}>
      <View style={[styles.avatar, { backgroundColor: Colors[colorScheme].tint + '20' }]}>
        <IconSymbol name="figure.run" size={22} color={Colors[colorScheme].tint} />
      </View>
      <View style={styles.rowContent}>
        <View style={styles.rowHeader}>
          <ThemedText style={styles.rowTitle} numberOfLines={1}>
            {item.title}
          </ThemedText>
          <ThemedText style={styles.rowTime}>
            {formatRelativeTime(item.updatedAt)}
          </ThemedText>
        </View>
        {lastMessage && (
          <ThemedText style={styles.rowPreview} numberOfLines={2}>
            {lastMessage.content}
          </ThemedText>
        )}
      </View>
    </TouchableOpacity>
  );
}

export default function ChatsScreen() {
  const { conversations, createConversation } = useConversations();
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';

  const handleNewChat = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const id = createConversation();
    router.push(`/chat/${id}`);
  }, [createConversation, router]);

  const handleSelectChat = useCallback(
    (id: string) => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      router.push(`/chat/${id}`);
    },
    [router]
  );

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: true,
          title: 'ChatFit',
          headerLargeTitle: true,
        }}
      />

      <Stack.Toolbar placement="right">
        <Stack.Toolbar.Button
          icon="square.and.pencil"
          onPress={handleNewChat}
        />
      </Stack.Toolbar>

      {conversations.length === 0 ? (
        <View style={styles.empty}>
          <View style={[styles.emptyIcon, { backgroundColor: Colors[colorScheme].tint + '15' }]}>
            <IconSymbol name="bubble.left.and.bubble.right.fill" size={48} color={Colors[colorScheme].tint} />
          </View>
          <ThemedText style={styles.emptyTitle}>No Conversations Yet</ThemedText>
          <ThemedText style={styles.emptySubtitle}>
            Tap the compose button to start a new workout chat
          </ThemedText>
          <TouchableOpacity
            style={[styles.emptyButton, { backgroundColor: Colors[colorScheme].tint }]}
            onPress={handleNewChat}
            activeOpacity={0.8}>
            <ThemedText style={styles.emptyButtonText}>Start a Chat</ThemedText>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={conversations}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ConversationRow
              item={item}
              onPress={() => handleSelectChat(item.id)}
            />
          )}
          contentContainerStyle={styles.list}
          ItemSeparatorComponent={() => (
            <View style={[styles.separator, { backgroundColor: Colors[colorScheme].icon + '30' }]} />
          )}
        />
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {
    paddingBottom: 20,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rowContent: {
    flex: 1,
  },
  rowHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rowTitle: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
    marginRight: 8,
  },
  rowTime: {
    fontSize: 13,
    opacity: 0.5,
  },
  rowPreview: {
    fontSize: 14,
    opacity: 0.6,
    marginTop: 2,
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    marginLeft: 72,
  },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyIcon: {
    width: 96,
    height: 96,
    borderRadius: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 15,
    opacity: 0.6,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  emptyButton: {
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 25,
  },
  emptyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
