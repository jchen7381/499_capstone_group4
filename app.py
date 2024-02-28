from flask import Flask, request, render_template
from aiGenerator import aiGenerator

app = Flask(__name__)

@app.route('/', methods=['GET', 'POST'])
def index():
    image_url = request.form.get('image_url', '')  # Get image URL from form data
    result = None

    if request.method == 'POST':
        if 'regenerate' in request.form:  # Check if the form was submitted for regeneration
            # Regenerate AI output using the existing image URL
            result = aiGenerator(image_url)
        else:
            # Process the submitted image URL
            image_url = request.form.get('image_url', '')
            result = aiGenerator(image_url)

    return render_template('index.html', image_url=image_url, result=result)

if __name__ == '__main__':
    app.run(debug=True)
