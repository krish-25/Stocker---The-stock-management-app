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

// sumeet sahni

const HomeScreen = ({navigation}) => {
    const [data, setData] = useState([]);
    const [view, setView] = useState(true);
    const [item, setItem] = useState('');

    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        setItem('');
        closeView();
        fetch(`http://10.0.2.2:5000/items`,{
            method: 'GET'
        })
        .then(res => res.json())
        .then(data => setData(data))
        .catch(error => console.error(error));
        wait(2000).then(() => setRefreshing(false));
    }, []);

    useEffect(() => {
        fetch(`http://10.0.2.2:5000/items`,{
            method: 'GET'
        })
        .then(res => res.json())
        .then(data => setData(data))
        .catch(error => console.error(error));
      }, []);

    function addItem(e){
        e.preventDefault();
        fetch(`http://10.0.2.2:5000/add-item`, {
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

    // function removeItem(e){
    //     e.preventDefault();
    //     fetch(`http://10.0.2.2:5000/items`,{
    //         method: 'GET'
    //     })
    //     .then(res => res.json())
    //     .then(data => setData(data))
    //     .catch(error => console.error(error));
    // }

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
        <View>
            <View style={tw`bg-gray-300`}> 
                <View style={tw`flex-row justify-center mt-1`}>
                    <Icon  raised
                    onPress={ handleView }
                    name="plus"
                    color="orange"
                    type="antdesign"
                    />
                    <Text style={tw`pt-5 font-bold text-base text-gray-600 text-center`}>
                        Click to add more items.
                    </Text>
                </View>
                <View style={tw.style(`mb-2`,view && `hidden`)}>
                    <Card>
                        <View style={tw`flex-row justify-between px-5`}>
                            <Text>ADD ITEMS</Text>
                            <Icon
                            onPress={closeView}
                            name="close"
                            color="red"
                            type="antdesign"
                            />
                        </View>
                        <View style={tw`px-5`}>
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
                            <Text style={tw`font-bold text-2xl p-2 rounded-lg`} key={key}>{item}</Text>
                            <Card.Divider />
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
                            <Icon
                            // onPress= {removeItem}
                            name="delete"
                            color="red"
                            type="antdesign"
                            />
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
