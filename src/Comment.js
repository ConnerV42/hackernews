import React, { Component } from 'react';
import "./Comment.css";

class Comment extends Component {  // add timestamp's to comments
    constructor(props) {
        super(props);
        this.state = {
            currentKid: this.props.kid,
            kids: [],
            collapsed: false,
        };
        this.fetchKids = this.fetchKids.bind();
        this.collapse = this.collapse.bind();
    }

    fetchKids = async () => {
        let { currentKid } = this.state;
        let kids = [];
        if (currentKid.kids !== undefined) {
            for (let i = 0; i < currentKid.kids.length; i++) {
                let response = await fetch(`https://hacker-news.firebaseio.com/v0/item/${currentKid.kids[i]}.json?`);
                kids.push(await response.json());
            }
            this.setState({ kids });
        }
    }

    collapse = () => {
        this.setState({ collapsed: !this.state.collapsed });
    }

    componentDidMount = () => {
        this.fetchKids();
    }

    render = () => {
        let { currentKid, kids, collapsed } = this.state;
        if (currentKid.text === undefined || currentKid.by === undefined) return null;
        if (kids.length !== 0 && !collapsed) {
            console.log(currentKid.time);
            return ( // recursively render Kid components
                <ul className="comment">
                    <li className="comment-detail"><a className="link" onClick={this.collapse}>{currentKid.by} {collapsed ? '[+]' : '[-]'}</a></li>
                    <li className="comment-text" dangerouslySetInnerHTML={{ __html: currentKid.text }}></li>
                    {kids.map((kid) => <Comment kid={kid}></Comment>)}
                </ul>
            );
        }
        else if (collapsed) {
            return (
                <ul className="comment">
                    <li className="comment-detail"><a className="link" onClick={this.collapse}>{currentKid.by} {collapsed ? '[+]' : '[-]'}</a></li>
                </ul>
            );
        }
        return ( // default render (if there are no child comments)
            <ul className="comment">
                <li className="comment-detail"><a className="link" onClick={this.collapse}>{currentKid.by} {collapsed ? '[+]' : '[-]'}</a></li>
                <li className="comment-text" dangerouslySetInnerHTML={{ __html: currentKid.text }}></li>
            </ul>
        );
    }
}

export default Comment;