
document.addEventListener('DOMContentLoaded', function() {
    const chatbox = document.getElementById('chatbox');
    const userInput = document.getElementById('userInput');
    const sendButton = document.getElementById('sendButton');
    const recordVoiceButton = document.getElementById('recordVoiceButton');
    const fileInput = document.getElementById('fileInput');
    const voiceInput = document.getElementById('voiceInput');

    let mediaRecorder;
    let recordedChunks = [];

    // Handle file input change
    fileInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        const fileType = getFileType(file);
        const message = `Sent a ${fileType}: ${file.name}`;
        sendMessage(message, fileType, file);
    });

    // Handle voice input change (for voice recordings)
    voiceInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        const message = 'Recorded a voice message. Click send to send it.';
        sendMessage(message, 'audio', file);
    });

    // Event listeners for file sending buttons
    sendButton.addEventListener('click', function() {
        const message = userInput.value.trim();
        if (message !== '') {
            sendMessage(message);
            userInput.value = ''; // Clear input field
        }
    });


    // Send file button click event for image
    sendImageButton.addEventListener('click', function() {
        fileInput.accept = 'image/*';
        fileInput.click();
    });

    // Send file button click event for video
    sendVideoButton.addEventListener('click', function() {
        fileInput.accept = 'video/*';
        fileInput.click();
    });

    // Send file button click event for document
    sendFileButton.addEventListener('click', function() {
        fileInput.accept = '.doc, .docx, .pdf';
        fileInput.click();
    });

    // Record/Stop button click event
    recordVoiceButton.addEventListener('click', function() {
        if (recordVoiceButton.classList.contains('recording')) {
            // Stop recording
            mediaRecorder.stop();
            recordVoiceButton.classList.remove('recording');
            recordVoiceButton.innerHTML = '<i class="bi bi-mic"></i>';
        } else {
            // Start recording
            navigator.mediaDevices.getUserMedia({ audio: true })
                .then(function(stream) {
                    mediaRecorder = new MediaRecorder(stream);
                    recordedChunks = [];

                    mediaRecorder.start();

                    mediaRecorder.ondataavailable = function(e) {
                        recordedChunks.push(e.data);
                    };

                    mediaRecorder.onstop = function() {
                        const recordedBlob = new Blob(recordedChunks, { type: 'audio/webm' });
                        const message = 'Recorded a voice message. Click send to send it.';
                        sendMessage(message, 'audio', recordedBlob);
                    };

                    recordVoiceButton.classList.add('recording');
                    recordVoiceButton.innerHTML = '<i class="bi bi-mic-mute"></i>';

                })
                .catch(function(err) {
                    console.error('Error recording audio:', err);
                });
        }
    });

    function sendMessage(message, messageType, file) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', 'user-message');
        messageElement.textContent = message;
        chatbox.appendChild(messageElement);
    
        // Append timestamp
        appendTimestamp(messageElement);
    
        // Handle different message types
        if (messageType === 'audio') {
            const reader = new FileReader();
            reader.onload = function(e) {
                const audioSrc = e.target.result;
                const audioMessage = `<audio controls><source src="${audioSrc}" type="${file.type}"></audio>`;
                const audioMessageElement = document.createElement('div');
                audioMessageElement.classList.add('message', 'user-message');
                audioMessageElement.innerHTML = audioMessage;
                chatbox.appendChild(audioMessageElement);
    
                // Append timestamp
                appendTimestamp(audioMessageElement);
    
                // Automatically scroll to bottom
                chatbox.scrollTop = chatbox.scrollHeight;
            };
            reader.readAsDataURL(file);
        } else if (messageType === 'image' || messageType === 'video') {
            const reader = new FileReader();
            reader.onload = function(e) {
                const mediaSrc = e.target.result;
                let mediaMessage = '';
                if (messageType === 'image') {
                    mediaMessage = `<img src="${mediaSrc}" alt="Sent Image" style="max-width: 100%; height: auto;">`;
                } else if (messageType === 'video') {
                    mediaMessage = `<video controls class="video" style="height: 200px;width: 375px;margin-top: 10px;margin-bottom: 10px;"><source src="${mediaSrc}" type="${file.type}"></video>`;
                }
                const mediaMessageElement = document.createElement('div');
                mediaMessageElement.classList.add('message', 'user-message');
                mediaMessageElement.innerHTML = mediaMessage;
                chatbox.appendChild(mediaMessageElement);
    
                // Append timestamp
                appendTimestamp(mediaMessageElement);
    
                // Automatically scroll to bottom
                chatbox.scrollTop = chatbox.scrollHeight;
            };
            reader.readAsDataURL(file);
        } else if (messageType === 'file') {
            const fileMessage = `Sent a file: <a href="${URL.createObjectURL(file)}" target="_blank">${file.name}</a>`;
            const fileMessageElement = document.createElement('div');
            fileMessageElement.classList.add('message', 'user-message');
            fileMessageElement.innerHTML = fileMessage;
            chatbox.appendChild(fileMessageElement);
    
            // Append timestamp
            appendTimestamp(fileMessageElement);
    
            // Automatically scroll to bottom
            chatbox.scrollTop = chatbox.scrollHeight;
        } else { // Text message
            // Simulate bot's reply after a short delay
            setTimeout(function() {
                const botMessage = generateBotReply(message);
                const botMessageElement = document.createElement('div');
                botMessageElement.classList.add('message', 'bot-message');
                botMessageElement.textContent = botMessage;
                chatbox.appendChild(botMessageElement);
    
                // Append timestamp
                appendTimestamp(botMessageElement);
    
                // Automatically scroll to bottom
                chatbox.scrollTop = chatbox.scrollHeight;
            }, 500); // Delay for bot's reply (e.g., 0.5 seconds)
        }
    }
    

// Function to generate bot's reply
function generateBotReply(message) {
    message = message.toLowerCase();
    const responses = {
        'hello': 'Hello! How can I assist you today?',
        'how are you': 'I am just a bot, but thank you for asking!',
        'good morning': 'Good morning! Have a great day!',
        'good afternoon': 'Good afternoon! How can I help?',
        'good evening': 'Good evening! What can I do for you?',
        'bye': 'Goodbye! Have a nice day!'
    };

    for (const key in responses) {
        if (message.includes(key)) {
            return responses[key];
        }
    }
    return 'I did not understand that. Can you please rephrase?';
}









    // Function to generate bot's reply
    function generateBotReply(message) {
        message = message.toLowerCase();
        const responses = {
            'hello': 'Hello! How can I assist you today?',
            'how are you': 'I am just a bot, but thank you for asking!',
            'good morning': 'Good morning! Have a great day!',
            'good afternoon': 'Good afternoon! How can I help?',
            'good evening': 'Good evening! What can I do for you?',
            'bye': 'Goodbye! Have a nice day!'
        };

        for (const key in responses) {
            if (message.includes(key)) {
                return responses[key];
            }
        }
        return 'I did not understand that. Can you please rephrase?';
    }

    // Function to append timestamp
    function appendTimestamp(element) {
        const timestamp = new Date();
        const timestampElement = document.createElement('span');
        timestampElement.classList.add('timestamp');
        timestampElement.textContent = `${timestamp.toLocaleDateString()} ${timestamp.toLocaleTimeString()}`;
        element.appendChild(timestampElement);
    }

    // Function to determine file type
    function getFileType(file) {
        const fileType = file.type.split('/')[0];
        if (fileType === 'image') {
            return 'image';
        } else if (fileType === 'video') {
            return 'video';
        } else {
            return 'file';
        }
    }

    // Focus on userInput initially
    userInput.focus();
});
