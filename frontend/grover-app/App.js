import { StatusBar } from 'expo-status-bar';
import * as React from 'react';
import { useState, useEffect } from 'react';
import { StyleSheet, Text, TextInput, View, Image, ImageBackground, Pressable, FlatList, TouchableOpacity, Modal, ScrollView, SafeAreaView, Keyboard, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SearchBar, Card, FAB, Icon, Badge } from '@rneui/themed';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { request, gql } from 'graphql-request';

const REPLIT_IMAGES_ENDPOINT = "https://CSCI-660-Grover-App.bencorriette.repl.co/images/"
const AWS_GRAPHQL_ENDPOINT = 'https://z9zcba24b7.execute-api.us-east-1.amazonaws.com/';

const UPDATE_PRODUCT_PRICE = gql`
mutation Mutation($updateProductPriceInput: UpdateProductPriceInput!) {
  updateProductPrice(input: $updateProductPriceInput) {
    id
  }
}
`;

const GET_DAIRY_PRODUCTS = gql`
query GetDairyProducts {
  merchants {
    products(filterBy: { category: { matches: "Dairy" } }) {
      name
      picture
      price
      weight
      id
      merchant {
        id
        location {
          address
          city
          state
          zip
        }
        name
      }
    }
  }
}
`;

const GET_MILK_PRODUCTS = gql`
query GetMilkProducts {
  merchants {
    products(filterBy: { name: { matches: "Milk" } }) {
      name
      picture
      price
      weight
      id
      merchant {
        id
        location {
          address
          city
          state
          zip
        }
        name
      }
    }
  }
}
`;

const GET_MEAT_PRODUCTS = gql`
query GetMeatProducts {
  merchants {
    products(filterBy: { category: { matches: "Meat" } }) {
      name
      picture
      price
      weight
      id
      merchant {
        id
        location {
          address
          city
          state
          zip
        }
        name
      }
    }
  }
}
`;

const GET_PRODUCE_PRODUCTS = gql`
query GetProduceProducts {
  merchants {
    products(filterBy: { category: { matches: "Produce" } }) {
      name
      picture
      price
      weight
      id
      merchant {
        id
        location {
          address
          city
          state
          zip
        }
        name
      }
    }
  }
}
`;

export function ActionButton(props) {
  const { onPress, title } = props;
  return (
    <Pressable style={styles.actionButton} onPress={onPress}>
      <Text style={styles.actionButtonText}>{title}</Text>
    </Pressable>
  );
}

export function ActionButtonProducts(props) {
  const { onPress, title } = props;
  return (
    <Pressable style={styles.actionButtonProducts} onPress={onPress}>
      <Text style={styles.actionButtonProductsText}>{title}</Text>
    </Pressable>
  );
}

