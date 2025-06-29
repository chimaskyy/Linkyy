import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';

import {useAuth} from '../../contexts/AuthContext';
import {useTheme} from '../../contexts/ThemeContext';
import Button from '../../components/Button';
import Card from '../../components/Card';

const {width} = Dimensions.get('window');

const HomeScreen: React.FC = () => {
  const navigation = useNavigation();
  const {user} = useAuth();
  const {colors} = useTheme();

  const features = [
    {
      icon: 'link',
      title: 'URL Shortener',
      description: 'Create short, memorable links',
      action: () => navigation.navigate('CreateUrl' as never),
    },
    {
      icon: 'account-tree',
      title: 'Link Trees',
      description: 'Showcase all your links in one place',
      action: () => navigation.navigate('CreateLinkTree' as never),
    },
    {
      icon: 'qr-code',
      title: 'QR Codes',
      description: 'Generate QR codes for any link',
      action: () => navigation.navigate('CreateQRCode' as never),
    },
    {
      icon: 'security',
      title: 'Password Generator',
      description: 'Create secure passwords',
      action: () => navigation.navigate('Passwords' as never),
    },
  ];

  return (
    <LinearGradient
      colors={['#000000', '#1F2937', '#000000']}
      style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logo}>
            <View style={styles.logoInner} />
          </View>
          <Text style={styles.title}>Snipy</Text>
          <Text style={styles.subtitle}>
            Your all-in-one link management solution
          </Text>
        </View>

        {/* Features Grid */}
        <View style={styles.featuresContainer}>
          <Text style={[styles.sectionTitle, {color: colors.text}]}>
            What would you like to do?
          </Text>
          <View style={styles.featuresGrid}>
            {features.map((feature, index) => (
              <TouchableOpacity
                key={index}
                style={styles.featureCard}
                onPress={feature.action}
                activeOpacity={0.8}>
                <Card style={styles.featureCardInner}>
                  <Icon
                    name={feature.icon}
                    size={32}
                    color={colors.primary}
                    style={styles.featureIcon}
                  />
                  <Text style={[styles.featureTitle, {color: colors.text}]}>
                    {feature.title}
                  </Text>
                  <Text style={[styles.featureDescription, {color: colors.textSecondary}]}>
                    {feature.description}
                  </Text>
                </Card>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionContainer}>
          {user ? (
            <Button
              title="Go to Dashboard"
              onPress={() => navigation.navigate('MainTabs' as never)}
              size="large"
              style={styles.actionButton}
            />
          ) : (
            <View style={styles.authButtons}>
              <Button
                title="Sign In"
                onPress={() => navigation.navigate('Login' as never)}
                variant="outline"
                size="large"
                style={[styles.authButton, {marginRight: 8}]}
              />
              <Button
                title="Sign Up"
                onPress={() => navigation.navigate('Register' as never)}
                size="large"
                style={[styles.authButton, {marginLeft: 8}]}
              />
            </View>
          )}
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 40,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  logoInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#8B5CF6',
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#9CA3AF',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  featuresContainer: {
    marginBottom: 40,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  featureCard: {
    width: (width - 60) / 2,
    marginBottom: 16,
  },
  featureCardInner: {
    alignItems: 'center',
    padding: 20,
    minHeight: 140,
  },
  featureIcon: {
    marginBottom: 12,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  featureDescription: {
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 16,
  },
  actionContainer: {
    marginTop: 20,
  },
  actionButton: {
    marginHorizontal: 0,
  },
  authButtons: {
    flexDirection: 'row',
  },
  authButton: {
    flex: 1,
  },
});

export default HomeScreen;