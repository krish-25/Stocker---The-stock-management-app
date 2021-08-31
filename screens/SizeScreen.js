import React, {useState, useEffect} from 'react'
import { StyleSheet, Text, View, Alert } from 'react-native'
import { Card, Button, Input, Icon } from 'react-native-elements'
import tw from 'tailwind-react-native-classnames'
import Wrapper from '../components/Wrapper'

const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
  }

const SizeScreen = ({route, navigation}) => {
    const [data, setData] = useState([]);
    const [view, setView] = useState(true);
    const [len, setLen] = useState();
    const [quant, setQuant] = useState();

    const [refreshing, setRefreshing] = useState(false);

    const {itemtype, opt} = route.params;
    const item = itemtype.item;
    const option = opt;

    useEffect(() => {
        navigation.addListener('focus', async () => {
            fetch(`https://ganpati-foils.herokuapp.com/lengths/${item}/${option}`,{
            method: 'GET'
        })
            .then(res => res.json())
            .then(data => setData(data))
            .catch(error => console.error(error));
        })
    })

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        setLen('');
        setQuant('');
        closeView();
        fetch(`https://ganpati-foils.herokuapp.com/lengths/${item}/${option}`,{
            method: 'GET'
        })
        .then(res => res.json())
        .then(data => setData(data))
        .catch(error => console.error(error));
        wait(2000).then(() => setRefreshing(false));
    }, []);

    useEffect(() => {
        fetch(`https://ganpati-foils.herokuapp.com/lengths/${item}/${option}`,{
            method: 'GET'
        })
        .then(res => res.json())
        .then(data => setData(data))
        .catch(error => console.error(error));
      }, []);

    function handleView(){
        if(view === true){
            setView(false)
        }
        if(view === false){
            setView(true)
        }
    }

    function closeView(){
        setView(true)
    }

    function addItem(){
        if(!isNaN(len) || !isNaN(quant)){
            fetch(`https://ganpati-foils.herokuapp.com/add-length`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                otype: {item},
                length: {len},
                quantity: {quant},
                option: {option}
            })
            }).then(data => {
                if(!data.ok){
                    throw Error(data.status);
                }
            }).catch(e=> {
                console.log(e);
            });
            setLen('');
            setQuant('');
            closeView();
        }else{
            Alert.alert('OOPS!', 'Length and Quantity must be over 1 characters long', [
                {text: 'OK', onPress: () => console.log('alert closed')}
            ]);
        }
        
    }


    return (
        <Wrapper refreshFunction = {onRefresh}>
        <View style={styles.fl}>
            <View style={tw`bg-gray-300 px-5`}>
                <View style={tw`flex-row items-center justify-between`}>
                    <Text style={tw`text-gray-600 text-lg`}>Length</Text>
                    <Text style={tw`text-gray-600 text-lg`}>Quantity</Text>
                    <View style={tw``}>
                        <Icon raised          
                        onPress={ handleView }
                        name="plus"
                        color="orange"
                        type="antdesign"
                        />
                    </View>
                </View>
                <View style={tw.style(`mb-1`,view && `hidden`)}>
                <Card>
                    <View style={tw`flex-row justify-between px-5`}>
                        <Text>ADD ITEM</Text>
                        <Icon
                        onPress={closeView}
                        name="close"
                        color="red"
                        type="antdesign"
                        />
                    </View>
                    <View>
                        <View style={tw`px-5`}>
                            <Input 
                            onChangeText = {(val) => setLen(val)}
                            value = {len}
                            placeholder="Length" />
                            <Input 
                            onChangeText = {(val) => setQuant(val)}
                            value = {quant}
                            placeholder="Quantity" />
                            <Button 
                            onPress= {addItem}
                            title="ADD" />
                        </View>
                    </View>
                    
                </Card>
            </View>
            </View>
            {
                data.map((i,key) => (
                    <Card>
                        <View>
                            <View style={tw`flex-row justify-between items-center`}>
                                <View style={tw`flex`}>
                                    {/* <Text>Length</Text> */}
                                    <Text style={tw`text-xl text-pink-800`} key="key">{i.length}</Text>
                                </View>
                                <View style={tw`flex`}>
                                    {/* <Text>Quantity</Text> */}
                                    <Text style={tw`text-xl`} key="key">{i.quantity}</Text>
                                </View>
                                
                                <Button
                                buttonStyle = {
                                    {
                                        backgroundColor: "green",
                                        paddingHorizontal: 20
                                    }
                                }
                                title="Edit" 
                                onPress = {
                                    () => navigation.navigate('Details', {
                                        itemtype: {item},
                                        opt: {option},
                                        length: i.length,
                                        quantity: i.quantity
                                    })
                                }
                                />
                                {/* <Icon
                                name="delete"
                                color="red"
                                type="antdesign"
                                /> */}
                            </View>
                        </View>
                        
                        
                    </Card>
                ))
            }
    
        </View>
        </Wrapper>
    )
}

export default SizeScreen

const styles = StyleSheet.create({
    fl:{
        flex:1
    },
    fll:{
        flex:2
    }
})
