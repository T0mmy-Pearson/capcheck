import { Image } from 'expo-image';
import { Platform, StyleSheet } from 'react-native';

import { Collapsible } from '@/components/Collapsible';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Button } from '@react-navigation/elements';


export default function TabTwoScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
        headerImage={
             <Image
               source={require("@/assets/images/1000_F_370951245_vWF0oLH6WRDT5kb9Anvl4HbLCJBBX3XI.jpg")}
               style={styles.reactLogo}
             />
           }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Info 🍄</ThemedText>
      </ThemedView>
      <ThemedText>introduction to the info section</ThemedText>
<Button color="black">FORAGING INFORMATION</Button>
<Button color="black">MUSHROOM PROFILE</Button>
<Button color="black">WEATHER INFO</Button>
<Collapsible title="SAFETY INFO"><ThemedText>Don't be dumb, Don't eat it if it looks like this 🍄 <ThemedText type="defaultSemiBold">...and don't sue us</ThemedText></ThemedText></Collapsible>


    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  buttonTitle: {
    color: '#808080',
  },
  reactLogo: {
    width: 630,
    height: 300,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});

//Nav Bar
//home, info, map, community, profile