import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  SafeAreaView,
  Platform,
  Image,
  ActivityIndicator
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { 
  Video as VideoIcon, 
  Calendar, 
  Users, 
  Heart, 
  MessageCircle, 
  Plus,
  Filter
} from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { borderRadius, fontSize, fontWeight, spacing } from '@/constants/theme';
import { Button } from '@/components/Button';
import { translations } from '@/constants/translations';
import { useLiveStreams } from '@/lib/api';

// Mock livestream data
const mockLivestreams = [
  {
    id: '1',
    title: 'Вечерний стрим: знакомимся и общаемся',
    hostId: 'user1',
    hostName: 'Анна',
    hostPhoto: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    status: 'live',
    viewers: 128,
    likes: 45,
    scheduledFor: null,
    startedAt: '2023-06-15T18:30:00Z',
  },
  {
    id: '2',
    title: 'Утренняя йога и разговоры о жизни',
    hostId: 'user2',
    hostName: 'Михаил',
    hostPhoto: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1545389336-cf090694435e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    status: 'live',
    viewers: 56,
    likes: 23,
    scheduledFor: null,
    startedAt: '2023-06-15T08:00:00Z',
  },
  {
    id: '3',
    title: 'Готовим вместе: итальянская паста',
    hostId: 'user3',
    hostName: 'Елена',
    hostPhoto: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1556761223-4c4282c73f77?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    status: 'scheduled',
    viewers: 0,
    likes: 0,
    scheduledFor: '2023-06-16T19:00:00Z',
    startedAt: null,
  },
  {
    id: '4',
    title: 'Путешествие по Барселоне',
    hostId: 'user4',
    hostName: 'Алексей',
    hostPhoto: 'https://images.unsplash.com/photo-1552058544-f2b08422138a?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1523531294919-4bcd7c65e216?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    status: 'scheduled',
    viewers: 0,
    likes: 0,
    scheduledFor: '2023-06-17T16:00:00Z',
    startedAt: null,
  },
  {
    id: '5',
    title: 'Музыкальный вечер: играю на гитаре',
    hostId: 'user5',
    hostName: 'Дмитрий',
    hostPhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    status: 'ended',
    viewers: 210,
    likes: 89,
    scheduledFor: null,
    startedAt: '2023-06-14T20:00:00Z',
  },
];

type Livestream = typeof mockLivestreams[0];

