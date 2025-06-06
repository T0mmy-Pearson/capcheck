import { Image } from 'expo-image';

import { StyleSheet } from 'react-native';


import { Platform, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { Collapsible } from '@/components/Collapsible';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Button } from '@react-navigation/elements';



export default function TabTwoScreen() {
  const navigation = useNavigation();
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
        headerImage={
             <Image
               source={require("@/assets/images/1000_F_370951245_vWF0oLH6WRDT5kb9Anvl4HbLCJBBX3XI.jpg")}
               style={styles.headerImage}
             />
           }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title" style={styles.titleText}>🍄 Capcheck Info 🍄</ThemedText>
      </ThemedView>

      <ThemedText>Introduction to the info section</ThemedText>
<Button color="white">FORAGING INFORMATION</Button>

<Collapsible title="Foraging Information"><ThemedText>Foraging is a timeless adventure that connects us deeply with nature. Wandering through forests, fields, or coastlines, we discover edible treasures—wild mushrooms, berries, herbs, and nuts—each offering unique flavors and nutritional benefits. Foraging encourages mindfulness, as we learn to identify plants and fungi, respect ecosystems, and harvest sustainably. It fosters curiosity, self-reliance, and a sense of stewardship for the land. Sharing foraged finds with friends or family creates lasting memories and delicious meals. Whether you're seeking wild garlic in spring or blackberries in autumn, foraging transforms a simple walk into a journey of discovery, wonder, and gratitude.</ThemedText></Collapsible>

<Button color="white">MUSHROOM PROFILE</Button>
<Button color="white">WEATHER INFO</Button>
<Collapsible title="SAFETY INFO"><ThemedText>Don't be dumb, Don't eat it if it looks like this 🍄 <ThemedText type="defaultSemiBold">...and don't sue us</ThemedText></ThemedText></Collapsible>


    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {

    color: '#948781',
    bottom: -90,
    left: -35,

    color: '#808080',
    width: 630,
    height: 300,
    bottom: 0,
    left: 0,

    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  titleText: {
    color: '#FFFFFF',
    fontSize: 30,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 16,
  },
  buttonTitle: {

    color: '#948781',
  },
  reactLogo: {
    width: 630,
    height: 300,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },

    color: '#808080',
  }

});

//Nav Bar
//home, info, map, community, profile