import React from 'react';
import { Modal, View, Text, Pressable } from 'react-native';

type PopUpProps = {
  visible: boolean;
  onClose: () => void;
  message: string;
};

export default function PopUp({ visible, onClose, message }: PopUpProps) {
  return (
    <Modal transparent visible={visible} animationType="fade">
      <View className="flex-1 justify-center items-center bg-black bg-opacity-50">
        <View className="bg-white rounded-lg p-6 w-80">
          <Text className="text-center mb-4">{message}</Text>
          <Pressable className="bg-blue-500 rounded px-4 py-2" onPress={onClose}>
            <Text className="text-white text-center font-bold">Close</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}
