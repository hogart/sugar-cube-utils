const ifidRe = /[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i;

function detectStoryEditor(callback) {
    const urlMatch = ifidRe.exec(location.hash);
    if (urlMatch) {
        const storyId = urlMatch[0];

        callback(storyId);
    }

    window.addEventListener('hashchange', () => {
        detectStoryEditor(callback);
    }, false);
}