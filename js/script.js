const form = document.querySelector('form');
const searchQuery = document.querySelector('#query');
const clearSearch = document.getElementById('clear-search');
const textField = document.querySelector('.container-text-field');
const hotTags = document.getElementById('hot-tags-list');
const imgList = document.querySelector('#images');
const exit = document.getElementById('exit-large-image');
const lightbox = document.getElementById('lightbox');
const footer = document.querySelector('footer');
let pageNumbers = document.getElementById('pagination');
const next = document.getElementById('next');
const prev = document.getElementById('prev');
let dropDownClicked = document.getElementById('drop-down-clicked');
//the numbers of the pagination 
let num2 = document.getElementById('pagination2');
let num3 = document.getElementById('pagination3');
let lastPage = document.getElementById('pagination-last');

//Default value
let pageAmount = 10;
let currentPage = 1;

//Global variables that will store data so it can be used in multiple funcitons 
let searchDataPage; //store data.photos.page
let searchWord; //store query search word
let allPages; //store data.photos.pages 

//Url + key
const url = "https://api.flickr.com/services/rest?method=flickr.photos.search";
const key = "7593a7bf9f9825d3216a39742ebb97a5";


//Event listeners 
//When clicking on the arrow in the search field it runs perPageAmount function
document.getElementById('drop-down-arrow').addEventListener('click', perPageAmount);
//clicking on next and prev buttons to run a function 
next.addEventListener('click', changePage);
prev.addEventListener('click', prevPage);

//Function clear search 
clearSearch.addEventListener('click', () => {
    imgList.innerHTML = "";
    imgList.style.display = 'none';
    footer.style.display = "none";
    searchQuery.value = "";
    dropDownClicked.style.display = 'none';
});


//Function for drop-down menu
function perPageAmount() {
    //When clicking on drop down arrow the class show-content will be added/closed 
    dropDownClicked.classList.toggle('show-content');
    //Only for styling the searchbar in css 
    textField.classList.toggle('clicked');
    //The buttons from html
    let button10 = document.getElementById('amount-10');
    let button50 = document.getElementById('amount-50');
    let button100 = document.getElementById('amount-100');

    if (button10.checked == true) {
        pageAmount = 10;
    } else if (button50.checked == true) {
        pageAmount = 50;
    } else if (button100.checked == true) {
        pageAmount = 100;
    };
};  



//Function for search words
form.addEventListener('submit', e => {
    //Erases ul-element for each new search (when clicking on search button) + resets the variables 
    imgList.innerHTML = "";
    pageNumbers.innerHTML = 1;
    currentPage = 1;
    searchDataPage = "";
    //if currentpage is 1 set num2 = 2 and num3 = 3
    if (currentPage == 1) {
        num2.innerHTML = 2;
        num3.innerHTML = 3;
    };
    
    //If the event is empty it will resolve it before going into the function getImages 
    e.preventDefault(); 
    //Runs the function for the warning and displays for the user what they should do to resolve the problem
    displayWarning (
        "Skriv in ett sökord"
    );

    //Runs the function getImages and sends the value of the input within the parameter 
    getImages(searchQuery.value);
});


//Function for warning when not writing any search word in input 
function displayWarning (msg){
    //if there is no search value 
    if(!searchQuery.value) {
        //sets the message in the placeholder 
        searchQuery.placeholder = msg;
        //changes the style of the textfield 
        textField.style.border = 'solid red';
        //toggles class to change the color of the text of the placeholder 
        searchQuery.classList.toggle('placeholder-without-value');
    };
};


//Async function with searchword.value as a parameter that gets the images from the url 
async function getImages (query) { 
    const response = await fetch(url + `&text=${query}&per_page=${pageAmount}&page=${currentPage}&format=json&nojsoncallback=1&api_key=${key}&sort=relevance`);
    const data = await response.json();

    //sets value of the pages within the image search word 
    searchDataPage = data.photos.page;
    //sets searchword to the query word 
    searchWord = query;
    //sets allpages with how many pages there is within the search word 
    allPages = data.photos.pages;
    //adds class active to pagenumbers 
    pageNumbers.classList.add('active');
    //sets lastpage of the pagination to all of the pages within the search word 
    lastPage.innerHTML = allPages;
    //sends the parameter data.photos.photo to renderImages which is the list of all the images within the search word  
    renderImages(data.photos.photo);  
};



