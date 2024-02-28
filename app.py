from flask import Flask, request, render_template
from aiGenerator import aiGenerator

app = Flask(__name__)

@app.route('/', methods=['GET', 'POST'])
def index():
    image_url = request.form.get('image_url', '')  # Get image URL from form data
    user_input = request.form.get('user_input', '')  # Get user input from form data
    result = None

    if request.method == 'POST':
        if 'regenerate' in request.form:  # Check if the form was submitted for regeneration
            # Regenerate AI output using the existing image URL and user input
            result = aiGenerator(image_url, user_input)
        else:
            # Process the submitted image URL and user input
            image_url = request.form.get('image_url', '')
            user_input = request.form.get('user_input', '')
            result = aiGenerator(image_url, user_input)

    return render_template('index.html', image_url=image_url, result=result)

if __name__ == '__main__':
    app.run(debug=True)
