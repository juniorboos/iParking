import React from 'react';
import { View, Image, StyleSheet } from 'react-native';

export default function AppBar({ color = "#FF0077", renderLeft, renderCenter, renderRight }) {
  return (
    <View style={classes.wrapper}>
      <View style={classes.side}>
        {renderLeft}
      </View>
      <View style={classes.center}>
        {renderCenter}
      </View>
      <View style={classes.side}>
        {renderRight}
      </View>
    </View>
  );
}


const classes = StyleSheet.create({
  wrapper: {
    width: "100%",
    height: 52,
    flexDirection: 'row',
    alignContent: 'center',
    justifyContent: "space-between"
  },
  title: {
    flex: 1,
    fontSize: 32,
    fontWeight: "bold",
    textTransform: "uppercase",
    textAlign: "center",
  },
  center: {
    alignContent: 'center',
    justifyContent: "center",
  },
  side: {
    width: 42,
    height: 52,
    alignItems: "flex-start",
    justifyContent: "center"
  }
});