// Your code here
// Create addEventListener with DOM
document.addEventListener('DOMContentLoaded',function(){
    const baseURL="http://localhost:3000"; 

// Base URL for API
    fetch("http://localhost:3000/films/1")
    .then(Response =>Response.json())
    .then(data=> getMovieDetails(data))
     
//   Call a function on getting the movie details  
 function getMovieDetails(movie){

// Selecting the films list
    const filmslist=document.getElementById("films");
    let li=document.createElement("li");
    li.textContent=movie.title;
    filmslist.appendChild(li);


// Working on the Posters
let poster=document.getElementById("poster")
poster.src=movie.poster
poster.alt=`${movie.title}Poster`;

// Working on the movie titles
let title=document.getElementById("title");
title.textContent=movie.title

// Selection of the runtime
let runtime=document.getElementById("runtime");
runtime.textContent=`Runtime: ${movie.runtime}minutes`;

let ticket=document.getElementById("ticket-num");
ticket.textContent=movie.ticket;

 }

//  callout a new function fetching all the movie list based on the id
function movielist(moviesId){
    fetch(`${baseURL}/${moviesId}`)
    .then((Response)=>Response.json())
    .then((data)=>displayMovieList(data));
}

// Displaying the movielist on the page
function displayMovieList(movies){

}

}); 
    
      

   

