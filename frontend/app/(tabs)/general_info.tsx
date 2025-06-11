import { Image } from 'expo-image';
import { StyleSheet } from 'react-native';
import { Collapsible } from '@/components/Collapsible';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Button } from '@react-navigation/elements';
import { HelloWave } from '@/components/WaveText';
import { BodyText } from '@/components/BodyText';
import { useNavigation } from '@react-navigation/native';



export default function TabTwoScreen() {

  const navigation = useNavigation<any>();

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
      headerImage={
        <Image
          source={require("@/assets/images/1000_F_370951245_vWF0oLH6WRDT5kb9Anvl4HbLCJBBX3XI.jpg")}
          style={styles.headerImage}
        />
      }>
     {/*  <ThemedView style={styles.titleContainer}>
        <ThemedText type="title" style={styles.titleText}> Capcheck Info </ThemedText>
      </ThemedView> */}
      <BodyText style={styles.titleText}>Dear Forager,</BodyText>
      <BodyText>Capcheck is an app for our community of foragers who identify mushrooms and other edibles and inedibles. With a user-friendly interface, it allows users to share photos, descriptions, and locations of their finds, creating a collaborative database of local flora. The app features identification tools, safety tips, and seasonal guides to enhance the foraging experience. By connecting enthusiasts, Capcheck fosters a sense of community and encourages sustainable foraging practices. Whether you're a seasoned forager or a curious beginner, Capcheck is your go-to resource for exploring the world of wild edibles.</BodyText>
      <Collapsible title="Safety"><BodyText>When foraging, safety is essential. Always positively identify any plant or mushroom before consuming—many edible species have toxic lookalikes. Use reputable field guides or apps, and never rely on a single characteristic for identification. Forage with experienced friends when possible, and avoid areas that may be contaminated by pesticides, pollution, or animal waste. Only harvest what you need, leaving enough for wildlife and future growth. Wash all finds thoroughly before eating. If you’re unsure about something, don’t eat it. Finally, let someone know your foraging plans and location, and carry a phone or map for emergencies. Stay curious, but cautious!🍄 <ThemedText type="defaultSemiBold">...and don't sue us</ThemedText></BodyText></Collapsible>
      <Collapsible title="Foraging Information"><ThemedText>Foraging is a timeless adventure that connects us deeply with nature. Wandering through forests, fields, or coastlines, we discover edible treasures—wild mushrooms, berries, herbs, and nuts—each offering unique flavors and nutritional benefits. Foraging encourages mindfulness, as we learn to identify plants and fungi, respect ecosystems, and harvest sustainably. It fosters curiosity, self-reliance, and a sense of stewardship for the land. Sharing foraged finds with friends or family creates lasting memories and delicious meals. Whether you're seeking wild garlic in spring or blackberries in autumn, foraging transforms a simple walk into a journey of discovery, wonder, and gratitude.</ThemedText></Collapsible>
      <Button color="white" style={styles.button} onPress={() => navigation.navigate("MushroomList")}>Explore our database of over 250 mushrooms</Button>




    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#948781',
    left: -35,
    width: 630,
    height: 300,
    bottom: 0,
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
    fontSize: 33,
    paddingTop: 20,
  },
  button: {
    color: '#948781',
    backgroundColor: '#353636',
  },
  reactLogo: {
    width: 630,
    height: 300,
    bottom: 0,
    left: 0,
    position: 'absolute',
  }
});

//Nav Bar
//home, info, map, community, profile