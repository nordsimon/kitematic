import _ from 'underscore';
import alt from '../alt';
import containerServerActions from '../actions/ContainerServerActions';
import containerActions from '../actions/ContainerActions';

class ContainerStore {
  constructor () {
    this.bindActions(containerActions);
    this.bindActions(containerServerActions);
    this.containers = {};

    window.c = this
    // Pending container to create
    this.pending = null;
  }

  error ({name, error}) {
    let containers = this.containers;
    if (containers[name]) {
      containers[name].Error = error;
    }
    this.setState({containers});
  }

  start ({name}) {
    let containers = this.containers;
    if (containers[name]) {
      containers[name].State.Starting = true;
      this.setState({containers});
    }
  }

  started ({name}) {
    let containers = this.containers;
    if (containers[name]) {
      containers[name].State.Starting = false;
      containers[name].State.Updating = false;
      this.setState({containers});
    }
  }

  stopped ({id}) {
    let containers = this.containers;
    let container = _.find(_.values(containers), c => c.Id === id || c.Name === id);

    if (containers[container.Name]) {
      containers[container.Name].State.Stopping = false;
      this.setState({containers});
    }
  }

  kill ({id}) {
    let containers = this.containers;
    let container = _.find(_.values(containers), c => c.Id === id || c.Name === id);

    if (containers[container.Name]) {
      containers[container.Name].State.Stopping = true;
      this.setState({containers});
    }
  }

  rename ({name, newName}) {
    let containers = this.containers;
    let data = containers[name];
    data.Name = newName;

    if (data.State) {
      data.State.Updating = true;
    }

    containers[newName] = data;
    delete containers[name];
    this.setState({containers});
  }

  added ({container}) {
    let containers = this.containers;
    containers[container.Name] = container;
    this.setState({containers});
  }

  update ({name, container}) {
    let containers = this.containers;
    if (containers[name] && containers[name].State && containers[name].State.Updating) {
      return;
    }

    if (containers[name].State.Stopping) {
      return;
    }

    _.extend(containers[name], container);

    if (containers[name].State) {
      containers[name].State.Updating = true;
    }

    this.setState({containers});
  }

  updated ({container}) {
    let containers = this.containers;
    if (containers[container.Name] && containers[container.Name].State.Updating) {
      return;
    }
    // Trigger log update
    // TODO: fix this loading multiple times
    // LogStore.fetch(container.Name);

    containers[container.Name] = container;

    this.setState({containers});
  }

  allUpdated ({containers}) {
    this.setState({containers});
  }

  // Receives the name of the container and columns of progression
  // A column represents progression for one or more layers
  progress ({name, progress}) {
    let containers = this.containers;

    if (containers[name]) {
      containers[name].Progress = progress;
    }

    this.setState({containers});
  }

  destroyed ({id}) {
    let containers = this.containers;
    let container = _.find(_.values(containers), c => c.Id === id || c.Name === id);

    if (container && container.State && container.State.Updating) {
      return;
    }

    if (container) {
      delete containers[container.Name];
      this.setState({containers});
    }
  }

  waiting({name, waiting}) {
    let containers = this.containers;
    if (containers[name]) {
      containers[name].State.Waiting = waiting;
    }
    this.setState({containers});
  }

  pending ({repo, tag}) {
    let pending = {repo, tag};
    this.setState({pending});
  }

  clearPending () {
    this.setState({pending: null});
  }

  static generateName (repo) {
    const base = _.last(repo.split('/'));
    const names = _.keys(this.getState().containers);
    var count = 1;
    var name = base;
    while (true) {
      if (names.indexOf(name) === -1) {
        return name;
      } else {
        count++;
        name = base + '-' + count;
      }
    }
  }
}

export default alt.createStore(ContainerStore);
