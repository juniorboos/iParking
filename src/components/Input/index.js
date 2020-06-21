import React from "react";
import { View, TextInput, Text, StyleSheet } from "react-native";

export default function Input({ label = "", ...props }) {
	return (
		<View>
			<Text style={styles.label}>{label}</Text>
			<TextInput style={styles.input} autoCompleteType="off" {...props} />
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
	input: {
		height: 64,
		backgroundColor: "#FFF",
		borderRadius: 20,
		marginBottom: 8,
		paddingHorizontal: 40,
		fontSize: 16,
	},
});