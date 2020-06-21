import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { RectButton } from "react-native-gesture-handler";

export default function Button({
	icon,
	children = "",
	backgroundColor = "#FFFFFF",
	color = "#333333",
	justify = "left",
	fontSize = 18,
	...props
}) {
	return (
		<RectButton {...props} style={[styles.wrapper, { backgroundColor }]}>
			{icon && <View style={styles.icon}>{icon}</View>}
			<Text
				style={[
					styles.text,
					{ color, fontSize, textAlign: justify },
					icon && { marginRight: 74 },
				]}
			>
				{children}
			</Text>
		</RectButton>
	);
}

const styles = StyleSheet.create({
	wrapper: {
		flexDirection: "row",
		height: 64,
		borderRadius: 20,
		overflow: "hidden",
		alignItems: "center",
		marginTop: 8,
	},
	icon: {
		height: 48,
		width: 48,
		marginHorizontal: 14,
		justifyContent: "center",
		alignItems: "center",
	},
	text: {
		flex: 1,
		fontWeight: "bold",
	},
});