import React, { useEffect } from 'react';
import { StyleSheet, Platform, TouchableOpacity } from 'react-native';

import { MonoText } from './StyledText';
import { Text, View } from './Themed';

import * as SQLite from 'expo-sqlite';
import * as FileSystem from 'expo-file-system';

function openDatabase() {
  if (Platform.OS === 'web') {
    return {
      transaction: () => {
        return {
          executeSql: () => {},
        };
      },
    };
  }

  const db = SQLite.openDatabase('test.db');
  return db;
}

const db = openDatabase();

const fileSystemPath = async () => {
  console.log(FileSystem.documentDirectory);
};

const insertDummyData = () => {
  db.transaction(
    (tx) => {
      tx.executeSql('insert into items (text) values (?)', ['Dummy Data']);
    },
    (error) => {
      console.log('Transaction error on inserting dummy data', error);
    },
    () => {
      console.log('Inserted dummy data successfully');
    }
  );
};

const logData = () => {
  db.transaction(
    (tx) => {
      tx.executeSql('select * from items', [], (_, { rows }) => {
        console.log('rows array', rows._array);
        console.log('rows', JSON.stringify(rows));
      });
    },
    (error) => {
      console.log('Transaction error on reading data', error);
    },
    () => {
      console.log('Read data successfully');
    }
  );
};

export default function EditScreenInfo({ path }: { path: string }) {
  useEffect(() => {
    db.transaction((tx) => {
      // tx.executeSql(
      //   'drop table if exists items;',
      //   [],
      //   () => console.log('Table dropped successfully'),
      //   (tx, error) => {
      //     console.log('Error dropping table', error);
      //     return false;
      //   }
      // );
      tx.executeSql(
        'create table if not exists items (id integer primary key not null, text text);',
        [],
        () => console.log('Table created successfully'),
        (tx, error) => {
          console.log('Error creating table', error);
          return false; // Indicate not to roll back the transaction
        }
      );
      tx.executeSql(
        'PRAGMA table_info(items);',
        [],
        (_, { rows }) => console.log(JSON.stringify(rows)),
        (tx, error) => {
          console.log('Error checking table structure', error);
          return false;
        }
      );
    });
    fileSystemPath();
  }, []);

  return (
    <View>
      <View style={styles.getStartedContainer}>
        <Text
          style={styles.getStartedText}
          lightColor='rgba(0,0,0,0.8)'
          darkColor='rgba(255,255,255,0.8)'
        >
          Open up the code for this screen!:
        </Text>

        <View
          style={[styles.codeHighlightContainer, styles.homeScreenFilename]}
          darkColor='rgba(255,255,255,0.05)'
          lightColor='rgba(0,0,0,0.05)'
        >
          <MonoText>{path}</MonoText>
        </View>

        <Text
          style={styles.getStartedText}
          lightColor='rgba(0,0,0,0.8)'
          darkColor='rgba(255,255,255,0.8)'
        >
          Change any of the text, save the file, and your app will automatically
          update.
        </Text>

        <TouchableOpacity onPress={insertDummyData}>
          <Text>Insert Dummy Data</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={logData}>
          <Text>Log Data</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  getStartedContainer: {
    alignItems: 'center',
    marginHorizontal: 50,
  },
  homeScreenFilename: {
    marginVertical: 7,
  },
  codeHighlightContainer: {
    borderRadius: 3,
    paddingHorizontal: 4,
  },
  getStartedText: {
    fontSize: 17,
    lineHeight: 24,
    textAlign: 'center',
  },
  helpContainer: {
    marginTop: 15,
    marginHorizontal: 20,
    alignItems: 'center',
  },
  helpLink: {
    paddingVertical: 15,
  },
  helpLinkText: {
    textAlign: 'center',
  },
});
