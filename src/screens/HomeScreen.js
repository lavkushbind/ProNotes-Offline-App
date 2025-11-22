import React, { useContext, useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet, StatusBar, TextInput, Modal } from 'react-native';
import { AppContext } from '../context/AppContext';
import { Ionicons } from '@expo/vector-icons';

export default function HomeScreen({ navigation }) {
  // Context se 'switchAccount' nikala
  const { user, allUsers, notes, logout, switchAccount } = useContext(AppContext);
  const [searchText, setSearchText] = useState('');
  const [greeting, setGreeting] = useState('Hello');
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 18) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');
  }, []);

  const filteredNotes = notes.filter(n => {
    const t = n.title || '';
    const b = n.body || '';
    return t.toLowerCase().includes(searchText.toLowerCase()) || 
           b.toLowerCase().includes(searchText.toLowerCase());
  });

  const handleLogout = () => {
    setModalVisible(false);
    logout();
  };

  // --- NEW SWITCH LOGIC (Seamless) ---
  const handleSwitch = (targetUsername) => {
    setModalVisible(false); // Menu band karo
    switchAccount(targetUsername); // Context function call karo -> User change -> Data change
    // Koi password nahi mangega, sidha notes reload ho jayenge
  };

  const renderNote = ({ item }) => {
    const dateObj = new Date(item.date || Date.now());
    const dateStr = dateObj.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });

    return (
      <TouchableOpacity 
        style={[styles.card, { backgroundColor: item.color || '#1c1c1e' }]} 
        onPress={() => navigation.navigate('EditNote', { note: item })}
        activeOpacity={0.8}
      >
        {item.image ? <Image source={{ uri: item.image }} style={styles.thumb} /> : null}
        <Text style={[styles.cardTitle, { color: item.color === '#ffffff' ? 'black' : 'white' }]}>{item.title || "Untitled"}</Text>
        <Text numberOfLines={3} style={[styles.cardBody, { color: item.color === '#ffffff' ? '#444' : '#aaa' }]}>{item.body || "No content"}</Text>
        <Text style={[styles.dateText, { color: item.color === '#ffffff' ? '#666' : '#555' }]}>{dateStr}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      
      <View style={styles.header}>
        <View>
            <Text style={styles.greet}>{greeting},</Text>
            <TouchableOpacity onPress={() => setModalVisible(true)} style={{flexDirection:'row', alignItems:'center'}}>
              <Text style={styles.user}>{user?.username || 'User'}</Text>
              <Ionicons name="chevron-down" size={20} color="white" style={{marginLeft: 5, marginTop: 5}} />
            </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.profileBtn}>
            <Ionicons name="person" size={20} color="white" />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#888" style={{marginRight: 10}} />
        <TextInput 
            placeholder="Search..." 
            placeholderTextColor="#666" 
            style={styles.searchInput}
            value={searchText}
            onChangeText={setSearchText}
        />
      </View>

      <FlatList 
        data={filteredNotes}
        keyExtractor={item => (item.id || Math.random()).toString()}
        renderItem={renderNote}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: 'space-between' }}
        contentContainerStyle={{ paddingBottom: 100 }}
        ListEmptyComponent={<Text style={styles.emptyText}>No notes found.</Text>}
      />

      <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('EditNote', { note: null })}>
        <Ionicons name="add" size={32} color="white" />
      </TouchableOpacity>

      {/* ACCOUNT SWITCHER MODAL */}
      <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
        <TouchableOpacity style={styles.modalOverlay} onPress={() => setModalVisible(false)} activeOpacity={1}>
            <View style={styles.modalContent}>
                <View style={styles.modalHandle} />
                <Text style={styles.modalTitle}>Accounts</Text>

                {allUsers.map((u, index) => (
                    <TouchableOpacity 
                        key={index} 
                        style={[styles.accountRow, u.username === user.username && styles.activeAccount]}
                        onPress={() => u.username !== user.username && handleSwitch(u.username)}
                    >
                        <View style={styles.avatar}>
                            <Text style={styles.avatarText}>{u.username[0].toUpperCase()}</Text>
                        </View>
                        <Text style={styles.accountName}>{u.username}</Text>
                        {u.username === user.username && <Ionicons name="checkmark-circle" size={24} color="#4461F2" />}
                    </TouchableOpacity>
                ))}

                <View style={styles.divider} />

                <TouchableOpacity style={styles.optionRow} onPress={handleLogout}>
                    <View style={[styles.avatar, {backgroundColor: 'transparent', borderWidth: 1, borderColor: '#666'}]}>
                        <Ionicons name="add" size={20} color="white" />
                    </View>
                    <Text style={styles.optionText}>Add Account</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.logoutRow} onPress={handleLogout}>
                    <Ionicons name="log-out-outline" size={24} color="#ff4444" />
                    <Text style={styles.logoutText}>Log Out {user.username}</Text>
                </TouchableOpacity>

            </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', padding: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 30, marginBottom: 20 },
  greet: { color: '#888', fontSize: 16 },
  user: { color: 'white', fontSize: 26, fontWeight: 'bold' },
  profileBtn: { backgroundColor: '#1c1c1e', padding: 12, borderRadius: 50 },
  searchContainer: { flexDirection: 'row', backgroundColor: '#1c1c1e', borderRadius: 15, padding: 12, alignItems: 'center', marginBottom: 20 },
  searchInput: { flex: 1, color: 'white', fontSize: 16 },
  card: { width: '48%', padding: 15, borderRadius: 18, marginBottom: 15, elevation: 5, justifyContent: 'space-between' },
  thumb: { width: '100%', height: 110, borderRadius: 12, marginBottom: 12, resizeMode: 'cover' },
  cardTitle: { fontWeight: 'bold', fontSize: 17, marginBottom: 6 },
  cardBody: { fontSize: 13, marginBottom: 10, lineHeight: 18 },
  dateText: { fontSize: 11, alignSelf: 'flex-end', fontWeight: '600', marginTop: 5 },
  emptyText: { color: 'white', textAlign:'center', marginTop: 50 },
  fab: { position: 'absolute', bottom: 30, right: 20, backgroundColor: '#4461F2', width: 64, height: 64, borderRadius: 32, justifyContent: 'center', alignItems: 'center', elevation: 10 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#1c1c1e', borderTopLeftRadius: 25, borderTopRightRadius: 25, padding: 20, paddingBottom: 40 },
  modalHandle: { width: 40, height: 4, backgroundColor: '#444', borderRadius: 2, alignSelf: 'center', marginBottom: 20 },
  modalTitle: { color: 'white', fontSize: 20, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  accountRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 10, borderRadius: 12 },
  activeAccount: { backgroundColor: '#2c2c2e' },
  avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#444', justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  avatarText: { color: 'white', fontWeight: 'bold', fontSize: 18 },
  accountName: { color: 'white', fontSize: 16, fontWeight: '600', flex: 1 },
  divider: { height: 1, backgroundColor: '#333', marginVertical: 15 },
  optionRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, paddingHorizontal: 10 },
  optionText: { color: 'white', fontSize: 16, fontWeight: '500' },
  logoutRow: { flexDirection: 'row', alignItems: 'center', marginTop: 15, padding: 10 },
  logoutText: { color: '#ff4444', fontSize: 16, fontWeight: 'bold', marginLeft: 15 }
});