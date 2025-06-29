import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Toast from 'react-native-toast-message';

import {useAuth} from '../../contexts/AuthContext';
import {useTheme} from '../../contexts/ThemeContext';
import {supabase} from '../../lib/supabase';
import {formatRelativeTime} from '../../lib/utils';
import Card from '../../components/Card';
import Button from '../../components/Button';

interface Stats {
  urls: number;
  linkTrees: number;
  qrCodes: number;
  passwords: number;
}

interface RecentItem {
  id: string;
  title: string;
  created_at: string;
  type: 'url' | 'linktree' | 'qrcode';
  short_code?: string;
  username?: string;
  clicks?: number;
}

const DashboardScreen: React.FC = () => {
  const navigation = useNavigation();
  const {user} = useAuth();
  const {colors} = useTheme();

  const [stats, setStats] = useState<Stats>({
    urls: 0,
    linkTrees: 0,
    qrCodes: 0,
    passwords: 0,
  });
  const [recentItems, setRecentItems] = useState<RecentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchDashboardData = async () => {
    if (!user) return;

    try {
      // Fetch stats
      const [urlsCount, linkTreesCount, qrCodesCount, passwordsCount] = await Promise.all([
        supabase.from('urls').select('*', {count: 'exact', head: true}).eq('user_id', user.id),
        supabase.from('link_trees').select('*', {count: 'exact', head: true}).eq('user_id', user.id),
        supabase.from('qr_codes').select('*', {count: 'exact', head: true}).eq('user_id', user.id),
        supabase.from('passwords').select('*', {count: 'exact', head: true}).eq('user_id', user.id),
      ]);

      setStats({
        urls: urlsCount.count || 0,
        linkTrees: linkTreesCount.count || 0,
        qrCodes: qrCodesCount.count || 0,
        passwords: passwordsCount.count || 0,
      });

      // Fetch recent items
      const [recentUrls, recentLinkTrees, recentQrCodes] = await Promise.all([
        supabase
          .from('urls')
          .select('id, title, created_at, short_code, clicks')
          .eq('user_id', user.id)
          .order('created_at', {ascending: false})
          .limit(3),
        supabase
          .from('link_trees')
          .select('id, title, created_at, username')
          .eq('user_id', user.id)
          .order('created_at', {ascending: false})
          .limit(3),
        supabase
          .from('qr_codes')
          .select('id, tag, created_at')
          .eq('user_id', user.id)
          .order('created_at', {ascending: false})
          .limit(3),
      ]);

      const recent: RecentItem[] = [
        ...(recentUrls.data?.map(item => ({
          ...item,
          title: item.title || 'Untitled URL',
          type: 'url' as const,
        })) || []),
        ...(recentLinkTrees.data?.map(item => ({
          ...item,
          title: item.title || `@${item.username}`,
          type: 'linktree' as const,
        })) || []),
        ...(recentQrCodes.data?.map(item => ({
          ...item,
          title: item.tag,
          type: 'qrcode' as const,
        })) || []),
      ]
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 5);

      setRecentItems(recent);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to load dashboard data',
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [user]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchDashboardData();
  };

  const getItemIcon = (type: string) => {
    switch (type) {
      case 'url':
        return 'link';
      case 'linktree':
        return 'account-tree';
      case 'qrcode':
        return 'qr-code';
      default:
        return 'help';
    }
  };

  const quickActions = [
    {
      title: 'Shorten URL',
      icon: 'link',
      action: () => navigation.navigate('CreateUrl' as never),
    },
    {
      title: 'Create Link Tree',
      icon: 'account-tree',
      action: () => navigation.navigate('CreateLinkTree' as never),
    },
    {
      title: 'Generate QR Code',
      icon: 'qr-code',
      action: () => navigation.navigate('CreateQRCode' as never),
    },
    {
      title: 'Generate Password',
      icon: 'security',
      action: () => navigation.navigate('Passwords' as never),
    },
  ];

  return (
    <ScrollView
      style={[styles.container, {backgroundColor: colors.background}]}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
      {/* Welcome Section */}
      <View style={styles.header}>
        <Text style={[styles.welcomeText, {color: colors.text}]}>
          Welcome back, {user?.email?.split('@')[0]}!
        </Text>
        <Text style={[styles.subtitle, {color: colors.textSecondary}]}>
          Here's what's happening with your links
        </Text>
      </View>

      {/* Stats Cards */}
      <View style={styles.statsContainer}>
        <View style={styles.statsRow}>
          <Card style={styles.statCard}>
            <Icon name="link" size={24} color={colors.primary} />
            <Text style={[styles.statNumber, {color: colors.text}]}>{stats.urls}</Text>
            <Text style={[styles.statLabel, {color: colors.textSecondary}]}>URLs</Text>
          </Card>
          <Card style={styles.statCard}>
            <Icon name="account-tree" size={24} color={colors.primary} />
            <Text style={[styles.statNumber, {color: colors.text}]}>{stats.linkTrees}</Text>
            <Text style={[styles.statLabel, {color: colors.textSecondary}]}>Link Trees</Text>
          </Card>
        </View>
        <View style={styles.statsRow}>
          <Card style={styles.statCard}>
            <Icon name="qr-code" size={24} color={colors.primary} />
            <Text style={[styles.statNumber, {color: colors.text}]}>{stats.qrCodes}</Text>
            <Text style={[styles.statLabel, {color: colors.textSecondary}]}>QR Codes</Text>
          </Card>
          <Card style={styles.statCard}>
            <Icon name="security" size={24} color={colors.primary} />
            <Text style={[styles.statNumber, {color: colors.text}]}>{stats.passwords}</Text>
            <Text style={[styles.statLabel, {color: colors.textSecondary}]}>Passwords</Text>
          </Card>
        </View>
      </View>

      {/* Quick Actions */}
      <Card style={styles.section}>
        <Text style={[styles.sectionTitle, {color: colors.text}]}>Quick Actions</Text>
        <View style={styles.quickActionsGrid}>
          {quickActions.map((action, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.quickActionButton, {borderColor: colors.border}]}
              onPress={action.action}>
              <Icon name={action.icon} size={20} color={colors.primary} />
              <Text style={[styles.quickActionText, {color: colors.text}]}>
                {action.title}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </Card>

      {/* Recent Activity */}
      <Card style={styles.section}>
        <Text style={[styles.sectionTitle, {color: colors.text}]}>Recent Activity</Text>
        {recentItems.length > 0 ? (
          <View style={styles.recentItems}>
            {recentItems.map((item, index) => (
              <View key={index} style={[styles.recentItem, {borderBottomColor: colors.border}]}>
                <Icon
                  name={getItemIcon(item.type)}
                  size={20}
                  color={colors.primary}
                  style={styles.recentItemIcon}
                />
                <View style={styles.recentItemContent}>
                  <Text style={[styles.recentItemTitle, {color: colors.text}]}>
                    {item.title}
                  </Text>
                  <Text style={[styles.recentItemTime, {color: colors.textSecondary}]}>
                    {formatRelativeTime(item.created_at)}
                  </Text>
                </View>
                {item.clicks !== undefined && (
                  <Text style={[styles.recentItemClicks, {color: colors.textSecondary}]}>
                    {item.clicks} clicks
                  </Text>
                )}
              </View>
            ))}
          </View>
        ) : (
          <Text style={[styles.emptyText, {color: colors.textSecondary}]}>
            No recent activity
          </Text>
        )}
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    marginBottom: 24,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
  },
  statsContainer: {
    marginBottom: 24,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    marginHorizontal: 6,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    textAlign: 'center',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickActionButton: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 8,
  },
  quickActionText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '500',
  },
  recentItems: {
    marginTop: 8,
  },
  recentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  recentItemIcon: {
    marginRight: 12,
  },
  recentItemContent: {
    flex: 1,
  },
  recentItemTitle: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 2,
  },
  recentItemTime: {
    fontSize: 12,
  },
  recentItemClicks: {
    fontSize: 12,
  },
  emptyText: {
    textAlign: 'center',
    fontStyle: 'italic',
    marginTop: 20,
  },
});

export default DashboardScreen;