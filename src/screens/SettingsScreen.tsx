import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Switch,
  TouchableOpacity,
  StatusBar,
  Alert,
} from 'react-native';
import { Colors } from '../constants/colors';
import { useArStore } from '../store/useArStore';

interface SettingRowProps {
  label: string;
  description?: string;
  value: boolean;
  onToggle: (val: boolean) => void;
}

function SettingRow({ label, description, value, onToggle }: SettingRowProps) {
  return (
    <View style={styles.settingRow}>
      <View style={styles.settingInfo}>
        <Text style={styles.settingLabel}>{label}</Text>
        {description ? (
          <Text style={styles.settingDesc}>{description}</Text>
        ) : null}
      </View>
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{ false: Colors.border, true: Colors.primary }}
        thumbColor={value ? Colors.white : Colors.textDim}
        ios_backgroundColor={Colors.border}
      />
    </View>
  );
}

interface NavRowProps {
  label: string;
  value?: string;
  onPress: () => void;
  danger?: boolean;
}

function NavRow({ label, value, onPress, danger }: NavRowProps) {
  return (
    <TouchableOpacity style={styles.settingRow} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.settingInfo}>
        <Text style={[styles.settingLabel, danger && { color: Colors.error }]}>
          {label}
        </Text>
      </View>
      <View style={styles.navRight}>
        {value ? <Text style={styles.navValue}>{value}</Text> : null}
        <Text style={styles.navChevron}>{'>'}</Text>
      </View>
    </TouchableOpacity>
  );
}

function SectionHeader({ title }: { title: string }) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionHeaderText}>{title}</Text>
    </View>
  );
}

export function SettingsScreen() {
  const { reset } = useArStore();
  const [haptics, setHaptics] = useState(true);
  const [saveToRoll, setSaveToRoll] = useState(true);
  const [bodyTracking, setBodyTracking] = useState(true);
  const [shadowRendering, setShadowRendering] = useState(true);
  const [highQuality, setHighQuality] = useState(false);

  const handleClearCache = () => {
    Alert.alert('Clear AR Cache', 'Remove all locally cached garment assets?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Clear',
        style: 'destructive',
        onPress: () => {
          reset();
          Alert.alert('Done', 'AR cache cleared.');
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />

      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>U</Text>
          </View>
          <View>
            <Text style={styles.profileName}>Guest User</Text>
            <Text style={styles.profileSub}>Not signed in</Text>
          </View>
          <TouchableOpacity style={styles.signInBtn} activeOpacity={0.8}>
            <Text style={styles.signInText}>Sign In</Text>
          </TouchableOpacity>
        </View>

        <SectionHeader title="AR Experience" />
        <View style={styles.section}>
          <SettingRow
            label="Body Tracking"
            description="Enable real-time body pose estimation"
            value={bodyTracking}
            onToggle={setBodyTracking}
          />
          <View style={styles.divider} />
          <SettingRow
            label="Shadow Rendering"
            description="Cast realistic garment shadows"
            value={shadowRendering}
            onToggle={setShadowRendering}
          />
          <View style={styles.divider} />
          <SettingRow
            label="High Quality Mode"
            description="4K garment textures — may affect performance"
            value={highQuality}
            onToggle={setHighQuality}
          />
        </View>

        <SectionHeader title="App" />
        <View style={styles.section}>
          <SettingRow
            label="Haptic Feedback"
            value={haptics}
            onToggle={setHaptics}
          />
          <View style={styles.divider} />
          <SettingRow
            label="Auto-save Snapshots"
            description="Save AR captures to Camera Roll"
            value={saveToRoll}
            onToggle={setSaveToRoll}
          />
        </View>

        <SectionHeader title="About" />
        <View style={styles.section}>
          <NavRow label="App Version" value="1.0.0" onPress={() => {}} />
          <View style={styles.divider} />
          <NavRow label="Unity AR Version" value="2022.3 LTS" onPress={() => {}} />
          <View style={styles.divider} />
          <NavRow label="Privacy Policy" onPress={() => {}} />
          <View style={styles.divider} />
          <NavRow label="Terms of Service" onPress={() => {}} />
        </View>

        <SectionHeader title="Data" />
        <View style={styles.section}>
          <NavRow label="Clear AR Cache" onPress={handleClearCache} danger />
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>AR Clothing Try-On</Text>
          <Text style={styles.footerSub}>
            Powered by Unity AR Foundation + ARKit / ARCore
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.text,
    letterSpacing: -0.5,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceElevated,
    margin: 16,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primary + '33',
    borderWidth: 2,
    borderColor: Colors.primary + '66',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.primary,
  },
  profileName: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
  },
  profileSub: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  signInBtn: {
    marginLeft: 'auto',
    backgroundColor: Colors.primary,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  signInText: {
    color: Colors.white,
    fontSize: 13,
    fontWeight: '700',
  },
  sectionHeader: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 8,
  },
  sectionHeaderText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textDim,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
  section: {
    backgroundColor: Colors.surfaceElevated,
    marginHorizontal: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
  },
  settingInfo: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.text,
  },
  settingDesc: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
    lineHeight: 16,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginLeft: 16,
  },
  navRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  navValue: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  navChevron: {
    fontSize: 16,
    color: Colors.textDim,
    fontWeight: '600',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 32,
    gap: 6,
  },
  footerText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textDim,
  },
  footerSub: {
    fontSize: 12,
    color: Colors.textDim,
    textAlign: 'center',
  },
});
