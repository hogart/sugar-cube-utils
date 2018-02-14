function snapPassages() {
    const urlMatch = ifidRe.exec(location.hash);
    if (urlMatch) {
        const storyId = urlMatch[0];

        const passages = localStorage.getItem('twine-passages').split(',')
            .map((pid) => JSON.parse(localStorage.getItem(`twine-passages-${pid}`)))
            .filter((passage) => passage.story === storyId);

        function snapCoord(coord) {
            return Math.round(coord / 25) * 25
        }

        passages.forEach((passage) => {
            passage.left = snapCoord(passage.left);
            passage.top = snapCoord(passage.top);

            localStorage.setItem(`twine-passages-${passage.id}`, JSON.stringify(passage))
        });
    }
}