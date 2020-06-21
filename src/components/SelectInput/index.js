import React from "react";
import { Feather } from '@expo/vector-icons';
import { View, TextInput, Text, StyleSheet } from "react-native";
import RNPickerSelect from 'react-native-picker-select';

export default function Input({ label = "", ...props }) {
	return (
		<View>
			<Text style={styles.label}>{label}</Text>
			<RNPickerSelect
               onValueChange={(value) => console.log(value)}
               style={{
                  ...pickerSelectStyles,
                  iconContainer: {
                     top: 20,
                     right: 20,
                  },
               }}
               useNativeAndroidPickerStyle={false}
               Icon={() => {
                  return <Feather name="chevron-down" size={24} color="#AD00FF" />;
               }}
               items={[
                  { label: 'Football', value: 'football' },
                  { label: 'Baseball', value: 'baseball' },
                  { label: 'Hockey', value: 'hockey' },
               ]}
               {...props}
            />
		</View>
	);
}

const styles = StyleSheet.create({
	label: {
		color: "#6C6C80",
		fontSize: 14,
		marginTop: 14,
		marginBottom: 8,
	},
});

const pickerSelectStyles = StyleSheet.create({
   inputIOS: {
      height: 64,
      fontSize: 16,
      paddingVertical: 12,
      paddingHorizontal: 10,
      borderWidth: 1,
      borderColor: 'gray',
      borderRadius: 10,
      color: 'black',
      paddingRight: 30, // to ensure the text is never behind the icon
   },
   inputAndroid: {
      height: 64,
      backgroundColor: '#FFF',
      fontSize: 16,
      marginBottom: 8,
		paddingHorizontal: 24,
      borderColor: 'purple',
      borderRadius: 20,
      color: 'black',
      paddingRight: 30, // to ensure the text is never behind the icon
   },
});