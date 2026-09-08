import { Banner } from '@/services/banner';
import { Dimensions, FlatList, Image, Linking, StyleSheet, TouchableOpacity } from 'react-native';

const { width } = Dimensions.get('window');

type Props = { data: Banner[] };

export function SectionBanners({ data }: Props) {
  if (!data.length) return null;

  return (
    <FlatList
      data={data}
      keyExtractor={(item, i) => item.id?.toString() ?? String(i)}
      horizontal
      pagingEnabled
      showsHorizontalScrollIndicator={false}
      renderItem={({ item }) => (
        <TouchableOpacity activeOpacity={0.9} onPress={() => item.link && Linking.openURL(item.link)}>
          <Image source={{ uri: item.imagem }} style={styles.image} resizeMode="cover" />
        </TouchableOpacity>
      )}
    />
  );
}

const styles = StyleSheet.create({
  image: { width: width - 32, height: 150, borderRadius: 8, marginRight: 8 },
});
