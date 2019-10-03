import React from 'react';
import './App.css';
import Loading from './Loading';
import Results from './Results';
import PreviousSearches from './PreviousSearches';
import NoResults from './NoResults';
import { getSubredditPosts, getSubredditBanner, getAuthor } from './RedditApi';
import { BrowserRouter as Router, Route, NavLink, Switch } from 'react-router-dom';

class App extends React.Component {
  constructor() {
    super();

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.state = {
      posts: [],
      subreddit: '',
      subscribers: '',
      banner: '',
      loading: false,
      userInput: '',
      readCount: 0,
      previousSearches: [],
      showPrevious: false,
      noResults: false,
    };
  }

  handleChange(event) {
    this.setState({ userInput: event.target.value })
  }

  handleClickAnimal = (animal) => {
    this.setState({ userInput: animal }, () => {
      this.getResults();
    });
  }

  async handleSubmit(event) {
    event.preventDefault();
    this.getResults();
  }

  getResults = async() => {
    this.setState({
      loading: true,
      previousSearches: this.state.previousSearches.concat(this.state.userInput),
    });

    let [posts, banner] = await Promise.all([
      getSubredditPosts(this.state.userInput),
      getSubredditBanner(this.state.userInput)
    ]);

    this.setState({
      posts,
      subreddit: posts[0] ? posts[0].data.subreddit : '',
      subscribers: posts[0] ? posts[0].data.subreddit_subscribers : '',
      banner,
      loading: false,
      userInput: '',
      noResults: posts[0] ? false : true,
    });
  }

  handleReadCount = () => {
    this.setState({ readCount: this.state.readCount + 1 });
  }

  handleSearchPrevious = async (term, isAuthor) => {
    this.setState({
      loading: true,
    });

    let posts, banner;
    if(isAuthor) {
      posts = await getAuthor(term);
      banner = '';
    }
    else {
      [posts, banner] = await Promise.all([
        getSubredditPosts(term),
        getSubredditBanner(term)
      ]);
    }

    this.setState({
      posts,
      subreddit: isAuthor ? term : (posts[0] ? posts[0].data.subreddit : ''),
      subscribers: isAuthor ? '' : (posts[0] ? posts[0].data.subreddit_subscribers : ''),
      banner,
      loading: false,
      userInput: '',
      noResults: posts[0] ? false : true,
    });
  }

  handleShowPrevious = () => {
    this.setState({ showPrevious: !this.state.showPrevious })
  }

  handleLoadPosts = async (term, isAuthor) => {
    this.handleSearchPrevious(term, isAuthor);
  }

  render() {
    let backgroundBanner = {
      backgroundImage: `url(${this.state.banner})`
    };

    return (
      <div className="App">
        <div className="readCount">{this.state.readCount}</div>
        <div className="previousSearches">
          { this.state.showPrevious ? <PreviousSearches onShowPrevious={this.handleShowPrevious} onLoadPrevious={this.handleSearchPrevious} previousSearches={this.state.previousSearches}/>
             : <i className="fas fa-bars" onClick={this.handleShowPrevious}></i> }
        </div>

        <div className="header" style={this.state.banner ? backgroundBanner : null} >
          <div className="title">
            <i className="fab fa-reddit-alien"></i>
            Reddit Finder
          </div>
          <form id="redditForm" onSubmit={this.handleSubmit}>
            <input type="text" name="subreddit" placeholder="Enter a topic..." onChange={this.handleChange} value={this.state.userInput}/>
            <button type="submit">Go!</button>
          </form>
        </div>

        <Router>
          <div className="navBar">
            <NavLink to="/animal/cats" onClick={this.handleClickAnimal.bind(this, "cats")}>Cats</NavLink>
            <NavLink to="/animal/chickens" onClick={this.handleClickAnimal.bind(this, "chickens")}>Chickens</NavLink>
            <NavLink to="/animal/cows" onClick={this.handleClickAnimal.bind(this, "cows")}>Cows</NavLink>
            <NavLink to="/animal/dogs" onClick={this.handleClickAnimal.bind(this, "dogs")}>Dogs</NavLink>
            <NavLink to="/animal/pigs" onClick={this.handleClickAnimal.bind(this, "pigs")}>Pigs</NavLink>
          </div>
          <div id="results">
            <Switch>
              <Route path="/animal/:animal" render={(props) => <Results onRead={this.handleReadCount} onLoadPosts={this.handleLoadPosts} posts={this.state.posts} subreddit={this.state.subreddit} subscribers={this.state.subscribers} loading={this.state.loading} {...props} />}/>
              <Route path="/author/:author" render={(props) => <Results onRead={this.handleReadCount} onLoadPosts={this.handleLoadPosts} posts={this.state.posts} subreddit={this.state.subreddit} subscribers={this.state.subscribers} loading={this.state.loading} {...props} />}/>
              <Route path="/" exact={true}>
                {this.state.loading ? <Loading/> : <Results onRead={this.handleReadCount} posts={this.state.posts} subreddit={this.state.subreddit} subscribers={this.state.subscribers} />}
              </Route>
              <Route component={NoResults}/>
            </Switch>
            { this.state.noResults && <NoResults />}
          </div>
        </Router>
      </div>
    );
  }
}

export default App;
