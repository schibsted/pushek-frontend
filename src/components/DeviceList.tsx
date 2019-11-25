import React, {FunctionComponent} from 'react';
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import List from "@material-ui/core/List";
import {Device} from "../types/Device";
import Checkbox from "@material-ui/core/Checkbox";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import Icon from "@material-ui/core/Icon";
import {ListItemSecondaryAction, IconButton} from "@material-ui/core";
import Toolbar from "@material-ui/core/Toolbar";

type DeviceListProps = {
    devices: Array<Device>
    checkedDevices: Array<String>
    listItemClick: Function
}

const DeviceList: FunctionComponent<DeviceListProps> = ({devices = [], checkedDevices = [], listItemClick}) => {

    return (
        <List className="Device-list">
            {
                devices.map((device) => (
                    <ListItem button onClick={() => listItemClick(device.token)}>
                        <ListItemIcon>
                            <Checkbox edge="start" checked={checkedDevices.indexOf(device.token) !== -1}/>
                        </ListItemIcon>
                        <ListItemText
                            primary={`${device.systemName} ${device.systemVersion} ${device.pusherType}`}>
                        </ListItemText>
                        <ListItemSecondaryAction>
                            <IconButton edge="end" aria-label="Comments">
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
        </List>
    );
};

export default DeviceList;
