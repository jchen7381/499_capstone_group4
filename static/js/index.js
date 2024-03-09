// Initialize Supabase
var supabase = Supabase.createClient('https://rrzufyvihrhlnprspyvh.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJyenVmeXZpaHJobG5wcnNweXZoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDk4NTkyNzksImV4cCI6MjAyNTQzNTI3OX0.SoZusxJyuRrcdf-lNlRUxlDAV15A7bLb7ICyK63Mztk');

window.onload = function() {
    // Show the login tab by default
    showTab('login');
}

function showTab(tabName, event) {
    // Get all elements with class="tab" and hide them
    var tabs = document.getElementsByClassName("tab");
    for (var i = 0; i < tabs.length; i++) {
        tabs[i].classList.remove("tab-active");
    }

    // Get all elements with class="tab-button" and remove the class "active"
    var tabButtons = document.getElementsByClassName("tab-button");
    for (var i = 0; i < tabButtons.length; i++) {
        tabButtons[i].className = tabButtons[i].className.replace(" active", "");
    }

    // Show the current tab, and add an "active" class to the button that opened the tab
    document.getElementById(tabName).classList.add("tab-active");
    if (event) {
        event.currentTarget.className += " active";
    }
}

async function signUpNewUser(event) {
    event.preventDefault();
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
            emailRedirectTo: 'https://example.com/welcome',
        },
    })
}

async function signInWithEmail(event) {
    event.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
    })
}

async function signOut() {
    const { error } = await supabase.auth.signOut()
}
