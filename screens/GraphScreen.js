import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { StackedBarChart } from 'react-native-svg-charts'

const GraphScreen = () => {
    // useEffect(() => {
    //     fetch(`https://ganpati-foils.herokuapp.com/graphdata`,{
    //         method: 'GET'
    //     })
    //     .then(res => res.json())
    //     .then(data => setData(data))
    //     .catch(error => console.error(error));
    //   }, []);


    const data = [
        {
            item: new Date(2015, 0, 1),
            apples: 3840,
            bananas: 1920,
        },
        {
            item: new Date(2015, 1, 1),
            apples: 1600,
            bananas: 1440,
        },
        {
            item: new Date(2015, 2, 1),
            apples: 640,
            bananas: 960,
        },
        {
            item: new Date(2015, 3, 1),
            apples: 3320,
            bananas: 480,
        },
    ]

    const colors = ['#7b4173', '#a55194']
    const keys = ['apples', 'bananas']

    return (
        <View>
            <Text>this is graph screen</Text>
            <StackedBarChart
                style={{ height: 200 }}
                keys={keys}
                colors={colors}
                data={data}
                showGrid={false}
                contentInset={{ top: 30, bottom: 30 }}
            />
        </View>
    )
}

export default GraphScreen

const styles = StyleSheet.create({})
