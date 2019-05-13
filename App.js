import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Alert,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';

export default class App extends React.Component {
  state = {
    value: "0",
    sourceCurrency: "USD",
    convertionTable: {
      "EUR": 0.0128668665,
      "USD": 0.0144559245,
    }
  }

  ChangeHandler = (e) => {
    this.setState({ value: e.nativeEvent.text })
  }
  onFocus = () => this.setState({ value: "" })
  componentWillMount = async () => {
    const res = await fetch("https://api.exchangeratesapi.io/latest?base=INR")
    const json = await res.json()
    this.setState({
      convertionTable: json.rates
    })
  }

  render() {
    const { value, convertionTable, sourceCurrency } = this.state
    var inr = 0.0
    if (value !== "") inr = parseFloat(value) / convertionTable[sourceCurrency]
    inr = inr.toFixed(2)
    const usdStyle = { backgroundColor: (sourceCurrency === "USD") ? "#4A90E2" : "#D5D5D6" }
    const eurStyle = { backgroundColor: (sourceCurrency === "EUR") ? "#4A90E2" : "#D5D5D6" }
    return (
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View style={styles.container}>
          {/* Currency Changer */}
          <View style={styles.btnWrapper}>
            <TouchableOpacity
              onPress={() => this.setState({ sourceCurrency: "USD" })}
              style={[styles.btnLeft, usdStyle]}>
              <Text style={styles.btnText}>$</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => this.setState({ sourceCurrency: "EUR" })}
              style={[styles.btnRight, eurStyle]}>
              <Text style={styles.btnText}>€</Text>
            </TouchableOpacity>
          </View>
          {/* Controls */}
          <View style={{ marginTop: 20 }}>
            <CurrencyInput onFocus={this.onFocus} onChange={this.ChangeHandler} value={value} currency="USD" />
            <Currency value={inr} currency="INR" />
            <View style={{ flex: 1 }}></View>
          </View>
        </View >
      </TouchableWithoutFeedback>
    );
  }
}

function Currency(props) {
  return (
    <View style={{ flex: 1, marginTop: 30, alignItems: "center", justifyContent: "center" }}>
      <Text style={styles.currency_value}>{props.value}</Text>
      <Text style={styles.currency_label}>{props.currency}</Text>
    </View>
  )
}

function CurrencyInput(props) {
  return (
    <View onFocus={props.onFocus} style={{ flex: 1, marginTop: 30, alignItems: "center", justifyContent: "center" }}>
      <TextInput onChange={props.onChange} style={styles.currency_textinput} keyboardType="number-pad" value={props.value} />
      <Text style={styles.currency_label}>{props.currency}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginTop: 150,
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  btnLeft: {
    borderTopLeftRadius: 15,
    borderBottomLeftRadius: 15,
    paddingVertical: 10,
    paddingHorizontal: 45,
  },
  btnRight: {
    borderTopRightRadius: 15,
    borderBottomRightRadius: 15,
    paddingVertical: 10,
    paddingHorizontal: 45,
  },
  btnText: {
    color: "#FFFFFF",
    fontWeight: 'bold',
    fontSize: 25,
  },
  currency_label: {
    color: "#c1c1c1",
    fontSize: 20,
  },
  currency_value: {
    fontSize: 70,
  },
  currency_textinput: {
    fontSize: 70,
  }
});
