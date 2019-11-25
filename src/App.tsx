import React from 'react';
import './App.css';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import CssBaseline from "@material-ui/core/CssBaseline";
import {Device} from "./types/Device";
import DeviceList from "./components/DeviceList";
import Firebase from "./models/Firebase";
import FirebaseFunctions from "./models/FirebaseFunctions";
import {Container} from "@material-ui/core";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";

interface PushekState {
    devices: Array<Device>;
    checkedDevices: Array<String>;
    pin?: string;
}

class App extends React.Component<{}, PushekState> {

    state: PushekState = {
        devices: [],
        checkedDevices: [],
    };

    addDevice(type: string) {
        if (typeof this.state.pin !== 'undefined') {
            FirebaseFunctions.registerDevice(this.state.pin, type);
        }
    }

    async getPin(): Promise<string> {

        if (typeof this.state.pin !== 'undefined') {
            return this.state.pin;
        }

        let pin = window.sessionStorage.getItem('pin');
        if (pin === null) {
            pin = await this.generatePin();
        }

        return pin;
    }

    async generatePin(): Promise<string> {
        const pin = await FirebaseFunctions.generatePin();
        this.setState({pin});
        window.sessionStorage.setItem('pin', pin);
        return pin;
    }

    push() {
        const body = {"content": "test content"};

        this.state.devices.filter((device) => this.state.checkedDevices.indexOf(device.token) !== -1).forEach(device => FirebaseFunctions.push(device, body));
    }

    async componentDidMount() {

        const pin = await this.getPin();
        const firebase = new Firebase();

        firebase.getDevices(pin,
            (devices: Array<Device>) => this.setState({devices, pin})
        );
    }

    handleListElementClick = (token: String) => {

        const currentIndex = this.state.checkedDevices.indexOf(token);
        const newChecked = [...this.state.checkedDevices];

        if (currentIndex === -1) {
            newChecked.push(token);
        } else {
            newChecked.splice(currentIndex, 1);
        }

        this.setState({checkedDevices: newChecked});
    };

    render() {
        return <React.Fragment>

            <CssBaseline/>
            <Container maxWidth="lg">
                <Toolbar>
                    <Typography
                        component="h2"
                        variant="h5"
                        color="inherit"
                        align="center"
                        noWrap
                        style={{flex: 1}}
                    >
                        Pushek
                    </Typography>
                    <TextField
                        id="outlined-name"
                        label="Pin"
                        value={this.state.pin}
                        margin="normal"
                        // variant="outlined"
                    />
                    <Button variant="outlined" className="button" onClick={() => this.generatePin()}>
                        <Icon>vpn_key</Icon>
                    </Button>
                    <Button variant="outlined" className="button" onClick={() => this.addDevice('android')}>
                        <Icon>add</Icon>
                        <Icon>android</Icon>
                    </Button>
                    <Button variant="outlined" className="button" onClick={() => this.addDevice('ios')}>
                        <Icon>add</Icon>
                        <Icon>phone_iphone</Icon>
                    </Button>
                </Toolbar>
                <main>
                    <DeviceList devices={this.state.devices} checkedDevices={this.state.checkedDevices}
                                listItemClick={this.handleListElementClick}/>

                    <Button variant="outlined" className="button" onClick={() => this.push()}>
                            Send push notification
                    </Button>
                </main>
                <footer>
                    <Container maxWidth="lg">
                        <Typography variant="subtitle1" align="center" color="textSecondary" component="p">
                            Open source software
                        </Typography>
                    </Container>
                </footer>
            </Container>
        </React.Fragment>
    }
}

export default App;
