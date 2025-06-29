import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Clipboard from '@react-native-clipboard/clipboard';
import Toast from 'react-native-toast-message';

import {useAuth} from '../../contexts/AuthContext';
import {useTheme} from '../../contexts/ThemeContext';
import {supabase} from '../../lib/supabase';
import {generateShortCode, isValidUrl} from '../../lib/utils';
import Button from '../../components/Button';
import Input from '../../components/Input';
import Card from '../../components/Card';

const CreateUrlScreen: React.FC = () => {
  const navigation = useNavigation();
  const {user} = useAuth();
  const {colors} = useTheme();

  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [shortUrl, setShortUrl] = useState<string | null>(null);

  const handleCreateUrl = async () => {
    if (!url.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Please enter a URL',
      });
      return;
    }

    if (!isValidUrl(url)) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Please enter a valid URL',
      });
      return;
    }

    if (!user) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'You must be logged in to create URLs',
      });
      return;
    }

    setLoading(true);

    try {
      // Generate unique short code
      let shortCode = generateShortCode(4);
      let isUnique = false;

      while (!isUnique) {
        const {data} = await supabase
          .from('urls')
          .select('short_code')
          .eq('short_code', shortCode)
          .single();

        if (!data) {
          isUnique = true;
        } else {
          shortCode = generateShortCode(4);
        }
      }

      // Create the URL
      const {data, error} = await supabase
        .from('urls')
        .insert({
          user_id: user.id,
          original_url: url,
          short_code: shortCode,
          title: title || 'Untitled Link',
        })
        .select()
        .single();

      if (error) throw error;

      const generatedUrl = `https://snipy.app/${shortCode}`;
      setShortUrl(generatedUrl);

      Toast.show({
        type: 'success',
        text1: 'Success!',
        text2: 'Your URL has been shortened',
      });
    } catch (error) {
      console.error('Error creating URL:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to create short URL',
      });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (shortUrl) {
      Clipboard.setString(shortUrl);
      Toast.show({
        type: 'success',
        text1: 'Copied!',
        text2: 'URL copied to clipboard',
      });
    }
  };

  const resetForm = () => {
    setTitle('');
    setUrl('');
    setShortUrl(null);
  };

  return (
    <View style={[styles.container, {backgroundColor: colors.background}]}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}>
          <Icon name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.title, {color: colors.text}]}>Shorten URL</Text>
        <View style={styles.placeholder} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}>
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}>
          <Card style={styles.formCard}>
            <Input
              label="Title (optional)"
              placeholder="My awesome link"
              value={title}
              onChangeText={setTitle}
              leftIcon="title"
            />

            <Input
              label="URL"
              placeholder="https://example.com"
              value={url}
              onChangeText={setUrl}
              keyboardType="url"
              autoCapitalize="none"
              leftIcon="link"
            />

            <Button
              title="Shorten URL"
              onPress={handleCreateUrl}
              loading={loading}
              style={styles.createButton}
            />
          </Card>

          {shortUrl && (
            <Card style={styles.resultCard}>
              <View style={styles.resultHeader}>
                <Icon name="check-circle" size={24} color={colors.success} />
                <Text style={[styles.resultTitle, {color: colors.text}]}>
                  URL Created!
                </Text>
              </View>

              <View style={styles.urlContainer}>
                <Text style={[styles.shortUrlLabel, {color: colors.textSecondary}]}>
                  Your short URL:
                </Text>
                <Text style={[styles.shortUrlText, {color: colors.primary}]}>
                  {shortUrl}
                </Text>
              </View>

              <View style={styles.resultActions}>
                <Button
                  title="Copy URL"
                  onPress={copyToClipboard}
                  variant="outline"
                  style={styles.resultButton}
                />
                <Button
                  title="Create Another"
                  onPress={resetForm}
                  style={styles.resultButton}
                />
              </View>
            </Card>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    paddingTop: 8,
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  placeholder: {
    width: 40,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 16,
    paddingTop: 0,
  },
  formCard: {
    marginBottom: 16,
  },
  createButton: {
    marginTop: 8,
  },
  resultCard: {
    marginBottom: 16,
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  urlContainer: {
    marginBottom: 20,
  },
  shortUrlLabel: {
    fontSize: 14,
    marginBottom: 4,
  },
  shortUrlText: {
    fontSize: 16,
    fontWeight: '500',
  },
  resultActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  resultButton: {
    flex: 1,
    marginHorizontal: 4,
  },
});

export default CreateUrlScreen;