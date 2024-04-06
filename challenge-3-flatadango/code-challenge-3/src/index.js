// Your code here
// Create addEventListener with DOM
document.addEventListener('DOMContentLoaded',function(){
    const baseURL="http://localhost:3000/films" 

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
    filmslist.appendChild("li");


// Selecting the Posters
let poster=document.getElementById("poster")
poster.src=movie.poster
poster.alt=`${movie.title}Poster`;

// Selecting the movie titles
let title=document.getElementById("title");
title.textContent=movie.title



 }

}); 
    
      

   

