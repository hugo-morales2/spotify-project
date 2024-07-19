const SongAdd = () => {
  return (
    <>
      <h1> Add Song!</h1>
      <form>
        <label>
          Name:
          <input type="text" name="name" />
        </label>
        <input type="submit" value="Submit" />
      </form>
    </>
  );
};

export default SongAdd;

/*


    <form id="add-song-form">
        <label for="track-name">Track Name:</label>
        <input type="text" id="track-name" name="track-name" required><br>
        <label for="artist-name">Artist Name:</label>
        <input type="text" id="artist-name" name="artist-name" required><br>
        <button type="submit">Add Song</button>
    </form>

    <div id="status"></div>
    <!--<script src="{{ url_for('static', filename='js/script.js') }}"></script>-->

    <br><br>

    <form id="add-song-form-id">
        <label for="track-id">Track ID:</label>
        <input type="text" id="track-id" name="track-id" required><br>
        <button type="submit">Add Song</button>
    </form>

    <div id="status-id"></div>

    <script>
        // this is to print the success or failure statuses
        const messageDiv = document.getElementById('message');
        document.getElementById("add-song-form").addEventListener("submit", function(event) {
            event.preventDefault(); // Prevent the default form submission
            
            // Get the input values
            var trackName = document.getElementById("track-name").value;
            var artistName = document.getElementById("artist-name").value;
            
            // Create a JSON object with the input values
            var formData = {
                "track_name": trackName,
                "artist_name": artistName
            };
            
            // Send a POST request to the Flask server
            fetch("/add-song", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            })
            .then(response => response.json())  
            .then(data => {
                console.log(data); // Log the response from the server
                

                // Optionally, display a message to the user indicating success or failure
            })
            .catch(error => {
                console.error("Error:", error); // Log any errors
            });
        });

    

        document.getElementById("add-song-form-id").addEventListener("submit", function(event) {
            event.preventDefault(); // Prevent the default form submission
            
            // Get the input values
            var trackID = document.getElementById("track-id").value;
            
            // Create a JSON object with the input values
            var formData = {
                "track_id": trackID
            };
            
            // Send a POST request to the Flask server
            console.log(formData.track_id)
            fetch("/add-song-by-id", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            })
            .then(response => response.json())
            .then(data => {
                console.log(data); // Log the response from the server
                // Optionally, display a message to the user indicating success or failure
            })
            .catch(error => {
                console.error("Error:", error); // Log any errors
            });
        });
    </script>
*/
