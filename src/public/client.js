let store = Immutable.Map({
    user: { name: "Paul" },
    navIndex: 0,
    photos: [],
    info: [],
    rover: ['curiosity', 'opportunity', 'spirit'],
})

// Add our markup to the page
const root = document.getElementById('root')

// Store is updated with fetched obj 
const updateStore = (store, newState) => {
    store = Object.assign(store, newState)
    render(root, store)
}

const updateIndex = (state, newState) => {
    store = state.merge(newState)
}

// Root is updated with data from the store:
const render = async (root, state) => {
    root.innerHTML = App(state)
}

// Navigation helper function
const changeIndex = (element, index) => {    
    const navigation = document.getElementsByClassName("nav-item");
    for(let i = 0; i < navigation.length; i++) {
        if(navigation[i] === element) {
            navigation[i].classList.add('active');
            updateIndex(store, {navIndex: i})
            index = i;
        } else {
            navigation[i].classList.remove('active');
        }
    }
    getInfo(store, store.get('rover')[index]);
    getPhotos(store, store.get('rover')[index]);
}

// Inner html of the root is updated. Create content.
const App = (state) => {
    let rovers = state.get('rover');
    let info = state.get('info');
    let photos = state.get('photos');    
    let name = state.get('user');

    return `
        ${Header(rovers)}
        ${Main(info, photos, displayRoverPhotos, displayRoverInfo)}
        ${Footer(name.name)}
    `
}

// Listening for load event GET API loaded from our express routes
window.addEventListener('load', () => {
    getInfo(store, store.get('rover')[0]);
    getPhotos(store, store.get('rover')[0]);
    render(root, store)
})

// ------------------------------------------------------  COMPONENTS
const Header = (state) => {
    const navigationElements = state.map((element,index) => {
        const a = `<a id="${element}" class="nav-item ${index === store.get("navIndex") ? "active" : ""}" onclick='changeIndex(${element},${index})'> ${element} </a>`
        return a
    }).join(' ');
    return `<header class="navigation">
                <p>NASA Mars Dashboard</p>
                <div class="navigation__tabs">${navigationElements}</div>
            </header>`;
}

const Main = (info, photos, displayRoverPhotos, displayRoverInfo) => {
    const roverData = displayRoverInfo(info);
    const roverPhotos = displayRoverPhotos(photos);
    return `
        <section class="rover-container">
            ${roverData} 
            <div class="photo-container">
            <h1 class="title">Most recently available photos</h1>
            ${roverPhotos}
            </div>
        </section>
    `
}

const Footer = (name) => {
    return `
        <footer>Welcome back, <span>${name}</span>. This is your <span>Udacity</span> Mars rover dashboard.</footer>
    `
}

// Functions that renders infomation requested from the backend
const displayRoverInfo = (state) => {
    const roverData = state.photo_manifest;
    return (
        `
        <div class="info-container">
        <h1 class="title">Rover Name: ${roverData.name}</h1>
            <div class="info-inner">
                <p class="launch">Launch Date: ${roverData.launch_date}</p>
                <p class="landing">Landing Date: ${roverData.landing_date}</p> 
                <p class="status">Status: ${roverData.status}</p>
            </div>
        </div>
        `
    )
}

const displayRoverPhotos = (state) => {
    const roverData = state.latest_photos;
    let content = ``;
    if (roverData == undefined) {
        content += `<div>
            <div class="news">There is no any news</div>
        </div>
        `
    } else {
        roverData.map(element => {
            content += `<div class="img-container">
                        <div class="col">
                        <img src=${element.img_src} alt="image"/>
                        <p>Earth-Date: ${element.earth_date}</p>
                        </div>
                </div>
            `
        })
    }
    return content;
}

// ------------------------------------------------------  API CALLS
const getPhotos = async (state, rover) => {
    fetch(`http://localhost:3000/roverimages/${rover}`)
        .then(res => res.json())
        .then(data => {
            const newState = state.set('photos', data);
            updateStore(state, newState);
            render(root, store);
        })
}

const getInfo = async (state, rover) => {   
    fetch(`http://localhost:3000/roverdata/${rover}`)
    .then(res => res.json())
    .then(data => {
        const newState = state.set('info', data);
        updateStore(state, newState);    
        render(root, store);
    })
}



