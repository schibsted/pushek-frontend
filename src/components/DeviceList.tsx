import React, {FunctionComponent} from 'react';
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import List from "@material-ui/core/List";
import {Device} from "../types/Device";
import Checkbox from "@material-ui/core/Checkbox";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import Icon from "@material-ui/core/Icon";
import {ListItemSecondaryAction, IconButton} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";

type DeviceListProps = {
    devices: Array<Device>
    checkedDevices: Array<String>
    listItemClick: Function
}

const DeviceList: FunctionComponent<DeviceListProps> = ({devices = [], checkedDevices = [], listItemClick}) => {

    let devicesList = <Typography
        component="p"
        variant="inherit"
        color="inherit"
        noWrap
        style={{flex: 1, margin: 20}}
    >
        Empty device list
    </Typography>;

    if(devices.length > 0) {
        devicesList =  <List className="Device-list" component="ul">
            {
                devices.map((device) => (
                    <ListItem button key={device.token} onClick={() => listItemClick(device.token)} component="ul">
                        <ListItemIcon>
                            <Checkbox edge="start" checked={checkedDevices.indexOf(device.token) !== -1}/>
                        </ListItemIcon>
                        <ListItemText
                            primary={`${device.systemName} ${device.systemVersion} ${device.pusherType}`}>
                        </ListItemText>
                        <ListItemSecondaryAction>
                            <IconButton href="#" edge="end" aria-label="Comments">
                                {device.systemName.toLowerCase() === 'android' ?
                                    <Icon>android</Icon>
                                    :
                                    <Icon>phone_iphone</Icon>
                                }
                            </IconButton>
                        </ListItemSecondaryAction>
                    </ListItem>
                ))
            }
        </List>;
    }

    return devicesList;
};

export default DeviceList;
