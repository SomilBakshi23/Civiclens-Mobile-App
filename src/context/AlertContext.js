import React, { createContext, useState, useContext, useCallback } from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '../theme/colors';
import { ThemeContext } from './ThemeContext';

const AlertContext = createContext();

export const useAlert = () => useContext(AlertContext);

export const AlertProvider = ({ children }) => {
    const { theme, isDarkMode } = useContext(ThemeContext);
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
                    <View style={[
                        styles.modalContent,
                        {
                            backgroundColor: isDarkMode ? 'black' : theme.surface,
                            borderColor: theme.border
                        }
                    ]}>
                        {config.title ? <Text style={[styles.modalTitle, { color: theme.primary }]}>{config.title}</Text> : null}
                        {config.message ? <Text style={[styles.modalMessage, { color: theme.primary }]}>{config.message}</Text> : null}

                        <View style={styles.modalButtons}>
                            {config.buttons.map((btn, index) => {
                                const isDestructive = btn.style === 'destructive';
                                const isCancel = btn.style === 'cancel';

                                let buttonStyle = styles.modalButton;
                                let textStyle = styles.modalButtonText;
                                let dynamicButtonStyle = { borderColor: theme.primary };
                                let dynamicTextStyle = { color: theme.primary };

                                if (isDestructive) {
                                    buttonStyle = styles.destructiveButton;
                                    textStyle = styles.destructiveText;
                                    dynamicButtonStyle = {
                                        borderColor: theme.error,
                                        backgroundColor: isDarkMode ? 'rgba(239, 68, 68, 0.2)' : theme.errorBg
                                    };
                                    dynamicTextStyle = { color: theme.error };
                                } else if (isCancel) {
                                    buttonStyle = styles.cancelButton;
                                    textStyle = styles.cancelText;
                                    dynamicButtonStyle = { borderColor: theme.primary };
                                    dynamicTextStyle = { color: theme.primary };
                                    // Maybe different for light mode? Blue cancel is fine.
                                }

                                return (
                                    <TouchableOpacity
                                        key={index}
                                        style={[
                                            buttonStyle,
                                            dynamicButtonStyle,
                                            { flex: 1, marginHorizontal: 4 }
                                        ]}
                                        onPress={() => handleButtonPress(btn.onPress)}
                                    >
                                        <Text style={[textStyle, dynamicTextStyle]}>{btn.text}</Text>
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
        padding: 24,
        borderRadius: 16,
        alignItems: 'center',
        borderWidth: 1,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 12,
        textAlign: 'center',
    },
    modalMessage: {
        fontSize: 16,
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
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 80,
    },
    modalButtonText: {
        fontWeight: '600',
        fontSize: 16,
    },
    // Cancel Button (Blue Outline)
    cancelButton: {
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 10,
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 80,
    },
    cancelText: {
        fontWeight: '600',
        fontSize: 16,
    },
    // Destructive Button (Red)
    destructiveButton: {
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 10,
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 80,
    },
    destructiveText: {
        fontWeight: '600',
        fontSize: 16,
    },
});
