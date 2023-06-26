import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, Modal } from 'react-native';
import Slider from '@react-native-community/slider';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';

const App = () => {
  const [amount, setAmount] = useState(0);
  const [fund, setFund] = useState('Grayscale Bitcoin Trust');
  const [frequency, setFrequency] = useState('Weekly');
  const [modalVisible, setModalVisible] = useState(false);

  const [results, setResults] = useState(null);
  const [poolDetails, setPoolDetails] = useState(null);
  const [allPools, setAllPools] = useState([]);
  const [investmentDuration, setInvestmentDuration] = useState(1);

  // Function to handle the calculation and update the results
  const calculateResults = () => {
    const investedAmount = amount;
    let finalAmount = investedAmount;
    let percentageChange = 0;
  
    if (frequency === 'Weekly' && poolDetails && typeof poolDetails.weeklyOptions === 'number') {
      const weeklyInterestRate = poolDetails.weeklyOptions;
      finalAmount = investedAmount * (1 + weeklyInterestRate);
      percentageChange = ((finalAmount - investedAmount) / investedAmount) * 100;
    } else if (frequency === 'Monthly' && poolDetails && typeof poolDetails.monthlyOptions === 'number') {
      const monthlyInterestRate = poolDetails.monthlyOptions;
      finalAmount = investedAmount * Math.pow(1 + monthlyInterestRate, investmentDuration);
      percentageChange = ((finalAmount - investedAmount) / investedAmount) * 100;
    } else if (frequency === 'Yearly' && poolDetails && typeof poolDetails.yearlyOptions === 'number') {
      const yearlyInterestRate = poolDetails.yearlyOptions;
      finalAmount = investedAmount * Math.pow(1 + yearlyInterestRate, investmentDuration);
      percentageChange = ((finalAmount - investedAmount) / investedAmount) * 100;
    }
  
    setResults({ investedAmount, finalAmount, percentageChange });
  };
  
  // Function to fetch pool details
  const fetchPoolDetails = async () => {
    try {
      const response = await axios.get(
        'https://dev-testnet.nordl.io/api/product/calculator-details/11'
      );
      setPoolDetails(response.data.data);
    } catch (error) {
      console.error('Error fetching pool details:', error);
    }
  };

  // Function to fetch all pools
  const fetchAllPools = async () => {
    try {
      const response = await axios.get('https://dev-testnet.nordl.io/api/product/all-pools');
      setAllPools(response.data);
    } catch (error) {
      console.error('Error fetching all pools:', error);
    }
  };

  useEffect(() => {
    fetchPoolDetails();
    fetchAllPools();
  }, []);

  return (
    <View style={styles.container}>
  <View style={styles.box}>
    <Text style={styles.heading}>Investment Calculator</Text>

    <View style={styles.inputContainer}>
  <Text style={styles.label}>Investment Amount: {amount === 0 ? '0' : `${amount / 1000}k`}</Text>
  <Slider
    style={styles.slider}
    value={amount}
    minimumValue={0}
    maximumValue={20000}
    step={100}
    minimumTrackTintColor="#2196F3"
    maximumTrackTintColor="#9E9E9E"
    thumbTintColor="#2196F3"
    onValueChange={setAmount}
  />
</View>

    <View style={styles.fundContainer}>
      <Text style={styles.label}>Fund</Text>
      <Picker
        selectedValue={fund}
        onValueChange={(value) => setFund(value)}
        style={styles.picker}
      >
        <Picker.Item label="Grayscale Bitcoin Trust" value="Grayscale Bitcoin Trust" />
        <Picker.Item label="Option 1" value="Option 1" />
        <Picker.Item label="Option 2" value="Option 2" />
        <Picker.Item label="Option 3" value="Option 3" />
      </Picker>
    </View>

    <View style={styles.frequencyContainer}>
  <View style={styles.frequencyButtonContainer}>
  <Text style={styles.label}>Frequency</Text>
    <Button
      title="Weekly"
      onPress={() => setFrequency('Weekly')}
      color={frequency === 'Weekly' ? '#2196F3' : '#9E9E9E'}
      style={styles.circularButton}
    />
    <Button
      title="Monthly"
      onPress={() => setFrequency('Monthly')}
      color={frequency === 'Monthly' ? '#2196F3' : '#9E9E9E'}
      style={styles.circularButton}
    />
    <Button
      title="Yearly"
      onPress={() => setFrequency('Yearly')}
      color={frequency === 'Yearly' ? '#2196F3' : '#9E9E9E'}
      style={styles.circularButton}
    />
  </View>
</View>
    <View style={styles.durationContainer}>
      <Text style={styles.label}>Investment Duration: {investmentDuration} yrs</Text>
      <Slider
        style={styles.slider}
        value={investmentDuration}
        minimumValue={1}
        maximumValue={10}
        step={1}
        minimumTrackTintColor="#2196F3"
        maximumTrackTintColor="#9E9E9E"
        thumbTintColor="#2196F3"
        onValueChange={setInvestmentDuration}
      />
    </View>

    <Button title="Calculate" onPress={() => { calculateResults(); setModalVisible(true); }} />
    <Modal visible={modalVisible} transparent={true} animationType="fade">
  <View style={styles.modalContainer}>
    <View style={styles.modalContent}>
    <Text style={styles.modalHeading}>Results</Text>
      {results && (
        <View style={styles.resultsContainer}>
          <Text style={styles.resultText}>Invested Amount: {results.investedAmount}</Text>
          <Text style={styles.resultText}>Final Amount: {results.finalAmount.toFixed(2)}</Text>
          <Text style={styles.resultText}>Percentage Change: {results.percentageChange.toFixed(2)}%</Text>
        </View>
      )}
       <Button title="Close" onPress={() =>{ setModalVisible(false); setResults(null); setAmount(0); setInvestmentDuration(1)}} />

    </View>
  </View>
</Modal>
  </View>
</View>

  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  box: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    padding: 20,
    width: '90%', 
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign:'center'
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
  },
  slider: {
    width: '100%',
    marginBottom: 10,
  },
  amountText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  fundContainer: {
    marginBottom: 20,
  },
  fundOption: {
    fontSize: 16,
    marginBottom: 5,
  },
  frequencyContainer: {
    marginBottom: 20,
  },
  frequencyButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  durationContainer: {
    marginBottom: 20,
  },
  durationText: {
    fontSize: 16,
    fontWeight: 'bold',
    alignSelf: 'center',
  },
  resultsContainer: {
    marginTop: 20,
  },
  circularButton: {
    borderRadius: 50,
    backgroundColor: '#F5F5F5',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalHeading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    width: '70%',
    borderRadius: 10,
    padding: 20,
  },
  resultsContainer: {
    marginTop: 20,
  },
  resultText: {
    fontSize: 16,
    marginBottom: 5,
  },
  
});

export default App;
