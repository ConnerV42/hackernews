import React, { Component } from 'react';
import debounce from "lodash.debounce";
import './News.css';

class News extends Component {
    constructor(props) {
        super(props);

        this.state = {
            startIndex: 0,
            stopIndex: 40,
            topStoryIds: [],
            topStories: [],
            newStoryIds: [],
            newStories: [],
            comments: [],
            hasMore: true,
            isLoading: false,
        };

        // Binds our scroll event handler
        window.onscroll = debounce(() => {
            const {
                loadStories,
                state: {
                    error,
                    isLoading,
                    hasMore,
                },
            } = this;

            if (error || isLoading || !hasMore) return;

            // Checks that the page has scrolled to the bottom
            if (
                window.innerHeight + document.documentElement.scrollTop
                === document.documentElement.offsetHeight
            ) {
                loadStories();
                console.log("Scrolled to the bottom of page");
            }
        }, 100);
    }

    componentDidMount() {
        this.loadStories();
    }

    loadStories = () => {
        this.setState({ isLoading: true }, async () => {
            let topStoryIds = this.state.topStoryIds;
            if (topStoryIds.length === 0) { // fetch all top story indexes
                let response = await fetch("https://hacker-news.firebaseio.com/v0/topstories.json?");
                topStoryIds = await response.json();
            }

            let topStories = [];
            for (let i = this.state.startIndex; i < this.state.stopIndex; i++) { // fetch 30 stories
                let response = await fetch(`https://hacker-news.firebaseio.com/v0/item/${topStoryIds[i]}.json?`);
                let currentStory = await response.json();
                topStories.push(currentStory);
            }

            let newStoryIds = this.state.newStoryIds;
            if (newStoryIds.length === 0) { // fetch all new story indexes
                let response = await fetch("https://hacker-news.firebaseio.com/v0/newstories.json?");
                newStoryIds = await response.json();
            }

            let newStories = [];
            for (let i = this.state.startIndex; i < this.state.stopIndex; i++) { // fetch 30 stories
                let response = await fetch(`https://hacker-news.firebaseio.com/v0/item/${newStoryIds[i]}.json?`);
                let currentStory = await response.json();
                newStories.push(currentStory);
            }

            console.log(topStories);
            console.log(newStories);

            this.setState({
                hasMore: (this.state.topStories.length < 400),
                isLoading: false,
                topStoryIds,
                topStories: [
                    ...this.state.topStories,
                    ...topStories,
                ],
                newStoryIds,
                newStories: [
                    ...this.state.newStories,
                    ...topStories,
                ],
                startIndex: this.state.stopIndex,
                stopIndex: this.state.stopIndex + 40
            });
        });
    }

    render() {
        let {
            topStories,
        } = this.state;

        console.log(topStories);

        return (
            <div className="News">
                <ul>
                    {topStories.map((story, index) => {
                        return <li key={index}>{story.title}</li>
                    })}
                </ul>
            </div>
        );
    }
}

export default News;