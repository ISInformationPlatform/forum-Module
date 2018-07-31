module.exports = {
    URL: 'mongodb://localhost:27017/',
    DATABASE: 'ISInformationPlatform',
    forum: [
        {
            section_id: 1,
            post_collection: 'post_first',
            comment_collection: 'comment_first',
            title: '工作'
        },
        {
            section_id: 2,
            post_collection: 'post_second',
            comment_collection: 'comment_second',
            title: '出国'
        },
        {
            section_id: 3,
            post_collection: 'post_third',
            comment_collection: 'comment_third',
            title: '读研'
        }
    ]
}
