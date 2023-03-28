import { StatusBar } from 'expo-status-bar';
import { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
} from 'react-native';
import { theme } from './colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Fontisto } from '@expo/vector-icons';

const STORAGE_KEY = '@todos';

export default function App() {
  const [working, setWorking] = useState(true);
  const [text, setText] = useState('');
  const [todos, setTodos] = useState({});

  const travel = () => {
    setWorking(false);
  };

  const work = () => {
    setWorking(true);
  };

  const saveTodos = async (toSave) => {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  };

  const loadTodos = async () => {
    try {
      const s = await AsyncStorage.getItem(STORAGE_KEY);
      setTodos(JSON.parse(s));
    } catch (error) {
      console.log(arr);
    }
  };

  const addTodo = async () => {
    if (text === '') return;

    const newTodos = { ...todos, [Date.now()]: { text, working } };
    setTodos(newTodos);
    saveTodos(newTodos);
    setText('');
  };

  const deleteTodo = async (key) => {
    Alert.alert('할 일 삭제', '할 일을 삭제하시겠습니까?', [
      {
        text: '네',
        onPress: () => {
          const newTodos = { ...todos };
          delete newTodos[key];
          setTodos(newTodos);
          saveTodos(newTodos);
        },
      },
      { text: '아니요' },
    ]);
  };

  const onChangeText = (val) => setText(val);

  useEffect(() => {
    loadTodos();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.header}>
        <TouchableOpacity onPress={work}>
          <Text
            style={{
              ...styles.btnText,
              color: working ? theme.white : theme.gray,
            }}
          >
            work
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={travel}>
          <Text
            style={{
              ...styles.btnText,
              color: !working ? theme.white : theme.gray,
            }}
          >
            travel
          </Text>
        </TouchableOpacity>
      </View>
      <View>
        <TextInput
          style={styles.input}
          placeholder={
            working ? '할 일을 입력하세요' : '여행에 필요한 일을 입력하세요'
          }
          value={text}
          onChangeText={onChangeText}
          onSubmitEditing={addTodo}
          returnKeyType="done"
        />
      </View>
      <ScrollView>
        {Object.keys(todos).map((key) =>
          todos[key].working === working ? (
            <View style={styles.todo} key={key}>
              <Text style={styles.todoText}>{todos[key].text}</Text>
              <TouchableOpacity
                onPress={() => {
                  deleteTodo(key);
                }}
              >
                <Fontisto name="trash" size={24} color={theme.gray} />
              </TouchableOpacity>
            </View>
          ) : null
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 100,
  },
  btnText: {
    color: '#fff',
    fontSize: 40,
    fontWeight: 600,
  },
  input: {
    backgroundColor: theme.white,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 50,
    marginVertical: 20,
    fontSize: 20,
  },
  todo: {
    backgroundColor: theme.todoBg,
    marginBottom: 10,
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  todoText: {
    color: theme.white,
    fontSize: 18,
    fontWeight: 500,
  },
});
