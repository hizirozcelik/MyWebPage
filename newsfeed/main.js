// Import the functions you need from the SDKs you need
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.21.0/firebase-app.js';
import { getAnalytics } from 'https://www.gstatic.com/firebasejs/9.21.0/firebase-analytics.js';
import { getFirestore, collection, addDoc, updateDoc, doc } from 'https://www.gstatic.com/firebasejs/9.21.0/firebase-firestore.js';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'https://www.gstatic.com/firebasejs/9.21.0/firebase-storage.js';

    // test jira

    // Your web app's Firebase configuration
    // For Firebase JS SDK v7.20.0 and later, measurementId is optional
    const firebaseConfig = {
        apiKey: "AIzaSyDqL1uwfQy9PAwK-Q19l8nWI7vdWBgalVU",
        authDomain: "kuzeyapp-e1028.firebaseapp.com",
        projectId: "kuzeyapp-e1028",
        storageBucket: "kuzeyapp-e1028.appspot.com",
        messagingSenderId: "1051023438576",
        appId: "1:1051023438576:web:316952ccd3a87cb4978835",
        measurementId: "G-BF5XB6000Q"
      };

      // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    const analytics = getAnalytics(app);
    const db = getFirestore(app);
    
    const newsForm = document.getElementById('news-form');
    
    newsForm.addEventListener('submit', async (e) => {
        e.preventDefault();
    
        const content = document.getElementById('content').value;
        const imageUpload = document.getElementById('imageUpload').files[0];
    
        try {
            // Resize image
            const resizedImage = await resizeImage(imageUpload, 500, 500, 0.7);

            // Generate a unique filename
        const uniqueFilename = getUniqueFilename(imageUpload.name);

            // Upload Image to Firebase Storage
            const storage = getStorage(app);
            const storageReference = storageRef(storage, `images/${uniqueFilename}`);
            const uploadTask = await uploadBytes(storageReference, resizedImage);
    
            // Get URL of the uploaded image
            const imageUrl = await getDownloadURL(uploadTask.ref);
    
            // Save content and imageUrl to Firestore
            const docId = await addDoc(collection(db, 'News'), {
                content: content,
                imageUrl: imageUrl, // Store the image URL instead of imageName
                createdAt: new Date(),
                id: ''
            });
            
            // Update id field as a document id
            await updateDoc(doc(db, 'News', docId.id), {
                id: docId.id
            });
    
            // Clear form fields
            document.getElementById('content').value = '';
            document.getElementById('imageUpload').value = '';
    
            alert('News item added successfully!');
        } catch (error) {
            console.error('Error processing image of adding news item: ', error);
        }
    });

    function resizeImage(file, maxWidth, maxHeight, quality) {
        return new Promise((resolve, reject) => {
            // Create an image
            const image = new Image();
            // Create a file reader
            const reader = new FileReader();
    
            reader.onload = (readerEvent) => {
                // Once the file reader has loaded the file
                image.onload = () => {
                    // Create a canvas and get its context
                    const canvas = document.createElement('canvas');
                    const context = canvas.getContext('2d');
    
                    // Calculate the new dimensions
                    let width = image.width;
                    let height = image.height;
    
                    if (width > height) {
                        if (width > maxWidth) {
                            height *= maxWidth / width;
                            width = maxWidth;
                        }
                    } else {
                        if (height > maxHeight) {
                            width *= maxHeight / height;
                            height = maxHeight;
                        }
                    }
    
                    // Set canvas dimensions
                    canvas.width = width;
                    canvas.height = height;
    
                    // Draw the image on canvas
                    context.drawImage(image, 0, 0, width, height);
    
                    // Convert canvas to blob
                    canvas.toBlob((blob) => {
                        resolve(blob);
                    }, 'image/jpeg', quality);
                };
    
                // Set the source of the image to the file
                image.src = readerEvent.target.result;
            };
    
            reader.readAsDataURL(file);
        });
    }
    
    function getUniqueFilename(originalFilename) {
        const timestamp = Date.now(); // Gets the current time in milliseconds
        const fileExtension = originalFilename.split('.').pop(); // Extracts the file extension
        return `${timestamp}-${originalFilename}.${fileExtension}`; // Creates a unique filename
    }
    
    

//     newsForm.addEventListener('submit', async (e) => {
//     e.preventDefault();

//     const content = document.getElementById('content').value;
//     const imageName = document.getElementById('imageName').value;

//     try {
        
//         const docId = await addDoc(collection(db, 'News'), {
//             content: content,
//             imageName: imageName,
//             createdAt: new Date(),
//             id: ''
//         });
        
//         // update id field as a document id
//         await updateDoc(doc(db, 'News', docId.id), {
//             id: docId.id
//         });

//         // Clear form fields
//         document.getElementById('content').value = '';
//         document.getElementById('imageName').value = '';

//         alert('News item added successfully!');
//     } catch (error) {
//         console.error('Error adding news item: ', error);
//     }
// });



