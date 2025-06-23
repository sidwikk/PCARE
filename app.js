import axios from 'axios';

const loadImageBase64 = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });
}

const image = await loadImageBase64(fileData);

axios({
    method: "POST",
    url: "https://serverless.roboflow.com/superworms-1r3ob/1",
    params: {
        api_key: "n2X7gQwFwVV9sftqam36"
    },
    data: image,
    headers: {
        "Content-Type": "application/x-www-form-urlencoded"
    }
})
.then(function(response) {
    console.log(response.data);
})
.catch(function(error) {
    console.log(error.message);
});