document.addEventListener("DOMContentLoaded", function () {
    const firebaseConfig = {
        apiKey: "AIzaSyDTK8P1Fz7dXaXuk0ZXUj6Foy_mMgGgzpM",
        authDomain: "user-database-237b1.firebaseapp.com",
        projectId: "user-database-237b1",
        storageBucket: "user-database-237b1.appspot.com",
        messagingSenderId: "663583633225",
        appId: "1:663583633225:web:ab54e151d45cf6b8b87498"
    };
    firebase.initializeApp(firebaseConfig);
    
    const registerButton = document.getElementById("register-button");
    const loginButton = document.getElementById("login-button");
    
    registerButton.addEventListener("click", function () {
        const email = document.getElementById("register-email").value;
        const password = document.getElementById("register-password").value;
    
        firebase.auth().createUserWithEmailAndPassword(email, password)
            .then(function (userCredential) {
                console.log("User registered successfully");
            })
            .catch(function (error) {
                console.error(error.message);
            });
    });
    
    loginButton.addEventListener("click", function () {
        const email = document.getElementById("login-email").value;
        const password = document.getElementById("login-password").value;
    
        firebase.auth().signInWithEmailAndPassword(email, password)
            .then(function (userCredential) {
                console.log("User logged in successfully");
            })
            .catch(function (error) {
                console.error(error.message);
            });
    });
    });