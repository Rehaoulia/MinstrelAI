import axios, { Axios } from "axios";

export const AxiosInstance = axios.create({
    baseURL: '/',
    headers: {
        'Content-Type': 'application/json'
    }
})

export const generateLyrics = async (query) => {
    try {
        const response = await AxiosInstance.post('http://localhost:8080/ai', query);
        return response;
    } catch (error) {
        console.log(error);
    }
};

export const generateMusic = async (lyrics, genre) => {
    const genOptions = {
        method: 'POST',
        url: 'https://apibox.erweima.ai/api/v1/generate',
        headers: {
            Authorization: 'Bearer {APITOKEN}',
            'Content-Type': 'application/json',
            Accept: 'application/json'
        },
        data: {
            customMode: true,
            instrumental: false,
            prompt: lyrics,
            style: genre,
            title: 'MinstrelSong',
            model: 'V3_5',
            callBackUrl: 'http://192.168.0.100:8080/callback'
        }
    };
    try {
        const callbackResponse = await AxiosInstance.request(genOptions).then(async (response) => {
            let audioResponse;
            do {
                audioResponse = await axios.request({
                    method: 'GET',
                    url: 'https://apibox.erweima.ai/api/v1/generate/record-info',
                    params: { taskId: response.data.data.taskId },
                    headers: {
                        Authorization: 'Bearer eb901d4a7f08d0222c57035ab92314bd',
                        Accept: 'application/json'
                    }
                });

            } while (audioResponse.data.data.status != "SUCCESS");
            return audioResponse;
        });
        return callbackResponse;
    } catch (error) {
        console.log(error);
    }
}
