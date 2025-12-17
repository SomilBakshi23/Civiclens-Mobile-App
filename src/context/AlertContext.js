import React, { createContext, useState, useContext, useCallback } from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '../theme/colors';

const AlertContext = createContext();

export const useAlert = () => useContext(AlertContext);

export const AlertProvider = ({ children }) => {
    const [visible, setVisible] = useState(false);
    const [config, setConfig] = useState({
        title: '',
        message: '',
        buttons: [] // { text, style, onPress }
    });

    const showAlert = useCallback((title, message, buttons = []) => {
        // If no buttons provided, add a default "OK"
        const alertButtons = buttons.length > 0 ? buttons : [
            { text: 'OK', onPress: () => { }, style: 'default' }
        ];

        setConfig({
            title,
            message,
            buttons: alertButtons
        });
        setVisible(true);
    }, []);

    const hideAlert = useCallback(() => {
        setVisible(false);
    }, []);

    const handleButtonPress = (onPress) => {
        hideAlert();
        if (onPress) {
            onPress();
        }
    };

    return (
        <AlertContext.Provider value={{ showAlert, hideAlert }}>
            {children}
            <Modal
                transparent={true}
                visible={visible}
                animationType="fade"
                onRequestClose={hideAlert}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        {config.title ? <Text style={styles.modalTitle}>{config.title}</Text> : null}
                        {config.message ? <Text style={styles.modalMessage}>{config.message}</Text> : null}

                        <View style={styles.modalButtons}>
                            {config.buttons.map((btn, index) => {
                                const isDestructive = btn.style === 'destructive';
                                const isCancel = btn.style === 'cancel';

                                let buttonStyle = styles.modalButton;
                                let textStyle = styles.modalButtonText;

                                if (isDestructive) {
                                    buttonStyle = styles.destructiveButton;
                                    textStyle = styles.destructiveText;
                                } else if (isCancel) {
                                    buttonStyle = styles.cancelButton;
                                    textStyle = styles.cancelText;
                                }

                                return (
                                    <TouchableOpacity
                                        key={index}
                                        style={[buttonStyle, { flex: 1, marginHorizontal: 4 }]}
                                        onPress={() => handleButtonPress(btn.onPress)}
                                    >
                                        <Text style={textStyle}>{btn.text}</Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    </View>
                </View>
            </Modal>
        </AlertContext.Provider>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: '85%',
        backgroundColor: 'black', // Black background
        padding: 24,
        borderRadius: 16,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#1E293B',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: colors.primary, // Blue Title
        marginBottom: 12,
        textAlign: 'center',
    },
    modalMessage: {
        fontSize: 16,
        color: colors.primary, // Blue Message
        textAlign: 'center',
        marginBottom: 24,
        opacity: 0.9,
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'center',
        width: '100%',
        flexWrap: 'wrap',
        gap: 8,
    },
    // Default Button (Blue)
    modalButton: {
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 80,
    },
    modalButtonText: {
        color: colors.primary,
        fontWeight: '600',
        fontSize: 16,
    },
    // Cancel Button (Blue Outline)
    cancelButton: {
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 80,
    },
    cancelText: {
        color: colors.primary,
        fontWeight: '600',
        fontSize: 16,
    },
    // Destructive Button (Red)
    destructiveButton: {
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 10,
        backgroundColor: 'rgba(239, 68, 68, 0.2)', // Red bg tint
        borderWidth: 1,
        borderColor: '#EF4444',
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 80,
    },
    destructiveText: {
        color: '#EF4444',
        fontWeight: '600',
        fontSize: 16,
    },
});