export function Item(props) {
  const { item, onPress } = props;
  const [modalVisible, setModalVisible] = useState(false);
  const [priceUpdateText, setPriceUpdateText] = useState('');

  let productPicture = item.picture;
  let updatedPrice;

  return (
      <TouchableOpacity onPress={onPress} style={styles.item}>
      <View style={styles.centeredView}>
      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Icon 
              name='close' 
              color='#748A9D'
              containerStyle={{ 
                position: 'absolute',
                top: 10, 
                right: 10
              }}
              size={45}
              onPress={() => setModalVisible(!modalVisible)}
            />
            <Image 
              style={{
                maxHeight: 250, 
                maxWidth: 250
              }}
              source={(item.name == 'Milk') ? require('./assets/dsp/assets/images/home-screen-milk.png') : 
                      (item.name == 'Cottage cheese') ? require('./assets/dsp/assets/images/Cottagecheese.jpg') :
                      (item.name == 'Sour cream') ? require('./assets/dsp/assets/images/Sourcream.jpg') :
                      (item.name == 'Yogurt') ? require('./assets/dsp/assets/images/Yogurt.jpg') : 
                      (item.name == 'Cheese') ? require('./assets/dsp/assets/images/Cheese.jpg') :
                      (item.name == 'Eggs') ? require('./assets/dsp/assets/images/Eggs.jpg') :
                      (item.name == 'Beef') ? require('./assets/dsp/assets/images/Beef.jpg') :
                      (item.name == 'Wild Salmon') ? require('./assets/dsp/assets/images/WildSalmon.jpg') : 
                      (item.name == 'Alaskan King Crab') ? require('./assets/dsp/assets/images/AlaskanKingCrabLegs.jpg') :
                      (item.name == 'Lettuce') ? require('./assets/dsp/assets/images/Lettuce.jpg') :
                      (item.name == 'Oranges') ? require('./assets/dsp/assets/images/Oranges.jpg') :
                      (item.name == 'Apples') ? require('./assets/dsp/assets/images/Apples.jpg') :
                      (item.name == 'Bananas') ? require('./assets/dsp/assets/images/Bananas.jpg') : 
                      (item.name == 'Squash') ? require('./assets/dsp/assets/images/Squash.jpg') :
                      (item.name == 'Celery') ? require('./assets/dsp/assets/images/Celery.jpg') :
                      (item.name == 'Cucumber') ? require('./assets/dsp/assets/images/Cucumber.jpg') :
                      (item.name == 'Mushrooms') ? require('./assets/dsp/assets/images/Mushrooms.jpg') :
                      (item.name == 'Tomatoes') ? require('./assets/dsp/assets/images/Tomatoes.jpg') :
                      require('./assets/dsp/assets/images/NoImageAvailable.jpg')
                }
              resizeMode="contain" 
              />
            <Text style={{
              fontSize: 24,
              color: '#748A9D'
            }}>{item.name + ' - ' + item.weight + ' oz.'}</Text>
            <Text style={{
              fontSize: 16,
              textAlign: 'center'
            }}>{item.merchant.name + '\n'  + item.merchant.location.city + ', '+ item.merchant.location.state + ' ' + item.merchant.location.zip}</Text>
            <Text style={[styles.headerText, {
            marginTop: 30,
            marginBottom: 10,
            fontWeight: 'bold'
          }]}>NEW PRICE</Text>
            <TextInput
              style={[styles.textInput, {
                marginBottom: 25,
                fontWeight: 'bold',
                fontSize: 21,
                textAlign: 'center',
                minWidth: '100%'
              }]}
              autoFocus={true}
              keyboardType='numeric'
              defaultValue={'' + item.price + ''}
              onChangeText={(text) => { updatedPrice = text; setPriceUpdateText(updatedPrice); }}
              onSubmitEditing={() => { if(Number.isNaN(priceUpdateText)) { Alert.alert('You have entered an invalid number; please enter a valid number and try again'); }  }}
            />
            <ActionButton
              title="UPDATE"
              onPress={() => {
                const NEW_PRICE = Number(priceUpdateText);
                const VARIABLES =
                {
                  "updateProductPriceInput": {
                    "merchantId": '' + item.merchant.id + '',
                    "price": NEW_PRICE,
                    "productId": '' + item.id + ''
                  }
                };
                console.log(item.merchant.id);
                console.log(NEW_PRICE);
                console.log(item.id);
                request(AWS_GRAPHQL_ENDPOINT, UPDATE_PRODUCT_PRICE, VARIABLES)
                .then((data) => {
                  console.log(data);
                  setModalVisible(!modalVisible);
                })
                .catch((error) => console.error(error))
              }}
            />
          </View>
        </View>
      </Modal>
    </View>
      <FAB 
        icon={{ name: 'edit', color: '#fff'}} 
        style={{ 
          position: 'absolute',
          zIndex: 1000,
          top: 15, 
          right: 15 
        }} 
        size='small'
        color='#25BEE8'
        onPress={() => setModalVisible(true)}
        />
      <Image 
        style={{
          height: 180, 
          width: '100%'
        }}
        source={{ uri: `${REPLIT_IMAGES_ENDPOINT}${productPicture}` }}
        resizeMode="contain" />
      <Text style={{
        fontWeight: 'bold',
        fontSize: 16,
        color: '#25BEE8'
      }}>{'$' + item.price}</Text>
      <Text style={{
        fontSize: 14,
        color: '#748A9D'
      }}>{item.name + ' - ' + item.weight + ' oz.'}</Text>
      <Text style={{
        fontSize: 10
      }}>{item.merchant.name + '\n'  + item.merchant.location.city + ', '+ item.merchant.location.state + ' ' + item.merchant.location.zip}</Text>
      <ActionButtonProducts
          title="Add to List"
          onPress={() => {
          }}
        />
    </TouchableOpacity>
  );
}

