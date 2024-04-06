// Your code here
document.addEventListener('DOMContentLoaded',function(){

})
const baseURL="http://localhost:3000" 

fetch('/films/1')
.then(Response=>Response.json())
.then(data=>{
    const id= data.id;
    const title= data.title;
    const runtime=data.runtime;
    const capacity=data.capacity;
    const showtime=data.showtime;
    const ticketsSold=data.ticketsSold;
    const description=data.description;
    const poster=data.poster;


    const availableTickets=capacity-ticketsSold;

    document.getElementById('poster').src = poster;
      document.getElementById('title').innerText = title;
      document.getElementById('runtime').innerText = 'Runtime: ' + runtime + ' minutes';
      document.getElementById('showtime').innerText = 'Showtime: ' + showtime;
      document.getElementById('availableTickets').innerText = 'Available Tickets: ' + availableTickets;
      document.getElementById('description').innerText = description;
    })
    .catch(error => {
      console.error('Error fetching movie data:', error);
    });

