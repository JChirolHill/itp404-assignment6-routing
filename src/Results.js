import React from 'react';
import SubredditPost from './SubredditPost';
import Loading from './Loading';
import { parseNum } from './HelperFunctions';

export default class Results extends React.Component {
  constructor(props) {
    super(props);
    console.log(props);
    if(this.props.match) {
      if(this.props.match.params.author) {
        const { author } = this.props.match.params;
        this.props.onLoadPosts(author, true);
      }
      else {
        const { animal } = this.props.match.params;
        this.props.onLoadPosts(animal, false);
      }
    }
  }

  componentDidUpdate(previousProps) {
    if(this.props.match) {
      console.log(this.props.match);
      if(this.props.match.params.author && previousProps.match
        && this.props.match.params.author !== previousProps.match.params.author) {
        const { author } = this.props.match.params;
        this.props.onLoadPosts(author, true);
      }
      else if(this.props.match.params.animal && previousProps.match
        && this.props.match.params.animal !== previousProps.match.params.animal) {
        const { animal } = this.props.match.params;
        this.props.onLoadPosts(animal, false);
      }
    }
  }

  render() {
    return(
      <>
        {this.props.loading && <Loading/>}
        {this.props.subreddit !== '' &&
          <div id="topData">
            Showing results for "{this.props.subreddit}"<br/>
            {this.props.subscribers !== '' && parseNum(this.props.subscribers) + ' Subscribers'}
          </div>
        }

        {this.props.subreddit !== '' && this.props.posts.map((post) => {
          return <SubredditPost onRead={this.props.onRead} post={post.data} key={post.data.id}/>
        })}
      </>
    );
  }
}