export default function LivestreamsScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'live' | 'scheduled' | 'ended'>('live');
  const [livestreams, setLivestreams] = useState<Livestream[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // API hook
  const livestreamsQuery = useLiveStreams(activeTab);
  
  useEffect(() => {
    setIsLoading(true);
    
    // Try to use API data, fallback to mock data
    if (livestreamsQuery.data) {
      setLivestreams(livestreamsQuery.data as Livestream[]);
    } else {
      // Filter mock data based on active tab
      const filteredStreams = mockLivestreams.filter(stream => stream.status === activeTab);
      setLivestreams(filteredStreams);
    }
    
    setIsLoading(false);
  }, [activeTab, livestreamsQuery.data]);
  
  const handleCreateLivestream = () => {
    router.push('/create-livestream');
  };
  
  const handleJoinLivestream = (livestreamId: string) => {
    router.push(`/livestream/${livestreamId}`);
  };
  
  const formatScheduledTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('ru-RU', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };
  
  const renderLivestreamItem = ({ item }: { item: Livestream }) => (
    <TouchableOpacity
      style={styles.livestreamCard}
      onPress={() => handleJoinLivestream(item.id)}
      activeOpacity={0.8}
    >
      <View style={styles.thumbnailContainer}>
        <Image
          source={{ uri: item.thumbnail }}
          style={styles.thumbnail}
        />
        {item.status === 'live' && (
          <View style={styles.liveIndicator}>
            <VideoIcon size={12} color="white" />
            <Text style={styles.liveText}>LIVE</Text>
          </View>
        )}
        {item.status === 'scheduled' && (
          <View style={styles.scheduledIndicator}>
            <Calendar size={12} color="white" />
            <Text style={styles.scheduledText}>
              {formatScheduledTime(item.scheduledFor!)}
            </Text>
          </View>
        )}
      </View>
      
      <View style={styles.livestreamInfo}>
        <View style={styles.hostInfo}>
          <Image
            source={{ uri: item.hostPhoto }}
            style={styles.hostPhoto}
          />
          <Text style={styles.hostName}>{item.hostName}</Text>
        </View>
        
        <Text style={styles.livestreamTitle} numberOfLines={2}>
          {item.title}
        </Text>
        
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Users size={14} color={colors.textSecondary} />
            <Text style={styles.statText}>{item.viewers}</Text>
          </View>
          
          <View style={styles.statItem}>
            <Heart size={14} color={colors.textSecondary} />
            <Text style={styles.statText}>{item.likes}</Text>
          </View>
          
          {item.status === 'live' && (
            <View style={styles.joinButton}>
              <Text style={styles.joinButtonText}>Присоединиться</Text>
            </View>
          )}
          
          {item.status === 'scheduled' && (
            <View style={styles.remindButton}>
              <Text style={styles.remindButtonText}>Напомнить</Text>
            </View>
          )}
          
          {item.status === 'ended' && (
            <View style={styles.watchButton}>
              <Text style={styles.watchButtonText}>Смотреть запись</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
  
  const renderEmptyState = () => (
    <View style={styles.emptyStateContainer}>
      <VideoIcon size={60} color={colors.textLight} />
      <Text style={styles.emptyStateTitle}>
        {activeTab === 'live' 
          ? translations.noLiveStreams 
          : activeTab === 'scheduled' 
            ? translations.noScheduledStreams 
            : translations.noEndedStreams}
      </Text>
      <Text style={styles.emptyStateText}>
        {activeTab === 'live' 
          ? translations.noLiveStreamsDesc 
          : activeTab === 'scheduled' 
            ? translations.noScheduledStreamsDesc 
            : translations.noEndedStreamsDesc}
      </Text>
      
      {activeTab !== 'ended' && (
        <Button
          title={translations.createLivestream}
          onPress={handleCreateLivestream}
          style={styles.createButton}
        />
      )}
    </View>
  );
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style={Platform.OS === 'ios' ? 'dark' : 'auto'} />
      
      <View style={styles.header}>
        <Text style={styles.title}>{translations.livestreams}</Text>
        
        <View style={styles.headerButtons}>
          <TouchableOpacity style={styles.filterButton}>
            <Filter size={20} color={colors.text} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.createStreamButton}
            onPress={handleCreateLivestream}
          >
            <Plus size={20} color="white" />
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'live' && styles.activeTab]}
          onPress={() => setActiveTab('live')}
        >
          <Text 
            style={[
              styles.tabText, 
              activeTab === 'live' && styles.activeTabText
            ]}
          >
            {translations.live}
          </Text>
          {activeTab === 'live' && <View style={styles.activeTabIndicator} />}
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, activeTab === 'scheduled' && styles.activeTab]}
          onPress={() => setActiveTab('scheduled')}
        >
          <Text 
            style={[
              styles.tabText, 
              activeTab === 'scheduled' && styles.activeTabText
            ]}
          >
            {translations.scheduled}
          </Text>
          {activeTab === 'scheduled' && <View style={styles.activeTabIndicator} />}
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, activeTab === 'ended' && styles.activeTab]}
          onPress={() => setActiveTab('ended')}
        >
          <Text 
            style={[
              styles.tabText, 
              activeTab === 'ended' && styles.activeTabText
            ]}
          >
            {translations.ended}
          </Text>
          {activeTab === 'ended' && <View style={styles.activeTabIndicator} />}
        </TouchableOpacity>
      </View>
      
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>{translations.loading}</Text>
        </View>
      ) : (
        <FlatList
          data={livestreams}
          keyExtractor={(item) => item.id}
          renderItem={renderLivestreamItem}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={renderEmptyState}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: Platform.OS === 'android' ? 30 : 0,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  title: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
    color: colors.text,
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  filterButton: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.full,
    backgroundColor: colors.inputBackground,
    alignItems: 'center',
    justifyContent: 'center',
  },
  createStreamButton: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.full,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabsContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.md,
    position: 'relative',
  },
  activeTab: {
    backgroundColor: colors.background,
  },
  tabText: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    fontWeight: fontWeight.medium,
  },
  activeTabText: {
    color: colors.primary,
    fontWeight: fontWeight.semibold,
  },
  activeTabIndicator: {
    position: 'absolute',
    bottom: 0,
    left: '25%',
    right: '25%',
    height: 3,
    backgroundColor: colors.primary,
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
  },
  listContent: {
    padding: spacing.md,
    paddingBottom: Platform.OS === 'ios' ? 120 : 100, // Extra padding for tab bar
  },
  livestreamCard: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.lg,
    overflow: 'hidden',
  },
  thumbnailContainer: {
    position: 'relative',
    height: 180,
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  liveIndicator: {
    position: 'absolute',
    top: spacing.sm,
    left: spacing.sm,
    backgroundColor: colors.error,
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  liveText: {
    color: 'white',
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
  },
  scheduledIndicator: {
    position: 'absolute',
    top: spacing.sm,
    left: spacing.sm,
    backgroundColor: colors.info,
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  scheduledText: {
    color: 'white',
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
  },
  livestreamInfo: {
    padding: spacing.md,
  },
  hostInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  hostPhoto: {
    width: 24,
    height: 24,
    borderRadius: borderRadius.full,
    marginRight: spacing.xs,
  },
  hostName: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  livestreamTitle: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: spacing.md,
    gap: 4,
  },
  statText: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  joinButton: {
    marginLeft: 'auto',
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  joinButtonText: {
    color: 'white',
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
  },
  remindButton: {
    marginLeft: 'auto',
    backgroundColor: colors.info,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  remindButtonText: {
    color: 'white',
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
  },
  watchButton: {
    marginLeft: 'auto',
    backgroundColor: colors.secondary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  watchButtonText: {
    color: 'white',
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: spacing.md,
    fontSize: fontSize.md,
    color: colors.textSecondary,
  },
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
    paddingTop: spacing.xxl * 2,
  },
  emptyStateTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
    color: colors.text,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  emptyStateText: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  createButton: {
    marginTop: spacing.md,
  },
});