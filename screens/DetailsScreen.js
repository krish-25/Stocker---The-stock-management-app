import React, {useState} from 'react'
import { StyleSheet, View, Alert } from 'react-native'
import { Card, Text, Input, Button } from 'react-native-elements'
import tw from 'tailwind-react-native-classnames'
import Wrapper from '../components/Wrapper'

const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
  }

const DetailsScreen = ({route, navigation}) => {
    const [x, setX] = useState();
    const {itemtype, opt, length, quantity} = route.params;
    const item = itemtype.item;
    const option = opt.option;
    const [data, setData] = useState(quantity);
    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        setX('');
        fetch(`https://ganpati-foils.herokuapp.com/quantity/${item}/${option}/${length}`,{
            method: 'GET'
        })
        .then(res => res.json())
        .then(data => setData(data))
        .catch(error => console.error(error));
        wait(2000).then(() => setRefreshing(false));
    }, []);

    function addStock(x){
            fetch(`https://ganpati-foils.herokuapp.com/add-stock`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    otype: {item},
                    option: {option},
                    length: {length},
                    quantity: {quantity},
                    x: {x}
                })
            }).then(data => {
                if(!data.ok){
                    throw Error(data.status);
                }
            }).catch(e=> {
                console.log(e);
            })
            setX('');
    }

    function subStock(e){
        e.preventDefault();
        fetch(`https://ganpati-foils.herokuapp.com/sub-stock`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                otype: {item},
                option: {option},
                length: {length},
                quantity: {quantity},
                x: {x}
            })
        }).then(data => {
            if(!data.ok){
                throw Error(data.status);
            }
        }).catch(e=> {
            console.log(e);
        })
        setX('');
    }
    
    

    return (
        <Wrapper refreshFunction = {onRefresh}>
        <View>
            <Card>
                <Card.Title style={tw`text-xl`}>Availability of {length}<Text style={tw`uppercase font-bold`}> {option}</Text></Card.Title>
                <Card.Divider /> 
                <Text style={tw`text-center`} h1>{data}</Text>
                <View style={tw`flex justify-between bg-gray-100 p-4 mt-2`}>
                    <Input
                    onChangeText = {(val) => setX(val)}
                    value = {x}
                    keyboardType ='numeric'
                    placeholder='No of Units'
                    />
                    <View style = {tw`flex-row justify-between`}>
                    <View style={tw`w-2/5`}>
                    <Button 
                    onPress = {subStock}
                    onChangeText = {(val) => setX(val)}
                    title= "SOLD"
                    />
                    </View>
                    <View style={tw`w-2/5`}>
                    <Button 
                    onPress = {addStock}
                    title= "ADDED"
                    />
                    </View>
                    </View>
                    
                    </View>
            </Card>
        </View>
        </Wrapper>
    )
}

export default DetailsScreen

const styles = StyleSheet.create({})
