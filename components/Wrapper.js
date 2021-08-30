import React from 'react'
import { StyleSheet, Text, View, RefreshControl, KeyboardAvoidingView, ScrollView, TouchableWithoutFeedback, Keyboard } from 'react-native'

const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
  }

const Wrapper = (props) => {
    const [refreshing, setRefreshing] = React.useState(false);

    

    return (
        <KeyboardAvoidingView>
            <ScrollView
             contentContainerStyle={styles.scrollView}
             refreshControl={
               <RefreshControl
                 refreshing={refreshing}
                 onRefresh={props.refreshFunction}
               />
             }
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    {props.children}
                </TouchableWithoutFeedback>
            </ScrollView>
        </KeyboardAvoidingView>
    )
}

export default Wrapper

const styles = StyleSheet.create({})
