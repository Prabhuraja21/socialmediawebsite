async function spaDeletePost(data, e){
    const serverResponse = await fetch(e.target.action, {
        method: "POST",
        body: data
    })
    const serverInfo = await serverResponse.text()
    const ourParser = new DOMParser()
    const ourDoc = ourParser.parseFromString(serverInfo, 'text/html')

    const nextURL = document.querySelector('#user-link').href
    history.pushState(nextURL, null, nextURL)

    document.title = ourDoc.title
    document.querySelector(".container--narrow").innerHTML = ourDoc.querySelector(".container--narrow").innerHTML
    $(document).ready(function () {
        $('[data-toggle="tooltip"]').tooltip();
    })
}

async function spaEditPost(data, e){
    const serverResponse = await fetch(e.target.action, {
        method: "POST",
        body: data
    })
    const serverInfo = await serverResponse.text()
    const ourParser = new DOMParser()
    const ourDoc = ourParser.parseFromString(serverInfo, 'text/html')
    document.title = ourDoc.title
    document.querySelector(".container--narrow").innerHTML = ourDoc.querySelector(".container--narrow").innerHTML
    $(document).ready(function () {
        $('[data-toggle="tooltip"]').tooltip();
    })
}

async function spaCreatePost(data, e){
    const serverResponse = await fetch(e.target.action, {
        method: "POST",
        body: data
    })
    const serverInfo = await serverResponse.text()
    const ourParser = new DOMParser()
    const ourDoc = ourParser.parseFromString(serverInfo, 'text/html')
    document.title = ourDoc.title
    document.querySelector(".container--narrow").innerHTML = ourDoc.querySelector(".container--narrow").innerHTML

    const theNewId = ourDoc.querySelector('#post-id').dataset.id
    const newPostPath = `/post/${theNewId}`
    history.pushState(newPostPath, null, newPostPath)
    $(document).ready(function () {
        $('[data-toggle="tooltip"]').tooltip();
    })
}

async function navigateTo(desiredURL){
    const ourPromise = await fetch(desiredURL)
    const ourData = await ourPromise.text()
    const ourParser = new DOMParser()
    const ourDoc = ourParser.parseFromString(ourData, 'text/html')
    document.title = ourDoc.title
    document.querySelector(".container--narrow").innerHTML = ourDoc.querySelector(".container--narrow").innerHTML
    $(document).ready(function () {
        $('[data-toggle="tooltip"]').tooltip();
    })
}

function  sameOrigin(a , b){
    const urlA = new URL(a)
    const urlB = new URL(b)
    return urlA.origin === urlB.origin
}

export default function (){
    document.addEventListener('click', function(e){
        if(e.target.tagName === "A"){
            if(sameOrigin(e.target.href, window.location)){
                console.log('you clicked a link')
                e.preventDefault()
                // add new url to address bar and browser history
                history.pushState(e.target.href, null, e.target.href)
                navigateTo(e.target.href)
            }            
        }
    })

    // listen for when user clicks browser back and forward buttons
    window.addEventListener('popstate', function(e){
    navigateTo(e.state);
    })

    //SPA for form submission
    document.addEventListener('submit', function(e){
        if(e.target.classList.contains("spa-form")){
            e.preventDefault()
            //get the form fields data ready
            const formData = new FormData(e.target)
            const data =new URLSearchParams()
            for (const pair of formData){
                data.append(pair[0], pair[1])
            }

            //create post form here
            if(e.target.classList.contains("create-post-form")){
                spaCreatePost(data,e)
            }

            //edit existing post from here
            if(e.target.classList.contains("edit-post-form")){
                spaEditPost(data,e)
            }

            //delete post from here
            if(e.target.classList.contains("delete-post-form")){
                spaDeletePost(data,e)
            }
        }
    })
}