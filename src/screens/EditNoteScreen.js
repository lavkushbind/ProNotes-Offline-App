import React, { useState, useContext } from 'react';
import { View, TextInput, Image, StyleSheet, ScrollView, TouchableOpacity, Text, Modal, StatusBar } from 'react-native';
import { AppContext } from '../context/AppContext';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';

const COLORS = ['#1c1c1e', '#E74C3C', '#8E44AD', '#3498DB', '#27AE60', '#F1C40F', '#ffffff'];

export default function EditNoteScreen({ route, navigation }) {
  const { saveNote, deleteNote } = useContext(AppContext);
  const note = route.params?.note;
  
  // INITIAL VALUE FIX: Agar note null hai to '' (empty string) use karein
  const [title, setTitle] = useState(note?.title || '');
  const [body, setBody] = useState(note?.body || '');
  const [image, setImage] = useState(note?.image || null);
  const [selectedColor, setSelectedColor] = useState(note?.color || '#1c1c1e');
  const [isFullScreen, setIsFullScreen] = useState(false);

  const pickImage = async () => {
    const res = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 0.7 });
    if (!res.canceled) setImage(res.assets[0].uri);
  };

  const handleSave = () => {
    if(!title || title.trim() === '') return alert("Please add a title");
    saveNote({ id: note?.id, title, body, image, color: selectedColor });
    navigation.goBack();
  };

  const isLight = selectedColor === '#ffffff';
  const textColor = isLight ? 'black' : 'white';
  const placeholderColor = isLight ? '#888' : '#555';

  return (
    <View style={[styles.container, { backgroundColor: isLight ? '#f2f2f7' : '#000' }]}>
      <StatusBar barStyle={isLight ? "dark-content" : "light-content"} />

      <View style={styles.toolbar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconBtn}>
            <Ionicons name="arrow-back" size={24} color={textColor} />
        </TouchableOpacity>
        <View style={{flexDirection:'row', gap:15}}>
            {note && <TouchableOpacity onPress={() => { deleteNote(note.id); navigation.goBack(); }} style={styles.iconBtn}>
                <Ionicons name="trash-outline" size={24} color="#ff4444" />
            </TouchableOpacity>}
            <TouchableOpacity onPress={handleSave} style={[styles.iconBtn, {backgroundColor: '#4461F2'}]}>
                <Ionicons name="checkmark" size={24} color="white" />
            </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <TextInput 
            style={[styles.titleInput, { color: textColor }]} 
            value={title} 
            onChangeText={setTitle} 
            placeholder="Title" 
            placeholderTextColor={placeholderColor}
        />

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.colorRow}>
            {COLORS.map(c => (
                <TouchableOpacity 
                    key={c} 
                    style={[styles.colorDot, { backgroundColor: c, borderColor: textColor, borderWidth: selectedColor===c ? 2 : 0 }]} 
                    onPress={() => setSelectedColor(c)}
                />
            ))}
        </ScrollView>

        {image ? (
            <View style={styles.imageContainer}>
                <TouchableOpacity onPress={() => setIsFullScreen(true)}>
                    <Image source={{ uri: image }} style={styles.preview} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setImage(null)} style={styles.removeImgBtn}>
                    <Ionicons name="close" size={16} color="white" />
                </TouchableOpacity>
            </View>
        ) : (
            <TouchableOpacity onPress={pickImage} style={[styles.addImgBtn, {borderColor: isLight ? '#ccc' : '#333'}]}>
                <Ionicons name="image-outline" size={24} color="#4461F2" />
                <Text style={{color:'#4461F2', marginLeft: 10}}>Add Cover Image</Text>
            </TouchableOpacity>
        )}

        <TextInput 
            style={[styles.bodyInput, { color: isLight ? '#333' : '#ddd' }]} 
            value={body} 
            onChangeText={setBody} 
            placeholder="Start typing..." 
            placeholderTextColor={placeholderColor} 
            multiline 
        />
      </ScrollView>

      <Modal visible={isFullScreen} transparent={true} animationType="fade">
        <View style={styles.modalContainer}>
            <TouchableOpacity style={styles.closeModalBtn} onPress={() => setIsFullScreen(false)}>
                <Ionicons name="close-circle" size={40} color="white" />
            </TouchableOpacity>
            {image && <Image source={{ uri: image }} style={styles.fullScreenImage} resizeMode="contain" />}
        </View>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  toolbar: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 30, marginBottom: 20 },
  iconBtn: { padding: 10, borderRadius: 12, backgroundColor: 'rgba(100,100,100,0.1)' },
  titleInput: { fontSize: 34, fontWeight: 'bold', marginBottom: 15, paddingVertical: 5 },
  colorRow: { flexDirection: 'row', marginBottom: 20, maxHeight: 40 },
  colorDot: { width: 34, height: 34, borderRadius: 17, marginRight: 12 },
  addImgBtn: { flexDirection: 'row', alignItems: 'center', justifyContent:'center', padding: 15, borderRadius: 12, borderWidth: 1, borderStyle: 'dashed', marginBottom: 20 },
  imageContainer: { position: 'relative', marginBottom: 20 },
  preview: { width: '100%', height: 220, borderRadius: 15, backgroundColor: '#333' },
  removeImgBtn: { position: 'absolute', top: 10, right: 10, backgroundColor: 'rgba(0,0,0,0.6)', padding: 5, borderRadius: 15 },
  bodyInput: { fontSize: 18, minHeight: 300, textAlignVertical: 'top' },
  modalContainer: { flex: 1, backgroundColor: 'black', justifyContent: 'center', alignItems: 'center' },
  fullScreenImage: { width: '100%', height: '100%' },
  closeModalBtn: { position: 'absolute', top: 50, right: 20, zIndex: 10 }
});