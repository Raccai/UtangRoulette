import { messages } from './messages';
import { settingsStore } from '$lib/stores/settingsStore';
import { get } from 'svelte/store';

// --- Configuration ---
export const wheelOptions = [
    { display: "Mabait Reminder", key: "mabaitReminder", color: "#9D2C0E" },
    { display: "OA Parinig", key: "oaParinig", color: "#FFC107" },
    { display: "Biblical Plague", key: "biblicalPlague", color: "#4D7C8A" },
    { display: "Straight Galit", key: "straightGalit", color: "#386641" },
    { display: "Tiktoker Style", key: "tiktokerStyle", color: "#61A8C6" },
    { display: "Sarcastic AF", key: "sarcasticAf", color: "#E57C23" }
];
// --- End Configuration ---

// Add 'messageType' argument with a default value
export function spinTheWheel(messageType = 'mayUtang') {
    // --- Basic Validation ---
    if (!wheelOptions || wheelOptions.length === 0) {
        console.error("Wheel options config missing!"); return { category: "Error", message: "Config error." };
    }
    if (!messages || Object.keys(messages).length === 0) {
        console.error("Messages missing!"); return { category: "Error", message: "Config error." };
    }
    // Validate the provided messageType
    if (messageType !== 'mayUtang' && messageType !== 'nagbibigayNgUtang') {
        console.warn(`Invalid messageType "${messageType}" provided. Defaulting to 'mayUtang'.`);
        messageType = 'mayUtang';
    }
    // --- End Validation ---


    // 1. Choose Category
    const randomCategoryIndex = Math.floor(Math.random() * wheelOptions.length);
    const selectedOption = wheelOptions[randomCategoryIndex];
    const selectedCategoryDisplay = selectedOption.display;
    const selectedCategoryKey = selectedOption.key;

    // 2. Determine the message type using the passed argument
    // *** REMOVED HARDCODED VALUE ***
    const currentMessageType = messageType;
    console.log(`[spinTheWheel] Using message type: ${currentMessageType}`); // Log which mode is used

    // 3. Access the message list
    let messageList = [];
    if (messages[selectedCategoryKey]?.[currentMessageType]) {
        messageList = messages[selectedCategoryKey][currentMessageType];
    } else {
        console.warn(`No messages found for category key "${selectedCategoryKey}" and type "${currentMessageType}". Using fallback.`);
        return {
            category: selectedCategoryDisplay,
            message: `(No messages defined for ${selectedCategoryDisplay} - ${currentMessageType})`
        };
    }
    if (messageList.length === 0) {
        console.warn(`Message list is empty for category key "${selectedCategoryKey}" and type "${currentMessageType}". Using fallback.`);
        return {
            category: selectedCategoryDisplay,
            message: `(Message list is empty for ${selectedCategoryDisplay} - ${currentMessageType})`
        };
    }

    // 4. Choose Message
    const randomMessageIndex = Math.floor(Math.random() * messageList.length);
    const selectedMessage = messageList[randomMessageIndex];

    // 5. Return Result
    return {
        category: selectedCategoryDisplay,
        message: selectedMessage
    };
}