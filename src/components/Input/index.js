import React from "react";
import { View, TextInput, Text, StyleSheet } from "react-native";

export default function Input({ label = "", ...props }) {
	return (
		<View style={styles.container}>
			<Text style={styles.label}>{label}</Text>
			<TextInput style={styles.input} autoCompleteType="off" {...props} />
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		width: '100%'
	},
	label: {
		color: "#6C6C80",
		fontSize: 14,
		marginTop: 14,
		marginBottom: 8,
	},
	input: {
		height: 64,
		width: '100%',
		backgroundColor: "#FFF",
		// borderWidth: 1, 
		// borderColor: '#000',
		borderRadius: 20,
		// marginBottom: 8,
		paddingHorizontal: 20,
		fontSize: 16,
	},
});