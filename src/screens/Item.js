/* eslint-disable react/self-closing-comp */
/* eslint-disable react-native/no-inline-styles */
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  FlatList,
} from 'react-native';
import React, {useState, useEffect} from 'react';

const Item = ({route, navigation}) => {
  // console.log(route.params.data.data);
  const [Similar, setSimilar] = useState([]);

  useEffect(() => {
    findSimilar();
  }, []);

  const findSimilar = () => {
    let items = route.params.items;
    let temp = [];
    items.forEach(element => {
      if (element.data.Cat === route.params.data.data.Cat) {
        if (element.data.name !== route.params.data.data.name) {
          console.log(element.data.name);
          temp.push(element);
        }
      }
    });
    setSimilar(temp);
  };
  // findSimilar();
  return (
    <View style={{backgroundColor: '#fcfcfc', flex: 1}}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginVertical: 29,
          marginHorizontal: 20,
        }}>
        <Text
          onPress={() => {
            navigation.goBack();
          }}
          style={{color: 'black', fontSize: 23, fontWeight: '700'}}>
          ⩤
        </Text>
        <Text style={{color: 'black', fontSize: 20, fontWeight: '700'}}>
          Item Details
        </Text>
        <View
          style={{
            marginHorizontal: 2,
            height: 24,
            backgroundColor: '#c0c0c0',
            borderRadius: 12,
            justifyContent: 'center',
            alignContent: 'center',
            alignItems: 'center',
          }}>
          <Text style={{paddingHorizontal: 5}}>
            ⭐{route.params.data.data.rate}
          </Text>
        </View>
        {/* <Text style={{color: 'black', fontSize: 18, fontWeight: '700'}}></Text> */}
      </View>
      <Image
        style={styles.itemIcon}
        source={{uri: route.params.data.data.itemUrl}}
      />
      <ScrollView
        style={{
          backgroundColor: '#ffff',
        }}>
        <View
          style={{
            backgroundColor: '#fff',
            flex: 1,
            height: '100%',
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
            marginTop: 15,
            elevation: 15,
            //   borderTopWidth:1,
            //   borderColor:'#c0c0c0'
          }}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text
              style={{
                color: 'black',
                paddingHorizontal: 30,
                paddingTop: 7,
                fontWeight: 'bold',
                fontSize: 22,
                fontStyle: 'italic',
              }}>
              {route.params.data.data.name}
            </Text>
            <View
              style={{
                //   position: 'absolute',
                marginTop: 10,
                marginHorizontal: 35,
                height: 26,
                backgroundColor:
                  route.params.data.data.type === 'Veg' ? '#30fc6d' : 'red',
                //   right: 10,
                //   bottom: 10,
                borderRadius: 12,
                justifyContent: 'center',
                alignContent: 'center',
                alignItems: 'center',
              }}>
              <Text
                style={{
                  paddingHorizontal: 7,
                  // padding:1,
                  fontWeight: '700',
                  color: '#fff',
                }}>
                {route.params.data.data.type === 'Veg' ? 'Veg' : 'Non-Veg'}
              </Text>
            </View>
          </View>
          <Text
            style={{
              color: '#57665a',
              paddingHorizontal: 30,
              paddingBottom: 5,
              fontWeight: 'bold',
              fontSize: 18,
            }}>
            ₹{route.params.data.data.itemPrice}
          </Text>
          <View
            style={{
              alignSelf: 'center',
              backgroundColor: 'rgba(192, 192, 192, .5)',
              width: '86%',
              height: 1,
              borderRadius: 10,
            }}></View>
          <Text
            style={{
              color: '#4e4e4e',
              paddingHorizontal: 30,
              // paddingBottom: 5,
              fontWeight: 'bold',
              fontSize: 15,
              textAlign: 'justify',
              marginTop: 5,
            }}>
            {route.params.data.data.itemDiscription}
          </Text>
          <TouchableOpacity
            style={{
              backgroundColor: 'black',
              width: '80%',
              alignSelf: 'center',
              // position: 'absolute',
              marginVertical: 45,
              // bottom: 15,
              borderRadius: 10,
            }}>
            <Text
              style={{
                color: '#fff',
                fontWeight: '900',
                fontSize: 22,
                alignSelf: 'center',
                paddingVertical: 10,
              }}>
              Add To Basket
            </Text>
          </TouchableOpacity>
          {Similar.length !== 0 ? (
            <Text
              style={{
                color: '#000',
                alignSelf: 'center',
                fontWeight: '800',
                fontSize: 20,
              }}>
              Similar Items
            </Text>
          ) : null}
          {Similar.length !== 0 ? (
            <FlatList
              data={Similar}
              renderItem={(items, index) => {
                // console.log(items.item.data.itemUrl);
                return (
                  <View style={[styles.items, {height: 125}]}>
                    {/* The Below View is for rating */}
                    <View
                      style={{
                        position: 'absolute',
                        marginHorizontal: 2,
                        height: 24,
                        backgroundColor: '#c0c0c0',
                        right: 10,
                        top: 10,
                        borderRadius: 12,
                        justifyContent: 'center',
                        alignContent: 'center',
                        alignItems: 'center',
                      }}>
                      <Text style={{paddingHorizontal: 5}}>
                        ⭐{items.item.data.rate}
                      </Text>
                    </View>
                    {/* The Below View is for Veg/Non-Veg */}
                    <View
                      style={{
                        position: 'absolute',
                        marginHorizontal: 2,
                        height: 24,
                        backgroundColor:
                          items.item.data.type === 'Veg' ? '#30fc6d' : 'red',
                        right: 10,
                        bottom: 10,
                        borderRadius: 12,
                        justifyContent: 'center',
                        alignContent: 'center',
                        alignItems: 'center',
                      }}>
                      <Text
                        style={{
                          paddingHorizontal: 5,
                          fontWeight: '700',
                          color: '#fff',
                        }}>
                        {items.item.data.type === 'Veg' ? 'Veg' : 'N-Veg'}
                      </Text>
                    </View>
                    <TouchableOpacity
                      onPress={() => {
                        navigation.replace('Item', {
                          data: items.item,
                          items: route.params.items,
                        });
                      }}
                      style={{width: '30%', height: '100%'}}>
                      <Image
                        resizeMode="center"
                        source={{uri: items.item.data.itemUrl}}
                        style={styles.itemIcon1}
                      />
                    </TouchableOpacity>

                    <View style={styles.itemData}>
                      <Text
                        ellipsizeMode="tail"
                        numberOfLines={1}
                        style={styles.itemTxt}>
                        {items.item.data.name}
                      </Text>
                      <Text
                        ellipsizeMode="tail"
                        numberOfLines={3}
                        style={[
                          styles.itemTxt,
                          {
                            fontWeight: '200',
                            fontSize: 13,
                            textAlign: 'justify',
                          },
                        ]}>
                        {items.item.data.itemDiscription}
                      </Text>

                      <View
                        style={{
                          flexDirection: 'row',
                          position: 'absolute',
                          bottom: 0,
                          paddingLeft: 10,
                        }}>
                        <Text style={styles.itemPrice}>
                          ₹{items.item.data.itemPrice}
                        </Text>
                        <Text style={styles.itemDiscounterPrice}>
                          ₹{items.item.data.itemdiscountedPrice}
                        </Text>
                      </View>
                    </View>

                    <View
                      style={{justifyContent: 'center', width: '22%'}}></View>
                  </View>
                );
              }}
            />
          ) : null}
        </View>
      </ScrollView>
    </View>
  );
};

