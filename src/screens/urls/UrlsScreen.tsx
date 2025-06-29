import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Clipboard from '@react-native-clipboard/clipboard';
import Toast from 'react-native-toast-message';

import {useAuth} from '../../contexts/AuthContext';
import {useTheme} from '../../contexts/ThemeContext';
import {supabase} from '../../lib/supabase';
import {formatRelativeTime} from '../../lib/utils';
import Card from '../../components/Card';
import Button from '../../components/Button';

interface Url {
  id: string;
  title: string;
  original_url: string;
  short_code: string;
  clicks: number;
  created_at: string;
}

const UrlsScreen: React.FC = () => {
  const navigation = useNavigation();
  const {user} = useAuth();
  const {colors} = useTheme();

  const [urls, setUrls] = useState<Url[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchUrls = async () => {
    if (!user) return;

    try {
      const {data, error} = await supabase
        .from('urls')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', {ascending: false});

      if (error) throw error;
      setUrls(data || []);
    } catch (error) {
      console.error('Error fetching URLs:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to load URLs',
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchUrls();
  }, [user]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchUrls();
  };

  const copyToClipboard = (shortCode: string) => {
    const url = `https://your-domain.com/${shortCode}`;
    Clipboard.setString(url);
    Toast.show({
      type: 'success',
      text1: 'Copied!',
      text2: 'URL copied to clipboard',
    });
  };

  const deleteUrl = (id: string, title: string) => {
    Alert.alert(
      'Delete URL',
      `Are you sure you want to delete "${title}"?`,
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const {error} = await supabase
                .from('urls')
                .delete()
                .eq('id', id)
                .eq('user_id', user?.id);

              if (error) throw error;

              setUrls(prev => prev.filter(url => url.id !== id));
              Toast.show({
                type: 'success',
                text1: 'Deleted',
                text2: 'URL deleted successfully',
              });
            } catch (error) {
              Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Failed to delete URL',
              });
            }
          },
        },
      ],
    );
  };

  const renderUrlItem = ({item}: {item: Url}) => (
    <Card style={styles.urlCard}>
      <View style={styles.urlHeader}>
        <Text style={[styles.urlTitle, {color: colors.text}]} numberOfLines={1}>
          {item.title || 'Untitled URL'}
        </Text>
        <View style={styles.urlActions}>
          <TouchableOpacity
            onPress={() => copyToClipboard(item.short_code)}
            style={styles.actionButton}>
            <Icon name="content-copy" size={20} color={colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => deleteUrl(item.id, item.title)}
            style={styles.actionButton}>
            <Icon name="delete" size={20} color={colors.error} />
          </TouchableOpacity>
        </View>
      </View>

      <Text style={[styles.originalUrl, {color: colors.textSecondary}]} numberOfLines={2}>
        {item.original_url}
      </Text>

      <View style={styles.urlFooter}>
        <Text style={[styles.shortUrl, {color: colors.primary}]}>
          snipy.app/{item.short_code}
        </Text>
        <View style={styles.urlStats}>
          <Text style={[styles.clicks, {color: colors.textSecondary}]}>
            {item.clicks} clicks
          </Text>
          <Text style={[styles.date, {color: colors.textSecondary}]}>
            {formatRelativeTime(item.created_at)}
          </Text>
        </View>
      </View>
    </Card>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Icon name="link" size={64} color={colors.textSecondary} />
      <Text style={[styles.emptyTitle, {color: colors.text}]}>No URLs yet</Text>
      <Text style={[styles.emptySubtitle, {color: colors.textSecondary}]}>
        Create your first shortened URL to get started
      </Text>
      <Button
        title="Create URL"
        onPress={() => navigation.navigate('CreateUrl' as never)}
        style={styles.emptyButton}
      />
    </View>
  );

  return (
    <View style={[styles.container, {backgroundColor: colors.background}]}>
      <View style={styles.header}>
        <Text style={[styles.title, {color: colors.text}]}>My URLs</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('CreateUrl' as never)}
          style={[styles.addButton, {backgroundColor: colors.primary}]}>
          <Icon name="add" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={urls}
        renderItem={renderUrlItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={!loading ? renderEmptyState : null}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingTop: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    padding: 16,
    paddingTop: 0,
  },
  urlCard: {
    marginBottom: 12,
  },
  urlHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  urlTitle: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
    marginRight: 8,
  },
  urlActions: {
    flexDirection: 'row',
  },
  actionButton: {
    padding: 4,
    marginLeft: 8,
  },
  originalUrl: {
    fontSize: 14,
    marginBottom: 12,
    lineHeight: 20,
  },
  urlFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  shortUrl: {
    fontSize: 14,
    fontWeight: '500',
  },
  urlStats: {
    alignItems: 'flex-end',
  },
  clicks: {
    fontSize: 12,
    marginBottom: 2,
  },
  date: {
    fontSize: 12,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    paddingHorizontal: 40,
  },
  emptyButton: {
    paddingHorizontal: 32,
  },
});

export default UrlsScreen;