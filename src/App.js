import React, { Component, useState } from 'react';

const RepoItem = ({ repo }) => {
  const [stargazers, setStargazers] = useState([]);

  const loadStargazer = async () => {
    const stars = await fetch(
      `https://api.github.com/repos/${repo.full_name}/stargazers`
    ).then(res => res.json());
    setStargazers(stars);
  };

  return (
    <li key={repo.id}>
      {repo.name}
      <button onClick={() => loadStargazer()}>Load stargazers</button>
      <ul>
        {stargazers.map(stargazer => (
          <li>{stargazer.login}</li>
        ))}
      </ul>
    </li>
  );
};

class App extends Component {
  state = {
    userInput: '',
    repos: [],
    firstTime: true
  };
  handleChange(name, value) {
    this.setState({
      [name]: value
    });
  }
  handleKeyUp(e) {
    if (e.which === 13) {
      this.search(this.state.userInput);
      this.setState({
        userInput: ''
      });
    }
  }
  async search(username) {
    const user = await fetch(`https://api.github.com/users/${username}`).then(
      res => res.json()
    );
    const repos = await fetch(
      `https://api.github.com/users/${username}/repos`
    ).then(res => res.json());
    this.setState({
      repoCount: user.public_repos,
      page: 1,
      repos,
      username,
      firstTime: false
    });
  }

  async loadMore(username, page) {
    const repos = await fetch(
      `https://api.github.com/users/${username}/repos?page=${page}`
    ).then(res => res.json());
    this.setState({
      repos: [...this.state.repos, ...repos],
      page
    });
  }

  render() {
    const {
      userInput,
      firstTime,
      repos,
      repoCount,
      page,
      username
    } = this.state;

    return (
      <div>
        <input
          value={userInput}
          onKeyUp={e => this.handleKeyUp(e)}
          onChange={e => this.handleChange('userInput', e.target.value)}
        />
        {firstTime && <div>Enter a username name and hit enter to search!</div>}
        <ul>
          {repos.map(repo => (
            <RepoItem repo={repo} key={repo.id} />
          ))}
        </ul>
        {!firstTime && repos.length < repoCount && (
          <button onClick={() => this.loadMore(username, page + 1)}>
            Load more ({repoCount - repos.length} left)
          </button>
        )}
      </div>
    );
  }
}

export default App;