export function ProductItem(props) {
  const { productData } = props
  const [selectedId, setSelectedId] = useState(null);
  
  const renderItem = ({ item }) => {
    console.log(item);
      return (
        <Item
          item={item}
          onPress={() => { 
            //setSelectedId(item.id);
          }}
        />
      );
  };

  return (
    <View style={styles.container2}>
      <FlatList
        data={productData}
        renderItem={renderItem}
        //keyExtractor={(item) => item.id}
        keyExtractor={() => Math.random()}
        extraData={selectedId}
        numColumns='2'
      />
      <StatusBar style="auto" />
    </View>
  );
}

export function DealsButton(props) {
  const { onPress, title } = props;

  let requireImage, bgColor, positionTop, positionLeft, mxHeight, mxWidth; 
  if (title == 'Dairy') {
    requireImage = require('./assets/dsp/assets/images/home-screen-milk.png');
    bgColor = '#ed3505';
    positionTop = -7;
    positionLeft = 0;
    mxHeight = 55;
    mxWidth = 55;
  } else if (title == 'Meat') {
    requireImage = require('./assets/dsp/assets/images/home-screen-beef.png');
    bgColor = '#99232a';
    positionTop = -11;
    positionLeft = 0;
    mxHeight = 65;
    mxWidth = 65;
  } else { // Produce
    requireImage = require('./assets/dsp/assets/images/home-screen-broccoli-2.png');
    bgColor = '#375329';
    positionTop = -5;
    positionLeft = 0;
    mxHeight = 55;
    mxWidth = 55;
  }
  return (
    <Pressable style={[styles.dealsButton, { backgroundColor: bgColor }]} 
        onPress={onPress}>
      <Image style={{
        position: 'relative',
        top: positionTop,
        left: positionLeft,
        maxHeight: mxHeight, 
        maxWidth: mxWidth
      }}
          resizeMode="contain"
          source={requireImage}
        />
      <Text style={styles.dealsButtonText}>{title}</Text>
    </Pressable>
  );
}

const LoginScreen = ({navigation}) => {
  return (
    <View style={styles.container}>
      <Image
          style={[styles.groverLogo, { 
            position: 'relative',
            top: 45
          }]}
          source={ require('./assets/dsp/assets/images/grover-text-icon-logo.png')}
      />
      <Text style={[styles.headerText, {
          marginTop: 80,
          marginBottom: 40
        }]}>Sign In</Text>
      <TextInput
        style={styles.textInput}
        keyboardType='email-address'
        placeholder="Email"
      />
      <TextInput
        style={styles.textInput}
        keyboardType='default'
        placeholder='Password'
        secureTextEntry={true}
      />
      <Text style={[styles.textLink, {
          marginTop: 20,
          marginBottom: 100
        }]}>
          Forgot password?
      </Text>
      <ActionButton
          title="SIGN IN"
          onPress={() => navigation.navigate("Welcome")}
        />
        <Text 
          style={[styles.textLinkStrong, {
            marginTop: 50,
            marginBottom: 20
          }]}
          onPress={() => navigation.navigate("AccountSignUp")}
        >
          Create Account
        </Text>
      <StatusBar style="auto" />
    </View>
  );
};

const ProductsScreen = ({route}) => {
  const { productData } = route.params;
  return (
    <View style={styles.container}>
      <ProductItem
        productData={productData} />
      <StatusBar style="auto" />
    </View>
  );
};

