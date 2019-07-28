import React, { Component } from 'react';
import debounce from "lodash.debounce";
import './News.css';

const CurrentDisplayState = {
    TOP: 1,
    NEW: 2,
    JOBS: 3
};
const STORIESPERSCROLL = 20;

class News extends Component {
    constructor(props) {
        super(props);

        this.state = {
            startIndex: 0,
            stopIndex: STORIESPERSCROLL,
            topStoryIds: [],
            topStories: [],
            newStoryIds: [],
            newStories: [],
            comments: [],
            hasMore: true,
            isLoading: false,
            displayState: CurrentDisplayState.TOP
        };

        this.btnTopNewsClick = this.btnTopNewsClick.bind();
        this.btnNewNewsClick = this.btnNewNewsClick.bind();

        window.onscroll = debounce(() => {
            if (this.state.error || this.state.isLoading || !this.state.hasMore) return;
            if ( // Checks that the page has scrolled to the bottom
                window.innerHeight + document.documentElement.scrollTop
                === document.documentElement.offsetHeight
            ) {
                this.loadStories();
            }
        }, 100);
    }

    componentDidMount() {
        this.loadStories();
    }

    btnTopNewsClick = () => {
        if (this.state.displayState !== CurrentDisplayState.TOP) {
            this.setState({
                displayState: CurrentDisplayState.TOP,
                startIndex: this.state.topStories.length,
                stopIndex: this.state.topStories.length + STORIESPERSCROLL,
                hasMore: true
            });
            this.loadStories();
        }
    }

    btnNewNewsClick = () => {
        if (this.state.displayState !== CurrentDisplayState.NEW) {
            this.setState({
                displayState: CurrentDisplayState.NEW,
                startIndex: this.state.newStories.length,
                stopIndex: this.state.newStories.length + STORIESPERSCROLL,
                hasMore: true
            });
            this.loadStories();
        }
    }

    loadStories = () => {
        this.setState({ isLoading: true }, async () => {
            let storyIds;
            if (this.state.displayState === CurrentDisplayState.TOP) {
                if (this.state.topStoryIds.length === 0) {
                    let response = await fetch("https://hacker-news.firebaseio.com/v0/topstories.json?");
                    storyIds = await response.json();
                } else {
                    storyIds = this.state.topStoryIds;
                }
            } else if (this.state.displayState === CurrentDisplayState.NEW) {
                if (this.state.newStoryIds.length === 0) {
                    let response = await fetch("https://hacker-news.firebaseio.com/v0/newstories.json?");
                    storyIds = await response.json();
                } else {
                    storyIds = this.state.newStoryIds;
                }
            }

            let stories = [];
            for (let i = this.state.startIndex; i < this.state.stopIndex; i++) {
                let response = await fetch(`https://hacker-news.firebaseio.com/v0/item/${storyIds[i]}.json?`);
                let currentStory = await response.json();
                stories.push(currentStory);
            }

            if (this.state.displayState === CurrentDisplayState.TOP) {
                this.setState({
                    hasMore: (this.state.stopIndex < 360),
                    isLoading: false,
                    topStoryIds: storyIds,
                    topStories: [
                        ...this.state.topStories,
                        ...stories,
                    ],
                    startIndex: this.state.stopIndex,
                    stopIndex: this.state.stopIndex + STORIESPERSCROLL
                });
            } else if (this.state.displayState === CurrentDisplayState.NEW) {
                this.setState({
                    hasMore: (this.state.stopIndex < 360),
                    isLoading: false,
                    newStoryIds: storyIds,
                    newStories: [
                        ...this.state.newStories,
                        ...stories,
                    ],
                    startIndex: this.state.stopIndex,
                    stopIndex: this.state.stopIndex + STORIESPERSCROLL
                });
            }
        });
    }

    render() {
        let stories;
        if (this.state.displayState === CurrentDisplayState.TOP) {
            stories = this.state.topStories;
        } else if (this.state.displayState === CurrentDisplayState.NEW) {
            stories = this.state.newStories;
        }

        return (
            <div className="News">
                <div className="container">
                    <a onClick={this.btnTopNewsClick} className="action-button animate blue">Top</a>
                    <a onClick={this.btnNewNewsClick} className="action-button animate red">New</a>
                </div>
                <ul>
                    {stories.map((story, index) => {
                        return <div className="post">
                            <li className="title" key={index}><a href="#" className="link" href={story.url}>{story.title}</a></li>
                            <li className="detail" key={index}>{story.score} points by {story.by} | <a className="link"> +{story.descendants} comments</a></li>
                        </div>
                    })}
                </ul>
            </div>
        );
    }
}

export default News;