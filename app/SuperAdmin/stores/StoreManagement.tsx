import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Sidebar from '../../dashboard/sidebar';

const students = [
  { id: '1', name: 'Eleanor Pena', roll: '#01', address: 'TA-107 Newyork', class: '01', dob: '02/05/2001', phone: '+123 8988567' },
  { id: '2', name: 'Jessia Rose', roll: '#10', address: 'TA-107 Newyork', class: '02', dob: '03/04/2000', phone: '+123 8988568' },
  { id: '3', name: 'Jenny Wilson', roll: '#05', address: 'Australia, Sydney', class: '02', dob: '12/05/2001', phone: '+123 8988566' },
  { id: '4', name: 'Guy Hawkins', roll: '#03', address: 'Australia, Sydney', class: '03', dob: '03/05/2001', phone: '+123 8988565' },
  { id: '5', name: 'Jacob Jones', roll: '#15', address: 'Australia, Sydney', class: '04', dob: '12/05/2001', phone: '+123 8988568' },
  { id: '6', name: 'Jane Cooper', roll: '#07', address: 'Australia, Sydney', class: '01', dob: '12/05/2001', phone: '+123 8988568' },
  { id: '7', name: 'Floyd Miles', roll: '#11', address: 'TA-107 Newyork', class: '01', dob: '03/05/2002', phone: '+123 8988569' },
];

export default function StudentList() {
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);
  const [addHovered, setAddHovered] = useState(null);

  return (
    <View style={styles.container}>
      <Sidebar />

      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Stores List</Text>
          <TouchableOpacity onPress={() => router.replace('/SuperAdmin/stores/addstore')} style={styles.addBtn}>
            <Ionicons name="add" size={20} color="#fff" />
            <Text style={styles.addText}>Add Store</Text>
          </TouchableOpacity>
        </View>

        <TextInput
          placeholder="Search by name or roll"
          placeholderTextColor="#999"
          style={styles.searchInput}
        />

        <View style={styles.tableHeader}>
          <Text style={[styles.cell, styles.headerCell]}>SROTE'S NAME</Text>
          <Text style={[styles.cell, styles.headerCell]}>OWNER</Text>
          <Text style={[styles.cell, styles.headerCell]}>TYPE</Text>
          <Text style={[styles.cell, styles.headerCell]}>CREATED AT</Text>
          <Text style={[styles.cell, styles.headerCell]}>STATUS</Text>
          <Text style={[styles.cell, styles.headerCell]}>PHONE</Text>
          <Text style={[styles.cell, styles.headerCell]}>EDIT / DELETE</Text>
        </View>

        <FlatList
          data={students}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Pressable
              onHoverIn={() => setHoveredRow(item.id)}
              onHoverOut={() => setHoveredRow(null)}
              style={[
                styles.row,
                hoveredRow === item.id && styles.rowHovered
              ]}
            >
              <Text style={styles.cell}>{item.name}</Text>
              <Text style={styles.cell}>{item.roll}</Text>
              <Text style={styles.cell}>{item.address}</Text>
              <Text style={styles.cell}>{item.class}</Text>
              <Text style={styles.cell}>{item.dob}</Text>
              <Text style={styles.cell}>{item.phone}</Text>

              <View style={styles.Btncell}>
                <Pressable
                  onHoverIn={() => setHoveredRow(item.id + '-edit')}
                  onHoverOut={() => setHoveredRow(null)}
                  style={[
                    styles.EditBtn,
                    hoveredRow === item.id + '-edit' && styles.btnHovered
                  ]}
                >
                  <Text
                    style={[
                      styles.btnText,
                      hoveredRow === item.id + '-edit' && styles.btnTextHovered
                    ]}
                  >
                    Edit
                  </Text>
                </Pressable>

                <View style={{ margin: 7 }} />

                <Pressable
                  onHoverIn={() => setHoveredRow(item.id + '-delete')}
                  onHoverOut={() => setHoveredRow(null)}
                  style={[
                    styles.DeleteBtn,
                    hoveredRow === item.id + '-delete' && styles.btnHovered
                  ]}
                >
                  <Text
                    style={[
                      styles.btnText,
                      hoveredRow === item.id + '-delete' && styles.btnTextHovered
                    ]}
                  >
                    Delete
                  </Text>
                </Pressable>
              </View>
            </Pressable>
          )}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#2563eb',
  },
  addBtn: {
    backgroundColor: '#2563eb',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  addText: {
    color: '#fff',
    fontWeight: '600',
    marginLeft: 5,
  },
  searchInput: {
    marginTop: 20,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 8,
    fontSize: 16,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#e5e7eb',
    borderRadius: 8,
    padding: 10,
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#eee',
    padding: 10,
    borderRadius: 8,
  },
  rowHovered: {
    backgroundColor: '#e0e7ff', // لون hover للصف
  },
  cell: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  Btncell: {
    flex: 1,
    flexDirection: 'row',
    margin: 10,
  },
  EditBtn: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#2563eb',
    backgroundColor: '#fff',
    padding: 10,
  },
  DeleteBtn: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#2563eb',
    backgroundColor: '#fff',
    padding: 10,
  },
  btnHovered: {
    backgroundColor: '#2563eb',
  },
  btnText: {
    color: '#2563eb',
    fontWeight: '600',
  },
  btnTextHovered: {
    color: '#fff',
  },
  headerCell: {
    fontWeight: '700',
    color: '#2563eb',
  },
});