const HomeScreen = ({navigation}) => {
  return (
    <View style={styles.container}>
      <Image
          style={{ 
            position: 'relative',
            marginBottom: 15,
            maxWidth: 250,
            maxHeight: 50
          }}
          source={ require('./assets/dsp/assets/images/grover-text-logo.png')}
      />
      <SearchBar
          containerStyle={{
            width: '95%',
            marginBottom: 15,
            backgroundColor: 'transparent',
            borderTopWidth: 0,
            borderBottomWidth: 0
          }}
          placeholder="Search for grocery deals"
          lightTheme
          round
          onSubmitEditing={() => request(AWS_GRAPHQL_ENDPOINT, GET_MILK_PRODUCTS).then((data) => { 
            // Transpose returned object to new object
            // Step #1: Create new object
            let milkProducts = [];
            // Step #2: Iterate through returned object to push each object in non-empty array into new object
            data.merchants.forEach((groupOfProducts) => {
              if (groupOfProducts.products.length > 0) {
                groupOfProducts.products.forEach((product) => {
                  milkProducts.push(product);
                })
              }                  
            })
            console.log(milkProducts);
            // Step #3: Assign new object to productData parameter
            navigation.navigate({
              name: "Products", params: {
                productData: milkProducts
              }
            })})}
        />
      <Image
          style={{ 
            position: 'relative',
            height: 270,
            width: '100%'
          }}
          source={ require('./assets/dsp/assets/images/home-screen-map.png')}
      />
      <Card containerStyle={{
        position: 'relative',
        width: '100%',
        borderWidth: 0
      }}>
        <Card.Title style={{
          fontSize: 24,
          color: '#748A9D'
        }}>Featured Deals</Card.Title>
          <DealsButton
            title= 'Dairy'
            onPress={() => request(AWS_GRAPHQL_ENDPOINT, GET_DAIRY_PRODUCTS).then((data) => { 
              // Transpose returned object to new object
              // Step #1: Create new object
              let dairyProducts = [];
              // Step #2: Iterate through returned object to push each object in non-empty array into new object
              data.merchants.forEach((groupOfProducts) => {
                if (groupOfProducts.products.length > 0) {
                  groupOfProducts.products.forEach((product) => {
                    dairyProducts.push(product);
                  })
                }                  
              })
              console.log(dairyProducts);
              // Step #3: Assign new object to productData parameter
              navigation.navigate({
                name: "Products", params: {
                  productData: dairyProducts
                }
              })})}
          />
          <DealsButton
            title= 'Meat'
            onPress={() => request(AWS_GRAPHQL_ENDPOINT, GET_MEAT_PRODUCTS).then((data) => { 
              // Transpose returned object to new object
              // Step #1: Create new object
              let meatProducts = [];
              // Step #2: Iterate through returned object to push each object in non-empty array into new object
              data.merchants.forEach((groupOfProducts) => {
                if (groupOfProducts.products.length > 0) {
                  groupOfProducts.products.forEach((product) => {
                    meatProducts.push(product);
                  })
                }                  
              })
              console.log(meatProducts);
              // Step #3: Assign new object to productData parameter
              navigation.navigate({
                name: "Products", params: {
                  productData: meatProducts
                }
              })})}
          />
          <DealsButton
            title= 'Produce'
            onPress={() => request(AWS_GRAPHQL_ENDPOINT, GET_PRODUCE_PRODUCTS).then((data) => { 
              // Transpose returned object to new object
              // Step #1: Create new object
              let produceProducts = [];
              // Step #2: Iterate through returned object to push each object in non-empty array into new object
              data.merchants.forEach((groupOfProducts) => {
                if (groupOfProducts.products.length > 0) {
                  groupOfProducts.products.forEach((product) => {
                    produceProducts.push(product);
                  })
                }                  
              })
              console.log(produceProducts);
              // Step #3: Assign new object to productData parameter
              navigation.navigate({
                name: "Products", params: {
                  productData: produceProducts
                }
              })})}
          />
      </Card>
      <StatusBar style="auto" />
    </View>
  );
};