//Function for rendering the response to the interface
let renderImages = (images) => {
    //changes display to grid
    imgList.style.display = 'grid';
    //by making imgList empty the new rendered images will display over the old ones (will replace)
    imgList.innerHTML = "";
    //loops through all images and renderes each one
    images.forEach(image => {
        //creates new li element 
        const imgListItem = document.createElement('li');
        //sets li element to child of ul list 
        imgList.appendChild(imgListItem);
        //sets innerhtml of li element to the images 
        imgListItem.innerHTML = `<img src="https://live.staticflickr.com/${image.server}/${image.id}_${image.secret}_b.jpg">`;
        //adds class to all li elements 
        imgListItem.classList.add('searched-images');
        //changes the footer to visible when searched an image
        footer.style.display = "flex";

        //clicking on image to make it big 
        imgListItem.onclick = function () {
            //changes the display to flex 
            lightbox.style.display = 'flex';
            //adds class to li elements 
            imgListItem.classList.add('preview');
            let content = document.querySelector('.modal-content');
            //sets img to innerhtml of the modal 
            content.innerHTML = `<img src="https://live.staticflickr.com/${image.server}/${image.id}_${image.secret}_b.jpg">`;
            let contentText = document.createElement('h2');
            //sets content text as a child to the content
            content.appendChild(contentText);
            //adds class to the content text element 
            contentText.classList.add('content-text');
            //sets innerhtml of the content as the image title 
            contentText.innerHTML = image.title;
            //changes display to block and makes the X visible 
            exit.style.display = "block";

            //clicking on the exit button to exit the enlarged image 
            exit.onclick = function() {
                lightbox.style.display = 'none';               
            } 
        };
    })   
};


//When clicking on next page button 
function changePage() {
    //adds 1 each time the next button is clicked to both numbers 
    num2.innerHTML++;
    num3.innerHTML++;

    //As long as the page is less then all of the existing pages within the search word it will add by one 
    if(currentPage < allPages) {
        searchDataPage++;
        currentPage++; 
        pageNumbers.innerHTML = searchDataPage; 
        getImages(searchWord); //Sends seachword to getiamages function as a parameter 
    }
    //When clicking on next button the user lands on the beginning of wrapper again 
    document.body.scrollTop = 400; // For Safari
    document.documentElement.scrollTop = 400; //For chrome
};



//Function for going back one page 
function prevPage() {
    if (currentPage > 1) {
        currentPage--;
        searchDataPage--; 
        pageNumbers.innerHTML = searchDataPage;
        num2.innerHTML--;
        num3.innerHTML--;
        getImages(searchWord);
    }
};



//Function hot tags
async function getHotTags() { //tar emot något i parantesen
    const response = await fetch(`https://www.flickr.com/services/rest/?method=flickr.tags.getHotList&api_key=${key}&format=json&nojsoncallback=1&period=week&count=6`);
       
    const data = await response.json(); //för att göra datan läsvänlig 

    // console.log(data.hottags.tag);
    showHotTags(data.hottags.tag);
};


//Function rendering hot tags 
function showHotTags(tags) {
    tags.forEach(tagLi => {
        //creates li elements for every tag and sets li.innerhtml to the tag contents 
        let li = document.createElement('li');
        hotTags.appendChild(li);
        li.innerHTML = tagLi._content;

        //When clicking on a word it collects the clicked items value 
        li.onclick = function() {
            //saves the tag in a variable 
            let clickedTag = tagLi._content;
            pageNumbers.innerHTML = 1;
            currentPage = 1;
            //if currentpage is 1 set num2 = 2 & num3 = 3
            if (currentPage == 1) {
                num2.innerHTML = 2;
                num3.innerHTML = 3;
            };
            //runs getimages with the clickedtag as the query 
            getImages(clickedTag);
        };
    });
};

//runs function getHotTags 
getHotTags();

