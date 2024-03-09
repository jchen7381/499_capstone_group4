document.addEventListener("DOMContentLoaded", function () {
    const firebaseConfig = {
      apiKey: "AIzaSyCc96lDeYpM5AvvevoLOxR_ZjvfiLeiCL4",
      authDomain: "capstone-user-database.firebaseapp.com",
      databaseURL: "https://capstone-user-database-default-rtdb.firebaseio.com",
      projectId: "capstone-user-database",
      storageBucket: "capstone-user-database.appspot.com",
      messagingSenderId: "203034257754",
      appId: "1:203034257754:web:f1a86d122e7399f5e5ab63"
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