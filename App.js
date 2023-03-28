import { StatusBar } from 'expo-status-bar';
import { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  Modal,
} from 'react-native';
import { theme } from './colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Fontisto } from '@expo/vector-icons';

const STORAGE_KEY = '@todos';
const STORAGE_WORK_KEY = '@work';

export default function App() {
  const [working, setWorking] = useState(true);
  const [text, setText] = useState('');
  const [todos, setTodos] = useState({});
  const [editKey, setEditKey] = useState('');
  const inputRef = useRef(null);

  const travel = () => {
    setWorking(false);
    saveWork(false);
  };

  const work = () => {
    setWorking(true);
    saveWork(true);
  };

  const saveTodos = async (toSave) => {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  };

  const saveWork = async (toSave) => {
    await AsyncStorage.setItem(STORAGE_WORK_KEY, JSON.stringify(toSave));
  };

  const loadTodos = async () => {
    try {
      const s = await AsyncStorage.getItem(STORAGE_KEY);
      setTodos(JSON.parse(s));
    } catch (error) {
      console.log(arr);
    }
  };

  const loadWork = async () => {
    try {
      const s = await AsyncStorage.getItem(STORAGE_WORK_KEY);
      setWorking(JSON.parse(s));
    } catch (error) {
      console.log(arr);
    }
  };

  const addTodo = async () => {
    if (text === '')
      return Alert.alert('오류', '빈 입력 값은 들어갈 수 없습니다.');

    const newTodos = { ...todos, [Date.now()]: { text, working, done: false } };
    setTodos(newTodos);
    saveTodos(newTodos);
    setText('');
  };

  const editTodo = () => {
    if (text === '')
      return Alert.alert('오류', '빈 입력 값은 들어갈 수 없습니다.');
    const newTodos = { ...todos };
    newTodos[editKey].text = text;
    setTodos(newTodos);
    saveTodos(newTodos);
    setText('');
    setEditKey('');
  };

  const editBtnHandler = (key) => {
    setEditKey(key);
    setText(todos[key].text);
    inputRef.current.focus();
  };

  const doneTodo = (key) => {
    const newTodos = { ...todos };
    newTodos[key].done = !newTodos[key].done;
    setTodos(newTodos);
    saveTodos(newTodos);
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
    loadWork();
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
          onSubmitEditing={editKey.length ? editTodo : addTodo}
          returnKeyType="done"
          ref={inputRef}
        />
      </View>
      <ScrollView>
        {Object.keys(todos).map((key) =>
          todos[key].working === working ? (
            <View
              style={[styles.todo, key === editKey && styles.todoEdit]}
              key={key}
            >
              <TouchableOpacity
                onPress={() => {
                  doneTodo(key);
                }}
              >
                <Fontisto
                  name={
                    todos[key].done ? 'checkbox-active' : 'checkbox-passive'
                  }
                  size={24}
                  color={todos[key].done ? theme.gray : theme.white}
                />
              </TouchableOpacity>
              <Text
                style={[
                  styles.todoText,
                  todos[key].done && styles.todoTextDone,
                ]}
              >
                {todos[key].text}
              </Text>
              <View style={styles.todoBtn}>
                <TouchableOpacity
                  style={styles.editBtn}
                  onPress={() => {
                    editBtnHandler(key);
                  }}
                >
                  <Fontisto name="eraser" size={24} color={theme.gray} />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    deleteTodo(key);
                  }}
                >
                  <Fontisto name="trash" size={24} color={theme.gray} />
                </TouchableOpacity>
              </View>
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
  todoEdit: {
    backgroundColor: '#888',
  },
  todoText: {
    color: theme.white,
    fontSize: 18,
    fontWeight: 500,
  },
  todoTextDone: {
    color: theme.gray,
    textDecorationLine: 'line-through',
  },
  todoBtn: {
    flexDirection: 'row',
  },
  editBtn: {
    marginRight: 5,
  },
});
