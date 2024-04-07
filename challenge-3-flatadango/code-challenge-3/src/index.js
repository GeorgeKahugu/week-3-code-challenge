// Your code here
document.addEventListener('DOMContentLoaded', function () {
    // Call the function to getAllFilms here, this will get films as soon as the 'DOMContentLoaded' event is executed
    getAllFilms();
    getSelectedFilm(1); // On load we get the first item on the films list always
  
    var button = document.getElementById('buy-ticket');
  
    // Attach a click event listener to the button
    button.addEventListener('click', function (event) {
  
      // Traverse the DOM to access film data associated with the clicked button
      const card = event.target.closest('.card');
      if (card) {
        const ticketAvailable = parseInt(card.querySelector('#ticket-num').textContent) - 1;
        const title = card.querySelector('#title');
        const filmId = parseInt(title.getAttribute('data-id'));
        const capacity = parseInt(title.getAttribute('data-capacity'))
  
        patchBuyTicket(filmId, capacity, ticketAvailable);
        postNewTicket(filmId, ticketAvailable);
      }
  
      // You can add any functionality you want here
    });
  
    unorderedList = this.getElementById('films')
  
    unorderedList.addEventListener('click', event => {
      console.log(event.target.tagName);
      // Check if the clicked element is an <li> element
      if (event.target.tagName === 'LI') {
        // Retrieve the film id of the clicked <li> element
        const filmId = event.target.getAttribute('data-id');
  
        // Do something with the clicked movie (e.g., display its title)
        console.log('Clicked movie:', filmId);
  
        // Call the API method when this event runs:
        getSelectedFilm(filmId);
      }
  
      if (event.target.tagName === 'BUTTON') {
        // Retrieve the film id of the clicked <li> element
        const filmId = event.target.getAttribute('data-id');
  
        // Do something with the clicked movie (e.g., display its title)
        console.log('Delete movie:', filmId);
  
        const listItem = event.target.closest('li');
  
        listItem.remove();
        
        // Call the API method when this event runs:
        deleteFilm(filmId);
      }
    });
  
    // Event listener for delete button
    // deleteButton.addEventListener('click', (event) => {
    //   // Get the parent <li> element of the clicked button
    //   const listItem = event.target.closest('li');
      
    //   // Remove the parent <li> element from the list
    //   listItem.remove();
  
    //   // call delete api
    //   deleteFilm(film.id);
  
    //   // The call fetch all
    //   getAllFilms();
    // });
  
  })
  const baseURL = "http://localhost:3000"
  
  /** FUNCTIONS: */
  
  // As the name states this will get all films:
  function getAllFilms() {
  
    var url = baseURL + '/films'
  
    console.log(url)
  
    fetch(url)
      .then(response => {
        // Get the ReadableStream from the response body
        const stream = response.body;
  
        // Create a new TextDecoder to decode the chunks of data
        const decoder = new TextDecoder('utf-8');
  
        // Initialize an empty string to accumulate the decoded data
        let accumulatedData = '';
  
        // Create a reader for the stream
        const reader = stream.getReader();
  
        // Function to recursively read chunks of data from the stream
        function readNextChunk() {
          reader.read().then(({ done, value }) => {
            if (done) {
              // All chunks have been read, parse the accumulated data as JSON
              const films = JSON.parse(accumulatedData);
  
              // Get the <ul> element by its id
              const ul = document.getElementById('films');
  
              // Clear existing content of the <ul> element
              ul.innerHTML = '';
  
              // Iterate over the JSON array and create <li> elements
              films.forEach(film => {
                // Create a new <li> element
                const li = document.createElement('li');
  
                // Add a class to the <li> element
                li.classList.add('film', 'item');
  
                if (film.capacity === film.tickets_sold) {
                  li.classList.add('sold-out');
                }
  
                // Set the inner text of the <li> element to the JSON item
                li.textContent = film.title.toUpperCase();
  
                // Set id for retrieval
                li.id = 'film_' + film.id;
  
                // Set data-id
                li.setAttribute('data-id', film.id);
  
                // Delete button
                const deleteButton = document.createElement('button');
                deleteButton.id = 'delete_film_' + film.id;
                deleteButton.setAttribute('data-id', film.id);
                deleteButton.textContent = 'Delete';
  
                li.appendChild(deleteButton);
  
                // Append the <li> element to the <ul> element
                ul.appendChild(li);
              });
              return;
            }
  
            // Decode the chunk of data and append it to the accumulated data
            const decodedChunk = decoder.decode(value, { stream: true });
            accumulatedData += decodedChunk;
  
            // Continue reading next chunk
            readNextChunk();
          }).catch(error => {
            // Handle errors that occur during reading
            console.error('Error reading stream:', error);
          });
        }
  
        // Start reading the stream
        readNextChunk();
      })
      .catch(error => {
        // Handle errors that occur during the fetch
        console.error('Error fetching data:', error);
      });
  
  }
  
  function getSelectedFilm(selectedFilmId) {
  
    var url = baseURL + '/films/' + selectedFilmId;
  
    fetch(url)
      .then(response => {
        // Get the ReadableStream from the response body
        const stream = response.body;
  
        // Create a new TextDecoder to decode the chunks of data
        const decoder = new TextDecoder('utf-8');
  
        // Initialize an empty string to accumulate the decoded data
        let accumulatedData = '';
  
        // Create a reader for the stream
        const reader = stream.getReader();
  
        // Function to recursively read chunks of data from the stream
        function readNextChunk() {
          reader.read().then(({ done, value }) => {
            if (done) {
              // All chunks have been read, parse the accumulated data as JSON
              const film = JSON.parse(accumulatedData);
  
              console.log(film)
  
              // Function to set showoing card
              initialiseCard(film);
  
              if (film.capacity === film.tickets_sold) {
                var button = document.getElementById('buy-ticket');
  
                button.innerHTML = "Sold Out";
                button.disabled = true;
              }
  
              return;
            }
  
            // Decode the chunk of data and append it to the accumulated data
            const decodedChunk = decoder.decode(value, { stream: true });
            accumulatedData += decodedChunk;
  
            // Continue reading next chunk
            readNextChunk();
          }).catch(error => {
            // Handle errors that occur during reading
            console.error('Error reading stream:', error);
          });
        }
  
        // Start reading the stream
        readNextChunk();
      })
      .catch(error => {
        // Handle errors that occur during the fetch
        console.error('Error fetching data:', error);
      });
  }
  
  function patchBuyTicket(filmId, capacity, ticketAvailable) {
    var url = baseURL + '/films/' + filmId;
  
    const options = {
      method: 'PATCH',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        "tickets_sold": parseInt(capacity - ticketAvailable),
      })
    }
  
    fetch(url, options)
      .then(response => {
        // Get the ReadableStream from the response body
        const stream = response.body;
  
        // Create a new TextDecoder to decode the chunks of data
        const decoder = new TextDecoder('utf-8');
  
        // Initialize an empty string to accumulate the decoded data
        let accumulatedData = '';
  
        // Create a reader for the stream
        const reader = stream.getReader();
  
        // Function to recursively read chunks of data from the stream
        function readNextChunk() {
          reader.read().then(({ done, value }) => {
            if (done) {
              // All chunks have been read, parse the accumulated data as JSON
              const film = JSON.parse(accumulatedData);
  
              initialiseCard(film);
              // console.log(film)
  
              return;
            }
  
            // Decode the chunk of data and append it to the accumulated data
            const decodedChunk = decoder.decode(value, { stream: true });
            accumulatedData += decodedChunk;
  
            console.log(decodedChunk)
  
            // Continue reading next chunk
            readNextChunk();
          }).catch(error => {
            s
            // Handle errors that occur during reading
            console.error('Error reading stream:', error);
          });
        }
  
        // Start reading the stream
        readNextChunk();
      })
  }
  
  function postNewTicket(filmId, ticketAvailable) {
    var url = baseURL + '/tickets';
  
    const options = {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        "film_id": filmId,
        "number_of_tickets": parseInt(ticketAvailable),
      })
    }
  
    fetch(url, options)
      .then(response => {
        // Get the ReadableStream from the response body
        const stream = response.body;
  
        // Create a new TextDecoder to decode the chunks of data
        const decoder = new TextDecoder('utf-8');
  
        // Initialize an empty string to accumulate the decoded data
        let accumulatedData = '';
  
        // Create a reader for the stream
        const reader = stream.getReader();
  
        // Function to recursively read chunks of data from the stream
        function readNextChunk() {
          reader.read().then(({ done, value }) => {
            if (done) {
              // All chunks have been read, parse the accumulated data as JSON
              const film = JSON.parse(accumulatedData);
  
              initialiseCard(film);
              // console.log(film)
  
              return;
            }
  
            // Decode the chunk of data and append it to the accumulated data
            const decodedChunk = decoder.decode(value, { stream: true });
            accumulatedData += decodedChunk;
  
            console.log(decodedChunk)
  
            // Continue reading next chunk
            readNextChunk();
          }).catch(error => {
            s
            // Handle errors that occur during reading
            console.error('Error reading stream:', error);
          });
        }
  
        // Start reading the stream
        readNextChunk();
      })
  }
  
  function deleteFilm(filmId) {
    var url = baseURL + '/films/' + filmId;
  
    const options = {
      method: 'DELETE',
      headers: {
        "Content-Type": "application/json",
      },
    }
  
    fetch(url, options)
      .then(response => {
        // Get the ReadableStream from the response body
        const stream = response.body;
  
        // Create a new TextDecoder to decode the chunks of data
        const decoder = new TextDecoder('utf-8');
  
        // Initialize an empty string to accumulate the decoded data
        let accumulatedData = '';
  
        // Create a reader for the stream
        const reader = stream.getReader();
  
        // Function to recursively read chunks of data from the stream
        function readNextChunk() {
          reader.read().then(({ done, value }) => {
            if (done) {
              // All chunks have been read, parse the accumulated data as JSON
              const film = JSON.parse(accumulatedData);
  
              initialiseCard(film);
              // console.log(film)
  
              return;
            }
  
            // Decode the chunk of data and append it to the accumulated data
            const decodedChunk = decoder.decode(value, { stream: true });
            accumulatedData += decodedChunk;
  
            console.log(decodedChunk)
  
            // Continue reading next chunk
            readNextChunk();
          }).catch(error => {
            s
            // Handle errors that occur during reading
            console.error('Error reading stream:', error);
          });
        }
  
        // Start reading the stream
        readNextChunk();
      })
  }
  
  function initialiseCard(film) {
    // Get container
    const container = document.getElementById('showing');
  
    // Set title
    const title = document.getElementById('title');
    title.textContent = film.title;
    title.setAttribute('data-id', film.id);
    title.setAttribute('data-capacity', film.capacity);
  
    // Set runtime
    const runtime = document.getElementById('runtime');
    runtime.textContent = film.runtime + " minutes";
  
    // Set film-info
    const filmInfo = document.getElementById('film-info');
    filmInfo.textContent = film.description;
  
    // Set showtime
    const showtime = document.getElementById('showtime');
    showtime.textContent = film.showtime;
  
    // Set ticket-num
    const ticketNum = document.getElementById('ticket-num');
    ticketNum.textContent = film.capacity - film.tickets_sold; // TODO: make a function to calculate remaining tickets
  
    // Set poster
    const poster = document.getElementById('poster');
    poster.src = film.poster;
  }