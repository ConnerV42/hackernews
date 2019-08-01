import React, { Component } from 'react';
import Kid from "./Kid.js";

class CommentTree extends Component {
    constructor(props) {
        super(props);
        this.state = {
            kids: [],
            treeOpen: false,
            loaded: false
        };

        this.loadComments = this.loadComments.bind();
        this.closeComment = this.closeComment.bind();
    }

    loadComments = async () => {
        if (!this.state.loaded) {
            let { story } = this.props;
            let kids = [];
            if (story.kids !== undefined) {
                for (let i = 0; i < story.kids.length; i++) {
                    let response = await fetch(`https://hacker-news.firebaseio.com/v0/item/${story.kids[i]}.json?`);
                    kids.push(await response.json());
                }
                this.setState({ kids, treeOpen: true, loaded: true });
            }
        }
        this.setState({ treeOpen: true });
    }

    closeComment = () => {
        this.setState({ treeOpen: false });
    }

    render() {
        let { kids, treeOpen } = this.state;
        let { story } = this.props;
        if (treeOpen) {
            return (
                <ul>
                    <li className="title"><a className="link" href={story.url}>{story.title}</a></li>
                    <li className="detail" key={story.id}>{story.score} points by {story.by} | <a className="link" onClick={this.closeComment}> {story.descendants} comments -</a></li>
                    {kids.map((kid) => {
                        return <Kid kid={kid}></Kid>
                    })}
                </ul>
            );
        }
        return ( // default render (if comment tree isn't open)
            <ul>
                <li className="title"><a className="link" href={story.url}>{story.title}</a></li>
                <li className="detail" key={story.id}>{story.score} points by {story.by} | <a className="link" onClick={this.loadComments}> {story.descendants} comments +</a></li>
            </ul>
        );
    }
}

export default CommentTree;