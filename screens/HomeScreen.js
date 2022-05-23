import React, {useEffect, useState} from 'react'
import { 
    StyleSheet, 
    Text, 
    View, 
    Alert
 } from 'react-native'
import { Card, Button, Icon, Input } from 'react-native-elements'
import tw from 'tailwind-react-native-classnames'
import Wrapper from '../components/Wrapper'

const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
  }


const HomeScreen = ({navigation}) => {
    const [data, setData] = useState([]);
    const [view, setView] = useState(true);
    const [item, setItem] = useState('');

    const [refreshing, setRefreshing] = useState(false);


    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        setItem('');
        closeView();
        fetch(`https://ganpati-foils.herokuapp.com/items`,{
            method: 'GET'
        })
        .then(res => res.json())
        .then(data => setData(data))
        .catch(error => console.error(error));
        wait(2000).then(() => setRefreshing(false));
    }, []);

    useEffect(() => {
        fetch(`https://ganpati-foils.herokuapp.com/items`,{
            method: 'GET'
        })
        .then(res => res.json())
        .then(data => setData(data))
        .catch(error => console.error(error));
      }, []);

    function addItem(){
            fetch(`https://ganpati-foils.herokuapp.com/add-item`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                otype: {item}
            })
            }).then(data => {
                if(!data.ok){
                    throw Error(data.status);
                }
            }).catch(e=> {
                console.log(e);
            })
            setItem('')
            closeView();
    }


    function handleView(){
        if(view === true ){
            setView(false)
        }
        if(view === false ){
            setView(true)
        } 
    }

    function closeView(){
        setView(true)
    }
    

    return (
        <Wrapper refreshFunction = {onRefresh}>
        <View style={tw`mb-3`}>
            <View style={tw`flex`}> 
                <View style={tw`flex-row mt-1 justify-center items-center`}>
                    <Icon  raised
                    onPress={ handleView }
                    name="plus"
                    color="orange"
                    type="antdesign"
                    />
                </View>
                <View style={tw.style(`mb-1`,view && `hidden`)}>
                    <Card>
                        <View style={tw`flex-row justify-between`}>
                            <Text>ADD ITEM</Text>
                            <Icon
                            onPress={closeView}
                            name="close"
                            color="red"
                            type="antdesign"
                            />
                        </View>
                        <View style={tw``}>
                            <Input 
                            onChangeText={(val) => setItem(val)}
                            value ={item}
                            placeholder="Item Name" />
                            <Button title="ADD" 
                            onPress={addItem}
                            />
                        </View>
                    </Card>
                </View>
            </View>
            {
                data.map((item,key) => (
                    <Card>
                        <View style={tw`flex-row justify-between items-center`}>
                            <Text style={tw`text-2xl text-green-700 p-2 rounded-lg`} key={key}>{item}</Text>
                            <Card.Divider />
                            <View style={tw`flex-row`}>
                            <Button
                            title="DSO"
                            type="outline"
                            buttonStyle={
                                {
                                    paddingHorizontal: 20
                                }
                            }
                            onPress={
                                () => navigation.navigate('Size',{
                                    itemtype: {item},
                                    opt: "dso"
                                })
                            }
                            />
                            <Button 
                            title="BSO"
                            buttonStyle={
                                {
                                    paddingHorizontal: 20
                                }
                            }
                            onPress={
                                () => navigation.navigate('Size',{
                                    itemtype: {item},
                                    opt: "bso"
                                })
                            }
                            />
                            </View>
                        </View>
                    </Card>
                ))
            }
        </View>
        </Wrapper>
    )
}

export default HomeScreen

const styles = StyleSheet.create({
    buttons: {
        flexDirection: 'row'
    }
})