export default Item;
const styles = StyleSheet.create({
  itemIcon: {
    width: '75%',
    height: undefined,
    alignSelf: 'center',
    aspectRatio: 1,
    // marginHorizontal: '5%',
    borderRadius: 15,
    borderWidth: 0.5,
    borderColor: '#c0c0c0',
  },
  items: {
    marginHorizontal: '4%',
    width: '92%',
    backgroundColor: '#fff',
    borderRadius: 12,
    borderColor: '#c0c0c0',
    borderWidth: 0.5,
    elevation: 3,
    paddingLeft: 10,
    paddingVertical: 8,
    margin: 10,
    flexDirection: 'row',
  },
  itemTxt: {
    color: 'black',
    fontSize: 18,
    fontWeight: '700',
  },
  itemIcon1: {
    // width: 100,
    height: '100%',
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: '#c0c0c0',
  },
  itemData: {
    paddingHorizontal: 10,
    // borderWidth:1,
    width: '50%',
    paddingVertical: 0,
  },
  itemPrice: {
    color: 'red',
    marginRight: 5,
    // fontStyle:'strikethrough',
    textDecorationLine: 'line-through',
    textDecorationColor: 'black',
    textDecorationStyle: 'solid',
    fontSize: 18,
  },
  itemDiscounterPrice: {
    fontSize: 20,
    color: '#40ed7a',
  },
});