const RecipesScreen = ({navigation}) => {
  const [recipes,setRecipes] = useState();

  const [searchQuery,setSearchQuery] = useState('');

  const [numberOfRecipes, setnumberOfRecipes] = useState('1')

  const [loading,setLoading] = useState(false);

  const recipeApiId = 'f885fb0f';

  const recipeApiKey = 'e558efa4e564f8a2d9b77a23ede541c0';

  const recipeApiUrl = `https://api.edamam.com/search?q=${searchQuery}&app_id=${recipeApiId}&app_key=${recipeApiKey}&from=0&to=${numberOfRecipes}&calories=591-722&health=alcohol-free`;

  async function apiCall() {
    setLoading(true);
    let resp = await fetch(recipeApiUrl);
    let responseJson = await resp.json();
    setRecipes(responseJson.hits);
    setLoading(false);
    Keyboard.dismiss()
    setSearchQuery('')
  }

  useEffect(() => {
    setLoading(true)
    apiCall()
  },[])


  return (
    <View style={styles.container}>
      <Text style = {{fontSize:23,fontWeigth:'800',width:'90%',color:'#008080'}}>
        What Recipe Would You Like to Search
      </Text>

      <View style = {{display:'flex',flexDirection:'row',color:'black',fontWeight:'bold'}}>
        <TextInput placeholder ='Search Recipe...'
        style={styles.inputField}
        onChangeText = {text => setSearchQuery(text)}
        />

        <TextInput placeholder= 'Enter Number of Recipes'
            onChangeText = {text => setnumberOfRecipes(text)}
            style = {[styles.inputField, {width:'20%',fontSize:10,marginLeft:15,color:'black',fontWeight:'bold'}]}
            value ={numberOfRecipes}
            keyboardType = 'number-pad'
            />
      </View>

      <TouchableOpacity style = {styles.button}
      onPress ={apiCall}
      title = 'submit'>
          <Text style = {styles.buttonText}>Search</Text>
      </TouchableOpacity>
        
      <SafeAreaView style= {{flex:1}}>
        {loading ? 
          <ActivityIndicator size='large' color='#008080'/>:
          <FlatList style ={styles.recipe}
            data ={recipes}
            renderItem = {({item}) => (
              <View style = {styles.recipe}>
                <Image style ={styles.image}
                source={{uri:`${item.recipe.image}`}}
                />
                <View style ={{padding:20,flexDirection:'row'}}>
                  <Text style={styles.label}>{item.recipe.label}</Text>
                  <TouchableOpacity onPress={() => {navigation.navigate('RDetails',{recipe:item.recipe})}}> 
                    <Text style={{marginLeft:50,fontSize:20,color:'#008080'}}>
                      Details
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
            keyExtractor={(item,index) => index.toString()}
          />
        }
          
        </SafeAreaView>

      <StatusBar style="auto" />
    </View>
  );
};

const RecipeDetails = ({route}) => {
  
  const {recipe} = route?.params;
  
  return (
    <ScrollView>
      <View style={styles.rDetails}>
        <View style={styles.recipeItem}>
          <Text style ={{fontSize:22,color:'#008080',fontWeight:'800'}}>
            Ingredients:
          </Text>
          <Text style ={styles.ingredients}>{`${recipe.ingredients.map((item) => item['food'] ) } `}</Text>

        </View>

        <View style={styles.recipeItem}>
          <Text style ={{fontSize:22,color: '#008080',fontWeight:'800'}}>
            Food Category:
          </Text>
          <Text style = {styles.ingredients}>{`${recipe.ingredients.map((item) => item['foodCategory'] ) } `}</Text>
        </View>

        <View style={styles.recipeItem}>
          <Text style ={{fontSize:22,color: '#008080',fontWeight:'800'}}>
            Calories:
          </Text>
          <Text style = {styles.ingredients}>{`${recipe.calories } `}</Text>
        </View>

        <View style={styles.recipeItem}>
          <Text style ={{fontSize:22,color: '#008080',fontWeight:'800'}}>
            Label:
          </Text>
          <Text style = {styles.ingredients}>{`${recipe.label } `}</Text>
        </View>

        <View style={styles.recipeItem}>
          <Text style ={{fontSize:22,color: '#008080',fontWeight:'800'}}>
            Meal Type:
          </Text>
          <Text style = {styles.ingredients}>{`${recipe.mealType } `}</Text>
        </View>

        <View style={styles.recipeItem}>
          <Text style ={{fontSize:22,color: '#008080',fontWeight:'800'}}>
            Description:
          </Text>
          <Text style = {styles.ingredients}>{`${recipe.ingredientLines } `}</Text>
        </View>

        <View style={styles.recipeItem}>
          <Text style ={{fontSize:22,color: '#008080',fontWeight:'800'}}>
            Diet Label:
          </Text>
          <Text style = {styles.ingredients}>{`${recipe.dietLabels } `}</Text>
        </View>

        <View style={styles.recipeItem}>
          <Text style ={{fontSize:22,color: '#008080',fontWeight:'800'}}>
            Cuisine Type:
          </Text>
          <Text style = {styles.ingredients}>{`${recipe.cuisineType } `}</Text>
        </View>

      </View>
    </ScrollView>
  );
};

const ComparePricesScreen = () => {
  return (
    <View style={styles.container}>
      <Image
          style={{
            width: '100%',
            height: '100%'
          }}
          resizeMode="contain"
          source={ require('./assets/dsp/assets/images/compare-prices.png')}
        />
      <StatusBar style="auto" />
    </View>
  );
};

const ShoppingListScreen = () => {
  return (
      <View style={styles.container}>
        <Image
          style={{
            width: '100%'
          }}
          resizeMode="contain"
          source={ require('./assets/dsp/assets/images/shopping-list2.png')}
        />
      <StatusBar style="auto" />
    </View>
  );
};

const SettingsScreen = () => {
  return (
    <View style={styles.container}>
      <Text>Settings Screen</Text>
      <StatusBar style="auto" />
    </View>
  );
};

const Stack = createNativeStackNavigator();

const Tab = createBottomTabNavigator();

const ScreenStack = () => {
  return (
    <Stack.Navigator
        initialRouteName='Welcome'
        screenOptions={{
          headerStyle: {
            backgroundColor: 'white'
          },
          headerTintColor: 'black',
          headerTitleStyle: {
            fontWeight: 'bold'
          }
      }}>
      <Stack.Screen name="Welcome" component={HomeScreen}/>
      <Stack.Screen name="Login" component={LoginScreen} options={{headerShown: false}}/>
      <Stack.Screen name="Products" component={ProductsScreen}/>
      <Stack.Screen name="Recipes" component={RecipesScreen}/>
      <Stack.Screen name="RDetails" component={RecipeDetails}/>
    </Stack.Navigator>
  )
}

const App = () => {
  return (
      <NavigationContainer>
        <Tab.Navigator
    screenOptions={{
      tabBarLabelPosition: "below-icon"
    }}>
        <Tab.Screen 
          name="Home"
          options={{
            tabBarLabel: "Home",
            tabBarAccessibilityLabel: "Home Screen",
            headerShown: false,
            tabBarIcon: () => (
              <Image
                style={{
                  position: 'relative',
                  maxHeight: 20, 
                  maxWidth: 20 
                }}
                resizeMode="contain"
                source={ require('./assets/dsp/assets/images/menu-bottom-home-icon.png')}
              />
            )
          }}
          component={ScreenStack} />
        <Tab.Screen 
          name="Recipes" 
          options={{
            tabBarLabel: "Recipes",
            tabBarAccessibilityLabel: "Recipes Screen",
            headerShown: false,
            tabBarIcon: () => (
              <Image
                style={{
                  position: 'relative',
                  maxHeight: 20, 
                  maxWidth: 20 
                }}
                resizeMode="contain"
                source={ require('./assets/dsp/assets/images/menu-bottom-recipes-icon.png')}
              />
            )
          }}
          component={RecipesScreen} />
        <Tab.Screen 
          name="ComparePrices"
          options={{
            tabBarLabel: "Compare Prices",
            tabBarAccessibilityLabel: "Compare Prices Screen",
            headerShown: false,
            tabBarIcon: () => (
              <Image
                style={{
                  position: 'relative',
                  maxHeight: 32, 
                  maxWidth: 32 
                }}
                resizeMode="contain"
                source={ require('./assets/dsp/assets/images/compare-button.png')}
              />
            )
          }} 
          component={ComparePricesScreen} />
        <Tab.Screen 
          name="ShoppingList" 
          options={{
            tabBarLabel: "Shopping List",
            tabBarAccessibilityLabel: "Shopping List Screen",
            headerShown: false,
            tabBarIcon: () => (
              <ImageBackground
                style={{
                  position: 'relative',
                  maxHeight: 20, 
                  maxWidth: 20 
                }}
                resizeMode="contain"
                source={ require('./assets/dsp/assets/images/menu-bottom-shopping-cart-icon.png')}
              >
                <Badge
                  value={5}
                  containerStyle={{
                    position: 'relative',
                    top: 10,
                    left: 10
                  }}
                  badgeStyle={{
                    backgroundColor: '#25BEE8'
                  }}
                  textStyle={{
                    color: '#fff'
                  }}
                />
              </ImageBackground>
              
            )
          }} 
          component={ShoppingListScreen} />
      <Tab.Screen 
        name="Settings"
        options={{
          tabBarLabel: "Settings",
          tabBarAccessibilityLabel: "Settings Screen",
          headerShown: false,
          tabBarIcon: () => (
            <Image
              style={{
                position: 'relative',
                maxHeight: 20, 
                maxWidth: 20 
              }}
              resizeMode="contain"
              source={ require('./assets/dsp/assets/images/menu-bottom-settings-icon.png')}
            />
          )
        }} 
        component={SettingsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}


const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  },
  actionButtonProducts: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    paddingHorizontal: 16,
    marginTop: 15,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: '#25BEE8',
    width: '100%',
    height: 30,
    borderRadius: 25
  },
  actionButtonProductsText: {
    fontSize: 12,
    lineHeight: 12,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: '#fff',
  },
  actionButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: '#25BEE8',
    width: '75%',
    height: 60,
    borderRadius: 25
  },
  actionButtonText: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: 'white',
  },
  container2: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
  },
  item: {
    width: '46%',
    borderWidth: 1,
    borderColor: '#DBE2ED',
    borderRadius: 10,
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 8,
  },
  productTitle: {
    fontSize: 12,
  },
  dealsButton: {
    position: 'relative',
    borderRadius: 10,
    maxWidth: '100%',
    maxHeight: 50,
    margin: 2
  },
  dealsButtonText: {
    position: 'absolute',
    top: 10,
    right: 20,
    color: '#fff',
    fontSize: 21,
    fontWeight: 'bold'
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  },
  groverLogo: {
    maxWidth: 250,
    maxHeight: 150
  },
  headerText: {
    color: '#25BEE8',
    fontSize: 24,
    textAlign: 'center'
  },
  textInput: {
    margin: 8,
    padding: 10,
    backgroundColor: '#DBE2ED',
    width: '75%',
    height: 60,
    borderRadius: 10
  },
  textLink: {
    color: '#748A9D',
    textAlign: 'center'
  },
  textLinkStrong: {
    fontWeight: 'bold',
    color: '#748A9D',
    textAlign: 'center',
    textTransform: 'uppercase'
  },
  textInputStyle:{
    height:60,
    width: '95%',
    borderWidth:1,
    paddingLeft:20,
    margin:5,
    borderColor: 'blue',
    backgroundColor:'white'
  },
  inputField:{
    height:'120%',
    width:'65%',
    backgroundColor:'#008080',
    borderRadius:20,
    marginTop: 10,
    paddingLeft:15
  },
  buttons:{
    flexDirection:'row'
  },
  button:{
    backgroundColor:'green',
    width:'90%',
    alignItems:'center',
    margin:15,
    height:35,
    borderRadius:15,
    justifyContentContent:'center',
    marginTop:25
  },
  buttonText:{
    color:'white',
    fontSize:20,
    fontWeight:'bold'
  },
  image:{
    width:'100%',
    height:200,
    borderRadius:20
  },
  label:{
    fontSize:15,
    width:'60%',
    color:'#008080',
    fontWeight:'700'

  },
  recipe:{
    shadowColor:'black',
    shadowOpacity:0.26,
    shadowOffset:{width:0,height:2},
    shadowRadius:8,
    elevation:5,
    borderRadius:20,
    backgroundColor:'white',
    margin:10,
    marginBottom:40
  },
  rDetails: {
    marginBottom:30,
    padding:5
  },
  ingredients: {
    fontSize:20,
    color: '#008080'
  },
  recipeItem:{
    shadowColor:'black',
    shadowOpacity:0.26,
    shadowOffset:{width:0,height:2},
    shadowRadius:8,
    elevation:10,
    borderRadius:2,
    backgroundColor:'white',
    margin:10,
    flexDirection: 'row',
    flexWrap: 'wrap'
  }
});

export default App;
