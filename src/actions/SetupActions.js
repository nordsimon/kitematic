import alt from '../alt';
import setupUtil from '../utils/SetupUtil';

class SetupActions {
  retry (removeVM) {
    this.dispatch({removeVM});
    setupUtil.retry(removeVM);
  }
  setEnvironment (env) {
    console.log(env, 'again')
    this.dispatch({env});
    setupUtil.setEnvironment(env);
  }
}

export default alt.createActions(SetupActions);
