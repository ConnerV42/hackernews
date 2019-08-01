import React, { Component } from 'react';

class Kid extends Component {  // add timestamp's to comments
    constructor(props) {
        super(props);
        this.state = {
            currentKid: this.props.kid,
            kids: []
        };
        this.fetchKids = this.fetchKids.bind();
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

    componentDidMount() {
        this.fetchKids();
    }

    render() {
        let { currentKid, kids } = this.state;
        if (kids.length !== 0) {
            return ( // recursively render Kid components
                <ul>
                    {kids.map((kid) => {
                        return <div>
                            <li className="detail"><strong>{currentKid.by}: </strong></li>
                            <li className="detail" dangerouslySetInnerHTML={{ __html: currentKid.text }}></li>
                            <Kid kid={kid}></Kid>
                        </div>
                    })}
                </ul>
            );
        }

        return ( // default render (if there are no child comments)
            <ul>
                <li className="detail"><strong>{currentKid.by}: </strong></li>
                <li className="detail" dangerouslySetInnerHTML={{ __html: currentKid.text }}></li>
            </ul>
        );
    }
}

export default Kid;