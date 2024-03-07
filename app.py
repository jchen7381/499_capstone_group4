from flask import Flask, render_template, request, jsonify
import firebase_admin
from firebase_admin import credentials, auth

app = Flask(__name__)

# Initialize Firebase
cred = credentials.Certificate({
  "type": "service_account",
  "project_id": "user-database-237b1",
  "private_key_id": "5d1cff5893305b83fb78693de2155e62bee0087d",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCo5WFxpxyFabEy\neJ47rl47YkAmwLSKEw+FHvN+tSMfTNFL90ZwRjnp4tuuiluSDPvwxqF30CJANdL+\nydt+TemTs+jePNsHxuXgElZaSqlI6og9P71tVZfXjgFewPykBVlnuwsoRT/y4OhT\nd3pdMKpnNYiu5o4yZny1JcAj6G7V9bXB9fnS/iWfCssJ2yff1ygS7c/evMBq5sC6\nXmtgw04z5KJXmALjBnrd7yYvM6HD1+580Zkf8Kti4WiuEhX33vXWxewJChPejFQQ\nSgCLLbnqz4NhB8UwZA3jGOlY4lWXexl8tEkJzYufDbpfp4AFBnr4+O1ISJioviY3\nk8/+NzjXAgMBAAECggEAO+b/JJwslXTjEA+Pr4MskMtMDXKTldUk0AYmPm5oQpWw\nNc1CAlgl+jonyEPyLl7EjKUmZ6Q+QZ/VceCOJMHlcimBEjFrTdrRdSOL1QJeACqO\nn4qX2Mtey2jmO4EfGd171DqWvnWxNKdoPxJFKAA2r9xg2geTr3SCDo2RFCtABEpJ\nuits3QQ5ZXkfMc+nQYhFaR6txp9FujbLPNfdc2z58OtnxjMK8MKVaPDCGk5HEUSG\nt8rA1Hlp5J+zzZ17oA7V0CAFm1t/dVYcwFKOg1xk9U3D+EmoiRrarhLh15Fdqygw\nhXxUHIJfrO/0+oESL+7lgtZnoz7D08O4qIKOprAKoQKBgQDaiXh1DIpuk1wcxFYu\nDFckV80k3t5DG7d6G80TgULcE305oFFG9RMfnXJs5LlUfF9Zgpu8c9WAyvPplHGx\n7jIalF/oARluCMZl4E/7neI+XYQjNlHKpG+jG1Xu1rcrU73gCHSjfdBTGBVKSfnx\ndRtk51Lim37Xif7L8ff9r9uj3QKBgQDF2WiD7u0O6ll446/2EYipLxPnhBCTUfRQ\nqvT4EAXfGKKy13465Xmyyw7zaLHiJNlIDhAOdlXG1PgyblQ1A8n0sLDBx7JS6l+R\nsMFVhnvlFmfdZA09yYyr4emowreNg2vcClUgq2qmXMU5vQ/g7sysOzFbwsnw2OHX\nsTK3jSZOQwKBgQCxdxle1ARGr1wJ8FabpmHNnY919ZZAoO1qN9FdmYaV+S2j8lCO\ncs5Iyi71xvfJaAZ2Rd36N4aVxDo24NlDSM9fTkZjvSDNfkq+yF2rUxc61e5MOfxJ\ntycBKV2rSqoMgUCcAcHWUoEuOUxwu4pBTnwkgMWKSAPFPMaxD5n3ZSvT8QKBgQCZ\ngTU2KAqFqA4DXaUIplIB8iTfW/gAVXXZoMqwLL5hehvB5rBpweHKdwICmRhq/WwY\nG9EZZ3bl7hckCbYL7ASldPGvZ+FTs8SypRFb6hv2govTme0sI1Shh4ZjCbCge3cU\nInAqCNWWfiQHyEipnJ3wg3yoVVmZJK0VTMas4zb1QQKBgD8AUyLbGsTHeLvKVrzz\njeXuCd6hcbZ35b3hAc6Lhk5zq0gp/eEiAOFkcPUtCdQDrC3TBV4kTjDjISHC/wF/\nJ7fnQKsZh+IRWsVHU8SXsvr0UyZkiGWq7Z4IbFdpp0OtKCChVyUHpC8Dy0AlIyFP\ndDxBzZXOy53rSH+K2ILR84o3\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-4o3b0@user-database-237b1.iam.gserviceaccount.com",
  "client_id": "106199641074140440503",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-4o3b0%40user-database-237b1.iam.gserviceaccount.com",
  "universe_domain": "googleapis.com"
})  
firebase_admin.initialize_app(cred)

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/register", methods=["POST"])
def register():
    email = request.form.get("email")
    password = request.form.get("password")
    try:
        user = auth.create_user(email=email, password=password)
        return jsonify({"success": True, "message": "User created successfully"})
    except Exception as e:
        return jsonify({"success": False, "message": str(e)})

@app.route("/login", methods=["POST"])
def login():
    email = request.form.get("email")
    password = request.form.get("password")
    try:
        user = auth.get_user_by_email(email)
        return jsonify({"success": True, "message": "Login successful"})
    except auth.AuthError as e:
        return jsonify({"success": False, "message": "Invalid email or password"})

if __name__ == "__main__":
    app.run(debug=True)