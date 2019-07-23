import React from 'react';
import './App.css';
import Button from '@material-ui/core/Button';
import Fab from '@material-ui/core/Fab';
import Icon from '@material-ui/core/Icon';
import CssBaseline from "@material-ui/core/CssBaseline";
import {Device} from "./types/Device";
import DeviceList from "./components/DeviceList";
import Firebase from "./models/Firebase";
import FirebaseFunctions from "./models/FirebaseFunctions";

interface PushekState {
  devices: Array<Device>;
  pin?: number;
}

class App extends React.Component<{}, PushekState> {

  state: PushekState = {
    devices: []
  };

  loadDevices() {

    const firebase = new Firebase();

    console.log(firebase.getDevices());

  }

  generatePin() {
    const firebaseFunctions = new FirebaseFunctions();
    const pin = firebaseFunctions.generatePin();
  }

  componentDidMount(): void {
    this.loadDevices();
  }

  render() {
    return <React.Fragment>

      <CssBaseline/>

      <Fab color="primary" aria-label="Generate pin" onClick={this.generatePin}>
        <Icon>vpn_key</Icon>
      </Fab>

      <DeviceList devices={this.state.devices}/>
      <Button variant="contained" color="primary" onClick={this.loadDevices} >Hello Johannes!</Button>

    </React.Fragment>
  }
}

// const App: React.FC = () => {
//   return (
//     <Button variant="contained" color="primary">
//     Hello
//       </Button>
//   );
// }

export default App;
