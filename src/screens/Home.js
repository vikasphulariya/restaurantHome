/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Alert,
  TextInput,
  Modal,
  TouchableWithoutFeedback,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import firestore from '@react-native-firebase/firestore';
import {useNavigation, useIsFocused} from '@react-navigation/native';

export default function Home({}) {
  //   const isFocused = useIsFocused();
  const navigation = useNavigation(navigation);
  const [itemsCopy, setItemsCopy] = useState([]);
  const [allItems, setAllItems] = useState([]);
  const [items, setItems] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [type, setType] = useState('Both');
  const [Cat, setCat] = useState('All');
  const [sortBy, setSortBy] = useState('Name');
  useEffect(() => {
    console.log('Use effect');
    const unsubscribe = firestore()
      .collection('items')
      .onSnapshot(onResult, onError);

    return () => unsubscribe();
    // getItem();
  }, []);
  useEffect(() => {
    filter();
  }, [Cat, type, allItems]);
  useEffect(() => {
    sortItems();
  }, [sortBy]);

  const sortItems = () => {
    if (sortBy === 'Name') {
      allItems.sort((a, b) => {
        const nameA = a.data.name.toUpperCase();
        const nameB = b.data.name.toUpperCase();

        if (nameA < nameB) {
          return -1;
        }
        if (nameA > nameB) {
          return 1;
        }
        return 0;
      });
    } else if (sortBy === 'Rate') {
      allItems.sort((a, b) => b.data.rate - a.data.rate);
    } else if (sortBy === 'Low') {
      allItems.sort(
        (a, b) => a.data.itemdiscountedPrice - b.data.itemdiscountedPrice,
      );
    } else {
      allItems.sort(
        (a, b) => b.data.itemdiscountedPrice - a.data.itemdiscountedPrice,
      );
    }
    filter();
  };

  const typeChoser = type => {
    let temp = [];
    allItems.forEach(item => {
      // console.log(item);
      if (item.data.type === type) {
        temp.push(item);
        // console.log(item);
      }
    });
    setItems(temp);
    setItemsCopy(temp);
  };
  const filter = () => {
    if (type === 'Both' && Cat === 'All') {
      setItems(allItems);
      return;
    } else if (type === 'Both' && Cat !== 'All') {
      let temp = [];
      allItems.forEach(item => {
        if (item.data.Cat === Cat) {
          temp.push(item);
        }
      });
      setItems(temp);
      setItemsCopy(temp);
    } else if (type !== 'Both' && Cat === 'All') {
      let temp = [];
      allItems.forEach(item => {
        if (item.data.type === type) {
          temp.push(item);
          console.log(item);
        }
      });
      setItems(temp);
      setItemsCopy(temp);
    } else if (type !== 'Both' && Cat !== 'All') {
      let temp = [];
      allItems.forEach(item => {
        if (item.data.Cat === Cat && item.data.type === type) {
          temp.push(item);
        }
      });
      setItems(temp);
      setItemsCopy(temp);
    }
  };

  const search = SearchTxt => {
    if (SearchTxt != '') {
      // setCovidData(covidDataCpy)
      const tempData = itemsCopy.filter(item => {
        return (
          item.data.name.toLowerCase().indexOf(SearchTxt.toLowerCase()) > -1
        );
        // const tempItem=item.State?item.State.toUpperCase():''.toUpperCase();
        // const itemData=SearchTxt.toUpperCase()
      });
      setItems(tempData);
    } else {
      setItems(itemsCopy);
    }
  };

  const categories = [
    {Cat: 'All'},
    {Cat: 'Noodle'},
    {Cat: 'Roll'},
    {Cat: 'Rice'},
    {Cat: 'Burger'},
    {Cat: 'Pasta'},
  ];

  function onResult(querySnapshot) {
    console.log('Got Users collection result.');
    // saveToDevice(querySnapshot);
    getItem(querySnapshot);
  }

  function onError(error) {
    console.error('ss', error);
  }

  const deleteItem = ID => {
    firestore()
      .collection('items')
      .doc(ID)
      .delete()
      .then(() => {
        console.log('User deleted!');
        getItem();
      });
  };

  const getItem = async querySnapshot => {
    // firestore()
    //   .collection('items')
    //   .get()
    //   .then(querySnapshot => {
    //     // console.log('Total users: ', querySnapshot.size);

    let temp = [];
    querySnapshot.forEach(documentSnapshot => {
      //   console.log('User ID: ', documentSnapshot.id, documentSnapshot.data());
      temp.push({
        id: documentSnapshot.id,
        data: documentSnapshot.data(),
      });
    });
    // console.log('temp', temp);
    temp.sort((a, b) => {
      const nameA = a.data.name.toUpperCase();
      const nameB = b.data.name.toUpperCase();

      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }
      return 0;
    });
    setSortBy('Name');
    setItems(temp);
    setItemsCopy(temp);
    setAllItems(temp);
    //   });
  };
  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text
          onPress={() => {
            console.log('price.length');
            // search('vikas');
            // typeChoser('Veg');
          }}
          style={styles.header}>
          Menu
        </Text>
      </View>
      {/* <ScrollView> */}
      {/* <View style={{backgroundColor:'yellow',height:'100%'}}> */}
      <View style={{flexDirection: 'row'}}>
        <TextInput
          placeholder="Search"
          placeholderTextColor={'#c0c0c0'}
          style={styles.search}
          onChangeText={value => {
            search(value);
          }}
        />
        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          style={{
            aspectRatio: 1,
            width: '15%',
            marginTop: 1,
          }}>
          <Image
            style={{
              aspectRatio: 1,
              width: '100%',
              marginTop: 1,
              height: 'auto',
              // backgroundColor: 'red',
            }}
            source={require('../icons/filter.png')}
          />
        </TouchableOpacity>
      </View>
      <View style={{flexDirection: 'row', paddingHorizontal: 7}}>
        <FlatList
          data={categories}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={item => {
            return (
              <View style={{marginHorizontal: 5, paddingVertical: 10}}>
                <TouchableOpacity
                  onPress={() => setCat(item.item.Cat)}
                  style={{
                    borderColor: '#c0c0c0',
                    borderWidth: Cat === item.item.Cat ? 1 : 0.2,
                    backgroundColor:
                      Cat === item.item.Cat ? '#39edbd' : '#d3d3d3',
                    elevation: Cat === item.item.Cat ? 8 : 0,
                    padding: 8,
                    borderRadius: 19,
                  }}>
                  <Text
                    style={{
                      paddingHorizontal: 5,
                      fontWeight: '700',
                      color: '#fff',
                    }}>
                    {item.item.Cat}
                  </Text>
                </TouchableOpacity>
              </View>
            );
          }}
        />
      </View>
      <FlatList
        data={items}
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
                  navigation.navigate('Item', {
                    data: items.item,
                    items: allItems,
                  });
                }}
                style={{width: '30%', height: '100%'}}>
                <Image
                  resizeMode="center"
                  source={{uri: items.item.data.itemUrl}}
                  style={styles.itemIcon}
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
                    {fontWeight: '200', fontSize: 13, textAlign: 'justify'},
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

              <View style={{justifyContent: 'center', width: '22%'}}>
                <TouchableOpacity
                  onPress={() => {
                    console.log(items.item.id);
                    navigation.navigate('Edit', {
                      dataofItem: items,
                    });
                    // deleteItem()
                  }}>
                  {/* <Image
                    style={styles.itemEdit}
                    source={require('../icons/edit.png')}
                  /> */}
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    // console.log(items.item.id)
                    Alert.alert(
                      'Confirm',
                      'This will delete this item.',
                      [
                        {
                          text: 'Delete Item',
                          onPress: () => deleteItem(items.item.id),
                        },
                      ],
                      {
                        cancelable: true,
                      },
                    );
                  }}>
                  {/* <Image
                    style={[styles.itemEdit, {tintColor: 'red'}]}
                    source={require('../icons/delete.png')}
                  /> */}
                </TouchableOpacity>
              </View>
            </View>
          );
        }}
      />

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => setModalVisible(false)}
          style={styles.centeredView}>
          <TouchableWithoutFeedback>
            <View style={styles.modalView}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  width: '100%',
                }}>
                <Text>1</Text>
                <Text style={styles.modalText}>Filter your Food</Text>
                <Text
                  onPress={() => setModalVisible(!modalVisible)}
                  l
                  style={styles.modalText}>
                  ❌
                </Text>
              </View>
              <Text style={styles.itemTxt}>Filter By Type</Text>
              <View>
                {/* Type View Started */}
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-around',
                    marginVertical: 10,
                    width: '90%',
                  }}>
                  <TouchableOpacity
                    onPress={() => setType('Both')}
                    style={{
                      backgroundColor: type === 'Both' ? 'orange' : '#c0c0c0',
                      elevation: type === 'Both' ? 10 : 0,
                      borderRadius: 19,
                      marginVertical: 5,
                    }}>
                    <Text
                      style={{
                        color: '#fff',
                        paddingHorizontal: 12,
                        padding: 5,
                        fontWeight: '900',
                        fontSize: 16,
                      }}>
                      Both
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => setType('Veg')}
                    style={{
                      backgroundColor: type === 'Veg' ? 'green' : '#c0c0c0',
                      elevation: type === 'Veg' ? 10 : 0,
                      borderRadius: 19,
                      marginVertical: 5,
                    }}>
                    <Text
                      style={{
                        color: '#fff',
                        paddingHorizontal: 12,
                        padding: 5,
                        fontWeight: '900',
                        fontSize: 16,
                      }}>
                      Veg
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => setType('Non-Veg')}
                    style={{
                      backgroundColor: type === 'Non-Veg' ? 'red' : '#c0c0c0',
                      elevation: type === 'Non-Veg' ? 10 : 0,
                      borderRadius: 19,
                      marginVertical: 5,
                    }}>
                    <Text
                      style={{
                        color: '#fff',
                        paddingHorizontal: 12,
                        // elevation: 11,
                        padding: 5,
                        fontWeight: '900',
                        fontSize: 16,
                      }}>
                      Non-Veg
                    </Text>
                  </TouchableOpacity>

                  {/* Type View Ended */}
                </View>
              </View>
              <Text style={styles.itemTxt}>Sort By</Text>
              <View style={{marginVertical: 10}}>
                <TouchableOpacity
                  onPress={() => {
                    setSortBy('Name');
                  }}
                  style={{
                    backgroundColor: sortBy === 'Name' ? 'orange' : '#c0c0c0',
                    borderRadius: 19,
                    marginVertical: 5,
                    alignSelf: 'center',
                  }}>
                  <Text
                    style={{
                      color: '#fff',
                      paddingHorizontal: 12,
                      padding: 5,
                      fontWeight: '900',
                      fontSize: 16,
                    }}>
                    Item Name
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    console.log('svs');
                    setSortBy('Rate');
                  }}
                  style={{
                    backgroundColor: sortBy === 'Rate' ? 'orange' : '#c0c0c0',
                    borderRadius: 19,
                    marginVertical: 5,
                    alignSelf: 'center',
                  }}>
                  <Text
                    style={{
                      color: '#fff',
                      paddingHorizontal: 12,
                      padding: 5,
                      fontWeight: '900',
                      fontSize: 16,
                    }}>
                    Item Rating
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    setSortBy('Low');
                    // sortItems();
                  }}
                  style={{
                    backgroundColor: sortBy === 'Low' ? 'orange' : '#c0c0c0',
                    borderRadius: 19,
                    marginVertical: 5,
                  }}>
                  <Text
                    style={{
                      color: '#fff',
                      paddingHorizontal: 12,
                      padding: 5,
                      fontWeight: '900',
                      fontSize: 16,
                    }}>
                    Price Low to High
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    setSortBy('High');
                  }}
                  style={{
                    backgroundColor: sortBy === 'High' ? 'orange' : '#c0c0c0',
                    borderRadius: 19,
                    marginVertical: 5,
                  }}>
                  <Text
                    style={{
                      color: '#fff',
                      paddingHorizontal: 12,
                      padding: 5,
                      fontWeight: '900',
                      fontSize: 16,
                    }}>
                    Price High to Low
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // marginTop: 22,
    // backgroundColor: 'red',
    // backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '85%',
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    color: 'black',
    fontWeight: '800',
    fontSize: 20,
  },
  container: {
    flex: 1,
    // marginBottom:70,
    // backgroundColor: 'red'
    // marginBottom: 60,
    // backgroundColor:"yellow",
  },
  headerContainer: {
    width: '100%',
    height: 60,
    backgroundColor: '#FFFFFF',
    elevation: 4,
    // alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 10,
    // marginBottom:10
  },
  header: {
    color: 'black',
    padding: 5,
    fontWeight: '700',
    fontSize: 24,
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
  itemIcon: {
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
  itemEdit: {
    width: 44,
    height: 44,
    alignSelf: 'center',
    paddingHorizontal: 2,
    marginVertical: 10,
    aspectRatio: 1.1,
  },
  search: {
    width: '81%',
    borderRadius: 10,
    height: 50,
    backgroundColor: '#FFFFFF',
    borderWidth: 0.5,
    borderColor: '#c0c0c0',
    alignSelf: 'center',
    margin: 5,
    fontSize: 18,
    elevation: 5,
    paddingHorizontal: 12,
    color: 'black',
  },
});
