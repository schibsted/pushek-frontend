import React, {SyntheticEvent} from 'react';
import Button from '@material-ui/core/Button';
import CssBaseline from "@material-ui/core/CssBaseline";
import {Device} from "./types/Device";
import DeviceList from "./components/DeviceList";
import Firebase from "./models/Firebase";
import FirebaseFunctions from "./models/FirebaseFunctions";
import {Container} from "@material-ui/core";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import ConfigurationForm from "./components/ConfigurationForm";
import Divider from "@material-ui/core/Divider";
import {ConfigurationField} from "./types/ConfigurationField";


interface IField {
    [key: string]: any;
}

interface PushekState {
    devices: Array<Device>;
    checkedDevices: Array<string>;
    fieldsConfiguration: Object;
    configuration: Array<ConfigurationField>
    pin?: string;
}

class App extends React.Component<{}, PushekState> {

    state: PushekState = {
        devices: [],
        checkedDevices: [],
        configuration: [],
        fieldsConfiguration: {},
    };

    async getPin(): Promise<string> {

        if (typeof this.state.pin !== 'undefined') {
            return this.state.pin;
        }

        let pin = window.sessionStorage.getItem('pin');
        if (pin === null) {
            pin = await FirebaseFunctions.generatePin();
            window.sessionStorage.setItem('pin', pin);
        }

        return pin;
    }

    validate = () => {

        const validatedConfiguration = this.state.configuration.map(field => {
            field.error = (field.required && field.value === '');
            return field;
        });

        this.setState({configuration: validatedConfiguration});
    };

    push = () => {

        this.validate();

        if(this.state.configuration.filter(field => field.error).length === 0) {
            this.state.devices.filter((device) =>
                this.state.checkedDevices.indexOf(device.token) !== -1)
                .forEach(device => FirebaseFunctions.push(device, this.state.configuration.reduce(
                    (body: IField, field: ConfigurationField) => {
                        body[field.name]=field.value;
                        return body;
                    }, {})
                ));
        }

    };

    async componentDidMount() {

        const pin = await this.getPin();
        const firebase = new Firebase();
        const fieldsConfiguration: IField = await FirebaseFunctions.getPushDefinition();

        const configuration = Object.keys(fieldsConfiguration).map((fieldName): ConfigurationField => {
            return {
                name: fieldName,
                value: '',
                required: typeof fieldsConfiguration[fieldName]['required'] !== 'undefined',
                error: false,
            };
        });

        this.setState({pin, fieldsConfiguration, configuration});

        firebase.getDevices(pin,
            (devices: Array<Device>) => this.setState({devices})
        );
    }

    handleListElementClick = (token: string) => {

        const currentIndex = this.state.checkedDevices.indexOf(token);
        const newChecked = [...this.state.checkedDevices];

        if (currentIndex === -1) {
            newChecked.push(token);
        } else {
            newChecked.splice(currentIndex, 1);
        }

        this.setState({checkedDevices: newChecked});
    };

    handleFormChange = (event: SyntheticEvent, fieldName: string) => {

        const element = event.target as HTMLInputElement;
        const fields = [...this.state.configuration.map(field => {
            if (field.name === fieldName) {
                field.value = element.value;
            }
            return field;
        })];

        this.setState({configuration: fields});
    };

    render() {
        return <React.Fragment>

            <CssBaseline/>
            <Container maxWidth="lg">
                <Toolbar>
                    <Typography
                        component="h2"
                        variant="subtitle1"
                        color="inherit"
                        noWrap
                        style={{flex: 1}}
                    >
                        Pushek
                    </Typography>
                    <TextField
                        label="Pin"
                        value={this.state.pin}
                        margin="normal"
                    />
                </Toolbar>
                <main>
                    <Divider component="hr"/>
                    <DeviceList devices={this.state.devices} checkedDevices={this.state.checkedDevices}
                                listItemClick={this.handleListElementClick}/>
                    <Divider component="hr"/>

                    <ConfigurationForm fields={this.state.configuration}
                                       onInputChange={this.handleFormChange}
                                       onInputBlur={this.validate}/>
                    <Button href="#" variant="outlined" onClick={() => this.push()}>
                        Send push notification
                    </Button>
                </main>
            </Container>
        </React.Fragment>
    }
}

export default App;
