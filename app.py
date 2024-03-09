from flask import Flask, render_template

app = Flask(__name__)

# Initialize Firebase
cred = credentials.Certificate({
  "type": "service_account",
  "project_id": "capstone-user-database",
  "private_key_id": "5efb4538b134a23df0e384fdc17869e42db5ae08",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQDT9xd6AuMsBBfW\nuAnM9t1SrKfLb0/WxR/TJI5+lnSo3r06beAxnpATnz79l/8Aea57KrtMU7i0dxlv\niHxCqEuzk0q3KVe018VFL1/hjUD6isi9oA5PIZVQLQBW6Db2jQcTrggBPXF2DSOF\nU1ECaKyg0MrWZQno6WyX/vdgiTH6fRg9bx7/Fj2PUQ2E3HTlejO8xYDMUlPvFgBu\nQRt6TXH1kK08F312FCiuKbAJM21nvrtFBV4DCBae3WMYIZzVEQOGzS9I9yjM6qED\nqqUgkuKwgAQYUj+WZQnpqFnG+D1lV6+KoBMhHIIh/kzPi/vvjzevkH3BNbiYmARH\npb7decq3AgMBAAECggEAE5AD9ipLDhZontQIb4a/IXC24cMpsrApwkJm9k7rgGRi\nQYC/hsTUFkOFvEDpc4FHda2ZcK9vZhRx4AXQNhSzO+UVqbbildmuJrb7GeWAAD+L\nzFh3yZzXW3lzxRGUdQfKBepzaa3iiVsoEpeAbAD+Ia9zcPsNQZY9g/+vlBTFbJEw\n7LcFfKSZ8mDNRyYQMrpXJ7rYTFPxh7lNk7qI+UFBVycqalYqnMlueM9T9O/ms19O\nzQexOpKJz2eu1VjKT6/Gdd6td2L8TFIPDabhj5uVsnmMUYVWEwD+yMb/yuRaU3RA\niIEUKVHPhmnBBAQRkt8gVJfu/n4f3xmIgEHIK4fU3QKBgQD6uHrwxQL02LelD9+Q\nuTZotHbA8wgJe+pOxtxqW8fvK4lABXlITxse3/qyEiDe/CCiCXFdFfBwcVN6C5Vd\nPdJVlR3Kzvrleodi+e5CpaS97UBEnJrSjAqFX5ds/fhImpVL/ryOFcphvMEThjR+\nV4UFQTLpdtuQg+edMal6h844nQKBgQDYbbLi7K5g5xJNLlAF74Gc8CPqcO3Gfvx9\nRqJ6JgZCFC5tAGr/QQAjS7SZbuDMSYvDw+J2XZRn234tJd+0qVW9eJa5ZeIep+Op\nC/Xv4xBJXvNcZgowA+VqKNsVzV/P5KidHj4GEyxWWYu3uDp+l0/VXw3WC3PwHkeU\n6TyEyB2eYwKBgAOuJY/XNH3nmHqByyRSs6vBymR2rM2G1h+l56JgCoVGPFOGQQuA\nrcM8Qm/OuFDNnqUCQnm9UrQz1afa96xQtf+vmqpZc3Fe5RHc3VR5HfvzuZfIPLWO\nfLEMgCqHZ9eY/UwKRzZGt5vLq4Hf3HFmU3uKQ3cN2Zc7eHDkQ7qat7o5AoGAQOKi\nfuX2YZblJb58v0rO0P4txluU7a2khOpoS7aaqbTjNkqpyVzzbaGEw3s6agSiok5X\n1qS3mWt0qJRyPPeHfQZqKash34718fhkA0dP2q9cxpbQ9xQz81/MTv0DfJBQ/MnU\nTn3xDPJLsQjKgKlchdu5ijJkz9hEHaDPQ/+64YECgYACiXiQqcNz14pNX5C5CiW2\n60o7xE+xWEC50e325OGcsd4Q83UlX4QZlOa3uo4NE2YPr6QJUXQ27ULcWTZEtJ/Q\nMo54JEPbj8wnDItH6h/nDPw/f3kKMCphv+Z2iTDTYMqN4DWnOcnnbYSCk0vmrYtV\nep9jTp50jrBkEqzatAY2Iw==\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-v9hj6@capstone-user-database.iam.gserviceaccount.com",
  "client_id": "113243021901378324601",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-v9hj6%40capstone-user-database.iam.gserviceaccount.com",
  "universe_domain": "googleapis.com"
})  
firebase_admin.initialize_app(cred)

@app.route("/")
def index():
    return render_template('login.html')
if __name__ == "__main__":
    app.run(debug=True)
