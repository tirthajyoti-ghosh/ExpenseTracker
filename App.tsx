import React, {useEffect, useState} from 'react';
import {ActivityIndicator, FlatList, PermissionsAndroid, Text, View} from 'react-native';
import SmsAndroid from 'react-native-get-sms-android';

const App = () => {
  const [granted, setGranted] = useState(false);
  const [count, setCount] = useState(0); //count of sms
  const [loader, setLoader] = useState(true); //loader
  const [smsList, setSmsList] = useState([]);

  useEffect(() => {
    const requestSMSPermission = async () => {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_SMS,
          {
            title: 'SMS Permission',
            message: 'This app needs access to your SMS messages.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          setGranted(true);
        } else {
          setGranted(false);
        }
      } catch (err) {
        console.warn(err);
      }
    };

    requestSMSPermission();
  }, []);

  useEffect(() => {
    if (granted) {
      const filter = {
        // bodyRegex:"" //regex
        //body:"selam",
        //adress:"+905545455"
        //minDate: 123213213,
        //maxDate:12312321321
        // read: 1,
        indexFrom: 0,
      };
      SmsAndroid.list(
        JSON.stringify(filter),
        fail => {
          console.log('fail', fail);
        },
        (count, smsList) => {
          setCount(count);
          setSmsList(JSON.parse(smsList));
        },
      );
      setLoader(false);
    }
  }, [granted]);

  if (loader) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          padding: 20,
        }}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
      }}>
      <Text>Bare React Native Sms</Text>
      <FlatList
        data={smsList}
        renderItem={({item}) => (
          <View
            style={{
              backgroundColor: '#fff',
              padding: 10,
              marginVertical: 5,
              borderRadius: 5,
            }}>
            <Text style={{color: 'black', marginBottom: 5}}>
              Body: {item.body}
            </Text>
            <Text style={{color: 'black', marginBottom: 5}}>
              Address: {item.address}
            </Text>
            <Text style={{color: 'black', marginBottom: 5}}>
              Date:{' '}
              {new Date(parseInt(item.date)).toLocaleDateString() +
                ' ' +
                new Date(parseInt(item.date)).toLocaleTimeString()}
            </Text>
            <Text style={{color: 'black', marginBottom: 5}}>
              Read: {item.read}
            </Text>
          </View>
        )}
        keyExtractor={item => item._id}
      />
    </View>
  );
};

export default App;
